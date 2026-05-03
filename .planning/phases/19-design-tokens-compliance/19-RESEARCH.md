# Phase 19: Design Tokens & Compliance Sweep - Research

**Researched:** 2026-05-03
**Domain:** CSS custom properties design system + WCAG/touch compliance
**Confidence:** HIGH

## Summary

Phase 19 is a pure CSS + minimal JS phase. The codebase has **208 hardcoded hex values** across 17 components plus `app.css` and 2 route files, with **zero CSS custom property usage** anywhere — the `:root` tokens in `app.css` (spacing, radius, typography) are defined but never referenced by any component. The phase must: (1) extend `:root` with ~18 color tokens and 4 animation tokens, (2) replace all 208 hex occurrences with `var(--token)`, (3) fix 3 safety issues, 5 touch target violations, 29 font-size violations, 2 contrast failures, and add global `:focus-visible` styles.

The work is highly mechanical and parallelizable — each component's token migration is independent. The compliance fixes (SAFE, TOUCH, A11Y, STATE) are small targeted edits. Primary risk is regression from bulk find-replace; visual regression testing matters.

**Primary recommendation:** Define all tokens in `:root` first (Wave 0), then migrate components in parallel waves grouped by complexity, then apply compliance fixes.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Use semantic names for color tokens (e.g., `--color-bg`, `--color-accent`, `--color-text-muted`)
- **D-02:** Define a full set of ~15 tokens covering every semantic role: backgrounds, text, borders, accent, danger, gold, success
- **D-03:** Element category colors stay inline in ElementCard.svelte — no `--cat-fire-bg`/`--cat-fire-text` tokens
- **D-04:** Add animation timing tokens now: `--duration-micro: 100ms`, `--duration-component: 200ms`, `--duration-page: 300ms`, `--ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1)`

### Agent's Discretion
- Reset confirmation approach: `window.confirm()` vs custom modal
- Focus-visible strategy: global rule vs per-component
- Exact token names for the ~15 color set

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| TOKEN-01 | CSS custom properties for spacing, colors, typography, radius, animation | Color + animation tokens defined in §Complete Token Set; spacing/radius/typography already exist in `:root` |
| TOKEN-02 | All components use tokens instead of hardcoded values | §Complete Hex Audit provides exact file:line mapping for all 208 occurrences |
| SAFE-01 | Reset button shows confirmation dialog | §SAFE Issue Inventory — TopBar.svelte:26 |
| SAFE-02 | DiscoveryLog accessible on all screen sizes | §SAFE Issue Inventory — BottomSheet.svelte:73 |
| SAFE-03 | Viewport allows pinch-to-zoom | §SAFE Issue Inventory — app.html:5 |
| TOUCH-01 | Slot clear button ≥44×44px | §Touch Target Audit — Slot.svelte:62 (currently 24×24) |
| TOUCH-02 | Result share button ≥44×44px | §Touch Target Audit — ResultDisplay.svelte:85 (currently 32px min-height) |
| TOUCH-03 | DiscoveryItem share button ≥44×44px | §Touch Target Audit — DiscoveryItem.svelte:55 (currently 28×28) |
| TOUCH-04 | ElementDetail close button ≥44×44px | §Touch Target Audit — ElementDetail.svelte:68 (currently 32×32) |
| TOUCH-05 | Filter tabs ≥44px height | §Touch Target Audit — ElementGrid.svelte:58 (**already 44px — DONE**) |
| A11Y-01 | No font size below 11px | §Font Size Audit — 29 violations across 14 components |
| A11Y-02 | Idle text meets WCAG AA contrast | §Contrast Audit — `#2a3550` on `#0a1520` fails |
| A11Y-03 | Reset button has destructive styling | §SAFE Issue Inventory — TopBar.svelte:79-90 |
| STATE-01 | All interactive elements have `:focus-visible` | §Focus-Visible Gap — zero `:focus-visible` rules exist |
</phase_requirements>

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Design token definitions | Browser / Client (CSS) | — | CSS custom properties in `:root` |
| Token consumption | Browser / Client (CSS) | — | Component scoped `<style>` blocks |
| Reset confirmation | Browser / Client (JS) | — | `window.confirm()` or inline modal |
| BottomSheet desktop fix | Browser / Client (CSS) | — | Media query rule change |
| Viewport meta fix | Browser / Client (HTML) | — | `app.html` attribute removal |
| Touch target sizing | Browser / Client (CSS) | — | `min-width`/`min-height` changes |
| Font size fixes | Browser / Client (CSS) | — | Replace 9px/10px with 11px |
| Focus-visible styles | Browser / Client (CSS) | — | Global or per-component CSS rules |

