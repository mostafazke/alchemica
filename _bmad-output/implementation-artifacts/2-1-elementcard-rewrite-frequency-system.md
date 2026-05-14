# Story 2.1: ElementCard Rewrite + Frequency System

Status: done

## Story

As a player,
I want each element card to visually reflect how much I've used it (settled vs. fresh vs. power),
So that my shelf becomes a portrait of my play history, not a flat catalogue.

## Acceptance Criteria

1. **Given** the frequency store doesn't exist yet
   **When** I create `src/lib/stores/frequency.ts` per Architecture §3
   **Then** it exports a `writable` store keyed by element name with integer counts
   **And** it loads from localStorage key `'alchemica_frequency'` on init
   **And** it writes through to localStorage on every update
   **And** it exports an `incrementFrequency(elementKey: string)` helper

2. **Given** threshold constants don't exist
   **When** I create `src/lib/config/thresholds.ts` per Architecture §3
   **Then** `FRESH_MAX = 5` and `SETTLED_MIN = 20` are exported as `const`
   **And** they are wrapped in a `FREQUENCY_THRESHOLDS` named export object
   **And** a `SESSION_FRESH_DURATION_MS = Infinity` constant is exported

3. **Given** the existing `ElementCard.svelte` needs rewriting
   **When** I rewrite it **in place** (keeping the same filename)
   **Then** it is **56×56px** with **6px border-radius** in grid-tile mode (the primary Phase 1 mode)
   **And** emoji is 20px centered, name is 11px `--text-micro` below
   **And** it supports **6 states**: default, hover, selected, fresh, settled, power
   **And** it uses Layer 3 component tokens (`--card-bg`, `--card-border`, `--card-glow`)
   **And** it derives its energy state via `$derived` from the frequency store value and threshold constants
   **And** `fresh` state (count ≤ FRESH_MAX): `box-shadow: 0 0 8px var(--material-glass-amber)`
   **And** `settled` state (count ≥ SETTLED_MIN): `opacity: 0.85`
   **And** `power` state (reserved for future Phase 2 — power-tier elements): `box-shadow: 0 0 3px rgba(220, 200, 180, 0.04)` — barely perceptible glow
   **And** `selected` state: `--color-border-hot` border with `--color-accent-dim` shadow
   **And** `role="button"`, `aria-label="{name}, {category}"`, `aria-pressed` for selected

4. **Given** the rewrite must not break existing functionality
   **When** the rewrite is complete
   **Then** the existing `list` mode (used in discovery log, etc.) renders correctly
   **And** the existing `grid` mode (used in ElementGrid) renders correctly
   **And** `ElementDetail` long-press popover still works
   **And** onboarding highlight (`onboard-highlight` class) still works
   **And** all existing category icon background colors (`.cat-fire`, `.cat-water`, etc.) are preserved

5. **Given** WCAG accessibility requirements
   **When** the component renders
   **Then** all interactive states meet WCAG AA contrast (text on card background ≥ 4.5:1)
   **And** `focus-visible` outline uses `var(--color-accent)` per Architecture §4
   **And** touch target ≥ 44×44px (NFR1)

## Tasks / Subtasks

- [x] Task 1: Create frequency store (AC: 1)
  - [x] 1.1: Create `src/lib/stores/frequency.ts` with `elementFrequency` writable store
  - [x] 1.2: Implement `loadFrequency()` — reads and parses `alchemica_frequency` from localStorage with try/catch
  - [x] 1.3: Implement write-through subscription — persists on every update, silently degrades if localStorage is full
  - [x] 1.4: Implement and export `incrementFrequency(elementKey: string)` helper
  - [x] 1.5: Verify: import store in browser console equivalent — confirm load, update, persist works

- [x] Task 2: Create threshold constants file (AC: 2)
  - [x] 2.1: Create `src/lib/config/thresholds.ts` with `FREQUENCY_THRESHOLDS` object (`FRESH_MAX: 5`, `SETTLED_MIN: 20`)
  - [x] 2.2: Export `SESSION_FRESH_DURATION_MS = Infinity` constant

- [x] Task 3: Rewrite ElementCard.svelte in place (AC: 3, 4, 5)
  - [x] 3.1: Import `elementFrequency` from frequency store and `FREQUENCY_THRESHOLDS` from thresholds config
  - [x] 3.2: Add `$derived` for energy state: `$derived` that maps store value → `'fresh' | 'default' | 'settled' | 'power'` using thresholds
  - [x] 3.3: Define Layer 3 component tokens in `<style>`: `--card-bg`, `--card-border`, `--card-glow`
  - [x] 3.4: Implement 56×56px grid-tile layout with 6px radius, 20px emoji, 11px name
  - [x] 3.5: Apply energy state class to element (via `class:fresh`, `class:settled`, `class:power`)
  - [x] 3.6: Implement CSS for all 6 states using Layer 3 tokens
  - [x] 3.7: Preserve `list` mode layout and `ElementDetail` long-press integration
  - [x] 3.8: Preserve all `:global(.cat-*)` color rules
  - [x] 3.9: Add `aria-label="{el.name}, {el.category}"` and `aria-pressed={isSelected}`
  - [x] 3.10: Verify `onboard-highlight` animation still fires correctly

