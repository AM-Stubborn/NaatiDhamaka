# नाटी धमाका

Naati Dhamaka is a one-page web radio for Himachali and Pahadi music.

Open the site, and it tunes into a curated YouTube playlist through the official **YouTube IFrame Player API**. The page is the station. YouTube is only the source of the songs.

The interface is a compact radio bar: cover art, song title, progress, and play controls. The video itself is not the experience. Playback still uses a real YouTube iframe through the official IFrame Player API. There is no audio extraction and no hidden `<audio>` element.

It is a static Angular application. There is no backend, no database, and no audio extraction.

## Install

Requirements:

- Node.js 20.19+ or 22.12+ (Node 24 is fine)
- npm 11+

```bash
npm install
```

## Run locally

```bash
npm start
```

Then open [http://localhost:4200](http://localhost:4200).

## Change category playlists

Each music category has its own playlist ID in **one file**:

`src/environments/youtube-playlists.ts`

Default category is **Nati**. If nothing is selected, Nati plays.

```typescript
export const YOUTUBE_PLAYLISTS = {
  nati: 'YOUR_NATI_PLAYLIST_ID',
  'kinnauri-nati': 'YOUR_KINNAURI_NATI_PLAYLIST_ID',
  gidda: 'YOUR_GIDDA_PLAYLIST_ID',
  gaddi: 'YOUR_GADDI_PLAYLIST_ID',
  'jhoori-harul': 'YOUR_JHOORI_HARUL_PLAYLIST_ID',
  'chamba-folk': 'YOUR_CHAMBA_FOLK_PLAYLIST_ID',
  'lahaul-spiti': 'YOUR_LAHAUL_SPITI_PLAYLIST_ID',
  'kangra-folk': 'YOUR_KANGRA_FOLK_PLAYLIST_ID',
  'modern-pahadi': 'YOUR_MODERN_PAHADI_PLAYLIST_ID',
};
```

How to find a playlist ID:

1. Open a public YouTube playlist.
2. Copy the `list=` value from the URL.
3. Example: `https://www.youtube.com/playlist?list=PL_WcRynZa15Kh0mC4i9Q6_trX-VC24qek`
4. The ID is `PL_WcRynZa15Kh0mC4i9Q6_trX-VC24qek`.

The playlist must be **public**. Private or unlisted playlists often fail in an embedded player.

## How the YouTube IFrame API works here

The app loads `https://www.youtube.com/iframe_api` in the browser and creates a real YouTube player iframe.

`YoutubePlayerService` is the only place that talks to that API. The UI asks the service to play, pause, skip, or shuffle.

The service uses the player to:

- load the configured playlist
- play / pause
- previous / next
- enable or disable shuffle
- loop the playlist so the station keeps going
- read player state and current video metadata when the API exposes it

This implementation does **not**:

- download YouTube videos
- extract MP3 or audio
- proxy audio through a backend
- scrape YouTube
- bypass ads
- hide the YouTube player

If a browser blocks autoplay, the station shows **Ready to play** and waits for the first Play tap. That is expected.

## Build for production

```bash
npm run build
```

The static site is written to:

```text
dist/naati-dhamaka/browser
```

Upload that folder to any static host.

## Deploy to GitHub Pages

This repository is named `NaatiDhamaka`, so project Pages usually live at:

```text
https://<user>.github.io/NaatiDhamaka/
```

Build with that base href:

```bash
npm run build:github-pages
```

Then publish the contents of `dist/naati-dhamaka/browser`.

A `.nojekyll` file is included in `public/` so GitHub Pages does not skip files that start with an underscore.

If you use user/organization Pages (`https://<user>.github.io/`), build with the default `/` base href instead:

```bash
npm run build
```

## Other static hosts

The same `dist/naati-dhamaka/browser` folder works on:

- Azure Static Web Apps
- Cloudflare Pages
- Netlify
- Vercel

Set the build command to `npm run build` and the output directory to `dist/naati-dhamaka/browser`.

## Important YouTube player considerations

- Use a **public** playlist.
- The YouTube iframe must stay visible. Do not replace it with a hidden `<audio>` element.
- Some videos cannot be embedded. The radio skips those and continues.
- Autoplay is often blocked until the listener presses Play.
- Ads, related-video rules, and branding are controlled by YouTube.
- `origin` is set to the current site origin, which the IFrame API expects.
- Changing hosts (for example localhost vs GitHub Pages) does not require a YouTube Data API key for this MVP.

## Project layout

```text
src/
├── app/
│   ├── core/
│   │   ├── constants/
│   │   ├── models/
│   │   └── services/youtube-player.service.ts
│   ├── features/radio/
│   ├── shared/components/
│   ├── app.component.ts
│   └── app.config.ts
├── environments/
└── styles.scss
```

The architecture leaves room for later extras (more stations, favorites, PWA) without including them in this MVP.
