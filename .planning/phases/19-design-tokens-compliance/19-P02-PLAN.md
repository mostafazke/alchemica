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
  - UX-AUDIT.md
autonomous: true
estimated_tasks: 3
must_haves:
  truths:
    - "Reset button shows a custom danger-styled in-component modal before clearing progress (per D-06)"
    - "Reset button has danger-red default color (not just on hover)"
    - "Slot clear button has min-width and min-height of 44px"
    - "Result share button has min-height of 44px"
    - "DiscoveryItem share button has min-width and min-height of 44px"
    - "ElementDetail close button has min-width and min-height of 44px"
    - "UX-AUDIT.md issue #8 corrected to reflect filter tabs already 44px (D-08)"
  artifacts:
    - path: "src/lib/components/TopBar.svelte"
      provides: "Custom reset confirm modal + destructive styling"
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
    - path: "UX-AUDIT.md"
      provides: "Corrected issue #8 (TOUCH-05 already compliant)"
---
# Plan P02: Safety + Touch Targets + Destructive Styling

## Objective
Fix 3 safety issues (SAFE-01 reset confirmation with custom Svelte modal per D-06, SAFE-02 BottomSheet desktop visibility, A11Y-03 destructive styling), 4 touch target violations (TOUCH-01..04), and correct the stale UX-AUDIT.md entry for TOUCH-05 (D-08).

These fixes are targeted edits; hex values in these files will be migrated to tokens in Wave 2 plans.

## Tasks

<task id="1">
<title>Add custom reset confirmation modal + destructive styling (SAFE-01, A11Y-03, D-06)</title>
<read_first>
- src/lib/components/TopBar.svelte (full file)
</read_first>
<action>
**SAFE-01 + D-06:** Use a custom Svelte modal — NOT window.confirm() which is suppressed in Capacitor Android WebView.

Script additions to the script block:
  let showResetConfirm = $state(false);
  function handleReset() { showResetConfirm = true; }
  function confirmReset() { showResetConfirm = false; resetGame(); }
  function cancelReset() { showResetConfirm = false; }

