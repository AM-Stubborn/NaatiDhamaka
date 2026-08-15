/**
 * One public YouTube playlist ID per music category.
 *
 * How to replace a value:
 * 1. Open a public YouTube playlist.
 * 2. Copy the `list=` value from the URL.
 *    Example: https://www.youtube.com/playlist?list=PL_WcRynZa15Kh0mC4i9Q6_trX-VC24qek
 *    The ID is: PL_WcRynZa15Kh0mC4i9Q6_trX-VC24qek
 * 3. Paste it below. Private/unlisted playlists often fail in the embedded player.
 *
 * This is the only file you need to edit for category playlists.
 */
export const YOUTUBE_PLAYLISTS = {
  nati: 'PLdq3ql1Yz5Mc',
  'kinnauri-nati': 'PLBO3O7aVpQmQ',
  gidda: 'PLCP8JkGYrAck',
  'jhoori-harul': 'PLVfqVZCtBo04',
  'chamba-folk': 'PLDoZjGiA1Y5c',
  'lahaul-spiti': 'PLWW7vqWgilOc',
  'kangra-folk': 'PLW5SJeWLvrdg',
  'modern-pahadi': 'PLYh8YtgaaDIg',
} as const;
