import {
  DEFAULT_CATEGORY_ID,
  categoryLabelAnchor,
  categorySlicePath,
  categoryWedgeLabel,
  getCategory,
} from './category.model';

describe('getCategory', () => {
  it('returns Nati as the default category', () => {
    expect(getCategory(DEFAULT_CATEGORY_ID).nameHi).toBe('नाटी');
    expect(getCategory(DEFAULT_CATEGORY_ID).nameEn).toBe('Nati');
  });

  it('returns a known category by id', () => {
    expect(getCategory('kinnauri-nati').nameHi).toBe('किन्नौरी नाटी');
    expect(getCategory('kangra-folk').nameEn).toBe('Kangra Folk');
  });
});

describe('categorySlicePath', () => {
  it('builds a circular slice path', () => {
    const path = categorySlicePath(0, 9);
    expect(path.startsWith('M ')).toBe(true);
    expect(path.includes(' A ')).toBe(true);
    expect(path.endsWith(' Z')).toBe(true);
  });
});

describe('categoryLabelAnchor', () => {
  it('places the Nati label in the top slice', () => {
    const point = categoryLabelAnchor(0, 9, 100);
    expect(point.x).toBeGreaterThan(160);
    expect(point.y).toBeLessThan(160);
  });
});

describe('categoryWedgeLabel', () => {
  it('splits Lahaul-Spiti onto two lines', () => {
    expect(categoryWedgeLabel(getCategory('lahaul-spiti'))).toEqual(['लाहौल', 'स्पीति']);
  });

  it('splits Kangra Folk onto two lines', () => {
    expect(categoryWedgeLabel(getCategory('kangra-folk'))).toEqual(['कांगड़ा', 'लोक']);
  });
});
