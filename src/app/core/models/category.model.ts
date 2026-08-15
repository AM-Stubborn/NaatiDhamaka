export type CategoryId =
  | 'nati'
  | 'kinnauri-nati'
  | 'gidda'
  | 'jhoori-harul'
  | 'chamba-folk'
  | 'lahaul-spiti'
  | 'kangra-folk'
  | 'modern-pahadi';

export interface Category {
  id: CategoryId;
  nameEn: string;
  nameHi: string;
}

export const DEFAULT_CATEGORY_ID: CategoryId = 'nati';

export const MUSIC_CATEGORIES: readonly Category[] = [
  { id: 'nati', nameEn: 'Nati', nameHi: 'नाटी' },
  { id: 'kinnauri-nati', nameEn: 'Kinnauri Nati', nameHi: 'किन्नौरी नाटी' },
  { id: 'gidda', nameEn: 'Gidda', nameHi: 'गिद्दा' },
  { id: 'jhoori-harul', nameEn: 'Jhoori / Harul', nameHi: 'झूरी / हारुल' },
  { id: 'chamba-folk', nameEn: 'Chamba Folk', nameHi: 'चम्बा लोक' },
  { id: 'lahaul-spiti', nameEn: 'Lahaul & Spiti', nameHi: 'लाहौल-स्पीति' },
  { id: 'kangra-folk', nameEn: 'Kangra Folk', nameHi: 'कांगड़ा लोक' },
  { id: 'modern-pahadi', nameEn: 'Modern Pahadi', nameHi: 'मॉडर्न पहाड़ी' },
] as const;

export const CAP_GEOMETRY = {
  viewBox: 320,
  cx: 160,
  cy: 160,
  innerRadius: 64,
  outerRadius: 118,
  labelRadius: 91,
  paddedMin: 0,
  paddedSize: 320,
} as const;

export function getCategory(id: CategoryId): Category {
  const category = MUSIC_CATEGORIES.find((item) => item.id === id);
  return category ?? MUSIC_CATEGORIES.find((item) => item.id === DEFAULT_CATEGORY_ID)!;
}

export function categorySlicePath(index: number, total = MUSIC_CATEGORIES.length): string {
  const { cx, cy, innerRadius, outerRadius } = CAP_GEOMETRY;
  const start = (index / total) * Math.PI * 2 - Math.PI / 2;
  const end = ((index + 1) / total) * Math.PI * 2 - Math.PI / 2;
  const startOuter = polar(cx, cy, outerRadius, start);
  const endOuter = polar(cx, cy, outerRadius, end);
  const startInner = polar(cx, cy, innerRadius, start);
  const endInner = polar(cx, cy, innerRadius, end);

  return [
    `M ${startOuter.x} ${startOuter.y}`,
    `A ${outerRadius} ${outerRadius} 0 0 1 ${endOuter.x} ${endOuter.y}`,
    `L ${endInner.x} ${endInner.y}`,
    `A ${innerRadius} ${innerRadius} 0 0 0 ${startInner.x} ${startInner.y}`,
    'Z',
  ].join(' ');
}

export function categoryLabelAnchor(
  index: number,
  total = MUSIC_CATEGORIES.length,
  radius: number = CAP_GEOMETRY.labelRadius,
): { x: number; y: number } {
  const { cx, cy } = CAP_GEOMETRY;
  const angle = ((index + 0.5) / total) * Math.PI * 2 - Math.PI / 2;
  return {
    x: Number((cx + Math.cos(angle) * radius).toFixed(2)),
    y: Number((cy + Math.sin(angle) * radius).toFixed(2)),
  };
}

export function categoryWedgeLabel(category: Category): readonly string[] {
  switch (category.id) {
    case 'kinnauri-nati':
      return ['किन्नौरी', 'नाटी'];
    case 'jhoori-harul':
      return ['झूरी', 'हारुल'];
    case 'chamba-folk':
      return ['चम्बा', 'लोक'];
    case 'lahaul-spiti':
      return ['लाहौल', 'स्पीति'];
    case 'kangra-folk':
      return ['कांगड़ा', 'लोक'];
    case 'modern-pahadi':
      return ['मॉडर्न', 'पहाड़ी'];
    default:
      return [category.nameHi];
  }
}

function polar(cx: number, cy: number, radius: number, angle: number): { x: string; y: string } {
  return {
    x: (cx + Math.cos(angle) * radius).toFixed(2),
    y: (cy + Math.sin(angle) * radius).toFixed(2),
  };
}
