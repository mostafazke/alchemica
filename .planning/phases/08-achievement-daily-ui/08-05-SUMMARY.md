---
plan: 05
phase: 08-achievement-daily-ui
status: complete
wave: 2
---

# Summary: Plan 05 — TopBar.svelte + BottomBar.svelte Modifications

## TopBar.svelte changes
- Added `earnedAchievements` import from stores
- Added `pulseActive: boolean = $state(false)` + `prevEarnedSize` tracker
- `$effect` watches `$earnedAchievements.size` — triggers pulse on increase, auto-clears after 800ms
- Discovery stat span: `class:badge-pulse={pulseActive}` → gold scale animation
- Added `@keyframes badge-pulse`: scale 1→1.25→1.1→1 with color shift `#8ab4d4` → `#e8b84b`

## BottomBar.svelte changes
- Added `achievementsOpen` + `onToggleAchievements` props
- Replaced `<span class="bottom-stat">` with 4th `🏆 Badges` button between Discoveries and Settings
- Removed `.bottom-stat` CSS rule
- Changed `justify-content: space-between` → `space-around` for even 4-button distribution

## Verification
- Build: ✓ (0 errors, tested after Wave 3 completion)
- 44px min touch targets maintained for all 4 buttons
