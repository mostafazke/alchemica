import { REACTIONS } from '../data/reactions.js';
import { ELEMENTS } from '../data/elements.js';
import { get } from 'svelte/store';
import { unlockedElements, discoveries, combo, score, lastSuccess } from '../stores/game.js';
import type { Discovery } from '../types.js';

export function resolveReaction(a: string, b: string): { result: string | null; isNew: boolean } {
  const key = `${a}+${b}`;
  const result = REACTIONS[key] ?? null;
  const isNew = result !== null && !get(unlockedElements).has(result);
  return { result, isNew };
}

export function applyReaction(a: string, b: string): { result: string | null; isNew: boolean } {
  const key = `${a}+${b}`;
  const result = REACTIONS[key] ?? null;

  if (result) {
    const currentCombo = get(combo);
    const wasSuccess = get(lastSuccess);
    const newCombo = wasSuccess ? Math.min(currentCombo + 1, 8) : 1;
    const isNew = !get(unlockedElements).has(result);

    combo.set(newCombo);
    lastSuccess.set(true);

    const points = isNew ? 100 * newCombo : 10 * newCombo;
    score.update((s) => s + points);

    if (isNew) {
      unlockedElements.update((s) => { s.add(result); return new Set(s); });
      const discovery: Discovery = {
        key: result,
        recipe: ELEMENTS[result]?.recipe ?? `${ELEMENTS[a]?.name ?? a} + ${ELEMENTS[b]?.name ?? b}`,
        timestamp: Date.now(),
      };
      discoveries.update((d) => [discovery, ...d]);
    } else {
      // Still need to trigger the store update for reactivity (element already known)
      unlockedElements.update((s) => new Set(s));
    }

    return { result, isNew };
  } else {
    lastSuccess.set(false);
    combo.set(1);
    return { result: null, isNew: false };
  }
}
