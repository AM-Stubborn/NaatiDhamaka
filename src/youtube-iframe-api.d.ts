export {};

declare global {
  interface Window {
    YT?: typeof YT;
    onYouTubeIframeAPIReady?: () => void;
  }

  namespace YT {
    enum PlayerState {
      UNSTARTED = -1,
      ENDED = 0,
      PLAYING = 1,
      PAUSED = 2,
      BUFFERING = 3,
      CUED = 5,
    }

    interface PlayerVars {
      autoplay?: 0 | 1;
      controls?: 0 | 1 | 2;
      enablejsapi?: 0 | 1;
      fs?: 0 | 1;
      disablekb?: 0 | 1;
      iv_load_policy?: 1 | 3;
      list?: string;
      listType?: 'playlist' | 'user_uploads';
      modestbranding?: 0 | 1;
      origin?: string;
      playsinline?: 0 | 1;
      rel?: 0 | 1;
    }

    interface PlayerOptions {
      width?: string | number;
      height?: string | number;
      videoId?: string;
      playerVars?: PlayerVars;
      events?: Events;
    }

    interface Events {
      onReady?: (event: PlayerEvent) => void;
      onStateChange?: (event: OnStateChangeEvent) => void;
      onError?: (event: OnErrorEvent) => void;
    }

    interface PlayerEvent {
      target: Player;
    }

    interface OnStateChangeEvent extends PlayerEvent {
      data: PlayerState;
    }

    interface OnErrorEvent extends PlayerEvent {
      data: number;
    }

    interface CuePlaylistOptions {
      listType: 'playlist' | 'user_uploads';
      list: string;
      index?: number;
      startSeconds?: number;
    }

    interface VideoData {
      video_id?: string;
      title?: string;
      author?: string;
    }

    class Player {
      constructor(source: string | HTMLElement, options?: PlayerOptions);
      playVideo(): void;
      pauseVideo(): void;
      nextVideo(): void;
      previousVideo(): void;
      setShuffle(shufflePlaylist: boolean): void;
      setLoop(loopPlaylists: boolean): void;
      cuePlaylist(options: CuePlaylistOptions | string[]): void;
      loadPlaylist(options: CuePlaylistOptions | string[]): void;
      getPlayerState(): PlayerState;
      getPlaylist(): string[] | null | undefined;
      getPlaylistIndex(): number;
      getVideoUrl(): string;
      getVideoData(): VideoData;
      getCurrentTime(): number;
      getDuration(): number;
      seekTo(seconds: number, allowSeekAhead: boolean): void;
      destroy(): void;
    }
  }
}
