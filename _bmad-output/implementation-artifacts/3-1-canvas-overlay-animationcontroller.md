# Story 3.1: Canvas Overlay + AnimationController

**Status:** done
**Epic:** 3 — Animation & Integration
**Story ID:** 3-1

---

## User Story

As a developer,
I want a single canvas overlay covering the full game area with an AnimationController service,
So that all particle and effect animations run through one system without per-component canvas overhead.

---

## Acceptance Criteria

**AC1 — AnimationController class**
- **Given** `src/lib/effects/particles.ts` contains per-trigger module functions
- **When** I create `src/lib/effects/animation-controller.ts`
- **Then** it exports an `AnimationController` class with these methods:
  - `successBurst(cx: number, cy: number): void`
  - `failureParticle(cx: number, cy: number): void`
  - `screenFlash(color: string, opacity: number): void`
  - `radialShimmer(cx: number, cy: number): void`
  - `stop(): void`
- **And** the 120-particle pool with `perfMultiplier` scaling is preserved
- **And** visibility pause (stops RAF when `document.hidden`) is preserved
- **And** particle burst colors shift from teal/neon to warm gold/amber/brass palette

**AC2 — Canvas positioning**
- **Given** the canvas must cover the full game area (shelf + chamber panels)
- **When** it is mounted in the game layout
- **Then** it has `position: absolute; inset: 0; pointer-events: none; z-index: 30`
- **And** it sits above game content but below `DiscoveryOverlay` (which uses `z-index: 50`)

**AC3 — Svelte context wiring**
- **Given** other components need access to the controller (Decision D-11)
- **When** `MixingChamber` mounts
- **Then** it creates an `AnimationController` instance and calls `setContext('animationController', controller)`
- **And** child components that need it call `getContext('animationController')` — no direct module import
- **And** the context key is exactly `'animationController'` (string literal)

**AC4 — Old `particles.ts` not deleted**
- **Given** AR1 (parallel creation, no deletion until Phase 1 QA passes)
- **When** this story is done
- **Then** `src/lib/effects/particles.ts` still exists unchanged
- **And** `MixingChamber.svelte` still imports from it (wiring to new controller happens in Story 3.3)

---

## Technical Context

### What this story creates

| File | Action | Notes |
|------|--------|-------|
| `src/lib/effects/animation-controller.ts` | **NEW** | AnimationController class |

That's it — one file. No component changes in this story.

### What is NOT in scope (defer to 3.2 / 3.3)

- Mounting the canvas in the layout or MixingChamber (Story 3.3)
- Wiring `setContext` / replacing `initParticles` call (Story 3.3)
- Calling animation methods from components (Stories 3.2, 3.3)
- The canvas `<canvas>` element in any `.svelte` file (Story 3.3)

> **Clarification:** The AC3 wording says "when MixingChamber mounts" — but MixingChamber isn't changed until 3.3. Story 3.1's sole deliverable is the `AnimationController` class file itself, fully tested and ready to be wired.

---

## Implementation Guide

### AnimationController Architecture

Port the logic from `particles.ts` into a class. Key differences:

1. **Class instance owns state**: `pool`, `rafId`, `running`, `ctx` are instance properties, not module-level globals. This allows multiple instances in tests and eliminates the module singleton problem.
2. **Named methods replace module functions**: `triggerSuccessParticles` → `successBurst`, `triggerFailParticles` → `failureParticle`, plus new `screenFlash` and `radialShimmer`.
3. **Constructor takes the canvas**: `new AnimationController(canvasEl)` — no `initParticles()` call needed.
4. **Warm palette**: Replace cold colors with warm gold/amber/brass values.

### Warm Palette Color Map

Replace ALL cold/neon particle colors from `particles.ts`:

| Old color | New color | Usage |
|-----------|-----------|-------|
| `'#4af0c0'` (teal) | `'#d4a84a'` (brass-400) | success burst primary |
| `'#ffe44a'` (yellow) | `'#e8b84b'` (gold-400) | success burst secondary |
| `'#ff6b6b'` (pink-red) | `'#c45a3a'` (ember-500) | success burst accent |
| `'#5ab4ff'` (blue) | `'#b8944a'` (brass-500) | success burst warm mid |
| `'#d05aff'` (purple) | `'#d4a84a'` | (reuse brass — drop purple) |
| `'#96c84a'` (green) | `'#e8b84b'` | (reuse gold — drop green) |
| `'#4af0c0'` bubble stroke | `'#d4a84a'` | bubble ring |
| `'#4af0c040'` bubble fill | `'rgba(212, 168, 74, 0.25)'` | bubble fill |
| `'#ff405070'` fail | `'rgba(180, 120, 60, 0.55)'` | warm amber fail |

```typescript
const BURST_COLORS = [
  '#d4a84a', // brass-400 (primary)
  '#e8b84b', // gold-400
  '#c45a3a', // ember-500
  '#b8944a', // brass-500
  '#d4a84a', // brass-400 (repeat to weight warm)
  '#e8b84b', // gold-400 (repeat)
];
```

### screenFlash implementation

Radial gradient from screen edges inward, pulses once:

```typescript
screenFlash(color: string, opacity: number): void {
  // Draw a radial gradient from all four edges simultaneously
  // Fades from `opacity` to 0 over ~200ms via RAF loop
  // color is a CSS color string (e.g. '#d4a84a')
}
```

Implementation approach: draw a full-canvas rect with low alpha each frame, decrementing over ~12 frames (200ms at 60fps). Use `ctx.globalAlpha` for fade.

### radialShimmer implementation

