# Phase 19: Design Tokens & Compliance Sweep - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-03
**Phase:** 19-Design Tokens & Compliance Sweep
**Areas discussed:** Color token naming

---

## Color Token Naming

### Q1: Naming convention

| Option | Description | Selected |
|--------|-------------|----------|
| Semantic names | --color-bg, --color-bg-surface, --color-accent, --color-text, --color-text-muted, --color-border, --color-danger, --color-gold | ✓ |
| Palette names | --navy-900, --navy-800, --teal-500, --slate-400 — raw palette, then map to semantic aliases | |
| Hybrid | Palette layer + semantic layer — two-tier system | |

**User's choice:** Semantic names (recommended)
**Notes:** Consistent with existing functional naming pattern (--space-1, --radius-sm, --text-body)

### Q2: Token set granularity

| Option | Description | Selected |
|--------|-------------|----------|
| Full set (~15 tokens) | Covers every semantic role: backgrounds, text, borders, accent, danger, gold, success | ✓ |
| Core only (~8 tokens) | 8 core tokens, some variants stay hardcoded | |

**User's choice:** Full set (~15 tokens)

### Q3: Category colors

| Option | Description | Selected |
|--------|-------------|----------|
| Tokenize categories | Add --cat-fire-bg/--cat-fire-text etc. to :root (16 tokens) | |
| Keep inline | Keep in ElementCard.svelte — game-specific, not theme-level | ✓ |

**User's choice:** Keep inline (recommended)

### Q4: Animation tokens

| Option | Description | Selected |
|--------|-------------|----------|
| Add animation tokens | --duration-micro, --duration-component, --duration-page, --ease-bounce now | ✓ |
| Defer to Phase 22 | Skip for now, add in Feedback & Polish phase | |

**User's choice:** Add animation tokens now

---

## Agent's Discretion

- Reset confirmation approach (window.confirm vs custom modal)
- Focus-visible strategy (global vs per-component)
- Exact token names for the ~15 color set

## Deferred Ideas

None — discussion stayed within phase scope.