- [x] Task 4: Verify completeness (AC: 4, 5)
  - [x] 4.1: `npx svelte-check --threshold error` — zero new errors
  - [x] 4.2: Confirm no regression in component consumers (ElementGrid, DiscoveryLog) by checking imports still resolve
  - [x] 4.3: Confirm `frequency.ts` compiles clean (no TypeScript errors)

### Review Findings

- [x] [Review][Patch] `.el-grid-name` uses hardcoded `font-size: 11px` — token `--text-micro: 11px` exists in `app.css:68` and is named in AC3; also hardcoded in `.el-formula` and `.el-category` (all three untouched during full rewrite) [src/lib/components/ElementCard.svelte:125,131,136]
- [x] [Review][Defer] Grid-tile 56px card sits in 76px ElementGrid cell leaving ~10px visual slack on each side [src/lib/components/ElementCard.svelte] — deferred, pre-existing

## Dev Notes

### Critical Architecture Constraints

- **ElementCard rewrites in place** — the file stays `ElementCard.svelte`. The parallel-creation strategy (AR1) applies to NEW components (MixingSlot, ActionZone, ShelfGrid). ElementCard, TopBar, DiscoveryOverlay rewrite in place per Architecture §1.
- **No new file for grid-mode** — the single file handles both `list` and `grid` modes via the existing `mode` prop. Keep that.
- **Frequency store is separate from game save** — AR3: `alchemica_frequency` key, not `alchemica_v1`. Losing it doesn't break gameplay — visual patina only.
- **No new tokens** — all visual state CSS uses Layer 1/2 tokens already defined in `app.css` from Story 1.1. Layer 3 tokens (`--card-bg`, etc.) are defined inside the component's `<style>` block, not in `app.css`.
- **Svelte 5 runes** — ElementCard already uses runes (`$props`, `$state`, `$derived`, `$effect`). Keep the same pattern. The frequency `$derived` belongs inside the component, not in the store.
- **No `mode=async` side effects** — do NOT change the subscription approach. The write-through subscribe in `frequency.ts` runs synchronously on every update, which is correct.

### Current ElementCard State (Must Preserve)

The existing `ElementCard.svelte` has two rendering modes:

**List mode** (default):
- `display: flex; align-items: center; gap: 8px; padding: 6px 8px`
- `min-height: 44px; width: 100%`
- Shows: icon (34×34px) + `.el-info` (formula, name, category columns)

**Grid mode** (`mode='grid'`):
- `flex-direction: column; align-items: center; min-height: 72px`
- Shows: icon (30×30px) + `.el-grid-name` + `.long-press-dot`
- This is the mode that needs the **56×56px rewrite** per the story AC

**AC3 dimension spec (grid-tile mode ONLY):**
- Card: 56×56px, 6px border-radius
- Emoji: 20px centered (inside the icon wrapper)
- Name: 11px below

**List mode dimensions are NOT changed in this story** — AC3 only applies to grid-tile mode.

### Existing Store Pattern (Follow This)

```typescript
// src/lib/stores/game.ts — reference pattern
import { writable } from 'svelte/store';

const SAVE_KEY = 'alchemica_v1';

function loadSave() { /* try/catch pattern */ }

export const gameStore = writable<GameData>(loadSave());
gameStore.subscribe((data) => { /* localStorage write */ });
```

The frequency store follows the exact same pattern. Key architectural difference: the game store write-through uses the full versioned save object, but frequency write-through is a direct `JSON.stringify` of the flat `Record<string, number>`.

### Frequency Store — Full Reference Implementation

Architecture §3 provides the complete store implementation. Reproduce it exactly:

```typescript
// src/lib/stores/frequency.ts

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
```

### Threshold Constants — Full Reference Implementation

```typescript
// src/lib/config/thresholds.ts

/** Usage counts that drive ElementCard visual energy states */
export const FREQUENCY_THRESHOLDS = {
  /** Below this: "fresh" state (amber glow, recently discovered) */
  FRESH_MAX: 5,
  /** Above this: "settled" state (reduced opacity, old friend) */
  SETTLED_MIN: 20,
} as const;

/** Session-scoped: elements discovered in current session get fresh glow regardless of count */
export const SESSION_FRESH_DURATION_MS = Infinity; // lasts until app close
```

