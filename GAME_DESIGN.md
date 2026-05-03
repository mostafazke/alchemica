# GAME_DESIGN.md
# alchemica — Science Lab: Element Fusion

> Feed this file to Claude Code / Copilot at the start of every session as context.
> Last updated: 2026-05-02

---

## 1. Game Overview

**Title:** alchemica
**Genre:** Casual / Educational puzzle
**Platform:** Mobile-first PWA (iOS + Android via browser, offline-capable)
**Target audience:** Ages 10+ — casual players and science-curious students
**Core fantasy:** "I am a scientist discovering the building blocks of the universe"
**Repo:** https://github.com/mostafazke/alchemica
**Current shipped:** v2 (achievements + daily challenge + streak)

---

## 2. Core Design Pillars

1. **Discovery first, education second** — Players feel like explorers, not students. Learning is a side effect.
2. **One more reaction** — Every session should end with the player wanting to try one more combo.
3. **Real science, simplified mechanics** — Reactions are inspired by real chemistry but prioritize fun over accuracy.
4. **Reward completionists** — Achievement badges and the daily streak give depth without blocking casual play.

---

## 3. Core Mechanic

Players combine two elements in a mixing chamber to discover new compounds or elements.

```
Element A + Element B → Result (or "No Reaction")
```

- Each combination is deterministic — same inputs always produce the same output
- Order does not matter: `Fire + Water === Water + Fire` (both orderings stored in reaction map)
- Invalid combinations show a failure state
- Results unlock the new element permanently into the player's shelf
- Progress auto-saves to localStorage on every change

---

## 4. Element System

### 4.1 Categories

| Category  | CSS Token       | Description                          |
|-----------|-----------------|--------------------------------------|
| basic     | `cat-fire` etc  | Starting elements (4 total)          |
| gas       | `cat-gas`       | Atmospheric and volatile elements    |
| metal     | `cat-metal`     | Metallic substances                  |
| energy    | `cat-energy`    | Forces and radiation                 |
| compound  | `cat-compound`  | Multi-element compounds              |
| earth     | `cat-earth`     | Geological materials                 |
| water     | `cat-water`     | Liquid-phase substances              |
| fire      | `cat-fire`      | Combustion-family elements           |
| air       | `cat-air`       | Gas-phase starting family            |

### 4.2 Starting Elements (always unlocked)

| Key   | Name  | Symbol | Formula |
|-------|-------|--------|---------|
| fire  | Fire  | 🔥     | ⚡       |
| water | Water | 💧     | H₂O     |
| earth | Earth | 🪨     | SiO₂    |
| air   | Air   | 🌬     | N₂O₂    |

### 4.3 Element Data Schema (TypeScript — `src/lib/types.ts`)

```typescript
export type Category =
  | 'basic' | 'fire' | 'water' | 'earth' | 'air'
  | 'metal' | 'energy' | 'gas' | 'compound';

export interface Element {
  name: string;
  symbol: string;       // emoji or text (e.g. 'O₂')
  category: Category;
  color: string;        // CSS class token e.g. 'cat-metal'
  desc: string;         // 1–2 sentence scientific description
  formula: string;      // chemical formula (display only)
  recipe?: string;      // human-readable e.g. "Fire + Water"
}
```

> **Adding new elements:** Edit `src/lib/data/elements.ts` only. No UI code changes needed.

### 4.4 Reaction Data Schema (`src/lib/data/reactions.ts`)

```typescript
// Two-element lookup: 'a+b' → result key. Both orderings stored.
export const REACTIONS: Record<string, string> = {
  'fire+water': 'steam',
  'water+fire': 'steam',
  // ...
};

// Three-element reactions (rare): sorted 'a+b+c' key.
export const MULTI_REACTIONS: Record<string, string> = {
  'fire+earth+earth': 'iron',
  // ...
};
```

