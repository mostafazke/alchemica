/**
 * event.ts — Element of the Week event store.
 *
 * Reads from the version-controlled events.json config.
 * Computes the currently active event (startDate ≤ today ≤ endDate).
 * Tracks per-event dismissal in localStorage so banners stay dismissed.
 */
import { writable, derived } from 'svelte/store';
import eventsData from '../data/events.json';

export interface WeeklyEvent {
  id: string;
  title: string;
  description: string;
  startDate: string;   // YYYY-MM-DD
  endDate: string;     // YYYY-MM-DD
  targetElement: string;
  iconKey: string;
}

const DISMISSED_KEY = 'alchemica_dismissed_events';

function loadDismissed(): Set<string> {
  try {
    const raw = localStorage.getItem(DISMISSED_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

function saveDismissed(ids: Set<string>): void {
  try {
    localStorage.setItem(DISMISSED_KEY, JSON.stringify([...ids]));
  } catch {
    // ignore
  }
}

function getTodayStr(): string {
  return new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
}

/** Set of event IDs the player has permanently dismissed. */
export const dismissedEvents = writable<Set<string>>(
  typeof localStorage !== 'undefined' ? loadDismissed() : new Set()
);

dismissedEvents.subscribe((ids) => {
  if (typeof localStorage !== 'undefined') saveDismissed(ids);
});

/** Dismiss an event by ID — persists across sessions. */
export function dismissEvent(id: string): void {
  dismissedEvents.update((s) => { s.add(id); return new Set(s); });
}

/** The currently active, non-dismissed event, or null. */
export const activeEvent = derived(dismissedEvents, ($dismissed): WeeklyEvent | null => {
  const today = getTodayStr();
  for (const ev of eventsData as WeeklyEvent[]) {
    if (ev.startDate <= today && today <= ev.endDate && !$dismissed.has(ev.id)) {
      return ev;
    }
  }
  return null;
});

/** Days remaining in the active event (inclusive of end day). Minimum 1 when active. */
export function daysRemaining(endDate: string): number {
  const end = new Date(endDate);
  const today = new Date();
  // Compare date parts only
  today.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  const diff = Math.round((end.getTime() - today.getTime()) / 86_400_000);
  return Math.max(1, diff + 1); // inclusive
}
