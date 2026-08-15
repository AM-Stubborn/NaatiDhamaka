import { ChangeDetectionStrategy, Component, HostListener, signal } from '@angular/core';
import { RADIO_COPY } from '../../../core/constants/radio.constants';

@Component({
  selector: 'app-site-credit',
  templateUrl: './site-credit.component.html',
  styleUrl: './site-credit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteCreditComponent {
  protected readonly copy = RADIO_COPY;
  protected readonly disclaimerOpen = signal(false);

  protected openDisclaimer(): void {
    this.disclaimerOpen.set(true);
  }

  protected closeDisclaimer(): void {
    this.disclaimerOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.closeDisclaimer();
  }
}
