import type { AchievementId } from '../types.js';

export interface BadgeInfo {
  id: AchievementId;
  emoji: string;
  name: string;
  threshold: number;
}

export const BADGES: BadgeInfo[] = [
  { id: 'badge_10', emoji: '🔬', name: 'Apprentice',   threshold: 10 },
  { id: 'badge_25', emoji: '⚗️',  name: 'Alchemist',   threshold: 25 },
  { id: 'badge_50', emoji: '🔮', name: 'Sage',         threshold: 50 },
  { id: 'badge_61', emoji: '✨', name: 'Grand Master', threshold: 61 },
];
