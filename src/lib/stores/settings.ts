/**
 * settings.ts — App settings store.
 * soundMuted and hapticsMuted persist to localStorage key 'alchemica_settings'.
 */
import { writable, get } from 'svelte/store';

const SETTINGS_KEY = 'alchemica_settings';

function loadSettings(): { soundMuted: boolean; hapticsMuted: boolean } {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { soundMuted: false, hapticsMuted: false };
    const parsed = JSON.parse(raw) as { soundMuted?: boolean; hapticsMuted?: boolean };
    return {
      soundMuted: parsed.soundMuted === true,
      hapticsMuted: parsed.hapticsMuted === true,
    };
  } catch {
    return { soundMuted: false, hapticsMuted: false };
  }
}

const initial = typeof localStorage !== 'undefined' ? loadSettings() : { soundMuted: false, hapticsMuted: false };

export const soundMuted = writable<boolean>(initial.soundMuted);
export const hapticsMuted = writable<boolean>(initial.hapticsMuted);

function saveSettings() {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({
      soundMuted: get(soundMuted),
      hapticsMuted: get(hapticsMuted),
    }));
  } catch {
    // localStorage unavailable — fail silently
  }
}

soundMuted.subscribe(saveSettings);
hapticsMuted.subscribe(saveSettings);