> Keys use `+` separator, both orderings stored for two-element reactions. Sorting handled at lookup time for multi-reactions.

---

## 5. Achievement System (v2, shipped)

### 5.1 Milestone Badges

| ID        | Name        | Emoji | Threshold |
|-----------|-------------|-------|-----------|
| badge_10  | Apprentice  | 🔬    | 10 elements discovered |
| badge_25  | Alchemist   | ⚗️    | 25 elements discovered |
| badge_50  | Sage        | 🔮    | 50 elements discovered |
| badge_61  | Grand Master| ✨    | All 61 elements discovered |

- Badges fire exactly once per threshold crossing (no re-fire on duplicate reactions or save import)
- v1 saves are back-filled on first v2 load — no player loses earned progress
- Earned badges persist in localStorage (versioned schema v2)

### 5.2 Achievement UI Flow

```
Player discovers 10th element
  → applyReaction() returns { newBadge: 'badge_10' }
  → MixingChamber pushes 'badge_10' to toastQueue store
  → AchievementToast drains queue: shows emoji + name for 2.5s at top of screen
  → TopBar discovery counter pulses gold for 800ms
  → playChime() fires (iOS-safe Web Audio, mutable via Settings)
```

### 5.3 Achievement Gallery

- Opened via 🏆 Badges button in BottomBar
- Full-screen overlay, 2×2 grid of 4 badges
- Earned: full opacity + ✓ Earned label
- Locked: 0.45 opacity + 🔒 + "N elements needed"

---

## 6. Daily Challenge & Streak (v2, shipped)

### 6.1 Daily Challenge

- One target element per calendar day — same for all players (date-seeded deterministic hash)
- Auto-completes when the player creates the target element during normal play
- Completion shows a gold-bordered banner in the DailyChallenge component below the mixing chamber
- Completed state persists (stored as `lastCompletedDate` ISO string)

### 6.2 Streak

- Increments by 1 each calendar day the player completes the daily challenge
- Resets to 0 if a full calendar day is missed
- Always visible: `🔥 N day streak` or `🔥 Start your streak!`
- Persisted in localStorage as `streakCount` in SaveDataV2

---

## 7. Scoring System

```
Base score per reaction outcome:
  - New discovery:         100 pts × combo
  - Known element again:    10 pts × combo

Combo multiplier:
  - Consecutive successes build combo: ×1 → ×2 → ... → ×8 (max)
  - Any failure ("No Reaction") resets combo to ×1
  - Final score displayed in TopBar
```

> Planned v3: streak bonus — active streak adds a temporary combo multiplier.

---

## 8. State Management

### 8.1 Persistent State (localStorage, key `alchemica_v1`, versioned)

```typescript
interface SaveDataV2 {
  version: 2;
  data: {
    unlockedElements: string[];       // element keys (Set reconstructed on load)
    discoveries: Discovery[];         // ordered by timestamp desc
    score: number;
    earnedAchievements: string[];     // AchievementId[] serialized (Set on load)
    streakCount: number;
    lastCompletedDate: string | null; // 'YYYY-MM-DD' local date
  };
}

interface Discovery {
  key: string;
  recipe: string;
  timestamp: number;
}
```

Migration path: v1 → v2 is handled in `stores/game.ts` on load. Always bump `SAVE_VERSION` constant and add a migration branch when changing the schema.

### 8.2 Reactive Stores (Svelte writable, `src/lib/stores/`)

| Store file         | Exports                                      |
|--------------------|----------------------------------------------|
| `game.ts`          | `unlockedElements`, `discoveries`, `slots`, `combo`, `score` |
| `achievements.ts`  | `earnedAchievements` (Set), `streakCount`, `lastCompletedDate` |
| `daily.ts`         | `dailyChallengeTarget`, `dailyCompleted` (derived) |
| `settings.ts`      | `soundMuted` (persists to `alchemica_settings`) |
| `toast.ts`         | `toastQueue` (FIFO AchievementId[])           |