## Standard Stack

No new libraries needed. This phase is pure CSS + minimal JS edits.

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| CSS Custom Properties | Native | Design token system | Browser-native, zero runtime, already used in `:root` |
| `window.confirm()` | Native | Reset confirmation | Simplest approach, no bundle cost, accessible by default |

### Supporting
No additional libraries required.

## Complete Token Set

### Color Tokens (extend `:root` in `app.css`)

Based on complete codebase audit. Maps every recurring hex value to a semantic token name.

```css
:root {
  /* ─── Color Tokens ─── */

  /* Backgrounds */
  --color-bg-deep:       #080f1a;   /* scrollable areas, deep panels */
  --color-bg-surface:    #0a1520;   /* card/tile surfaces */
  --color-bg-raised:     #0d1b2e;   /* panel bg, topbar, bottombar */
  --color-bg-hover:      #0f2035;   /* hover/active background tint */
  --color-bg-selected:   #0f3028;   /* selected element background */

  /* Borders */
  --color-border-subtle: #1a2e4a;   /* default borders, dividers */
  --color-border-mid:    #1a3a5a;   /* stronger borders, input frames */

  /* Text */
  --color-text-primary:  #c8d8e8;   /* main readable text */
  --color-text-bright:   #e8e8f0;   /* emphasis/highlight text */
  --color-text-secondary:#8ab4d4;   /* secondary labels, descriptions */
  --color-text-muted:    #4a6080;   /* placeholder, inactive labels */

  /* Semantic */
  --color-accent:        #4af0c0;   /* primary accent — teal-green */
  --color-gold:          #e8b84b;   /* combo, daily, XP, warnings */
  --color-gold-bright:   #ffe44a;   /* new discovery badge, combo badge bg */
  --color-danger:        #ff6b6b;   /* destructive actions, errors */
  --color-success:       #6cc87a;   /* online indicator */

  /* ─── Animation Tokens ─── */
  --duration-micro:      100ms;     /* tap feedback */
  --duration-component:  200ms;     /* card appear, state changes */
  --duration-page:       300ms;     /* page transitions, sheets */
  --ease-bounce:         cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

**Total: 18 color tokens + 4 animation tokens = 22 new tokens.**

### Hex → Token Mapping Table

Every hardcoded hex value in the codebase mapped to its replacement token. Values with alpha channels use the token as a base.

| Hex Value | Token | Alpha Variant | Usage Count |
|-----------|-------|---------------|-------------|
| `#080f1a` | `--color-bg-deep` | — | ~8 |
| `#0a1520` | `--color-bg-surface` | — | ~6 |
| `#0a1628` | `--color-bg-surface` | — | 2 (close enough) |
| `#0a1a2a` | `--color-bg-surface` | — | 5 (button bg variant) |
| `#0d1b2e` | `--color-bg-raised` | — | ~12 |
| `#0f2035` | `--color-bg-hover` | — | ~10 |
| `#0f3028` | `--color-bg-selected` | — | ~3 |
| `#0a2018` | `--color-bg-selected` | — | 1 (success state) |
| `#0a2a1a` | `--color-bg-selected` | — | 3 (success/active) |
| `#1a0a0a` | inline | — | 1 (fail state bg) |
| `#2a0a0a` | inline | — | 1 (error state bg) |
| `#1a2e4a` | `--color-border-subtle` | — | ~18 |
| `#1a3a5a` | `--color-border-mid` | — | ~12 |
| `#4af0c0` | `--color-accent` | — | ~28 |
| `#4af0c060` | `--color-accent` | 60 (38%) | ~9 |
| `#4af0c040` | `--color-accent` | 40 (25%) | ~10 |
| `#4af0c030` | `--color-accent` | 30 (19%) | ~2 |
| `#4af0c020` | `--color-accent` | 20 (12%) | 1 |
| `#4af0c080` | `--color-accent` | 80 (50%) | 2 |
| `#c8d8e8` | `--color-text-primary` | — | ~5 |
| `#e8e8f0` | `--color-text-bright` | — | ~3 |
| `#8ab4d4` | `--color-text-secondary` | — | ~12 |
| `#4a6080` | `--color-text-muted` | — | ~18 |
| `#2a3550` | `--color-text-muted` | — | 4 (must replace — WCAG fail) |
| `#2a4060` | `--color-text-muted` | — | 2 (also too low contrast) |
| `#e8b84b` | `--color-gold` | — | ~4 |
| `#ffe44a` | `--color-gold-bright` | — | ~3 |
| `#ff6b6b` | `--color-danger` | — | ~7 |
| `#ff6060` | `--color-danger` | — | 1 (unify) |
| `#ff6b6b20` | `--color-danger` | 20 | 1 |
| `#ff6b6b40` | `--color-danger` | 40 | 2 |
| `#ff405040` | `--color-danger` | — | 1 |
| `#6cc87a` | `--color-success` | — | 1 |

