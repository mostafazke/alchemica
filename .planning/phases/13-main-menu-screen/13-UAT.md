---
status: testing
phase: 13-main-menu-screen
source: [13-01-SUMMARY.md, 13-02-SUMMARY.md]
started: 2026-05-03
updated: 2026-05-03
---

## Current Test
<!-- OVERWRITE each test - shows where we are -->

number: 1
name: Main Menu Renders on Launch
expected: |
  Opening the app at / shows the main menu — dark navy background,
  a ⚗ alchemical logo mark with a gold glow, the title "ALCHEMICA"
  in gold uppercase letters, a tagline "Combine elements. Discover the world."
  in muted blue-white, and a gold "PLAY" button below.
  No game UI (shelf, mixing chamber, bottom bar) is visible.
awaiting: user response

## Tests

### 1. Main Menu Renders on Launch
expected: Opening the app at / shows the main menu — dark navy background, a ⚗ alchemical logo mark with a gold glow, the title "ALCHEMICA" in gold uppercase letters, a tagline "Combine elements. Discover the world." in muted blue-white, and a gold "PLAY" button below. No game UI (shelf, mixing chamber, bottom bar) is visible.
result: pending

### 2. Play Button Loads the Game
expected: Tapping/clicking the gold "PLAY" button navigates to /game and the full game loads — TopBar, mixing chamber, bottom navigation bar with shelf/discovery/settings toggles all visible and functional.
result: pending

### 3. Page Transition Animation
expected: Pressing Play causes a smooth fade-and-slide animation — the menu fades out while sliding up, and the game screen fades in from below. The transition takes ~250ms. (Test in a browser that supports View Transitions API — Chrome 111+, Edge 111+.)
result: pending

### 4. Back Navigation Returns to Menu
expected: Pressing the browser Back button (or Android back gesture) from the game returns to the main menu at /. The reverse transition plays — game fades/slides out, menu fades/slides in.
result: pending

## Summary

total: 4
passed: 0
issues: 0
pending: 4
skipped: 0

## Gaps

[none yet]
