---
plan: 06
phase: 08-achievement-daily-ui
status: complete
wave: 3
---

# Summary: Plan 06 — MixingChamber.svelte + SettingsPanel.svelte Wiring

## MixingChamber.svelte changes
- Added imports: `get` (svelte/store), `toastQueue`, `soundMuted`, `playChime`
- In `doReaction()` after `hapticSuccess()`:
  - If `reaction.newBadge !== null`: push to `toastQueue` via `.update(q => [...q, badgeId])`
  - Call `playChime()` only if `!get(soundMuted)`

## SettingsPanel.svelte changes
- Added `soundMuted` import from stores/settings
- Added "Sound" section panel ABOVE "Save Data" section
  - `🔇 Achievement chime muted` / `🔊 Achievement chime on` checkbox toggle
  - Checkbox bound to `$soundMuted` via `onchange` → `soundMuted.set(...)`
- Added CSS: `.panel-section-sound` (border-bottom separator), `.mute-toggle`, `.mute-label`

## Verification
- Build: ✓ (0 errors)
- chime only fires on badge unlock, not every reaction
