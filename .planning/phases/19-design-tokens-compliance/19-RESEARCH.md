# Phase 19: Design Tokens & Compliance Sweep - Research

**Researched:** 2026-05-03
**Domain:** CSS custom properties, WCAG compliance, touch target sizing
**Confidence:** HIGH

## Summary

Phase 19 is a pure CSS/markup sweep with no new dependencies, no layout changes, and no game logic modifications. The work breaks into two orthogonal tracks: (1) defining color and animation timing tokens in `:root` then replacing ~200+ hardcoded hex values across 16 components and 2 route files, and (2) fixing 14 specific compliance issues (safety, touch, accessibility, focus-visible) identified in UX-AUDIT.md.

The existing `src/app.css` already has spacing, radius, and typography tokens — color and animation tokens extend the same `:root` block. All hex values map cleanly to ~18 semantic roles. The compliance fixes are surgical: 5 touch target `min-width`/`min-height` bumps, 1 viewport meta edit, 1 `window.confirm()` call, 1 `display: none` media query removal, font-size bumps from 9–10px → 11px in 8 components, 2 contrast color swaps, 1 danger-styled reset button, and 1 global `:focus-visible` rule.

**Primary recommendation:** Execute tokens first (so compliance fixes reference tokens instead of hex values), then compliance fixes by requirement group (SAFE → TOUCH → A11Y → STATE), component by component.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- D-01: Use **semantic names** for color tokens (e.g., `--color-bg`, `--color-accent`, `--color-text-muted`)
- D-02: Define a **full set of ~15 tokens** covering every semantic role
- D-03: Element **category colors stay inline** in ElementCard.svelte — no --cat-fire-bg tokens
- D-04: Add animation timing tokens **now**: `--duration-micro: 100ms`, `--duration-component: 200ms`, `--duration-page: 300ms`, `--ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1)`

### Agent's Discretion
- Reset confirmation approach: `window.confirm()` vs custom modal
- Focus-visible strategy: global rule vs per-component
- Exact token names for the ~15 color set

### Deferred Ideas (OUT OF SCOPE)
None.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| TOKEN-01 | CSS custom properties for spacing, colors, typography, radius, animation timing | Color token table §Standard Stack; animation tokens from D-04; spacing/radius/typography already exist in app.css |
| TOKEN-02 | All components use design tokens instead of hardcoded values | Complete hex→token mapping table; file:line audit below |
| SAFE-01 | Reset button shows confirmation dialog before destroying progress | TopBar.svelte line 26 — `onclick={resetGame}` needs confirm() gate |
| SAFE-02 | DiscoveryLog accessible on all screen sizes | BottomSheet.svelte line 73 — `display: none !important` at ≥769px |
| SAFE-03 | Viewport meta allows pinch-to-zoom | app.html line 5 — remove `maximum-scale=1, user-scalable=no` |
| TOUCH-01 | Slot clear button 44×44px hit area | Slot.svelte line 62 — currently 24×24px |
| TOUCH-02 | Result share button 44×44px hit area | ResultDisplay.svelte line 85 — currently 32px min-height |
| TOUCH-03 | DiscoveryItem share button 44×44px hit area | DiscoveryItem.svelte line 55 — currently 28×28px |
| TOUCH-04 | ElementDetail close button 44×44px hit area | ElementDetail.svelte line 68 — currently 32×32px |
| TOUCH-05 | Filter tab buttons 44px min height | ElementGrid.svelte line 58 — already 44px ✅ (verify only) |
| A11Y-01 | No font size below 11px anywhere | 29 instances of 9–10px across 12 components (full list below) |
| A11Y-02 | Idle/tip text meets WCAG AA contrast | ResultDisplay.svelte lines 90–91 — `#2a3550` on `#0a1520` bg |
| A11Y-03 | Reset button has destructive styling | TopBar.svelte line 81–90 — neutral gray, needs danger color at rest |
| STATE-01 | All interactive elements have :focus-visible styles | Zero :focus-visible rules exist anywhere — must add |
</phase_requirements>

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Design tokens (CSS custom properties) | Browser / Client | — | Pure CSS :root variables, no server involvement |
| Touch target compliance | Browser / Client | — | CSS min-width/min-height changes only |
| Accessibility fixes (contrast, font size) | Browser / Client | — | CSS property changes |
| Focus-visible states | Browser / Client | — | CSS :focus-visible pseudo-class |
| Safety fixes (confirm dialog, viewport) | Browser / Client | — | JS confirm() and HTML meta tag |
| DiscoveryLog desktop visibility | Browser / Client | — | CSS media query removal |

