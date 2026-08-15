import { toPlayerStateName, YOUTUBE_PLAYER_STATE } from './player-state.model';

describe('toPlayerStateName', () => {
  it('maps official YouTube player state codes', () => {
    expect(toPlayerStateName(YOUTUBE_PLAYER_STATE.UNSTARTED)).toBe('UNSTARTED');
    expect(toPlayerStateName(YOUTUBE_PLAYER_STATE.ENDED)).toBe('ENDED');
    expect(toPlayerStateName(YOUTUBE_PLAYER_STATE.PLAYING)).toBe('PLAYING');
    expect(toPlayerStateName(YOUTUBE_PLAYER_STATE.PAUSED)).toBe('PAUSED');
    expect(toPlayerStateName(YOUTUBE_PLAYER_STATE.BUFFERING)).toBe('BUFFERING');
    expect(toPlayerStateName(YOUTUBE_PLAYER_STATE.CUED)).toBe('CUED');
  });

  it('falls back to UNSTARTED for unknown codes', () => {
    expect(toPlayerStateName(99)).toBe('UNSTARTED');
  });
});
