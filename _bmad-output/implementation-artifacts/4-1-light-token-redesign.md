# Story 4.1: Light Token Redesign

**Epic:** Epic 4 — Light Theme Foundation (Path D Pivot)
**Status:** ready-for-dev
**Priority:** P0 — foundational; all other Epic 4 stories and Story 3-3 depend on this

---

## Story

As a developer,
I want the three-layer CSS token architecture updated with the Path D parchment/cream light palette,
so that every component in the app automatically renders the approved sunlit-apothecary visual identity without touching individual component files.

---

## Acceptance Criteria

1. **Given** Layer 1 in `src/app.css` currently defines `--raw-stone-*` dark values
   **When** I replace Layer 1 with the Path D cream/ink/brass palette
   **Then** `--raw-stone-*` variables are removed and replaced with:
   ```css
   --raw-cream-50:  #faf7f2;   /* deepest bg — aged paper */
   --raw-cream-100: #f5f0e8;   /* card surface */
   --raw-cream-200: #ede6d5;   /* raised panels */
   --raw-cream-300: #e0d5c0;   /* hover states */
   --raw-ink-900:   #1a0e05;   /* primary text — warm near-black */
   --raw-ink-700:   #3d2510;   /* secondary text */
   --raw-ink-500:   #6b4a2a;   /* muted text */
   --raw-brass-700: #c8880a;   /* accent (darkened for light-bg contrast) */
   --raw-brass-500: #e8a818;   /* decorative gold */
   --raw-brass-300: #f0c84a;   /* highlights */
   --raw-ember-700: #8b3a20;   /* danger — deeper red for light bg */
   --raw-gold-400:  #d4980a;   /* darkened gold for contrast */
   ```
   **And** `--raw-brass-900`, `--raw-brass-700` (old dark border values), `--raw-parchment-*` variables are removed

2. **Given** Layer 2 semantic tokens currently map to dark stone/parchment raw values
   **When** I remap Layer 2 to the new cream/ink raw variables
   **Then** the following mappings apply:
   ```css
   --color-bg-deep:    var(--raw-cream-50);
   --color-bg-surface: var(--raw-cream-100);
   --color-bg-raised:  var(--raw-cream-200);
   --color-bg-hover:   var(--raw-cream-300);
   --color-border-subtle: rgba(180, 140, 80, 0.25);   /* warm brass hint on light */
   --color-border-mid:    rgba(180, 140, 80, 0.45);
   --color-border-active: rgba(200, 136, 10, 0.40);
   --color-border-hot:    var(--raw-brass-700);
   --color-accent:        var(--raw-brass-700);       /* #c8880a — WCAG AA on light */
   --color-accent-dim:    rgba(200, 136, 10, 0.12);
   --color-gold:          var(--raw-gold-400);
   --color-danger:        var(--raw-ember-700);
   --color-text-primary:  var(--raw-ink-900);
   --color-text-secondary:var(--raw-ink-700);
   --color-text-muted:    var(--raw-ink-500);
   ```

3. **Given** material tokens currently reference dark raw values
   **When** I update material tokens for the light theme
   **Then**:
   ```css
   --material-brass-highlight: var(--raw-brass-700);
   --material-brass-shadow:    rgba(180, 140, 60, 0.20);
   --material-glass-clear:     rgba(200, 160, 80, 0.08);   /* warm tint on cream */
   --material-glass-amber:     rgba(200, 120, 30, 0.15);
   --material-stone-warm:      var(--raw-cream-50);
   ```

4. **Given** energy state tokens currently define glows for dark backgrounds
   **When** I update energy state comments and define new glow values
   **Then** the energy state documentation comment in `:root` reads:
   ```css
   /* Energy states — applied via component tokens (Layer 3)
      --energy-settled: opacity 0.82
      --energy-fresh: box-shadow 0 0 10px rgba(200, 136, 10, 0.45)  [jewel brass ring on light]
      --energy-power: box-shadow 0 0 16px rgba(200, 136, 10, 0.20), 0 0 32px rgba(200, 136, 10, 0.08)
   */
   ```
   **And** ElementCard.svelte Layer 3 `.fresh` and `.power` glow values are updated to match

5. **Given** `vite.config.ts` has `theme_color: '#0a0805'` and `background_color: '#0a0805'`
   **When** I update the PWA manifest
   **Then** both values are `#f5f0e8` (--raw-cream-100)

6. **Given** `src/app.html` has `<meta name="theme-color" content="#0a0805">`
   **When** I update the meta tag
   **Then** content is `#f5f0e8`