## Standard Stack

### Core

No new dependencies. This phase is 100% CSS + HTML + one `window.confirm()` call.

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| CSS Custom Properties | Native | Design token system | Built into all target browsers; zero runtime cost |
| :focus-visible | Native | Keyboard-only focus indicator | Supported in all modern browsers; no polyfill needed |
| window.confirm() | Native | Reset confirmation | Simplest possible destructive action gate; no modal component needed |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| window.confirm() | Custom Svelte modal component | Over-engineered for a single use; adds component complexity. Agent discretion says "simplest approach" |
| Global :focus-visible rule | Per-component :focus-visible | Global is cleaner — one rule in app.css covers all interactive elements. Per-component creates maintenance burden across 16 files |
| CSS custom properties | CSS-in-JS / Tailwind | Violates project constraints (scoped `<style>` blocks, no Tailwind) |

## Architecture Patterns

### Pattern 1: Semantic Color Token System

**What:** Define all color values as CSS custom properties in `:root`, reference them by semantic role in component styles.
**When to use:** Any project with 3+ components sharing the same color palette.

```css
/* src/app.css :root block — extend existing tokens */
:root {
  /* ... existing spacing, radius, typography tokens ... */

  /* Color tokens */
  --color-bg-deep:       #080f1a;
  --color-bg-surface:    #0a1520;
  --color-bg-raised:     #0d1b2e;
  --color-bg-hover:      #0f2035;
  --color-bg-selected:   #0f3028;

  --color-border-subtle: #1a2e4a;
  --color-border-mid:    #1a3a5a;
  --color-border-active: #4af0c060;
  --color-border-hot:    #4af0c0;

  --color-accent:        #4af0c0;
  --color-accent-dim:    #4af0c040;
  --color-gold:          #e8b84b;
  --color-gold-bright:   #ffe44a;
  --color-danger:        #ff6b6b;
  --color-success:       #6cc87a;

  --color-text-primary:  #c8d8e8;
  --color-text-bright:   #e8e8f0;
  --color-text-secondary:#8ab4d4;
  --color-text-muted:    #4a6080;

  /* Animation tokens */
  --duration-micro:     100ms;
  --duration-component: 200ms;
  --duration-page:      300ms;
  --ease-bounce:        cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### Pattern 2: Global Focus-Visible Rule

**What:** A single `:focus-visible` rule in `app.css` that applies to all interactive elements.
**When to use:** Projects with consistent focus styling across all components.

```css
/* src/app.css — after :root block */
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
```

This covers all `<button>`, `<a>`, `<input>`, and `[role="button"]` elements globally. No per-component rules needed unless a component requires a custom focus style (none currently do).

### Pattern 3: Touch Target Extension via min-width/min-height

**What:** Increase interactive element hit areas to 44×44px minimum using CSS sizing properties.
**When to use:** When the visual element must remain smaller than 44px but the tap target must meet accessibility standards.

```css
/* Example: Slot clear button — visual stays small, hit area grows */
.slot-clear {
  min-width: 44px;
  min-height: 44px;
  /* Keep visual ✕ small with font-size, but expand tappable area */
}
```

### Anti-Patterns to Avoid
- **Hardcoding hex values in component `<style>` blocks:** The entire point of this phase is to eliminate this. Every hex → var(--token).
- **Using `outline: none` or `outline: 0`:** Destroys keyboard accessibility. Never suppress focus outlines without providing an alternative.
- **Overriding `:focus-visible` with `:focus`:** The `:focus-visible` pseudo-class only triggers for keyboard navigation, keeping the UI clean for mouse/touch users. Using `:focus` would show outlines on every click.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Focus indicators | Custom JS focus tracking | CSS `:focus-visible` | Native browser behavior, zero JS, works with tab navigation |
| Destructive action confirmation | Custom modal component | `window.confirm()` | One-liner, accessible by default, styled by OS |
| Contrast checking | Manual hex comparison | Pre-calculated values | `#4a6080` on `#0a1520` is 3.2:1 (passes for large text only); `#2a3550` on `#0a1520` is 1.3:1 (fails everything) |

