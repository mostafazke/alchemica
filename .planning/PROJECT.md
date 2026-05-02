# Alchemica

## What This Is

Alchemica is a mobile-first element combination puzzle game (Little Alchemy-style) built as a PWA. Players discover new elements by combining two from a growing library, unlocking a chain of reactions across categories like fire, water, earth, metal, and energy. It is a public-facing game rebuilt from a single HTML prototype into a scalable Svelte + TypeScript application with offline support, persistent progress, and an expandable content system.

## Core Value

Players can open the game on any device, pick up where they left off, and feel the satisfaction of discovering a new element — even with no internet connection.

## Requirements

### Validated

- ✓ 32 elements with 2-element reaction system — existing prototype
- ✓ Canvas particle effects on reaction — existing prototype
- ✓ Score + combo system (100pts × combo new, 10pts × combo known, 8x max) — existing prototype
- ✓ Discovery log showing formula and recipe — existing prototype
- ✓ Element shelf with All / Basic / Found filter tabs — existing prototype

### Active

**Migration & Architecture**
- [ ] Migrate from single HTML to Svelte + TypeScript + Vite project structure
- [ ] Elements and reactions extracted to typed TypeScript data files (editable without touching component code)
- [ ] Game state centralized in Svelte stores with auto-save to localStorage
- [ ] Identical gameplay preserved through migration

**Mobile UX**
- [ ] Responsive layout: single-column on mobile portrait, 2-column on landscape, 3-column on desktop
- [ ] Touch targets minimum 44×44px (Apple HIG)
- [ ] Bottom sheet / drawer for discoveries panel on mobile
- [ ] Haptic feedback on successful reaction (Vibration API)
- [ ] Swipe gesture for tab switching on mobile

**PWA & Offline**
- [ ] Service worker caches all assets (vite-plugin-pwa + Workbox)
- [ ] Game fully playable offline after first load
- [ ] Add-to-homescreen manifest (name, icon, theme color)
- [ ] Progress persists across sessions (localStorage save/load)

**Content & Discovery**
- [ ] Expanded element library beyond 32 (target: 60+ elements)
- [ ] Expanded reaction set to match new elements
- [ ] Hint system: player can reveal one hint per cooldown period
- [ ] Category tabs / filter with visual grouping in shelf
- [ ] Share button: share a discovered element or full progress (Web Share API)

**Data-Driven Content System**
- [ ] Elements and reactions defined in a standalone JSON/TS config file with no coupling to UI
- [ ] In-app editor UI (v2): add/edit/delete elements and reactions without code changes

**Polish**
- [ ] Self-hosted fonts (offline support, no CDN dependency)
- [ ] Particle count scales down on low-end devices (navigator.hardwareConcurrency)
- [ ] Notification toast for new discovery
- [ ] Smooth animations: result pop, discovery slide-in, combo pulse

### Out of Scope

- Native iOS/Android app store distribution — PWA homescreen install is sufficient for v1
- Backend / server-side storage — localStorage is sufficient; cloud sync is a future feature
- Real-time multiplayer — single-player game; social features are share-only
- In-app editor — JSON/TS config file covers v1 content management; editor is v2
- Sound effects — not planned for v1; can be added post-launch as progressive enhancement
- User accounts / leaderboards — out of scope for v1 public release

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
