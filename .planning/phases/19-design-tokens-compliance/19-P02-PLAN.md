---
phase: 19
plan: P02
title: "Safety + Touch Targets + Destructive Styling"
wave: 1
depends_on: []
requirements: [SAFE-01, SAFE-02, TOUCH-01, TOUCH-02, TOUCH-03, TOUCH-04, TOUCH-05, A11Y-03]
files_modified:
  - src/lib/components/TopBar.svelte
  - src/lib/components/BottomSheet.svelte
  - src/lib/components/Slot.svelte
  - src/lib/components/ResultDisplay.svelte
  - src/lib/components/DiscoveryItem.svelte
  - src/lib/components/ElementDetail.svelte
autonomous: true
estimated_tasks: 3
must_haves:
  truths:
    - "Reset button prompts user with confirm() before clearing progress"
    - "Reset button has danger-red default color (not just on hover)"
    - "BottomSheet is not hidden on desktop viewports (no display:none !important at ≥769px)"
    - "Slot clear button has min-width and min-height of 44px"
    - "Result share button has min-height of 44px"
    - "DiscoveryItem share button has min-width and min-height of 44px"
    - "ElementDetail close button has min-width and min-height of 44px"
  artifacts:
    - path: "src/lib/components/TopBar.svelte"
      provides: "Confirmed reset + destructive styling"
    - path: "src/lib/components/BottomSheet.svelte"
      provides: "Desktop-accessible BottomSheet"
    - path: "src/lib/components/Slot.svelte"
      provides: "44px clear button"
    - path: "src/lib/components/ResultDisplay.svelte"
      provides: "44px share button"
    - path: "src/lib/components/DiscoveryItem.svelte"
      provides: "44px share button"
    - path: "src/lib/components/ElementDetail.svelte"
      provides: "44px close button"
---

# Plan P02: Safety + Touch Targets + Destructive Styling

## Objective
Fix 3 safety issues (SAFE-01 reset confirmation, SAFE-02 BottomSheet desktop visibility, A11Y-03 destructive styling) and 4 touch target violations (TOUCH-01..04) in a single pass. TOUCH-05 is already compliant (44px from Phase 14) — just verify.

These fixes are small, targeted edits that don't require tokens (hex values in these files will be migrated to tokens in Wave 2 plans).

## Tasks

<task id="1">
<title>Add reset confirmation dialog + destructive styling (SAFE-01, A11Y-03)</title>
<read_first>
- src/lib/components/TopBar.svelte (full file — lines 1-95, see reset-btn onclick at line 28, .reset-btn styles at lines 81-90)
</read_first>
<action>
**SAFE-01:** In `TopBar.svelte`, change the reset button onclick handler (line 28) from:
```svelte
<button class="reset-btn" onclick={resetGame} title="Reset game">↺</button>
```
to:
```svelte
<button class="reset-btn" onclick={() => { if (confirm('Reset all progress? This cannot be undone.')) resetGame(); }} title="Reset game">↺</button>
```

**A11Y-03:** In the `<style>` block, change the `.reset-btn` default color from neutral to danger-red:
```css
/* BEFORE */
color: #4a6080;

/* AFTER */
color: #ff6b6b;
```

And add a matching border color at rest:
```css
/* BEFORE */
border: 1px solid #1a3a5a;

/* AFTER */
border: 1px solid #ff6b6b40;
```

Keep the existing hover state (`color: #ff6b6b; border-color: #ff6b6b40`), but make hover brighter to still provide visual feedback — change hover to:
```css
.reset-btn:hover { color: #ff6b6b; border-color: #ff6b6b; background: #ff6b6b20; }
```
</action>
<acceptance_criteria>
- `grep -c "confirm(" src/lib/components/TopBar.svelte` returns 1
- `grep -c "Reset all progress" src/lib/components/TopBar.svelte` returns 1
- `grep "\.reset-btn {" -A 10 src/lib/components/TopBar.svelte | grep -c "color: #ff6b6b"` returns 1 (danger color at rest)
- The onclick no longer calls `resetGame` directly — it wraps in confirm()
</acceptance_criteria>
</task>