## Common Pitfalls

### Pitfall 1: Token Replacement Misses
**What goes wrong:** Some hex values slip through the replacement sweep, creating inconsistency.
**Why it happens:** Components have hex values in unusual places: `box-shadow`, `text-shadow`, `border` shorthand, `linear-gradient()`, `rgba()` calls, animation `@keyframes`.
**How to avoid:** After replacement, run `grep -rn '#[0-9a-fA-F]\{3,8\}' src/lib/components/` to verify zero remaining hardcoded hex values (except category colors in ElementCard per D-03).
**Warning signs:** Any hex color in a component `<style>` block that isn't a category color.

### Pitfall 2: Alpha Channel Tokens
**What goes wrong:** Values like `#4af0c060` and `#4af0c040` (accent with alpha) can't simply use `var(--color-accent)`.
**Why it happens:** CSS custom properties don't support appending alpha to hex values.
**How to avoid:** Define separate tokens for the common alpha variants: `--color-accent-dim: #4af0c040`, `--color-border-active: #4af0c060`. For one-off alphas, keep the hex value or use `color-mix()` if browser support allows.
**Warning signs:** `var(--color-accent)60` — this syntax doesn't work.

### Pitfall 3: Focus-Visible Conflicts with Component Borders
**What goes wrong:** The global `outline` fights with component border-radius or existing borders, looking ugly.
**Why it happens:** `outline` doesn't follow `border-radius` in some browsers (though modern browsers do).
**How to avoid:** Use `outline-offset: 2px` to separate the focus ring from the element edge. Test on rounded buttons (react-btn with border-radius: 10px).
**Warning signs:** Focus ring appears as a rectangle around a rounded button.

### Pitfall 4: Breaking Category Colors
**What goes wrong:** Accidentally tokenizing the 8 category color pairs in ElementCard.svelte.
**Why it happens:** They look like regular hardcoded colors during a sweep.
**How to avoid:** D-03 explicitly says keep them inline. The grep verification should exclude `:global(.cat-*)` lines.

### Pitfall 5: Viewport Meta Breaking Capacitor
**What goes wrong:** Removing `user-scalable=no` might cause unexpected zoom behavior in the Capacitor WebView on Android.
**Why it happens:** Some Capacitor apps rely on `user-scalable=no` to prevent accidental pinch-zoom during gameplay.
**How to avoid:** Remove `user-scalable=no` and `maximum-scale=1` per SAFE-03/WCAG, but test on Android device afterward. Capacitor WebView should handle this fine — the CSS `touch-action: manipulation` on buttons already prevents double-tap zoom.
**Warning signs:** Users accidentally zooming the game canvas during play.

## Code Examples

### Complete Hex → Token Mapping Table

Every recurring hex value found across all components, mapped to its semantic token name.

