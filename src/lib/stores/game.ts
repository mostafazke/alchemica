import { writable, get } from 'svelte/store';
import type { Discovery, Slots } from '../types.js';
import { BASIC_ELEMENTS } from '../data/elements.js';

const SAVE_KEY = 'alchemica_v1';
const SAVE_VERSION = 1;

interface SaveData {
  version: number;
  data: {
    unlockedElements: string[];
    discoveries: Discovery[];
    score: number;
  };
}

function loadSave(): SaveData['data'] | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SaveData;
    if (parsed.version !== SAVE_VERSION) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

const saved = loadSave();

// --- Stores ---

export const unlockedElements = writable<Set<string>>(
  saved?.unlockedElements ? new Set(saved.unlockedElements) : new Set(BASIC_ELEMENTS)
);

export const discoveries = writable<Discovery[]>(saved?.discoveries ?? []);

export const slots = writable<Slots>({ a: null, b: null });

export const combo = writable<number>(1);

export const score = writable<number>(saved?.score ?? 0);

export const lastSuccess = writable<boolean>(false);

// --- Auto-save on change ---

function saveToStorage(): void {
  try {
    const state: SaveData = {
      version: SAVE_VERSION,
      data: {
        unlockedElements: [...get(unlockedElements)],
        discoveries: get(discoveries),
        score: get(score),
      },
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {
    // localStorage unavailable (private browsing, quota exceeded) — fail silently
  }
}

unlockedElements.subscribe(saveToStorage);
discoveries.subscribe(saveToStorage);
score.subscribe(saveToStorage);

// --- Reset ---

export function resetGame(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    // ignore
  }
  unlockedElements.set(new Set(BASIC_ELEMENTS));
  discoveries.set([]);
  slots.set({ a: null, b: null });
  combo.set(1);
  score.set(0);
  lastSuccess.set(false);
}
