import { MUSIC_CATEGORIES } from '../models/category.model';
import { playlistForCategory } from './playlists';
import { YOUTUBE_PLAYLISTS } from '../../../environments/youtube-playlists';

describe('category playlists', () => {
  it('has a unique playlist ID for every category', () => {
    const ids = MUSIC_CATEGORIES.map((category) => playlistForCategory(category.id));
    expect(new Set(ids).size).toBe(MUSIC_CATEGORIES.length);
  });

  it('keeps Nati on a public playlist ID', () => {
    expect(YOUTUBE_PLAYLISTS.nati).toMatch(/^PL/);
  });

  it('keeps Gidda and does not include Gaddi', () => {
    expect(YOUTUBE_PLAYLISTS.gidda).toMatch(/^PL/);
    expect('gaddi' in YOUTUBE_PLAYLISTS).toBe(false);
  });
});
