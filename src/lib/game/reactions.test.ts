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
import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { getComboMax, applyReaction } from './reactions.js';
import { score, combo, lastSuccess, unlockedElements, discoveries } from '../stores/game.js';
import { lastCompletedDate } from '../stores/achievements.js';
import { getTodayDateStr } from './daily.js';

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

// ---------------------------------------------------------------------------
// applyReaction — re-discovery bug regression (fix: no score/combo on repeat)
// fire+water→steam is a stable known reaction used as the test fixture.
// ---------------------------------------------------------------------------

function resetStores() {
  // Basic elements only — steam is NOT pre-unlocked
  unlockedElements.set(new Set(['fire', 'water', 'earth', 'air']));
  score.set(0);
  combo.set(1);
  lastSuccess.set(false);
  discoveries.set([]);
  // Mark daily challenge already completed so it doesn't interfere with assertions
  lastCompletedDate.set(getTodayDateStr());
}

describe('applyReaction — re-discovery fix', () => {
  beforeEach(resetStores);

  it('new discovery: awards 100×combo score and increments combo', () => {
    lastSuccess.set(false); // first reaction — no prior success
    const result = applyReaction('fire', 'water');
    expect(result.result).toBe('steam');
    expect(result.isNew).toBe(true);
    expect(get(score)).toBe(100); // 100 × combo(1)
    expect(get(combo)).toBe(1);   // wasSuccess=false → combo resets to 1
    expect(get(unlockedElements).has('steam')).toBe(true);
    expect(get(discoveries).length).toBe(1);
  });

  it('new discovery after prior success: combo advances before scoring', () => {
    lastSuccess.set(true);
    combo.set(2);
    const result = applyReaction('fire', 'water');
    expect(result.isNew).toBe(true);
    expect(get(combo)).toBe(3);       // 2 + 1
    expect(get(score)).toBe(300);     // 100 × 3
  });

  it('re-discovery: score and combo unchanged', () => {
    // Pre-unlock steam so the reaction is a re-discovery
    unlockedElements.set(new Set(['fire', 'water', 'earth', 'air', 'steam']));
    lastSuccess.set(true);
    combo.set(2);
    score.set(500);

    const result = applyReaction('fire', 'water');
    expect(result.result).toBe('steam');
    expect(result.isNew).toBe(false);
    expect(get(score)).toBe(500);    // unchanged
    expect(get(combo)).toBe(2);      // unchanged
    expect(get(discoveries).length).toBe(0); // no new discovery logged
  });

  it('re-discovery: lastSuccess stays true so combo chain survives', () => {
    unlockedElements.set(new Set(['fire', 'water', 'earth', 'air', 'steam']));
    lastSuccess.set(false);

    applyReaction('fire', 'water'); // re-discovery
    expect(get(lastSuccess)).toBe(true);
  });

  it('failed reaction: score unchanged, combo resets, lastSuccess=false', () => {
    combo.set(3);
    score.set(200);
    const result = applyReaction('fire', 'fire'); // no reaction for fire+fire
    expect(result.result).toBeNull();
    expect(get(score)).toBe(200);
    expect(get(combo)).toBe(1);
    expect(get(lastSuccess)).toBe(false);
  });
});