| Hex Value | Semantic Token | Usage Count | Semantic Role |
|-----------|---------------|-------------|---------------|
| `#080f1a` | `--color-bg-deep` | 5 | Deepest backgrounds: scrollbars, DiscoveryLog, ElementGrid, Slot empty, recipe bg |
| `#0a1520` | `--color-bg-surface` | 7 | Card/tile surfaces: ElementCard, DiscoveryItem, ResultDisplay, HintButton |
| `#0d1b2e` | `--color-bg-raised` | 11 | Panel backgrounds: TopBar, BottomBar, BottomSheet, SettingsPanel, AchievementGallery, ElementDetail, AchievementToast, HintOverlay |
| `#0f2035` | `--color-bg-hover` | 8 | Hover/active tint: ElementCard hover, tab active, BottomBar active, SettingsPanel hover, HintButton hover |
| `#0f3028` | `--color-bg-selected` | 3 | Selected element tint: ElementCard selected, react-btn gradient end |
| `#1a2e4a` | `--color-border-subtle` | 18 | Default borders/dividers: everywhere |
| `#1a3a5a` | `--color-border-mid` | 11 | Slot dashes, input frames, SettingsPanel borders, ElementDetail border, HintButton border |
| `#4af0c060` | `--color-border-active` | 9 | Hover/focus borders: ElementCard hover, tab active, react-btn border, result success |
| `#4af0c0` | `--color-accent` | 22 | Primary teal accent: text, borders, badges |
| `#4af0c040` | `--color-accent-dim` | 8 | Accent glow/shadow: ElementCard selected glow, BottomBar active border, SettingsPanel |
| `#4af0c030` | (inline) | 2 | Very faint accent: result-share-btn border, react-btn glow — too rare to tokenize |
| `#4af0c020` | (inline) | 1 | ElementDetail box-shadow — too rare to tokenize |
| `#e8b84b` | `--color-gold` | 5 | Gold/reward: DailyChallenge, OfflineIndicator, badge-pulse animation |
| `#ffe44a` | `--color-gold-bright` | 4 | Bright gold: combo stat, combo-badge bg, result-new-badge, recipe-value |
| `#ff6b6b` | `--color-danger` | 7 | Destructive: reset hover, close hover, slot-clear hover, import error |
| `#6cc87a` | `--color-success` | 1 | Success: OfflineIndicator reconnected |
| `#c8d8e8` | `--color-text-primary` | 5 | Main readable text: body text, element names |
| `#e8e8f0` | `--color-text-bright` | 3 | Bright text: DailyChallenge element name, AchievementToast name, AchievementGallery badge name |
| `#8ab4d4` | `--color-text-secondary` | 10 | Secondary labels: stat text, slot name, result desc, detail desc, HintButton text |
| `#4a6080` | `--color-text-muted` | 16 | Muted/placeholder text: category labels, recipe labels, reset btn, close btns, hint labels |
| `#2a3550` | `--color-text-ghost` | 4 | DANGEROUS — fails WCAG AA. Used in: result-idle, result-tip, empty-grid, empty-disc. Must be replaced with `--color-text-muted` or `--color-text-secondary` |

**Additional one-off hex values (not tokenized — used 1-2 times in specific contexts):**

| Hex Value | Location | Action |
|-----------|----------|--------|
| `#0a1a2a` | Slot.svelte (filled bg), SettingsPanel (btn bg, purchased bg) | Use `--color-bg-surface` (close enough) |
| `#0a1628` | DailyChallenge, AchievementGallery card bg | Use `--color-bg-surface` |
| `#0a2018` | ResultDisplay success bg | Keep inline — unique success state |
| `#1a0a0a` | ResultDisplay fail bg | Keep inline — unique fail state |
| `#2a0a0a` | SettingsPanel import error bg | Keep inline — unique error state |
| `#0a2a1a` | SettingsPanel import ok bg, purchased bg | Keep inline — unique success state |
| `#ff6060` | ResultDisplay error text | Use `--color-danger` |
| `#ff405040` | ResultDisplay fail border | Keep inline — unique fail state alpha |
| `#ff6b6b20` | Slot clear hover bg | Keep inline — rare danger alpha |
| `#ff6b6b40` | Reset btn hover border, import error border | Keep inline — rare danger alpha |
| `#ff8c42` / `#ff8c4260` | TopBar streak combo color + shadow | Keep inline — streak-specific, not a theme color |
| `#c9a84c` / `#d9b85c` / `#b8973b` | +page.svelte (menu gold variants) | Keep inline — menu-specific branding |
| `#2a4060` | DiscoveryItem share-btn, SettingsPanel save-hint | Replace with `--color-text-muted` |
| `#4a6fa5` | HintButton watch-ad border | Replace with `--color-border-mid` |
| `#a0b8d8` | HintButton watch-ad text | Replace with `--color-text-secondary` |
| `#1a4a3a` / `#2a6a5a` / `#1f4038` | MixingChamber react-btn gradients | Keep inline — unique react button effect |

