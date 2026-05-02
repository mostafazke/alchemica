---
plan: 06-03
status: complete
wave: 3
---

## What Was Done

### game.ts — v2 save schema with migration

- Bumped `SAVE_VERSION` to `2`
- Added import of `AchievementId` from types and 3 stores from achievements.ts
- Updated `SaveData` interface to include `earnedAchievements`, `streakCount`, `lastCompletedDate`
- Replaced `loadSave()` hard null-return on version mismatch with v1→v2 migration branch (D-02: empty achievements on migration)
- Initialized achievement stores from `saved` data after `loadSave()`
- Updated `saveToStorage()` to include all 3 achievement fields (Set serialized as array per D-13)
- Added subscribe calls for the 3 new stores
- Extended `resetGame()` to reset `earnedAchievements`, `streakCount`, `lastCompletedDate`

### storage.ts — v2 export/import schema

- Bumped `EXPORT_VERSION` to `2`
- Added imports for achievement stores and `AchievementId` type
- Extended `SaveFile` interface with 3 new fields
- Updated `exportSave()` to include the 3 new fields
- Extended `importSave()` stores parameter with `setEarnedAchievements`, `setStreakCount`, `setLastCompletedDate`
- Added extraction of 3 new fields with v1-migration defaults (empty array, 0, null)
- Validates `earnedAchievements` entries against whitelist `['badge_10','badge_25','badge_50','badge_61']`

### SettingsPanel.svelte — updated importSave call

- Added imports for achievement stores and `AchievementId` type
- Passed 3 new setters to `importSave()`

## Files Changed

- `src/lib/stores/game.ts`
- `src/lib/utils/storage.ts`
- `src/lib/components/SettingsPanel.svelte`

## Verification

- `SAVE_VERSION = 2` in game.ts
- `EXPORT_VERSION = 2` in storage.ts
- v1→v2 migration branch present
- Achievement stores initialized on load, saved on change, reset on resetGame()
- importSave() accepts and applies all 6 store setters
