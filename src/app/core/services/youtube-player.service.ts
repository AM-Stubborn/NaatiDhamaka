import { computed, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  MAX_UNAVAILABLE_SKIPS,
  PLAYER_ELEMENT_ID,
  PLAYER_TIMING,
  RADIO_COPY,
  YOUTUBE_API_SCRIPT_ID,
  YOUTUBE_IFRAME_API_SRC,
} from '../constants/radio.constants';
import {
  toPlayerStateName,
  YOUTUBE_ERROR,
  type PlayerStateName,
} from '../models/player-state.model';
import type { RadioLifecycle } from '../models/radio-status.model';
import { songFromPlayerData, videoIdFromWatchUrl, type Song } from '../models/song.model';

@Injectable({ providedIn: 'root' })
export class YoutubePlayerService {
  private player: YT.Player | null = null;
  private playlistId: string = environment.youtube.playlists.nati;
  private destroyed = false;
  private playRequested = false;
  private playerReady = false;
  private awaitingPlaylistCue = false;
  private playlistEpoch = 0;
  private unavailableSkips = 0;
  private pendingTimeouts = new Set<number>();

  readonly status = signal<RadioLifecycle>('loading');
  readonly errorMessage = signal<string | null>(null);
  readonly playerState = signal<PlayerStateName>('UNSTARTED');
  readonly currentSong = signal<Song | null>(null);
  readonly currentIndex = signal(-1);
  readonly currentTime = signal(0);
  readonly duration = signal(0);
  readonly isShuffleEnabled = signal(true);
  readonly autoplayBlocked = signal(false);

  readonly isPlaying = computed(() => this.playerState() === 'PLAYING');
  readonly isPaused = computed(() => this.playerState() === 'PAUSED');
  readonly isBuffering = computed(() => this.playerState() === 'BUFFERING');
  readonly progressPercent = computed(() => {
    const duration = this.duration();
    if (duration <= 0) {
      return 0;
    }
    return Math.min(100, Math.max(0, (this.currentTime() / duration) * 100));
  });
  readonly controlsEnabled = computed(() => this.status() === 'ready');

  private progressTimer: number | null = null;

  async initialize(
    container: HTMLElement,
    playlistId: string = environment.youtube.playlists.nati,
  ): Promise<void> {
    this.playlistId = playlistId;
    this.destroyed = false;
    this.playRequested = false;
    this.playerReady = false;
    this.awaitingPlaylistCue = false;
    this.unavailableSkips = 0;
    this.status.set('loading');
    this.errorMessage.set(null);
    this.autoplayBlocked.set(false);
    this.currentSong.set(null);
    this.currentIndex.set(-1);
    this.currentTime.set(0);
    this.duration.set(0);
    this.playerState.set('UNSTARTED');
    this.stopProgressClock();

    try {
      await this.loadIframeApi();
      if (this.destroyed) {
        return;
      }
      await this.createPlayer(container);
    } catch (error) {
      this.logDev('YouTube player initialization failed', error);
      this.fail(RADIO_COPY.errors.apiFailed);
    }
  }

  play(): void {
    this.playRequested = true;
    if (!this.player || this.awaitingPlaylistCue) {
      return;
    }
    this.enableShuffle();
    this.player.playVideo();
  }

  pause(): void {
    this.player?.pauseVideo();
  }

  togglePlayPause(): void {
    if (this.isPlaying()) {
      this.pause();
      return;
    }
    this.play();
  }

  next(): void {
    this.player?.nextVideo();
  }

  previous(): void {
    this.player?.previousVideo();
  }

  setShuffle(_enabled = true): void {
    this.enableShuffle();
  }

  seekToFraction(fraction: number): void {
    const duration = this.duration();
    if (!this.player || duration <= 0) {
      return;
    }

    const seconds = Math.min(duration, Math.max(0, fraction * duration));
    this.player.seekTo(seconds, true);
    this.currentTime.set(seconds);
  }

  switchPlaylist(playlistId: string): void {
    this.playlistId = playlistId;
    this.playRequested = true;
    this.unavailableSkips = 0;
    this.currentSong.set(null);
    this.currentIndex.set(-1);
    this.currentTime.set(0);
    this.duration.set(0);
    this.stopProgressClock();
    this.beginPlaylistCue();

    if (!this.playerReady) {
      return;
    }

    this.cueConfiguredPlaylist();
  }

  getPlayerState(): PlayerStateName {
    if (!this.player) {
      return this.playerState();
    }
    return toPlayerStateName(this.player.getPlayerState());
  }

  getCurrentVideoId(): string | null {
    return this.currentSong()?.videoId || this.readVideoId();
  }

  getCurrentVideoIndex(): number {
    if (!this.player) {
      return this.currentIndex();
    }
    const index = this.player.getPlaylistIndex();
    return Number.isFinite(index) ? index : this.currentIndex();
  }

