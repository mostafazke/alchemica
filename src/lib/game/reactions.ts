import { REACTIONS } from '../data/reactions.js';
import { ELEMENTS } from '../data/elements.js';
import { get } from 'svelte/store';
import { unlockedElements, discoveries, combo, score, lastSuccess } from '../stores/game.js';
import type { Discovery, AchievementId } from '../types.js';
import { checkAchievements } from './achievements.js';
import { completeDailyChallenge } from './daily.js';
import { dailyChallengeTarget, dailyCompleted } from '../stores/daily.js';

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
    const newCombo = wasSuccess ? Math.min(currentCombo + 1, 8) : 1;
    const isNew = !get(unlockedElements).has(result);

    combo.set(newCombo);
    lastSuccess.set(true);

    const points = isNew ? 100 * newCombo : 10 * newCombo;
    score.update((s) => s + points);

    let newBadge: AchievementId | null = null;

    if (isNew) {
      unlockedElements.update((s) => { s.add(result); return new Set(s); });
      const discovery: Discovery = {
        key: result,
        recipe: ELEMENTS[result]?.recipe ?? `${ELEMENTS[a]?.name ?? a} + ${ELEMENTS[b]?.name ?? b}`,
        timestamp: Date.now(),
      };
      discoveries.update((d) => [discovery, ...d]);
      // Check milestone badges after element unlock
      newBadge = checkAchievements(get(unlockedElements).size);
    } else {
      // Still need to trigger the store update for reactivity (element already known)
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
