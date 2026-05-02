---
status: complete
phase: 09-capacitor-native-shell
source:
  - 09-01-SUMMARY.md
  - 09-02-SUMMARY.md
  - 09-03-SUMMARY.md
  - 09-04-SUMMARY.md
  - 09-05-SUMMARY.md
  - 09-06-SUMMARY.md
  - 09-07-SUMMARY.md
started: 2026-05-03
updated: 2026-05-03
---

## Current Test

number: done

## Tests

### 1. Web PWA Build Intact
expected: npm run build exits 0 and produces build/index.html, build/sw.js, and build/manifest.webmanifest with no errors. The web game loads and plays correctly at localhost after `npm run preview`.
result: issue
reported: "Yes, but on mobile the elements are not fit, the sidebar is not scrollable"
severity: major

### 2. Haptics Unit Tests Green
expected: Running `npm run test:unit -- --run src/lib/utils/touch.test.ts` shows 10/10 tests PASS — web path, native path, and error path all GREEN.
result: pass

### 3. Android App Launches in Landscape
expected: After running `npm run cap:android` and installing on a device/emulator via Android Studio, the Alchemica game appears in landscape orientation. Rotating the device keeps the game in landscape. The game plays correctly with elements, reactions, and the mixing chamber working.
result: pass

### 4. Custom Icon on Android Launcher
expected: After installing the app, the Android home screen / app drawer shows the Alchemica icon (dark background with the 'A' logo) — NOT the default green Capacitor robot icon.
result: issue
notes: User does not see the custom 'A' icon — default Capacitor icon appears instead. Likely cause: mipmap assets were generated but adaptive icon XML may not reference them correctly, or cap sync was not run after icon generation.

### 5. Game State Persists After Force-Close
expected: Unlock a few elements in the game, force-close the app (swipe it away from Android recents), then reopen. Previously unlocked elements and discovery log entries are still present — no state loss between sessions.
result: pass

### 6. Signed AAB Exists
expected: The file `android/app/build/outputs/bundle/release/app-release.aab` exists and is ~14MB.
result: pass

### 7. Web Haptics Still Work in Browser
expected: Opening the web game and combining two elements produces no JS errors in the browser console related to haptics. The Capacitor import does not break the web experience.
result: pass

## Summary

total: 7
passed: 5
issues: 2
pending: 0
skipped: 0
blocked: 0

## Gaps

- truth: "On mobile, all elements in the shelf/sidebar are visible and the sidebar is scrollable to reach elements below the fold"
  status: failed
  reason: "User reported: elements are not fit, the sidebar is not scrollable"
  severity: major
  test: 1
  artifacts:
    - src/lib/components/Shelf.svelte
    - src/app.css
- truth: "Custom Alchemica icon (dark background, 'A' logo) appears on the Android launcher after install"
  status: failed
  reason: "User reports the default Capacitor robot icon appears instead of the custom icon"
  severity: major
  test: 4
  artifacts:
    - android/app/src/main/res/mipmap-*/
    - android/app/src/main/res/drawable/
  missing: []

