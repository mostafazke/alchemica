export type Category = 'basic' | 'fire' | 'water' | 'earth' | 'air' | 'metal' | 'energy' | 'gas' | 'compound';

export interface Element {
  name: string;
  symbol: string;
  category: Category;
  color: string;
  desc: string;
  formula: string;
  recipe?: string;
}

export interface Discovery {
  key: string;
  recipe: string;
  timestamp: number;
}

export interface GameState {
  version: number;
  unlockedElements: string[];
  discoveries: Discovery[];
  score: number;
}

export interface Slots {
  a: string | null;
  b: string | null;
}

/** Per D-14: Union of all achievement badge IDs. Add new IDs here when new badges are introduced. */
export type AchievementId = 'badge_10' | 'badge_25' | 'badge_50' | 'badge_61';

/**
 * V2 save data shape stored under the 'alchemica_v1' localStorage key.
 * Per D-01 (same key, version bump to 2), D-03 (streak fields), D-05 (earnedAchievements field).
 */
export interface SaveDataV2 {
  version: 2;
  data: {
    unlockedElements: string[];
    discoveries: Discovery[];
    score: number;
    earnedAchievements: string[];   // serialized as array; reconstructed as Set<AchievementId> on load (D-13)
    streakCount: number;            // per D-03
    lastCompletedDate: string | null; // ISO date YYYY-MM-DD, per D-03
  };
}
