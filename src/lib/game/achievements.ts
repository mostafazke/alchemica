/**
 * achievements.ts — Headless badge award engine.
 *
 * Architecture: imports only from svelte/store, ../stores/achievements.js,
 * and ../types.js. Never imports from stores/game.ts to avoid circular deps.
 * Callers pass the element count explicitly.
 */
import { get } from 'svelte/store';
import type { AchievementId } from '../types.js';
import { earnedAchievements } from '../stores/achievements.js';
import { logAchievementEarned } from '../effects/analytics.js';

export const THRESHOLDS: Array<{ count: number; id: AchievementId }> = [
  { count: 10, id: 'badge_10' },
  { count: 25, id: 'badge_25' },
  { count: 50, id: 'badge_50' },
  { count: 61, id: 'badge_61' },
  { count: 100, id: 'badge_100' },
];

/**
 * Check if a new badge should be awarded for reaching `count` unlocked elements.
 * Idempotent — only awards badges not already in earnedAchievements.
 * Returns the first newly awarded AchievementId, or null if none.
 *
 * Called by applyReaction() after element unlock (D-01, ACHV-01–04).
 * At most one badge fires per reaction (reactions add one element at a time).
 */
export function checkAchievements(count: number): AchievementId | null {
  const earned = get(earnedAchievements);
  for (const { count: threshold, id } of THRESHOLDS) {
    if (count >= threshold && !earned.has(id)) {
      earnedAchievements.update((s) => { s.add(id); return new Set(s); });
      logAchievementEarned(id);
      return id;
    }
  }
  return null;
}

/**
 * Silently back-calculates and awards all achievements the player already
 * earned (from a v1 save). Called once during game.ts module init after
 * stores are hydrated from localStorage. No return value — no toast or chime.
 *
 * Per D-05, D-06, ACHV-06.
 */
export function backfillAchievements(count: number): void {
  const earned = get(earnedAchievements);
  const toAdd: AchievementId[] = [];
  for (const { count: threshold, id } of THRESHOLDS) {
    if (count >= threshold && !earned.has(id)) {
      toAdd.push(id);
    }
  }
  if (toAdd.length > 0) {
    earnedAchievements.update((s) => {
      toAdd.forEach((id) => s.add(id));
      return new Set(s);
    });
  }
}
