import { MUSIC_CATEGORIES } from '../models/category.model';
import { playlistForCategory } from './playlists';
import { YOUTUBE_PLAYLISTS } from '../../../environments/youtube-playlists';

describe('category playlists', () => {
  it('has a unique playlist ID for every category', () => {
    const ids = MUSIC_CATEGORIES.map((category) => playlistForCategory(category.id));
    expect(new Set(ids).size).toBe(MUSIC_CATEGORIES.length);
  });

  it('keeps Nati on the known public playlist', () => {
    expect(YOUTUBE_PLAYLISTS.nati).toBe('PL_WcRynZa15Kh0mC4i9Q6_trX-VC24qek');
  });
});
