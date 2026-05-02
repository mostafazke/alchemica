---
plan: 07-05
phase: 07-achievement-engine
status: complete
requirements_covered: [ACHV-01, ACHV-02, ACHV-03, ACHV-04, ACHV-05, ACHV-06, DALY-01, DALY-02, STRK-02]
---

## What was built

### `src/lib/game/reactions.ts` (modified)

- Extended `applyReaction()` return type: `{ result, isNew, newBadge: AchievementId | null, dailyCompleted: boolean }`
- Added imports: `checkAchievements`, `AchievementId`, `completeDailyChallenge`, `dailyChallengeTarget`, `dailyCompleted`
- In `isNew` branch: calls `checkAchievements(get(unlockedElements).size)` after element unlock
- After score block: checks `!get(dailyCompleted) && result === get(dailyChallengeTarget)` → calls `completeDailyChallenge()` (fires on any reaction, not just new discoveries — DALY-02)
- Returns extended object on both success and failure paths

### `src/lib/stores/game.ts` (modified)

- Added `import { backfillAchievements } from '../game/achievements.js'`
- Added `backfillAchievements(get(unlockedElements).size)` call after achievement store init block (after the `if (saved)` block — catches all saves including fresh starts)

## Backward compatibility

- `resolveReaction()` return type unchanged — no callers affected
- New `newBadge` and `dailyCompleted` fields are additive — `MixingChamber.svelte` uses only `result`/`isNew`, no changes needed there

## Verification

- Build: ✅ 0 errors, 0 warnings, 196 modules transformed, 211.48 KiB precache
