import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RADIO_COPY } from './core/constants/radio.constants';
import { RadioComponent } from './features/radio/radio.component';

@Component({
  selector: 'app-root',
  imports: [RadioComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  protected readonly copy = RADIO_COPY;
}