### 8.3 Session State (in-component Svelte runes)

```typescript
// In +page.svelte
let shelfOpen = $state(false);
let discoverySheetOpen = $state(false);
let settingsOpen = $state(false);
let achievementsOpen = $state(false);
```

---

## 9. UI Architecture

### 9.1 Layout (Mobile Portrait)

```
┌─────────────────────────┐
│        TOP BAR          │  N/61 discovered · combo · score · reset
├──────────┬──────────────┤
│          │  MIXING      │
│  SHELF   │  CHAMBER     │  Left: element shelf (slide-in drawer on mobile)
│ (drawer) │              │  Center: slots A + B + React button
│          │  DAILY       │  Daily challenge card (below chamber)
│          │  CHALLENGE   │
├──────────┴──────────────┤
│        BOTTOM BAR       │  🧪 Elements · 📋 Discoveries · 🏆 Badges · ⚙ Settings
└─────────────────────────┘

Overlays (fixed, z-indexed):
  - BottomSheet   → discovery log (swipe up)
  - SettingsPanel → settings (center modal)
  - AchievementGallery → badges (center modal)
  - AchievementToast   → unlock notification (top center, auto-dismiss)
  - ElementDetail      → long-press element info
```

### 9.2 Responsive Breakpoints

| Breakpoint          | Grid                                    |
|---------------------|-----------------------------------------|
| Mobile ≤768px       | 1-column; shelf is a fixed slide-in drawer |
| Tablet 769–1024px   | 2-column: shelf sidebar + center        |
| Desktop ≥1025px     | 3-column: shelf + center + discovery log |

### 9.3 Interaction Model

| Action                  | Gesture          |
|-------------------------|------------------|
| Select element for slot | Tap              |
| View element details    | Long press       |
| Clear slot              | Tap filled slot  |
| React                   | Tap React button |
| Browse shelf categories | Horizontal swipe |
| Open discovery log      | 📋 Discoveries button or swipe up |
| Get a hint              | HintButton (30s cooldown) |

---

## 10. Sound Design

**Implementation:** Web Audio API — lazy `AudioContext` singleton, `ctx.resume()` before scheduling (iOS-safe). No external library. Fails silently if Web Audio unavailable.

**Current sounds:**
| Event                  | Implementation                          |
|------------------------|-----------------------------------------|
| Achievement unlock     | `playChime()` — C5→E5 oscillator notes  |

**Planned v3 sounds:**
| Event               | Description                              |
|---------------------|------------------------------------------|
| Valid reaction      | Bubbling glub-glub, ~300ms               |
| New discovery       | 5-note fanfare, ~1.5s                    |
| Failure             | Dull thud, ~200ms                        |
| Combo increase      | Ascending whoosh, ~300ms                 |

> Sound assets (v3): source from Freesound.org (CC0) or commission. No Howler.js dependency — use Web Audio API wrappers in `src/lib/effects/`.

---

## 11. Visual Effects

**Implementation:** Canvas API (`src/lib/effects/particles.ts`), object pooling, rAF with delta time. Pauses on `visibilitychange`. Scales particle count with `navigator.hardwareConcurrency`.

| Trigger         | Particle effect      |
|-----------------|----------------------|
| Successful React| `triggerSuccessParticles()` — burst from chamber center |
| Failed React    | `triggerFailParticles()` — dissipate effect |

---

## 12. Technical Stack

```
Framework:    SvelteKit + Svelte 5 (runes: $state, $derived, $effect)
Language:     TypeScript
Build:        Vite 8
Adapter:      @sveltejs/adapter-static (full static export for PWA)
PWA:          vite-plugin-pwa + Workbox (precaches all assets)
Styling:      Scoped <style> blocks per component + CSS custom properties
State:        Svelte writable stores (no NgRx, no Zustand, no external state lib)
Storage:      localStorage (versioned save format — migrate to IndexedDB only if >5MB needed)
Particles:    Canvas API (vanilla — no Matter.js, no game engine)
Audio:        Web Audio API (vanilla — no Howler.js)
Testing:      Vitest (unit) + Playwright (e2e)
Hosting:      Static CDN (GitHub Pages or S3 + CloudFront)
```

