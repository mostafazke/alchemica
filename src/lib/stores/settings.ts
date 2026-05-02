/**
 * settings.ts — App settings store.
 * soundMuted persists to localStorage key 'alchemica_settings'.
 * Per D-09, PROG-06.
 */
import { writable } from 'svelte/store';

const SETTINGS_KEY = 'alchemica_settings';

function loadSoundMuted(): boolean {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as { soundMuted?: boolean };
    return parsed.soundMuted === true;
  } catch {
    return false;
  }
}

export const soundMuted = writable<boolean>(
  typeof localStorage !== 'undefined' ? loadSoundMuted() : false
);

soundMuted.subscribe((muted) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ soundMuted: muted }));
  } catch {
    // localStorage unavailable — fail silently
  }
});
