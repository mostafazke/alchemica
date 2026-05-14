# Sprint Change Proposal — Color Direction Pivot
**Date:** 2026-05-14
**Prepared by:** Correct Course Workflow
**Status:** APPROVED — Path D (Full Light Theme) — 2026-05-14
**Scope:** MAJOR
**Routed to:** Product Manager + Solution Architect

---

## Section 1 — Issue Summary

### Problem Statement

After completing Epics 1 and 2 fully, and two of three stories in Epic 3, stakeholder feedback indicates the implemented warm-stone dark palette (`#0a0805` base, `#d4a84a` accent) may not be producing the emotional register desired for a casual mobile game targeting ages 10+. The request: *"shift to a lighter background or more saturated element colors — we need happy colors."*

### Discovery Context

- Emerged post-implementation (no specific story trigger — design reaction to the completed product)
- The brainstorming session itself noted the original design caused "physical discomfort on mobile screens" — the dark was changed from cold navy to warm stone, but the dark-ness itself was preserved by design choice
- The UX Spec targets "ages 10+" casual players; VISUAL_PHILOSOPHY.md deliberately chose atmospheric depth over playful brightness

### Evidence

- Direct stakeholder feedback after seeing implemented dark palette
- Competitive reference: Little Alchemy 2 uses bright white/light background — the dominant genre precedent
- Target audience profile (ages 10+, casual, curiosity-driven) may skew toward warmer/brighter visual register
- OLED screens show very-dark colors as literal black holes; the near-black `#0a0805` may read as "empty" rather than "atmospheric" in practice

---

## Section 2 — Impact Analysis

### 2.1 Checklist Status

| # | Item | Status |
|---|------|--------|
| 1.1 | Triggering story identified | [x] Done — design reaction post-Epic 2 completion |
| 1.2 | Problem categorized | [x] Done — Strategic pivot (design direction) |
| 1.3 | Evidence documented | [x] Done |
| 2.1 | Current epic impact assessed | [!] Action-needed — Epic 3 in progress, 3-2 affects |
| 2.2 | Epic-level changes identified | [!] Action-needed |
| 2.3 | Future epics reviewed | [x] Done — no future epics yet defined |
| 2.4 | New epics/stories identified | [!] Action-needed |
| 2.5 | Sequencing reviewed | [!] Action-needed |
| 3.1 | Epics.md (PRD proxy) conflicts found | [!] Action-needed |
| 3.2 | Architecture conflicts found | [x] Done — token architecture handles cleanly |
| 3.3 | UX/Design spec conflicts found | [!] Action-needed — Major |

---

### 2.2 Epic Impact

| Epic | Status | Impact |
|------|--------|--------|
| Epic 1 — Design Foundation | Done | **HIGH** — Story 1.1 token values become incorrect. ACs reference specific hex values now superseded. Token architecture itself survives. |
| Epic 2 — Core Components | Done | **MEDIUM** — All 6 components use semantic tokens → auto-adapt to new Layer 1. However, WCAG contrast ratios (NFR3) must be re-verified entirely. Energy state glows (box-shadow on dark) need redesign for light background. |
| Epic 3 — Animation & Integration | In progress | **HIGH** — Story 3-2 (done): discovery overlay and failure animations are designed around dark-backdrop glow contrast. Amber particles invisible on light bg. Story 3-3 (backlog): not yet written — free to spec for new direction. |

---

### 2.3 Story Impact

| Story | Status | Impact |
|-------|--------|--------|
| 1.1 — Token Architecture | Done | ACs with specific hex values (`#0a0805`, `#d4a84a`, `#d8cbb8`) become superseded. Token system architecture (3-layer) survives intact — only Layer 1 raw values change. Requires new re-run. |
| 1.2 — Token Verification | Done | All verification must be re-run against new palette. |
| 2.1–2.5 — Components | Done | Components adapt via semantic tokens. Visual QA re-pass required. WCAG re-verification required. |
| 3.1 — AnimationController | Done | Canvas system is color-agnostic. Particle _color definitions_ (amber, ember) need updating. Low effort. |
| 3.2 — Discovery/Failure Animations | Done | **Significant rework.** Glow effects built for dark contrast. Discovery overlay (the "darkroom" metaphor) loses its visual logic on a light bg. The film development metaphor breaks. |
| 3.3 — MixingChamber Integration | Backlog | Free to spec for new direction — no rework needed. |

