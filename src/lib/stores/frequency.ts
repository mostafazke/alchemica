import { writable } from 'svelte/store';

const FREQ_KEY = 'alchemica_frequency';

function loadFrequency(): Record<string, number> {
  try {
    const raw = localStorage.getItem(FREQ_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export const elementFrequency = writable<Record<string, number>>(loadFrequency());

// Write-through: every store update persists immediately
elementFrequency.subscribe((freq) => {
  try {
    localStorage.setItem(FREQ_KEY, JSON.stringify(freq));
  } catch {
    // localStorage full — silently degrade. Frequency is cosmetic.
  }
});

export function incrementFrequency(elementKey: string): void {
  elementFrequency.update((freq) => ({
    ...freq,
    [elementKey]: (freq[elementKey] ?? 0) + 1,
  }));
}