**Bundle constraint:** <200KB gzipped. No runtime framework overhead.

---

## 13. Progression Tiers (current 61 elements)

```
TIER 0 — Starter (4)
  fire, water, earth, air

TIER 1 — Basic combinations (7)
  steam, mud, dust, lava, wind, plasma, cloud

TIER 2 — Secondary (8)
  rain, iron, salt, ice, smoke, glass, sand, volcano

TIER 3 — Advanced (9)
  oxygen, hydrogen, storm, obsidian, rust, crystal, lightning, magnet, rainbow

TIER 4 — Complex (10)
  acid_rain, sunlight, steam_engine, stone, fog, snow, flood, wood, ash, coal

TIER 5 — Industrial (11)
  carbon, steel, clay, brick, sulfur, acid, copper, bronze, gold, plant, seed

TIER 6 — Modern / Legendary (12)
  tree, oil, plastic, explosion, rocket, electricity, motor, life, animal, human, city, tornado
```

---

## 14. Hint System

- **HintButton** in MixingChamber — 30s cooldown timer displayed
- `getHint()` in `game/reactions.ts` — finds a valid unused combination for unlocked elements, excluding both slots if filled
- Hint persists across reloads (`hintCooldownEndsAt` in localStorage)
- Planned v3: Hint bundle IAP (purchasable hints, no cooldown)

---

## 15. Monetization Roadmap

> Do not implement monetization until v3. Validate retention metrics from v1+v2 first.

| Feature         | Model        | Milestone | Notes                            |
|-----------------|--------------|-----------|----------------------------------|
| Hint pack       | IAP          | v3        | 10 hints for ~$0.99              |
| Remove ads      | IAP one-time | v3        | $2.99–$4.99                      |
| Rewarded ads    | AdMob        | v3        | Watch ad = 1 free hint           |
| Lab themes      | IAP cosmetic | v4        | Color themes / element icon sets |
| School license  | B2B SaaS     | v4+       | Classroom dashboard + progress   |

**Prerequisite:** Capacitor native wrapper (v3) for AdMob + IAP plugin access.

---

## 16. Shipped Milestones

| Milestone | Status | Phases | Requirements | Key deliverables |
|-----------|--------|--------|--------------|------------------|
| v1 — Mobile PWA | ✅ SHIPPED | 1–5 (25 plans) | 27/27 | SvelteKit scaffold, 61 elements, offline PWA, localStorage save, hint system, Web Share API |
| v2 — Achievements & Daily Hook | ✅ SHIPPED | 6–8 (16 plans) | 21/21 | Badge milestones, achievement gallery, toast, chime, daily challenge, streak, v1→v2 migration |

---

## 17. Claude Code / Copilot Session Guide

Start each session with:
```
"Read GAME_DESIGN.md. Today's task: [specific feature]."
```

**Good session scopes:**
- "Implement the Capacitor native wrapper and configure android platform"
- "Add AdMob rewarded ad integration for hint earn flow"
- "Build the Periodic Table Codex component with unlock animation"
- "Add streak bonus — multiply combo by 1.5× when streak > 0"
- "Implement sound effects for valid reaction, new discovery, and failure"

**Bad session scopes (too vague):**
- "Make the game feel better"
- "Add more elements"
- "Fix the UI"

Always commit after each working session. Element and reaction data lives in:
- `src/lib/data/elements.ts` — `ELEMENTS` record (source of truth)
- `src/lib/data/reactions.ts` — `REACTIONS` + `MULTI_REACTIONS` maps (source of truth)

**Never put element or reaction data in component files.**