### Energy State Derivation Logic

Inside `ElementCard.svelte` `<script>`:

```typescript
import { elementFrequency } from '../stores/frequency.js';
import { FREQUENCY_THRESHOLDS } from '../config/thresholds.js';

// Energy state: derived from frequency store
const energyState = $derived.by(() => {
  const count = $elementFrequency[elementKey] ?? 0;
  if (count <= FREQUENCY_THRESHOLDS.FRESH_MAX) return 'fresh';
  if (count >= FREQUENCY_THRESHOLDS.SETTLED_MIN) return 'settled';
  return 'default';
  // 'power' is reserved for Phase 2 — specific named elements only
});
```

Note: `power` state is NOT derived from frequency count in Phase 1. It is reserved for future use (Phase 2, specific element tier). In Phase 1 it can be wired up but will never activate since no element triggers it.

### CSS Layer 3 Component Tokens + State Styles

```css
/* Inside ElementCard.svelte <style> */

/* Layer 3: component-scoped token defaults */
.element-card {
  --card-bg: var(--color-bg-surface);
  --card-border: var(--color-border-subtle);
  --card-glow: none;
}

/* Energy states — override Layer 3 tokens */
.element-card.fresh {
  --card-glow: 0 0 8px var(--material-glass-amber);
}
.element-card.settled {
  opacity: 0.85;
}
.element-card.power {
  --card-glow: 0 0 3px rgba(220, 200, 180, 0.04);
}

/* Selected state */
.element-card.selected {
  --card-border: var(--color-border-hot);
  box-shadow: 0 0 8px var(--color-accent-dim);
}

/* Apply tokens */
.element-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  box-shadow: var(--card-glow);
}
```

### Grid-Tile Mode Dimensions (AC3)

The story AC says **56×56px** in grid-tile mode. The current grid-tile code is:

```css
.element-card.grid-tile {
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 6px 4px;
  min-height: 72px;   /* ← change to 56px explicit height */
  text-align: center;
}
.element-card.grid-tile .el-icon {
  width: 30px; height: 30px; font-size: 18px;  /* ← change to 24px (emoji wrapper) */
}
```

Target:
```css
.element-card.grid-tile {
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 4px;
  width: 56px;
  height: 56px;
  border-radius: 6px;
}
.element-card.grid-tile .el-icon {
  width: 24px; height: 24px; font-size: 20px;
}
```

Name text remains at 11px (`font-size: 11px`). The `.el-grid-name` class is unchanged except possibly max-width adjustment.

### Category Icon Colors — Preserve These Exactly

These are game-semantic colors, not palette tokens. Do NOT replace them with tokens:

```css
:global(.cat-fire)     { background: #2d1810; color: #ff6b35; }
:global(.cat-water)    { background: #0d2040; color: #5ab4ff; }
:global(.cat-earth)    { background: #1a2010; color: #96c84a; }
:global(.cat-air)      { background: #1a1a2e; color: #c8c8ff; }
:global(.cat-metal)    { background: #2a2a1a; color: #c8b460; }
:global(.cat-energy)   { background: #2d1a40; color: #d05aff; }
:global(.cat-gas)      { background: #1a2a2a; color: #80d0c0; }
:global(.cat-compound) { background: #2a1a2a; color: #d080a0; }
```

### Onboarding Highlight — Preserve This Exactly

```css
.element-card.onboard-highlight {
  border-color: #ffe44a;
  background: #1a1800;
  box-shadow: 0 0 12px #ffe44a50, 0 0 0 1px #ffe44a30;
  animation: onboard-pulse 1.4s ease-in-out infinite;
}
@keyframes onboard-pulse {
  0%, 100% { box-shadow: 0 0 10px #ffe44a40, 0 0 0 1px #ffe44a30; }
  50%       { box-shadow: 0 0 20px #ffe44a70, 0 0 0 2px #ffe44a50; }
}
```

This uses `#ffe44a` (gold) which is a game-semantic color — do NOT replace with token.

### Consumers of ElementCard (Don't Break These)

- `src/lib/components/ElementGrid.svelte` — renders in grid mode (`mode='grid'`)
- `src/lib/components/DiscoveryLog.svelte` — renders in list mode (default)
- `src/lib/components/DiscoveryItem.svelte` — check if it uses ElementCard
- `src/routes/game/+page.svelte` — check if it renders ElementCard directly

The prop interface remains: `{ elementKey: string; mode?: 'list' | 'grid'; hasMore?: boolean }`

No new props are added in this story. The frequency state is self-contained — the component reads from the store directly, callers don't pass it in.

