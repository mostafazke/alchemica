import { writable } from 'svelte/store';

/** Consecutive failed combinations since last success or reset. Session-only (not persisted). */
export const failedComboCount = writable(0);

/** Whether the stuck-player hint prompt is currently visible. */
export const stuckPromptVisible = writable(false);