**Alpha variants strategy:** CSS custom properties don't support appending alpha directly. Use one of:
1. **Recommended:** Define the alpha variants as their own tokens where frequently used, or keep the full hex inline for rare one-off alpha uses
2. Alternative: Use `color-mix()` — but browser support is modern-only

For this project, the pragmatic approach is:
- Frequently used alpha variants (`#4af0c060`, `#4af0c040`) → define as tokens: `--color-accent-muted: #4af0c060`, `--color-accent-dim: #4af0c040`
- One-off alpha values → keep full hex inline (acceptable, still semantically clear from context)

### Values That Stay Inline (per D-03 + component-specific)

| Hex | Component | Reason |
|-----|-----------|--------|
| 8 category color pairs | ElementCard.svelte:111-118 | D-03: game-specific, not theme-level |
| `#ff8c42`, `#ff8c4260` | TopBar.svelte:66-67 | Streak fire glow — unique effect |
| `#4a6fa5`, `#a0b8d8` | HintButton.svelte:147,149 | Watch-ad button — unique styling |
| `#c9a84c`, `#d9b85c`, `#b8973b`, `#c9a84c88`, `#c9a84c55` | +page.svelte (menu) | Menu gold — unique to menu page |
| Gradient stops: `#1a4a3a`, `#2a6a5a`, `#1f4038` | MixingChamber.svelte | React button gradient — component-specific |
| `#1a0a0a`, `#2a0a0a` | ResultDisplay, SettingsPanel | Error/fail bg tints — rare one-offs |

## Complete Hex Audit by Component

### Hardcoded hex count per component (style blocks only)

| Component | Hex Count | Complexity |
|-----------|-----------|------------|
| SettingsPanel.svelte | 41 | HIGH — most hex values, many button states |
| ElementCard.svelte | 27 | MEDIUM — 16 are category colors (stay inline), 11 to replace |
| ResultDisplay.svelte | 17 | MEDIUM |
| TopBar.svelte | 16 | MEDIUM — 4 are streak-specific (stay inline) |
| HintButton.svelte | 16 | MEDIUM — 2 are watch-ad specific (stay inline) |
| ElementDetail.svelte | 13 | MEDIUM |
| AchievementGallery.svelte | 13 | MEDIUM |
| MixingChamber.svelte | 10 | LOW — 5 are gradient stops (stay inline) |
| Slot.svelte | 9 | LOW |
| ElementGrid.svelte | 9 | LOW |
| DailyChallenge.svelte | 9 | LOW |
| BottomBar.svelte | 8 | LOW |
| DiscoveryItem.svelte | 7 | LOW |
| DiscoveryLog.svelte | 6 | LOW |
| BottomSheet.svelte | 3 | LOW |
| OfflineIndicator.svelte | 2 | LOW |
| AchievementToast.svelte | 2 | LOW |
| app.css | 8 | LOW |
| +page.svelte (menu) | 10 | LOW (5 stay inline) |
| game/+page.svelte | 1 | LOW |
| **TOTAL** | **~208** | **~170 to replace** |

## Font Size Audit (A11Y-01)

**29 violations** — every instance of `font-size` below 11px. All must become `11px` (or use `var(--text-micro)` / `var(--text-caption)` which are already defined as `11px`).

