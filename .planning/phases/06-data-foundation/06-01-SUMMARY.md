---
plan: 06-01
status: complete
wave: 1
---

## What Was Done

Appended two new exports to `src/lib/types.ts` after the existing `Slots` interface:

- `AchievementId` — string union type for the 4 badge IDs: `badge_10 | badge_25 | badge_50 | badge_61`
- `SaveDataV2` — interface describing the v2 localStorage save shape with `earnedAchievements`, `streakCount`, and `lastCompletedDate`

No existing exports were modified.

## Files Changed

- `src/lib/types.ts` — appended AchievementId and SaveDataV2 exports

## Verification

- `AchievementId` type exported with all 4 badge keys
- `SaveDataV2` interface with `version: 2` literal, `earnedAchievements: string[]`, `streakCount: number`, `lastCompletedDate: string | null`
- No existing types modified
