import { afterNextRender, ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RADIO_COPY, RADIO_STATION } from '../../../core/constants/radio.constants';
import { PresenceService } from '../../../core/services/presence.service';

@Component({
  selector: 'app-station-header',
  templateUrl: './station-header.component.html',
  styleUrl: './station-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StationHeaderComponent {
  private readonly presence = inject(PresenceService);

  protected readonly station = RADIO_STATION;
  protected readonly copy = RADIO_COPY;
  protected readonly listeners = this.presence.listeners;

  constructor() {
    afterNextRender(() => this.presence.start());
  }
}