| File | Line | Selector | Current | Replacement Token |
|------|------|----------|---------|-------------------|
| AchievementGallery.svelte | 121 | `.badge-desc` | 10px | `var(--text-micro)` |
| AchievementGallery.svelte | 126 | `.badge-progress` | 10px | `var(--text-micro)` |
| AchievementGallery.svelte | 132 | `.badge-locked-label` | 10px | `var(--text-micro)` |
| AchievementToast.svelte | 91 | `.toast-label` | 9px | `var(--text-micro)` |
| BottomBar.svelte | 80 | `.bar-btn-label` | 10px | `var(--text-micro)` |
| BottomBar.svelte | 90 | `.bar-badge` | 9px | `var(--text-micro)` |
| DailyChallenge.svelte | 77 | `.dc-label` | 9px | `var(--text-micro)` |
| DailyChallenge.svelte | 123 | `.dc-info` | 10px | `var(--text-micro)` |
| DailyChallenge.svelte | 129 | `.dc-streak` | 9px | `var(--text-micro)` |
| DiscoveryItem.svelte | 48 | `.disc-formula` | 9px | `var(--text-micro)` |
| DiscoveryItem.svelte | 49 | `.disc-recipe` | 9px | `var(--text-micro)` |
| DiscoveryLog.svelte | 32 | `.disc-title` | 10px | `var(--text-micro)` |
| DiscoveryLog.svelte | 33 | `.disc-count` | 10px | `var(--text-micro)` |
| ElementCard.svelte | 82 | `.el-formula` | 9px | `var(--text-micro)` |
| ElementCard.svelte | 84 | `.el-category` | 9px | `var(--text-micro)` |
| ElementCard.svelte | 100 | `.el-grid-name` | 9px | `var(--text-micro)` |
| ElementDetail.svelte | 92 | `.detail-category` | 10px | `var(--text-micro)` |
| ElementDetail.svelte | 108 | `.detail-recipe-label` | 10px | `var(--text-micro)` |
| HintButton.svelte | 131 | `.hint-label` | 10px | `var(--text-micro)` |
| HintButton.svelte | 135 | `.hint-name` | 10px | `var(--text-micro)` |
| MixingChamber.svelte | 132 | `.combo-badge` | 10px | `var(--text-micro)` |
| ResultDisplay.svelte | 74 | `.result-new-badge` | 9px | `var(--text-micro)` |
| ResultDisplay.svelte | 77 | `.result-desc` | 10px | `var(--text-micro)` |
| ResultDisplay.svelte | 78 | `.result-formula` | 10px | `var(--text-micro)` |
| ResultDisplay.svelte | 83 | `.result-share-btn` | 10px | `var(--text-micro)` |
| ResultDisplay.svelte | 90 | `.result-tip` | 10px | `var(--text-micro)` |
| SettingsPanel.svelte | 234 | `.section-title` | 10px | `var(--text-micro)` |
| SettingsPanel.svelte | 325 | `.purchase-name` | 10px | `var(--text-micro)` |
| Slot.svelte | 55 | `.slot-name` | 9px | `var(--text-micro)` |

## Touch Target Audit

| Req | Component | Selector | Line | Current Size | Required | Fix |
|-----|-----------|----------|------|-------------|----------|-----|
| TOUCH-01 | Slot.svelte | `.slot-clear` | 62 | 24×24px | 44×44px | Change `min-width`/`min-height` to 44px |
| TOUCH-02 | ResultDisplay.svelte | `.result-share-btn` | 85 | min-height: 32px | 44×44px | Change `min-height` to 44px |
| TOUCH-03 | DiscoveryItem.svelte | `.share-btn` | 55 | 28×28px | 44×44px | Change `min-width`/`min-height` to 44px |
| TOUCH-04 | ElementDetail.svelte | `.detail-close` | 68 | 32×32px | 44×44px | Change `min-width`/`min-height` to 44px |
| TOUCH-05 | ElementGrid.svelte | `.tab-btn` | 58 | **44px** | 44px | **ALREADY COMPLIANT** |

**Note on TOUCH-05:** The UX audit (created pre-Phase 14) listed 36px. Phase 14's rewrite already set `min-height: 44px` on `.tab-btn`. No action needed.

## SAFE Issue Inventory

### SAFE-01: Reset Button Confirmation
- **Location:** `TopBar.svelte` line 26
- **Current:** `<button class="reset-btn" onclick={resetGame} title="Reset game">↺</button>`
- **Problem:** Direct call to `resetGame()` with no confirmation
- **Fix:** Wrap in handler that calls `window.confirm('Reset all progress? This cannot be undone.')` before `resetGame()`
- **Simplest approach:** `window.confirm()` — zero bundle cost, native dialog, accessible, blocks until answered

