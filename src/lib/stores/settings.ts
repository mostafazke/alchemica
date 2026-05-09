/**
 * settings.ts — App settings store.
 * soundMuted, hapticsMuted, notificationsEnabled, notificationsAsked, analyticsEnabled,
 * sessionCount, and lastRatingPromptDate
 * persist to localStorage key 'alchemica_settings'.
 */
import { writable, get } from 'svelte/store';

const SETTINGS_KEY = 'alchemica_settings';

function loadSettings(): {
  soundMuted: boolean;
  hapticsMuted: boolean;
  notificationsEnabled: boolean;
  notificationsAsked: boolean;
  analyticsEnabled: boolean;
  sessionCount: number;
  lastRatingPromptDate: string | null;
} {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { soundMuted: false, hapticsMuted: false, notificationsEnabled: false, notificationsAsked: false, analyticsEnabled: true, sessionCount: 0, lastRatingPromptDate: null };
    const parsed = JSON.parse(raw) as {
      soundMuted?: boolean;
      hapticsMuted?: boolean;
      notificationsEnabled?: boolean;
      notificationsAsked?: boolean;
      analyticsEnabled?: boolean;
      sessionCount?: number;
      lastRatingPromptDate?: string | null;
    };
    return {
      soundMuted: parsed.soundMuted === true,
      hapticsMuted: parsed.hapticsMuted === true,
      notificationsEnabled: parsed.notificationsEnabled === true,
      notificationsAsked: parsed.notificationsAsked === true,
      analyticsEnabled: parsed.analyticsEnabled !== false, // default true
      sessionCount: typeof parsed.sessionCount === 'number' ? parsed.sessionCount : 0,
      lastRatingPromptDate: typeof parsed.lastRatingPromptDate === 'string' ? parsed.lastRatingPromptDate : null,
    };
  } catch {
    return { soundMuted: false, hapticsMuted: false, notificationsEnabled: false, notificationsAsked: false, analyticsEnabled: true, sessionCount: 0, lastRatingPromptDate: null };
  }
}

const initial =
  typeof localStorage !== 'undefined'
    ? loadSettings()
    : { soundMuted: false, hapticsMuted: false, notificationsEnabled: false, notificationsAsked: false, analyticsEnabled: true, sessionCount: 0, lastRatingPromptDate: null as string | null };

export const soundMuted = writable<boolean>(initial.soundMuted);
export const hapticsMuted = writable<boolean>(initial.hapticsMuted);
/** True if the player has granted notification permission and enabled reminders. */
export const notificationsEnabled = writable<boolean>(initial.notificationsEnabled);
/** True once we've asked the player (prevents re-asking after dismiss). */
export const notificationsAsked = writable<boolean>(initial.notificationsAsked);
/** True when the player allows Firebase Analytics data collection. Default: true (opt-in). */
export const analyticsEnabled = writable<boolean>(initial.analyticsEnabled);
/** Number of app sessions (cold starts). Persisted for rating prompt eligibility. */
export const sessionCount = writable<number>(initial.sessionCount);
/** ISO date string (YYYY-MM-DD) of last rating prompt shown. Null if never shown. */
export const lastRatingPromptDate = writable<string | null>(initial.lastRatingPromptDate);

function saveSettings() {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({
      soundMuted: get(soundMuted),
      hapticsMuted: get(hapticsMuted),
      notificationsEnabled: get(notificationsEnabled),
      notificationsAsked: get(notificationsAsked),
      analyticsEnabled: get(analyticsEnabled),
      sessionCount: get(sessionCount),
      lastRatingPromptDate: get(lastRatingPromptDate),
    }));
  } catch {
    // localStorage unavailable — fail silently
  }
}

soundMuted.subscribe(saveSettings);
hapticsMuted.subscribe(saveSettings);
notificationsEnabled.subscribe(saveSettings);
notificationsAsked.subscribe(saveSettings);
analyticsEnabled.subscribe(saveSettings);
sessionCount.subscribe(saveSettings);
lastRatingPromptDate.subscribe(saveSettings);
