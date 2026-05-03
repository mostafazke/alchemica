/**
 * storage.ts — Versioned save export/import
 * Handles downloadable JSON save files with schema migration support.
 */
import { get } from 'svelte/store';
import { unlockedElements, discoveries, score, hintBalance, purchasedNoAds } from '../stores/game.js';
import { earnedAchievements, streakCount, lastCompletedDate } from '../stores/achievements.js';
import type { AchievementId } from '../types.js';

export const EXPORT_VERSION = 3;

export interface SaveFile {
  version: number;
  exportedAt: string; // ISO date string
  data: {
    unlockedElements: string[];
    discoveries: Array<{ key: string; recipe: string; timestamp: number }>;
    score: number;
    earnedAchievements: string[];      // serialized as array (D-13)
    streakCount: number;               // D-03
    lastCompletedDate: string | null;  // D-03
    hintBalance: number;       // v3: moved from separate localStorage key
    purchasedNoAds: boolean;   // v3: permanent remove-ads upgrade
  };
}

export interface ImportResult {
  ok: boolean;
  warning?: string;
  error?: string;
}

/**
 * Serializes current game state into a versioned JSON string.
 */
export function exportSave(): string {
  const save: SaveFile = {
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    data: {
      unlockedElements: [...get(unlockedElements)],
      discoveries: get(discoveries),
      score: get(score),
      earnedAchievements: [...get(earnedAchievements)],  // Set → array (D-13)
      streakCount: get(streakCount),
      lastCompletedDate: get(lastCompletedDate),
      hintBalance: get(hintBalance),
      purchasedNoAds: get(purchasedNoAds),
    },
  };
  return JSON.stringify(save, null, 2);
}

/**
 * Triggers a browser file download of the current save.
 */
export function downloadSave(): void {
  const json = exportSave();
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `alchemica-save-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Parses and validates a save file JSON string.
 * Applies migrations for older schema versions.
 * Returns { ok: true } on success, { ok: false, error } on invalid data.
 */
export function importSave(
  jsonString: string,
  stores: {
    setUnlocked: (keys: string[]) => void;
    setDiscoveries: (d: SaveFile['data']['discoveries']) => void;
    setScore: (n: number) => void;
    setEarnedAchievements: (ids: AchievementId[]) => void;
    setStreakCount: (n: number) => void;
    setLastCompletedDate: (d: string | null) => void;
    setHintBalance: (n: number) => void;
    setPurchasedNoAds: (v: boolean) => void;
  }
): ImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonString);
  } catch {
    return { ok: false, error: 'Invalid JSON — file may be corrupted.' };
  }

  if (!parsed || typeof parsed !== 'object') {
    return { ok: false, error: 'Save file format not recognised.' };
  }

  const raw = parsed as Record<string, unknown>;

  // Version check
  const version = typeof raw.version === 'number' ? raw.version : 0;
  let warning: string | undefined;

  if (version > EXPORT_VERSION) {
    return {
      ok: false,
      error: `Save is from a newer version (v${version}). Update the game to load it.`,
    };
  }

  if (version < EXPORT_VERSION) {
    warning = `Save is from an older version (v${version}). Some data may be missing.`;
  }

  // Validate data shape
  const data = raw.data as Record<string, unknown> | undefined;
  if (!data || typeof data !== 'object') {
    return { ok: false, error: 'Save file missing data section.' };
  }

  // unlockedElements
  const rawUnlocked = data.unlockedElements;
  const unlockedArr: string[] = Array.isArray(rawUnlocked)
    ? (rawUnlocked as unknown[]).filter((x): x is string => typeof x === 'string')
    : ['fire', 'water', 'earth', 'air'];

  if (unlockedArr.length === 0) {
    return { ok: false, error: 'Save file has no unlocked elements.' };
  }

  // discoveries
  const rawDisc = data.discoveries;
  const discArr = Array.isArray(rawDisc)
    ? (rawDisc as unknown[]).filter(
        (x): x is { key: string; recipe: string; timestamp: number } =>
          typeof x === 'object' &&
          x !== null &&
          typeof (x as Record<string, unknown>).key === 'string' &&
          typeof (x as Record<string, unknown>).recipe === 'string' &&
          typeof (x as Record<string, unknown>).timestamp === 'number'
      )
    : [];

  // score
  const scoreVal = typeof data.score === 'number' ? data.score : 0;

  // earnedAchievements — default empty if missing (v1 saves lack this field)
  const rawAchievements = data.earnedAchievements;
  const achievementsArr: AchievementId[] = Array.isArray(rawAchievements)
    ? (rawAchievements as unknown[]).filter((x): x is AchievementId =>
        typeof x === 'string' &&
        ['badge_10', 'badge_25', 'badge_50', 'badge_61'].includes(x as string)
      )
    : [];

  // streakCount — default 0 if missing
  const streakVal = typeof data.streakCount === 'number' ? data.streakCount : 0;

  // lastCompletedDate — default null if missing
  const lastDateVal =
    typeof data.lastCompletedDate === 'string' ? data.lastCompletedDate : null;

  // hintBalance — default 0 if missing (v2 save files lack this field)
  const hintBalanceVal = typeof data.hintBalance === 'number' ? data.hintBalance : 0;

  // purchasedNoAds — default false if missing (v2 save files lack this field)
  const purchasedNoAdsVal = typeof data.purchasedNoAds === 'boolean'
    ? data.purchasedNoAds
    : false;

  // Apply to stores
  stores.setUnlocked(unlockedArr);
  stores.setDiscoveries(discArr);
  stores.setScore(scoreVal);
  stores.setEarnedAchievements(achievementsArr);
  stores.setStreakCount(streakVal);
  stores.setLastCompletedDate(lastDateVal);
  stores.setHintBalance(hintBalanceVal);
  stores.setPurchasedNoAds(purchasedNoAdsVal);

  return { ok: true, warning };
}
