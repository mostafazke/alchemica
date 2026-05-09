/**
 * rating.ts — In-app rating prompt logic.
 *
 * Guards: sessionCount >= 5, no prompt in last 365 days,
 * no recent ad view, native platform only.
 */
import { Capacitor } from '@capacitor/core';
import { get } from 'svelte/store';
import { sessionCount, lastRatingPromptDate } from '../stores/settings.js';
import { wasAdShownRecently } from './admob.js';

function getTodayDateStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function daysSinceDate(dateStr: string): number {
  // Compare calendar dates in UTC to avoid timezone and DST issues.
  const todayUtc = getTodayDateStr();
  const [ty, tm, td] = todayUtc.split('-').map(Number);
  const [py, pm, pd] = dateStr.split('-').map(Number);
  if ([py, pm, pd].some(Number.isNaN)) return NaN;
  const msPerDay = 1000 * 60 * 60 * 24;
  const thenMs = Date.UTC(py, pm - 1, pd);
  const nowMs = Date.UTC(ty, tm - 1, td);
  return Math.floor((nowMs - thenMs) / msPerDay);
}

/** Returns true when all conditions for showing the rating pre-screen are met. */
export function shouldShowRating(): boolean {
  if (!Capacitor.isNativePlatform()) return false;
  const count = get(sessionCount);
  if (typeof count !== 'number' || Number.isNaN(count) || count < 5) return false;

  const lastDate = get(lastRatingPromptDate);
  if (lastDate) {
    const days = daysSinceDate(lastDate);
    if (Number.isNaN(days) || days < 365) return false;
  }

  if (wasAdShownRecently()) return false;

  return true;
}

/** Persists today's date as the last rating prompt date (365-day cooldown start). */
export function markRatingShown(): void {
  lastRatingPromptDate.set(getTodayDateStr());
}

/** Calls the native in-app review API. No-op on web. */
export async function triggerNativeReview(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  try {
    const { InAppReview } = await import('@capacitor-community/in-app-review');
    await InAppReview.requestReview();
  } catch {
    // Native review dialog may be suppressed by OS — fail silently
  }
}
