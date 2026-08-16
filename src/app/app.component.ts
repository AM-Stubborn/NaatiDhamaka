import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RADIO_COPY } from './core/constants/radio.constants';
import { RadioComponent } from './features/radio/radio.component';
import { ValleyMotionComponent } from './shared/components/valley-motion/valley-motion.component';

@Component({
  selector: 'app-root',
  imports: [RadioComponent, ValleyMotionComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  protected readonly copy = RADIO_COPY;
}