### SAFE-02: DiscoveryLog Unreachable on Desktop
- **Location:** `BottomSheet.svelte` line 70-75
- **Current:**
  ```css
  @media (min-width: 769px) {
    .bottom-sheet,
    .sheet-overlay {
      display: none !important;
    }
  }
  ```
- **Problem:** DiscoveryLog is inside BottomSheet; at ≥769px BottomSheet is hidden, making DiscoveryLog inaccessible
- **Fix:** Remove the `!important` media query. Since the game is landscape-locked and mobile-only, this media query is defensive but overly aggressive. Replace with a rule that allows BottomSheet to function on all screen sizes, OR move DiscoveryLog outside BottomSheet for desktop. Simplest: remove the media query block entirely since the game is landscape mobile-first.

### SAFE-03: Viewport Pinch-to-Zoom Blocked
- **Location:** `app.html` line 5
- **Current:** `<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />`
- **Fix:** Remove `maximum-scale=1, user-scalable=no` → `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />`

## Contrast Audit (A11Y-02)

### Low-Contrast Text Instances

The color `#2a3550` on background `#0a1520` has an approximate contrast ratio of **1.5:1** — far below the WCAG AA minimum of 4.5:1.

| File | Line | Selector | Current Color | Background | Fix |
|------|------|----------|---------------|------------|-----|
| ResultDisplay.svelte | 90 | `.result-tip` | `#2a3550` | `#0a1520` | → `var(--color-text-muted)` (`#4a6080` ≈ 3.8:1, or bump to `--color-text-secondary`) |
| ResultDisplay.svelte | 91 | `.result-idle` | `#2a3550` | `#0a1520` | → `var(--color-text-muted)` |
| DiscoveryLog.svelte | 39 | `.empty-disc` | `#2a3550` | `#080f1a` | → `var(--color-text-muted)` |
| ElementGrid.svelte | 78 | `.empty-grid` | `#2a3550` | `#080f1a` | → `var(--color-text-muted)` |

Additionally, these use `#2a4060` which is also low-contrast:

| File | Line | Selector | Current Color | Fix |
|------|------|----------|---------------|-----|
| DiscoveryItem.svelte | 53 | `.share-btn` | `#2a4060` | → `var(--color-text-muted)` |
| SettingsPanel.svelte | 260 | `.save-hint` | `#2a4060` | → `var(--color-text-muted)` |

**All `#2a3550` and `#2a4060` values should be replaced with `var(--color-text-muted)` (`#4a6080`) minimum.** The `#4a6080` on `#080f1a` gives approximately **3.4:1**, which passes WCAG AA for large text (≥18px or ≥14px bold) but not for normal text. For small (11px) body text, `--color-text-secondary` (`#8ab4d4`) would be safer.

**Recommendation:** Use `var(--color-text-muted)` for placeholder/hint text (these are low-importance hints) — the improvement from 1.5:1 to 3.4:1 is significant. For the `.result-idle` instruction text that users need to read, use `var(--color-text-secondary)` (4.5:1+).

### A11Y-03: Reset Button Destructive Styling
- **Location:** `TopBar.svelte` lines 79-90
- **Current:** Neutral gray button (`color: #4a6080`), only red on hover
- **Fix:** Add `color: var(--color-danger)` as default rest state, add a warning icon or text like "⚠ Reset"

## Focus-Visible Gap Analysis (STATE-01)

**Current state: Zero `:focus-visible` rules anywhere in the codebase.** No component and no global stylesheet defines focus-visible styles.

### Recommended Approach: Global Rule

A single global `:focus-visible` rule in `app.css` covers all interactive elements cleanly:

```css
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
```

**Why global over per-component:**
1. Every interactive element gets coverage automatically — no risk of missing one
2. Svelte scoped styles can't easily target `:global(:focus-visible)` across all elements
3. A single rule is easier to maintain and consistent
4. Components that need custom focus styles can override with higher specificity

**Caveat:** Some elements (like the BottomSheet overlay) shouldn't show focus rings. These can be suppressed with `outline: none` in their scoped styles.

### Interactive Elements That Will Get Focus Styles

