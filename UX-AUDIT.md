# Alchemica UX Audit

_Generated: 2026-05-03_

Prioritized list of UX problems identified across all 20 Svelte components and global styles.

---

## P0 — Critical (data loss / feature blocked)

1. **Reset button has no confirmation dialog** (`TopBar.svelte:.reset-btn`) — single tap permanently destroys all progress. Needs a "Are you sure?" step with clearly destructive styling.

2. **DiscoveryLog unreachable on desktop** (`BottomSheet.svelte` applies `display: none !important` at ≥769px, but DiscoveryLog only lives inside BottomSheet) — the Discoveries button opens nothing on desktop.

3. **`user-scalable=no` in viewport meta** (`app.html:4`) — blocks pinch-to-zoom entirely, which is an accessibility violation and causes failures under WCAG 1.4.4 Resize Text.

---

## P1 — High (directly impairs core usability)

4. **Slot clear button under-sized** (`Slot.svelte:.slot-clear`) — `min-width: 24px; min-height: 24px` is half the 44px Apple/Material minimum. Impossible to reliably tap on mobile without mis-firing.

5. **Result share button under-sized** (`ResultDisplay.svelte:.result-share-btn`) — `min-height: 32px`, 12px below minimum.

6. **DiscoveryItem share button under-sized** (`DiscoveryItem.svelte:.share-btn`) — `min-width: 28px; min-height: 28px`.

7. **ElementDetail close button under-sized** (`ElementDetail.svelte:.detail-close`) — `min-width: 32px; min-height: 32px`.

8. **Filter tabs under-sized** (`ElementGrid.svelte:.tab-btn`) — `min-height: 36px` is below the 44px minimum.

9. **No onboarding or first-run instruction** — nothing explains: tap to select an element → it fills a slot → tap a second → press React. New users face a blank interface.

10. **Idle state instruction is invisible** (`ResultDisplay.svelte:.result-idle`) — `color: #2a3550` against `background: #0a1520` has near-zero contrast; WCAG AA requires 4.5:1.

11. **9px font size throughout** — `.el-grid-name`, `.el-formula`, `.disc-recipe`, `.disc-formula`, `.result-formula`, `.bar-btn-label` all use 9–10px. Below the 11px minimum for readability on screen, effectively unreadable on older devices.

---

## P2 — Medium (degrades quality)

12. **No swipe-down to dismiss BottomSheet** (`BottomSheet.svelte`) — standard mobile pattern; current implementation only supports overlay-tap or button toggle.

13. **Combo badge clips on React button** (`MixingChamber.svelte:.combo-badge`) — `position: absolute; top: -8px; right: -8px` overflows the button's bounds and gets clipped by parent `overflow: hidden` on some containers.

14. **Reset button unstyled as destructive** (`TopBar.svelte:.reset-btn`) — neutral gray styling with no danger affordance (no red color or warning icon at rest).

15. **Filter tab counts missing** (`ElementGrid.svelte`) — "All / Basic / Found" tabs show no count, so users can't tell if "Found" is empty before tapping.

16. **Score and combo labels missing** (`TopBar.svelte`) — three numbers displayed in a row with no labels; new users won't know which is score vs. combo vs. discovered count.

17. **No focus-visible styles anywhere** — zero `:focus-visible` rules in any component or `app.css`, so keyboard navigation has no visible indicator.

18. **OfflineIndicator `bottom: 80px` is hardcoded** (`OfflineIndicator.svelte`) — doesn't account for `env(safe-area-inset-bottom)` or BottomBar height changes; will overlap on some devices.

19. **Hint overlay can clip on small screens** (`HintButton.svelte:.hint-overlay`) — anchored `bottom: calc(100% + 8px)` with no viewport boundary check; on short landscape devices it can extend off-screen.

20. **Long-press to view element details has no affordance** (`ElementCard.svelte`) — no visual hint (tooltip, icon, label) that elements are long-pressable. Most users will never discover detail cards.

---

## P3 — Low (polish / quality of life)

21. **AchievementToast has no exit animation** (`AchievementToast.svelte`) — toast has a `toast-in` keyframe but disappears abruptly; should fade/slide out.

22. **Discovery badge shows total, not unread** (`BottomBar.svelte`) — as discovery count grows it becomes noise. Should track unread since last opened.

23. **No element text search** (`ElementGrid.svelte`) — with 32+ elements, finding one by name requires scanning the grid.

24. **Generic fail tip is unhelpful** (`ResultDisplay.svelte`) — `"Tip: Think about natural phenomena"` gives no real guidance and wastes space on every failed reaction.

25. **BottomBar toggle buttons keep same label when panel is open** (`BottomBar.svelte`) — "Discoveries" should change to "Close" or show an × when the sheet is active.

26. **No swipe-between-tabs gesture** (`ElementGrid.svelte`) — mobile users expect horizontal swipe to switch All/Basic/Found.

27. **Emoji inconsistency** — menu page uses `⚗` (U+2697), TopBar uses `⚗️` (with variation selector); renders differently across platforms.

28. **DailyChallenge and HintButton compete for horizontal space** (`MixingChamber.svelte:.utility-row`) — `flex: 1` on both in a tight right-panel column leads to cramped layout on 45% of screen width.

---

## Summary

| Priority | Count |
|----------|-------|
| P0 Critical | 3 |
| P1 High | 8 |
| P2 Medium | 9 |
| P3 Low | 8 |
| **Total** | **28** |

Highest bang-for-buck fixes: reset confirmation (P0), BottomSheet desktop visibility (P0), all sub-44px touch targets (P1 issues 4–8), idle state contrast (P1 issue 10).
