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

## v2 Requirements — Achievements & Daily Hook

**Defined:** 2026-05-02
**Goal:** Give players a reason to come back every day — achievement milestones for long-term progress and a daily challenge with streak for daily habit.

### Achievement System (ACHV)

- [ ] **ACHV-01**: User earns a badge when they discover their 10th element
- [ ] **ACHV-02**: User earns a badge when they discover their 25th element
- [ ] **ACHV-03**: User earns a badge when they discover their 50th element
- [ ] **ACHV-04**: User earns a badge when they discover all 61 elements
- [ ] **ACHV-05**: User's earned achievements persist across sessions (survive reload and app restart)
- [ ] **ACHV-06**: Earned achievements are back-calculated from v1 save data on first v2 load — no player loses progress they already earned

### Progress Display (PROG)

- [ ] **PROG-01**: TopBar shows discovery count as "42/61 discovered" at all times
- [ ] **PROG-02**: TopBar counter pulses visually when a milestone badge unlocks
- [ ] **PROG-03**: User can open the achievement gallery from a BottomBar button
- [ ] **PROG-04**: Achievement gallery shows all 4 badges — earned (full opacity + emoji) vs locked (dimmed + lock icon)
- [ ] **PROG-05**: User sees an unlock toast when an achievement fires — badge emoji + name, auto-dismisses in 2.5s
- [ ] **PROG-06**: User hears a short chime when an achievement unlocks — mutable via Settings toggle

### Daily Challenge (DALY)

- [ ] **DALY-01**: User sees today's daily challenge on launch — a target element to discover ("Today: Volcano")
- [ ] **DALY-02**: Daily challenge completes automatically when the player creates the target element
- [ ] **DALY-03**: Challenge resets to a new target element each calendar day (date-seeded — same target for all players on the same day)
- [ ] **DALY-04**: Completed challenge state persists so the challenge doesn't appear incomplete after page reload
- [ ] **DALY-05**: User receives visual confirmation (distinct from the normal result display) when they complete today's challenge

### Streak (STRK)

- [ ] **STRK-01**: User's daily challenge streak count is displayed in the UI
- [ ] **STRK-02**: Streak increments by 1 each calendar day the user completes the daily challenge
- [ ] **STRK-03**: Streak resets to 0 if the user misses completing the challenge for a full calendar day
- [ ] **STRK-04**: Streak persists to localStorage and survives reload and app restart

## Future Requirements (v3+)

### Monetization (v3)

- **MOTZ-01**: Rewarded video ad grants one free hint (AdMob via Capacitor native wrapper)
- **MOTZ-02**: Remove-ads one-time IAP ($2.99–$4.99) — removes rewarded ad prompts permanently
- **MOTZ-03**: Hint bundle IAP — purchase 10 hints without watching ads

### Social (v3–v4)

- **SOCL-01**: Cloud save synced across devices (Google/Apple sign-in)
- **SOCL-02**: Async leaderboard — compare discovery count with friends
- **SOCL-03**: Global leaderboard (top discovery counts)

### Platform (v3)

- **PLAT-01**: Capacitor native wrapper for iOS and Android (prerequisite for AdMob + Play Games Services)
- **PLAT-02**: Google Play Games Services integration (leaderboards, cloud saves, achievements)

### Daily Engagement (v3)

- **DALY-06**: Push notification when daily challenge resets (requires native or PWA push)
- **STRK-05**: Streak bonus — higher combo multiplier on reaction days during an active streak

### Content (v3+)

- **CMS-01**: In-app editor UI — add, edit, and delete elements and reactions without code changes
- **CMS-02**: Admin authentication to protect editor access

## Out of Scope (v2)

| Feature | Reason |
|---------|--------|
| Push notifications | Requires service worker push + backend — no backend in v2 |
| Streak bonuses / rewards | Monetization hook — belongs in v3 with IAP |
| Leaderboards | Requires accounts or cloud sync — v3 |
| Friend comparison | Requires accounts — v3 |
| In-app purchases / ads | Revenue in v3 after hook is proven |
| Capacitor / native wrapper | v3 prerequisite for AdMob + Play Games |
| Real-time multiplayer | Backend + accounts required — v4+ |
| Analytics | Privacy-sensitive; add post-launch when needed |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|---------|
| ARCH-01 | Phase 1 | ✅ Complete |
| ARCH-02 | Phase 1 | ✅ Complete |
| ARCH-03 | Phase 1 | ✅ Complete |
| ARCH-04 | Phase 1 | ✅ Complete |
| ARCH-05 | Phase 5 | ✅ Complete |
| ARCH-06 | Phase 5 | ✅ Complete |
| ARCH-07 | Phase 1 | ✅ Complete |
| LAYT-01 | Phase 2 | ✅ Complete |
| LAYT-02 | Phase 2 | ✅ Complete |
| LAYT-03 | Phase 2 | ✅ Complete |
| LAYT-04 | Phase 2 | ✅ Complete |
| LAYT-05 | Phase 2 | ✅ Complete |
| TOUC-01 | Phase 3 | ✅ Complete |
| TOUC-02 | Phase 3 | ✅ Complete |
| TOUC-03 | Phase 3 | ✅ Complete |
| TOUC-04 | Phase 2 | ✅ Complete |
| GAME-01 | Phase 1 | ✅ Complete |
| GAME-02 | Phase 2 | ✅ Complete |
| GAME-03 | Phase 4 | ✅ Complete |
| GAME-04 | Phase 4 | ✅ Complete |
| GAME-05 | Phase 3 | ✅ Complete |
| GAME-06 | Phase 3 | ✅ Complete |
| GAME-07 | Phase 1 | ✅ Complete |
| CONT-01 | Phase 4 | ✅ Complete |
| CONT-02 | Phase 4 | ✅ Complete |
| CONT-03 | Phase 4 | ✅ Complete |
| CONT-04 | Phase 1 | ✅ Complete |
| PWA-01 | Phase 5 | ✅ Complete |
| PWA-02 | Phase 5 | ✅ Complete |
| PWA-03 | Phase 5 | ✅ Complete |

**v1 Coverage:**
- v1 requirements: 27 total
- Mapped to phases: 27
- Completed: 27 ✅
- Archived: [.planning/milestones/v1-REQUIREMENTS.md](milestones/v1-REQUIREMENTS.md)

**v2 Coverage:**
- v2 requirements: 20 total
- Mapped to phases: TBD (roadmap pending)
- Completed: 0

---
*v1 requirements defined: 2026-05-02 | Completed and archived: 2026-05-02*
*v2 requirements defined: 2026-05-02*
