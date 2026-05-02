---
plan: 09-09
phase: 09-capacitor-native-shell
status: complete
gap_closure: true
commit: c0ad723
human_verification_required: true
---

# Summary: Plan 09-09 — Fix Android Custom Icon

## What Was Done

Fixed the Android launcher icon to show the Alchemica icon (dark navy + 'A' logo) instead of the default Capacitor robot.

Root cause: `@capacitor/assets generate` scans for `assets/icon.png` by convention but only `assets/icon-only.png` existed. The tool silently skipped foreground PNG generation, leaving the Capacitor default robot in all `mipmap-*/ic_launcher_foreground.png` files. On Android 8+ (API 26+) the adaptive icon system uses `ic_launcher_foreground.png`, so the robot appeared on all modern devices.

## Changes

- **`assets/icon.png`** — Created (copy of `assets/icon-only.png`, the 1024px source)
- **`android/app/src/main/res/mipmap-*/ic_launcher_foreground.png`** — Regenerated via `npx capacitor-assets generate --android` (all density variants: ldpi–xxxhdpi)
- **`android/app/src/main/res/mipmap-*/ic_launcher_background.png`** — Also regenerated (by same tool run)
- **`android/app/src/main/res/values/ic_launcher_background.xml`** — Changed `#FFFFFF` → `#0D1B2E` (Alchemica navy)
- **`android/app/src/main/res/drawable-*/splash.png`** — Bonus: splash screens also regenerated for all density/night variants
- **Signed AAB rebuilt** — 15.3MB, BUILD SUCCESSFUL, new timestamp May 3 01:21

## Verification

- `gradlew bundleRelease` exits `BUILD SUCCESSFUL`
- AAB timestamp confirms fresh build
- `assets/icon.png` exists (123,928 bytes)
- `ic_launcher_foreground.png` in `mipmap-xxxhdpi` is 41,888 bytes (new art, vs old Capacitor default)
- `ic_launcher_background.xml` reads `#0D1B2E`

## Human Verification Required

After installing the rebuilt APK on Android 8+ device/emulator:
- Home screen / app drawer should show dark navy background + 'A' logo
- Default green Capacitor robot must NOT appear

## UAT Gap Closed

Gap: "Custom Alchemica icon (dark background, 'A' logo) appears on the Android launcher after install"
Status: Fixed — foreground PNGs regenerated from correct source, background colour corrected
