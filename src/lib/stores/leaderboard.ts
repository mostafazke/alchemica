import { derived } from 'svelte/store';
import { discoveries } from './game.js';

export interface LeaderboardEntry {
  rank: number;
  name: string;
  weeklyCount: number;
  isPlayer: boolean;
}

// ── Seeded PRNG (mulberry32) ───────────────────────────────────────────────
function mulberry32(seed: number) {
  let s = seed;
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ── Week helpers ───────────────────────────────────────────────────────────

/** Returns the most recent Monday at 00:00 UTC. */
function getWeekStart(): Date {
  const now = new Date();
  const dow = now.getUTCDay(); // 0=Sun … 6=Sat
  const daysBack = (dow + 6) % 7;
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - daysBack)
  );
}

/** ISO week number (1–53) — used as deterministic seed component. */
function getISOWeek(d: Date): number {
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

// ── Name generation ────────────────────────────────────────────────────────

const ADJECTIVES = [
  'Atomic', 'Bold', 'Brave', 'Bright', 'Calm', 'Clever', 'Cosmic', 'Curious',
  'Deft', 'Eager', 'Fiery', 'Fluid', 'Grand', 'Hardy', 'Iron', 'Just',
  'Keen', 'Lunar', 'Noble', 'Radiant', 'Swift', 'Vital', 'Wise', 'Zeal',
];
const ELEMENT_NAMES = [
  'Argon', 'Carbon', 'Cobalt', 'Copper', 'Gallium', 'Gold', 'Helium',
  'Hydrogen', 'Iodine', 'Iron', 'Krypton', 'Neon', 'Nickel', 'Oxygen',
  'Radium', 'Silicon', 'Silver', 'Sodium', 'Tin', 'Xenon', 'Zinc',
];

const NAME_KEY = 'alchemica_player_name';

function makePlayerName(): string {
  if (typeof localStorage === 'undefined') return 'Curious Helium';
  const stored = localStorage.getItem(NAME_KEY);
  if (stored) return stored;
  // One-time random assignment — not week-seeded so it stays stable
  const rng = mulberry32(Math.floor(Math.random() * 0xffffff));
  const name =
    ADJECTIVES[Math.floor(rng() * ADJECTIVES.length)] +
    ' ' +
    ELEMENT_NAMES[Math.floor(rng() * ELEMENT_NAMES.length)];
  localStorage.setItem(NAME_KEY, name);
  return name;
}

// ── Ghost generation (deterministic per week) ──────────────────────────────

function generateGhosts(
  weekSeed: number,
  count: number
): Array<{ name: string; weeklyCount: number }> {
  const rng = mulberry32(weekSeed);
  const out: Array<{ name: string; weeklyCount: number }> = [];
  for (let i = 0; i < count; i++) {
    const adj = ADJECTIVES[Math.floor(rng() * ADJECTIVES.length)];
    const el = ELEMENT_NAMES[Math.floor(rng() * ELEMENT_NAMES.length)];
    // Ghost discovery counts: bell-shaped 1–20 range
    const weeklyCount = Math.floor(rng() * 20) + 1;
    out.push({ name: `${adj} ${el}`, weeklyCount });
  }
  return out;
}

// ── Derived leaderboard store ──────────────────────────────────────────────

export const leaderboard = derived(discoveries, ($discoveries) => {
  const weekStart = getWeekStart();
  const weekStartMs = weekStart.getTime();

  // Player's weekly discovery count
  const playerWeeklyCount = $discoveries.filter((d) => d.timestamp >= weekStartMs).length;

  // Deterministic seed = year * 100 + isoWeek (changes each Monday)
  const now = new Date();
  const weekSeed = (now.getUTCFullYear() * 100 + getISOWeek(now)) * 1337;

  const playerName = makePlayerName();
  const ghosts = generateGhosts(weekSeed, 9);

  const allEntries = [
    { name: playerName, weeklyCount: playerWeeklyCount, isPlayer: true },
    ...ghosts.map((g) => ({ ...g, isPlayer: false })),
  ];

  // Sort: most discoveries first, then alphabetical on ties
  allEntries.sort(
    (a, b) => b.weeklyCount - a.weeklyCount || a.name.localeCompare(b.name)
  );

  return allEntries.map((e, i) => ({ ...e, rank: i + 1 })) as LeaderboardEntry[];
});

/** The player's own generated display name. */
export function getPlayerName(): string {
  return makePlayerName();
}
