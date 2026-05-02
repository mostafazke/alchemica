# Summary: 01-02 — Port Element and Reaction Data

**Status:** Complete  
**Commit:** feat(01-02)

## What Was Built
All 32 elements and ~46 two-element reactions ported from `alchemica.html` (lines 559–651) into typed TypeScript data files. These are the exclusive source of truth — zero element data in components.

## Key Files Created
- `src/lib/data/elements.ts` — `ELEMENTS` record (32 entries), `BASIC_ELEMENTS` const, `BasicElement` type
- `src/lib/data/reactions.ts` — `REACTIONS` map (~46 entries), `MULTI_REACTIONS` map (3 iron reactions)

## Data Notes
- `water+air` → `cloud` (original behaviour; ice has no working reaction trigger in the prototype)
- `MULTI_REACTIONS` covers all 3 orderings of fire+earth+earth → iron
- Both element orderings included for each reaction (`a+b` and `b+a`) so lookup is direction-independent

## Self-Check: PASSED
- `src/lib/data/elements.ts` contains 32 `category:` entries
- `src/lib/data/reactions.ts` exports `REACTIONS` and `MULTI_REACTIONS`
- `npm run build` passes cleanly after this plan