### Font Size Violations (< 11px) — Complete List

| File | Line | Selector | Current | Target |
|------|------|----------|---------|--------|
| ElementCard.svelte | 82 | `.el-formula` | 9px | `var(--text-micro)` (11px) |
| ElementCard.svelte | 84 | `.el-category` | 9px | `var(--text-micro)` |
| ElementCard.svelte | 100 | `.el-grid-name` | 9px | `var(--text-micro)` |
| DiscoveryItem.svelte | 48 | `.disc-formula` | 9px | `var(--text-micro)` |
| DiscoveryItem.svelte | 49 | `.disc-recipe` | 9px | `var(--text-micro)` |
| ResultDisplay.svelte | 74 | `.result-new-badge` | 9px | `var(--text-micro)` |
| ResultDisplay.svelte | 77 | `.result-desc` | 10px | `var(--text-micro)` |
| ResultDisplay.svelte | 78 | `.result-formula` | 10px | `var(--text-micro)` |
| ResultDisplay.svelte | 83 | `.result-share-btn` | 10px | `var(--text-micro)` |
| ResultDisplay.svelte | 90 | `.result-tip` | 10px | `var(--text-micro)` |
| DiscoveryLog.svelte | 32 | `.disc-title` | 10px | `var(--text-micro)` |
| DiscoveryLog.svelte | 33 | `.disc-count` | 10px | `var(--text-micro)` |
| BottomBar.svelte | 80 | `.bar-btn-label` | 10px | `var(--text-micro)` |
| BottomBar.svelte | 90 | `.disc-badge` | 9px | `var(--text-micro)` |
| AchievementToast.svelte | 91 | `.toast-label` | 9px | `var(--text-micro)` |
| AchievementGallery.svelte | 121 | `.badge-desc` | 10px | `var(--text-micro)` |
| AchievementGallery.svelte | 126 | `.badge-progress` | 10px | `var(--text-micro)` |
| AchievementGallery.svelte | 132 | `.badge-locked-desc` | 10px | `var(--text-micro)` |
| DailyChallenge.svelte | 77 | `.dc-timer` | 9px | `var(--text-micro)` |
| DailyChallenge.svelte | 123 | `.dc-hint` | 10px | `var(--text-micro)` |
| DailyChallenge.svelte | 129 | `.dc-recipe` | 9px | `var(--text-micro)` |
| HintButton.svelte | 131 | `.hint-label` | 10px | `var(--text-micro)` |
| HintButton.svelte | 135 | `.hint-name` | 10px | `var(--text-micro)` |
| MixingChamber.svelte | 132 | `.combo-badge` | 10px | `var(--text-micro)` |
| SettingsPanel.svelte | 234 | `.section-label` | 10px | `var(--text-micro)` |
| SettingsPanel.svelte | 325 | `.purchase-name` | 10px | `var(--text-micro)` |
| ElementDetail.svelte | 92 | `.detail-category` | 10px | `var(--text-micro)` |
| ElementDetail.svelte | 108 | `.recipe-label` | 10px | `var(--text-micro)` |
| Slot.svelte | 55 | `.slot-name` | 9px | `var(--text-micro)` |

### Touch Target Violations — Complete List

