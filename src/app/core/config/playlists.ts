import { environment } from '../../../environments/environment';
import { DEFAULT_DISTRICT_ID, type DistrictId } from '../models/district.model';

export function playlistForDistrict(id: DistrictId): string {
  return environment.youtube.playlists[id] ?? environment.youtube.playlists[DEFAULT_DISTRICT_ID];
}
