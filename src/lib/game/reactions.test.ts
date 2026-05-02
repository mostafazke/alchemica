/**
 * Tests for streak bonus combo cap logic (Phase 10 — STRK-05).
 *
 * Tests the getComboMax() helper which computes the combo cap
 * from the current streak count:
 *   streakCount=0 → 8 (base)
 *   streakCount=1 → 9
 *   streakCount=2 → 10
 *   streakCount=3 → 11 (max)
 *   streakCount=99 → 11 (clamped)
 */
import { describe, it, expect } from 'vitest';
import { getComboMax } from './reactions.js';

describe('getComboMax — streak bonus combo cap (STRK-05)', () => {
  it('returns 8 when streakCount is 0 (base cap unchanged)', () => {
    expect(getComboMax(0)).toBe(8);
  });

  it('returns 9 when streakCount is 1', () => {
    expect(getComboMax(1)).toBe(9);
  });

  it('returns 10 when streakCount is 2', () => {
    expect(getComboMax(2)).toBe(10);
  });

  it('returns 11 when streakCount is 3', () => {
    expect(getComboMax(3)).toBe(11);
  });

  it('clamps at 11 for high streak counts', () => {
    expect(getComboMax(99)).toBe(11);
    expect(getComboMax(10)).toBe(11);
  });
});
