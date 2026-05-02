---
plan: 11-04
phase: 11-admob-rewarded-ads
status: complete
commit: 06e5a91
---

# Summary: Plan 11-04 — HintButton UI Update

## What Was Done
Updated `src/lib/components/HintButton.svelte`:
- **Balance-first logic**: `$hintBalance > 0` → hint fires with no cooldown applied
- **Organic hint**: `$hintBalance == 0`, cooldown == 0 → sets +30s cooldown as before
- **Watch Ad sub-button**: shown during cooldown when `isNative && $hintBalance === 0`
  - Enabled (📺 Watch ad) when `$isAdReady === true`
  - Disabled (No ad available) when `$isAdReady === false`
  - Hidden entirely on web (`isNative = Capacitor.isNativePlatform()`)
- Added `.ad-btn` CSS with disabled opacity style