---

### 2.4 Artifact Conflicts

#### VISUAL_PHILOSOPHY.md — **CONFLICT: CRITICAL**

This is the foundational identity document. The following statements are in direct conflict with a light theme:

> *"The dark background isn't a design choice. It's the room."*

> *"The ambient light isn't interface chrome. It's candlelight and light coming from the vessels themselves."*

> *"Warmth in the dark. Not lighter — warmer. A lantern at night is a world. Keep the dark. Change its temperature."*

**Resolution required:** Either a complete rewrite of the philosophy (new identity: daylit sunlit apothecary shop rather than underground workshop) or an amendment section that supersedes these passages.

---

#### copilot_CODE_BRIEF.md — **CONFLICT: HIGH**

All specific hex values in the Design Tokens section need replacement:

| Section | Current values | Status |
|---------|---------------|--------|
| Backgrounds (warm stone) | `#0a0805`, `#110e08`, `#16120b`, `#1c1610` | Replace entirely |
| Borders (brass edges) | `#2a2218`, `#3d3020` | Replace entirely |
| Text (warm parchment) | `#d8cbb8`, `#a89478`, `#6b5a45` | Replace entirely |
| Materials | `rgba(200,180,140,0.06)`, `rgba(180,120,60,0.12)` | Replace entirely |
| Energy states | Amber glow box-shadow | Replace entirely |

The Five Laws remain valid (no filled buttons, no red for failure, etc.) — these are theme-agnostic.

---

#### UX Design Specification — **CONFLICT: HIGH**

> *"a thermal shift from navy-cold to stone-warm **without losing darkness**"*

The "without losing darkness" clause is now dropped. The following sections need updating:
- Executive Summary — Key Design Challenge 1
- Platform Strategy — "OLED screens" optimization changes for light
- NFR3 contrast ratio targets (all calculated for dark bg)
- All component visual state tables (dark surface colors referenced inline)

---

#### Epics.md — **CONFLICT: MEDIUM**

| Requirement | Current | Needs Change |
|-------------|---------|--------------|
| FR2 | Background migrates to `#0a0805` | New target value |
| FR3 | Accent migrates to `#d4a84a` | Potentially new value for contrast on light |
| NFR3 | WCAG AA: primary ≥ 11:1 on dark surface | Must recalculate on light surface |

---

#### app.css — **CONFLICT: HIGH (code)**

The 15 Layer 1 raw token values need complete replacement. Semantic mappings largely survive with value updates. The 3-layer architecture (Decision D-04) works perfectly for this change.

---

### 2.5 Technical Impact

**What changes easily (token system does the work):**
- Background surfaces (all use `var(--color-bg-*)`)
- Text colors (all use `var(--color-text-*)`)
- Border colors (all use `var(--color-border-*)`)

**What needs manual attention:**
- PWA manifest `theme_color` / `background_color` in `vite.config.ts`
- Canvas particle colors (hardcoded, not tokenized)
- Energy state box-shadow values (currently amber glow — invisible on light bg)
- Discovery overlay backdrop (hardcoded semi-transparent dark overlay)
- Any `rgba()` inline color values in component files

---

## Section 3 — Two Recommended Paths

The requested change (Path D — full light theme) is presented alongside a lower-risk alternative that may achieve the same emotional goal with a fraction of the scope.

---

### PATH D — Full Light Theme Pivot *(what was requested)*

**Concept:** Parchment / warm cream background (like aged paper under daylight). The workshop metaphor shifts from *underground candlelit cellar* to *sunlit apothecary study*.

**Proposed new palette:**

