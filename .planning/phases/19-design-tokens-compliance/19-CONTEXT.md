# Phase 19: Design Tokens & Compliance Sweep - Context

**Gathered:** 2026-05-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Establish a complete CSS custom properties design token system (colors + animation timing to complement existing spacing/radius/typography tokens) and fix all P0 safety, touch target, accessibility, and focus-visible issues across all components. No layout changes, no new features — purely token infrastructure and compliance fixes.

</domain>

<decisions>
## Implementation Decisions

### Color Token Naming
- **D-01:** Use **semantic names** for color tokens (e.g., `--color-bg`, `--color-accent`, `--color-text-muted`) — consistent with existing functional naming (`--space-1`, `--radius-sm`, `--text-body`)
- **D-02:** Define a **full set of ~15 tokens** covering every semantic role: backgrounds (main, surface, elevated, hover), text (primary, secondary, muted, accent), borders (default, subtle), accent (teal), danger (red), gold/warning, success
- **D-03:** Element **category colors stay inline** in ElementCard.svelte — they're game-specific, not theme-level. No --cat-fire-bg/--cat-fire-text tokens.

### Animation Tokens
- **D-04:** Add animation timing tokens **now** (not deferred to Phase 22): `--duration-micro: 100ms`, `--duration-component: 200ms`, `--duration-page: 300ms`, `--ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1)`

### Agent's Discretion
- Reset confirmation approach: `window.confirm()` vs custom modal — agent picks the simplest approach that looks acceptable
- Focus-visible strategy: global rule vs per-component — agent picks based on what works cleanly with existing component styles
- Exact token names for the ~15 color set — agent maps the recurring hex values to semantic names

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design Specifications
- `DESIGN_SYSTEM.md` — Spacing, touch targets, typography, radius, animation timing tiers, state requirements
- `UX-AUDIT.md` — 28 prioritized issues; Phase 19 addresses P0 (#1–3), P1 (#4–8, #10–11), P2 (#14, #17)
- `UI-SPEC-SHELF-CHAMBER.md` §1 — Design token definitions (spacing, colors, typography, radius, animation)

### Requirements
- `.planning/REQUIREMENTS.md` — v7 requirements SAFE-01–03, TOUCH-01–05, TOKEN-01–02, A11Y-01–03, STATE-01

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/app.css` `:root` block: Already has spacing tokens (--space-1 through --space-13), radius (--radius-sm/md/lg/xl), typography (--text-micro through --text-title). **Extend this block** with color and animation tokens.

### Established Patterns
- All components use scoped `<style>` blocks with hardcoded hex values — ~200+ instances across 16 components
- Recurring hex palette: `#0d1b2e` (bg), `#080f1a`/`#0a1520` (surface), `#0f2035` (hover), `#1a2e4a`/`#1a3a5a` (borders), `#4af0c0` (accent/teal), `#4a6080` (muted text), `#8ab4d4` (secondary text), `#c8d8e8` (primary text), `#e8e8f0` (bright text), `#ff6b6b` (danger), `#ffe44a`/`#e8b84b` (gold), `#2a3550` (very muted — low contrast)
- Category colors defined as `:global(.cat-fire)` etc. in ElementCard.svelte (8 pairs) — staying inline per D-03

### Integration Points
- `src/app.html` line 5: viewport meta has `user-scalable=no` — must remove (SAFE-03)
- `src/lib/components/BottomSheet.svelte` line 73: `display: none !important` — investigate for SAFE-02
- Components with `font-size: 9px`: DiscoveryItem (.disc-formula, .disc-recipe), ElementCard (.el-formula, .el-category), ResultDisplay (.result-new-badge) — must bump to 11px min (A11Y-01)
- Components with `font-size: 10px`: DiscoveryLog (.disc-title, .disc-count), ElementDetail (.detail-category, .detail-recipe-label), ResultDisplay (.result-desc, .result-formula, .result-tip), HintButton (.hint-label, .hint-name) — must bump to 11px min
- No `:focus-visible` styles found anywhere — must add for STATE-01
- Reset button in TopBar.svelte — needs confirmation dialog (SAFE-01)
- Idle/tip text uses `#2a3550` on `#0a1520` bg — fails WCAG AA contrast (A11Y-02)

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches within the decisions above.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 19-Design Tokens & Compliance Sweep*
*Context gathered: 2026-05-03*
