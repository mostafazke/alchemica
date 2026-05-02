# Alchemica — Agent Instructions

## Quick Start

**Status:** Pre-scaffold. Only `alchemica.html` (the working prototype) and planning files exist.
The Svelte project has **not** been scaffolded yet. See [CLAUDE.md](CLAUDE.md) for full context.

**Commands (after Phase 1 scaffolding):**
```bash
npm run dev        # Dev server with HMR
npm run build      # Production build (minified)
npm run preview    # Preview production build
npm run check      # svelte-check — run after every significant change
```

## Planning Artifacts

| File | Purpose |
|------|---------|
| [.planning/STATE.md](.planning/STATE.md) | **Read first every session** — current phase and progress |
| [.planning/ROADMAP.md](.planning/ROADMAP.md) | 5-phase plan with success criteria and plan lists |
| [.planning/REQUIREMENTS.md](.planning/REQUIREMENTS.md) | 27 v1 REQ-IDs (ARCH-, LAYT-, TOUC-, GAME-, CONT-, PWA-) |
| [.planning/PROJECT.md](.planning/PROJECT.md) | Goals, constraints, out-of-scope decisions |

## GSD Workflow

Phases advance via: `discuss → plan → execute → verify`

- Never skip phases — each phase depends on the previous
- Commit each plan's work atomically before starting the next plan
- Run `npm run check` after every significant change (once scaffolded)

## Tech Stack & Constraints

- **Framework:** Svelte 5 + TypeScript (use runes: `$state`, `$derived`, `$effect` — not Svelte 4 stores API)
- **Build:** Vite with `svelte-ts` template
- **PWA:** `vite-plugin-pwa` + Workbox
- **Styling:** Scoped `<style>` blocks per component + CSS custom properties — no Tailwind, no CSS-in-JS
- **Bundle limit:** <200KB gzipped — no runtime framework overhead
- **Offline:** Zero CDN dependencies in production; fonts must be self-hosted

## Source of Truth for Game Data

All element and reaction data lives in `alchemica.html` until Phase 1 ports it.
After migration: `src/lib/data/elements.ts` and `src/lib/data/reactions.ts` are the only authoritative sources — never put element/reaction data in component files.

Key game data locations in `alchemica.html`:
- Elements: lines ~559–592
- Reactions: lines ~594–644
- Multi-element reactions: lines ~647–651

## Target File Structure

See [CLAUDE.md § File Structure](CLAUDE.md) for the full annotated tree.
Key module responsibilities:

| Module | Role |
|--------|------|
| `lib/data/elements.ts` | Typed `ELEMENTS` record — no logic |
| `lib/data/reactions.ts` | `REACTIONS` + `MULTI_REACTIONS` maps — no logic |
| `lib/stores/game.ts` | Svelte writable stores; auto-saves on change |
| `lib/game/reactions.ts` | Reaction resolution logic |
| `lib/effects/particles.ts` | Canvas particle system (object pooling, rAF) |
| `lib/utils/storage.ts` | Versioned localStorage save/load + export/import |
| `lib/utils/touch.ts` | Long-press, swipe, Vibration API helpers |

## Key Conventions

- **State:** Use individual Svelte stores per state slice (not one big object store) for granular reactivity
- **Persistence:** Save format is versioned (`{ version: number, data: GameState }`) — always bump version on schema changes
- **Touch targets:** 44×44px minimum on all interactive elements (Apple HIG) — enforced in CSS, not JS
- **Particle system:** Must use object pooling; pause on `visibilitychange`; scale particle count with `navigator.hardwareConcurrency`
- **No external state libraries** — Svelte stores are sufficient
