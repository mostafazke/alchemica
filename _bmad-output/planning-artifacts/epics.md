---
stepsCompleted: [1, 2]
inputDocuments:
  - _bmad-output/planning-artifacts/ux-design-specification.md
  - _bmad-output/planning-artifacts/architecture.md
  - _bmad-output/planning-artifacts/DECISIONS.md
  - copilot_CODE_BRIEF.md
  - VISUAL_PHILOSOPHY.md
project_name: Alchemica
date: '2026-05-09'
milestone: Phase 1 Visual Redesign
previous_milestone: Alchemica Excellence v1
---

# Alchemica — Epic Breakdown (Phase 1 Visual Redesign)

## Overview

This document decomposes the Phase 1 Visual Redesign into implementable epics and stories. The redesign transforms Alchemica from a navy-cold submarine control room into a warm-stone ancient workshop, implementing the material language (dark brass, apothecary glass, warm stone) and emotional design system described in the UX Design Specification and Visual Philosophy.

**Milestone:** Phase 1 Visual Redesign
**Source documents:** UX Design Specification, Architecture, Code Brief, Visual Philosophy, DECISIONS.md
**Previous milestone:** Alchemica Excellence v1 (complete)

---

## Requirements Inventory

### Functional Requirements

FR1: Implement three-layer CSS token architecture (raw → semantic → component) replacing all hardcoded hex values
FR2: Migrate background palette from navy-cold (#0d1b2e) to stone-warm (#0a0805) across all surfaces
FR3: Migrate accent color from teal (#4af0c0) to warm gold (#d4a84a) globally
FR4: Migrate text colors from cool parchment (#c8d8e8) to warm parchment (#d8cbb8)
FR5: Implement material tokens (brass-highlight, brass-shadow, glass-clear, glass-amber, stone-warm)
FR6: Implement energy state tokens (settled, fresh, power) for ElementCard visual states
FR7: Rewrite ElementCard with 6 visual states (default, hover, selected, fresh, settled, power)
FR8: Create MixingSlot component replacing Slot.svelte with 4 states (empty, filled, ready, reacting)
FR9: Create ActionZone component replacing ResultDisplay.svelte with 4 states (idle, discovery, known, failure)
FR10: Create ShelfGrid component replacing ElementGrid.svelte with CSS Grid and vertical scroll
FR11: Create FilterTabs component with 44px touch targets and category count badges
FR12: Rewrite TopBar with warm materials, discovery count primary, score secondary, compact mode
FR13: Create BottomBar component with 4 tabs extracted from route layout, compact mode
FR14: Rewrite DiscoveryOverlay with 1.2s development animation (scale 0.1→1.0, spring curve)
FR15: Implement discovery animation sequence: overlay → badge → emoji scale → silence → sound → name → continue
FR16: Implement failure animation: gentle drift-back (320ms), single rising particle, "Not yet" copy
FR17: Implement known-element result: inline ActionZone display, "+N pts" float animation (600ms)
FR18: Implement slot fill animation: scale 0.6→1.0 (180ms), opacity 0→1, glass-clink sound
FR19: Implement auto-react sequence: breathe animation → settle delay 180ms → world contracts → radial shimmer
FR20: Create frequency state store (`alchemica_frequency` in localStorage) with write-through persistence
FR21: Create threshold constants file for energy state boundaries (FRESH_MAX, SETTLED_MIN)
FR22: Implement AnimationController service wrapping canvas particle system with named methods
FR23: Mount single overlay canvas covering full game area (pointer-events: none, z-index 30)
FR24: Refactor MixingChamber as layout shell connecting ShelfGrid + Chamber + Canvas
FR25: Implement font loading for Space Mono (Google Fonts CDN, display=swap, preconnect)
FR26: Implement ghost/outlined button style system (no filled/solid backgrounds)
FR27: Update PWA manifest theme_color and background_color from #0d1b2e to #0a0805

### Non-Functional Requirements

NFR1: All interactive elements ≥ 44×44px touch targets (Apple HIG / WCAG 2.5.5)
NFR2: All text ≥ 11px minimum size
NFR3: Text contrast WCAG AA: primary text ≥ 11:1, secondary ≥ 5.5:1, muted ≥ 3:1 (decorative only)
NFR4: prefers-reduced-motion respected — disable scale/slide/particle, keep opacity fades
NFR5: Focus-visible indicators on all interactive elements (2px accent outline, 2px offset)
NFR6: ARIA roles and labels on all interactive components (role="button", aria-label, aria-pressed, aria-live)
NFR7: Every tap produces visible feedback within 50ms
NFR8: 60fps animation on supported devices
NFR9: Canvas particle system with object pooling (max 120 particles), hardware concurrency scaling
NFR10: No layout shift during any animation or state change
NFR11: Landscape-locked, fluid scaling via clamp(), no media query breakpoints
NFR12: 216px minimum game area height (iPhone SE) compatibility
NFR13: Compact mode at viewport height < 350px (TopBar hides score, BottomBar icon-only)

### Additional Requirements (Architecture)

AR1: New components created alongside old — parallel creation, not rename (Decision D-07)
AR2: Old components deleted only in cleanup commit after Phase 1 passes visual QA
AR3: Frequency store separate from game save (Decision D-02) — cosmetic data, not game state
AR4: AnimationController accessed via Svelte context (setContext/getContext), not module import (Decision D-11)
AR5: No GSAP dependency — Web Animations API + CSS transitions cover all contracts (Decision D-05)
AR6: Tailwind CSS stays in build, not used for game UI (Decision D-13)
AR7: Routes switch imports from old to new components only after new components pass QA

### UX Design Requirements

UX-DR1: Implement "ancient workshop" material language — brass, glass, stone surfaces across all UI elements
UX-DR2: No red for failure anywhere — failed combinations use "Not yet" language, gentle animations, single particle
UX-DR3: No tutorial modals — first-session hints are contextual pulses that dissolve after first use
UX-DR4: No filled/solid background buttons — all buttons ghost or outlined on warm stone surface
UX-DR5: Discovery animation conveys emergence, not delivery — element fights to exist through resistance
UX-DR6: Shelf becomes player portrait — visual frequency states make each player's shelf unique
UX-DR7: Power elements create environmental stillness, not decoration — barely perceptible glow
UX-DR8: Silence-then-sound timing in discovery sequence — 200ms gap before sound plays
UX-DR9: Failure copy uses "Not yet" / "These aren't ready for each other" — never "No Reaction"
UX-DR10: Score is secondary to discovery count in TopBar hierarchy
UX-DR11: Category tabs emerge as elements are discovered — never show empty categories
UX-DR12: Element detail popover on long-press (>500ms) showing metadata
UX-DR13: Scrollbar styling matches warm stone palette (track: bg-deep, thumb: border-mid)
UX-DR14: View Transitions API for BottomBar tab switches with horizontal slide

### FR Coverage Map

| FR | Epic | Story |
|----|------|-------|
| FR1–FR6, FR25–FR27 | Epic 1 | 1.1 |
| FR1–FR6 (verification) | Epic 1 | 1.2 |
| FR7, FR20, FR21 | Epic 2 | 2.1 |
| FR8, FR18 | Epic 2 | 2.2 |
| FR9, FR16, FR17 | Epic 2 | 2.3 |
| FR10, FR11 | Epic 2 | 2.4 |
| FR12 | Epic 2 | 2.5 |
| FR13 | Epic 2 | 2.6 |
| FR22, FR23 | Epic 3 | 3.1 |
| FR14, FR15, FR19 | Epic 3 | 3.2 |
| FR24 | Epic 3 | 3.3 |

---

## Epic List

| Epic | Title | Goal | Stories |
|------|-------|------|---------|
| Epic 1 | Design Foundation | Token architecture + palette migration — everything else builds on this | 2 stories |
| Epic 2 | Core Components | The six Phase 1 components + frequency system | 6 stories |
| Epic 3 | Animation & Integration | Canvas overlay, animation sequences, MixingChamber integration | 3 stories |

---

## Epic 1: Design Foundation

**Goal:** Establish the three-layer CSS token architecture and migrate the entire palette from navy-cold to stone-warm. After this epic, every component in the app renders against the new warm background with correct text contrast, accent colors, and material tokens available. No component rewrites — just the foundation they'll build on.

### Story 1.1: Token Architecture & Palette Migration

As a developer,
I want the three-layer CSS token system (raw → semantic → component) defined in app.css with the warm stone palette replacing all hardcoded navy values,
So that all subsequent component work uses consistent, overridable design tokens.

**Acceptance Criteria:**

**Given** the current app.css has hardcoded hex values (#0d1b2e, #c8d8e8, #4af0c0, etc.)
**When** I replace them with the three-layer token architecture from Architecture §4
**Then** Layer 1 (raw values) defines ~15 primitive color variables
**And** Layer 2 (semantic tokens) maps raw values to UI roles (bg-deep, bg-surface, border-subtle, accent, text-primary, etc.)
**And** all existing hardcoded hex values in app.css are replaced with semantic token references
**And** the background shifts from #0d1b2e to var(--color-bg-deep) (#0a0805)
**And** the accent shifts from #4af0c0 to var(--color-accent) (#d4a84a)
**And** text color shifts from #c8d8e8 to var(--color-text-primary) (#d8cbb8)

**Given** material tokens don't exist yet
**When** I add them to Layer 2
**Then** --material-brass-highlight, --material-brass-shadow, --material-glass-clear, --material-glass-amber, --material-stone-warm are defined per Code Brief

**Given** energy state tokens don't exist yet
**When** I add them to Layer 2
**Then** --energy-settled (opacity 0.85), --energy-fresh (amber glass box-shadow), --energy-power (barely visible 3px glow) are defined per Code Brief

**Given** the font loading needs Space Mono
**When** I add preconnect + preload links to app.html
**Then** Space Mono 400/700 loads from Google Fonts CDN with display=swap
**And** font-family declarations use the fallback stack: 'Space Mono', ui-monospace, 'Cascadia Code', 'Fira Code', monospace

**Given** the PWA manifest has navy colors
**When** I update vite.config.ts
**Then** theme_color and background_color are both #0a0805

**Given** the :focus-visible outline is teal
**When** I update it
**Then** outline color uses var(--color-accent)

**Given** scrollbar styles use navy colors
**When** I update them
**Then** scrollbar track uses var(--color-bg-deep), thumb uses var(--color-border-mid)

**Given** prefers-reduced-motion is not globally handled
**When** I add the reduced motion media query block
**Then** a single block in app.css disables all transition-duration and animation-duration to 0.01ms
**And** opacity fades are preserved via a prefers-reduced-motion: no-preference block where needed

**Given** buttons currently may use filled backgrounds
**When** I add the ghost button base styles
**Then** a .btn-primary and .btn-ghost class use transparent backgrounds with border-only styling per Code Brief Law 2

### Story 1.2: Token Verification Pass

As a developer,
I want to verify every existing component renders correctly against the new token palette,
So that the palette migration doesn't break the current UI before component rewrites begin.

**Acceptance Criteria:**

**Given** Story 1.1 is complete and tokens are defined
**When** I audit every existing .svelte component in src/lib/components/
**Then** any remaining hardcoded hex values that reference the old navy palette are replaced with semantic tokens
**And** no component renders with the old navy background, teal accent, or cool-parchment text

**Given** the html,body styles in app.css use the new tokens
**When** I load the game on a mobile device
**Then** the background is warm stone (#0a0805), not navy (#0d1b2e)
**And** text is warm parchment, not cool parchment
**And** accent interactions (focus, selected states) use warm gold, not teal

**Given** WCAG AA contrast requirements
**When** I check text-on-background combinations
**Then** --color-text-primary on --color-bg-surface ≥ 11:1
**And** --color-text-secondary on --color-bg-surface ≥ 5.5:1
**And** --color-text-muted is used only on decorative/non-essential labels

---

## Epic 2: Core Components

**Goal:** Build the six Phase 1 components with all specified states, using the token foundation from Epic 1. Each component is created alongside its predecessor (parallel creation strategy). After this epic, all Phase 1 components exist and render correctly in isolation.

### Story 2.1: ElementCard Rewrite + Frequency System

As a player,
I want each element card to visually reflect how much I've used it (settled vs. fresh vs. power),
So that my shelf becomes a portrait of my play history, not a flat catalogue.

**Acceptance Criteria:**

**Given** the frequency store doesn't exist yet
**When** I create src/lib/stores/frequency.ts per Architecture §3
**Then** it exports a writable store keyed by element name with integer counts
**And** it loads from localStorage key 'alchemica_frequency' on init
**And** it writes through to localStorage on every update
**And** it exports an incrementFrequency(elementKey) helper

**Given** threshold constants don't exist
**When** I create src/lib/config/thresholds.ts per Architecture §3
**Then** FRESH_MAX = 5 and SETTLED_MIN = 20 are exported as const

**Given** the existing ElementCard.svelte needs rewriting
**When** I rewrite it in place (not parallel — it keeps its filename)
**Then** it is 56×56px with 6px radius
**And** emoji is 20px centered, name is 11px --text-micro below
**And** it supports 6 states: default, hover, selected, fresh, settled, power
**And** it uses Layer 3 component tokens (--card-bg, --card-border, --card-glow)
**And** it derives its energy state via $derived from the frequency store value and threshold constants
**And** fresh state shows --energy-fresh amber glow box-shadow
**And** settled state shows --energy-settled opacity 0.85
**And** power state shows --energy-power barely-visible 3px glow
**And** selected state shows --color-border-hot border with --color-accent-dim shadow
**And** role="button", aria-label="{name}, {category}", aria-pressed for selected

### Story 2.2: MixingSlot Component

As a player,
I want the mixing slots to look and feel like glass vessels in the workshop,
So that filling a slot feels like placing an ingredient, not clicking a UI widget.

**Acceptance Criteria:**

**Given** Slot.svelte exists and must not be deleted yet
**When** I create MixingSlot.svelte alongside it
**Then** it is 56×56px with 8px radius
**And** it supports 4 states: empty (dashed --border-mid, "+" glyph), filled (solid --border-hot, --accent-dim bg, emoji), ready (filled + synchronized breathe CSS animation), reacting (scale pulse, shimmer)
**And** clear button (×) appears only when filled, with 44×44px hit area
**And** slot fill animation: scale 0.6→1.0 (180ms), opacity 0→1
**And** role="button", aria-label="Mixing slot {A|B}: {name or empty}"
**And** breathe animation respects prefers-reduced-motion

### Story 2.3: ActionZone Component

As a player,
I want the result area to transform in place (like Duolingo) with "Not yet" failure language,
So that results feel like the room responding, not a database reporting.

**Acceptance Criteria:**

**Given** ResultDisplay.svelte exists and must not be deleted yet
**When** I create ActionZone.svelte alongside it
**Then** it supports 4 states: idle ("Tap two elements to combine" italic --text-muted), discovery (emoji + "✦ NEW: {name}" + pts in --accent), known (emoji + name + recipe + pts in --text-primary), failure ("Not yet..." italic --text-secondary)
**And** state transitions happen in place with no layout shift
**And** "+N pts" floats upward via CSS @keyframes float-up over 600ms then fades
**And** failure state never uses red, never says "No Reaction"
**And** aria-live="assertive" for discoveries, aria-live="polite" for known results
**And** the component accepts a result prop and a state prop

### Story 2.4: ShelfGrid + FilterTabs Components

As a player,
I want to browse and filter my elements in a responsive grid with category tabs,
So that I can find elements quickly as my collection grows.

**Acceptance Criteria:**

**Given** ElementGrid.svelte exists and must not be deleted yet
**When** I create ShelfGrid.svelte alongside it
**Then** it uses CSS Grid: repeat(auto-fill, minmax(56px, 1fr)) with 4px gap
**And** it scrolls vertically within the shelf panel
**And** it renders ElementCard instances for each unlocked element

**Given** FilterTabs doesn't exist yet
**When** I create FilterTabs.svelte as a child of ShelfGrid
**Then** "All" tab is always first and always present
**And** category tabs appear only when elements in that category are discovered (UX-DR11)
**And** each tab shows a count badge of discovered elements in that category
**And** tabs are 44px minimum height (NFR1)
**And** role="tablist" with role="tab" children, aria-selected on active
**And** filtering is instant with opacity crossfade (150ms)

### Story 2.5: TopBar Rewrite

As a player,
I want the top bar to show my discovery progress prominently (not score-first),
So that I feel like an explorer tracking discoveries, not a score chaser.

**Acceptance Criteria:**

**Given** the existing TopBar.svelte needs rewriting
**When** I rewrite it in place
**Then** it is 52px height + safe-area-inset-top
**And** layout: Title | [discovered/total] badge | 🎯 daily challenge | Score
**And** discovery count is visually primary (larger, brighter), score is secondary
**And** warm stone background with brass-toned elements
**And** compact mode (viewport height < 350px): hide score, show element count only
**And** all text meets minimum 11px size

### Story 2.6: BottomBar Component

As a player,
I want persistent tab navigation at the bottom of the screen,
So that I can switch between Mix, Recipe, Achieve, and Settings views.

**Acceptance Criteria:**

**Given** the bottom navigation is currently inline in route layout
**When** I create BottomBar.svelte
**Then** it is 40px height + safe-area-inset-bottom
**And** 4 tabs: Mix ⚗️ | Recipe 📋 | Achieve 🏆 | Settings ⚙️
**And** active tab: accent icon + label, inactive: muted icon + muted label
**And** tab switch uses SvelteKit goto() with View Transitions API
**And** compact mode (viewport height < 350px): icon-only, no labels
**And** role="tablist", each tab role="tab", aria-selected
**And** all tabs ≥ 44px height touch target

---

## Epic 3: Animation & Integration

**Goal:** Wire up the single overlay canvas, implement all animation sequences from the Code Brief, integrate new components into MixingChamber, and switch route imports from old to new. After this epic, the full Phase 1 visual redesign is playable.

### Story 3.1: Canvas Overlay + AnimationController

As a developer,
I want a single canvas overlay covering the full game area with an AnimationController service,
So that all particle and effect animations run through one system without per-component canvas overhead.

**Acceptance Criteria:**

**Given** the existing particles.ts uses a per-chamber canvas
**When** I create src/lib/effects/animation-controller.ts
**Then** it exports an AnimationController class wrapping canvas particle logic
**And** it exposes named methods: successBurst(cx, cy), failureParticle(cx, cy), screenFlash(color, opacity), radialShimmer(cx, cy), stop()
**And** the existing pool logic (120 particles, hardware concurrency scaling) is preserved
**And** particle colors shift from teal/neon to warm gold/amber/brass palette
**And** visibility pause (stops RAF when tab hidden) is preserved

**Given** the canvas needs to cover the full game area
**When** I mount it in the game layout
**Then** it is position: absolute, inset: 0, pointer-events: none, z-index: 30
**And** it sits above game content but below DiscoveryOverlay (z-index 50)

**Given** other components need to call the controller
**When** I set it up via Svelte context (setContext/getContext) per Decision D-11
**Then** MixingChamber creates the controller on mount and provides it via context
**And** child components access it via getContext

### Story 3.2: Discovery, Failure & Reaction Animations

As a player,
I want the discovery moment to feel like emergence (not delivery), failure to feel like "not yet" (not rejection), and known results to feel efficient (not boring),
So that every outcome of the mixing loop has the right emotional weight.

**Acceptance Criteria:**

**Given** the DiscoveryOverlay exists and needs rewriting
**When** I rewrite it in place
**Then** overlay fades in (200ms) with backdrop rgba(0,0,0,0.85)
**And** "✦ NEW DISCOVERY" badge appears
**And** emoji scales 0.1→1.0 via Web Animations API with cubic-bezier(0.34, 1.56, 0.64, 1) over 1.2s
**And** 200ms silence gap (setTimeout delay before sound, per Decision D-12)
**And** sound plays after the gap
**And** name + formula fade in (300ms)
**And** "Continue →" ghost button fades in
**And** screen-edge flash via canvas AnimationController.screenFlash()
**And** focus trap active, role="dialog", aria-modal="true"
**And** prefers-reduced-motion: skip emoji scale, show final state immediately

**Given** a failed combination occurs
**When** the failure animation plays
**Then** elements drift back gently (320ms ease-out CSS transition)
**And** a single particle rises via AnimationController.failureParticle() — rises, slows, disappears
**And** ActionZone shows "Not yet" in --text-secondary italic
**And** no red anywhere, no error sound, no shake
**And** slots remain filled — player clears one to retry

**Given** both slots are filled (ready state)
**When** auto-react fires after 180ms
**Then** both slots show synchronized breathe animation
**And** world contracts (chamber container scale 0.97 via CSS transform)
**And** radial shimmer via AnimationController.radialShimmer()
**And** result sequence fires

**Given** a known-element reaction occurs
**When** the result displays
**Then** result appears inline in ActionZone (no overlay)
**And** "+N pts" CSS @keyframes float-up over 600ms, then fades
**And** no ceremony — efficient and clean

### Story 3.3: MixingChamber Integration & Route Switch

As a player,
I want to play the fully redesigned game with all new components wired together,
So that the warm workshop experience is complete end-to-end.

**Acceptance Criteria:**

**Given** all new components are built (Epic 2) and animations work (3.1, 3.2)
**When** I refactor MixingChamber.svelte as a layout shell
**Then** it imports and composes: ShelfGrid (left panel), MixingSlot ×2 + ActionZone (right panel)
**And** it mounts the single overlay canvas and creates the AnimationController
**And** it provides the AnimationController via Svelte context
**And** it wires MixingSlot fill/clear events to store updates
**And** it wires auto-react to the reaction engine and routes results to ActionZone
**And** it calls incrementFrequency() on both elements when a reaction fires

**Given** the game route currently imports old components
**When** I switch imports in game/+page.svelte from old to new
**Then** the game renders with the new component set
**And** all existing functionality works: element selection, reactions, discoveries, score, achievements

**Given** old components still exist alongside new ones
**When** the new components pass visual QA
**Then** a separate cleanup commit deletes: Slot.svelte, ResultDisplay.svelte, ElementGrid.svelte
**And** no other commit in this story deletes old files — cleanup is isolated

**Given** the game should work end-to-end
**When** I test the full mixing loop on a mobile viewport (375×667 landscape)
**Then** selecting two elements → auto-react → result displays correctly
**And** new discoveries show the full overlay animation sequence
**And** failures show drift-back + particle + "Not yet"
**And** known elements show inline result + score float
**And** the shelf reflects frequency states (fresh glow on new elements)
**And** TopBar shows updated discovery count
**And** BottomBar tab navigation works between all views

---

## Sprint Status

Sprint status tracking: see `_bmad-output/implementation-artifacts/sprint-status.yaml` (generated by sprint planning).
