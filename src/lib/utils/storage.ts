/**
 * storage.ts — Versioned save export/import
 * Handles downloadable JSON save files with schema migration support.
 */
import { get } from 'svelte/store';
import { unlockedElements, discoveries, score } from '../stores/game.js';

export const EXPORT_VERSION = 1;

export interface SaveFile {
  version: number;
  exportedAt: string; // ISO date string
  data: {
    unlockedElements: string[];
    discoveries: Array<{ key: string; recipe: string; timestamp: number }>;
    score: number;
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

  // Apply to stores
  stores.setUnlocked(unlockedArr);
  stores.setDiscoveries(discArr);
  stores.setScore(scoreVal);

  return { ok: true, warning };
}
