import { HIMACHAL_DISTRICTS } from '../models/district.model';
import { playlistForDistrict } from './playlists';
import { YOUTUBE_PLAYLISTS } from '../../../environments/youtube-playlists';

describe('district playlists', () => {
  it('has a unique playlist ID for every district', () => {
    const ids = HIMACHAL_DISTRICTS.map((district) => playlistForDistrict(district.id));
    expect(new Set(ids).size).toBe(HIMACHAL_DISTRICTS.length);
  });

  it('keeps Shimla on the known public playlist', () => {
    expect(YOUTUBE_PLAYLISTS.shimla).toBe('PL_WcRynZa15Kh0mC4i9Q6_trX-VC24qek');
  });
});
