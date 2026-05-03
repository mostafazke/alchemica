---
phase: 14
slug: landscape-game-ux
status: context-complete
date: 2026-05-03
requirements: [UX-01, UX-02, UX-03]
---

# Context: Phase 14 — Landscape Game UX Rewrite

## Goal

Complete rewrite of the game screen layout. Landscape-only orientation, element grid
always visible (left panel), mixing workspace on the right. Inspired by Little Alchemy's
approach: all elements are on-screen, tap two to combine.

## Decisions (Locked)

### D-01: Landscape-only orientation lock
**Decision:** The game is locked to landscape. Enforce via:
- `android:screenOrientation="landscape"` in AndroidManifest.xml (already set from Phase 9)
- CSS `@media (orientation: portrait)` shows a "rotate your device" message
- No portrait breakpoints or layouts exist
**Source:** User confirmed (2026-05-03)

### D-02: Left grid + Right workspace layout
**Decision:** Two-panel layout:
- Left (~55%): Scrollable element grid with filter tabs above (All/Basic/Found)
- Right (~45%): Mixing workspace (slots + react + result + hint + daily)
- Bottom bar: navigation tabs for Discoveries, Badges, Settings (open as overlays)
**Source:** User confirmed (2026-05-03)

### D-03: Element grid replaces shelf/sidebar/drawer
**Decision:** The current `Shelf.svelte` sidebar/drawer pattern is removed entirely.
Elements display in a responsive grid of cards (4-5 columns depending on device width).
Cards show icon + name. Tap to select into the next empty slot. All elements always visible.
**Source:** User confirmed (2026-05-03)

### D-04: Compact mixing workspace
**Decision:** The right panel stacks vertically:
1. Slots row (Slot A + Slot B, smaller than current — ~70px)
2. React button (full-width of right panel)
3. Result display (compact, showing icon + name + new-badge)
4. Utility row: Hint button + Daily challenge (inline, not stacked)
**Source:** Derived from landscape constraint + UI review findings

### D-05: Bottom bar navigation (overlays only)
**Decision:** Bottom bar shows 4 tabs: Elements (highlighted/active), Discoveries, Badges, Settings.
- "Elements" is always the active game view
- Discoveries/Badges/Settings open as overlay panels (BottomSheet/modal)
- The current in-layout DiscoveryLog column is removed
**Source:** Derived from grid-first design

### D-06: Remove all portrait responsive breakpoints
**Decision:** Delete all `@media (max-width: 768px)`, `@media (max-width: 1024px)`,
and `@media (max-width: 360px)` media queries from all components. Replace with a
single landscape-optimized layout. Only keep the landscape `max-height` query for
very small screens (< 360px height).
**Source:** User confirmed landscape-only (2026-05-03)

### D-07: Existing game logic untouched
**Decision:** No changes to stores, reactions, achievements, daily challenges, sound,
particles, or game data. This phase is purely a layout/component rewrite.
**Source:** Scope constraint

## Components Affected

### Must rewrite (new layout structure)
- `src/routes/game/+page.svelte` — Complete layout restructure (grid → 2-panel)
- `src/lib/components/Shelf.svelte` → **Replace** with new `ElementGrid.svelte`
- `src/lib/components/ElementCard.svelte` — Adapt to grid tile (smaller, square-ish)
- `src/lib/components/MixingChamber.svelte` — Remove outer flex, becomes right-panel content
- `src/lib/components/BottomBar.svelte` — Simplify (always visible, landscape-width)

### Must adapt (minor changes)
- `src/lib/components/Slot.svelte` — Reduce size for landscape height
- `src/lib/components/ResultDisplay.svelte` — Compact mode
- `src/lib/components/HintButton.svelte` — Inline with daily challenge
- `src/lib/components/DailyChallenge.svelte` — Compact inline variant
- `src/lib/components/TopBar.svelte` — Full-width landscape, possibly merge with workspace header

### Untouched
- All stores, game logic, data files, effects, utils
- `DiscoveryLog.svelte` (still used in overlay)
- `SettingsPanel.svelte` (still overlay)
- `AchievementGallery.svelte` (still overlay)
- `BottomSheet.svelte` (still used for overlays)

## Layout Wireframe

```
┌──────────────────────────────────────────────────────────────────────┐
│ ⚗️ Alchemica                              6/61 discovered  x1  730 ↺ │
├─────────────────────────────────┬────────────────────────────────────┤
│ All │ Basic │ Found             │       [Slot A]  +  [Slot B]        │
│ ┌─────┐┌─────┐┌─────┐┌─────┐  │            ⚗ React                  │
│ │ 🔥  ││ 💧  ││ 🪨  ││ 🌬  │  │                                      │
│ │Fire ││Water││Earth││Air  │  │       ━━━ Result Display ━━━         │
│ └─────┘└─────┘└─────┘└─────┘  │                                      │
│ ┌─────┐┌─────┐┌─────┐┌─────┐  │       💡 Hint    📅 Today: Rain     │
│ │ ⚡  ││ 🧪  ││ ⚙️  ││ 💨  │  │                                      │
│ │Steam││Alloy││Smoke││Rain │  │                                      │
│ └─────┘└─────┘└─────┘└─────┘  │                                      │
├─────────────────────────────────┴────────────────────────────────────┤
│     🧪 Elements        📋 Discoveries        🏆 Badges       ⚙ Set   │
└──────────────────────────────────────────────────────────────────────┘
```

## Technical Notes

- CSS Grid for 2-panel layout: `grid-template-columns: 55fr 45fr`
- Element grid: CSS Grid with `auto-fill, minmax(72px, 1fr)` for responsive columns
- Filter tabs sit inside the left panel header (sticky)
- Right panel: `display: flex; flex-direction: column; justify-content: center`
- Remove `BottomSheet` usage for shelf — elements are always in-view
- `app.css` — remove `overflow: hidden` on body (no longer needed with landscape lock)