  destroy(): void {
    this.destroyed = true;
    this.playerReady = false;
    this.awaitingPlaylistCue = false;
    this.stopProgressClock();
    this.clearTimeouts();
    try {
      this.player?.destroy();
    } catch (error) {
      this.logDev('Player destroy encountered an issue', error);
    }
    this.player = null;
  }

  private async loadIframeApi(): Promise<void> {
    if (window.YT?.Player) {
      return;
    }

    return new Promise<void>((resolve, reject) => {
      let settled = false;
      let pollId = 0;

      const timeoutId = this.scheduleTimeout(() => {
        settle(() => reject(new Error('YouTube IFrame API timed out')));
      }, PLAYER_TIMING.apiLoadTimeoutMs);

      const settle = (action: () => void): void => {
        if (settled) {
          return;
        }
        settled = true;
        this.clearTimeout(timeoutId);
        window.clearInterval(pollId);
        this.pendingTimeouts.delete(pollId);
        action();
      };

      const finish = (): void => {
        if (window.YT?.Player) {
          settle(() => resolve());
          return;
        }
        settle(() => reject(new Error('YouTube IFrame API loaded without a Player constructor')));
      };

      const previousReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previousReady?.();
        finish();
      };

      if (!document.getElementById(YOUTUBE_API_SCRIPT_ID)) {
        const script = document.createElement('script');
        script.id = YOUTUBE_API_SCRIPT_ID;
        script.src = YOUTUBE_IFRAME_API_SRC;
        script.async = true;
        script.onerror = () => {
          settle(() => reject(new Error('YouTube IFrame API failed to load')));
        };
        document.head.appendChild(script);
      }

      pollId = window.setInterval(() => {
        if (window.YT?.Player) {
          finish();
        }
      }, 50);
      this.pendingTimeouts.add(pollId);
    });
  }

  private createPlayer(container: HTMLElement): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const timeoutId = this.scheduleTimeout(() => {
        reject(new Error('YouTube player initialization timed out'));
      }, PLAYER_TIMING.initTimeoutMs);

      try {
        this.player = new YT.Player(container, {
          width: '100%',
          height: '100%',
          playerVars: {
            listType: 'playlist',
            list: this.playlistId,
            autoplay: 0,
            controls: 0,
            rel: 0,
            playsinline: 1,
            modestbranding: 1,
            origin: window.location.origin,
            enablejsapi: 1,
            iv_load_policy: 3,
            fs: 0,
            disablekb: 1,
          },
          events: {
            onReady: (event) => {
              this.clearTimeout(timeoutId);
              this.onReady(event.target);
              resolve();
            },
            onStateChange: (event) => this.onStateChange(event),
            onError: (event) => this.onError(event),
          },
        });
      } catch (error) {
        this.clearTimeout(timeoutId);
        reject(error);
      }
    });
  }

  private onReady(player: YT.Player): void {
    if (this.destroyed) {
      return;
    }

    this.player = player;
    this.playerReady = true;
    this.logDev('YouTube player ready', { playlistId: this.playlistId });
    this.beginPlaylistCue();
    this.cueConfiguredPlaylist();
  }

  private onStateChange(event: YT.OnStateChangeEvent): void {
    if (this.destroyed) {
      return;
    }

    const state = toPlayerStateName(event.data);
    this.playerState.set(state);

    if (this.awaitingPlaylistCue) {
      if (state === 'CUED' || state === 'PLAYING') {
        const epoch = this.playlistEpoch;
        this.scheduleTimeout(() => {
          if (epoch !== this.playlistEpoch) {
            return;
          }
          this.finishPlaylistCue();
        }, PLAYER_TIMING.playlistCueMs);
      }
      this.logDev(`Player state: ${state} (waiting for playlist)`);
      return;
    }

    this.syncFromPlayer();

    if (state === 'PLAYING') {
      if (!this.playRequested) {
        this.pause();
        this.status.set('ready');
        return;
      }
      this.unavailableSkips = 0;
      this.autoplayBlocked.set(false);
      this.status.set('ready');
      this.startProgressClock();
    } else if (state === 'BUFFERING') {
      this.syncProgress();
      if (this.playRequested) {
        this.startProgressClock();
      }
    } else {
      this.stopProgressClock();
      this.syncProgress();
    }

    if (state === 'ENDED') {
      this.currentTime.set(this.duration());
      this.logDev('Track ended; playlist loop is enabled');
    }

    this.logDev(`Player state: ${state}`);
  }

  private onError(event: YT.OnErrorEvent): void {
    if (this.destroyed) {
      return;
    }

    const code = event.data;
    this.logDev('YouTube player error', code);

    if (
      code === YOUTUBE_ERROR.VIDEO_NOT_FOUND ||
      code === YOUTUBE_ERROR.EMBED_NOT_ALLOWED ||
      code === YOUTUBE_ERROR.EMBED_NOT_ALLOWED_ALT
    ) {
      this.unavailableSkips += 1;
      if (this.unavailableSkips <= MAX_UNAVAILABLE_SKIPS) {
        this.logDev('Skipping unavailable video', { skips: this.unavailableSkips });
        this.next();
        return;
      }
      this.fail(RADIO_COPY.errors.unavailable);
      return;
    }

    if (code === YOUTUBE_ERROR.INVALID_PARAMETER) {
      this.fail(RADIO_COPY.errors.playlistFailed);
      return;
    }

    this.fail(RADIO_COPY.errors.playerFailed);
  }

  private beginPlaylistCue(): void {
    this.playlistEpoch += 1;
    this.awaitingPlaylistCue = true;
  }

  private cueConfiguredPlaylist(): void {
    if (!this.player) {
      return;
    }

    const epoch = this.playlistEpoch;
    this.logDev('Cueing playlist', this.playlistId);

    try {
      this.player.setShuffle(false);
    } catch (error) {
      this.logDev('Unable to disable shuffle before playlist change', error);
    }

    try {
      this.player.stopVideo();
    } catch (error) {
      this.logDev('Unable to stop current video before playlist change', error);
    }

    const playlist = {
      listType: 'playlist' as const,
      list: this.playlistId,
      index: 0,
    };

    if (this.playRequested) {
      this.player.loadPlaylist(playlist);
    } else {
      this.player.cuePlaylist(playlist);
    }
    this.player.setLoop(true);

    this.scheduleTimeout(() => {
      if (epoch !== this.playlistEpoch) {
        return;
      }
      this.finishPlaylistCue(true);
    }, PLAYER_TIMING.playlistSwitchFallbackMs);
  }

  private finishPlaylistCue(force = false): void {
    if (this.destroyed || !this.awaitingPlaylistCue) {
      return;
    }

    let playlist: string[] | null | undefined;
    try {
      playlist = this.player?.getPlaylist();
    } catch {
      playlist = null;
    }

    if (!force && !playlist?.length) {
      this.logDev('Waiting for playlist items after cue');
      return;
    }

    this.awaitingPlaylistCue = false;
    this.enableShuffle();
    this.player?.setLoop(true);
    this.syncFromPlayer();

    this.status.set('ready');

    if (this.playRequested) {
      this.player?.playVideo();
      this.startProgressClock();
      return;
    }

    this.player?.pauseVideo();
  }

  private enableShuffle(): void {
    this.isShuffleEnabled.set(true);
    try {
      this.player?.setShuffle(true);
    } catch (error) {
      this.logDev('Unable to enable shuffle', error);
    }
  }

  private syncFromPlayer(): void {
    if (!this.player) {
      return;
    }

    const index = this.player.getPlaylistIndex();
    this.currentIndex.set(Number.isFinite(index) ? index : -1);

    const data = this.safeVideoData();
    const videoId = data?.video_id || this.readVideoId();
    if (!videoId && !data?.title) {
      return;
    }

    this.currentSong.set(
      songFromPlayerData(videoId, data?.title, data?.author, this.currentIndex()),
    );
    this.syncProgress();
  }

  private syncProgress(): void {
    if (!this.player) {
      return;
    }

    try {
      const duration = this.player.getDuration();
      const currentTime = this.player.getCurrentTime();
      this.duration.set(Number.isFinite(duration) ? duration : 0);
      this.currentTime.set(Number.isFinite(currentTime) ? currentTime : 0);
    } catch (error) {
      this.logDev('Unable to read playback time', error);
    }
  }

  private startProgressClock(): void {
    this.stopProgressClock();
    this.syncProgress();
    this.progressTimer = window.setInterval(() => {
      this.syncProgress();
    }, PLAYER_TIMING.progressTickMs);
  }

  private stopProgressClock(): void {
    if (this.progressTimer !== null) {
      window.clearInterval(this.progressTimer);
      this.progressTimer = null;
    }
  }

  private safeVideoData(): YT.VideoData | null {
    try {
      return this.player?.getVideoData() ?? null;
    } catch (error) {
      this.logDev('getVideoData is unavailable', error);
      return null;
    }
  }

  private readVideoId(): string | null {
    try {
      return videoIdFromWatchUrl(this.player?.getVideoUrl());
    } catch {
      return null;
    }
  }

  private fail(message: string): void {
    this.status.set('error');
    this.errorMessage.set(message);
  }

  private scheduleTimeout(callback: () => void, delay: number): number {
    const id = window.setTimeout(() => {
      this.pendingTimeouts.delete(id);
      callback();
    }, delay);
    this.pendingTimeouts.add(id);
    return id;
  }

  private clearTimeout(id: number): void {
    window.clearTimeout(id);
    this.pendingTimeouts.delete(id);
  }

  private clearTimeouts(): void {
    for (const id of this.pendingTimeouts) {
      window.clearTimeout(id);
      window.clearInterval(id);
    }
    this.pendingTimeouts.clear();
  }

  private logDev(message: string, details?: unknown): void {
    if (environment.production) {
      return;
    }
    if (details === undefined) {
      console.info(`[${PLAYER_ELEMENT_ID}] ${message}`);
      return;
    }
    console.info(`[${PLAYER_ELEMENT_ID}] ${message}`, details);
  }
}
