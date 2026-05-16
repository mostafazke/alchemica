import { writable, get } from 'svelte/store';
import type { Discovery, Slots, AchievementId } from '../types.js';
import { BASIC_ELEMENTS } from '../data/elements.js';
import { earnedAchievements, streakCount, lastCompletedDate } from './achievements.js';
import { backfillAchievements } from '../game/achievements.js';
import { getDailyChallengeKeyForPlayer } from '../game/daily.js';
import { dailyChallengeTarget } from './daily.js';

const SAVE_KEY = 'alchemica_v1';
const SAVE_VERSION = 3;

interface SaveData {
  version: number;
  data: {
    unlockedElements: string[];
    discoveries: Discovery[];
    score: number;
    earnedAchievements: string[];    // stored as array, reconstructed as Set on load
    streakCount: number;
    lastCompletedDate: string | null;
    hintBalance: number;       // v3: moved from separate localStorage key
    purchasedNoAds: boolean;   // v3: permanent remove-ads upgrade
  };
}

function loadSave(): SaveData['data'] | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { version: number; data: Record<string, unknown> };

    if (parsed.version === SAVE_VERSION) {
      // Current version — return as-is
      return parsed.data as SaveData['data'];
    }

    if (parsed.version === 1) {
      // v1 → v2 migration: preserve all existing fields, add v2 defaults
      // Per D-02: earnedAchievements starts empty — Phase 7 back-calculates on init
      const v1data = parsed.data as { unlockedElements: string[]; discoveries: Discovery[]; score: number };
      return {
        unlockedElements: v1data.unlockedElements ?? [],
        discoveries: v1data.discoveries ?? [],
        score: v1data.score ?? 0,
        earnedAchievements: [],       // D-02: Phase 7 back-calculates
        streakCount: 0,               // D-03
        lastCompletedDate: null,      // D-03
        hintBalance: 0,
        purchasedNoAds: false,
      };
    }

    if (parsed.version === 2) {
      // v2 → v3 migration: fold hintBalance into versioned save, add purchasedNoAds
      const v2data = parsed.data as {
        unlockedElements: string[];
        discoveries: Discovery[];
        score: number;
        earnedAchievements: string[];
        streakCount: number;
        lastCompletedDate: string | null;
      };
      return {
        unlockedElements: v2data.unlockedElements ?? [],
        discoveries: v2data.discoveries ?? [],
        score: v2data.score ?? 0,
        earnedAchievements: v2data.earnedAchievements ?? [],
        streakCount: v2data.streakCount ?? 0,
        lastCompletedDate: v2data.lastCompletedDate ?? null,
        hintBalance: typeof localStorage !== 'undefined'
          ? Number(localStorage.getItem('alchemica_hint_balance') ?? 0)
          : 0,
        purchasedNoAds: false, // conservative default; RC re-validates on app start
      };
    }

    // Unknown version — return null (safe fallback: fresh game)
    return null;
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

// Initialize achievement stores from saved data (stores defined in achievements.ts)
// Per architecture: game.ts owns load/save; achievements.ts owns store definitions only
if (saved) {
  earnedAchievements.set(new Set<AchievementId>((saved.earnedAchievements ?? []) as AchievementId[]));
  streakCount.set(saved.streakCount ?? 0);
  lastCompletedDate.set(saved.lastCompletedDate ?? null);
}

// Back-calculate achievements from v1 saves (ACHV-06). Silent — no toast or chime.
backfillAchievements(get(unlockedElements).size);

// Override daily challenge target to prefer an undiscovered element for this player.
// Uses the same date seed so the result is stable for the whole day.
dailyChallengeTarget.set(getDailyChallengeKeyForPlayer(get(unlockedElements)));

/** Unix timestamp (ms) when the hint cooldown expires. 0 = no cooldown active. */
export const hintCooldownEndsAt = writable<number>(
  typeof localStorage !== 'undefined'
    ? Number(localStorage.getItem('alchemica_hint_cooldown') ?? 0)
    : 0
);

/** Hint credits earned from rewarded ads. Decrement on use; never touches cooldown. */
export const hintBalance = writable<number>(saved?.hintBalance ?? 0);

/** Whether the user has purchased the permanent Remove Ads upgrade. */
export const purchasedNoAds = writable<boolean>(saved?.purchasedNoAds ?? false);

// --- Auto-save on change ---

function saveToStorage(): void {
  try {
    const state: SaveData = {
      version: SAVE_VERSION,
      data: {
        unlockedElements: [...get(unlockedElements)],
        discoveries: get(discoveries),
        score: get(score),
        earnedAchievements: [...get(earnedAchievements)],   // Set → array (D-13)
        streakCount: get(streakCount),
        lastCompletedDate: get(lastCompletedDate),
        hintBalance: get(hintBalance),
        purchasedNoAds: get(purchasedNoAds),
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
earnedAchievements.subscribe(saveToStorage);
streakCount.subscribe(saveToStorage);
lastCompletedDate.subscribe(saveToStorage);
hintCooldownEndsAt.subscribe((v) => {
  try { localStorage.setItem('alchemica_hint_cooldown', String(v)); } catch { /* ignore */ }
});
hintBalance.subscribe(saveToStorage);
purchasedNoAds.subscribe(saveToStorage);

// --- Reset ---

export function resetGame(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
    localStorage.removeItem('alchemica_hint_balance');
  } catch {
    // ignore
  }
  unlockedElements.set(new Set(BASIC_ELEMENTS));
  discoveries.set([]);
  slots.set({ a: null, b: null });
  combo.set(1);
  score.set(0);
  lastSuccess.set(false);
  earnedAchievements.set(new Set<AchievementId>());
  streakCount.set(0);
  lastCompletedDate.set(null);
  hintBalance.set(0);
}
