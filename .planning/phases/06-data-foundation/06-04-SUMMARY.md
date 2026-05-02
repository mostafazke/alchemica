---
plan: 06-04
status: complete
wave: 4
---

## What Was Done

Updated the discovery counter span in `TopBar.svelte`:

- Removed the microscope emoji `🔬`
- Added the word `discovered` after the count
- Result: `{count}/{total} discovered` (e.g., `4/62 discovered`)
- No CSS changes, no new classes, `.stat` color remains `#8ab4d4`

## Files Changed

- `src/lib/components/TopBar.svelte` — line 10 stat span text only

## Verification

- Span no longer contains `🔬`
- Span contains `discovered` after the fraction
- `Object.keys(ELEMENTS).length` still used for total (dynamic, not hardcoded)
- No layout or styling changes
