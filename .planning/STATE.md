# State: Alchemica

## Project Reference

See: `.planning/PROJECT.md` (updated 2026-05-02)

**Core value:** Players can open the game on any device, pick up where they left off, and feel the satisfaction of discovering a new element — even with no internet connection.

**Current focus:** Milestone v3 — Revenue & Native. Phase 9 executed (7/7 plans complete). Pending human verification on Android device (Plans 09-04, 09-05).

## Current Position

Phase: 9 of 12 (Capacitor Native Shell)
Plan: 7/7 plans complete
Status: Pending human verification (Android device launch test)
Last activity: 2026-05-03 — Phase 9 executed (all 7 plans; automated gates GREEN)

Progress: [██░░░░░░░░] 25% (v3)

## Milestone Status

| Milestone | Status | Phases | Requirements |
|-----------|--------|--------|--------------|
| v1 — Mobile PWA | ✅ SHIPPED | 5 | 27/27 |
| v2 — Achievements & Daily Hook | ✅ SHIPPED | 3 (6–8) | 21/21 |
| v3 — Revenue & Native | 🔄 In progress | 4 (9–12) | 0/11 |

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
