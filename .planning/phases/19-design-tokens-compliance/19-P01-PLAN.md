---
phase: 19
plan: P01
title: "Token Foundation + Global Styles"
wave: 1
depends_on: []
requirements: [TOKEN-01, SAFE-03, STATE-01]
files_modified: [src/app.css, src/app.html]
autonomous: true
estimated_tasks: 2
must_haves:
  truths:
    - ":root block contains all 20 color tokens and 4 animation tokens per D-01/D-02/D-04"
    - "Global :focus-visible rule applies accent outline to all interactive elements"
    - "Viewport meta allows pinch-to-zoom (no user-scalable=no)"
    - "Existing spacing/radius/typography tokens are unchanged"
  artifacts:
    - path: "src/app.css"
      provides: "Complete design token :root block + global :focus-visible"
      contains: "--color-accent"
    - path: "src/app.html"
      provides: "Accessible viewport meta tag"
  key_links:
    - from: "src/app.css :root"
      to: "all component <style> blocks"
      via: "var(--token-name) references"
      pattern: "var\\(--color-"
---

# Plan P01: Token Foundation + Global Styles

## Objective
Define the complete design token system in `app.css :root` (20 color tokens + 4 animation tokens per D-01/D-02/D-04), add a global `:focus-visible` rule for STATE-01, replace hardcoded hex values within `app.css` itself with token references, and fix the viewport meta tag to allow pinch-to-zoom (SAFE-03).

This plan creates the token infrastructure that all subsequent Wave 2 plans depend on.

## Tasks

<task id="1">
<title>Extend :root with color + animation tokens and add global :focus-visible</title>
<read_first>
- src/app.css (current :root block, lines 1-50; also scrollbar/body styles that use hardcoded hex)
- DESIGN_SYSTEM.md (token spec reference)
- .planning/phases/19-design-tokens-compliance/19-RESEARCH.md §Complete Token Set (exact token names and values)
</read_first>
<action>
In `src/app.css`, extend the existing `:root` block (after the Typography section, before the closing `}`) with these exact tokens:

```css
  /* ─── Color Tokens ─── */

  /* Backgrounds */
  --color-bg-deep:       #080f1a;
  --color-bg-surface:    #0a1520;
  --color-bg-raised:     #0d1b2e;
  --color-bg-hover:      #0f2035;
  --color-bg-selected:   #0f3028;

  /* Borders */
  --color-border-subtle: #1a2e4a;
  --color-border-mid:    #1a3a5a;

  /* Text */
  --color-text-primary:  #c8d8e8;
  --color-text-bright:   #e8e8f0;
  --color-text-secondary:#8ab4d4;
  --color-text-muted:    #4a6080;

  /* Semantic */
  --color-accent:        #4af0c0;
  --color-accent-muted:  #4af0c060;
  --color-accent-dim:    #4af0c040;
  --color-gold:          #e8b84b;
  --color-gold-bright:   #ffe44a;
  --color-danger:        #ff6b6b;
  --color-success:       #6cc87a;

  /* ─── Animation Tokens ─── */
  --duration-micro:      100ms;
  --duration-component:  200ms;
  --duration-page:       300ms;
  --ease-bounce:         cubic-bezier(0.34, 1.56, 0.64, 1);
```

Then add a global `:focus-visible` rule AFTER the `button, [role="button"]` block:

```css
/* ─── Global Focus-Visible ─────────────────────────────────────────────────── */
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
```

Then replace the hardcoded hex values in `app.css` body/scrollbar styles with token references:
- `html, body` block: `background: #0d1b2e` → `background: var(--color-bg-raised)`; `color: #c8d8e8` → `color: var(--color-text-primary)`
- `::-webkit-scrollbar-track`: `background: #080f1a` → `background: var(--color-bg-deep)`
- `::-webkit-scrollbar-thumb`: `background: #1a3a5a` → `background: var(--color-border-mid)`
- `.portrait-rotate-overlay` block: `background: #0d1b2e` → `background: var(--color-bg-raised)`; `color: #8ab4d4` → `color: var(--color-text-secondary)`
- Any other hardcoded hex in app.css that maps to a token (check the full file)

Do NOT modify the existing spacing, radius, or typography tokens — only extend.
</action>
<acceptance_criteria>
- `grep -c "\-\-color-accent:" src/app.css` returns 1
- `grep -c "\-\-color-bg-raised:" src/app.css` returns 1
- `grep -c "\-\-color-text-primary:" src/app.css` returns 1
- `grep -c "\-\-duration-micro:" src/app.css` returns 1
- `grep -c "\-\-ease-bounce:" src/app.css` returns 1
- `grep -c ":focus-visible" src/app.css` returns at least 1
- `grep -c "outline: 2px solid var(--color-accent)" src/app.css` returns 1
- `grep -c "var(--color-bg-raised)" src/app.css` returns at least 2 (body + portrait overlay)
- `grep -c "var(--color-text-primary)" src/app.css` returns at least 1 (body color)
- Existing `--space-1`, `--radius-sm`, `--text-micro` tokens are still present and unchanged
- `grep -c "#0d1b2e" src/app.css` returns exactly 1 (only in the :root token definition line)
</acceptance_criteria>
</task>

<task id="2">
<title>Fix viewport meta to allow pinch-to-zoom (SAFE-03)</title>
<read_first>
- src/app.html (line 5 — current viewport meta tag)
</read_first>
<action>
In `src/app.html` line 5, change the viewport meta tag from:
```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
```
to:
```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
```

Remove `maximum-scale=1, user-scalable=no` — these block pinch-to-zoom and violate WCAG 1.4.4.
</action>
<acceptance_criteria>
- `grep -c "user-scalable=no" src/app.html` returns 0
- `grep -c "maximum-scale=1" src/app.html` returns 0
- `grep -c "viewport-fit=cover" src/app.html` returns 1
- `grep -c "width=device-width, initial-scale=1" src/app.html` returns 1
</acceptance_criteria>
</task>

## Verification
```bash
# All 24 new tokens defined
grep -c "\-\-color-" src/app.css | head -1  # should be ≥20
grep -c "\-\-duration-" src/app.css | head -1  # should be ≥3
grep -c "\-\-ease-" src/app.css | head -1  # should be ≥1

# Focus-visible rule exists
grep ":focus-visible" src/app.css

# No hardcoded hex in app.css body/scrollbar (outside :root definitions)
# Only hex values in :root definitions, portrait overlay, and view-transition should remain

# Viewport meta is accessible
grep "viewport" src/app.html

# Build still works
npm run build
```
