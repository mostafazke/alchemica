# Phase 19: Design Tokens & Compliance Sweep - Context

**Gathered:** 2026-05-03
**Updated:** 2026-05-05
**Status:** ⏸ PAUSED — v8 architecture milestone must be planned first

> **Why paused:** A game screen navigation restructure (BottomBar removal, settings screen,
> enriched main menu) was identified during discussion. This new milestone (v8) absorbs v7
> phases 19–22 under a unified architecture. Phase 19 should be re-scoped after v8 planning
> defines what survives vs. what changes. Run `/gsd-new-milestone` for v8 before executing.

<domain>
## Phase Boundary

Establish a complete CSS custom properties design token system (colors + animation timing to complement existing spacing/radius/typography tokens) and fix all P0 safety, touch target, accessibility, and focus-visible issues across all components. No layout changes, no new features — purely token infrastructure and compliance fixes.

**⚠ Pending re-scope:** After v8 architecture is defined, this phase boundary may shrink (some
components may be removed/restructured, making full token migration premature).

</domain>

<decisions>
## Implementation Decisions

### Color Token Naming (locked — architecture-independent)
- **D-01:** Use **semantic names** for color tokens (e.g., `--color-bg`, `--color-accent`, `--color-text-muted`) — consistent with existing functional naming (`--space-1`, `--radius-sm`, `--text-body`)
- **D-02:** Define a **full set of ~15 tokens** covering every semantic role: backgrounds (main, surface, elevated, hover), text (primary, secondary, muted, accent), borders (default, subtle), accent (teal), danger (red), gold/warning, success
- **D-03:** Element **category colors stay inline** in ElementCard.svelte — they're game-specific, not theme-level. No --cat-fire-bg/--cat-fire-text tokens.

### Animation Tokens (locked — architecture-independent)
- **D-04:** Add animation timing tokens **now** (not deferred to Phase 22): `--duration-micro: 100ms`, `--duration-component: 200ms`, `--duration-page: 300ms`, `--ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1)`

### Radius Token Values (locked — 2026-05-05)
- **D-05:** **Fix `app.css` to match `DESIGN_SYSTEM.md`**: radius tokens updated to sm:8px | md:12px | lg:16px | xl:24px. (Previous values sm:6/md:8/lg:10/xl:16 were misaligned with the spec.)

### Reset Confirmation (locked — 2026-05-05)
- **D-06:** Reset confirmation uses a **custom Svelte mini-modal** inside TopBar.svelte — NOT `window.confirm()`. Rationale: `window.confirm()` is suppressed in Capacitor Android WebView. Modal must be danger-styled (red), two buttons (Cancel / Reset), ~20–30 lines of Svelte state.

### Focus-Visible Strategy
- **D-07 (agent's discretion):** Global `:focus-visible` rule in `app.css` — agent applies per-component only if global rule creates visual conflicts.

### Audit Document Maintenance (locked — 2026-05-05)
- **D-08:** When P02 verifies TOUCH-05 (filter tab height), **also correct UX-AUDIT.md issue #8** to reflect actual 44px height. Audit doc must stay accurate.

### Agent's Discretion
- Exact token names for the ~15 color set — agent maps the recurring hex values to semantic names
- Focus-visible strategy: global rule in `app.css` preferred; per-component only if needed

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design Specifications
- `DESIGN_SYSTEM.md` — **Source of truth for token values** (spacing, touch targets, typography, radius, animation). Radius values here take precedence over old app.css values.
- `UX-AUDIT.md` — 28 prioritized issues; Phase 19 addresses P0 (#1–3), P1 (#4–8, #10–11), P2 (#14, #17)
- `UI-SPEC-SHELF-CHAMBER.md` §1 — Design token definitions (spacing, colors, typography, radius, animation)

### Requirements
- `.planning/REQUIREMENTS.md` — v7 requirements SAFE-01–03, TOUCH-01–05, TOKEN-01–02, A11Y-01–03, STATE-01

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/app.css` `:root` block: Already has spacing tokens (--space-1 through --space-13), radius (--radius-sm/md/lg/xl — **values to update per D-05**), typography (--text-micro through --text-title). **Extend this block** with color and animation tokens.

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
- Reset button in TopBar.svelte — needs custom Svelte modal per D-06 (NOT window.confirm)
- Idle/tip text uses `#2a3550` on `#0a1520` bg — fails WCAG AA contrast (A11Y-02)

</code_context>

<specifics>
## Specific Ideas

- Custom reset modal: danger-red styled, two buttons (Cancel / Reset), Svelte `$state` boolean toggle, inline in TopBar.svelte — no separate component file needed.

</specifics>

<deferred>
## Deferred Ideas

### v8 — Game Screen Architecture Overhaul (new milestone — absorbs v7)
The following ideas emerged during Phase 19 discussion and constitute a new milestone (v8) that
supersedes the remaining v7 roadmap. **Plan v8 before executing any v7 phase.**

- **Minimal game screen**: Remove BottomBar entirely. Game screen has only: TopBar (pause→menu | score | discovered count) + element grid (left) + mixing area (right). Navigation via pause button that opens main menu.
- **Settings screen**: Accessible from main menu. Contains: reset game (moved from TopBar), sound toggle, haptics toggle, export/import save.
- **Enriched main menu**: Prominently features daily challenge card with countdown timer to daily reset, last-played info, high score, settings link, play button.
- **v8 absorbs v7 phases 19–22**: Tokens, shelf rebuild, chamber rebuild, and feedback polish all execute under the new architecture — not before it. Re-plan all four phases after v8 structure is defined.

</deferred>

---

*Phase: 19-Design Tokens & Compliance Sweep*
*Context gathered: 2026-05-03*
*Context updated: 2026-05-05*
