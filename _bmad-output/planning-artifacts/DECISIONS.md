# Alchemica — Decision Ledger

> Non-obvious choices and their reasoning. One line each.
> When an agent drifts from a decision, point it here.

---

| # | Decision | Rationale |
|---|----------|-----------|
| D-01 | **Runes for UI-local state, stores for shared game state** | Runes can't cross component boundaries without context plumbing. 10 existing writable stores already work. Migration adds complexity for no benefit. |
| D-02 | **Frequency stored separately from game save** (`alchemica_frequency` vs `alchemica_v1`) | Frequency is cosmetic visual patina. Losing it doesn't break the game — just resets energy states. Coupling it to the versioned save means every frequency write triggers a full save serialization of 61+ elements. |
| D-03 | **Frequency increments on reaction attempt, not on tap** | Tapping an element into a slot is selection, not use. An element is "used" when it participates in a reaction. This matches the philosophy: the shelf reflects how much *work* an element has done, not how many times you picked it up. |
| D-04 | **Three CSS token layers (raw → semantic → component), never collapsed** | Collapsing to one layer means changing "the border color when a card is hovered" requires editing the global palette or using inline overrides. Three layers let you remap meanings (Layer 2) and create component variants (Layer 3) without touching primitives (Layer 1). |
| D-05 | **No GSAP — Web Animations API + CSS transitions** | GSAP adds ~28KB gzipped. The discovery sequence is 5 chained animations. WAA `animation.finished` promises cover this. If Phase 2 introduces complex overlapping timelines, revisit — but "might need it later" isn't a reason to ship it now. |
| D-06 | **Single overlay canvas, not per-component** | Mobile GPUs throttle after ~8 active WebGL/2D contexts. 61 cards × their own canvas = non-starter. A single canvas also handles effects that cross component boundaries (screen-edge flash, environmental power dimming). |
| D-07 | **New components created alongside old, not renamed in place** | Renaming `Slot.svelte` → `MixingSlot.svelte` breaks every import. Parallel creation lets A/B comparison in the same build and clean rollback if something goes wrong. Old files deleted in cleanup commit after Phase 1 passes. |
| D-08 | **Space Mono from Google Fonts CDN, not self-hosted** | 2 weights × 1 style ≈ 50KB. Almost certainly cached on user's device already. Self-hosting adds build pipeline steps (font subsetting, preload hints, cache headers) for no measurable load time improvement on mobile. |
| D-09 | **`display=swap` for font loading** | First-visit layout shift is negligible — system monospace fallback is metrically close. The game area (emoji + cards) dominates attention, not label text. Blocking render for a font load on mobile is worse than a subtle swap. |
| D-10 | **Thresholds in one file (`src/lib/config/thresholds.ts`)** | When playtesting reveals "settled" at 20 uses is too low (it will), you change one number in one file. Not hunt through 6 components. |
| D-11 | **AnimationController accessed via Svelte context, not module import** | The controller needs a canvas ref, which only exists after mount. Context passes the live instance down. Module-level import would require lazy initialization guards everywhere or a global singleton that fights SSR. |
| D-12 | **200ms discovery silence is a setTimeout, not baked into audio file** | Timing tuning is code, not asset production. Changing "the pause before the sound" shouldn't require re-rendering an audio file. |
| D-13 | **Tailwind CSS stays in build but is not used for game UI** | Removing Tailwind touches vite config, potentially breaks settings/leaderboard pages. Not worth the risk in Phase 1. It contributes nothing to bundle size via tree-shaking if unused. |
