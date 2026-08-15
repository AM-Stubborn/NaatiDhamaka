import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { RADIO_COPY } from '../../../core/constants/radio.constants';
import {
  CAP_GEOMETRY,
  districtLabelAnchor,
  districtSlicePath,
  districtWedgeLabel,
  getDistrict,
  HIMACHAL_DISTRICTS,
  type DistrictId,
} from '../../../core/models/district.model';

@Component({
  selector: 'app-pahari-cap',
  templateUrl: './pahari-cap.component.html',
  styleUrl: './pahari-cap.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PahariCapComponent {
  readonly selectedId = input.required<DistrictId>();
  readonly districtSelect = output<DistrictId>();

  protected readonly copy = RADIO_COPY;
  protected readonly viewBox = [
    CAP_GEOMETRY.paddedMin,
    CAP_GEOMETRY.paddedMin,
    CAP_GEOMETRY.paddedSize,
    CAP_GEOMETRY.paddedSize,
  ].join(' ');
  protected readonly slices = HIMACHAL_DISTRICTS.map((district, index) => {
    const labelLines = districtWedgeLabel(district);
    return {
      ...district,
      path: districtSlicePath(index),
      label: districtLabelAnchor(index),
      labelLines,
      isLong: labelLines.length > 1 || labelLines[0].length > 5,
    };
  });
  protected readonly hoveredId = signal<DistrictId | null>(null);

  protected readonly displayed = computed(() => {
    const hovered = this.hoveredId();
    return getDistrict(hovered ?? this.selectedId());
  });

  protected isSelected(id: DistrictId): boolean {
    return this.selectedId() === id;
  }

  protected isHovered(id: DistrictId): boolean {
    return this.hoveredId() === id;
  }

  protected onSelect(id: DistrictId, event?: Event): void {
    this.districtSelect.emit(id);
    if (event?.currentTarget instanceof SVGElement) {
      event.currentTarget.blur();
    }
  }

  protected onKey(event: KeyboardEvent, id: DistrictId): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onSelect(id);
    }
  }
}