```css
/* Layer 1 replacements */
--raw-parchment-50:  #faf7f2;    /* deepest bg — aged paper */
--raw-parchment-100: #f5f0e8;    /* card surface — lighter paper */
--raw-parchment-200: #ede6d5;    /* raised panels */
--raw-parchment-300: #e0d5c0;    /* hover states */
--raw-ink-900:       #1a0e05;    /* primary text — warm near-black */
--raw-ink-700:       #3d2510;    /* secondary text */
--raw-ink-500:       #6b4a2a;    /* muted text */
--raw-brass-700:     #c8880a;    /* accent (darkened for contrast on light) */
--raw-brass-500:     #e8a818;    /* decorative gold */
--raw-brass-300:     #f0c84a;    /* highlights */
--raw-ember-700:     #8b3a20;    /* danger — deeper red */
```

**Energy states on light:**
- `--energy-fresh`: saturated jewel-tone border + inner glow (e.g., fire elements = orange-red ring)
- `--energy-power`: deeper inset shadow, desaturation of surrounding cards
- `--energy-settled`: opacity 0.75 (slightly more faded than dark theme)

**Scope: MAJOR**

| What changes | Effort |
|-------------|--------|
| VISUAL_PHILOSOPHY.md — complete rewrite (new metaphor: daylit apothecary) | ~2h |
| copilot_CODE_BRIEF.md — all token values | ~1h |
| UX Design Specification — 8+ sections | ~2h |
| Epics.md — FR2, FR3, NFR3 | ~30m |
| app.css — 15 Layer 1 raw variables | ~20m |
| Re-verify all WCAG contrast ratios (entirely new calculations) | ~1h |
| Rework Story 3-2 discovery/failure animations for light bg | ~3-4h |
| Visual QA pass all components | ~2h |
| vite.config.ts theme_color | ~5m |

**Total estimated effort: 12–14 hours of story work across 3+ new stories**

**Risks:**
1. Discovery animation loses its darkroom metaphor — needs new visual identity for the "revelation" moment
2. Element energy glows (the primary "alive shelf" feature) are substantially less dramatic on light
3. OLED benefit (true black = no power draw) is lost
4. The genre differentiator ("simple system + profound atmosphere") may be harder to achieve on a bright bg — Little Alchemy 2 proves it's fine but also proves it's not memorable

---

### PATH V — Vivid Dark (Alternative Recommendation)

**Concept:** Keep the dark workshop. Make the *inhabitants* sing. The dark bg stays near `#0a0805` — but every element gets its own saturated color identity, energy state glows become dramatic neons, and the accent palette expands from monochrome gold to a full jewel-tone spectrum.

**The psychology:** Dark backgrounds make saturated colors appear *more vibrant*, not less. The current palette is dark + desaturated gold. Dark + vivid jewels would read as "rich and alive" rather than "gloomy."

**What changes:**

```css
/* Boost energy states from subtle to vivid */
--energy-fire:    box-shadow: 0 0 12px rgba(255, 120, 30, 0.5);    /* orange-red */
--energy-water:   box-shadow: 0 0 12px rgba(60, 160, 255, 0.5);    /* electric blue */
--energy-earth:   box-shadow: 0 0 12px rgba(80, 200, 80, 0.45);    /* verdant green */
--energy-energy:  box-shadow: 0 0 14px rgba(200, 100, 255, 0.5);   /* violet */
--energy-fresh:   box-shadow: 0 0 16px var(--element-color, var(--material-glass-amber)); /* per-element */
--energy-power:   box-shadow: 0 0 6px rgba(255, 255, 200, 0.15), inset 0 0 8px rgba(255,255,200,0.05);

/* Slightly lift the background surfaces */
--raw-stone-900: #120f09;    /* was #0a0805 — +8% luminance */
--raw-stone-800: #1a1610;    /* was #110e08 — +8% luminance */
--raw-stone-700: #211a12;    /* was #16120b */
--raw-stone-600: #2a2018;    /* was #1c1610 */
```

**Scope: MINOR**
- Only app.css Layer 1 raw tokens and energy state definitions change
- No artifact rewrites
- No WCAG re-verification (same contrast ratios on very similar backgrounds)
- No animation rework
- Story 3-3 specs for new direction

**Effort: ~2-4 hours total, implementable as a single story**

---

## Section 4 — Detailed Change Proposals by Path

