# UI Review — Overall Game UI (Mobile Device)

**Phase:** Cross-phase (game UI on mobile device)
**Audited:** 2026-05-03
**Device:** Android phone in landscape orientation (emulated ~880×400 viewport)
**Trigger:** User-reported "not responsive or adaptive, look and feel very bad"

---

## Overall Score: 12/24

| Pillar | Score | Verdict |
|--------|-------|---------|
| Copywriting | 3/4 | Adequate |
| Visuals | 2/4 | Problems |
| Color | 3/4 | Good |
| Typography | 2/4 | Problems |
| Spacing | 1/4 | Poor |
| Experience Design | 1/4 | Poor |

---

## Pillar 1: Copywriting — 3/4

**What works:**
- Element names, categories, and formulas are clear and informative
- Button labels ("React", "Hint", "Elements", "Discoveries") are concise
- Failure messages are playful and varied ("Nothing happened. Try another combo.")
- Daily challenge copy is brief and motivating

**Minor issues:**
- "6/61 discovered" in TopBar is helpful but could be more scannable with progress bar
- "Start your streak!" in DailyChallenge competes for attention with the failure message

**Score rationale:** Copy is functional and appropriate for the game tone. No major confusion points.

---

## Pillar 2: Visuals — 2/4

**Issues identified from screenshot:**

### F-01: Desktop layout shown on mobile device (CRITICAL)
The screenshot shows a landscape phone with the **3-column desktop layout** (shelf | chamber | discovery area). The `@media (max-width: 1024px)` breakpoint hides the discoveries column, but at ~880px landscape width, the shelf sidebar (210px) still renders, creating a cramped center column.

