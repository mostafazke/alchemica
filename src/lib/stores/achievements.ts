/**
 * achievements.ts — Svelte stores for achievement and streak state.
 *
 * Architecture note (per Phase 6 design):
 * - This file contains ONLY store definitions — no load/save logic.
 * - game.ts owns all localStorage load/save; it imports these stores and
 *   sets their values during initialization and reset.
 * - This one-way dependency (game.ts → achievements.ts) prevents circular imports.
 */
import { writable } from 'svelte/store';
import type { AchievementId } from '../types.js';

/**
 * Set of achievement badge IDs the player has earned.
 * Persisted as a plain array in localStorage; reconstructed as Set on load.
 * Per D-05, D-13, D-14.
 */
export const earnedAchievements = writable<Set<AchievementId>>(new Set<AchievementId>());

/**
 * Number of consecutive days the player has completed the daily challenge.
 * Per D-03, D-05, STRK-04.
 */
export const streakCount = writable<number>(0);

/**
 * ISO date string (YYYY-MM-DD) of the last day the player completed a daily challenge.
 * null if the player has never completed a challenge.
 * Per D-03, D-05, STRK-04.
 */
export const lastCompletedDate = writable<string | null>(null);