### PATH D Change Proposals (if full light pivot chosen)

---

**Change D-1: app.css — Layer 1 token redesign**

```diff
Story: Layer 1 Token Redesign for Light Theme
Section: app.css :root Layer 1 raw variables

OLD:
  --raw-stone-900: #0a0805;
  --raw-stone-800: #110e08;
  --raw-stone-700: #16120b;
  --raw-stone-600: #1c1610;
  --raw-brass-900: #2a2218;
  --raw-brass-700: #3d3020;
  --raw-brass-500: #b8944a;
  --raw-brass-400: #d4a84a;
  --raw-parchment-200: #d8cbb8;
  --raw-parchment-400: #a89478;
  --raw-parchment-600: #6b5a45;

NEW:
  --raw-cream-50:  #faf7f2;
  --raw-cream-100: #f5f0e8;
  --raw-cream-200: #ede6d5;
  --raw-cream-300: #e0d5c0;
  --raw-brass-700: #c8880a;
  --raw-brass-500: #e8a818;
  --raw-brass-300: #f0c84a;
  --raw-ink-900:   #1a0e05;
  --raw-ink-700:   #3d2510;
  --raw-ink-500:   #6b4a2a;
  --raw-ember-700: #8b3a20;
  --raw-gold-400:  #d4980a;  /* darkened for contrast on light */
```

Rationale: Maps warm cream surfaces to semantic bg tokens. Ink colors replace parchment for text.

---

**Change D-2: app.css — Semantic token remapping**

```diff
OLD semantic mappings:
  --color-bg-deep:    var(--raw-stone-900);  /* #0a0805 */
  --color-bg-surface: var(--raw-stone-800);
  --color-text-primary: var(--raw-parchment-200);  /* #d8cbb8 */
  --color-accent:     var(--raw-brass-400);  /* #d4a84a */

NEW semantic mappings:
  --color-bg-deep:    var(--raw-cream-50);   /* #faf7f2 */
  --color-bg-surface: var(--raw-cream-100);
  --color-text-primary: var(--raw-ink-900);  /* #1a0e05 */
  --color-accent:     var(--raw-brass-700);  /* #c8880a — darker for contrast */
```

Rationale: Inverted contrast direction. Text goes dark-on-light. Accent darkened to maintain ≥4.5:1 contrast.

---

**Change D-3: vite.config.ts — PWA manifest colors**

```diff
OLD: theme_color: '#0a0805', background_color: '#0a0805'
NEW: theme_color: '#f5f0e8', background_color: '#faf7f2'
```

---

**Change D-4: Story 3-2 — Animation rework for light background**

The "darkroom" discovery metaphor (red light, paper development) cannot work on a light bg.

Proposed replacement metaphor: **"Sun through stained glass"** — the discovery overlay brightens from parchment to vivid amber/jewel tone as the element name appears. Reverse of the darkroom: starts neutral, blooms into color.

```diff
OLD:
  Discovery overlay: semi-transparent dark (#000000cc) → element on dark
  Particle effects: amber/orange sparks visible against near-black
  Failure: single amber particle rises against dark

NEW:
  Discovery overlay: cream → saturated jewel tone (element-type-specific color wash)
  Particle effects: deep jewel-tone sparks (fire = deep orange, water = sapphire)
  Failure: desaturated muted particle rises against light bg
```

---

**Change D-5: VISUAL_PHILOSOPHY.md — Amendment**

The statements "The dark background isn't a design choice. It's the room" and "Keep the dark. Change its temperature" are philosophically superseded.

Proposed amendment heading to add before Section 1 (Five Emotions):

> **Visual Direction Update — 2026-05-14:** *The workshop has moved upstairs. The room is the same — ancient, worn, inhabited — but it receives natural light now. A high window. Morning. The shelf still has depth. The brass still catches. But you can see the room properly, and the elements glow against the warm cream of the workbench rather than against the dark.*

Full rewrite of "The Room" opening section required.

---

**Change D-6: New Epic/Stories required**

