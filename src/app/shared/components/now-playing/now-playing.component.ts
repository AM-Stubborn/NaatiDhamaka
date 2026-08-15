import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RADIO_COPY, RADIO_STATION } from '../../../core/constants/radio.constants';
import type { PlayerStateName } from '../../../core/models/player-state.model';
import {
  formatTrackTime,
  youtubeCoverUrl,
  type Song,
} from '../../../core/models/song.model';
import { PlayerControlsComponent } from '../player-controls/player-controls.component';

@Component({
  selector: 'app-now-playing',
  imports: [PlayerControlsComponent],
  templateUrl: './now-playing.component.html',
  styleUrl: './now-playing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NowPlayingComponent {
  readonly song = input<Song | null>(null);
  readonly playerState = input<PlayerStateName>('UNSTARTED');
  readonly isPlaying = input(false);
  readonly disabled = input(false);
  readonly currentTime = input(0);
  readonly duration = input(0);
  readonly progressPercent = input(0);
  readonly categoryName = input('नाटी');

  readonly playPause = output<void>();
  readonly next = output<void>();
  readonly previous = output<void>();
  readonly seekFraction = output<number>();

  protected readonly copy = RADIO_COPY;
  protected readonly station = RADIO_STATION;
  protected readonly coverUrl = computed(() => youtubeCoverUrl(this.song()?.videoId));
  protected readonly elapsedLabel = computed(() => formatTrackTime(this.currentTime()));
  protected readonly durationLabel = computed(() => formatTrackTime(this.duration()));

  protected stateLabel(): string {
    switch (this.playerState()) {
      case 'PLAYING':
        return 'On air';
      case 'PAUSED':
        return 'Paused';
      case 'BUFFERING':
        return 'Tuning';
      default:
        return this.categoryName();
    }
  }

  protected onSeekClick(event: MouseEvent): void {
    if (this.disabled()) {
      return;
    }

    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    if (rect.width <= 0) {
      return;
    }
    this.seekFraction.emit((event.clientX - rect.left) / rect.width);
  }

  protected onSeekKey(event: KeyboardEvent): void {
    if (this.disabled()) {
      return;
    }

    const duration = this.duration();
    if (duration <= 0) {
      return;
    }

    let nextTime = this.currentTime();
    if (event.key === 'ArrowRight') {
      nextTime += 5;
    } else if (event.key === 'ArrowLeft') {
      nextTime -= 5;
    } else if (event.key === 'Home') {
      nextTime = 0;
    } else if (event.key === 'End') {
      nextTime = duration;
    } else {
      return;
    }

    event.preventDefault();
    this.seekFraction.emit(Math.min(1, Math.max(0, nextTime / duration)));
  }
}
