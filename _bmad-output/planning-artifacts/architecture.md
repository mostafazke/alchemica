# Alchemica — Architecture (Phase 1 Visual Redesign)

> This document locks down technical decisions for Phase 1.
> It is consistent with [copilot_CODE_BRIEF.md](copilot_CODE_BRIEF.md) and must not contradict it.
> Where the brief says nothing, this document makes the simplest decision that doesn't close off future options.

---

## 1. Component File Structure

Phase 1 produces six components. Each is a single `.svelte` file with co-located styles. No CSS modules, no external stylesheets per component.

```
src/lib/components/
├── ElementCard.svelte          # existing — rewrite in place
├── MixingSlot.svelte           # new (replaces Slot.svelte)
├── ActionZone.svelte           # new (replaces ResultDisplay.svelte)
├── ShelfGrid.svelte            # new (replaces ElementGrid.svelte)
├── FilterTabs.svelte           # new (child of ShelfGrid)
├── TopBar.svelte               # existing — rewrite in place
├── BottomBar.svelte            # new (extracted from route layout)
├── DiscoveryOverlay.svelte     # existing — rewrite in place
├── MixingChamber.svelte        # existing — refactored as layout shell only
└── ... (other existing components untouched in Phase 1)
```

**Renaming strategy:** Old components (`Slot.svelte`, `ResultDisplay.svelte`, `ElementGrid.svelte`) are not deleted during Phase 1. New components are created alongside. Routes switch imports once new components pass visual QA. Old files are deleted in a cleanup commit after Phase 1 completes.

**Why not rename in place:** Renaming breaks every import and makes rollback impossible. Parallel creation lets you A/B compare old vs new in the same build.

---

## 2. State Management: Runes vs Stores

### The Rule

| State type | Mechanism | Why |
|-----------|-----------|-----|
| **Game state** (unlocked elements, discoveries, score, achievements, streaks) | Svelte `writable` stores (`src/lib/stores/`) | Shared across routes and components. Stores are the correct Svelte primitive for cross-component shared state. Already working — no migration needed. |
| **UI-local state** (hover, popover visible, animation phase, slot breathe sync) | Svelte 5 runes (`$state`, `$derived`, `$effect`) | Scoped to single component. Dies with the component. Runes are lighter than stores for this. |
| **Frequency state** (per-element usage count for visual states) | New dedicated `writable` store + localStorage | Shared across ShelfGrid (reads) and MixingChamber (writes). Must persist across sessions. Must be reactive for 61 cards simultaneously. |
| **Derived visual state** (settled/fresh/power per card) | `$derived` inside ElementCard | Computed from frequency store value. Each card derives its own energy class. No extra store needed — runes compute locally from store subscription. |

### Why Not All Runes

Runes are component-scoped. Game state crosses component boundaries (TopBar reads score, ShelfGrid reads unlocked elements, MixingChamber writes discoveries). Migrating existing `writable` stores to runes would require a Svelte 5 context-based sharing pattern that adds complexity for no benefit. The existing stores work. Keep them.

### Why Not All Stores

UI-local state (is this card hovered? is the popover open? which animation frame?) does not need to be shared. Creating a store for every card's hover state would be 61 unnecessary subscriptions. Runes handle this natively inside the component.

---

## 3. Frequency State Data Model

### localStorage Schema

```json
{
  "alchemica_frequency": {
    "fire": 47,
    "water": 23,
    "steam": 8
  }
}
```

