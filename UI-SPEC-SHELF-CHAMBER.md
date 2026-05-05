# UI/UX Spec — Element Shelf & Mixing Chamber

_Version: 1.0 · Date: 2026-05-03_
_Informed by: UX-AUDIT.md, UI-PATTERNS-RESEARCH.md (Little Alchemy 2, Duolingo, Monument Valley)_

---

## 0. Reference Constraints

### Target screens (landscape only — game is locked to landscape)

| Device | Viewport | Game area height* |
|---|---|---|
| iPhone SE (3rd gen) landscape | 568 × 320px | 216px |
| iPhone 14 Pro landscape | 852 × 393px | 268px |
| iPhone 15 Pro Max landscape | 932 × 430px | 305px |
| Samsung Galaxy S22 landscape | 915 × 412px | 288px |
| iPad Mini landscape | 1024 × 768px | 664px |

*Game area = viewport height − TopBar (52px) − BottomBar (52px + safe-area-inset-bottom).

**All measurements must fit within the 216px minimum game area** unless marked as "iPad enhanced."

### Panel split

```
┌──────────────────────────────────────────────────────────────────────────┐
│  TopBar (52px + safe-area-inset-top)                                     │
├────────────────────────────────┬─────────────────────────────────────────┤
│  Element Shelf (55% width)     │  Mixing Chamber (45% width)             │
│  min-width: 220px              │  min-width: 180px                       │
│  border-right: 1px #1a2e4a    │                                         │
├────────────────────────────────┴─────────────────────────────────────────┤
│  BottomBar (52px + safe-area-inset-bottom)                               │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Design Tokens

### 1.1 Spacing (4px base unit — all measurements must be multiples of 4)

| Token | Value | Usage |
|---|---|---|
| `--space-1` | 4px | Icon inner padding, micro-gaps |
| `--space-2` | 8px | Component internal padding, between inline items |
| `--space-3` | 12px | Between sibling components |
| `--space-4` | 16px | Section padding, container edge margins |
| `--space-6` | 24px | Between major zones |
| `--space-11` | 44px | Minimum touch target dimension |
| `--space-12` | 48px | Comfortable touch target, utility buttons |
| `--space-13` | 52px | TopBar / BottomBar height, primary CTA height |

### 1.2 Touch targets

Every tappable element must meet **44×44px minimum** (Apple HIG / WCAG 2.5.5). When the visual element is smaller than 44px, extend the invisible hit area using padding, before/after pseudo-elements, or a transparent overlay element.

| Component | Visual size | Hit area |
|---|---|---|
| Element card (grid) | 76×76px | 76×76px (full cell — already compliant) |
| Slot clear button | 16×16px visual × | 44×44px (centered hit area) |
| Filter tab | full-width × 44px | same |
| React button | full-width × 52px | same |
| Result share button | auto × 44px | same |
| Hint dismiss (×) | 14px visual | 44×44px hit area |
| Long-press indicator dot | 4px | N/A — not independently tappable |

### 1.3 Color tokens

```
--color-bg-deep:       #080f1a   /* Deepest background, scrollable areas */
--color-bg-surface:    #0a1520   /* Card / tile surface */
--color-bg-raised:     #0d1b2e   /* Panel background */
--color-bg-hover:      #0f2035   /* Hover / active background tint */
--color-bg-selected:   #0f3028   /* Selected element tint */

--color-border-subtle: #1a2e4a   /* Default borders, dividers */
--color-border-mid:    #1a3a5a   /* Slot dashes, input frames */
--color-border-active: #4af0c060 /* Hover / focus border */
--color-border-hot:    #4af0c0   /* Selected / ready state border */

