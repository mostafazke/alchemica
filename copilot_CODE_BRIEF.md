# Alchemica — Code Brief (Phase 1)

> Before writing any component, ask:
> 1. **Does this feel like it belongs in a warm stone workshop?** If it feels like a software panel, start over.
> 2. **What work is this element doing that nothing else is doing?** If it can't answer, it doesn't belong.

---

## The Five Laws

1. **Every tap produces visible feedback within 50ms.** No silent interactions. Ever.
2. **No filled/solid background buttons.** All buttons are ghost or outlined. The warm stone surface IS the background; buttons are brass edges on that surface, not painted rectangles.
3. **No red for failure.** "No Reaction" does not exist in the vocabulary. Failed combinations use "Not yet" language, gentle drift-back animation, and a single rising particle.
4. **No tutorial modals.** The room teaches through interaction. First-session hints are contextual pulses that dissolve after first use.
5. **Respect `prefers-reduced-motion`.** Wrap all `transition` and `animation` in the media query. Keep opacity fades; disable scale, slide, and particle effects.

---

## Design Tokens

### Backgrounds (warm stone)

```css
--color-bg-deep: #0a0805;       /* deepest — warm stone floor */
--color-bg-surface: #110e08;    /* card/tile surface — brass shelf */
--color-bg-raised: #16120b;     /* panel background — workbench */
--color-bg-hover: #1c1610;      /* hover/active — brass catching light */
```

### Borders (brass edges)

```css
--color-border-subtle: #2a2218;  /* default — aged brass in shadow */
--color-border-mid: #3d3020;     /* slot dashes, input frames */
--color-border-active: #b8944a60; /* hover/focus — warm brass glow */
--color-border-hot: #d4a84a;     /* selected/ready — polished brass */
```

### Accent & Danger

```css
--color-accent: #d4a84a;        /* primary accent — worn gold */
--color-accent-dim: #d4a84a30;  /* glow/shadow version */
--color-gold: #e8b84b;          /* combo, daily challenge */
--color-danger: #c45a3a;        /* destructive actions — ember red */
```

### Text (warm parchment)

```css
--color-text-primary: #d8cbb8;   /* main readable — 11:1 on surface */
--color-text-secondary: #a89478; /* secondary labels — 5.5:1 */
--color-text-muted: #6b5a45;     /* decorative only, never readable text — 3:1 */
```

### Materials (physical metaphor)

```css
--material-brass-highlight: #d4a84a; /* worn brass catching light */
--material-brass-shadow: #2a2218;    /* brass recesses */
--material-glass-clear: rgba(200, 180, 140, 0.06);  /* apothecary glass */
--material-glass-amber: rgba(180, 120, 60, 0.12);   /* glass that absorbed its contents */
--material-stone-warm: #0a0805;      /* stone holding old heat */
```

### Element Energy States

```css
--energy-settled: opacity 0.85;                              /* used many times */
--energy-fresh: box-shadow 0 0 8px var(--material-glass-amber); /* recently discovered */
--energy-power: box-shadow 0 0 3px rgba(220, 200, 180, 0.04);  /* high-energy, barely visible */
```

### Typography

| Token | Size | Weight | Font | Usage |
|-------|------|--------|------|-------|
| `--text-title` | 16px | 700 | Space Mono | TopBar title, panel headings |
| `--text-body` | 13px | 400 | system-ui | Descriptions, result text |
| `--text-label` | 12px | 600 | Space Mono | Tab labels, badge text |
| `--text-caption` | 11px | 400 | Space Mono | Formulas, categories |
| `--text-micro` | 11px | 400 | Space Mono | Names under grid icons — **floor, never below** |

### Spacing (4px grid)

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Icon inner padding |
| `--space-2` | 8px | Component internal padding |
| `--space-3` | 12px | Between sibling components |
| `--space-4` | 16px | Section padding |
| `--space-6` | 24px | Between major zones |
| `--space-11` | 44px | Minimum touch target |
| `--space-12` | 48px | Comfortable touch target |
| `--space-13` | 52px | TopBar/BottomBar height |

### Fluid Scaling

```css
--font-size-body: clamp(0.875rem, 2.5vw, 1rem);
--font-size-label: clamp(0.6875rem, 2vw, 0.8125rem);
--space-xs: clamp(0.25rem, 1vw, 0.5rem);
--space-sm: clamp(0.375rem, 1.5vw, 0.75rem);
--shelf-width: clamp(35%, 40vw, 45%);
```

---

## Phase 1 Components

### 1. ElementCard (×61 instances)

56×56px, 6px radius. Emoji 20px centered, name 11px `--text-muted` below.

| State | Visual |
|-------|--------|
| Default | `--color-bg-surface` bg, `--color-border-subtle` border |
| Hover | `--color-bg-hover` bg, `--color-border-mid` border |
| Selected | `--color-border-hot` border, `--color-accent-dim` shadow |
| Fresh | `--energy-fresh` box-shadow (amber glass glow) |
| Settled | `--energy-settled` (opacity 0.85) |
| Power | `--energy-power` (barely perceptible 3px glow) |