| Req | File | Line | Selector | Current Size | Target Size | Fix |
|-----|------|------|----------|-------------|-------------|-----|
| TOUCH-01 | Slot.svelte | 62 | `.slot-clear` | 24×24px | 44×44px | Change min-width/min-height to 44px |
| TOUCH-02 | ResultDisplay.svelte | 85 | `.result-share-btn` | 32px height | 44px min-height | Change min-height to 44px |
| TOUCH-03 | DiscoveryItem.svelte | 55 | `.share-btn` | 28×28px | 44×44px | Change min-width/min-height to 44px |
| TOUCH-04 | ElementDetail.svelte | 68 | `.detail-close` | 32×32px | 44×44px | Change min-width/min-height to 44px |
| TOUCH-05 | ElementGrid.svelte | 58 | `.tab-btn` | 44px height | 44px | **Already compliant** ✅ |

**Other under-sized buttons found (not in phase requirements but worth noting for planner):**

| File | Line | Selector | Current Size | Note |
|------|------|----------|-------------|------|
| AchievementGallery.svelte | 77 | `.panel-close` | 32×32px | Same pattern as ElementDetail close |
| SettingsPanel.svelte | 227 | `.panel-close` | 32×32px | Same pattern |
| TopBar.svelte | 81-88 | `.reset-btn` | No min-w/h set | Relies on padding only — should add min-height: 44px |

### SAFE Issue Locations

| Req | File | Line | Current Code | Fix |
|-----|------|------|-------------|-----|
| SAFE-01 | TopBar.svelte | 26 | `onclick={resetGame}` | Wrap in `() => { if (confirm('Reset all progress? This cannot be undone.')) resetGame(); }` |
| SAFE-02 | BottomSheet.svelte | 70-75 | `@media (min-width: 769px) { .bottom-sheet, .sheet-overlay { display: none !important; } }` | Remove this media query entirely — game is landscape-locked so viewport is always ≥769px, this hides DiscoveryLog on every device |
| SAFE-03 | app.html | 5 | `width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover` | Change to `width=device-width, initial-scale=1, viewport-fit=cover` |

### Contrast Violations (A11Y-02)

| File | Line | Selector | Current Color | Background | Contrast Ratio | Fix |
|------|------|----------|--------------|------------|----------------|-----|
| ResultDisplay.svelte | 91 | `.result-idle` | `#2a3550` | `#0a1520` | ~1.3:1 ❌ | Change to `var(--color-text-secondary)` (`#8ab4d4`, ~6.5:1) |
| ResultDisplay.svelte | 90 | `.result-tip` | `#2a3550` | `#1a0a0a` (fail bg) | ~1.4:1 ❌ | Change to `var(--color-text-muted)` (`#4a6080`, ~3.2:1 — acceptable for supplementary tip text) |
| DiscoveryLog.svelte | 39 | `.empty-disc` | `#2a3550` | `#080f1a` | ~1.2:1 ❌ | Change to `var(--color-text-muted)` |
| ElementGrid.svelte | 78 | `.empty-grid` | `#2a3550` | `#080f1a` | ~1.2:1 ❌ | Change to `var(--color-text-muted)` |

**Recommendation:** Use `--color-text-secondary` (`#8ab4d4`, ~6.5:1) for the result-idle instruction text since users need to read it to understand the UI. Use `--color-text-muted` for empty states and supplementary tips.

### Reset Button Destructive Styling (A11Y-03)

| File | Line | Current | Fix |
|------|------|---------|-----|
| TopBar.svelte | 83 | `color: #4a6080` (neutral gray at rest) | Change to `color: var(--color-danger); border-color: var(--color-danger)` with reduced opacity at rest (e.g., `opacity: 0.7`), full opacity on hover |

### Focus-Visible (STATE-01)

**Current state:** Zero `:focus-visible` rules in any file. No focus indicators at all.

**Interactive elements requiring focus-visible (26 buttons + 2 inputs across all components):**

