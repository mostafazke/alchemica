/**
 * notifications.ts — Daily streak push notification scheduling.
 *
 * Uses @capacitor/local-notifications. Native-only — all functions are
 * no-ops on web. The permission rationale dialog is handled in the UI layer
 * (DailyChallenge.svelte) before calling requestAndSchedule().
 *
 * Notification scheduled at 8:00 PM local time, repeating daily.
 * Title is personalised by streak count.
 */
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

/** Fixed notification ID for the daily streak reminder. */
const NOTIFICATION_ID = 1001;

/**
 * Schedule (or re-schedule) the daily streak notification at 8 PM local time.
 * Re-scheduling updates the title when streak count changes.
 * Native-only — no-op on web.
 */
export async function scheduleStreakNotification(streakN: number): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  // Cancel any existing instance before rescheduling
  await LocalNotifications.cancel({ notifications: [{ id: NOTIFICATION_ID }] }).catch(() => {});

  const title =
    streakN > 0
      ? `⚗️ Keep your ${streakN}-day streak alive!`
      : '🔬 Today\'s science challenge is ready';

  // Schedule for 8 PM today; if 8 PM already passed, schedule for tomorrow
  const now = new Date();
  const target = new Date();
  target.setHours(20, 0, 0, 0);
  if (target <= now) {
    target.setDate(target.getDate() + 1);
  }

  await LocalNotifications.schedule({
    notifications: [
      {
        id: NOTIFICATION_ID,
        title,
        body: 'A new element combination challenge awaits.',
        schedule: {
          at: target,
          repeats: true,
          every: 'day',
        },
        extra: { route: '/game' },
      },
    ],
  });
}

/**
 * Cancel the daily streak notification (player opted out in Settings).
 * Native-only — no-op on web.
 */
export async function cancelStreakNotification(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  await LocalNotifications.cancel({ notifications: [{ id: NOTIFICATION_ID }] }).catch(() => {});
}

/**
 * Request OS notification permission, then schedule the daily reminder.
 * Call this AFTER showing your own rationale dialog (the AC requires framing
 * before the OS dialog).
 *
 * Returns true if permission was granted and notification is scheduled.
 * Native-only — returns false on web.
 */
export async function requestAndSchedule(streakN: number): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;
  try {
    const perm = await LocalNotifications.requestPermissions();
    if (perm.display === 'granted') {
      await scheduleStreakNotification(streakN);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
