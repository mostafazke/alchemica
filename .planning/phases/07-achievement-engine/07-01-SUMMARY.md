---
plan: 07-01
phase: 07-achievement-engine
status: complete
requirements_covered: [ACHV-01, ACHV-02, ACHV-03, ACHV-04, ACHV-06]
---

## What was built

Created `src/lib/game/achievements.ts` — headless badge award engine.

- `THRESHOLDS` constant: `[{10,'badge_10'},{25,'badge_25'},{50,'badge_50'},{61,'badge_61'}]`
- `checkAchievements(count)` — iterates thresholds; awards first unearned badge that count meets; idempotent; returns `AchievementId | null`
- `backfillAchievements(count)` — silently awards all overdue badges for v1 migrated saves; no return value

## Architecture compliance

- Only imports from `svelte/store`, `../stores/achievements.js`, `../types.js`
- No import from `stores/game.ts` — circular dependency avoided

## Verification

- Build: 0 errors
- Logic: Set.add idempotency; `has()` guard before every award