| Component | Interactive Elements |
|-----------|---------------------|
| ElementGrid | `.tab-btn` (×3) |
| ElementCard | `.element-card` button |
| Slot | `.slot-clear` button |
| MixingChamber | `.react-btn` |
| ResultDisplay | `.result-share-btn` |
| DiscoveryItem | `.share-btn` |
| ElementDetail | `.detail-close` |
| TopBar | `.reset-btn` |
| BottomBar | `.bar-btn` (×3) |
| HintButton | `.hint-btn`, `.hint-dismiss`, `.watch-ad-btn` |
| SettingsPanel | `.panel-close`, `.export-btn`, `.import-btn`, checkboxes, `.purchase-card`, `.restore-btn` |
| AchievementGallery | `.panel-close` |
| DailyChallenge | (no standalone buttons) |

## Architecture Patterns

### Token System Architecture

```
app.css :root
  ├── Spacing tokens (existing: --space-1..13)
  ├── Radius tokens (existing: --radius-sm/md/lg/xl)
  ├── Typography tokens (existing: --text-micro..title)
  ├── Color tokens (NEW: 18 tokens)  ← Phase 19
  └── Animation tokens (NEW: 4 tokens) ← Phase 19
         │
         ▼
  Component <style> blocks
  └── Replace: `color: #4af0c0` → `color: var(--color-accent)`
  └── Replace: `font-size: 9px` → `font-size: var(--text-micro)`
```

### Migration Pattern

For each component:
1. Open file
2. In `<style>` block, find-replace each hex value with its token `var()` reference
3. Replace hardcoded font-sizes with typography tokens where applicable
4. Verify no visual change (token value = same hex value)

### Anti-Patterns to Avoid
- **Don't create component-level CSS variable overrides** — all tokens in `:root`, all consumption via `var(--token)` directly
- **Don't use `color-mix()` for alpha variants** — browser support too narrow for this PWA's target audience
- **Don't tokenize one-off gradient stops or component-unique colors** — keeps the token set lean

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Confirmation dialog | Custom modal component | `window.confirm()` | Zero bundle cost, accessible, blocks execution |
| Alpha color variants | `color-mix()` polyfill | Pre-computed hex tokens | Browser support, simplicity |
| Focus ring styles | Per-component rules | Single global `:focus-visible` | Complete coverage, maintainable |

## Common Pitfalls

### Pitfall 1: Alpha Channel Token References
**What goes wrong:** CSS custom properties can't be used with hex alpha shorthand (`var(--color-accent)60` doesn't work)
**Why it happens:** CSS parser doesn't concatenate custom property values with literal text
**How to avoid:** Define separate tokens for frequently-used alpha variants (e.g., `--color-accent-muted: #4af0c060`) or keep one-off alpha values as inline hex
**Warning signs:** Colors disappearing or falling back to transparent

### Pitfall 2: Scoped Style Specificity vs Global Focus
**What goes wrong:** Global `:focus-visible` outline gets overridden by scoped component styles that set `outline: none` or `border` changes
**Why it happens:** Svelte scoped styles add attribute selectors that increase specificity
**How to avoid:** The global rule should use `*:focus-visible` which has low specificity — if a component explicitly sets `outline: none`, that's intentional
**Warning signs:** Missing focus rings on specific components

### Pitfall 3: Visual Regression from Hex Consolidation
**What goes wrong:** Replacing `#0a1628` with `--color-bg-surface` (`#0a1520`) creates a subtle but visible color shift
**Why it happens:** Near-identical hex values were originally hand-picked per component
**How to avoid:** The color difference between `#0a1628` and `#0a1520` is imperceptible (ΔE < 2). Consolidation is safe. If any component looks visibly different after migration, adjust the token value rather than keeping the inline hex.
**Warning signs:** Side-by-side comparison shows tint changes

### Pitfall 4: BottomSheet Media Query Fix Scope
**What goes wrong:** Removing the `@media (min-width: 769px) { display: none }` causes BottomSheet to appear unexpectedly on tablet/desktop viewports
**Why it happens:** The game is landscape-locked on mobile but can be viewed in desktop browsers
**How to avoid:** The game is landscape-locked at the app level (CSS + AndroidManifest). The BottomSheet should work on all landscape viewports. Simply remove the media query — the BottomSheet is toggle-controlled (open/close state) so it won't appear unless the user clicks a button.
**Warning signs:** BottomSheet visible by default on wide screens

## Code Examples

