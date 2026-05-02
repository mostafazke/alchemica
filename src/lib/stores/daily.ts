/**
 * daily.ts — Reactive stores for daily challenge state.
 *
 * dailyChallengeTarget: today's challenge element key (writable, computed once on load).
 * dailyCompleted: derived from persisted lastCompletedDate — automatically true on reload
 *   if the player already completed today's challenge (DALY-04).
 *
 * Architecture: imports from game/daily.ts and stores/achievements.ts only.
 * No imports from stores/game.ts. Per D-11, D-12.
 */
import { writable, derived } from 'svelte/store';
import { getDailyChallengeKey, getTodayDateStr } from '../game/daily.js';
import { lastCompletedDate } from './achievements.js';

/**
 * The element key the player must create to complete today's daily challenge.
 * Initialized once at module load — changes each calendar day on next page load.
 * Per D-11, DALY-03.
 */
export const dailyChallengeTarget = writable<string>(getDailyChallengeKey());

/**
 * True when the player has already completed today's daily challenge.
 * Derived from the persisted lastCompletedDate store — no extra localStorage
 * read needed here; survives reload automatically. Per D-11, DALY-04.
 */
export const dailyCompleted = derived(
  lastCompletedDate,
  ($lastCompletedDate) => $lastCompletedDate === getTodayDateStr()
);
