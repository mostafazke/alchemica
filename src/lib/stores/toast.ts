/**
 * toast.ts — Achievement toast queue store.
 * MixingChamber pushes AchievementId values here.
 * AchievementToast.svelte drains them one at a time.
 * Per D-04, D-11, PROG-05.
 */
import { writable } from 'svelte/store';
import type { AchievementId } from '../types.js';

/** FIFO queue of badge IDs waiting to be shown as toasts. */
export const toastQueue = writable<AchievementId[]>([]);
