import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { AppComponent } from './app.component';
import { PresenceService } from './core/services/presence.service';
import { YoutubePlayerService } from './core/services/youtube-player.service';
import type { PlayerStateName } from './core/models/player-state.model';
import type { RadioLifecycle } from './core/models/radio-status.model';
import type { Song } from './core/models/song.model';

class YoutubePlayerStub {
  readonly status = signal<RadioLifecycle>('ready');
  readonly errorMessage = signal<string | null>(null);
  readonly playerState = signal<PlayerStateName>('CUED');
  readonly currentSong = signal<Song | null>(null);
  readonly isPlaying = signal(false);
  readonly isShuffleEnabled = signal(false);
  readonly controlsEnabled = signal(true);
  readonly currentTime = signal(0);
  readonly duration = signal(0);
  readonly progressPercent = signal(0);

  initialize(): Promise<void> {
    return Promise.resolve();
  }

  destroy(): void {}
  togglePlayPause(): void {}
  next(): void {}
  previous(): void {}
  setShuffle(_enabled: boolean): void {}
  seekToFraction(_fraction: number): void {}
  switchPlaylist(_playlistId: string): void {}
}

class PresenceStub {
  readonly listeners = signal<number | null>(3);
  start(): void {}
  stop(): void {}
}

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: YoutubePlayerService, useClass: YoutubePlayerStub },
        { provide: PresenceService, useClass: PresenceStub },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render Naati Dhamaka', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('नाटी धमाका');
    expect(compiled.textContent).toContain('सुन रहे हैं');
    expect(compiled.textContent).toContain('अपना संगीत चुनें');
    expect(compiled.textContent).toContain('Choose your music');
    expect(compiled.textContent).toContain('Manish Bhatia');
    expect(compiled.querySelector('app-radio')).toBeTruthy();
  });
});
