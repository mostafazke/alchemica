import { REACTIONS } from '../data/reactions.js';
import { ELEMENTS } from '../data/elements.js';
import { get } from 'svelte/store';
import { unlockedElements, discoveries, combo, score, lastSuccess } from '../stores/game.js';
import { streakCount } from '../stores/achievements.js';
import type { Discovery, AchievementId } from '../types.js';
import { checkAchievements } from './achievements.js';
import { completeDailyChallenge } from './daily.js';
import { dailyChallengeTarget, dailyCompleted } from '../stores/daily.js';
import { logElementDiscovered } from '../effects/analytics.js';

/**
 * Returns the combo cap for the given streak count.
 * Base cap is 8x; +1x per streak day up to a maximum of 11x.
 */
export function getComboMax(streak: number): number {
  return Math.min(8 + streak, 11);
}

/**
 * Returns the first valid unused reaction hint, or null if none available.
 * "Valid" = both input elements are unlocked AND the result is not yet unlocked.
 */
export function getHint(unlocked: Set<string>): { a: string; b: string; result: string } | null {
  const seen = new Set<string>();
  for (const [key, result] of Object.entries(REACTIONS)) {
    const [a, b] = key.split('+');
    // Deduplicate: skip the reverse pair (b+a already covered by a+b)
    const canonical = a <= b ? `${a}+${b}` : `${b}+${a}`;
    if (seen.has(canonical)) continue;
    seen.add(canonical);

    if (unlocked.has(result)) continue;          // already discovered
    if (!unlocked.has(a) || !unlocked.has(b)) continue; // ingredients not available
    return { a, b, result };
  }
  return null;
}

/**
 * Returns a hint biased toward combinations where at least one ingredient
 * matches the player's currently selected slots (they're "close to" the result).
 * Falls back to any valid undiscovered combination.
 */
export function getStuckHint(
  unlocked: Set<string>,
  currentSlots: { a: string | null; b: string | null }
): { a: string; b: string; result: string } | null {
  const shelf = [currentSlots.a, currentSlots.b].filter((x): x is string => x !== null);
  const biased: { a: string; b: string; result: string }[] = [];
  const fallback: { a: string; b: string; result: string }[] = [];
  const seen = new Set<string>();

  for (const [key, result] of Object.entries(REACTIONS)) {
    const [a, b] = key.split('+');
    const canonical = a <= b ? `${a}+${b}` : `${b}+${a}`;
    if (seen.has(canonical)) continue;
    seen.add(canonical);

    if (unlocked.has(result)) continue;
    if (!unlocked.has(a) || !unlocked.has(b)) continue;

    const entry = { a, b, result };
    if (shelf.includes(a) || shelf.includes(b)) {
      biased.push(entry);
    } else {
      fallback.push(entry);
    }
  }

  return biased[0] ?? fallback[0] ?? null;
}

export function resolveReaction(a: string, b: string): { result: string | null; isNew: boolean } {
  const key = `${a}+${b}`;
  const result = REACTIONS[key] ?? null;
  const isNew = result !== null && !get(unlockedElements).has(result);
  return { result, isNew };
}

export function applyReaction(a: string, b: string): { result: string | null; isNew: boolean; newBadge: AchievementId | null; dailyCompleted: boolean } {
  const key = `${a}+${b}`;
  const result = REACTIONS[key] ?? null;

  if (result) {
    const currentCombo = get(combo);
    const wasSuccess = get(lastSuccess);
    const isNew = !get(unlockedElements).has(result);

    lastSuccess.set(true);

    let newBadge: AchievementId | null = null;

    if (isNew) {
      const cap = getComboMax(get(streakCount));
      const newCombo = wasSuccess ? Math.min(currentCombo + 1, cap) : 1;
      combo.set(newCombo);
      score.update((s) => s + 100 * newCombo);
      unlockedElements.update((s) => { s.add(result); return new Set(s); });
      const discovery: Discovery = {
        key: result,
        recipe: ELEMENTS[result]?.recipe ?? `${ELEMENTS[a]?.name ?? a} + ${ELEMENTS[b]?.name ?? b}`,
        timestamp: Date.now(),
      };
      discoveries.update((d) => [discovery, ...d]);
      // Log discovery event (fire-and-forget, no-op on web/opt-out)
      logElementDiscovered(result, get(unlockedElements).size);
      // Check milestone badges after element unlock
      newBadge = checkAchievements(get(unlockedElements).size);
    } else {
      // Element already known: no score, no combo change — keep lastSuccess true so
      // the chain remains alive for a future new discovery.
      unlockedElements.update((s) => new Set(s));
    }

    // Check daily challenge completion — fires on any successful reaction producing the
    // target element, regardless of whether it is a new discovery (DALY-02)
    let dailyCompletedFlag = false;
    if (!get(dailyCompleted) && result === get(dailyChallengeTarget)) {
      completeDailyChallenge();
      dailyCompletedFlag = true;
    }

    return { result, isNew, newBadge, dailyCompleted: dailyCompletedFlag };
  } else {
    lastSuccess.set(false);
    combo.set(1);
    return { result: null, isNew: false, newBadge: null, dailyCompleted: false };
  }
}
