export interface Song {
  videoId: string;
  title: string;
  artist: string;
  index: number;
}

const FALLBACK_TITLE = 'नाटी धमाका';
const FALLBACK_ARTIST = 'Himachali Music';

export function songFromPlayerData(
  videoId: string | null,
  title: string | undefined,
  artist: string | undefined,
  index: number,
): Song {
  return {
    videoId: videoId ?? '',
    title: title?.trim() || FALLBACK_TITLE,
    artist: artist?.trim() || FALLBACK_ARTIST,
    index,
  };
}

export function youtubeCoverUrl(videoId: string | null | undefined): string | null {
  if (!videoId) {
    return null;
  }

  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

export function formatTrackTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return '0:00';
  }

  const total = Math.floor(seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const rest = total % 60;
  const padded = rest.toString().padStart(2, '0');

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${padded}`;
  }

  return `${minutes}:${padded}`;
}

export function videoIdFromWatchUrl(url: string | undefined): string | null {
  if (!url) {
    return null;
  }

  try {
    const parsed = new URL(url);
    const fromQuery = parsed.searchParams.get('v');
    if (fromQuery) {
      return fromQuery;
    }

    const segments = parsed.pathname.split('/').filter(Boolean);
    const embedIndex = segments.indexOf('embed');
    if (embedIndex >= 0 && segments[embedIndex + 1]) {
      return segments[embedIndex + 1];
    }

    const shortsIndex = segments.indexOf('shorts');
    if (shortsIndex >= 0 && segments[shortsIndex + 1]) {
      return segments[shortsIndex + 1];
    }
  } catch {
    return null;
  }

  return null;
}