Accessibility: `role="button"`, `aria-label="{name}, {category}"`, `aria-pressed` for selected.

### 2. MixingSlot (×2)

56×56px, 8px radius. Clear button (×) appears when filled.

| State | Visual |
|-------|--------|
| Empty | 2px dashed `--color-border-mid`, "+" glyph |
| Filled | 2px solid `--color-border-hot`, `--color-accent-dim` bg, emoji |
| Ready | Filled + synchronized breathe animation (both slots) |
| Reacting | Scale pulse, radial shimmer |

Accessibility: `role="button"`, `aria-label="Mixing slot {A|B}: {name or empty}"`.

### 3. ActionZone

Result display area. Transforms in place — no layout shift.

| State | Content |
|-------|---------|
| Idle | "Tap two elements to combine" — italic, `--text-muted` |
| Discovery | emoji + "✦ NEW: {name}" + pts — `--accent` |
| Known | emoji + name + recipe + pts — `--text-primary` |
| Failure | "Not yet..." — italic, `--text-secondary` |

Accessibility: `aria-live="assertive"` for discoveries, `aria-live="polite"` for known results.

### 4. ShelfGrid + FilterTabs

CSS Grid: `repeat(auto-fill, minmax(56px, 1fr))`, 4px gap, vertical scroll.

FilterTabs: horizontal row. "All" always first. Category tabs appear as elements are discovered. Each shows count badge. 44px minimum height.

Accessibility: `role="tablist"` with `role="tab"` children.

### 5. TopBar

52px height + `safe-area-inset-top`. Layout: Title | [12/61] badge | 🎯 daily challenge | Score.

Compact mode (viewport height < 350px): hide score, keep element count only.

### 6. BottomBar

40px height + `safe-area-inset-bottom`. 4 tabs: Mix ⚗️ | Recipe 📋 | Achieve 🏆 | Settings ⚙️.

Active tab: accent icon + label. Inactive: muted.

Compact mode (viewport height < 350px): icon-only, no labels.

Accessibility: `role="tablist"`, each tab `role="tab"`, `aria-selected`.

---

## Animation Contracts

### Discovery (new element — 1.2s total)

```
0ms     Overlay fades in (200ms), backdrop rgba(0,0,0,0.85)
200ms   "✦ NEW DISCOVERY" badge appears
200ms   Emoji scales 0.1→1.0, spring curve (1.2s)
1400ms  Silence — 200ms pause
1600ms  Sound plays
1600ms  Name + formula fade in (300ms)
1900ms  "Continue →" button fades in
        Screen-edge flash: rgba(--accent, 0.08)
```

Focus trap active. `role="dialog"`, `aria-modal="true"`.

### Failure (not-yet — 320ms)

```
0ms     Elements drift back gently (320ms ease-out)
0ms     Single particle rises from beaker area, slows, disappears
0ms     ActionZone shows "Not yet" in --text-secondary italic
        No red. No error sound. No shake.
        Slots remain filled — player clears one to retry.
```

### Known Element (efficient — 600ms)

```
0ms     Result appears inline in ActionZone
0ms     "+N pts" floats upward (600ms), then fades
        No overlay. No ceremony. The expert doesn't celebrate the ordinary.
```

### Slot Fill

```
0ms     Card border → --border-hot (instant)
0ms     Slot: element scales 0.6→1.0 (180ms), opacity 0→1
        Glass-clink sound
```

### Both Slots Ready → Auto-React

```
0ms     Both slots enter breathe animation (synchronized)
180ms   Settle delay — world contracts (zone scale 0.97)
180ms   Radial shimmer across ActionZone
        → Result sequence fires
```

---

## Layout

```
┌──────────────────────────────────────────────────────────────────┐
│  TopBar (52px + safe-area-inset-top)                             │
├───────────────────────────────┬──────────────────────────────────┤
│  Element Shelf (55% width)    │  Mixing Chamber (45% width)      │
│  min-width: 220px             │  min-width: 180px                │
│  FilterTabs + ShelfGrid       │  2× MixingSlot + ActionZone      │
├───────────────────────────────┴──────────────────────────────────┤
│  BottomBar (52px + safe-area-inset-bottom)                       │
└──────────────────────────────────────────────────────────────────┘

Landscape-locked. No breakpoints. Fluid scaling via clamp().
Minimum game area height: 216px (iPhone SE).
```

---

## Accessibility Checklist

- [ ] All interactive elements ≥ 44×44px
- [ ] Focus indicators: 2px `--accent` outline, 2px offset
- [ ] `lang="en"` on `<html>`
- [ ] `prefers-reduced-motion` wraps all animation/transition
- [ ] Color contrast ≥ 4.5:1 for text, ≥ 3:1 for UI components
- [ ] `aria-live` regions for score and result announcements
- [ ] Tab order: TopBar → Shelf filters → Grid → Slots → ActionZone → BottomBar
- [ ] Escape dismisses overlay/popover
- [ ] No `outline: none` without replacement focus style
