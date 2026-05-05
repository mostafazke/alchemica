# Requirements: Alchemica v7

**Defined:** 2026-05-03
**Milestone:** v7 — UI/UX Overhaul
**Core Value:** Every interaction feels polished, responsive, and accessible — the UI matches the quality of the game logic.
**Updated:** 2026-05-05 — Expanded with 4 experience-layer improvements (SIL-01, DRG-01, DRG-02, HMR-01) based on UI-PATTERNS-RESEARCH.md

**Reference artifacts:**
- `UX-AUDIT.md` — 28 prioritized issues (source of truth for issue numbers)
- `UI-SPEC-SHELF-CHAMBER.md` — detailed measurements and states
- `UI-PATTERNS-RESEARCH.md` — Little Alchemy 2, Duolingo, Monument Valley patterns
- `DESIGN_SYSTEM.md` — design tokens

---

## v7 Requirements

### Critical Safety (P0)

- [ ] **SAFE-01**: Reset button shows a confirmation dialog before destroying progress (audit P0 #1)
- [ ] **SAFE-02**: DiscoveryLog is accessible on all screen sizes — not hidden by `display: none !important` on desktop (audit P0 #2)
- [ ] **SAFE-03**: Viewport meta allows pinch-to-zoom — `user-scalable=no` removed (audit P0 #3, WCAG 1.4.4)

### Touch Target Compliance (P1)

- [ ] **TOUCH-01**: Slot clear button has 44×44px minimum hit area (audit P1 #4)
- [ ] **TOUCH-02**: Result share button has 44×44px minimum hit area (audit P1 #5)
- [ ] **TOUCH-03**: DiscoveryItem share button has 44×44px minimum hit area (audit P1 #6)
- [ ] **TOUCH-04**: ElementDetail close button has 44×44px minimum hit area (audit P1 #7)
- [ ] **TOUCH-05**: Filter tab buttons have 44px minimum height (audit P1 #8)

### Design Token System

- [ ] **TOKEN-01**: CSS custom properties defined for spacing (4px base), colors, typography, radius, and animation timing per DESIGN_SYSTEM.md and UI-SPEC §1
- [ ] **TOKEN-02**: All components use design tokens instead of hardcoded values — no magic numbers in component styles

### Element Shelf Rebuild

- [ ] **SHELF-01**: Filter tab bar is 44px height with proper states (default, hover, active, focus-visible) and count badges per UI-SPEC §2.2
- [ ] **SHELF-02**: Element grid uses `repeat(auto-fill, minmax(76px, 1fr))` with 6px gap, scrollable, per UI-SPEC §2.3
- [ ] **SHELF-03**: Element cards are 76×76px with icon (32px), name (11px min), and all interaction states (default, hover, tap, selected, drag-lifted, long-press, focus-visible) per UI-SPEC §2.4
- [ ] **SHELF-04**: Long-press affordance is visible on element cards (subtle dot indicator) per UI-SPEC §2.4
- [ ] **SHELF-05**: "Found" tab shows empty state message when zero discoveries per UI-SPEC §2.5
- [ ] **SHELF-06**: Third-tap behavior replaces Slot A content (not error) when both slots full per UI-SPEC §2.4

### Mixing Chamber Rebuild

- [ ] **CHAMBER-01**: Slots are 80×80px with dashed empty state, filled state with 36px icon, and ready-state breathe animation per UI-SPEC §3.2–3.4
- [ ] **CHAMBER-02**: Unified action zone shows React CTA or Result display in the same space (Duolingo dual-purpose bottom bar pattern) per UI-SPEC §3.1
- [ ] **CHAMBER-03**: Utility row (HintButton + DailyChallenge) fits within 44px height, collapses to icon-only on very small screens per UI-SPEC §3.1
- [ ] **CHAMBER-04**: Drag-over state on slots shows solid accent border and subtle scale (1.04) per UI-SPEC §3.3

### Interaction States

- [ ] **STATE-01**: All interactive elements have `:focus-visible` styles with `2px solid --color-accent` outline (audit P2 #17)
- [ ] **STATE-02**: Selected element cards show teal border + selected background + glow per UI-SPEC §2.4 states table
- [ ] **STATE-03**: React button transitions from disabled (gray) to ready (accent glow) when both slots filled (Duolingo pattern)

### Accessibility & Typography

- [ ] **A11Y-01**: No font size below 11px anywhere in the app — all 9px/10px instances replaced (audit P1 #11)
- [ ] **A11Y-02**: Idle state instruction text has WCAG AA contrast ratio (4.5:1 minimum) — not `#2a3550` on `#0a1520` (audit P1 #10)
- [ ] **A11Y-03**: Reset button has destructive styling (danger color, warning affordance) (audit P2 #14)

### Interaction Enhancements

- [ ] **SIL-01**: Undiscovered elements render as locked silhouettes in the element grid — 76×76px cell, dark icon at 0.3 opacity, '?' name, non-interactive (`pointer-events: none`). Creates a discoverable-but-mysterious spatial progress indicator (Monument Valley curiosity-pull pattern)
- [ ] **DRG-01**: Element cards support drag initiation — HTML5 `draggable` attribute and pointer event fallback for touch. Card shows drag-lifted state (scale 1.05, elevated shadow) during drag per UI-SPEC §2.4 states table
- [ ] **DRG-02**: Slots accept element card drops — `dragover` + `drop` event handlers fill the target slot. Slot shows drag-over state during hover (CHAMBER-04 visual already planned) per UI-SPEC §3.3

### Content & Humor

- [ ] **HMR-01**: All 57 discoverable elements have a witty one-liner caption string in `elements.ts` (`oneliner?: string` field). New discovery result (Phase 4b) displays the caption below the element name (Little Alchemy 2 humor pattern)

### Feedback & Polish

- [ ] **FEED-01**: Score points float upward and fade out over 600ms on discovery (Duolingo XP float pattern) per UI-SPEC §1.6
- [ ] **FEED-02**: New discovery triggers a brief screen-edge flash or icon expand animation (400ms) per UI-SPEC §1.6
- [ ] **FEED-03**: AchievementToast has exit animation (fade/slide out) instead of abrupt disappear (audit P3 #21)
- [ ] **FEED-04**: Combo badge does not clip on React button overflow (audit P2 #13)
- [ ] **FEED-05**: BottomBar toggle buttons change label to "Close" or show × when panel is open (audit P3 #25)

---

## Future Requirements (Deferred from v7)

### Polish (not blocking ship)
- **FEED-06**: Swipe-between-tabs gesture on element grid (audit P3 #26)
- **FEED-07**: Swipe-down to dismiss BottomSheet (audit P2 #12)
- **FEED-08**: Element text search in grid (audit P3 #23)
- **FEED-09**: OfflineIndicator respects safe-area-inset-bottom (audit P2 #18)
- **FEED-10**: Discovery badge shows unread count, not total (audit P3 #22)
- **FEED-11**: Better fail tip copy or silent failure (audit P3 #24)
- **FEED-12**: Onboarding/first-run instruction (audit P1 #9) — significant UX work, separate milestone
- **FEED-13**: Hint overlay viewport boundary check (audit P2 #19)
- **FEED-14**: Emoji consistency (⚗ vs ⚗️) (audit P3 #27)

---

## Out of Scope (v7)

- Gameplay logic changes — game engine is complete and stable
- New elements or reactions — content is frozen
- Backend/cloud features — stays fully offline
- iOS-specific UI — platform parity handled in v6
- New features (search, onboarding wizard) — separate milestone

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| SAFE-01 | Phase 19 | Pending |
| SAFE-02 | Phase 19 | Pending |
| SAFE-03 | Phase 19 | Pending |
| TOUCH-01 | Phase 19 | Pending |
| TOUCH-02 | Phase 19 | Pending |
| TOUCH-03 | Phase 19 | Pending |
| TOUCH-04 | Phase 19 | Pending |
| TOUCH-05 | Phase 19 | Pending |
| TOKEN-01 | Phase 19 | Pending |
| TOKEN-02 | Phase 19 | Pending |
| SHELF-01 | Phase 20 | Pending |
| SHELF-02 | Phase 20 | Pending |
| SHELF-03 | Phase 20 | Pending |
| SHELF-04 | Phase 20 | Pending |
| SHELF-05 | Phase 20 | Pending |
| SHELF-06 | Phase 20 | Pending |
| SIL-01 | Phase 20 | Pending |
| DRG-01 | Phase 20 | Pending |
| CHAMBER-01 | Phase 21 | Pending |
| CHAMBER-02 | Phase 21 | Pending |
| CHAMBER-03 | Phase 21 | Pending |
| CHAMBER-04 | Phase 21 | Pending |
| STATE-01 | Phase 19 | Pending |
| STATE-02 | Phase 20 | Pending |
| DRG-02 | Phase 21 | Pending |
| STATE-03 | Phase 21 | Pending |
| A11Y-01 | Phase 19 | Pending |
| A11Y-02 | Phase 19 | Pending |
| A11Y-03 | Phase 19 | Pending |
| FEED-01 | Phase 22 | Pending |
| FEED-02 | Phase 22 | Pending |
| FEED-03 | Phase 22 | Pending |
| FEED-04 | Phase 22 | Pending |
| FEED-05 | Phase 22 | Pending |
| HMR-01 | Phase 22 | Pending |

**Coverage: 35 v7 requirements mapped. No orphans.**

---

## Archive

- v1 requirements (27 req) → [milestones/v1-REQUIREMENTS.md](milestones/v1-REQUIREMENTS.md)
- v2 requirements (21 req) → [milestones/v2-REQUIREMENTS.md](milestones/v2-REQUIREMENTS.md)
- v3 requirements (11 req) → [milestones/v3-REQUIREMENTS.md](milestones/v3-REQUIREMENTS.md)
- v4 requirements (2 req) — MENU-01, MENU-05
- v5 requirements (3 req) — UX-01, UX-02, UX-03
- v6 requirements (7 req) — PLAY-01 ✅, PLAY-02 ✅, IOS-01–IOS-05 pending
