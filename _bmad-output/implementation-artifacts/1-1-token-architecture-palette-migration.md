# Story 1.1: Token Architecture & Palette Migration

Status: done

## Story

As a developer,
I want the three-layer CSS token system (raw → semantic → component) defined in app.css with the warm stone palette replacing all hardcoded navy values,
So that all subsequent component work uses consistent, overridable design tokens.

## Acceptance Criteria

1. **Given** the current app.css has hardcoded hex values (#0d1b2e, #c8d8e8, #4af0c0, etc.)
   **When** I replace them with the three-layer token architecture from Architecture §4
   **Then** Layer 1 (raw values) defines ~15 primitive color variables
   **And** Layer 2 (semantic tokens) maps raw values to UI roles (bg-deep, bg-surface, border-subtle, accent, text-primary, etc.)
   **And** all existing hardcoded hex values in app.css are replaced with semantic token references
   **And** the background shifts from #0d1b2e to var(--color-bg-deep) (#0a0805)
   **And** the accent shifts from #4af0c0 to var(--color-accent) (#d4a84a)
   **And** text color shifts from #c8d8e8 to var(--color-text-primary) (#d8cbb8)

2. **Given** material tokens don't exist yet
   **When** I add them to Layer 2
   **Then** --material-brass-highlight, --material-brass-shadow, --material-glass-clear, --material-glass-amber, --material-stone-warm are defined per Code Brief

3. **Given** energy state tokens don't exist yet
   **When** I add them to Layer 2
   **Then** --energy-settled (opacity 0.85), --energy-fresh (amber glass box-shadow), --energy-power (barely visible 3px glow) are defined per Code Brief

4. **Given** the font loading needs Space Mono
   **When** I add preconnect + preload links to app.html
   **Then** Space Mono 400/700 loads from Google Fonts CDN with display=swap
   **And** font-family declarations use the fallback stack: 'Space Mono', ui-monospace, 'Cascadia Code', 'Fira Code', monospace

5. **Given** the PWA manifest has navy colors
   **When** I update vite.config.ts
   **Then** theme_color and background_color are both #0a0805

6. **Given** the :focus-visible outline is teal
   **When** I update it
   **Then** outline color uses var(--color-accent)

7. **Given** scrollbar styles use navy colors
   **When** I update them
   **Then** scrollbar track uses var(--color-bg-deep), thumb uses var(--color-border-mid)

8. **Given** prefers-reduced-motion is not globally handled
   **When** I add the reduced motion media query block
   **Then** a single block in app.css disables all transition-duration and animation-duration to 0.01ms
   **And** opacity fades are preserved

9. **Given** buttons currently may use filled backgrounds
   **When** I add the ghost button base styles
   **Then** .btn-ghost uses transparent background with border-only styling per Code Brief Law 2

10. **Given** app.html has meta theme-color set to #0d1b2e
    **When** I update the meta tag
    **Then** content is #0a0805

## Tasks / Subtasks

- [x] Task 1: Add Layer 1 + Layer 2 tokens to app.css :root (AC: #1, #2, #3)
  - [x] 1.1: Add ~15 raw (Layer 1) color variables under `/* ─── Layer 1: Design Tokens (raw) ─── */`
  - [x] 1.2: Add semantic (Layer 2) token mappings under `/* ─── Layer 2: Semantic Tokens ─── */`
  - [x] 1.3: Add material tokens to Layer 2
  - [x] 1.4: Add fluid scaling tokens (clamp-based font sizes, spacing, shelf-width)
- [x] Task 2: Replace hardcoded values in app.css with semantic tokens (AC: #1, #6, #7)
  - [x] 2.1: `html, body` background from `#0d1b2e` → `var(--color-bg-deep)`
  - [x] 2.2: `html, body` color from `#c8d8e8` → `var(--color-text-primary)`
  - [x] 2.3: Scrollbar track from `#080f1a` → `var(--color-bg-deep)`, thumb from `#1a3a5a` → `var(--color-border-mid)`
  - [x] 2.4: `:focus-visible` outline from `#4af0c0` → `var(--color-accent)`
  - [x] 2.5: `.portrait-rotate-overlay` background from `#0d1b2e` → `var(--color-bg-deep)`
  - [x] 2.6: `.portrait-rotate-overlay` text colors: `#8ab4d4` → `var(--color-text-secondary)`, `#4af0c0` → `var(--color-accent)`, `#4a6080` → `var(--color-text-muted)`
- [x] Task 3: Update font loading in app.html (AC: #4)
  - [x] 3.1: Add `<link rel="preconnect" href="https://fonts.googleapis.com">` and crossorigin variant
  - [x] 3.2: Add `<link rel="stylesheet">` for Space Mono 400,700 from Google Fonts with `display=swap`
  - [x] 3.3: Update font-family in `html, body` to `'Space Mono', ui-monospace, 'Cascadia Code', 'Fira Code', monospace`
- [x] Task 4: Update PWA manifest and meta tag (AC: #5, #10)
  - [x] 4.1: vite.config.ts: `theme_color` from `#0d1b2e` → `#0a0805`
  - [x] 4.2: vite.config.ts: `background_color` from `#0d1b2e` → `#0a0805`
  - [x] 4.3: app.html: `<meta name="theme-color" content="#0d1b2e">` → `content="#0a0805"`
- [x] Task 5: Add reduced-motion support (AC: #8)
  - [x] 5.1: Add `@media (prefers-reduced-motion: reduce)` block that sets `*, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }`
- [x] Task 6: Add ghost button base styles (AC: #9)
  - [x] 6.1: Add `.btn-ghost` class: transparent bg, `var(--color-border-mid)` border, `var(--color-text-primary)` text, hover state with `var(--color-border-active)` border

### Review Follow-ups (AI)

- [x] [AI-Review][Patch] `.btn-ghost:hover` border-color wrong token — must be `var(--color-border-active)` not `var(--color-accent)` per task 6.1 and Code Brief pattern [src/app.css]
- [x] [AI-Review][Patch] `.btn-ghost` missing touch-target properties — add `min-height: var(--space-11)`, `display: inline-flex`, `align-items: center`, `justify-content: center` per Code Brief ghost button pattern [src/app.css]
- [x] [AI-Review][Patch] `scroll-behavior: auto !important` missing from `@media (prefers-reduced-motion: reduce)` block per Dev Notes pattern (AC #8) [src/app.css]
- [x] [AI-Review][Defer] Google Fonts `<link rel="stylesheet">` is render-blocking — non-blocking preload pattern not required by story spec; address in a future performance pass [src/app.html] — deferred, pre-existing approach matches spec
- [x] [AI-Review][Defer] `--raw-brass-500: #b8944a` defined in Layer 1 but unreferenced — reserve for Story 2.x material tones or remove [src/app.css] — deferred, intentional for future
- [x] [AI-Review][Defer] 20+ components hardcode `'Space Mono', monospace` short stack, won't inherit full fallback chain — Story 1.2 scope [src/lib/components/*.svelte] — deferred, pre-existing

## Dev Notes

### Critical Architecture Constraints

- **Three-layer token architecture is MANDATORY** — never collapse layers. See Architecture §4 and DECISIONS.md D-04.
- **Layer 1** = raw primitives (no semantic meaning). **Layer 2** = semantic mappings (UI roles). **Layer 3** = component-scoped overrides (done in component `<style>` blocks, NOT in this story).
- **Energy state tokens** are CSS comments in Layer 2 — they describe the visual recipe, not actual CSS variables (e.g., `--energy-settled` = "apply opacity 0.85", `--energy-fresh` = "apply box-shadow 0 0 8px var(--material-glass-amber)"). These are documentation for Story 2.1 implementation.
- **No GSAP** — Decision D-05. All animation uses Web Animations API + CSS transitions.
- **Tailwind stays in build** but is NOT used for game UI — Decision D-13.

### Exact Token Values (from Code Brief + Architecture §4)

**Layer 1 — Raw Values:**
```css
--raw-stone-900: #0a0805;
--raw-stone-800: #110e08;
--raw-stone-700: #16120b;
--raw-stone-600: #1c1610;
--raw-brass-900: #2a2218;
--raw-brass-700: #3d3020;
--raw-brass-500: #b8944a;
--raw-brass-400: #d4a84a;
--raw-gold-400: #e8b84b;
--raw-ember-500: #c45a3a;
--raw-parchment-200: #d8cbb8;
--raw-parchment-400: #a89478;
--raw-parchment-600: #6b5a45;
--raw-glass-clear: rgba(200, 180, 140, 0.06);
--raw-glass-amber: rgba(180, 120, 60, 0.12);
```

**Layer 2 — Semantic Tokens:**
```css
--color-bg-deep: var(--raw-stone-900);
--color-bg-surface: var(--raw-stone-800);
--color-bg-raised: var(--raw-stone-700);
--color-bg-hover: var(--raw-stone-600);
--color-border-subtle: var(--raw-brass-900);
--color-border-mid: var(--raw-brass-700);
--color-border-active: rgba(184, 148, 74, 0.38);
--color-border-hot: var(--raw-brass-400);
--color-accent: var(--raw-brass-400);
--color-accent-dim: rgba(212, 168, 74, 0.19);
--color-gold: var(--raw-gold-400);
--color-danger: var(--raw-ember-500);
--color-text-primary: var(--raw-parchment-200);
--color-text-secondary: var(--raw-parchment-400);
--color-text-muted: var(--raw-parchment-600);
--material-brass-highlight: var(--raw-brass-400);
--material-brass-shadow: var(--raw-brass-900);
--material-glass-clear: var(--raw-glass-clear);
--material-glass-amber: var(--raw-glass-amber);
--material-stone-warm: var(--raw-stone-900);
```

**Fluid Scaling Tokens:**
```css
--font-size-body: clamp(0.875rem, 2.5vw, 1rem);
--font-size-label: clamp(0.6875rem, 2vw, 0.8125rem);
--space-xs: clamp(0.25rem, 1vw, 0.5rem);
--space-sm: clamp(0.375rem, 1.5vw, 0.75rem);
--shelf-width: clamp(35%, 40vw, 45%);
```

### Old Palette → New Palette Mapping (for token replacement in app.css)

| Old Hex | Old Role | New Token | New Hex |
|---------|----------|-----------|---------|
| `#0d1b2e` | Navy background | `var(--color-bg-deep)` | #0a0805 |
| `#080f1a` | Scrollbar track | `var(--color-bg-deep)` | #0a0805 |
| `#c8d8e8` | Cool parchment text | `var(--color-text-primary)` | #d8cbb8 |
| `#4af0c0` | Teal accent | `var(--color-accent)` | #d4a84a |
| `#1a3a5a` | Scrollbar thumb / borders | `var(--color-border-mid)` | #3d3020 |
| `#8ab4d4` | Secondary text | `var(--color-text-secondary)` | #a89478 |
| `#4a6080` | Muted text | `var(--color-text-muted)` | #6b5a45 |

### Files Modified by This Story

| File | Change Type | What Changes |
|------|------------|--------------|
| `src/app.css` | UPDATE | Add Layer 1+2 tokens to :root, replace all hardcoded hex values with tokens, add reduced-motion block, add ghost button styles |
| `src/app.html` | UPDATE | Add Google Fonts preconnect + stylesheet links, update meta theme-color |
| `vite.config.ts` | UPDATE | Update manifest theme_color and background_color from #0d1b2e to #0a0805 |

### Files NOT Modified by This Story

- Individual .svelte component files — those have hardcoded hex values but they are migrated in Story 1.2 (Token Verification Pass)
- Route files (src/routes/*.svelte) — also Story 1.2
- No new files created in this story — all changes are to existing files

### Existing app.css Structure (preserve this order)

The current app.css has these sections in order:
1. `:root` block with spacing, radius, and typography tokens (lines 3-25) — **EXPAND this block** with Layer 1+2 color/material tokens
2. `*, *::before, *::after` box-sizing reset (lines 27-31)
3. `html, body` styles (lines 33-41) — **UPDATE** background, color, font-family
4. Scrollbar styles (lines 43-46) — **UPDATE** colors
5. `button, [role="button"]` touch-action (lines 48-50)
6. `:focus-visible` (lines 52-56) — **UPDATE** outline color
7. View Transitions keyframes (lines 58-79)
8. Portrait rotate overlay (lines 81-end) — **UPDATE** colors
9. **ADD** new sections at end: reduced-motion block, ghost button styles

### Existing app.html Structure

Currently has:
- `<meta name="theme-color" content="#0d1b2e">` on line 6 — **UPDATE** to #0a0805
- No font preconnect or stylesheet links — **ADD** before `%sveltekit.head%`
- No preload links — **ADD** preconnect to fonts.googleapis.com and fonts.gstatic.com

### Existing vite.config.ts PWA Config

Lines 20-21:
```
theme_color: '#0d1b2e',
background_color: '#0d1b2e',
```
**UPDATE** both to `'#0a0805'`

### Google Fonts Loading Pattern

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap">
```

### Ghost Button Pattern (from Code Brief Law 2)

```css
.btn-ghost {
  background: transparent;
  border: 1px solid var(--color-border-mid);
  color: var(--color-text-primary);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-sm);
  font-family: 'Space Mono', ui-monospace, 'Cascadia Code', 'Fira Code', monospace;
  font-size: var(--text-label);
  cursor: pointer;
  min-height: var(--space-11);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: border-color 150ms ease, color 150ms ease;
}
.btn-ghost:hover {
  border-color: var(--color-border-active);
  color: var(--color-accent);
}
```

### Reduced Motion Pattern

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### Project Structure Notes

- All source code under `src/`
- CSS tokens go in `src/app.css` `:root` block (not a separate tokens file)
- No CSS modules — using Svelte scoped styles + global app.css
- Tailwind is in the build chain but NOT used for game UI components

### References

- [Source: copilot_CODE_BRIEF.md#Design Tokens] — All exact token values and naming
- [Source: _bmad-output/planning-artifacts/architecture.md#4. CSS Token Layering] — Three-layer architecture with migration path
- [Source: _bmad-output/planning-artifacts/DECISIONS.md#D-04] — CSS token layering decision
- [Source: _bmad-output/planning-artifacts/DECISIONS.md#D-05] — No GSAP
- [Source: _bmad-output/planning-artifacts/DECISIONS.md#D-13] — Tailwind stays, not used for game UI
- [Source: VISUAL_PHILOSOPHY.md] — Warm stone workshop metaphor, material language

## Dev Agent Record

### Agent Model Used
Claude Sonnet 4.6 (GitHub Copilot)

### Senior Developer Review (AI)

**Review Date:** 2026-05-09
**Review Outcome:** Changes Requested
**Action Items:** 3 High, 0 Medium, 3 Deferred

#### Action Items

- [x] [High] `.btn-ghost:hover` — `border-color: var(--color-accent)` must be `var(--color-border-active)` (AC #9, task 6.1, Code Brief pattern)
- [x] [High] `.btn-ghost` — missing `min-height: var(--space-11)`, `display: inline-flex`, `align-items: center`, `justify-content: center` (Code Brief ghost button pattern / WCAG 2.5.5)
- [x] [High] Reduced-motion block — missing `scroll-behavior: auto !important` (AC #8, Dev Notes pattern)
- [x] [Defer] Google Fonts render-blocking `<link rel="stylesheet">` — non-blocking pattern not in scope; defer to perf pass
- [x] [Defer] `--raw-brass-500` unreferenced in Layer 2 — reserve for future material token or remove
- [x] [Defer] Components use short `'Space Mono', monospace` stack — addressed in Story 1.2

### Debug Log References
N/A

### Completion Notes List
- All 6 task groups (15 raw tokens, 16 semantic tokens, 5 material tokens, fluid scaling, hardcoded hex replacement, font loading, PWA manifest, reduced motion, ghost button) implemented
- Zero hardcoded navy hex values remain in app.css
- Pre-existing TS errors (server config type, element store type) are unrelated to this story
- No new files created; only src/app.css, src/app.html, vite.config.ts modified

### File List
- src/app.css (MODIFIED) — Added Layer 1+2 tokens, replaced 7 hardcoded hex values with semantic tokens, added reduced-motion block, added ghost button styles
- src/app.html (MODIFIED) — Added Google Fonts preconnect + stylesheet links, updated meta theme-color to #0a0805
- vite.config.ts (MODIFIED) — Updated PWA manifest theme_color and background_color to #0a0805