7. **Given** `html, body` background color derives from `var(--color-bg-deep)`
   **When** the token update is applied
   **Then** the body renders the new cream-50 (`#faf7f2`) background automatically — no additional change needed (tokens handle it)

8. **Given** the `.portrait-rotate-overlay` uses `var(--color-bg-deep)` and `var(--color-text-secondary)`
   **When** token update is applied
   **Then** it auto-adapts to light cream background — verify it still reads legibly (dark text on cream should be fine)

9. **Given** the canvas `AnimationController` uses hardcoded particle colors (`rgba(180, 120, 60, ...)` amber)
   **When** I search for hardcoded color values in the canvas system
   **Then** I update particle base colors to jewel-tone equivalents:
   - Discovery burst: deep amber-orange `rgba(200, 100, 20, 0.75)` (was amber glow against dark)
   - Failure particle: muted `rgba(120, 80, 40, 0.45)` (desaturated warm, visible on cream)
   - Success shimmer: `rgba(200, 136, 10, 0.60)` (brass gold)

---

## Tasks / Subtasks

- [ ] Task 1: Replace Layer 1 raw tokens in `src/app.css` (AC: #1)
  - [ ] 1.1: Remove `--raw-stone-900` through `--raw-stone-600` (4 vars)
  - [ ] 1.2: Remove `--raw-brass-900`, old `--raw-brass-700`, `--raw-brass-500`, `--raw-brass-400`, `--raw-gold-400`, `--raw-ember-500` (6 vars)
  - [ ] 1.3: Remove `--raw-parchment-200`, `--raw-parchment-400`, `--raw-parchment-600`, `--raw-glass-clear`, `--raw-glass-amber` (5 vars)
  - [ ] 1.4: Add new `--raw-cream-50` through `--raw-cream-300` (4 vars)
  - [ ] 1.5: Add new `--raw-ink-900`, `--raw-ink-700`, `--raw-ink-500` (3 vars)
  - [ ] 1.6: Add new `--raw-brass-700: #c8880a`, `--raw-brass-500: #e8a818`, `--raw-brass-300: #f0c84a`, `--raw-ember-700: #8b3a20`, `--raw-gold-400: #d4980a` (5 vars)

- [ ] Task 2: Remap Layer 2 semantic tokens in `src/app.css` (AC: #2, #3, #4)
  - [ ] 2.1: Update all `--color-bg-*` to reference new cream raws
  - [ ] 2.2: Update all `--color-border-*` to new semi-transparent brass-on-cream values
  - [ ] 2.3: Update `--color-accent`, `--color-accent-dim`, `--color-gold`, `--color-danger`
  - [ ] 2.4: Update all `--color-text-*` to reference ink raws
  - [ ] 2.5: Update all `--material-*` tokens
  - [ ] 2.6: Update energy state documentation comment with new glow values

- [ ] Task 3: Update component Layer 3 tokens in `ElementCard.svelte` (AC: #4)
  - [ ] 3.1: Update `.element-card.fresh { --card-glow }` to new brass-on-light value
  - [ ] 3.2: Update `.element-card.power { --card-glow }` to new ambient glow for light bg
  - [ ] 3.3: Verify `.element-card.settled { opacity }` — 0.82 on light bg (was 0.85 on dark)

- [ ] Task 4: Update PWA manifest and meta tag (AC: #5, #6)
  - [ ] 4.1: `vite.config.ts`: `theme_color` → `'#f5f0e8'`
  - [ ] 4.2: `vite.config.ts`: `background_color` → `'#f5f0e8'`
  - [ ] 4.3: `src/app.html`: `<meta name="theme-color">` content → `#f5f0e8`

- [ ] Task 5: Update canvas particle colors in `AnimationController` (AC: #9)
  - [ ] 5.1: Locate all `rgba(` color literals in the canvas animation system
  - [ ] 5.2: Update discovery burst particle color to `rgba(200, 100, 20, 0.75)`
  - [ ] 5.3: Update failure particle color to `rgba(120, 80, 40, 0.45)`
  - [ ] 5.4: Update success shimmer color to `rgba(200, 136, 10, 0.60)`

- [ ] Task 6: Visual smoke test (AC: #7, #8)
  - [ ] 6.1: Load game in browser — verify cream background renders, no dark surfaces remain
  - [ ] 6.2: Check portrait-rotate-overlay legibility on cream
  - [ ] 6.3: Check scrollbar thumb visibility on cream background (may need darker thumb color)
  - [ ] 6.4: Confirm ElementCard fresh/settled/power energy states are visible against cream

---

## Dev Notes

### Critical Architecture Constraints

- **THREE-LAYER RULE IS ABSOLUTE.** Story 1.1 established this. Layer 1 = raw values only. Layer 2 = semantic mappings only. Layer 3 = component scoped overrides. Never collapse. Decision D-04 in DECISIONS.md.
- **Components auto-adapt.** Because all 10 Phase 1 components (Epic 2) use semantic tokens exclusively (verified in Story 1.2), the Layer 1/2 change propagates automatically. You should NOT need to touch any component files except `ElementCard.svelte` for the Layer 3 energy glow update (Task 3).
- **Token names that CHANGE:** `--raw-stone-*` → `--raw-cream-*`, `--raw-parchment-*` → `--raw-ink-*`. If you see any component using `var(--raw-stone-*)` or `var(--raw-parchment-*)` directly (violating Layer 3 rules), fix the violation by referencing the semantic token instead.

### Source Files to Touch

| File | Change |
|------|--------|
| `src/app.css` | Layer 1 raw tokens replaced; Layer 2 semantic remapped; materials updated; energy state comment updated |
| `src/lib/components/ElementCard.svelte` | Layer 3 `.fresh` and `.power` glow values updated |
| `vite.config.ts` | `theme_color` + `background_color` → `#f5f0e8` |
| `src/app.html` | `<meta name="theme-color">` → `#f5f0e8` |
| Canvas animation file(s) | Particle color literals updated |

### Files to NOT Touch

- All other `.svelte` components — they use semantic tokens and auto-adapt
- Frequency store, threshold constants — no color concerns
- Route files, layouts — no color concerns

### Canvas System Location

Find the animation controller with:
```
grep -r "rgba" src/lib --include="*.ts" -l
```
The canvas system is in `src/lib/` — likely `AnimationController.ts` or similar per Architecture §6. Search for `rgba(180, 120` to find the old amber particle definitions.

### Contrast Rationale (Path D approval)

The sprint change proposal verified these values maintain WCAG AA:
- `#1a0e05` (ink-900) on `#f5f0e8` (cream-100): ~14.8:1 ✓ (primary text ≥ 11:1)
- `#3d2510` (ink-700) on `#f5f0e8`: ~9.2:1 ✓ (secondary ≥ 5.5:1)
- `#c8880a` (brass-700 accent) on `#faf7f2` (cream-50): ~4.8:1 ✓ (AA for large text / UI components)

Story 4.2 (WCAG Re-verification) will do the full systematic verification pass. This story focuses on getting the values in place.

### What Story 4.2 Picks Up

After this story, Story 4.2 will:
- Verify every text/bg combination with a WCAG checker
- Check NFR3 targets: primary ≥ 11:1, secondary ≥ 5.5:1, muted ≥ 3:1
- Flag any combination that fails and adjust the token value

### What Story 4.3 Picks Up

Story 4.3 will redesign the DiscoveryOverlay and failure animations for the light background using the "Sun through Stained Glass" metaphor. This story only handles the canvas particle colors — the full overlay redesign is 4.3's scope.

### Previous Story Pattern (Story 1.1)

Story 1.1 established the exact migration pattern for app.css:
1. Replace the token block completely (don't patch individual lines)
2. Verify no `var(--raw-*)` in semantic tokens references a removed raw var
3. Run `grep -r "#0a0805\|#110e08\|#16120b\|#1c1610\|#d8cbb8\|#a89478\|#6b5a45" src/` after the change to confirm zero remaining dark-theme hardcoded values

Run the equivalent grep after this story to confirm no `#0a0805`-era values remain:
```bash
grep -rn "#0a0805\|#110e08\|#16120b\|#1c1610\|#2a2218\|#3d3020\|#d8cbb8\|#a89478\|#6b5a45\|#d4a84a" src/ --include="*.css" --include="*.svelte" --include="*.ts"
```
Expected: 0 matches in Layer 1/2 definitions. Any remaining matches indicate hardcoded color violations.

### Deferred Work Notes

The following deferred items from previous stories may surface during this story:
- `--raw-brass-500: #b8944a` was defined but unreferenced in Story 1.1 (noted in review). This story removes it as part of the Layer 1 replacement — no separate action needed.
- `#4a6fa5` / `#a0b8d8` in HintButton + StuckHintPrompt — intentional locked/disabled cool-blue colors, deferred from Story 1.2. NOT part of this story's scope; these will be re-evaluated in Story 4.2.
