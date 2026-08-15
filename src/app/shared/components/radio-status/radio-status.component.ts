import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RADIO_COPY, RADIO_STATION } from '../../../core/constants/radio.constants';
import type { RadioLifecycle } from '../../../core/models/radio-status.model';

@Component({
  selector: 'app-radio-status',
  templateUrl: './radio-status.component.html',
  styleUrl: './radio-status.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioStatusComponent {
  readonly status = input.required<RadioLifecycle>();
  readonly message = input<string | null>(null);

  readonly retry = output<void>();

  protected readonly copy = RADIO_COPY;
  protected readonly station = RADIO_STATION;

  protected lines(value: string | null): string[] {
    return (value ?? '').split('\n').filter(Boolean);
  }
}
