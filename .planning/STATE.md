---
gsd_state_version: 1.0
milestone: v8
milestone_name: Game Screen Overhaul
status: planning
last_updated: "2026-05-05"
last_activity: 2026-05-05 — Milestone v8 started (Game Screen Overhaul)
progress:
  total_phases: 0
  completed_phases: 0
  total_plans: 0
  completed_plans: 0
  percent: 0
---

# State: Alchemica

## Project Reference

See: `.planning/PROJECT.md` (updated 2026-05-02)

**Core value:** Players can open the game on any device, pick up where they left off, and feel the satisfaction of discovering a new element — even with no internet connection.

**Current focus:** Milestone v7 — UI/UX Overhaul

## Current Position

Phase: Not started (defining requirements)
Plan: —
Status: Defining requirements
Last activity: 2026-05-05 — Milestone v8 started

Progress: [          ] 0% (v8 — phases TBD)

## Milestone Status

| Milestone | Status | Phases | Requirements |
|-----------|--------|--------|--------------|
| v1 — Mobile PWA | ✅ SHIPPED | 5 | 27/27 |
| v2 — Achievements & Daily Hook | ✅ SHIPPED | 3 (6–8) | 21/21 |
| v3 — Revenue & Native | ✅ COMPLETE | 4 (9–12) | 11/11 |
| v4 — Main Menu | ✅ COMPLETE | 1 (13) | 2/2 |
| v5 — Landscape Game UX | ✅ COMPLETE | 1 (14) | 3/3 |
| v6 — Cross-Platform Ship | 🟡 IN PROGRESS | 4 (15–18) | 2/7 |
| v7 — UI/UX Overhaul | ⚫ SUPERSEDED | — | — |
| v8 — Game Screen Overhaul | 🟡 PLANNING | TBD | 0/TBD |

## Accumulated Context

### Decisions

- [v3 planning]: Capacitor (Phase 9) is hard prerequisite for all MOTZ phases — no native plugin without native wrapper
- [v3 planning]: Streak bonus (Phase 10) placed after Phase 9 to allow testing on device, but has no Capacitor dependency itself
- [v3 planning]: AdMob (Phase 11) before IAP (Phase 12) so MOTZ-05 (hide ads for purchasers) can reference the ad surfaces built in P11
- [v3 planning]: Save format needs v3 migration in Phase 12 (purchasedNoAds, hintBalance fields)
- [v3 planning]: iOS deferred to v4 — Android-only in v3

### Pending Todos

None.

### Blockers/Concerns

None. Phase 9 research resolved key risks: install Capacitor 8 (not 6) to match android-36 SDK; orientation lock goes in AndroidManifest.xml (not capacitor.config.ts); icon source needs 1024×1024 — all addressed in plans.

## Session Log

- 2026-05-02: Project initialized. Requirements defined (27 v1). Roadmap created (5 phases). Ready for Phase 1.
- 2026-05-02: Phases 1–5 complete. Milestone v1 shipped (PR #1, git tag v1).
- 2026-05-02: Phases 6–8 complete. Milestone v2 shipped (git tag v2).
- 2026-05-03: Phase 9 executed. Capacitor 8 installed, android/ platform created, haptics upgraded, icons generated, signed AAB built (14.8MB). All automated gates GREEN. Human device verification pending.
- 2026-05-03: Phase 9 UAT complete (5 pass / 2 issues). Gaps diagnosed and fixed: shelf scroll (CSS flex chain) + Android icon (regenerated foreground PNGs, navy background). Phase 9 ✅ COMPLETE.
- 2026-05-03: Phase 11 executed. AdMob rewarded ads: @capacitor-community/admob@8 installed, hintBalance store, admob.ts service module, HintButton Watch-Ad UI. Build + cap sync GREEN. Phase 11 ✅ COMPLETE (UAT pending).
- 2026-05-03: Milestone v4 started. Main Menu milestone defined (2 requirements: MENU-01, MENU-05). Phase 13 roadmapped.
- 2026-05-03: Phase 13 executed. Route restructure (game → /game, menu at /), branded main menu component, View Transitions API page transitions. Build GREEN. Phase 13 ✅ COMPLETE.
- 2026-05-03: Phase 15 executed. RC API key env-var pattern (pre-existing), RevenueCat project created, Google Play products (remove_ads + hints_10) active, RC entitlement + offering configured, store listing complete, signed AAB submitted. Phase 15 ✅ COMPLETE.
- 2026-05-03: Milestone v7 started. UI/UX Overhaul — fix 28 audit issues, implement design tokens, rebuild shelf + chamber per UI-SPEC.
- 2026-05-05: Milestone v8 started. Game Screen Overhaul — navigation architecture (Phase 23).
- 2026-05-05: Phase 23 complete. Navigation architecture: game screen cleaned, TopBar redesigned with pause, /settings route, hapticsMuted store, main menu enriched with overlays + daily card. All 10 UAT tests PASS.
