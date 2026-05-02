---
plan: 10-02
phase: 10-streak-bonus
status: complete
commit: 80f4d26
requirements: [STRK-05, STRK-06]
---

# Summary: Plan 10-02 — Streak Bonus Implementation

## What Was Done

Implemented the streak bonus combo cap and TopBar visual indicator.

## Changes

**`src/lib/game/reactions.ts`**:
- Exported `getComboMax(streak: number): number` — pure function, `Math.min(8 + streak, 11)`
- Added `import { streakCount } from '../stores/achievements.js'`
- Replaced hardcoded `Math.min(currentCombo + 1, 8)` with `Math.min(currentCombo + 1, getComboMax(get(streakCount)))`

**`src/lib/components/TopBar.svelte`**:
- Added `streakCount` to achievements import
- Combo span: appends ` 🔥` when `$streakCount >= 1`; adds `.streak` class for orange glow
- CSS: `.stat.combo.streak { color: #ff8c42; text-shadow: 0 0 8px #ff8c4260; }`

## Verification

- 5/5 new streak bonus tests GREEN
- 10/10 haptics tests unchanged GREEN
- 15/15 total unit tests GREEN
- `npm run build` exits 0 — no regressions

## Requirements Satisfied

- **STRK-05**: Combo cap increases during active streak (+1x per day, max +3x above 8x base)
- **STRK-06**: Active streak bonus visually indicated in TopBar (🔥 emoji + orange glow)