### Token Definition (app.css)
```css
/* Source: UI-SPEC-SHELF-CHAMBER.md §1.3 + codebase audit */
:root {
  /* ... existing spacing/radius/typography tokens ... */

  /* Color tokens */
  --color-bg-deep:       #080f1a;
  --color-bg-surface:    #0a1520;
  --color-bg-raised:     #0d1b2e;
  --color-bg-hover:      #0f2035;
  --color-bg-selected:   #0f3028;
  --color-border-subtle: #1a2e4a;
  --color-border-mid:    #1a3a5a;
  --color-accent:        #4af0c0;
  --color-accent-muted:  #4af0c060;
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
  --duration-micro:      100ms;
  --duration-component:  200ms;
  --duration-page:       300ms;
  --ease-bounce:         cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Global focus-visible */
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
```

### Component Migration Example (before/after)
```css
/* BEFORE */
.element-card {
  background: #0a1520;
  border: 1px solid #1a2e4a;
}
.element-card:hover { border-color: #4af0c060; background: #0f2035; }

/* AFTER */
.element-card {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-subtle);
}
.element-card:hover { border-color: var(--color-accent-muted); background: var(--color-bg-hover); }
```

### Reset Confirmation (TopBar.svelte)
```svelte
<!-- BEFORE -->
<button class="reset-btn" onclick={resetGame} title="Reset game">↺</button>

<!-- AFTER -->
<button class="reset-btn" onclick={() => {
  if (confirm('Reset all progress? This cannot be undone.')) resetGame();
}} title="Reset game">↺</button>
```

### Touch Target Fix (Slot.svelte)
```css
/* BEFORE */
.slot-clear { min-width: 24px; min-height: 24px; }

/* AFTER */
.slot-clear { min-width: 44px; min-height: 44px; }
```

## Ordering Dependencies

1. **Token definitions in `:root` MUST come before component migration** — components reference tokens via `var()`, so tokens must exist first
2. **`app.css` global `:focus-visible` MUST come before any per-component focus overrides** — establishes the baseline
3. **SAFE-03 (viewport) is independent** — can be done in any wave
4. **SAFE-01 (reset confirm) is independent** — JS change, not CSS
5. **SAFE-02 (BottomSheet) is independent** — CSS media query change
6. **A11Y-01 (font sizes) should be done during component token migration** — touching the same style blocks
7. **TOUCH fixes should be done during component token migration** — touching the same style blocks
8. **A11Y-02 (contrast) is automatically fixed by token migration** — `#2a3550` gets replaced with `var(--color-text-muted)` during migration
9. **A11Y-03 (reset button styling) should be done alongside SAFE-01** — same component, same element

## Task Breakdown Estimate

