import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  OnDestroy,
  viewChild,
} from '@angular/core';
import { PLAYER_ELEMENT_ID, RADIO_COPY } from '../../core/constants/radio.constants';
import type { DistrictId } from '../../core/models/district.model';
import { StationService } from '../../core/services/station.service';
import { YoutubePlayerService } from '../../core/services/youtube-player.service';
import { PahariCapComponent } from '../../shared/components/pahari-cap/pahari-cap.component';
import { NowPlayingComponent } from '../../shared/components/now-playing/now-playing.component';
import { RadioStatusComponent } from '../../shared/components/radio-status/radio-status.component';
import { StationHeaderComponent } from '../../shared/components/station-header/station-header.component';
import { SiteCreditComponent } from '../../shared/components/site-credit/site-credit.component';

@Component({
  selector: 'app-radio',
  imports: [
    StationHeaderComponent,
    PahariCapComponent,
    NowPlayingComponent,
    RadioStatusComponent,
    SiteCreditComponent,
  ],
  templateUrl: './radio.component.html',
  styleUrl: './radio.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioComponent implements OnDestroy {
  private readonly youtube = inject(YoutubePlayerService);
  private readonly station = inject(StationService);
  private readonly playerMount = viewChild.required<ElementRef<HTMLElement>>('playerMount');

  protected readonly copy = RADIO_COPY;
  protected readonly status = this.youtube.status;
  protected readonly errorMessage = this.youtube.errorMessage;
  protected readonly playerState = this.youtube.playerState;
  protected readonly currentSong = this.youtube.currentSong;
  protected readonly isPlaying = this.youtube.isPlaying;
  protected readonly controlsEnabled = this.youtube.controlsEnabled;
  protected readonly currentTime = this.youtube.currentTime;
  protected readonly duration = this.youtube.duration;
  protected readonly progressPercent = this.youtube.progressPercent;
  protected readonly districtId = this.station.selectedId;
  protected readonly districtName = computed(() => this.station.selectedDistrict().nameHi);

  constructor() {
    afterNextRender(() => {
      void this.startRadio();
    });
  }

  ngOnDestroy(): void {
    this.youtube.destroy();
  }

  protected onPlayPause(): void {
    this.youtube.togglePlayPause();
  }

  protected onNext(): void {
    this.youtube.next();
  }

  protected onPrevious(): void {
    this.youtube.previous();
  }

  protected onSeek(fraction: number): void {
    this.youtube.seekToFraction(fraction);
  }

  protected onDistrictSelect(id: DistrictId): void {
    if (id === this.station.selectedId()) {
      return;
    }

    this.station.select(id);
    this.youtube.switchPlaylist(this.station.playlistId());
  }

  protected onRetry(): void {
    void this.startRadio();
  }

  private async startRadio(): Promise<void> {
    const host = this.createPlayerHost();
    await this.youtube.initialize(host, this.station.playlistId());
  }

  private createPlayerHost(): HTMLElement {
    this.youtube.destroy();
    const mount = this.playerMount().nativeElement;
    mount.replaceChildren();

    const host = document.createElement('div');
    host.id = PLAYER_ELEMENT_ID;
    host.className = 'yt-host';
    host.setAttribute('aria-label', this.copy.aria.player);
    mount.appendChild(host);
    return host;
  }
}