--color-accent:        #4af0c0   /* Primary accent — teal-green */
--color-accent-dim:    #4af0c040 /* Glow / shadow version */
--color-gold:          #e8b84b   /* Combo, daily challenge, XP */
--color-danger:        #ff6b6b   /* Destructive actions only */
--color-text-primary:  #c8d8e8   /* Main readable text */
--color-text-secondary:#8ab4d4   /* Secondary labels */
--color-text-muted:    #4a6080   /* Placeholder, inactive labels */
--color-text-ghost:    #2a3550   /* DO NOT USE for readable text — fails WCAG AA */
```

`--color-text-ghost` is listed for reference only. It must never be used for any text the user is expected to read (audit P1 item 10).

### 1.4 Typography

| Token | Size | Weight | Font | Usage |
|---|---|---|---|---|
| `--text-title` | 16px | 700 | Space Mono | TopBar title, panel headings |
| `--text-body` | 13px | 400 | system-ui | Descriptions, result text |
| `--text-label` | 12px | 600 | Space Mono | Tab labels, badge text, button labels |
| `--text-caption` | 11px | 400 | Space Mono | Secondary labels, formulas, categories |
| `--text-micro` | **11px minimum** | 400 | Space Mono | Names under grid icons — **never below 11px** |

All 9px and 10px font sizes identified in the audit are replaced by the 11px minimum (`--text-micro`). This applies to `.el-grid-name`, `.el-formula`, `.disc-recipe`, `.disc-formula`, `.bar-btn-label`, `.result-formula`.

### 1.5 Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 6px | Icons, tags |
| `--radius-md` | 8px | Cards, tiles, small buttons |
| `--radius-lg` | 10px | Slots, react button, result display |
| `--radius-xl` | 16px | Bottom sheets, modal panels |

### 1.6 Animation timing (per Monument Valley principle: pacing is a UI decision)

| Token | Duration | Easing | Usage |
|---|---|---|---|
| `--anim-instant` | 0ms | — | Touch highlight (must feel immediate per Duolingo) |
| `--anim-fast` | 100ms | ease-out | Selection state, hover transitions |
| `--anim-react` | 180ms | ease-out | Slot fill, result appear |
| `--anim-settle` | 320ms | cubic-bezier(0.34,1.56,0.64,1) | Slot clear, card deselect (spring) |
| `--anim-discovery` | 400ms | ease-out | New discovery icon expand (MV-inspired: slow enough to register) |
| `--anim-float` | 600ms | ease-out | "+N" score float upward, fade out |
| `--anim-longpress` | 500ms | linear | Long-press progress fill |

---

## 2. Element Shelf

### 2.1 Container

```
┌─────────────────────────────────────────────────────┐
│  Filter Tab Bar (44px fixed height)                 │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Grid Scroll Area (flex: 1, overflow-y: auto)       │
│                                                     │
│  [card] [card] [card] [card] [card]                 │
│  [card] [card] [card] [card] [card]                 │
│  [card] ...                                         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

- Background: `--color-bg-deep`
- Right border: `1px solid --color-border-subtle`
- No horizontal overflow.

### 2.2 Filter Tab Bar

**Layout:**
- Height: **44px** (exactly — audit fix P1 item 8, was 36px)
- Padding: `8px` (--space-2) on all sides
- Tabs: 3 buttons, `flex: 1` each, gap: `4px` (--space-1)
- Background: `--color-bg-deep`
- Bottom border: `1px solid --color-border-subtle`

**Individual tab dimensions:**
- Height: **28px** (within the 44px bar — full bar is the touch zone)
- The **entire tab bar row** serves as the touch zone for each tab because tabs share the row
- Alternative: add invisible vertical hit-area extension so each tab button reports 44px tap height — use `min-height: 44px` with negative margins to avoid layout shift
- Border-radius: `--radius-md` (8px)
- Font: `--text-label` (12px, Space Mono)
- Text transform: uppercase
- Letter-spacing: 0.5px

**Tab count badge:**
- Positioned: inline-right of label text, not absolute
- Size: 16×16px minimum, `border-radius: 8px`
- Font: 9px (too small to be readable — use 11px monospace, `--text-micro`)
- Colors:
  - Active tab badge: bg `--color-accent`, text `--color-bg-raised`
  - Inactive tab badge: bg `--color-border-mid`, text `--color-text-muted`

**States:**

| State | Border | Background | Text color |
|---|---|---|---|
| Default | `1px solid --color-border-subtle` | transparent | `--color-text-muted` |
| Hover | `1px solid --color-border-active` | `--color-bg-hover` | `--color-accent` |
| Active (selected) | `1px solid --color-border-active` | `--color-bg-hover` | `--color-accent` |
| Focus-visible | `2px solid --color-accent` | `--color-bg-hover` | `--color-accent` |

Transition: `border-color, background, color` at `--anim-fast` (100ms) ease-out.

**No currently-selected-tab indicator beyond the above states** — the active background + color difference is sufficient.

### 2.3 Grid Scroll Area

