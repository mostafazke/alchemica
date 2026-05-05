# Alchemica

## Current State

**Latest shipped:** v2 — 2026-05-02 (achievements, daily challenge, streak, 21/21 requirements)
**Previous:** v1 — 2026-05-02 (61 elements, offline PWA, 27/27 requirements)
**Repo:** https://github.com/mostafazke/alchemica
**Stack:** SvelteKit + Svelte 5 + TypeScript + Vite 8 + vite-plugin-pwa

## Current Milestone: v7 — UI/UX Overhaul

**Goal:** Fix all identified UX issues and rebuild the game UI to match the detailed UI spec — proper touch targets, design tokens, interaction states, and polished feedback inspired by Little Alchemy 2, Duolingo, and Monument Valley patterns.

**Target features:**
- Fix all P0 critical issues (reset confirmation, DiscoveryLog desktop access, viewport zoom)
- Fix all P1 touch target violations (slot clear, share buttons, filter tabs, detail close)
- Implement design token system (spacing, colors, typography, radius, animation)
- Rebuild Element Shelf per UI-SPEC (filter tabs, grid layout, card states, long-press affordance)
- Locked element silhouettes in grid (Monument Valley curiosity-pull — undiscovered shown as dark '?' tiles)
- Drag-to-slot interaction (HTML5 drag + touch pointer events; cards draggable onto slots)
- Rebuild Mixing Chamber per UI-SPEC (slots, unified action zone, utility row)
- Add missing interaction states (focus-visible, hover, selected, drag)
- Fix typography (11px minimum, consistent sizing)
- Fix idle state contrast (WCAG AA compliance)
- Add missing feedback patterns (result animations, score float, discovery flash)
- Witty one-liner captions on new discoveries (Little Alchemy 2 humor — `oneliner` field in elements.ts)

**Key constraints:**
- No gameplay logic changes — purely visual/interaction layer
- Must follow DESIGN_SYSTEM.md tokens and UI-SPEC-SHELF-CHAMBER.md measurements
- All fixes must work in landscape-only mode (Phase 14 constraint)
- 44×44px minimum touch targets (Apple HIG / WCAG 2.5.5)
- 11px minimum font size throughout
- No new dependencies — CSS-only where possible

**Reference artifacts:**
- `UX-AUDIT.md` — 28 prioritized issues (P0–P3)
- `UI-PATTERNS-RESEARCH.md` — Little Alchemy 2, Duolingo, Monument Valley patterns
- `UI-SPEC-SHELF-CHAMBER.md` — detailed implementation spec with measurements
- `DESIGN_SYSTEM.md` — design tokens

## Previous Milestone: v6 — Cross-Platform Ship (IN PROGRESS 2026-05-03)

<details>
<summary>v6 scope (Cross-Platform Ship — in progress)</summary>

**Goal:** Ship Alchemica on both Google Play and the Apple App Store with full feature parity.

**Shipped (Phase 15):**
- RevenueCat live, Google Play products active, store listing complete, AAB submitted

**Remaining (Phases 16–18):**
- Capacitor iOS platform, iOS plugin integration, App Store submission

</details>

## Previous Milestone: v5 — Landscape Game UX (COMPLETE 2026-05-03)

<details>
<summary>v5 scope (Landscape Game UX — complete)</summary>

**Goal:** Rewrite game screen as landscape-only with persistent element grid + mixing workspace.

**Shipped (Phase 14):**
- Element grid left panel (always-visible, scrollable, filter tabs inline)
- Mixing workspace right panel (slots, react, result, hint, daily utility row)
- TopBar + BottomBar simplification
- Portrait orientation overlay
- Deleted Shelf component

</details>

## Previous Milestone: v4 — Main Menu (COMPLETE 2026-05-03)

<details>
<summary>v3 scope (Revenue & Native — in progress)</summary>

**Goal:** Wrap Alchemica as a native Android app and turn v2 engagement into sustainable revenue.

**Shipped (Phases 9–11):**
- Capacitor 8 native Android wrapper, signed AAB, Google Play-ready
- Streak bonus — higher combo multiplier during active streak (STRK-05, STRK-06)
- AdMob rewarded ads — watch ad to earn 1 free hint (MOTZ-01, MOTZ-04)

**Remaining (Phase 12):**
- Remove-ads IAP (MOTZ-02), Hint bundle IAP (MOTZ-03), restore purchases (MOTZ-06), hide ads for purchasers (MOTZ-05)

</details>

## Previous Milestone: v2 — SHIPPED ✓

<details>
<summary>v2 scope (Achievements & Daily Hook — shipped 2026-05-02)</summary>

**Goal:** Give players a reason to come back every day — achievement milestones for long-term progress and a daily challenge with streak for daily habit.

**Shipped:**
- Discovery milestone badges (10, 25, 50, 61 discovered) — Apprentice / Alchemist / Sage / Grand Master
- TopBar "N/61 discovered" counter with gold pulse on milestone
- Achievement gallery (BottomBar 🏆 Badges button, 2×2 earned/locked grid)
- Achievement unlock toast (top-center, FIFO, 2.5s auto-dismiss)
- Achievement chime (iOS-safe Web Audio, mutable in Settings)
- Daily challenge (date-seeded, auto-completes, gold banner, persists)
- Streak counter (consecutive daily completions, persisted)
- v1→v2 save migration (backward-compatible, zero data loss, backfill)

Archive: [.planning/milestones/v2-ROADMAP.md](milestones/v2-ROADMAP.md)
</details>

---

## What This Is

