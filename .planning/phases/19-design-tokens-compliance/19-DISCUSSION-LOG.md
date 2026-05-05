# Phase 19: Design Tokens & Compliance Sweep - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Original date:** 2026-05-03
**Updated:** 2026-05-05
**Phase:** 19-Design Tokens & Compliance Sweep
**Areas discussed (original):** Color token naming, Animation tokens, Reset confirmation, Focus-visible
**Areas discussed (2026-05-05 update):** Reset confirmation mechanism, Radius token reconciliation, TOUCH-05 + audit stale entry, UI elements position (→ v8 architecture pivot)

---

## Original Discussion (2026-05-03)

### Color Token Naming

| Option | Selected |
|--------|----------|
| Semantic names (--color-bg, --color-bg-surface, etc.) | ✓ |
| Palette names (--navy-900, --teal-500) | |
| Hybrid (palette + semantic two-tier) | |

**User's choice:** Semantic names. Consistent with --space-1, --radius-sm, --text-body pattern.

| Option | Selected |
|--------|----------|
| Full set (~15 tokens) covering all semantic roles | ✓ |
| Core only (~8 tokens) | |

**User's choice:** Full set (~15 tokens).

| Option | Selected |
|--------|----------|
| Tokenize category colors (--cat-fire-bg, etc.) | |
| Keep category colors inline in ElementCard.svelte | ✓ |

**User's choice:** Keep inline — game-specific, not theme-level.

### Animation Tokens

| Option | Selected |
|--------|----------|
| Add now (Phase 19): --duration-micro/component/page, --ease-bounce | ✓ |
| Defer to Phase 22 | |

**User's choice:** Add now.

### Agent's Discretion (original)
- Reset confirmation: window.confirm() vs custom modal
- Focus-visible: global rule vs per-component
- Exact token names for ~15 color set

---

## Update Discussion (2026-05-05)

### Reset Confirmation Mechanism

| Option | Description | Selected |
|--------|-------------|----------|
| `window.confirm()` | Simple, but suppressed in Capacitor Android WebView | |
| HTML `<dialog>` element | Works in WebView, ~10 lines extra | |
| Custom Svelte confirm modal | Danger-styled, two buttons, ~20–30 lines | ✓ |

**User's choice:** Custom Svelte confirm modal.
**Notes:** window.confirm() was previously "agent's discretion" — raised as real Capacitor risk.

---

### Radius Token Reconciliation

| Option | Description | Selected |
|--------|-------------|----------|
| Fix `app.css` to match DESIGN_SYSTEM.md (sm:8/md:12/lg:16/xl:24) | ✓ | |
| Fix DESIGN_SYSTEM.md to match `app.css` (sm:6/md:8/lg:10/xl:16) | | |
| Leave both, defer | | |

**User's choice:** Fix app.css — DESIGN_SYSTEM.md is source of truth.

---

### TOUCH-05 + Stale Audit Entry

| Option | Selected |
|--------|----------|
| Correct UX-AUDIT.md issue #8 when verifying | ✓ |
| Leave audit as-is (point-in-time snapshot) | |

**User's choice:** Correct UX-AUDIT.md during P02 verification.

---

### UI Elements Position (→ Strategic Pivot)

**User request:** Game screen should focus on playing elements only. Remove BottomBar. Other elements (settings, daily challenge, reset, discoveries) move to main menu or settings screen.

| Phase scope option | Selected |
|--------------------|----------|
| Defer to future milestone (v8) | |
| Plan v8 architecture first before executing Phase 19 | ✓ |
| Minor adjustment to SAFE-01 only | |

**User's choice:** Plan v8 first — Phase 19 paused.

**v8 architecture vision:**
- Minimal game screen: no BottomBar, TopBar has pause→menu | score | discovered count
- Settings screen (from main menu): reset game, sound/haptics, export/import
- Enriched main menu: daily challenge card with countdown, settings link, play button

**v7/v8 relationship:**
- v8 absorbs v7 phases 19–22 (one combined overhaul milestone under new architecture)
- Run `/gsd-new-milestone` before executing any v7 phase

---

## Agent's Discretion (final)

- Focus-visible: global `:focus-visible` in `app.css` preferred; per-component only if conflicts
- Exact color token names for ~15-token set — agent maps hex values to semantic names
- Custom reset modal: inline in TopBar.svelte (no separate component file)

## Deferred Ideas

- **v8 Game Screen Architecture Overhaul** — absorbs all v7 phases. See CONTEXT.md `<deferred>` section for full spec.