**Layout:**
- Padding: `8px` (--space-2) on all sides
- Display: CSS Grid
- `grid-template-columns: repeat(auto-fill, minmax(76px, 1fr))`
- Gap: `6px` (non-standard — acceptable because it's visual spacing, not touch spacing; touch targets are the cells themselves)
- `overflow-y: auto`
- `-webkit-overflow-scrolling: touch`
- `align-content: start` — cells don't stretch to fill

**Column count reference (at 55% of viewport width, with 8px+8px padding):**

| Viewport width | Left panel width | Available | Columns |
|---|---|---|---|
| 568px | 312px | 296px | 3 cols × 96px |
| 852px | 469px | 453px | 5 cols × 88px |
| 932px | 513px | 497px | 6 cols × 80px |

**Scroll bar:** Custom `--color-border-mid` thumb, 4px wide, hidden on touch.

**Swipe tab switching:**
- A horizontal swipe gesture (≥40px delta, <200ms, primarily horizontal) on the scroll area switches to the adjacent tab
- Left swipe = next tab, right swipe = previous tab
- The grid scroll's own `overflow-y` takes priority — swipe is only detected when the touch starts in the top 44px of the grid, or when the grid is already at the top of its scroll

### 2.4 Element Card (Grid Mode)

**Dimensions:**
- Width: fills grid cell (min 76px, flex)
- Height: **76px** (fills grid cell — 4px increase from audit, maintains touch compliance)
- Padding: `6px 4px` (--space-1.5 / --space-1)
- Layout: `flex-direction: column`, `align-items: center`, `justify-content: center`, `gap: 4px`
- Border: `1px solid --color-border-subtle`
- Border-radius: `--radius-md` (8px)
- Background: `--color-bg-surface`
- `touch-action: manipulation`

**Icon:**
- Size: **32×32px** (was 30px — bump to align to 4px grid)
- Border-radius: `--radius-sm` (6px)
- Font-size: 18px (the symbol glyph)
- Category color backgrounds from current `cat-*` classes — unchanged

**Name label:**
- Font: `--text-micro` (**11px** — audit fix P1 item 11, was 9px)
- Color: `--color-text-secondary`
- `text-align: center`
- `max-width: 100%`
- `overflow: hidden`
- `text-overflow: ellipsis`
- `white-space: nowrap`

**Long-press affordance:**
A 3×3px dot pattern (`⋯`) or a subtle hold-icon (three dots `•••`) rendered at 8px height in `--color-text-muted` at the bottom-right corner of the icon — visible only on default state, fades out on selected state. This communicates long-press availability without cluttering. Size: 8px visible, no touch requirement (it's decorative).

**States:**

| State | Border | Background | Box-shadow | Scale |
|---|---|---|---|---|
| Default | `1px solid --color-border-subtle` | `--color-bg-surface` | none | 1.0 |
| Hover (pointer) | `1px solid --color-border-active` | `--color-bg-hover` | none | 1.0 |
| Tap (active) | `1px solid --color-border-active` | `--color-bg-hover` | none | 0.97 (instant) |
| Selected (in slot A or B) | `1px solid --color-border-hot` | `--color-bg-selected` | `0 0 8px --color-accent-dim` | 1.0 |
| Selected + hover | `1px solid --color-accent` | `--color-bg-selected` | `0 0 12px --color-accent-dim` | 1.0 |
| Drag-lifted | `1px solid --color-border-hot` | `--color-bg-selected` | `0 4px 16px rgba(0,0,0,0.4)` | 1.05 |
| Long-press hold (0–500ms) | `1px solid --color-border-active` | `--color-bg-hover` | none | 0.98 |
| Disabled (future use) | `1px solid --color-border-subtle` | `--color-bg-surface` | none | 1.0, opacity: 0.4 |
| Focus-visible | `2px solid --color-accent` | `--color-bg-hover` | none | 1.0 |

Transition: `border-color, background, box-shadow` at `--anim-fast` (100ms) ease-out.
Scale: `--anim-instant` (0ms) for tap-down, `--anim-fast` (100ms) ease-out for tap-release.

**Slot-full state (third tap behavior):**
When both slots are already filled and the user taps a third element card:
- Slot A content is replaced by the new selection (not slot B)
- Slot A card briefly flashes out (`opacity: 0 → 1` over 180ms)
- The previously-slot-A card returns to default state (deselected)
- No error message — behavior is silent and self-evident

### 2.5 Empty States

**"All" tab — impossible** (4 starter elements always present; no empty state needed)

**"Basic" tab — always shows 4 cards:**
- No empty state needed

**"Found" tab — zero discoveries:**

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│               🧪                                   │
│        No discoveries yet                           │
│  Combine elements to find your first reaction       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

- Icon: 32px, `--color-text-muted`
- Heading: `--text-label` (12px), `--color-text-muted`
- Subtext: `--text-caption` (11px), `--color-text-muted`  
- Text-align: center
- Padding: `24px 16px`
- `grid-column: 1 / -1` (spans full grid width)

**"Found" tab — filter returns zero (future search feature):**

```
  No matches for "volcn"
  ↺  Clear search
```

- Same layout as above but with an inline clear-search button (44×44px touch target)

---

## 3. Mixing Chamber

### 3.1 Container

```
┌────────────────────────────────────────────┐
│  [particle canvas — position: absolute]    │
│                                            │
│  ┌──────────────────────────────────────┐  │  ← Slots Row
│  │  [Slot A]   [+]   [Slot B]           │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  ┌──────────────────────────────────────┐  │  ← Unified Action Zone
│  │  [React CTA or Result display]       │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  ┌──────────────────────────────────────┐  │  ← Utility Row
│  │  [HintButton]   [DailyChallenge]     │  │
│  └──────────────────────────────────────┘  │
│                                            │
└────────────────────────────────────────────┘
```

- Position: `relative`
- Display: `flex`, `flex-direction: column`, `align-items: center`, `justify-content: center`
- Gap: `--space-2` (8px) between the three rows
- Padding: `8px 16px` (top/bottom 8px, left/right 16px)
- Overflow: hidden
- `min-height: 0` (prevents flex overflow)

**Height budget on minimum screen (216px game area, 8+8px padding = 200px usable):**

| Row | Height |
|---|---|
| Slots Row | 80px |
| Gap | 8px |
| Unified Action Zone | min 80px, flex: 1 |
| Gap | 8px |
| Utility Row | 44px |
| **Total** | **≥ 220px** |

On iPhone SE (216px game area): Utility Row collapses to minimum (44px), Unified Action Zone shrinks to 80px. Fits at 220px with 4px vertical overflow absorbed by `justify-content: center`. **Action Zone must never clip on any target screen** — it is the core feedback surface. If space is insufficient, the Utility Row uses `overflow: hidden` and hides its labels (icon-only mode at `padding: 0`), saving 8px.

### 3.2 Slots Row

**Layout:**
- `display: flex`, `align-items: center`, `gap: 12px`
- `flex-shrink: 0`
- Centered horizontally

**Slot dimensions:**
- Width: **80px** (was 70px — audit fix P1 item 4; 10px increase on 4px grid)
- Height: **80px**
- Border-radius: `--radius-lg` (10px)
- Layout: `flex-direction: column`, `align-items: center`, `justify-content: center`, `gap: 4px`
- `user-select: none`
- `position: relative` (to contain the clear button)

**Plus divider:**
- Visual: `+` character, 22px, `--color-border-mid`
- Not interactive
- `user-select: none`, `pointer-events: none`
- `flex-shrink: 0`
- Width: 20px (explicit — prevents layout collapse at small widths)

**Total slots row width:** 80 + 12 + 20 + 12 + 80 = 204px. Fits in all target right panel widths (min 180px is tight — at 180px, reduce gap to 8px: 80+8+20+8+80 = 196px).

### 3.3 Slot (empty state)

```
┌─ ─ ─ ─ ─ ─ ─ ─┐
│                 │
│        +        │
│                 │
└─ ─ ─ ─ ─ ─ ─ ─┘
```

- Border: `2px dashed --color-border-mid`
- Background: `--color-bg-deep`
- Placeholder `+`: font-size 28px, color `--color-border-mid`
- No text label

**Drag-over state (element being dragged over this slot):**
- Border: `2px solid --color-accent` (dashed → solid transition)
- Background: `rgba(74, 240, 192, 0.05)`
- Scale: `1.04` (signals "this is a valid drop target")
- Transition: `--anim-fast` (100ms)

### 3.4 Slot (filled state)

```
┌─────────────────┐
│  [×]            │  ← 44×44px hit area, 12×12px visual ×
│                 │
│  [🔥 icon 36px] │
│  element name   │
└─────────────────┘
```

- Border: `2px solid --color-border-active`
- Background: `--color-bg-surface`
- Transition from empty: icon scales in `0.6 → 1.0`, opacity `0 → 1`, duration `--anim-react` (180ms), easing `ease-out`

**Icon:**
- Size: **36×36px** (was 32px — 4px increase for visual prominence in the larger slot)
- Border-radius: `--radius-sm` (6px)
- Font-size: 20px (glyph)
- Category color class unchanged

**Name label:**
- Font: `--text-caption` (**11px**, Space Mono)
- Color: `--color-text-secondary`
- `text-align: center`
- `max-width: 72px`
- `overflow: hidden`, `text-overflow: ellipsis`, `white-space: nowrap`

**Both slots filled — "ready" state:**
Both slots simultaneously enter a ready state:
- Border: `2px solid --color-accent` (fully opaque)
- Box-shadow: `0 0 10px --color-accent-dim`
- A subtle synchronized "breathe" animation: `box-shadow` pulses from `0 0 10px` to `0 0 18px` and back over 1200ms, infinite, `ease-in-out`
- This is the only persistent animation in the UI — it must stop immediately when the reaction fires

### 3.5 Slot Clear Button

**The current 24×24px implementation is non-compliant. This replaces it.**

- Position: `absolute`, `top: 0`, `right: 0`
- Hit area: **44×44px** (transparent, `pointer-events: all`)
- Visual × : centered within the 44×44px hit area
  - Circle background: `20×20px`, `border-radius: 50%`, `background: rgba(10,21,32,0.9)`
  - Border: `1px solid --color-border-subtle`
  - × character: 12px, `--color-text-muted`
- The hit area extends into the slot and slightly outside — this is intentional

**States:**

| State | × color | Circle border | Circle background |
|---|---|---|---|
| Default | `--color-text-muted` | `--color-border-subtle` | `rgba(10,21,32,0.9)` |
| Hover | `--color-danger` | `rgba(255,107,107,0.4)` | `rgba(26,10,10,0.95)` |
| Active (tap) | `--color-danger` | `rgba(255,107,107,0.6)` | `rgba(40,10,10,0.95)` |
| Focus-visible | `--color-accent` | `--color-accent` | `rgba(10,21,32,0.9)` |

Transition: `--anim-fast` (100ms) ease-out.

**On clear:**
- The slot content scales from `1.0 → 0.7` and fades `1 → 0` over `--anim-settle` (320ms) with a spring easing
- The slot returns to empty state simultaneously
- If this was a "both filled → ready state" moment, both slots' ready glow also fades in 320ms

---

## 4. Unified Action Zone

This replaces the current two-component `ReactButton + ResultDisplay` pattern with a single zone that **transforms in place** (Duolingo bottom bar principle). The zone is always present, always in the same position, always the same container size. Only its internal content transforms.

**Container:**
- Width: `100%`, max-width: `320px`
- Min-height: **80px**
- Flex: `1` (grows to fill available vertical space up to `max-height: 160px`)
- Border-radius: `--radius-lg` (10px)
- `overflow: hidden`
- `position: relative` (for score float layer)

The zone passes through four phases per interaction cycle:

### Phase 1 — Idle (no slots filled, or one slot filled)

```
┌────────────────────────────────────────────────┐
│                                                │
│      Select two elements to react             │
│                                                │
└────────────────────────────────────────────────┘
```

- Background: `--color-bg-surface`
- Border: `1px solid --color-border-subtle`
- Text: `--text-caption` (11px), color `--color-text-secondary` (**not** `--color-text-ghost` — audit fix P1 item 10)
- Text: "Select two elements to react" — instructional, visible, readable
- No button rendered — the zone is display-only in this phase
- Transition into: fade `0 → 1` over `--anim-react` (180ms)

### Phase 2 — Ready (both slots filled)

```
┌────────────────────────────────────────────────┐
│                                                │
│         ⚗  React     [×2 combo badge]         │
│                                                │
└────────────────────────────────────────────────┘
```

- Background: `linear-gradient(135deg, #1a4a3a, #0f3028)`
- Border: `1px solid --color-border-hot` (fully opaque accent)
- Box-shadow: `0 0 16px --color-accent-dim`
- Button is now the **entire zone** — the zone itself is the touch target (no inner button element)
- Label: `⚗ React`, font `--text-label` (12px), Space Mono, color `--color-accent`
- The zone reaches compliant 80px height — fully above 44px minimum
- Transition into from Phase 1: background color crossfade + border color + box-shadow, all at `--anim-react` (180ms) ease-out
- Breathing glow: `box-shadow` pulses `0 0 16px → 0 0 28px` over 1200ms infinite ease-in-out (same as slot ready glow — they synchronize)
- Combo badge: `position: absolute`, `top: 8px`, `right: 8px` — **inside** the zone container (not outside it — audit fix P2 item 13)
  - Background: `--color-gold`, color: `--color-bg-raised`, font: `--text-micro` (11px bold)
  - Size: auto width × 20px height, `border-radius: 10px`, `padding: 0 6px`
  - Visible only when `combo > 1`

**Tap feedback:**
- Zone scales to `0.98` over `--anim-instant` (0ms) on touch-start
- Returns to `1.0` over `--anim-fast` (100ms) on touch-end (spring: `cubic-bezier(0.34,1.56,0.64,1)`)

### Phase 3 — Reacting (200ms window between tap and result)

- Zone scale: `0.97` (remains pressed) — duration intentionally slow at `--anim-react` (180ms)
- A subtle radial shimmer sweeps center-outward across the zone background
- Shimmer: `rgba(74,240,192,0.08)` radial gradient, sweeps `0% → 100%` radius over 180ms
- No text change during this phase
- This brief pause is intentional (Monument Valley principle: pacing is a UI decision)

### Phase 4a — Result: Known reaction (already discovered)

```
┌────────────────────────────────────────────────┐
│  [🔥 icon 40px]  Steam                         │
│                  Water + Fire                  │
│                  [+10 pts]  [→ React again]    │
└────────────────────────────────────────────────┘
```

- Background: `--color-bg-surface`
- Border: `1px solid --color-border-active`
- Layout: `flex-direction: row`, `align-items: center`, `gap: 12px`, `padding: 12px 16px`
- Element icon: 40×40px
- Name: `--text-body` (13px), weight 700, `--color-text-primary`
- Recipe: `--text-caption` (11px), `--color-text-muted`
- Score float: `+10` or `+N` rendered in a separate absolutely-positioned layer above the zone, then floats upward 24px and fades out over `--anim-float` (600ms) — **does not shift layout**
- "React again" affordance: small text or chevron `→` in `--color-accent`, 11px — tapping anywhere on the zone while in result phase resets to Phase 1 (clears slots)
- Transition into: crossfade from Phase 3 over `--anim-react` (180ms) ease-out

### Phase 4b — Result: New discovery

```
┌────────────────────────────────────────────────┐
│  ✦ NEW DISCOVERY                               │
│  [🔥 icon 48px — expands from center]          │
│  Steam                                         │
│  "Water and fire meet — something vaporizes."  │  ← witty one-liner
│  [🔗 Share]   [Continue →]                     │
└────────────────────────────────────────────────┘
```

- Background: crossfades to `rgba(74,240,192,0.04)`
- Border: `1px solid --color-border-hot`
- Box-shadow: `0 0 24px --color-accent-dim` (larger glow than ready state)
- Screen-edge flash: a `position: fixed; inset: 0; pointer-events: none` overlay briefly flashes `rgba(74,240,192,0.08)` — appears over 80ms, disappears over 160ms total. Applies to the whole viewport, not just the zone.
- "✦ NEW DISCOVERY" badge: `--text-micro` (11px), Space Mono, `--color-gold`, uppercase, letter-spacing 2px
- Icon entrance: scales `0.1 → 1.0` with spring `cubic-bezier(0.34,1.56,0.64,1)` over `--anim-discovery` (400ms) — Monument Valley spatial feedback principle
- Name: `--text-body` (13px), weight 700, `--color-accent`
- One-liner: `--text-caption` (11px), `--color-text-secondary`, max 2 lines
- Score float: `+100` (or score value) — same float animation as Phase 4a, but larger font (16px bold) and `--color-gold`
- Share button: see §4.1 below
- "Continue →" affordance: tapping the zone clears and returns to Phase 1
- Transition into: Phase 3 → 4b: icon pops in (spring), badge fades in (180ms), screen-edge flash fires once

### Phase 4c — Result: No reaction (silent failure)

- No text error message (audit fix P1 item 9 / Little Alchemy 2 pattern: silent failure)
- No border color change
- The zone returns to Phase 1 (idle) immediately
- Slots return to empty state — both contents scale-out (`1.0 → 0.7, opacity 0`) over `--anim-settle` (320ms) simultaneously
- Particle effect: a brief "dissolve" scatter — 6–8 small particles (~4px each) in `--color-border-mid` emanate from the slot area and fade over 400ms. This provides physical feedback without being a punishment visual.
- No sound effect other than a subtle "puff" (existing sound design decision)
- No "tip" text (audit fix P3 item 24 — "Think about natural phenomena" removed)

### 4.1 Share Button (within Phase 4b)

- Visual size: `auto × 36px` (smaller than primary CTA — secondary action)
- Hit area: **44px tall minimum** (use 4px top/bottom padding compensation)
- Padding: `0 16px`
- Background: transparent
- Border: `1px solid --color-border-active`
- Border-radius: `--radius-md` (8px)
- Label: `🔗 Share`, `--text-caption` (11px), `--color-text-muted`

**States:**

| State | Border | Text color |
|---|---|---|
| Default | `--color-border-active` | `--color-text-muted` |
| Hover | `--color-border-hot` | `--color-accent` |
| Active | `--color-border-hot` | `--color-accent` |
| Copied / shared | `--color-accent` (solid) | `--color-accent` |

Copied state: label changes to `✓ Copied`, reverts to `🔗 Share` after 2000ms.

---

## 5. Utility Row

### 5.1 Container

- Height: **44px** fixed (fits minimum screen budget)
- Width: `100%`, max-width: `320px`
- `display: flex`, `align-items: center`, `gap: 8px`
- `flex-shrink: 0`

On screens < 340px right-panel width: Utility row switches to `justify-content: center` and DailyChallenge hides its text labels (icon-only mode), reducing its min-width.

### 5.2 HintButton

- `flex: 1`
- Height: **44px** (touch compliant — audit fix P1 item 4 cascade)
- Min-width: 88px
- Border: `1px solid --color-border-mid`
- Background: `--color-bg-surface`
- Border-radius: `--radius-md` (8px)
- Font: `--text-caption` (11px), Space Mono

**States:**

| State | Label | Border | Text |
|---|---|---|---|
| Available | `💡 Hint (N)` | `--color-border-mid` | `--color-text-secondary` |
| Hover | `💡 Hint (N)` | `--color-border-active` | `--color-accent` |
| Cooling down | `⏱ Ns` | `--color-border-subtle` | `--color-text-muted` |
| No hints left | `No hints` | `--color-border-subtle` | `--color-text-muted`, opacity: 0.5 |
| Disabled | any of above | same | opacity: 0.5, cursor: not-allowed |

**Hint count `(N)`:** displayed inline in the button label when balance > 0.
"No hints left" state: label shrinks to icon-only `💡` if width is constrained.

### 5.3 Hint Overlay (popover)

**Position fix (audit P2 item 19):**
- Default anchor: `bottom: calc(100% + 8px)`, `left: 50%`, `transform: translateX(-50%)`
- Viewport boundary check: if the overlay would extend above `top: 8px` of the viewport, flip to `top: calc(100% + 8px)` instead (below the button)
- Max-width: `min(240px, calc(100vw - 32px))`

### 5.4 DailyChallenge

- `flex: 1`
- Height: **44px**
- Min-width: 88px
- Border: `1px solid --color-border-subtle`
- Background: `--color-bg-surface`
- Border-radius: `--radius-md` (8px)
- Padding: `0 12px`
- Layout: `flex-direction: row`, `align-items: center`, `gap: 8px`

**Complete state:** border `rgba(232,184,75,0.5)`, background `rgba(232,184,75,0.04)`, text `--color-gold`

---

## 6. Score Float Layer

A single shared layer for all floating reward numbers (not component-scoped — applies globally over the Mixing Chamber):

- Position: `absolute` within the Mixing Chamber container
- `pointer-events: none`
- `z-index: 20`
- Each float: a `<span>` with absolute position set to the Y coordinate of the Unified Action Zone top, centered X
- Animation: `translateY(0) → translateY(-28px)`, `opacity: 1 → 0`, over `--anim-float` (600ms), easing `ease-out`
- Font: `--text-label` (12px) for known reactions, 16px bold for new discoveries
- Color: `--color-text-secondary` for known (`+10`), `--color-gold` for new (`+100`)
- Multiple floats queue with 120ms stagger (combo scenario)

---

## 7. Animation Summary Table

| Interaction | Component | Duration | Easing | Property |
|---|---|---|---|---|
| Tap element card | ElementCard | 0ms down, 100ms up | ease-out | scale |
| Card selection (slot fills) | ElementCard | 100ms | ease-out | border, background, shadow |
| Slot fill appearance | Slot | 180ms | ease-out | scale (icon), opacity |
| Slot ready glow | Slot + Action Zone | 1200ms ∞ | ease-in-out | box-shadow |
| Slot clear (contents out) | Slot | 320ms | spring | scale, opacity |
| Phase 1→2 (idle→ready) | Action Zone | 180ms | ease-out | background, border, shadow |
| Phase 2 tap-down | Action Zone | 0ms | — | scale 0.98 |
| Phase 2 tap-release | Action Zone | 100ms | spring | scale 1.0 |
| Phase 2→3 (reacting) | Action Zone | 180ms | ease-out | shimmer sweep |
| Phase 3→4a (known result) | Action Zone | 180ms | ease-out | content crossfade |
| Phase 3→4b icon pop (new) | Action Zone | 400ms | spring | scale |
| Phase 3→4b screen flash | Viewport | 80ms in, 160ms total | ease-out | opacity overlay |
| Phase 4c (no reaction) | Slots + particles | 320ms | ease-out | scale, opacity, particles |
| Score float | Float layer | 600ms | ease-out | translateY, opacity |
| Tab switch | FilterBar | 100ms | ease-out | border, background, color |
| Filter tab swipe | ElementGrid | 200ms | ease-out | translateX (content slides) |
| Long-press progress | ElementCard | 500ms | linear | progress fill on icon |
| Detail card appear | ElementDetail | 180ms | ease-out | scale, opacity |
| Hint overlay appear | HintButton | 200ms | spring | translateY, opacity |
| Drag lift | ElementCard | 100ms | ease-out | scale 1.05, shadow |
| Drag-over slot | Slot | 100ms | ease-out | scale 1.04, border |

---

## 8. Error Handling UI

### 8.1 No reaction exists (invalid combination)

**What does NOT happen:**
- No red text "No reaction found"
- No error border on the Action Zone
- No buzz/error sound
- No "tip" text
- No counter or penalty

**What DOES happen:**
- Phase 4c sequence as described in §4 (slots clear silently, particle dissolve)
- Action Zone returns to Phase 1 (idle instruction text)
- Particle dissolve is the only indication — it reads as "the experiment didn't work, try again"

**Rationale:** Little Alchemy 2 silent failure model. Experimentation must be risk-free. Punishment interrupts the exploration loop.

### 8.2 React button tapped with one or zero slots filled

This state does not exist in the new design. The Unified Action Zone is **not interactive** in Phase 1 (idle) or when only one slot is filled. There is no button to mis-tap. The zone simply displays instructional text.

If a user attempts to tap the Phase 1 zone anyway (because it looks tappable):
- No response at all — the zone does not scale, animate, or show an error
- `pointer-events: none` in Phase 1 ensures this

### 8.3 Drag released outside a valid slot

- The dragged element card returns to its origin with a spring animation: `translate(0,0)` over `--anim-settle` (320ms) spring easing
- No error message
- The card remains in its previous state (selected if it was in a slot, default if it wasn't)

### 8.4 Both slots filled with the same element

- This is a valid state — two of the same element is a legal input for some reactions
- No warning
- If the reaction doesn't exist, Phase 4c fires as normal

### 8.5 Hint system — no hints remaining

- HintButton displays "No hints" label with opacity 0.5
- Button is `disabled` (not interactive)
- No error on tap (taps are blocked by `disabled`)
- The IAP "Watch ad" button may appear below it (native only, existing logic unchanged)

### 8.6 Save/load failure (storage unavailable)

- Out of scope for this spec (handled by storage.ts)
- If triggered, a separate non-blocking toast appears from the BottomBar level, not from within the Shelf or Chamber

---

## 9. Empty State Index

| Component | Condition | Treatment |
|---|---|---|
| ElementGrid "Found" tab | Zero discoveries | Centered icon + message (§2.5) |
| ElementGrid "All" tab | Never empty | No state needed |
| Slot A | Nothing selected | Dashed border + `+` placeholder (§3.3) |
| Slot B | Nothing selected | Same as Slot A |
| Action Zone | Idle (0–1 slots) | Phase 1: instructional text (§4, Phase 1) |
| Action Zone | After failed reaction | Phase 1: returns to instructional text |
| HintButton | No hints left | Disabled state with "No hints" label |
| DailyChallenge | No target element | `—` dash in target-element position |
| Score float layer | No reaction fired | Layer renders nothing (no height/space consumed) |

---

## 10. Accessibility Requirements

- All interactive elements: `--anim-instant` tap highlight (0ms — no delay before visual feedback)
- All interactive elements: `:focus-visible` outline — `2px solid --color-accent`, `outline-offset: 2px`
- No `:focus` style when using touch/mouse (`:focus:not(:focus-visible)` → outline: none)
- Minimum contrast for readable text: WCAG AA (4.5:1 for normal text, 3:1 for large text)
  - `--color-text-secondary` (#8ab4d4) on `--color-bg-surface` (#0a1520) = **4.6:1 ✓**
  - `--color-text-muted` (#4a6080) on `--color-bg-surface` (#0a1520) = **2.8:1 ✗** — use only for decorative or non-essential text
  - `--color-accent` (#4af0c0) on `--color-bg-surface` (#0a1520) = **8.1:1 ✓**
- `aria-label` on all icon-only buttons (slot clear, share, hint dismiss)
- Slots: `role="button"` with `aria-label="Slot A: [element name or empty]"`
- Action Zone Phase 2: `role="button"`, `aria-label="React: [element A] and [element B]"`
- Phase 4b result: `role="status"` with `aria-live="polite"` — screen reader announces discovery
- Element cards: `aria-pressed="true"` when selected (in a slot)
- Reduce-motion: all animations except tap highlight and phase transitions collapse to instant crossfades when `prefers-reduced-motion: reduce`
