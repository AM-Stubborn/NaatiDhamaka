export const RADIO_STATION = {
  id: 'naati-dhamaka',
  productName: 'Naati Dhamaka',
  name: 'नाटी धमाका',
  displayName: 'नाटी धमाका',
  tagline: '',
  region: 'Himachal Pradesh',
} as const;

export const RADIO_COPY = {
  nowPlaying: 'Now Playing',
  loading: 'पहाड़ों में ट्यून हो रहा है...',
  autoplayTitle: 'Ready to play',
  autoplayHint: 'Press play to start the radio',
  footerTitle: '',
  footerSubtitle: '',
  retry: 'Try again',
  mapLabel: 'Himachali music cap',
  chooseCategory: 'अपना संगीत चुनें',
  chooseCategoryEn: 'Choose your music',
  listening: 'सुन रहे हैं',
  byline: 'by',
  makerName: 'Manish Bhatia',
  makerUrl: 'https://am-stubborn.github.io/BlogWithCodes_Portfolio-BlogSite/',
  disclaimerTitle: 'Disclaimer',
  disclaimerBody:
    'नाटी धमाका is a non-profit website created just as a music lover. It is not a commercial radio station and does not earn from this page.',
  errors: {
    apiFailed: 'Unable to tune in right now.\nPlease check your internet connection and try again.',
    playlistFailed: 'This station could not load its playlist right now.\nPlease try again in a moment.',
    playerFailed: 'The radio could not start.\nPlease refresh the page and try again.',
    unavailable: 'This song is unavailable.\nSkipping ahead to keep the radio playing.',
  },
  aria: {
    skipToRadio: 'Skip to radio controls',
    play: 'Play',
    pause: 'Pause',
    previous: 'Previous song',
    next: 'Next song',
    player: 'YouTube radio player',
    retry: 'Try tuning in again',
    coverPlay: 'Play from cover art',
    progress: 'Track progress',
    selectCategory: 'Select music',
    makerSite: "Open Manish Bhatia's website",
    openDisclaimer: 'Open disclaimer',
    closeDisclaimer: 'Close disclaimer',
  },
} as const;

export const YOUTUBE_IFRAME_API_SRC = 'https://www.youtube.com/iframe_api';
export const YOUTUBE_API_SCRIPT_ID = 'youtube-iframe-api';
export const PLAYER_ELEMENT_ID = 'naati-dhamaka-player';

export const PLAYER_TIMING = {
  apiLoadTimeoutMs: 15000,
  initTimeoutMs: 20000,
  metadataSyncMs: 400,
  progressTickMs: 250,
  playlistCueMs: 80,
  playlistSwitchFallbackMs: 2000,
} as const;

export const MAX_UNAVAILABLE_SKIPS = 8;

export const PRESENCE = {
  endpoint: 'https://counterapi.com/api/naati-dhamaka/listen/site',
  timeline: '15m',
  heartbeatMs: 120_000,
} as const;

export function presenceCountUrl(readOnly = false): string {
  const params = new URLSearchParams({
    unique: 'true',
    timeline: PRESENCE.timeline,
  });

  if (readOnly) {
    params.set('readOnly', 'true');
  }

  return `${PRESENCE.endpoint}?${params.toString()}`;
}
