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
  nati: 'PL_WcRynZa15Kh0mC4i9Q6_trX-VC24qek',
  'kinnauri-nati': 'PLPWPDkqfbd_PpLIOo3eKq8mkLQZTQQy7w',
  gidda: 'PLyVAuignrcO36IhIV-2_553xSj9E0mpK6',
  gaddi: 'PLThGHzsmxd54lYtQPZQwxXcC5mfvoiPhH',
  'jhoori-harul': 'PLChJqa4iCvlUN9d_ke6NVazP7nyLkw0wI',
  'chamba-folk': 'PLPWPDkqfbd_NM5UEJU0d6BfDZNXz80GrC',
  'lahaul-spiti': 'PLPWPDkqfbd_Nc5XnEqPik5DA814noS4Na',
  'kangra-folk': 'PL-zrhlrxWE7eRD-HkosilPW2Jirw5c_51',
  'modern-pahadi': 'PLUEviuH1fxeDj1ki4Q794UV-WKcoHR42A',
} as const;
