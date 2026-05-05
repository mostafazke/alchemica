# Phase 23: Navigation Architecture - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-05
**Phase:** 23-Navigation Architecture
**Areas discussed:** Stranded features, TopBar redesign, Settings screen, Daily challenge card

---

## Stranded Features (DiscoveryLog + AchievementGallery)

| Option | Description | Selected |
|--------|-------------|----------|
| Buttons that open overlays | Main menu has Discoveries + Badges buttons; tapping opens BottomSheet overlays (same pattern as today's BottomBar) | ✓ |
| Inline sections on menu | Scrollable sections directly on main menu page — no overlay needed | |

**User's choice:** Buttons that open overlays
**Notes:** Preserves the existing BottomSheet + component pattern. No new components needed.

---

## TopBar Redesign

**User's choice (free text):** "From topbar remove the reset button and the game title, pause button to the left, score and similar info to the right."

**Resolved to:**
- Remove: game title ("⚗️ Alchemica"), reset button
- Add: pause button (left) — navigates to main menu
- Keep right side: discovered count, combo badge, score

---

## Settings Screen

**User's choice (free text):** "Settings should be route and appear as an overlay over the main menu."

**Resolved to:** New `/settings` SvelteKit route using existing view-transition mechanism (onNavigate + startViewTransition in layout). Logic extracted from SettingsPanel.svelte. SettingsPanel.svelte deleted as dead code.

---

## Daily Challenge Card

**User's choice (free text):** "Daily challenge make it simple for now."

**Resolved to:** Two-state display only — "✓ Completed today" vs "⚗ [Element Name] available". Reads from existing `dailyCompleted` and `dailyChallengeTarget` stores. No live countdown, no setInterval.

---

## Agent's Discretion

- Back button styling/label for settings route
- Whether IAP section is included in settings route or omitted
- Main menu button layout/ordering

## Deferred Ideas

- Live countdown timer on daily card (NAV-04 mentions it; deferred to future polish phase)
- High score display on main menu (NAV-05 mentions it; agent may add if trivial)
