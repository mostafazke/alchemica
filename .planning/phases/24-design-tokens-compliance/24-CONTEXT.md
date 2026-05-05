# Phase 24: Design Tokens & Compliance - Context

**Gathered:** 2026-05-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Establish the complete CSS design token system and fix all P0/P1/P2 safety, touch target, accessibility, and focus-visible compliance issues across the app.

**Token migration scope:**
- **In Phase 24 (stable components):** `app.css`, `TopBar.svelte`, `BottomSheet.svelte`, `DiscoveryLog.svelte`, `DiscoveryItem.svelte`, `AchievementGallery.svelte`, `AchievementToast.svelte`, `HintButton.svelte`, `ElementDetail.svelte`, `src/routes/+page.svelte`, `src/routes/settings/+page.svelte`
- **Deferred to rebuild phases (Phase 25/26):** `ElementCard.svelte`, element grid components, `MixingChamber.svelte`, `Slot.svelte`, `ResultDisplay.svelte` — these get their token migration when rebuilt

**Compliance fixes scope:**
- All TOUCH-01–05 touch target fixes apply to ALL components regardless of rebuild schedule
- All A11Y-01 font size fixes apply to ALL components regardless of rebuild schedule
- Phase 23 already resolved SAFE-01, SAFE-02, A11Y-03 — verify and mark done only

No layout changes, no new features, no component rebuilds. Purely infrastructure and compliance.

</domain>

<decisions>
## Implementation Decisions

### Color Token Naming (carried from Phase 19 D-01–D-03)
- **D-01:** Use **semantic names** for color tokens — consistent with existing functional naming (`--space-1`, `--radius-sm`, `--text-body`)
- **D-02:** Define a **full set of ~15 tokens** covering every semantic role: backgrounds (main, surface, elevated, hover), text (primary, secondary, muted, accent), borders (default, subtle), accent (teal), danger (red), gold/warning, success
- **D-03:** Element **category colors stay inline** in ElementCard.svelte — they're game-specific, not theme-level. No `--cat-fire-bg` / `--cat-fire-text` tokens.

### Animation Tokens (carried from Phase 19 D-04)
- **D-04:** Add animation timing tokens to `app.css` `:root` block: `--duration-micro: 100ms`, `--duration-component: 200ms`, `--duration-page: 300ms`, `--ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1)`

### Radius Token Values (carried from Phase 19 D-05)
- **D-05:** Update `app.css` radius tokens to match `DESIGN_SYSTEM.md`: `--radius-sm: 8px` | `--radius-md: 12px` | `--radius-lg: 16px` | `--radius-xl: 24px`
  (Current values sm:6/md:8/lg:10/xl:16 are misaligned with the spec)

### Token Migration Scope (decided in Phase 24 discussion)
- **D-06:** Migrate stable components to design tokens in Phase 24: TopBar, BottomSheet, DiscoveryLog, DiscoveryItem, AchievementGallery, AchievementToast, HintButton, ElementDetail, main menu route, settings route
- **D-07:** Defer token migration of Phase 25/26 rebuild targets (ElementCard, MixingChamber, Slot, ResultDisplay) to their respective rebuild phases — those components get tokens applied when written fresh, not patched twice

### Compliance Fixes (applies to ALL components regardless of rebuild schedule)
- **D-08:** All touch target fixes (TOUCH-01–05) are applied in Phase 24 even on components scheduled for rebuild. Zero regressions — compliance must hold now, not after rebuilds.
- **D-09:** All font size fixes (A11Y-01: bump 9px/10px → 11px) are applied in Phase 24 on ALL components including Phase 25/26 rebuild targets.
- **D-10:** SAFE-03 fix: remove `user-scalable=no` and `maximum-scale=1` from `src/app.html` viewport meta. Keep `width=device-width, initial-scale=1, viewport-fit=cover`.
- **D-11:** A11Y-02 fix: idle/tip text currently uses `#2a3550` on `#0a1520` background (fails WCAG AA). Replace with `--color-text-muted` token (minimum 4.5:1 contrast against `--color-bg`).

### Focus-Visible Strategy (carried from Phase 19 D-07)
- **D-12:** Add a **global `:focus-visible` rule** in `app.css` — `outline: 2px solid var(--color-accent); outline-offset: 2px`. Apply per-component overrides only if the global rule creates visual conflicts on specific elements.

### Pre-Existing Phase 23 Completions
- **D-13:** SAFE-01 (reset confirmation dialog), SAFE-02 (DiscoveryLog visible on all screen sizes), and A11Y-03 (destructive reset styling) were resolved in Phase 23. Phase 24 plans verify these are done and mark requirements complete — no rework needed.

### Audit Document Maintenance (carried from Phase 19 D-08)
- **D-14:** When TOUCH-05 (filter tab 44px height) is verified, also update `UX-AUDIT.md` issue #8 to reflect correct height. Audit doc must stay accurate.

