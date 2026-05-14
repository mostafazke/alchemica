# Deferred Work

## Deferred from: code review of 1-2-token-verification-pass (2026-05-09)

- **`#0a2a1a` dark green success/owned bg in settings** — Not a navy-palette color; intentional game-UI success state. Not in AC1-10 scope. Should be tokenized in a future "success/owned state token" pass (Story 2.x or dedicated token story).
- **`#4a6fa5` / `#a0b8d8` / `#4a6fa550` in HintButton + StuckHintPrompt** — Intentional locked/disabled-state cool-blue colors preserved by design decision. Not in canonical mapping. Review in Story 2.x component rewrites.
- **`#4a5a60` / `#111f30` in leaderboard `.lb-v1-badge`** — Intentional v1-badge band styling. Deferred to leaderboard component rewrite (Epic 2+).

## Deferred from: code review of 2-1-elementcard-rewrite-frequency-system (2026-05-10)

- **Grid-tile 56px card in 76px ElementGrid cell** — 56px card sits in a `minmax(76px, 1fr)` cell leaving ~10px visual slack on each side. Pre-existing grid container design; Story 2.4 (ShelfGrid) is the planned replacement.

## Deferred from: code review of story-2-5-ux-interaction-overhaul (2026-05-09)

- **Orphaned `alchemica_shelf_filter` localStorage key** — ElementGrid.svelte removed the filter but never calls `localStorage.removeItem()`. Existing users retain a dead key. Minor storage hygiene.
- **`$derived` calling impure `getHint()` with `Math.random()`** — HintButton.svelte uses `Math.random()` inside a `$derived`, violating purity. Currently mitigated by `activeHint` capture pattern but architecturally fragile.