Sweeping gradient centered on `(cx, cy)` over ~180ms:

```typescript
radialShimmer(cx: number, cy: number): void {
  // Draw expanding radial gradient from center outward
  // Start: small radius (20px), end: large (150px)
  // Fades with gradient stop going transparent at outer edge
  // ~180ms, 11 frames at 60fps
}
```

### failureParticle implementation

Single particle, rises and disappears — more restrained than `triggerFailParticles`:

```typescript
failureParticle(cx: number, cy: number): void {
  // One particle only (not a batch)
  // Rises upward (vy starts -2.5), slows due to drag
  // Warm amber color, ~800ms lifetime
  // Size starts 4px, shrinks with life
}
```

### stop() implementation

```typescript
stop(): void {
  cancelAnimationFrame(this.rafId);
  this.rafId = 0;
  for (const p of this.pool) { p.active = false; }
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
}
```

### Full class skeleton

```typescript
// src/lib/effects/animation-controller.ts

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; decay: number;
  size: number; color: string;
  type: 'burst' | 'bubble' | 'fail' | 'flash' | 'shimmer';
  active: boolean;
}

const MAX_PARTICLES = 120;
const perfMultiplier = Math.max(0.5, Math.min(2, (navigator.hardwareConcurrency ?? 4) / 4));

const BURST_COLORS = [
  '#d4a84a', '#e8b84b', '#c45a3a', '#b8944a', '#d4a84a', '#e8b84b',
];

export class AnimationController {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private pool: Particle[];
  private rafId = 0;
  private paused = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.pool = Array.from({ length: MAX_PARTICLES }, () => ({
      x: 0, y: 0, vx: 0, vy: 0, life: 0,
      decay: 0.02, size: 3, color: '#d4a84a',
      type: 'burst' as const, active: false,
    }));
    document.addEventListener('visibilitychange', () => {
      this.paused = document.hidden;
      if (!this.paused && this.pool.some((p) => p.active)) {
        this.scheduleAnimate();
      }
    });
  }

  successBurst(cx: number, cy: number): void { /* port from triggerSuccessParticles, warm colors */ }
  failureParticle(cx: number, cy: number): void { /* single rising warm particle */ }
  screenFlash(color: string, opacity: number): void { /* edge-inward gradient pulse */ }
  radialShimmer(cx: number, cy: number): void { /* expanding gradient from center */ }
  stop(): void { /* cancel RAF, clear pool, clear canvas */ }

  private acquire(): Particle | null {
    return this.pool.find((p) => !p.active) ?? null;
  }

  private scheduleAnimate(): void {
    cancelAnimationFrame(this.rafId);
    if (!this.paused) {
      this.rafId = requestAnimationFrame(() => this.animate());
    }
  }

  private animate(): void {
    if (this.paused) return;
    // Resize to parent container (same as particles.ts)
    const parent = this.canvas.parentElement;
    if (parent) {
      this.canvas.width = parent.offsetWidth;
      this.canvas.height = parent.offsetHeight;
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // draw loop + RAF continuation (same logic as particles.ts animate())
  }
}
```

---

## Guardrails

### DO
- Preserve the 120-particle pool cap (`MAX_PARTICLES = 120`)
- Preserve `perfMultiplier` formula: `Math.max(0.5, Math.min(2, (navigator.hardwareConcurrency ?? 4) / 4))`
- Preserve visibility pause behavior (`document.hidden` check)
- Preserve resize-to-parent in animate loop
- Keep `particles.ts` untouched (AR1 — parallel creation)
- Export only `AnimationController` class from the new file — no top-level function exports

### DON'T
- Import from `particles.ts` — copy the logic into the class
- Delete or modify `particles.ts`
- Mount a canvas element in any `.svelte` file — that's Story 3.3
- Call `setContext` anywhere — that's Story 3.3
- Use GSAP or any animation library (Decision D-05 — no GSAP)
- Add color as a CSS variable (canvas ctx uses hex/rgba strings, not CSS vars)

### Svelte 5 / TypeScript notes
- This is a plain `.ts` file — no runes, no `$state`, no Svelte APIs
- `navigator.hardwareConcurrency` is available at module level (browser env guaranteed)
- `CanvasRenderingContext2D` type is available without import in TS strict DOM lib

---

## Verification

1. `npx svelte-check --threshold error` — must still show exactly 2 errors (pre-existing: `vite.config.ts:75`, `DiscoveryBanner.svelte:81`)
2. `grep -r "4af0c0\|ffe44a neon\|ff6b6b" src/lib/effects/animation-controller.ts` — must return 0 matches (no cold colors)
3. `grep "MAX_PARTICLES\|perfMultiplier\|hardwareConcurrency\|visibilitychange" src/lib/effects/animation-controller.ts` — must show all four preserved
4. `grep "successBurst\|failureParticle\|screenFlash\|radialShimmer\|stop" src/lib/effects/animation-controller.ts` — must show all five methods
5. `grep -c "export" src/lib/effects/animation-controller.ts` — must equal 1 (only the class export)
6. Confirm `src/lib/effects/particles.ts` is unchanged: `git diff src/lib/effects/particles.ts` — empty

---

## Completion Notes

- Animation methods (`screenFlash`, `radialShimmer`) are implemented but not yet called — callers are wired in Story 3.2 and 3.3
- The class is exported ready for `new AnimationController(canvasEl)` call in Story 3.3
- Context key `'animationController'` is established here as a convention; Stories 3.2 and 3.3 use `getContext('animationController')`

### File List

- `src/lib/effects/animation-controller.ts` — **NEW** (sole deliverable)
