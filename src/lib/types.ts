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
