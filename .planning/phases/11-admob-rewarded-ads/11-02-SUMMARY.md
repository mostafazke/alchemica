---
plan: 11-02
phase: 11-admob-rewarded-ads
status: complete
commit: 06e5a91
---

# Summary: Plan 11-02 — hintBalance Store

## What Was Done
- Added `hintBalance: writable<number>(0)` to `src/lib/stores/game.ts`
- Initializes from `localStorage.getItem('alchemica_hint_balance')`
- Persistence subscriber: writes to `alchemica_hint_balance` key on change
- `resetGame()`: clears store to 0 and removes localStorage key
