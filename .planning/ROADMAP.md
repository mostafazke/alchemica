# Roadmap: Alchemica

**Project:** Alchemica — Mobile-first element combination PWA
**Updated:** 2026-05-03

---

## ✅ Milestone v1 — Mobile PWA (SHIPPED 2026-05-02)

5 phases · 25 plans · 61 elements · 27/27 requirements · PR #1 · git tag v1
Full archive: [.planning/milestones/v1-ROADMAP.md](milestones/v1-ROADMAP.md)

---

## ✅ Milestone v2 — Achievements & Daily Hook (SHIPPED 2026-05-02)

3 phases · 16 plans · 21/21 requirements · git tag v2
Full archive: [.planning/milestones/v2-ROADMAP.md](milestones/v2-ROADMAP.md)

---

## 🚧 Milestone v3 — Revenue & Native (In Progress)

**Milestone Goal:** Wrap Alchemica as a native Android app and turn v2 engagement into sustainable revenue via rewarded ads and IAP.

4 phases (9–12) · 11 requirements

### Phases

- [x] **Phase 9: Capacitor Native Shell** - Android app via Capacitor; Google Play-ready build ✅
- [x] **Phase 10: Streak Bonus** ✅ - Higher combo multiplier during active streak, visually indicated
- [x] **Phase 11: AdMob Rewarded Ads** ✅ - Rewarded video ad grants 1 hint; graceful unavailability handling
- [ ] **Phase 12: IAP & Purchase Logic** - Remove-ads IAP, hint bundle IAP, purchase restore

---

## 🔄 Milestone v4 — Main Menu (In Progress)

**Milestone Goal:** Add a dedicated main menu screen that greets players on launch with the game title and visual identity, and provides smooth animated transitions into and out of the game.

1 phase (13) · 2 requirements

### Phases

- [ ] **Phase 13: Main Menu Screen** - Branded launch screen with smooth navigation transitions

---

## Phase Details

### Phase 9: Capacitor Native Shell
**Goal**: Alchemica runs as a native Android app that can be submitted to Google Play, while the PWA web build remains fully functional
**Depends on**: Phase 8 (v2 complete)
**Requirements**: PLAT-01, PLAT-02, PLAT-03
**Success Criteria** (what must be TRUE):
  1. User can install and run Alchemica as a native Android app on a real device
  2. The Google Play submission checklist is satisfied: correct app ID, icons, splash screen, signed AAB
  3. The existing web PWA build deploys and functions identically — no features broken by Capacitor addition
  4. Game state (saves, achievements, streak) persists correctly inside the native container
**Plans**: 7 plans

Plans:
- [x] 09-01-PLAN.md — Wave 0: Haptics test scaffold (touch.test.ts)
- [x] 09-02-PLAN.md — Wave 1: Capacitor 8 install, capacitor.config.ts, npm scripts, .gitignore
- [x] 09-03-PLAN.md — Wave 2: Haptics upgrade in touch.ts (@capacitor/haptics + web fallback)
- [x] 09-04-PLAN.md — Wave 2: Android platform (npx cap add android), orientation lock, JDK config
- [x] 09-05-PLAN.md — Wave 3: Icon/splash asset generation (@capacitor/assets)
- [x] 09-06-PLAN.md — Wave 3: Keystore generation, Gradle signing config, signed AAB build
- [x] 09-07-PLAN.md — Wave 4: PLAT-03 regression gate (full test suite + web build verification)

### Phase 10: Streak Bonus
**Goal**: Players on an active daily streak gain a higher combo multiplier cap, visually surfaced in the UI
**Depends on**: Phase 9
**Requirements**: STRK-05, STRK-06
**Success Criteria** (what must be TRUE):
  1. A player with a 1-day streak sees their combo cap increase by 1x above the base 8x maximum
  2. The streak bonus increments with each consecutive streak day, capping at +3x (max 11x)
  3. The active streak bonus level is visibly indicated in the TopBar or BottomBar (not just a number — a distinct visual cue)
  4. A player who breaks their streak immediately loses the bonus multiplier cap
**Plans**: TBD
**UI hint**: yes

