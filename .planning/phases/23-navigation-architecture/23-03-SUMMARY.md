# Phase 23 · Plan 03 · SUMMARY

## Objective
Enrich main menu with Discoveries/Badges overlays, daily challenge card, Settings link, and score display.

## Status: COMPLETE

## Artifacts Produced

| File | Change |
|------|--------|
| `src/routes/+page.svelte` | Added: BottomSheet + DiscoveryLog overlay (Discoveries button), AchievementGallery (Badges button), daily challenge card (element name or "Completed today"), score display (`{#if $score > 0}`), Settings link (goto '/settings') |

## Key Decisions
- `discoverySheetOpen` and `achievementsOpen` are `$state` booleans
- Daily card reads `$dailyChallengeTarget` + `ELEMENTS` record; no countdown timer (deferred per D-09)
- Badge shows discovery count on Discoveries button when `$discoveries.length > 0`
- `goto('/settings')` used for Settings navigation (same SvelteKit pattern as Play button)
- Score only visible when `$score > 0` (clean first-run experience)

## Verification
- `npm run check`: 1 pre-existing vite.config.ts error only (no new errors)
- `npm run build`: clean build ✓

## Requirements Satisfied
- NAV-04: Main menu has Discoveries + Badges overlay access
- NAV-05: Main menu is navigation hub with Settings, daily card, and score