### Agent's Discretion
- Exact names for the ~15 color tokens — agent maps the recurring hex palette (`#0d1b2e`, `#080f1a`, `#0a1520`, `#0f2035`, `#1a2e4a`, `#1a3a5a`, `#4af0c0`, `#4a6080`, `#8ab4d4`, `#c8d8e8`, `#e8e8f0`, `#ff6b6b`, `#ffe44a`/`#e8b84b`, `#2a3550`) to semantic roles per DESIGN_SYSTEM.md
- Order of component migration within Phase 24 — agent decides based on dependency order
- Whether to use a CSS `color-scheme` declaration alongside the token definitions

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design Specifications
- `DESIGN_SYSTEM.md` — **Source of truth for token values** (spacing, touch targets, typography, radius, animation). Radius values here take precedence over current app.css values.
- `UX-AUDIT.md` — 28 prioritized issues; Phase 24 addresses P0 (#1–3 via Phase 23 + SAFE-03), P1 (#4–8, #10–11), P2 (#14, #17)
- `UI-SPEC-SHELF-CHAMBER.md` §1 — Design token definitions (spacing, colors, typography, radius, animation)

### Requirements
- `.planning/REQUIREMENTS.md` — Phase 24 requirements: SAFE-01 (verify), SAFE-02 (verify), SAFE-03, TOUCH-01–05, TOKEN-01–02, STATE-01, A11Y-01–03

### Existing Source Files
- `src/app.css` — `:root` already has spacing, radius, and typography tokens. Color and animation tokens are missing and must be added. Radius values need correction (D-05).
- `src/app.html` — viewport meta on line 5 has `user-scalable=no, maximum-scale=1` — must remove (SAFE-03/D-10)

### Prior Phase Context
- `.planning/phases/23-navigation-architecture/23-CONTEXT.md` — Phase 23 decisions (navigation architecture, settled components)
- `.planning/phases/19-design-tokens-compliance/19-CONTEXT.md` — Original Phase 19 research: recurring hex palette, component inventory, prior decisions D-01–D-08 (all carried forward into this CONTEXT.md)
- `.planning/phases/19-design-tokens-compliance/19-RESEARCH.md` — Original token research for reference

</canonical_refs>

<code_context>
## Existing Code Insights

### Current Token State
- `src/app.css` `:root`: spacing (--space-1 through --space-13), radius (--radius-sm/md/lg/xl — values need correction per D-05), typography (--text-micro through --text-title)
- **Missing from `:root`:** all color tokens, all animation timing tokens
- Global styles hardcode colors: `background: #0d1b2e`, `color: #c8d8e8` on `html, body`

### Stable Components to Tokenize (Phase 24 scope)
- `src/lib/components/TopBar.svelte` — redesigned in Phase 23, ~110 lines
- `src/lib/components/BottomSheet.svelte` — fixed in Phase 23, ~60 lines
- `src/lib/components/DiscoveryLog.svelte` — fixed in Phase 23
- `src/lib/components/DiscoveryItem.svelte` — has 9px font sizes (A11Y-01)
- `src/lib/components/AchievementGallery.svelte`
- `src/lib/components/AchievementToast.svelte`
- `src/lib/components/HintButton.svelte` — has 10px font sizes (A11Y-01)
- `src/lib/components/ElementDetail.svelte` — has 10px font sizes (A11Y-01)
- `src/routes/+page.svelte` — main menu (Phase 23 output)
- `src/routes/settings/+page.svelte` — settings route (Phase 23 output)

### Compliance-Only Components (token migration deferred to Phase 25/26)
- `src/lib/components/ElementCard.svelte` — 9px font-size instances (A11Y-01); touch target not applicable (full-card tap); being rebuilt in Phase 25
- `src/lib/components/MixingChamber.svelte` / `Slot.svelte` — TOUCH-01 (slot clear ✕ button), being rebuilt in Phase 26
- `src/lib/components/ResultDisplay.svelte` — TOUCH-02 (share button), 10px fonts (A11Y-01), being rebuilt in Phase 26

### Compliance Issues Found (from Phase 19 research)
- `src/app.html` line 5: `user-scalable=no, maximum-scale=1` → SAFE-03
- `font-size: 9px`: DiscoveryItem (.disc-formula, .disc-recipe), ElementCard (.el-formula, .el-category), ResultDisplay (.result-new-badge) → A11Y-01
- `font-size: 10px`: DiscoveryLog (.disc-title, .disc-count), ElementDetail (.detail-category, .detail-recipe-label), ResultDisplay (.result-desc, .result-formula, .result-tip), HintButton (.hint-label, .hint-name) → A11Y-01
- Idle/tip text: `color: #2a3550` on `background: #0a1520` → fails WCAG AA → A11Y-02
- No `:focus-visible` styles anywhere → STATE-01
- TOUCH-05: filter tab buttons (ElementGrid shelf tabs) — verify 44px height
- TOUCH-04: ElementDetail close button — verify 44×44px min

</code_context>