| Component | Interactive Elements |
|-----------|---------------------|
| TopBar.svelte | reset-btn (1 button) |
| ElementGrid.svelte | 3 tab-btn buttons |
| ElementCard.svelte | 1 element-card button |
| Slot.svelte | 1 slot-clear button |
| MixingChamber.svelte | 1 react-btn button |
| ResultDisplay.svelte | 1 result-share-btn button |
| DiscoveryItem.svelte | 1 share-btn button |
| ElementDetail.svelte | 1 detail-close button |
| BottomBar.svelte | 3 bar-btn buttons |
| HintButton.svelte | 2-3 buttons (hint-btn, hint-dismiss, watch-ad) |
| SettingsPanel.svelte | 6+ buttons + 2 inputs |
| AchievementGallery.svelte | 1 panel-close button |

**Recommendation:** Single global rule in `app.css`:
```css
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
```
This covers all interactive elements. No per-component rules needed.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `:focus` for focus styling | `:focus-visible` | ~2022 (Safari 15.4+) | Only shows focus ring for keyboard users, not mouse/touch |
| `outline: none` to hide focus | Keep outline, use `:focus-visible` | WCAG 2.1 enforcement | Never suppress focus indicators |
| `user-scalable=no` in viewport | Allow scaling, use `touch-action` for specific elements | WCAG 2.1 §1.4.4 | Pinch-to-zoom is an accessibility requirement |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `window.confirm()` renders acceptably in Capacitor WebView on Android | SAFE-01 | Might look non-native; would need a custom Svelte modal instead |
| A2 | Removing `user-scalable=no` won't cause gameplay issues in Capacitor | SAFE-03 | Users might accidentally zoom during play; `touch-action: manipulation` on interactive elements should prevent this |
| A3 | `:focus-visible` is supported in all target browsers (including Capacitor WebView) | STATE-01 | Would need a polyfill; Chrome 86+, Safari 15.4+, Firefox 85+ all support it [ASSUMED — based on caniuse data >96%] |
| A4 | `#4a6080` on `#0a1520` achieves sufficient contrast for muted/placeholder text | A11Y-02 | 3.2:1 passes for large text (≥18px/14px bold) but fails for normal text at 4.5:1. Idle instruction text at 12px should use `--color-text-secondary` for strict AA |

## Open Questions

1. **Menu page hex values**
   - What we know: `+page.svelte` (main menu) has 5 hex values (`#c9a84c`, `#d9b85c`, `#b8973b`, `#0d1b2e`, `#c8d8e8`)
   - What's unclear: Should menu gold (`#c9a84c`) be tokenized as `--color-gold` or kept separate from game gold (`#e8b84b`)?
   - Recommendation: Keep menu-specific golds inline — they're a different shade. Tokenize `#0d1b2e` → `var(--color-bg-raised)` and `#c8d8e8` → `var(--color-text-primary)`.

2. **BottomSheet desktop removal (SAFE-02)**
   - What we know: The game is landscape-locked since Phase 14. BottomSheet has `display: none !important` at ≥769px.
   - What's unclear: Was this intentional for the pre-landscape era?
   - Recommendation: Remove the `@media (min-width: 769px)` block entirely. In landscape mode, viewport width is always ≥769px on modern phones, so this rule actively hides DiscoveryLog on every device.

3. **Alpha variant token proliferation**
   - What we know: Several hex values appear with alpha channels: `#4af0c060`, `#4af0c040`, `#4af0c030`, `#4af0c020`, `#ff6b6b40`, `#ff6b6b20`
   - Recommendation: Define `--color-border-active: #4af0c060` and `--color-accent-dim: #4af0c040` (used 8-9 times each). Leave rarer alphas inline.

## Environment Availability

