import { computed, Injectable, signal } from '@angular/core';
import { playlistForDistrict } from '../config/playlists';
import {
  DEFAULT_DISTRICT_ID,
  getDistrict,
  type DistrictId,
} from '../models/district.model';

@Injectable({ providedIn: 'root' })
export class StationService {
  readonly selectedId = signal<DistrictId>(DEFAULT_DISTRICT_ID);
  readonly selectedDistrict = computed(() => getDistrict(this.selectedId()));
  readonly playlistId = computed((): string => playlistForDistrict(this.selectedId()));

  select(id: DistrictId): void {
    this.selectedId.set(id);
  }
}
