# Requirements: Alchemica

**Defined:** 2026-05-02
**Core Value:** Players can open the game on any device, pick up where they left off, and feel the satisfaction of discovering a new element — even with no internet connection.

## v1 Requirements

### Architecture

- [ ] **ARCH-01**: Project scaffolded with Vite + Svelte 5 + TypeScript (`npm create vite@latest -- --template svelte-ts`)
- [ ] **ARCH-02**: Elements and reactions defined in typed TypeScript data files (`lib/data/elements.ts`, `lib/data/reactions.ts`) fully decoupled from UI components
- [ ] **ARCH-03**: Game state managed via Svelte writable stores (`lib/stores/game.ts`) — no manual DOM state tracking
- [ ] **ARCH-04**: Game state auto-saves to localStorage on every change with versioned save format (enables future migrations)
- [ ] **ARCH-05**: Service worker (vite-plugin-pwa + Workbox) caches all assets for full offline support
- [ ] **ARCH-06**: PWA manifest with app name, icons, and theme color enables "Add to Home Screen" on iOS and Android
- [ ] **ARCH-07**: All fonts self-hosted — zero CDN dependencies in production build

### Layout

- [ ] **LAYT-01**: Three-breakpoint responsive layout — single column (portrait mobile), 2-column (landscape), 3-column (desktop ≥1025px)
- [ ] **LAYT-02**: Discoveries panel renders as swipeable bottom sheet on mobile portrait (not a sidebar)
- [ ] **LAYT-03**: All interactive elements meet 44×44px minimum touch target (Apple HIG)
- [ ] **LAYT-04**: Mixing chamber slots expand to 110×110px on mobile
- [ ] **LAYT-05**: React button is full-width with 52px height on mobile

### Touch & Input

- [ ] **TOUC-01**: Haptic feedback via Vibration API fires on successful element reaction
- [ ] **TOUC-02**: Long-press on element card opens element detail tooltip (name, formula, description, recipe)
- [ ] **TOUC-03**: Swipe left/right gesture switches shelf filter tabs on mobile
- [ ] **TOUC-04**: Double-tap zoom disabled on game interaction areas

### Gameplay

- [ ] **GAME-01**: All 32 existing elements and reactions preserved — identical gameplay after migration
- [ ] **GAME-02**: Element shelf supports category-grouped browsing (fire, water, earth, air, metal, energy, gas, compound)
- [ ] **GAME-03**: Hint system — player can reveal one hint per cooldown period (30s) showing a valid unused combination
- [ ] **GAME-04**: Share button uses Web Share API to share a discovered element or total discovery count as text/link
- [ ] **GAME-05**: Player can export their progress as a JSON file download
- [ ] **GAME-06**: Player can import a JSON save file to restore progress (with version compatibility check)
- [ ] **GAME-07**: Score and combo system intact — 100pts × combo for new discoveries, 10pts × combo for known, 8× max combo

### Content

- [ ] **CONT-01**: Element library expanded from 32 to 60+ elements with valid, discoverable reaction chains
- [ ] **CONT-02**: All elements (existing + new) have accurate scientific descriptions and chemical formulas
- [ ] **CONT-03**: Elements categorized consistently across 8 categories: basic, fire, water, earth, air, metal, energy, gas, compound
- [ ] **CONT-04**: Element and reaction data fully contained in standalone TS config files — adding a new element requires no UI code changes

### PWA

- [ ] **PWA-01**: Game works fully offline after first load — all assets served from service worker cache
- [ ] **PWA-02**: App is installable as standalone (no browser chrome) from Chrome, Safari, and Edge on iOS/Android/desktop
- [ ] **PWA-03**: Offline/online status indicator shown in UI when connection is lost or restored

## v2 Requirements

### Content Management

- **CMS-01**: In-app editor UI — add, edit, and delete elements and reactions without code changes
- **CMS-02**: Admin authentication to protect editor access

### Progression

- **PROG-01**: Achievement system — unlock badges for milestone discoveries (e.g., "Discovered 10 elements")
- **PROG-02**: Discovery percentage displayed on homescreen (e.g., "42/60 elements found")

### Social

- **SOCL-01**: Cloud save synced across devices (Firebase or Supabase)
- **SOCL-02**: Global leaderboard (top discovery counts)

### Platform

- **PLAT-01**: Native iOS/Android app via Capacitor for app store distribution
- **PLAT-02**: Sound effects with mute toggle

## Out of Scope

| Feature | Reason |
|---------|--------|
| App store distribution (Capacitor) | PWA homescreen install satisfies mobile-first goal without app store review delays |
| Cloud save / user accounts | localStorage sufficient for v1; adds backend complexity not justified at launch |
| Sound effects | Progressive enhancement — good v2 candidate, not blocking v1 value |
| Real-time multiplayer | Single-player is the core loop; social is share-only in v1 |
| In-app content editor | Config file sufficient for controlled v1 content growth; editor is v2 |
| Analytics | Privacy-sensitive; add post-launch if needed |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| ARCH-01 | Phase 1 | Pending |
| ARCH-02 | Phase 1 | Pending |
| ARCH-03 | Phase 1 | Pending |
| ARCH-04 | Phase 1 | Pending |
| ARCH-05 | Phase 5 | Pending |
| ARCH-06 | Phase 5 | Pending |
| ARCH-07 | Phase 1 | Pending |
| LAYT-01 | Phase 2 | Pending |
| LAYT-02 | Phase 2 | Pending |
| LAYT-03 | Phase 2 | Pending |
| LAYT-04 | Phase 2 | Pending |
| LAYT-05 | Phase 2 | Pending |
| TOUC-01 | Phase 3 | Pending |
| TOUC-02 | Phase 3 | Pending |
| TOUC-03 | Phase 3 | Pending |
| TOUC-04 | Phase 2 | Pending |
| GAME-01 | Phase 1 | Pending |
| GAME-02 | Phase 2 | Pending |
| GAME-03 | Phase 4 | Pending |
| GAME-04 | Phase 4 | Pending |
| GAME-05 | Phase 3 | Pending |
| GAME-06 | Phase 3 | Pending |
| GAME-07 | Phase 1 | Pending |
| CONT-01 | Phase 4 | Pending |
| CONT-02 | Phase 4 | Pending |
| CONT-03 | Phase 4 | Pending |
| CONT-04 | Phase 1 | Pending |
| PWA-01 | Phase 5 | Pending |
| PWA-02 | Phase 5 | Pending |
| PWA-03 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 27 total
- Mapped to phases: 27
- Unmapped: 0 ✓

---
*Requirements defined: 2026-05-02*
*Last updated: 2026-05-02 after initial definition*