Template: Change reset button onclick from resetGame to handleReset.
Add after the closing header tag:
  {#if showResetConfirm}
    <div class="reset-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="reset-modal-title">
      <div class="reset-modal">
        <p id="reset-modal-title" class="reset-modal-title">Reset all progress?</p>
        <p class="reset-modal-body">This cannot be undone.</p>
        <div class="reset-modal-actions">
          <button class="reset-modal-cancel" onclick={cancelReset}>Cancel</button>
          <button class="reset-modal-confirm" onclick={confirmReset}>Reset</button>
        </div>
      </div>
    </div>
  {/if}

**A11Y-03:** In the style block, update .reset-btn default:
  color: #ff6b6b (was #4a6080)
  border: 1px solid #ff6b6b40 (was #1a3a5a)
  hover: color #ff6b6b; border-color #ff6b6b; background #ff6b6b20

Modal styles to add (all in component style block):
  .reset-modal-overlay { position: fixed; inset: 0; background: #00000080; display: flex; align-items: center; justify-content: center; z-index: 100; }
  .reset-modal { background: #0d1b2e; border: 1px solid #ff6b6b60; border-radius: 12px; padding: 24px; max-width: 280px; width: 90%; text-align: center; }
  .reset-modal-title { color: #ff6b6b; font-size: 16px; font-weight: 700; margin-bottom: 8px; }
  .reset-modal-body { color: #8ab4d4; font-size: 13px; margin-bottom: 20px; }
  .reset-modal-actions { display: flex; gap: 12px; justify-content: center; }
  .reset-modal-cancel { background: #1a2e4a; border: 1px solid #1a3a5a; border-radius: 8px; color: #8ab4d4; font-size: 14px; padding: 10px 20px; cursor: pointer; min-height: 44px; min-width: 80px; }
  .reset-modal-confirm { background: #ff6b6b20; border: 1px solid #ff6b6b; border-radius: 8px; color: #ff6b6b; font-size: 14px; font-weight: 700; padding: 10px 20px; cursor: pointer; min-height: 44px; min-width: 80px; }
  .reset-modal-cancel:hover { background: #1a3a5a; }
  .reset-modal-confirm:hover { background: #ff6b6b40; }
</action>
<acceptance_criteria>
- grep -c "showResetConfirm" src/lib/components/TopBar.svelte  returns at least 3
- grep -c "confirmReset" src/lib/components/TopBar.svelte  returns at least 2
- grep -c "reset-modal-overlay" src/lib/components/TopBar.svelte  returns at least 2
- grep -c "This cannot be undone" src/lib/components/TopBar.svelte  returns 1
- grep -c "if (confirm\(\|window.confirm" src/lib/components/TopBar.svelte  returns 0
- grep -A5 ".reset-btn {" src/lib/components/TopBar.svelte | grep -c "ff6b6b"  returns at least 1
- npm run build  exits 0
</acceptance_criteria>
</task>

<task id="2">
<title>Fix BottomSheet desktop visibility (SAFE-02)</title>
<read_first>
- src/lib/components/BottomSheet.svelte (lines 65-80)
</read_first>
<action>
Remove the entire media query block that hides BottomSheet on desktop:
  @media (min-width: 769px) {
  }

The BottomSheet is toggle-controlled, won't appear unless user clicks a button. Removing this makes DiscoveryLog accessible on all screen sizes.
</action>
<acceptance_criteria>
- grep -c "min-width: 769px" src/lib/components/BottomSheet.svelte  returns 0
</acceptance_criteria>
</task>

<task id="3">
<title>Fix touch target sizes + verify TOUCH-05 + correct UX-AUDIT.md (TOUCH-01-05, D-08)</title>
<read_first>
- src/lib/components/Slot.svelte (.slot-clear — currently 24x24px)
- src/lib/components/ResultDisplay.svelte (.result-share-btn — currently min-height: 32px)
- src/lib/components/DiscoveryItem.svelte (.share-btn — currently 28x28px)
- src/lib/components/ElementDetail.svelte (.detail-close — currently 32x32px)
- src/lib/components/ElementGrid.svelte (.tab-btn — verify 44px from Phase 14)
- UX-AUDIT.md (issue #8)
</read_first>
<action>
TOUCH-01: Slot.svelte — change .slot-clear min-width: 24px; min-height: 24px -> min-width: 44px; min-height: 44px
TOUCH-02: ResultDisplay.svelte — change .result-share-btn min-height: 32px -> 44px; add min-width: 44px
TOUCH-03: DiscoveryItem.svelte — change .share-btn min-width: 28px; min-height: 28px -> min-width: 44px; min-height: 44px
TOUCH-04: ElementDetail.svelte — change .detail-close min-width: 32px; min-height: 32px -> min-width: 44px; min-height: 44px
TOUCH-05: ElementGrid.svelte — read .tab-btn; verify min-height: 44px already set; no code change needed.

D-08 — UX-AUDIT.md: After verifying TOUCH-05, update issue #8 in UX-AUDIT.md:
  BEFORE: 8. **Filter tabs under-sized** (ElementGrid.svelte:.tab-btn) — min-height: 36px is below the 44px minimum.
  AFTER:  8. [RESOLVED — Phase 14] ElementGrid.svelte:.tab-btn already has min-height: 44px. No action needed.
</action>
<acceptance_criteria>
- grep -c "min-height: 44px" src/lib/components/Slot.svelte  returns at least 1
- grep -c "min-width: 44px" src/lib/components/Slot.svelte  returns at least 1
- grep -c "min-height: 44px" src/lib/components/ResultDisplay.svelte  returns at least 1
- grep -c "min-width: 44px" src/lib/components/DiscoveryItem.svelte  returns at least 1
- grep -c "min-height: 44px" src/lib/components/DiscoveryItem.svelte  returns at least 1
- grep -c "min-width: 44px" src/lib/components/ElementDetail.svelte  returns at least 1
- grep -c "min-height: 44px" src/lib/components/ElementDetail.svelte  returns at least 1
- grep -c "min-height: 44px" src/lib/components/ElementGrid.svelte  returns at least 1
- grep -c "RESOLVED" UX-AUDIT.md  returns at least 1
</acceptance_criteria>
</task>

## Verification
```bash
grep "showResetConfirm" src/lib/components/TopBar.svelte
for f in Slot ResultDisplay DiscoveryItem ElementDetail; do
  echo "=== $f ===" && grep "min-height: 44px\|min-width: 44px" "src/lib/components/$f.svelte"
done
grep "min-height: 44px" src/lib/components/ElementGrid.svelte
grep "RESOLVED" UX-AUDIT.md
npm run build
```