### Phase 11: AdMob Rewarded Ads
**Goal**: Players can watch a rewarded video ad to earn 1 free hint; the ad loads silently before it is needed and fails gracefully
**Depends on**: Phase 9
**Requirements**: MOTZ-01, MOTZ-04
**Success Criteria** (what must be TRUE):
  1. User sees a "Watch ad for hint" button and tapping it plays a rewarded video ad
  2. After the ad completes, the user's hint balance increases by 1 without requiring a page reload
  3. When an ad is unavailable, the button shows a friendly message and does not crash the app
  4. The ad is preloaded asynchronously so there is no visible loading delay when the user requests it
**Plans**: TBD

### Phase 12: IAP & Purchase Logic
**Goal**: Players can buy a permanent remove-ads upgrade or a hint bundle IAP, restore previous purchases after reinstall, and ad surfaces are permanently hidden for purchasers
**Depends on**: Phase 11
**Requirements**: MOTZ-02, MOTZ-03, MOTZ-05, MOTZ-06
**Success Criteria** (what must be TRUE):
  1. User can complete a one-time "Remove Ads" purchase ($2.99–$4.99) and the ad button disappears permanently
  2. User can purchase a 10-hint bundle and their hint balance increases by 10 immediately after purchase
  3. A user who reinstalls the app can tap "Restore Purchases" and recover both the remove-ads state and any previously purchased hints
  4. Players who own the remove-ads upgrade never see the ad button or any ad surfaces anywhere in the app
  5. Save format is migrated to v3 with purchasedNoAds and hintBalance fields without data loss
**Plans**: TBD

### Phase 13: Main Menu Screen
**Goal**: Users land on a branded main menu screen at launch and navigate to and from the game with smooth animated transitions.
**Depends on**: Phase 12
**Requirements**: MENU-01, MENU-05
**Success Criteria** (what must be TRUE):
  1. On launch, the user sees a main menu screen displaying the game title, logo, and the established dark alchemical visual identity (dark background, gold accents)
  2. The main menu has a clearly visible "Play" (or equivalent) action that takes the user into the game
  3. Navigating from the menu to the game plays a smooth animated transition (no hard page jump)
  4. Navigating back from the game to the menu plays a smooth animated transition in the reverse direction
  5. The menu and game are separate SvelteKit routes (`/` for menu, `/game` for the lab), and game state is preserved across navigation
**Plans**: TBD
**UI hint**: yes

---

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1–5. Mobile PWA | v1 | 25/25 | Complete | 2026-05-02 |
| 6–8. Achievements & Daily | v2 | 16/16 | Complete | 2026-05-02 |
| 9. Capacitor Native Shell | v3 | 0/7 | Planned | - |
| 10. Streak Bonus | v3 | 0/? | Not started | - |
| 11. AdMob Rewarded Ads | v3 | 0/? | Not started | - |
| 12. IAP & Purchase Logic | v3 | 0/? | Not started | - |
| 13. Main Menu Screen | v4 | 0/? | Not started | - |

---

## Requirement Coverage

### v3 Requirements

| Requirement | Phase | Status |
|-------------|-------|--------|
| PLAT-01 | Phase 9 | Pending |
| PLAT-02 | Phase 9 | Pending |
| PLAT-03 | Phase 9 | Pending |
| STRK-05 | Phase 10 | Done |
| STRK-06 | Phase 10 | Done |
| MOTZ-01 | Phase 11 | Done |
| MOTZ-04 | Phase 11 | Done |
| MOTZ-02 | Phase 12 | Pending |
| MOTZ-03 | Phase 12 | Pending |
| MOTZ-05 | Phase 12 | Pending |
| MOTZ-06 | Phase 12 | Pending |

**Coverage: 11/11 v3 requirements mapped. No orphans.**

### v4 Requirements

| Requirement | Phase | Status |
|-------------|-------|--------|
| MENU-01 | Phase 13 | Pending |
| MENU-05 | Phase 13 | Pending |

**Coverage: 2/2 v4 requirements mapped. No orphans.**

---

## Backlog (deferred)

- PLAT-04: iOS App Store (Capacitor iOS) — v4/v5, after Google Play proven
- SOCL-01–03: Cloud save + leaderboards — v5, requires backend
- DALY-06: Push notification on daily reset — v5, requires native/backend
- CMS-01: In-app element/reaction editor — v4+
- MENU-02–04, MENU-06–07: Play/Continue with progress, New Game confirm, Settings shortcut, BG particles, Credits — v5
