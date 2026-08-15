import { environment } from '../../../environments/environment';
import { DEFAULT_CATEGORY_ID, type CategoryId } from '../models/category.model';

export function playlistForCategory(id: CategoryId): string {
  return environment.youtube.playlists[id] ?? environment.youtube.playlists[DEFAULT_CATEGORY_ID];
}