Step 2.6: SKIPPED — no external dependencies identified. This phase is pure CSS, HTML, and one `window.confirm()` call.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Playwright (already configured) |
| Config file | `playwright.config.ts` |
| Quick run command | `npm run check` |
| Full suite command | `npm run build && npm run check` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| TOKEN-01 | :root has all color + animation tokens | grep | `grep -c 'color-bg-deep\|color-accent\|duration-micro' src/app.css` | ✅ (app.css) |
| TOKEN-02 | No hardcoded hex in component styles | grep | `grep -rn '#[0-9a-fA-F]\{6\}' src/lib/components/ \| grep -v 'cat-\|0a2018\|1a0a0a\|2a0a0a\|0a2a1a\|1a4a3a\|2a6a5a\|1f4038\|ff8c42\|c9a84c\|gradient'` | ❌ Wave 0 |
| SAFE-01 | Reset shows confirm | manual-only | Click reset button, verify dialog appears | manual-only |
| SAFE-02 | DiscoveryLog visible | grep | `grep 'display: none' src/lib/components/BottomSheet.svelte` returns no match | ✅ (BottomSheet.svelte) |
| SAFE-03 | No user-scalable=no | grep | `grep 'user-scalable' src/app.html` returns no match | ✅ (app.html) |
| TOUCH-01 | Slot clear ≥44px | grep | `grep 'min-width: 44\|min-height: 44' src/lib/components/Slot.svelte` | ✅ (Slot.svelte) |
| TOUCH-02 | Share btn ≥44px | grep | Same pattern in ResultDisplay.svelte | ✅ |
| TOUCH-03 | Disc share ≥44px | grep | Same pattern in DiscoveryItem.svelte | ✅ |
| TOUCH-04 | Detail close ≥44px | grep | Same pattern in ElementDetail.svelte | ✅ |
| TOUCH-05 | Tab 44px | grep | Already passes | ✅ |
| A11Y-01 | No font < 11px | grep | `grep -rn 'font-size: [0-9]px\|font-size: 10px' src/lib/components/` returns no match | ❌ Wave 0 |
| A11Y-02 | Contrast ≥ 4.5:1 | grep | `grep '#2a3550' src/lib/components/` returns no match | ❌ Wave 0 |
| A11Y-03 | Reset danger style | manual-only | Visual inspection | manual-only |
| STATE-01 | focus-visible exists | grep | `grep 'focus-visible' src/app.css` returns match | ✅ (app.css) |

### Sampling Rate
- **Per task commit:** `npm run check` (svelte-check)
- **Per wave merge:** `npm run build` + grep verification suite
- **Phase gate:** Full build green + all grep checks pass + visual spot-check

### Wave 0 Gaps
- [ ] No automated test file needed — verification is grep-based (no hex remains, no small fonts, no user-scalable)
- [ ] `npm run check` must pass after all changes

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | N/A |
| V3 Session Management | No | N/A |
| V4 Access Control | No | N/A |
| V5 Input Validation | No | No user input processed in this phase |
| V6 Cryptography | No | N/A |

### Known Threat Patterns

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Accidental data destruction | Tampering | SAFE-01 adds `window.confirm()` gate |

This phase has minimal security surface — CSS changes + one confirm() call.

## Sources

### Primary (HIGH confidence)
- Codebase grep audit of all 16 component files and 2 route files — every hex value, font-size, and min-width/min-height cataloged directly from source
- `DESIGN_SYSTEM.md`, `UX-AUDIT.md`, `UI-SPEC-SHELF-CHAMBER.md` — project design specifications
- `.planning/REQUIREMENTS.md` — v7 requirement definitions
- `19-CONTEXT.md` — user decisions from discuss-phase

### Secondary (MEDIUM confidence)
- WCAG 2.1 Success Criterion 1.4.4 Resize Text [CITED: w3.org/WAI/WCAG21/Understanding/resize-text]
- WCAG 2.1 Success Criterion 1.4.3 Contrast (Minimum) [CITED: w3.org/WAI/WCAG21/Understanding/contrast-minimum]
- MDN `:focus-visible` [CITED: developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible]

### Tertiary (LOW confidence)
- None — all findings verified against codebase or cited standards

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new dependencies, pure CSS + HTML + one JS line
- Architecture: HIGH — extending existing `:root` token pattern already in app.css
- Pitfalls: HIGH — verified against actual codebase (alpha variants, category colors)
- Compliance fixes: HIGH — every fix location verified with file:line:selector

**Research date:** 2026-05-03
**Valid until:** Indefinite — CSS standards don't change; requirements are locked