**Key:** `alchemica_frequency` (separate from `alchemica_v1` game save — frequency is a visual concern, not a game state concern. Losing it doesn't break the game; it just resets visual patina.)

**Values:** Integer count of times each element has been used as a reaction input. Incremented on every reaction attempt (success or failure), not on every tap.

### Store Definition

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

### Threshold Constants

```typescript
// src/lib/config/thresholds.ts

/** Usage counts that drive ElementCard visual energy states */
export const FREQUENCY_THRESHOLDS = {
  /** Below this: "fresh" state (amber glow, recently discovered) */
  FRESH_MAX: 5,
  /** Above this: "settled" state (reduced opacity, old friend) */
  SETTLED_MIN: 20,
  /** Elements in the FRESH_MAX..SETTLED_MIN range: default state */
} as const;

/** Session-scoped: elements discovered in current session get fresh glow regardless of count */
export const SESSION_FRESH_DURATION_MS = Infinity; // lasts until app close
```

**One file, not twelve.** When playtesting reveals that 20 is too low for "settled" (it will), you change one number.

---

## 4. CSS Token Layering

Three layers. Always three. Never collapsed.

### Layer 1: Design Tokens (raw values)

Defined in `src/app.css` under `:root`. These are the primitive palette — no semantic meaning, just colors/sizes.

```css
:root {
  /* ─── Layer 1: Design Tokens (raw) ─── */
  --raw-stone-900: #0a0805;
  --raw-stone-800: #110e08;
  --raw-stone-700: #16120b;
  --raw-stone-600: #1c1610;
  --raw-brass-900: #2a2218;
  --raw-brass-700: #3d3020;
  --raw-brass-500: #b8944a;
  --raw-brass-400: #d4a84a;
  --raw-gold-400: #e8b84b;
  --raw-ember-500: #c45a3a;
  --raw-parchment-200: #d8cbb8;
  --raw-parchment-400: #a89478;
  --raw-parchment-600: #6b5a45;
  --raw-glass-clear: rgba(200, 180, 140, 0.06);
  --raw-glass-amber: rgba(180, 120, 60, 0.12);
}
```

### Layer 2: Semantic Tokens (meaning)

Also in `src/app.css` under `:root`, referencing Layer 1. These map raw values to UI roles.

```css
:root {
  /* ─── Layer 2: Semantic Tokens ─── */
  --color-bg-deep: var(--raw-stone-900);
  --color-bg-surface: var(--raw-stone-800);
  --color-bg-raised: var(--raw-stone-700);
  --color-bg-hover: var(--raw-stone-600);
  --color-border-subtle: var(--raw-brass-900);
  --color-border-mid: var(--raw-brass-700);
  --color-border-active: rgba(184, 148, 74, 0.38);
  --color-border-hot: var(--raw-brass-400);
  --color-accent: var(--raw-brass-400);
  --color-accent-dim: rgba(212, 168, 74, 0.19);
  --color-gold: var(--raw-gold-400);
  --color-danger: var(--raw-ember-500);
  --color-text-primary: var(--raw-parchment-200);
  --color-text-secondary: var(--raw-parchment-400);
  --color-text-muted: var(--raw-parchment-600);
  --material-brass-highlight: var(--raw-brass-400);
  --material-brass-shadow: var(--raw-brass-900);
  --material-glass-clear: var(--raw-glass-clear);
  --material-glass-amber: var(--raw-glass-amber);
  --material-stone-warm: var(--raw-stone-900);
}
```

### Layer 3: Component Tokens (scoped overrides)

Defined inside each component's `<style>` block. These let a component override semantic values without touching globals.

```css
/* Inside ElementCard.svelte <style> */
.element-card {
  --card-bg: var(--color-bg-surface);
  --card-border: var(--color-border-subtle);
  --card-glow: none;
}
.element-card.fresh {
  --card-glow: 0 0 8px var(--material-glass-amber);
}
.element-card.settled {
  opacity: 0.85;
}
.element-card.power {
  --card-glow: 0 0 3px rgba(220, 200, 180, 0.04);
}
```

**Why three layers:** Layer 1 changes when the palette changes (rare). Layer 2 changes when a semantic meaning is remapped (e.g., "danger" shifts from ember to violet). Layer 3 changes when a single component needs a variant (e.g., category-specific card tints in Phase 2). If layers are collapsed, any of these changes bleeds everywhere.

### Migration Path

The current `app.css` has hardcoded hex values (`#0d1b2e`, `#c8d8e8`, `#4af0c0`, etc.) in both token definitions and inline styles. Migration:

1. Add Layer 1 + Layer 2 tokens to `app.css` (additive, nothing breaks)
2. Replace hardcoded values in `:root` with Layer 2 references
3. Replace hardcoded values in components one at a time, adding Layer 3 as needed
4. Delete old hardcoded values
5. Update `vite.config.ts` PWA manifest `theme_color` and `background_color` from `#0d1b2e` to `#0a0805`

---

## 5. Animation System Split

Two systems. Never mixed. Never use CSS transitions where Canvas is needed. Never use Canvas where CSS transitions suffice.

### CSS Transitions — State Changes

Handles anything triggered by a class or attribute change on a DOM element.

| Animation | Implementation | Duration |
|-----------|---------------|----------|
| Card hover/selected border | `transition: border-color 50ms, box-shadow 180ms` | 50–180ms |
| Card scale on tap | `transition: transform 180ms ease-out` | 180ms |
| Slot fill opacity + scale | `transition: opacity 180ms, transform 180ms` | 180ms |
| Filter tab active state | `transition: background-color 100ms, color 100ms` | 100ms |
| BottomBar tab switch (view slide) | CSS `transform: translateX()` with `transition` | 200ms |
| Overlay fade in/out | `transition: opacity 200ms` | 200ms |
| Score float ("+N pts") | CSS `@keyframes float-up` — translateY + opacity | 600ms |
| Breathe animation (ready slots) | CSS `@keyframes breathe` — subtle scale oscillation | 2s loop |

**`prefers-reduced-motion` handling:** A single media query block in `app.css` disables all transitions and animations globally:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Opacity fades are preserved by setting `transition-duration: 200ms` on specific properties inside a `prefers-reduced-motion: no-preference` block where needed.

### Canvas — Effects That Cross Component Boundaries

One canvas overlay. See §6.

| Animation | Implementation | Duration |
|-----------|---------------|----------|
| Discovery emergence (emoji scale 0.1→1.0 spring) | Web Animations API on DOM element inside overlay | 1.2s |
| Failure single particle | Canvas 2D — one particle rises, slows, disappears | ~800ms |
| Success burst particles | Canvas 2D — pooled particles (existing system, recolor) | ~1s |
| Screen-edge flash | Canvas 2D — radial gradient pulse from edges | 200ms |
| World contracts (zone scale 0.97) | CSS transform on chamber container | 180ms |
| Radial shimmer (auto-react) | Canvas 2D — sweeping gradient over action zone | 180ms |

### Web Animations API — The Discovery Emergence

The 1.2s emoji scale (0.1→1.0 spring curve) runs on a DOM element inside DiscoveryOverlay, not on canvas. Reason: the emoji is a text node, not a drawn shape. WAA provides hardware-accelerated transform on the actual DOM element with spring-like easing via `cubic-bezier(0.34, 1.56, 0.64, 1)`.

```typescript
emojiEl.animate(
  [
    { transform: 'scale(0.1)', opacity: 0 },
    { transform: 'scale(1.0)', opacity: 1 },
  ],
  {
    duration: 1200,
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    fill: 'forwards',
  }
);
```

### No GSAP

GSAP adds ~28KB gzipped. The animation contracts in the Code Brief require:
- Spring-like easing → `cubic-bezier` approximation via WAA
- Sequenced animations → `animation.finished` promises chained with `await`
- Particle systems → already built in Canvas

GSAP's timeline API would be cleaner for the discovery sequence, but it's not justified for 5 sequenced animations. WAA + async/await covers the contracts. If Phase 2 adds complex timeline choreography (multiple overlapping tweens), revisit.

---

## 6. Canvas Layer Strategy

### Single Overlay Canvas

One `<canvas>` element positioned over the entire game area (shelf + chamber), managed by a single `AnimationController` service.

```
┌──────────────────────────────────────────────────────────────────┐
│  TopBar (52px)                                                   │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────── Canvas Overlay ────────────────────────┐      │
│   │  (position: absolute, inset: 0, pointer-events: none) │      │
│   │                                                        │      │
│   │  Shelf Panel          │   Chamber Panel                │      │
│   │                       │                                │      │
│   └────────────────────────────────────────────────────────┘      │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│  BottomBar (52px)                                                │
└──────────────────────────────────────────────────────────────────┘
```

**Position:** `position: absolute; inset: 0; pointer-events: none; z-index: 30;`
The canvas sits above all game content but below overlays (DiscoveryOverlay at z-index 50).

**Why single canvas:**
- The failure particle rises from the chamber — a per-chamber canvas handles this.
- The screen-edge flash extends to the shelf — a per-chamber canvas can't reach it.
- The power environmental effect (Phase 2) dims cards near a power element — that crosses the shelf/chamber boundary.
- Z-index conflicts between multiple canvases and overlays are eliminated.

**Why not per-component:**
- 61 ElementCards each with their own canvas = 61 WebGL/2D contexts. Mobile GPUs throttle after ~8 active contexts. Non-starter.

### AnimationController Service

```typescript
// src/lib/effects/animation-controller.ts

export class AnimationController {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[];
  private rafId: number = 0;
  private running: boolean = false;

  constructor(canvas: HTMLCanvasElement) { /* ... */ }

  /** Trigger from MixingChamber on successful reaction */
  successBurst(cx: number, cy: number): void { /* ... */ }

  /** Trigger from MixingChamber on failed reaction — single rising particle */
  failureParticle(cx: number, cy: number): void { /* ... */ }

  /** Trigger from DiscoveryOverlay — screen-edge flash */
  screenFlash(color: string, opacity: number): void { /* ... */ }

  /** Trigger from ActionZone — radial shimmer during auto-react */
  radialShimmer(cx: number, cy: number): void { /* ... */ }

  /** Stop all active animations (e.g., when navigating away) */
  stop(): void { /* ... */ }
}
```

This replaces the current `particles.ts` module (which is already canvas-based and pooled). The existing pool logic is preserved; the controller wraps it with named methods matching the Code Brief's animation contracts.

**Instantiation:** MixingChamber creates the controller on mount, passes the canvas ref. Other components call controller methods via a Svelte context (`setContext`/`getContext`), not imports.

---

## 7. Font Loading Strategy

### The Two Typefaces

| Font | Usage | Source |
|------|-------|--------|
| **Space Mono** | Titles, labels, captions, formulas | Google Fonts |
| **system-ui** | Body text, descriptions | OS native — no loading needed |

### Loading Without FOUT

```html
<!-- src/app.html <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  rel="preload"
  as="style"
  href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap"
  onload="this.rel='stylesheet'"
/>
<noscript>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" />
</noscript>
```

**Why not self-hosted:** Space Mono is 2 weights × 1 style = ~50KB total. Google Fonts CDN is almost certainly already cached on the user's device. Self-hosting adds build complexity for no measurable benefit on mobile.

**`display=swap` is intentional:** On first visit, system monospace renders for ~100ms while Space Mono loads. This is acceptable — the game area dominates visual attention, not label text. On subsequent visits, the font is cached and renders immediately.

**Fallback stack:**

```css
font-family: 'Space Mono', ui-monospace, 'Cascadia Code', 'Fira Code', monospace;
```

The fallback monospace fonts are metrically similar enough that layout doesn't shift when Space Mono loads.

---

## 8. Sound Architecture

Brief but necessary — the Code Brief specifies sound cues without an implementation decision.

### Approach: Preloaded AudioBuffer Pool

```typescript
// src/lib/effects/sound.ts (refactored from existing)

const SOUNDS = {
  glassClink: '/sounds/glass-clink.webm',
  discovery: '/sounds/discovery.webm',
  failure: '/sounds/failure-soft.webm',    // quiet, not punitive
  comboUp: '/sounds/combo-up.webm',
  chime: '/sounds/chime.webm',
} as const;
```

**Existing `sound.ts` already uses Web Audio API with preloaded buffers.** No architecture change needed — just swap the audio files and adjust the failure sound from the current punitive tone to the "soft click / near-silence" the philosophy demands.

**The silence-then-sound timing:** The 200ms silence gap in the discovery sequence is a `setTimeout` delay before calling `playDiscovery()`, not an audio silence baked into the file. This lets the timing be tuned independently from the sound itself.

---

## 9. Route Structure (No Change)

```
src/routes/
├── +layout.svelte         # Global layout: orientation lock, canvas mount point
├── +layout.ts             # Static prerendering config
├── +page.svelte           # Redirect to /game
├── game/+page.svelte      # Main game view (Shelf + Chamber + ActionZone)
├── settings/+page.svelte  # Settings page
├── leaderboard/+page.svelte # Leaderboard (existing)
```

BottomBar tab navigation uses SvelteKit `goto()` with View Transitions. No change from current architecture.

---

## 10. Build & PWA Config Changes

| Config | Current | Phase 1 Change |
|--------|---------|----------------|
| `vite.config.ts` — `theme_color` | `#0d1b2e` (navy) | `#0a0805` (warm stone) |
| `vite.config.ts` — `background_color` | `#0d1b2e` | `#0a0805` |
| `app.css` — `html, body` background | `#0d1b2e` | `var(--color-bg-deep)` → `#0a0805` |
| `app.css` — `html, body` color | `#c8d8e8` | `var(--color-text-primary)` → `#d8cbb8` |
| `app.css` — `:focus-visible` outline | `#4af0c0` | `var(--color-accent)` → `#d4a84a` |
| `app.css` — scrollbar colors | `#080f1a` / `#1a3a5a` | `var(--color-bg-deep)` / `var(--color-border-mid)` |

Tailwind CSS remains in `vite.config.ts` but is not used for the game UI. It may be used in secondary pages (settings, leaderboard). No removal in Phase 1.

---

## Constraints Carried Forward

These come from the Code Brief and are not architecture decisions — they are non-negotiable inputs:

- Landscape-locked, no breakpoints, fluid scaling via `clamp()`
- 44px minimum touch targets everywhere
- 11px minimum text size everywhere
- `prefers-reduced-motion` respected globally
- All interactive elements have ARIA roles and labels
- No filled/solid background buttons
- No red for failure
- No tutorial modals