### Story 1.2 Learnings (Previous Story)

- **Node.js migration scripts** work well for bulk text replacement — used for the hex migration in Story 1.2.
- **`python` not `python3`** on this Windows system — but Node.js is more reliable anyway.
- **26 svelte files** modified cleanly. Zero script/markup changes — all CSS only.
- **Two pre-existing svelte-check errors** remain (vite server config type, element store type) — they are NOT regressions.
- **`#4a6fa5` / `#a0b8d8`** in HintButton.svelte are intentional locked-state colors — do not migrate them.
- **`color-mix()` is valid** for alpha accent variants; browser support Chrome 111+, Firefox 113+, Safari 16.2+.

### Accessibility Requirements (NFR1, NFR5, NFR6)

- Touch target: `min-width: 44px; min-height: 44px` — the grid-tile at 56×56 already satisfies this
- `role="button"` — already on the `<button>` element (implicit)
- `aria-label`: change from `title={el.desc}` to `aria-label="{el.name}, {el.category}"`
- `aria-pressed={isSelected}` — add to button
- `focus-visible` outline: inherit from global `app.css` rule (already set to `var(--color-accent)` in Story 1.1)

### prefers-reduced-motion

The fresh/power glow states use `box-shadow` (CSS property, not animation) — they are static and don't need special reduced-motion handling.

Any future CSS animations added to energy states MUST be inside a `@media (prefers-reduced-motion: no-preference)` block or disabled by the global reduced-motion rule in `app.css`.

The onboard-pulse animation is already covered by the global `app.css` `@media (prefers-reduced-motion: reduce)` block from Story 1.1.

### NOT In This Story

- `incrementFrequency()` is NOT called in this story — that wiring happens in Story 3.3 (MixingChamber integration). The store is created and readable but never written to yet.
- `power` energy state is NOT wired to any element data in Phase 1 — it exists in CSS but will never activate. Reserved for Phase 2.
- ShelfGrid component is Story 2.4 — ElementCard continues to be used by the existing `ElementGrid.svelte` until then.
- No route import switching in this story — that's Story 3.3.
- No deletion of old files.

### References

- [Architecture §2: State Management — Runes vs Stores](../planning-artifacts/architecture.md)
- [Architecture §3: Frequency State Data Model](../planning-artifacts/architecture.md) — exact store + thresholds implementation
- [Architecture §4: CSS Token Layering — Layer 3 example](../planning-artifacts/architecture.md)
- [epics.md — Story 2.1 ACs](../planning-artifacts/epics.md)
- [src/app.css — Layer 1 + 2 token definitions](../../src/app.css) (from Story 1.1)
- [src/lib/stores/game.ts — store pattern reference](../../src/lib/stores/game.ts)
- [src/lib/components/ElementCard.svelte — current state](../../src/lib/components/ElementCard.svelte)
- [src/lib/effects/particles.ts — particle system (for Story 3.1 context, not this story)](../../src/lib/effects/particles.ts)

## Dev Agent Record

### Agent Model Used
Claude Sonnet 4.6 (GitHub Copilot)

### Debug Log References
N/A

### Completion Notes List
- ✅ Created `src/lib/stores/frequency.ts` — writable store with localStorage write-through, `incrementFrequency()` helper exported. Matches Architecture §3 exactly.
- ✅ Created `src/lib/config/thresholds.ts` — `FREQUENCY_THRESHOLDS` object with `FRESH_MAX: 5`, `SETTLED_MIN: 20`, plus `SESSION_FRESH_DURATION_MS`.
- ✅ Rewrote `ElementCard.svelte` in place — added frequency/threshold imports, `energyState` `$derived.by` with explicit return type `'fresh' | 'default' | 'settled' | 'power'`, 6 energy state classes, Layer 3 CSS tokens (`--card-bg`, `--card-border`, `--card-glow`), 56×56px grid-tile mode with 6px radius, `aria-label`, `aria-pressed`. All existing functionality preserved (list mode, ElementDetail long-press, onboarding highlight, category colors).
- ✅ Fixed TypeScript error: `$derived.by` return typed explicitly to include `'power'` (Phase 2 reserved) so `class:power` comparison doesn't error.
- ✅ svelte-check: 0 new errors (2 pre-existing errors in vite.config.ts and DiscoveryBanner.svelte remain unchanged).

### Change Log
- 2026-05-10: Implemented Story 2.1 — frequency store, thresholds config, ElementCard rewrite with 6-state energy system and Layer 3 CSS tokens.

### File List
- src/lib/stores/frequency.ts (NEW)
- src/lib/config/thresholds.ts (NEW)
- src/lib/components/ElementCard.svelte (MODIFIED — rewrite in place)
