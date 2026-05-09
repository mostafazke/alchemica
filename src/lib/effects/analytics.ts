/**
 * analytics.ts — Firebase Analytics event wrappers.
 *
 * All functions are no-ops on web (Capacitor.isNativePlatform() guard).
 * All functions are no-ops when the player has opted out (analyticsEnabled store).
 * All calls are fire-and-forget — never awaited at call sites.
 * No PII in any event params.
 */
import { Capacitor } from '@capacitor/core';
import { get } from 'svelte/store';
import { analyticsEnabled } from '../stores/settings.js';

let _sessionNumber = 0;

function shouldLog(): boolean {
  return Capacitor.isNativePlatform() && get(analyticsEnabled) === true;
}

function log(name: string, params?: Record<string, string | number | boolean>): void {
  if (!shouldLog()) return;
  // Dynamic import prevents ad blockers from blocking the "analytics" URL on web
  import('@capacitor-firebase/analytics')
    .then(({ FirebaseAnalytics }) => FirebaseAnalytics.logEvent({ name, params }))
    .catch(() => {}); // fire-and-forget
}

/** Call once from +layout.svelte onMount to fire session_start and increment session counter. */
export function initAnalytics(): void {
  _sessionNumber++;
  log('session_start', { session_number: _sessionNumber });
}

/** Returns the current session number (for passing to other log functions). */
export function getSessionNumber(): number {
  return _sessionNumber;
}

export function logElementDiscovered(elementKey: string, discoveryNumber: number): void {
  log('element_discovered', {
    element_key: elementKey,
    discovery_number: discoveryNumber,
    session_number: _sessionNumber,
  });
}

export function logDailyChallengeCompleted(streakCount: number, targetElement: string): void {
  log('daily_challenge_completed', {
    streak_count: streakCount,
    target_element: targetElement,
  });
}

export function logAchievementEarned(achievementId: string): void {
  log('achievement_earned', { achievement_id: achievementId });
}

export function logHintRequested(failedAttemptsCount: number): void {
  log('hint_requested', { failed_attempts_count: failedAttemptsCount });
}

export function logRewardedAdWatched(placement: 'stuck' | 'daily' | 'achievement'): void {
  log('rewarded_ad_watched', { placement });
}

export function logIapInitiated(productId: string): void {
  log('iap_initiated', { product_id: productId });
}

/**
 * @param completed true = finished tutorial naturally; false = skipped
 * @param stepReached last onboarding step the player reached (1, 2, or 3)
 */
export function logOnboardingCompleted(completed: boolean, stepReached: number): void {
  log('onboarding_completed', {
    completed: completed ? 'true' : 'false',
    step_reached: stepReached,
  });
}

export function logShareTriggered(elementKey: string, shareType: 'discovery' | 'daily'): void {
  log('share_triggered', {
    element_key: elementKey,
    share_type: shareType,
  });
}

export function logNotificationPermissionGranted(): void {
  log('notification_permission_granted');
}

export function logRatingPromptShown(): void {
  log('rating_prompt_shown');
}

export function logRatingPromptAccepted(): void {
  log('rating_prompt_accepted');
}

export function logRatingPromptDeclined(): void {
  log('rating_prompt_declined');
}
