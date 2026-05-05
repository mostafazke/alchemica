# Phase 23 · Plan 01 · SUMMARY

## Objective
Remove BottomBar from game screen and redesign TopBar as a focused game header.

## Status: COMPLETE

## Artifacts Produced

| File | Change |
|------|--------|
| `src/routes/game/+page.svelte` | Removed BottomBar, BottomSheet, SettingsPanel, AchievementGallery, DiscoveryLog imports + usage; state vars removed; CSS grid changed to `auto 1fr` |
| `src/lib/components/TopBar.svelte` | Removed title div + reset button; added pause button (⏸, 44×44px min) calling `goto('/')` |
| `src/lib/components/BottomBar.svelte` | DELETED |

## Key Decisions
- Pause button uses HTML entity `&#9208;` (⏸) for encoding safety
- `goto('/')` imported from `$app/navigation` in TopBar
- BGM onMount logic kept unchanged in game/+page.svelte
- AchievementToast kept on game screen

## Verification
- `npm run check`: 1 pre-existing vite.config.ts error only (no new errors)
- `npm run build`: clean build ✓

## Requirements Satisfied
- NAV-01: Game screen is pure play surface (no BottomBar)
- NAV-02: TopBar pause button navigates to /