| Wave | Task | Components/Files | Scope |
|------|------|-----------------|-------|
| 0 | Define tokens in `:root` + global `:focus-visible` + SAFE-03 viewport fix | `app.css`, `app.html` | 2 files, ~30 new lines |
| 1 | SAFE-01 + A11Y-03 (reset confirm + danger styling) | `TopBar.svelte` | 1 file, ~5 lines changed |
| 1 | SAFE-02 (BottomSheet desktop fix) | `BottomSheet.svelte` | 1 file, ~3 lines removed |
| 2 | Token migration: HIGH complexity components | SettingsPanel, ResultDisplay, HintButton, ElementDetail | 4 files, ~80 replacements |
| 2 | Token migration: MEDIUM complexity components | TopBar, ElementCard, AchievementGallery, MixingChamber | 4 files, ~50 replacements |
| 3 | Token migration: LOW complexity components | Slot, ElementGrid, DailyChallenge, BottomBar, DiscoveryItem, DiscoveryLog, BottomSheet, OfflineIndicator, AchievementToast | 9 files, ~40 replacements |
| 3 | Token migration: Routes + app.css | `+page.svelte`, `game/+page.svelte`, `app.css` | 3 files, ~15 replacements |
| 4 | Verification: `npm run check` + visual smoke test | All | Build gate |

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Playwright (e2e) + vitest (unit) |
| Config file | `playwright.config.ts`, `vite.config.ts` |
| Quick run command | `npm run check` |
| Full suite command | `npm run build && npx playwright test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| TOKEN-01 | `:root` has all tokens defined | manual | Check app.css content | N/A |
| TOKEN-02 | No hardcoded hex in components | smoke | `grep -rP '#[0-9a-fA-F]{6}' src/lib/components/ \| grep -v cat-` | ❌ Wave 0 |
| SAFE-01 | Reset shows confirm | manual | Human test | N/A |
| SAFE-02 | DiscoveryLog visible on desktop | manual | Human test | N/A |
| SAFE-03 | `user-scalable=no` removed | smoke | `grep 'user-scalable' src/app.html` returns nothing | ❌ Wave 0 |
| TOUCH-01 | Slot clear ≥44×44 | smoke | `grep 'min-width: 44px' src/lib/components/Slot.svelte` | ❌ Wave 0 |
| TOUCH-02 | Share btn ≥44px | smoke | grep check | ❌ Wave 0 |
| TOUCH-03 | Discovery share ≥44px | smoke | grep check | ❌ Wave 0 |
| TOUCH-04 | Detail close ≥44px | smoke | grep check | ❌ Wave 0 |
| TOUCH-05 | Filter tabs ≥44px | smoke | Already 44px — PASS | ✅ |
| A11Y-01 | No font <11px | smoke | `grep -P 'font-size:\s*(9\|10)px' src/lib/components/` returns nothing | ❌ Wave 0 |
| A11Y-02 | No `#2a3550` text | smoke | `grep '#2a3550' src/` returns nothing | ❌ Wave 0 |
| A11Y-03 | Reset has danger color | manual | Visual check | N/A |
| STATE-01 | `:focus-visible` rule exists | smoke | `grep 'focus-visible' src/app.css` returns match | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npm run check`
- **Per wave merge:** `npm run build` (production build gate)
- **Phase gate:** Full build + grep-based smoke tests for all requirements

### Wave 0 Gaps
- [ ] Grep-based verification script — covers TOKEN-02, SAFE-03, TOUCH-01–04, A11Y-01, A11Y-02, STATE-01

## Security Domain

No security implications for this phase. All changes are client-side CSS and a single `window.confirm()` call. No user input processing, no data flow changes, no network requests.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `#0a1628` and `#0a1520` are visually indistinguishable (ΔE < 2) | Hex→Token Mapping | Minor tint shift in AchievementGallery, DailyChallenge — fixable by adjusting token value |
| A2 | `window.confirm()` is acceptable UX for reset confirmation | SAFE-01 | Would need a custom modal component — more work but D-discretion allows either |
| A3 | Global `:focus-visible` won't conflict with Svelte scoped styles | Focus-Visible | Would need per-component rules — more work, same result |
| A4 | BottomSheet media query can be fully removed | SAFE-02 | May need different approach if BottomSheet appears unexpectedly on wide viewports |

## Open Questions

1. **Alpha variant token naming**
   - What we know: Need `#4af0c060` and `#4af0c040` as tokens since they appear 9 and 10 times respectively
   - What's unclear: Exact token names — `--color-accent-muted`/`--color-accent-dim` vs `--color-border-active`/`--color-border-focus`
   - Recommendation: Use `--color-accent-muted: #4af0c060` and `--color-accent-dim: #4af0c040` as per UI-SPEC §1.3

2. **Menu page gold colors**
   - What we know: `+page.svelte` uses 5 gold variants (`#c9a84c`, `#d9b85c`, `#b8973b` etc.) unique to the menu
   - What's unclear: Should these become tokens or stay inline?
   - Recommendation: Stay inline — they're menu-specific and not part of the game design system

## Sources

### Primary (HIGH confidence)
- Codebase grep audit — complete scan of all 17 component files, app.css, 2 route files
- `UI-SPEC-SHELF-CHAMBER.md` §1.3 — color token definitions
- `DESIGN_SYSTEM.md` — spacing, touch targets, typography, radius, animation specs
- `UX-AUDIT.md` — 28 prioritized issues
- `REQUIREMENTS.md` — v7 requirement definitions

### Secondary (MEDIUM confidence)
- [WCAG 2.1 SC 1.4.4](https://www.w3.org/TR/WCAG21/#resize-text) — pinch-to-zoom requirement [CITED]
- [Apple HIG Touch Targets](https://developer.apple.com/design/human-interface-guidelines/accessibility#Touch-targets) — 44×44px minimum [CITED]

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no libraries needed, pure CSS
- Architecture: HIGH — simple token system with clear mapping
- Pitfalls: HIGH — well-understood domain, all issues found via grep
- Completeness: HIGH — exhaustive audit of every component file

**Research date:** 2026-05-03
**Valid until:** Indefinite (CSS custom properties are stable)
