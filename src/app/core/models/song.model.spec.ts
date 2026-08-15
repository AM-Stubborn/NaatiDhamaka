import {
  formatTrackTime,
  songFromPlayerData,
  videoIdFromWatchUrl,
  youtubeCoverUrl,
} from './song.model';

describe('songFromPlayerData', () => {
  it('uses player metadata when present', () => {
    expect(songFromPlayerData('abc123', 'Nati Song', 'Kuldeep Sharma', 2)).toEqual({
      videoId: 'abc123',
      title: 'Nati Song',
      artist: 'Kuldeep Sharma',
      index: 2,
    });
  });

  it('falls back to station copy when metadata is missing', () => {
    expect(songFromPlayerData(null, '  ', undefined, -1)).toEqual({
      videoId: '',
      title: 'नाटी धमाका',
      artist: 'Himachali Music',
      index: -1,
    });
  });
});

describe('youtubeCoverUrl', () => {
  it('builds the public YouTube thumbnail URL', () => {
    expect(youtubeCoverUrl('abc123')).toBe('https://i.ytimg.com/vi/abc123/hqdefault.jpg');
  });

  it('returns null without a video id', () => {
    expect(youtubeCoverUrl(null)).toBeNull();
    expect(youtubeCoverUrl('')).toBeNull();
  });
});

describe('formatTrackTime', () => {
  it('formats minutes and seconds', () => {
    expect(formatTrackTime(0)).toBe('0:00');
    expect(formatTrackTime(85)).toBe('1:25');
    expect(formatTrackTime(389)).toBe('6:29');
  });

  it('formats hours when needed', () => {
    expect(formatTrackTime(3723)).toBe('1:02:03');
  });
});

describe('videoIdFromWatchUrl', () => {
  it('reads a standard watch URL', () => {
    expect(videoIdFromWatchUrl('https://www.youtube.com/watch?v=dQw4w9wgGcQ')).toBe('dQw4w9wgGcQ');
  });

  it('reads an embed URL', () => {
    expect(videoIdFromWatchUrl('https://www.youtube.com/embed/dQw4w9wgGcQ')).toBe('dQw4w9wgGcQ');
  });

  it('returns null for invalid input', () => {
    expect(videoIdFromWatchUrl(undefined)).toBeNull();
    expect(videoIdFromWatchUrl('not-a-url')).toBeNull();
  });
});
