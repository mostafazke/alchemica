---
status: complete
phase: 23-navigation-architecture
source:
  - 23-01-SUMMARY.md
  - 23-02-SUMMARY.md
  - 23-03-SUMMARY.md
started: "2026-05-05"
updated: "2026-05-05"
---

## Current Test

number: 10
name: Settings reset shows custom modal (not browser dialog)
result: pass

## Tests

### 1. Game screen has no bottom bar
expected: Open the game (tap Play or navigate to /game). The screen shows only the TopBar at the top, the element grid on the left, and the mixing workspace on the right. There is no footer bar at the bottom of the screen.
result: pass

### 2. TopBar pause button navigates to main menu
expected: While on the game screen, tap the pause button on the left side of the TopBar. You should be taken back to the main menu (/).
result: issue-fixed
issues:
  - "Play button should say Resume when game in progress — fixed: button now shows Resume when discoveries > 0 or score > 0"
  - "Daily challenge card should be highlighted differently from action buttons — fixed: gold border (#c9a84c60) + dark green bg, distinguishes from blue-bordered action buttons"
  - "Settings should look like other buttons — fixed: Settings moved into menu-actions row using same menu-action-btn style as Discoveries and Badges" 

### 3. TopBar has no title and no reset button
expected: The game screen TopBar shows ONLY the pause button on the left and stats (discovered count, combo, score) on the right. There is no "⚗️ Alchemica" title and no ↺ reset button anywhere in the TopBar.
result: pass

### 4. Main menu has Discoveries button with overlay
expected: On the main menu, there is a "📋 Discoveries" button. Tapping it opens a BottomSheet overlay showing your discovery log. Closing the sheet returns to the menu.
result: pass

### 5. Main menu has Badges button with overlay
expected: On the main menu, there is a "🏆 Badges" button. Tapping it opens the AchievementGallery overlay. Closing the overlay returns to the menu.
result: pass

### 6. Main menu has daily challenge card
expected: The main menu shows a card with "Daily Challenge" label. If not yet completed today, it shows today's target element name followed by "available". If already completed, it shows "✓ Completed today" in teal/green.
result: pass

### 7. Main menu has Settings link
expected: The main menu has a "⚙ Settings" button/link. Tapping it navigates to the /settings page (full-screen settings, not a popup).
result: pass

### 8. Settings page has back button
expected: The /settings page has a ← back button at the top left. Tapping it returns you to the main menu (/).
result: pass

### 9. Settings page has sound and haptics toggles
expected: The settings page shows two toggle sections: "Sound" (mutes achievement chime) and "Haptics" (mutes vibration). Both are checkbox-style toggles. Toggling them persists across page reload.
result: pass

### 10. Settings reset shows custom modal (not browser dialog)
expected: On the settings page, tapping "↺ Reset Game" does NOT show a browser-native confirm dialog. Instead, a styled in-app modal appears with "Reset Game?" heading, a description, and two buttons: "Cancel" (neutral) and "Reset" (red). Cancel closes the modal. Reset clears game data and returns to the main menu.
result: pass

## Summary

total: 10
passed: 10
issues: 3
pending: 0
skipped: 0

## Gaps

[none yet]
