/**
 * onboarding.ts — Reactive store for guided first-session onboarding state.
 *
 * Steps:
 *   0 — inactive (already onboarded or not yet initialized)
 *   1 — Step 1: highlight Fire + Water, show "Try these" prompt
 *   2 — Step 2: Steam found — show confirmation + free-explore prompt
 *   3 — Step 3: 3+ elements discovered — show summary card
 *
 * Set to 0 permanently when the player skips or completes step 3.
 */
import { writable, get } from 'svelte/store';
import { logOnboardingCompleted } from '../effects/analytics.js';

export const ONBOARD_KEY = 'alchemica_onboarded';

/** 0 = off/done | 1 = highlight prompt | 2 = steam found | 3 = summary */
export const onboardingStep = writable<0 | 1 | 2 | 3>(0);

/** Set once the player has seen and dismissed step 2 — used to gate step 3 */
export const step2Dismissed = writable(false);

/** Mark onboarding complete — persists to localStorage. */
export function completeOnboarding() {
  const step = get(onboardingStep);
  // Guard: step === 0 means onboarding is already complete — no-op to avoid spurious events
  if (step === 0) return;
  // step === 3 means the player reached the final summary card (completed naturally)
  // any other step (1 or 2) means they skipped early
  logOnboardingCompleted(step === 3, step);
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(ONBOARD_KEY, '1');
  }
  step2Dismissed.set(false); // prevent $effect in FirstRunOverlay from re-triggering step 3
  onboardingStep.set(0);
}
