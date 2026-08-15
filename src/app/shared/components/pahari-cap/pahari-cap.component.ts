import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { RADIO_COPY } from '../../../core/constants/radio.constants';
import {
  CAP_GEOMETRY,
  categoryLabelAnchor,
  categorySlicePath,
  categoryWedgeLabel,
  getCategory,
  MUSIC_CATEGORIES,
  type CategoryId,
} from '../../../core/models/category.model';

@Component({
  selector: 'app-pahari-cap',
  templateUrl: './pahari-cap.component.html',
  styleUrl: './pahari-cap.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PahariCapComponent {
  readonly selectedId = input.required<CategoryId>();
  readonly categorySelect = output<CategoryId>();

  protected readonly copy = RADIO_COPY;
  protected readonly viewBox = [
    CAP_GEOMETRY.paddedMin,
    CAP_GEOMETRY.paddedMin,
    CAP_GEOMETRY.paddedSize,
    CAP_GEOMETRY.paddedSize,
  ].join(' ');
  protected readonly slices = MUSIC_CATEGORIES.map((category, index) => {
    const labelLines = categoryWedgeLabel(category);
    return {
      ...category,
      path: categorySlicePath(index),
      label: categoryLabelAnchor(index),
      labelLines,
      isLong: labelLines.some((line) => line.length > 5),
    };
  });
  protected readonly hoveredId = signal<CategoryId | null>(null);

  protected readonly displayed = computed(() => {
    const hovered = this.hoveredId();
    return getCategory(hovered ?? this.selectedId());
  });

  protected isSelected(id: CategoryId): boolean {
    return this.selectedId() === id;
  }

  protected isHovered(id: CategoryId): boolean {
    return this.hoveredId() === id;
  }

  protected onSelect(id: CategoryId, event?: Event): void {
    this.categorySelect.emit(id);
    if (event?.currentTarget instanceof SVGElement) {
      event.currentTarget.blur();
    }
  }

  protected onKey(event: KeyboardEvent, id: CategoryId): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onSelect(id);
    }
  }
}
