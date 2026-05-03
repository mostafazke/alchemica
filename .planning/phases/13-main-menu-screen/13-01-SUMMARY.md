---
plan: 13-01
phase: 13
status: complete
commit: 45c12ad
date: 2026-05-03
---

# Summary: Plan 13-01 — Route Restructure + Menu Component

## What Was Built

- **Moved** `src/routes/+page.svelte` (full game) to `src/routes/game/+page.svelte` — identical content, zero logic changes
- **Created** new `src/routes/+page.svelte` — branded main menu with:
  - ⚗ alchemical logo mark with gold drop-shadow glow
  - "Alchemica" title (gold `#c9a84c`, uppercase, letter-spacing)
  - "Combine elements. Discover the world." tagline
  - Gold "PLAY" button (`goto('/game')`, 52px touch target, hover/active states)
  - `#0d1b2e` background, dark theme throughout

## Files Changed

| File | Action |
|------|--------|
| `src/routes/game/+page.svelte` | Created (moved from `/`) |
| `src/routes/+page.svelte` | Replaced with menu component |

## Verification Results

- ✅ `npm run build` — succeeded, both routes in output (`build/index.html` SPA shell + `build/game.html`)
- ✅ Pre-existing `vite.config.ts` type error confirmed pre-existing (present before changes, not introduced by this plan)
- ✅ `src/routes/game/+page.svelte` contains full game component
- ✅ `src/routes/+page.svelte` contains menu with `goto('/game')` Play button
- ✅ Committed: `45c12ad`

## Requirements Satisfied

- **MENU-01** ✅ — User sees a main menu screen on launch with the game title, logo, and visual identity
