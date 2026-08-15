import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RADIO_COPY } from '../../../core/constants/radio.constants';

@Component({
  selector: 'app-player-controls',
  templateUrl: './player-controls.component.html',
  styleUrl: './player-controls.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerControlsComponent {
  readonly isPlaying = input(false);
  readonly disabled = input(false);

  readonly playPause = output<void>();
  readonly next = output<void>();
  readonly previous = output<void>();

  protected readonly copy = RADIO_COPY;
}