**Evidence:** [+page.svelte](src/routes/game/+page.svelte#L91) — tablet breakpoint only changes to 2-column (`200px 1fr`), still showing the shelf sidebar even on phones in landscape.

### F-02: No landscape-specific layout adaptation
The landscape media query `@media (orientation: landscape) and (max-height: 520px)` only reduces padding/gaps — it doesn't restructure the layout for the fundamentally different aspect ratio.

### F-03: Bottom bar visible AND shelf sidebar visible simultaneously
In the screenshot, both the bottom bar (with "Elements" toggle) and the left shelf panel are showing. This is redundant — the shelf toggle button in the bottom bar serves no purpose when the shelf is always visible.

### F-04: Daily Challenge card stacks below React button in landscape
In limited vertical space, having Slots → React → Hint → Result → Daily Challenge creates a scrollable stack that pushes the DailyChallenge off-screen or compresses everything.

**What works:**
- Element card design with icon + name + formula is clean
- Slot design with dashed border and emoji icons is clear
- React button gradient styling is attractive
- Color-coded category icons are distinguishable

---

## Pillar 3: Color — 3/4

**What works:**
- Dark theme (#0d1b2e base) is appropriate for the "alchemical lab" theme
- Accent color (#4af0c0 teal) is consistent and readable against dark backgrounds
- Category colors are distinct and don't clash
- Success/fail states use appropriate green/red signaling
- Gold (#ffe44a) for combos and achievements creates visual hierarchy

**Minor issues:**
- F-05: The "Nothing happened" error text is dark red on dark red-tinted background — contrast ratio may be marginal
- F-06: Inactive text (#4a6080) is quite dim — borderline WCAG AA at 12px size

**Score rationale:** Palette is cohesive and thematic. Contrast issues are minor.

---

## Pillar 4: Typography — 2/4

**Issues:**

### F-07: Font sizes too small for mobile viewing distance
- Shelf title: 10px
- Category headers: 10px
- Element formula: 9px
- Element category label: 9px
- Tab buttons: 10px
- Bottom bar labels: 10px
- Result formula: 10px
- Daily streak label: 10px

At mobile viewing distance (20-30cm), 9-10px text is extremely difficult to read. Minimum should be 12px for body text, 11px absolute minimum for labels.

### F-08: Space Mono used everywhere — poor readability at small sizes
`Space Mono` is a monospace display font. At 9-10px on mobile screens, its uniform letterforms reduce legibility. It should be reserved for key display elements (scores, formulas) not for navigation labels and category names.

### F-09: No responsive font scaling
Font sizes are fixed px values. No `clamp()`, no viewport-relative units, no media-query adjustments for mobile. Text that looks fine on a 1920px desktop monitor is unreadable on a 6" phone screen.

---

## Pillar 5: Spacing — 1/4

**Critical issues:**

### F-10: Fixed-width layout dimensions don't scale to mobile
- Shelf: `210px` / `200px` fixed width on a ~880px landscape viewport = 23% of screen
- Slots: `90px × 90px` (80px in landscape) — takes significant vertical space
- Result display: `min-height: 150px` (60px in landscape) — still too large for compressed view
- Daily challenge: fixed card adding more vertical pressure

### F-11: No breathing room between elements in landscape
The landscape media query reduces gaps to 8px — creating a cramped, suffocating layout where elements nearly touch each other. The mixing chamber tries to fit: slots (80px) + react button (44px) + hint button + result (60px) + daily challenge in ~350px of vertical space.

### F-12: Shelf element list padding too tight
Elements list: `padding: 2px 8px 8px` with `gap: 3px` between items. On a phone screen, these items are barely distinguishable from each other.

### F-13: No horizontal padding adaptation for landscape
The mixing chamber in landscape uses `padding: 8px 20px` — but the visual weight is all stacked vertically, with horizontal space wasted.

---

## Pillar 6: Experience Design — 1/4

**Critical issues:**

### F-14: No adaptive layout for phone landscape (BLOCKING UX ISSUE)
The game uses CSS media queries based only on **width breakpoints** (`768px`, `1024px`). A phone in landscape (e.g., 880×400) hits the tablet breakpoint, showing a 2-column layout designed for a 768-1024px tablet viewport — not for a phone with 400px of vertical space.

**What should happen:** Phone landscape should detect that vertical space is severely limited and switch to a horizontal layout (shelf hidden, chamber + slots side-by-side, or slots on left + result on right).

### F-15: No landscape phone detection
No media query combines `orientation: landscape` with a width/height check that distinguishes phones from tablets. The `max-height: 520px` landscape query only tweaks spacing — it doesn't restructure.

### F-16: Bottom bar redundant in tablet/landscape view
The bottom bar "Elements" button toggles the shelf drawer — but in the tablet breakpoint, the shelf is ALWAYS visible as a sidebar. The button has no effect, confusing users.

### F-17: All content stacked vertically in center column
The center column uses `flex-direction: column` in ALL viewport sizes. In landscape phones where horizontal space is plentiful but vertical space is scarce, this creates a scrolling nightmare. A horizontal arrangement of mixing elements would be far more appropriate.

### F-18: DailyChallenge competes with ResultDisplay for attention
Both are prominently positioned in the center column. After a reaction, the result animation draws the eye — but the daily challenge card sits immediately below/overlapping, creating visual clutter rather than hierarchy.

---

## Top Fixes (Priority Order)

### 1. Add phone-landscape breakpoint with horizontal layout
```css
@media (orientation: landscape) and (max-height: 500px) and (max-width: 920px) {
  /* Phone landscape: hide shelf, use horizontal mixing layout */
  .shelf-container { display: none; }
  .lab-wrapper { grid-template-columns: 1fr; }
  .center-col { flex-direction: row; }
}
```
Hide the shelf (use bottom-bar Elements toggle to show it as an overlay). Arrange slots and result side-by-side.

### 2. Increase minimum font sizes to 12px on mobile
All text elements currently at 9-10px should be at minimum 12px on mobile. Use media queries or `clamp()`:
```css
font-size: clamp(11px, 2.5vw, 14px);
```

### 3. Remove redundant bottom bar items in tablet view
When shelf sidebar is visible, hide the "Elements" bottom bar button (or hide the sidebar and always use the overlay pattern on non-desktop).

### 4. Collapse DailyChallenge into TopBar or bottom sheet on landscape
In landscape phone view, the daily challenge should not occupy center-column real estate. Move it to a compact TopBar indicator or into the discoveries bottom sheet.

### 5. Use percentage/fluid dimensions for slots and chamber
Replace `width: 90px; height: 90px` with viewport-relative sizing:
```css
.slot { width: min(90px, 20vw); height: min(90px, 20vh); }
```

---

## Root Cause Analysis

The core problem is that the responsive design was built with a **desktop-first, width-only breakpoint strategy** that maps poorly to real mobile devices:

| Actual Device | Viewport | Breakpoint Hit | Layout Applied | Appropriate? |
|---|---|---|---|---|
| Desktop (1920×1080) | 1920×1080 | >1024px | 3-column | ✅ |
| iPad landscape | 1024×768 | ≤1024px | 2-column + bottom bar | ✅ |
| Phone portrait | 390×844 | ≤768px | Single column + drawer | ✅ |
| **Phone landscape** | **844×390** | **≤1024px** | **2-column (shelf+chamber)** | **❌** |

The phone landscape case is the critical gap. At 844px wide × 390px tall, the width breakpoint serves a "tablet" layout — but the height is phone-like and can't support the vertical stacking that tablet layout assumes.

**Fix strategy:** Add a compound media query that detects phone-landscape specifically:
```css
@media (orientation: landscape) and (max-height: 500px) {
  /* This is a phone in landscape — restructure completely */
}
```

---

## Summary

The game's visual design (colors, theming, component styling) is **solid** — the dark alchemical lab aesthetic with teal and gold accents works well. The **critical failures are in layout adaptation**: the responsive system doesn't account for phone landscape orientation, leading to a cramped, barely usable experience. Typography at 9-10px is a secondary but significant accessibility issue.

**Estimated effort:** 1 phase (3-4 plans) to properly address the landscape layout + font scaling + redundancy issues.
