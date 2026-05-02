# Alchemica

## Current State

**Latest shipped:** v1 — 2026-05-02 (61 elements, offline PWA, 27/27 requirements)
**Repo:** https://github.com/mostafazke/alchemica (PR #1 merged, tag v1)
**Stack:** SvelteKit + Svelte 5 + TypeScript + Vite 8 + vite-plugin-pwa

## Current Milestone: v2 — Achievements & Daily Hook

**Goal:** Give players a reason to come back every day — achievement milestones for long-term progress and a daily challenge with streak for daily habit.

**Target features:**
- Discovery milestone badges (10, 25, 50, 61 discovered) — emoji + name + unlock condition
- TopBar "42/61 discovered" counter
- Achievement gallery — earned ✓ / locked 🔒 badges, accessible from BottomBar
- Achievement unlock toast + short chime (mutable)
- Daily challenge — target element to discover, resets every calendar day, date-seeded
- Streak counter — consecutive days completing the daily challenge
- Achievements + streak persisted to localStorage (versioned schema bump v1→v2)

**Constraints:**
- Element count stays at 61 — no content expansion in v2
- localStorage only — no cloud sync, no backend
- Phases continue numbering from v1 (Phase 6+)
- Revenue model deferred to v3 (Capacitor + AdMob after hook proven)

---

## What This Is

Alchemica is a mobile-first element combination puzzle game (Little Alchemy-style) built as a PWA. Players discover new elements by combining two from a growing library, unlocking a chain of reactions across categories like fire, water, earth, metal, and energy. It is a public-facing game rebuilt from a single HTML prototype into a scalable Svelte + TypeScript application with offline support, persistent progress, and an expandable content system.

## Core Value

Players can open the game on any device, pick up where they left off, and feel the satisfaction of discovering a new element — even with no internet connection.

## Requirements

### Validated (v1 — SHIPPED)

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

### Active (v2 — Achievements & Daily Hook)

**Achievement System**
- [ ] ACHV-01–04: Discovery milestone badges (10 / 25 / 50 / 61 elements)
- [ ] ACHV-05: Achievement state persisted to localStorage (versioned schema v1→v2)
- [ ] ACHV-06: Back-calculate earned achievements from v1 save on first v2 load

**Progress Display**
- [ ] PROG-01–02: TopBar "42/61 discovered" counter with milestone pulse
- [ ] PROG-03–04: Achievement gallery (earned / locked) via BottomBar
- [ ] PROG-05–06: Unlock toast + chime (mutable via Settings)

**Daily Challenge**
- [ ] DALY-01–03: Daily target element, auto-complete on discovery, resets each calendar day
- [ ] DALY-04–05: Completed state persists; visual confirmation on completion

**Streak**
- [ ] STRK-01–04: Streak counter displayed, increments daily, resets on miss, persisted

### Out of Scope

- Native iOS/Android app store distribution — v3 (Capacitor wrapper, after hook proven)
- Backend / server-side storage — localStorage sufficient; cloud sync is v3
- Real-time multiplayer — requires backend + accounts; v4+
- In-app editor — JSON/TS config sufficient for v2; editor is v3+
- Monetization (ads, IAP) — v3 after engagement metrics established
- User accounts / leaderboards — v3+ requires cloud infrastructure
- Push notifications — requires backend or native; v3+

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
*Last updated: 2026-05-02 after initialization*

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
