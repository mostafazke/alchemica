# Deferred Work

## Deferred from: code review of story-2-5-ux-interaction-overhaul (2026-05-09)

- **Orphaned `alchemica_shelf_filter` localStorage key** — ElementGrid.svelte removed the filter but never calls `localStorage.removeItem()`. Existing users retain a dead key. Minor storage hygiene.
- **`$derived` calling impure `getHint()` with `Math.random()`** — HintButton.svelte uses `Math.random()` inside a `$derived`, violating purity. Currently mitigated by `activeHint` capture pattern but architecturally fragile.