<task id="2">
<title>Fix BottomSheet desktop visibility (SAFE-02)</title>
<read_first>
- src/lib/components/BottomSheet.svelte (lines 65-80 — the media query at line 70-75)
</read_first>
<action>
In `BottomSheet.svelte`, **remove** the entire media query block that hides the BottomSheet on desktop (lines 70-75):

```css
/* DELETE THIS ENTIRE BLOCK */
@media (min-width: 769px) {
  .bottom-sheet,
  .sheet-overlay {
    display: none !important;
  }
}
```

The BottomSheet is toggle-controlled (open/close state), so it won't appear unless the user clicks a button. The game is landscape-locked at the app level. Removing this media query makes DiscoveryLog accessible on all screen sizes.
</action>
<acceptance_criteria>
- `grep -c "display: none !important" src/lib/components/BottomSheet.svelte` returns 0
- `grep -c "min-width: 769px" src/lib/components/BottomSheet.svelte` returns 0
- The BottomSheet component still has its other styles intact
</acceptance_criteria>
</task>

<task id="3">
<title>Fix touch target sizes (TOUCH-01, TOUCH-02, TOUCH-03, TOUCH-04; verify TOUCH-05)</title>
<read_first>
- src/lib/components/Slot.svelte (lines 55-67 — .slot-clear styles, currently 24×24)
- src/lib/components/ResultDisplay.svelte (line 85 — .result-share-btn, currently min-height: 32px)
- src/lib/components/DiscoveryItem.svelte (line 55 — .share-btn, currently 28×28)
- src/lib/components/ElementDetail.svelte (line 68 — .detail-close, currently 32×32)
- src/lib/components/ElementGrid.svelte (line 58 — .tab-btn, verify 44px already set)
</read_first>
<action>
**TOUCH-01 — Slot.svelte:** Change `.slot-clear` from `min-width: 24px; min-height: 24px` to `min-width: 44px; min-height: 44px`.

**TOUCH-02 — ResultDisplay.svelte:** Change `.result-share-btn` from `min-height: 32px` to `min-height: 44px`. Also add `min-width: 44px` if not present.

**TOUCH-03 — DiscoveryItem.svelte:** Change `.share-btn` from `min-width: 28px; min-height: 28px` to `min-width: 44px; min-height: 44px`.

**TOUCH-04 — ElementDetail.svelte:** Change `.detail-close` from `min-width: 32px; min-height: 32px` to `min-width: 44px; min-height: 44px`.

**TOUCH-05 — ElementGrid.svelte:** Read `.tab-btn` styles and verify `min-height: 44px` is already set (from Phase 14). No changes needed — just confirm it's there.
</action>
<acceptance_criteria>
- `grep "min-width: 44px" src/lib/components/Slot.svelte | grep -c "slot-clear\|44px"` confirms 44px present
- `grep -c "min-height: 44px" src/lib/components/Slot.svelte` returns at least 1
- `grep -c "min-height: 44px" src/lib/components/ResultDisplay.svelte` returns at least 1
- `grep -c "min-width: 44px" src/lib/components/DiscoveryItem.svelte` returns at least 1
- `grep -c "min-height: 44px" src/lib/components/DiscoveryItem.svelte` returns at least 1
- `grep -c "min-width: 44px" src/lib/components/ElementDetail.svelte` returns at least 1
- `grep -c "min-height: 44px" src/lib/components/ElementDetail.svelte` returns at least 1
- `grep -c "min-height: 44px" src/lib/components/ElementGrid.svelte` returns at least 1 (TOUCH-05 verification)
- No min-width or min-height below 44px on any interactive element in these files
</acceptance_criteria>
</task>

## Verification
```bash
# SAFE-01: Reset has confirmation
grep "confirm(" src/lib/components/TopBar.svelte

# SAFE-02: No desktop hiding
grep "display: none !important" src/lib/components/BottomSheet.svelte  # should return nothing

# A11Y-03: Reset has danger color
grep -A5 "\.reset-btn {" src/lib/components/TopBar.svelte | grep "ff6b6b"

# TOUCH-01..04: All targets are 44px+
for f in Slot ResultDisplay DiscoveryItem ElementDetail; do
  echo "=== $f ===" && grep "min-height: 44px\|min-width: 44px" "src/lib/components/$f.svelte"
done

# TOUCH-05: Already compliant
grep "min-height: 44px" src/lib/components/ElementGrid.svelte

# Build still works
npm run build
```
