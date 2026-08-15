import {
  DEFAULT_DISTRICT_ID,
  districtLabelAnchor,
  districtSlicePath,
  districtWedgeLabel,
  getDistrict,
} from './district.model';

describe('getDistrict', () => {
  it('returns Shimla as the default district', () => {
    expect(getDistrict(DEFAULT_DISTRICT_ID).nameHi).toBe('शिमला');
    expect(getDistrict(DEFAULT_DISTRICT_ID).nameEn).toBe('Shimla');
  });

  it('returns a known district by id', () => {
    expect(getDistrict('kullu').nameHi).toBe('कुल्लू');
  });
});

describe('districtSlicePath', () => {
  it('builds a circular slice path', () => {
    const path = districtSlicePath(0, 12);
    expect(path.startsWith('M ')).toBe(true);
    expect(path.includes(' A ')).toBe(true);
    expect(path.endsWith(' Z')).toBe(true);
  });
});

describe('districtLabelAnchor', () => {
  it('places the Shimla label in the top slice', () => {
    const point = districtLabelAnchor(0, 12, 100);
    expect(point.x).toBeGreaterThan(160);
    expect(point.y).toBeLessThan(160);
  });
});

describe('districtWedgeLabel', () => {
  it('splits Lahaul-Spiti onto two lines', () => {
    expect(districtWedgeLabel(getDistrict('lahaul-spiti'))).toEqual(['लाहौल', 'स्पीति']);
  });
});
