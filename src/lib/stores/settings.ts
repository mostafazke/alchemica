/**
 * settings.ts — App settings store.
 * soundMuted, hapticsMuted, notificationsEnabled, notificationsAsked, and analyticsEnabled
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
} {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { soundMuted: false, hapticsMuted: false, notificationsEnabled: false, notificationsAsked: false, analyticsEnabled: true };
    const parsed = JSON.parse(raw) as {
      soundMuted?: boolean;
      hapticsMuted?: boolean;
      notificationsEnabled?: boolean;
      notificationsAsked?: boolean;
      analyticsEnabled?: boolean;
    };
    return {
      soundMuted: parsed.soundMuted === true,
      hapticsMuted: parsed.hapticsMuted === true,
      notificationsEnabled: parsed.notificationsEnabled === true,
      notificationsAsked: parsed.notificationsAsked === true,
      analyticsEnabled: parsed.analyticsEnabled !== false, // default true
    };
  } catch {
    return { soundMuted: false, hapticsMuted: false, notificationsEnabled: false, notificationsAsked: false, analyticsEnabled: true };
  }
}

const initial =
  typeof localStorage !== 'undefined'
    ? loadSettings()
    : { soundMuted: false, hapticsMuted: false, notificationsEnabled: false, notificationsAsked: false, analyticsEnabled: true };

export const soundMuted = writable<boolean>(initial.soundMuted);
export const hapticsMuted = writable<boolean>(initial.hapticsMuted);
/** True if the player has granted notification permission and enabled reminders. */
export const notificationsEnabled = writable<boolean>(initial.notificationsEnabled);
/** True once we've asked the player (prevents re-asking after dismiss). */
export const notificationsAsked = writable<boolean>(initial.notificationsAsked);
/** True when the player allows Firebase Analytics data collection. Default: true (opt-in). */
export const analyticsEnabled = writable<boolean>(initial.analyticsEnabled);

function saveSettings() {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({
      soundMuted: get(soundMuted),
      hapticsMuted: get(hapticsMuted),
      notificationsEnabled: get(notificationsEnabled),
      notificationsAsked: get(notificationsAsked),
      analyticsEnabled: get(analyticsEnabled),
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