Alchemica is a mobile-first element combination puzzle game (Little Alchemy-style) built as a PWA. Players discover new elements by combining two from a growing library, unlocking a chain of reactions across categories like fire, water, earth, metal, and energy. It is a public-facing game rebuilt from a single HTML prototype into a scalable Svelte + TypeScript application with offline support, persistent progress, and an expandable content system.

## Core Value

Players can open the game on any device, pick up where they left off, and feel the satisfaction of discovering a new element — even with no internet connection.

## Requirements

### Validated (v1 — SHIPPED) & (v2 — SHIPPED)

<details>
<summary>v1 validated (27 requirements)</summary>

- ✓ 32 elements with 2-element reaction system — existing prototype
- ✓ Canvas particle effects on reaction — existing prototype
- ✓ Score + combo system (100pts × combo new, 10pts × combo known, 8x max) — existing prototype
- ✓ Discovery log showing formula and recipe — existing prototype
- ✓ Element shelf with All / Basic / Found filter tabs — existing prototype
- ✓ Migrated to SvelteKit + Svelte 5 + TypeScript + Vite — Phase 1
- ✓ Responsive layout (mobile/tablet/desktop), 44px+ touch targets, bottom sheet — Phase 2
- ✓ Haptic feedback, long-press element detail, swipe tab switching — Phase 3
- ✓ localStorage save/load with versioned export/import — Phase 3
- ✓ 61 elements, category shelf, hint system (30s cooldown) — Phase 4
- ✓ Web Share API + clipboard fallback — Phase 4
- ✓ PWA: service worker, offline-capable, installable, manifest — Phase 5
</details>

<details>
<summary>v2 validated (21 requirements)</summary>

- ✓ ACHV-01–04: Discovery milestone badges (10 / 25 / 50 / 61 elements) — Phase 7
- ✓ ACHV-05–06: Achievement persistence + v1→v2 backfill — Phase 6
- ✓ PROG-01–06: TopBar counter, pulse, gallery, toast, chime (mutable) — Phases 6 + 8
- ✓ DALY-01–05: Daily challenge display, auto-complete, date-seeded, persisted, visual confirm — Phases 7 + 8
- ✓ STRK-01–04: Streak display, increment, reset, persist — Phases 6 + 7 + 8
</details>

### Active (v6 — Cross-Platform Ship)

- PLAY-01: Play Store submission is complete (signed AAB uploaded, listing live)
- IOS-01: Capacitor iOS platform added and builds successfully in Xcode
- IOS-02: App runs on a real iOS device via TestFlight
- IOS-03: AdMob rewarded ads work on iOS
- IOS-04: RevenueCat IAP (remove-ads + hint bundle) works on iOS via StoreKit
- IOS-05: App Store submission complete (screenshots, metadata, submitted for review)

### Previously Active (v4 — COMPLETE)

### Previously Active (v4 — COMPLETE)

- MENU-01: User sees a main menu screen on launch with game title, logo, and visual identity ✓
- MENU-05: Navigating to/from the game uses a smooth animated transition ✓

### Previously Active (v3 — COMPLETE)

- MOTZ-02: Remove-ads one-time IAP ($2.99–$4.99) ✓
- MOTZ-03: Hint bundle IAP — purchase 10 hints ✓
- MOTZ-05: Users who purchased remove-ads never see ads ✓
- MOTZ-06: User can restore previous purchases after reinstall ✓

### Out of Scope

- Android-only IAP in v3 — extended to iOS in v6 via RevenueCat
- iOS App Store distribution — was v3 out-of-scope; now in v6
- Backend / server-side storage — localStorage sufficient; cloud sync v7+
- Real-time multiplayer — requires backend + accounts; v7+
- In-app editor — JSON/TS config sufficient; editor v7+
- User accounts / leaderboards — v7+ requires cloud infrastructure
- Push notifications — v7+
- Cloud save — v7+ (requires accounts/backend)

## Context

- **Origin**: Single `alchemica.html` file (31KB) with inline CSS, HTML, and vanilla JS. Fully functional prototype. No build system, no modules, no save state.
- **Existing game data**: 32 elements across 8 categories (basic, fire, water, earth, air, metal, energy, gas, compound). ~45 two-element reactions. One 3-element reaction (Fire + Earth + Earth → Iron).
- **Known prototype issues**: Desktop-only 3-column grid (220px fixed sidebars), no viewport meta tag, no touch optimization, fonts loaded from Google CDN, no save system.
- **Tech decision**: Svelte 5 + TypeScript chosen over Vanilla JS (reactive stores replace manual DOM diffing), Flutter (web is primary target), and React Native (unnecessary bridge overhead).

## Constraints

- **Tech stack**: Svelte 5 + TypeScript + Vite — decided, not open for reconsideration
- **Distribution**: PWA only — no app store submission in v1
- **Bundle size**: Target <200KB gzipped total — this is a small game, not a framework showcase
- **Offline**: Must work fully offline after first load — no CDN dependencies in production build
- **Backwards compatibility**: Save format must be versioned to support future migrations

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Svelte 5 + TypeScript over Vanilla JS | Reactive stores replace manual DOM wiring; TS catches data shape errors early | — Pending |
| PWA over Capacitor | Fastest path to public release; no app store review; homescreen install satisfies mobile-first goal | — Pending |
| localStorage over IndexedDB | Save data is small (~5KB); synchronous API simpler for this scope | — Pending |
| Vanilla Canvas for particles | Particle system is simple burst effects; no game engine needed | — Pending |
| JSON/TS config file for content | Decouples game data from UI code without requiring a full CMS; enables content contributions | — Pending |
| In-app editor deferred to v2 | Adds significant complexity; config file sufficient for controlled content growth in v1 | — Pending |

---
*Last updated: 2026-05-03 — Milestone v6 started (Cross-Platform Ship)*

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state
