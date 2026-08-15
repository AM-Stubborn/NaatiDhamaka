import { computed, Injectable, signal } from '@angular/core';
import { playlistForCategory } from '../config/playlists';
import {
  DEFAULT_CATEGORY_ID,
  getCategory,
  type CategoryId,
} from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class StationService {
  readonly selectedId = signal<CategoryId>(DEFAULT_CATEGORY_ID);
  readonly selectedCategory = computed(() => getCategory(this.selectedId()));
  readonly playlistId = computed((): string => playlistForCategory(this.selectedId()));

  select(id: CategoryId): void {
    this.selectedId.set(id);
  }
}
