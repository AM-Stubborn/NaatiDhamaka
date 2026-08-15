export type DistrictId =
  | 'bilaspur'
  | 'chamba'
  | 'hamirpur'
  | 'kangra'
  | 'kinnaur'
  | 'kullu'
  | 'lahaul-spiti'
  | 'mandi'
  | 'shimla'
  | 'sirmaur'
  | 'solan'
  | 'una';

export interface District {
  id: DistrictId;
  nameEn: string;
  nameHi: string;
}

export const DEFAULT_DISTRICT_ID: DistrictId = 'shimla';

export const HIMACHAL_DISTRICTS: readonly District[] = [
  { id: 'shimla', nameEn: 'Shimla', nameHi: 'शिमला' },
  { id: 'sirmaur', nameEn: 'Sirmaur', nameHi: 'सिरमौर' },
  { id: 'solan', nameEn: 'Solan', nameHi: 'सोलन' },
  { id: 'bilaspur', nameEn: 'Bilaspur', nameHi: 'बिलासपुर' },
  { id: 'hamirpur', nameEn: 'Hamirpur', nameHi: 'हमीरपुर' },
  { id: 'una', nameEn: 'Una', nameHi: 'ऊना' },
  { id: 'kangra', nameEn: 'Kangra', nameHi: 'काँगड़ा' },
  { id: 'chamba', nameEn: 'Chamba', nameHi: 'चम्बा' },
  { id: 'lahaul-spiti', nameEn: 'Lahaul-Spiti', nameHi: 'लाहौल-स्पीति' },
  { id: 'kinnaur', nameEn: 'Kinnaur', nameHi: 'किन्नौर' },
  { id: 'kullu', nameEn: 'Kullu', nameHi: 'कुल्लू' },
  { id: 'mandi', nameEn: 'Mandi', nameHi: 'मंडी' },
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

export function getDistrict(id: DistrictId): District {
  const district = HIMACHAL_DISTRICTS.find((item) => item.id === id);
  return district ?? HIMACHAL_DISTRICTS.find((item) => item.id === DEFAULT_DISTRICT_ID)!;
}

export function districtSlicePath(index: number, total = HIMACHAL_DISTRICTS.length): string {
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

export function districtLabelAnchor(
  index: number,
  total = HIMACHAL_DISTRICTS.length,
  radius: number = CAP_GEOMETRY.labelRadius,
): { x: number; y: number } {
  const { cx, cy } = CAP_GEOMETRY;
  const angle = ((index + 0.5) / total) * Math.PI * 2 - Math.PI / 2;
  return {
    x: Number((cx + Math.cos(angle) * radius).toFixed(2)),
    y: Number((cy + Math.sin(angle) * radius).toFixed(2)),
  };
}

export function districtWedgeLabel(district: District): readonly string[] {
  if (district.id === 'lahaul-spiti') {
    return ['लाहौल', 'स्पीति'];
  }

  return [district.nameHi];
}

function polar(cx: number, cy: number, radius: number, angle: number): { x: string; y: string } {
  return {
    x: (cx + Math.cos(angle) * radius).toFixed(2),
    y: (cy + Math.sin(angle) * radius).toFixed(2),
  };
}