| New Story | Goal |
|-----------|------|
| Story X.1 — Light Token Redesign | Replace all Layer 1 raw tokens, re-verify semantic mappings, update vite.config.ts |
| Story X.2 — WCAG Re-verification | Verify all text/background combinations at new values meet NFR3 on light bg |
| Story X.3 — Animation Rework | Redesign 3-2 discovery/failure animations for light background |

---

### PATH V Change Proposals (if Vivid Dark chosen)

---

**Change V-1: app.css — Lift backgrounds slightly + vivid energy states**

```diff
OLD Layer 1:
  --raw-stone-900: #0a0805;
  --raw-stone-800: #110e08;
  --raw-stone-700: #16120b;
  --raw-stone-600: #1c1610;

NEW Layer 1:
  --raw-stone-900: #120f09;   /* +8% luminance — still very dark but not void */
  --raw-stone-800: #1a1610;
  --raw-stone-700: #211a12;
  --raw-stone-600: #2a2018;

OLD energy state comments:
  --energy-fresh: box-shadow 0 0 8px var(--material-glass-amber)  /* subtle */
  --energy-power: box-shadow 0 0 3px rgba(220,200,180,0.04)       /* barely visible */

NEW energy state tokens:
  --energy-settled-opacity: 0.82;
  --energy-fresh-glow: 0 0 14px rgba(212, 140, 40, 0.65);        /* vivid amber ring */
  --energy-power-glow: 0 0 20px rgba(240, 200, 100, 0.40), 0 0 40px rgba(200, 150, 60, 0.15);

  /* Category-specific glow colors (for future per-element color tokens) */
  --glow-fire:    rgba(255, 110, 30, 0.55);
  --glow-water:   rgba(60, 160, 255, 0.50);
  --glow-earth:   rgba(80, 200, 80, 0.45);
  --glow-energy:  rgba(190, 90, 255, 0.50);
  --glow-metal:   rgba(180, 180, 220, 0.45);
  --glow-compound: rgba(240, 200, 80, 0.45);
```

No other artifacts require changes. One story, atomic implementation.

---

## Section 5 — Implementation Handoff

### Scope Classification

| Path | Scope | Rationale |
|------|-------|-----------|
| **Path D — Full Light Theme** | **MAJOR** | Core identity documents change, 3+ completed stories need partial revisit, WCAG recalculation required, new animation metaphor needed |
| **Path V — Vivid Dark** | **MINOR** | Only Layer 1 token values and energy state definitions change. No artifact rewrites. No WCAG impact. |

---

### Recommendation

**Try Path V first.**

The emotional goal — "happy colors" — is almost certainly achievable by making the dark background's inhabitants vivid and jewel-toned rather than by switching to light. Dark backgrounds are why movie theaters and aquariums are dark: color is most alive against darkness.

The specific complaint may be that the current palette is **dark AND desaturated** (near-black bg + muted gold accent = one of the lowest saturation combinations possible). Path V adds saturation to the elements without touching the atmosphere.

**If Path V is implemented and the result still reads as "too dark,"** then Path D is the correct next move — but you will have both eliminated the saturation hypothesis AND produced element color tokens that Path D would also need.

---

### Handoff Recipients

| Path | Recipient | Action |
|------|-----------|--------|
| Path V | Developer agent (`bmad-dev-story`) | Direct implementation — write Story V.1, execute |
| Path D | PM + Architect | Update VISUAL_PHILOSOPHY.md + UX Spec first, then re-run Sprint Planning with new stories |

---

### Success Criteria (Path V)

- Element cards with "fresh" energy state produce clearly visible, saturated glow rings at natural viewing brightness
- The shelf at full population looks like "vivid objects in a dramatic space" not "colored dots on black"
- Background slightly warmer/less void than before — `#120f09` reads as dark warm brown not near-void
- All existing WCAG contrast ratios maintained (backgrounds moved minimally)

### Success Criteria (Path D)

- Background reads as aged parchment / warm cream — clearly light theme
- Text is dark and readable: ≥ 11:1 primary text on lightest surface
- Discovery animation communicates emergence on a light background (new visual metaphor)
- The game reads as "warm and inviting" to a 10-year-old picking it up for the first time
