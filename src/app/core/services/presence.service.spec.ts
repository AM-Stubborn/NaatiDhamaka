import { presenceCountUrl } from '../constants/radio.constants';

describe('presenceCountUrl', () => {
  it('builds a unique 15-minute listener count URL', () => {
    expect(presenceCountUrl()).toBe(
      'https://counterapi.com/api/naati-dhamaka/listen/site?unique=true&timeline=15m',
    );
  });

  it('can request a read-only snapshot', () => {
    expect(presenceCountUrl(true)).toContain('readOnly=true');
  });
});
