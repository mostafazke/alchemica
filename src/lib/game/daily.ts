/**
 * daily.ts — Daily challenge engine and streak computation.
 *
 * Architecture: imports only from ../data/elements.js and
 * ../stores/achievements.js. No imports from stores/game.ts.
 * Per D-07–D-15, DALY-03, STRK-02, STRK-03.
 */
import { get } from 'svelte/store';
import { ELEMENTS } from '../data/elements.js';
import { streakCount, lastCompletedDate } from '../stores/achievements.js';

/**
 * Returns today's date as YYYY-MM-DD in the user's local timezone.
 * Used for challenge seeding and streak date comparisons. Per D-13.
 */
export function getTodayDateStr(): string {
  return new Date().toLocaleDateString('en-CA');
}

/**
 * Returns the element key for today's daily challenge.
 * Deterministic: same result for all players on the same local calendar date.
 * Pool: all non-basic elements (excludes fire, water, earth, air). Per D-07, D-08.
 */
export function getDailyChallengeKey(): string {
  const dateStr = getTodayDateStr();
  const seed = dateStr.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const pool = Object.keys(ELEMENTS)
    .filter((k) => ELEMENTS[k].category !== 'basic')
    .sort(); // stable ordering regardless of ELEMENTS import order
  return pool[seed % pool.length];
}

/**
 * Returns today's daily challenge key, preferring elements the player has NOT yet
 * discovered. Falls back to the default key if all non-basic elements are unlocked.
 * Uses the same date seed so the selection is stable within a day for each player.
 */
export function getDailyChallengeKeyForPlayer(unlockedKeys: Set<string>): string {
  const dateStr = getTodayDateStr();
  const seed = dateStr.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const pool = Object.keys(ELEMENTS)
    .filter((k) => ELEMENTS[k].category !== 'basic')
    .sort();

  const undiscovered = pool.filter((k) => !unlockedKeys.has(k));
  if (undiscovered.length > 0) {
    return undiscovered[seed % undiscovered.length];
  }
  // All non-basic elements discovered — fall back to global default
  return pool[seed % pool.length];
}

/**
 * Marks today's daily challenge as complete and updates the streak.
 * Idempotent — calling multiple times on the same day has no effect.
 *
 * Streak logic (D-14):
 * - Already completed today → no-op
 * - lastCompletedDate was yesterday → increment streak
 * - Otherwise (gap or first time) → reset streak to 1
 * Then sets lastCompletedDate to today.
 */
export function completeDailyChallenge(): void {
  const today = getTodayDateStr();
  const last = get(lastCompletedDate);

  if (last === today) return; // already completed today — idempotent guard

  const yesterday = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toLocaleDateString('en-CA');
  })();

  if (last === yesterday) {
    streakCount.update((n) => n + 1);
  } else {
    streakCount.set(1);
  }
  lastCompletedDate.set(today);
}
