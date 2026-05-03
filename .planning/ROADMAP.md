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

## ✅ Milestone v3 — Revenue & Native (COMPLETE 2026-05-03)

**Milestone Goal:** Wrap Alchemica as a native Android app and turn v2 engagement into sustainable revenue via rewarded ads and IAP.

4 phases (9–12) · 11 requirements

### Phases

- [x] **Phase 9: Capacitor Native Shell** - Android app via Capacitor; Google Play-ready build ✅
- [x] **Phase 10: Streak Bonus** ✅ - Higher combo multiplier during active streak, visually indicated
- [x] **Phase 11: AdMob Rewarded Ads** ✅ - Rewarded video ad grants 1 hint; graceful unavailability handling
- [x] **Phase 12: IAP & Purchase Logic** ✅ - Remove-ads IAP, hint bundle IAP, purchase restore

---

## ✅ Milestone v5 — Landscape Game UX (COMPLETE 2026-05-03)

**Milestone Goal:** Complete rewrite of the game screen into a landscape-only, grid-based layout inspired by Little Alchemy — elements always visible, tap-to-combine, optimized for phone landscape orientation.

1 phase (14) · 3 requirements

### Phases

- [x] **Phase 14: Landscape Game UX Rewrite** ✅ - Complete game layout rewrite: landscape-locked, left element grid + right mixing workspace

---

## ✅ Milestone v4 — Main Menu (COMPLETE 2026-05-03)

**Milestone Goal:** Add a dedicated main menu screen that greets players on launch with the game title and visual identity, and provides smooth animated transitions into and out of the game.

1 phase (13) · 2/2 requirements

### Phases

- [x] **Phase 13: Main Menu Screen** ✅ - Branded launch screen with smooth navigation transitions

---

## Milestone v6 — Cross-Platform Ship (IN PROGRESS)

**Milestone Goal:** Ship Alchemica on both Google Play and the Apple App Store with full feature parity — ads, IAP, haptics — so iOS and Android players get the same experience.

4 phases (15–18) · 7 requirements

### Phases

- [x] **Phase 15: Android Play Store Prep** ✅ — RevenueCat live, purchases work on Android, store listing complete, AAB submitted
- [ ] **Phase 16: Capacitor iOS Platform** — iOS app builds, provisioning configured, TestFlight internal testers can install
- [ ] **Phase 17: iOS Plugin Integration** — AdMob rewarded ads and RevenueCat purchases work on iOS (feature parity with Android)
- [ ] **Phase 18: App Store Submission** — Screenshots, metadata, Privacy Nutrition Labels complete, submitted for review

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

### Phase 14: Landscape Game UX Rewrite
**Goal**: The game screen is completely rewritten as a landscape-only layout with a persistent element grid on the left and mixing workspace on the right — all elements always visible, tap to select, no hidden drawers
**Depends on**: Phase 13
**Requirements**: UX-01, UX-02, UX-03
**Success Criteria** (what must be TRUE):
  1. The game is locked to landscape orientation (AndroidManifest + CSS enforcement)
  2. The left ~55% of the screen shows a scrollable grid of all unlocked elements (tap to select into slots)
  3. The right ~45% shows the mixing workspace (slots, react button, result display, hint, daily challenge) vertically stacked
  4. All unlocked elements are always visible without needing to open a drawer/sidebar/overlay
  5. The element grid supports filter tabs (All/Basic/Found) inline above the grid
  6. The bottom bar provides navigation to Discoveries, Badges, and Settings as overlay panels
  7. No portrait breakpoints exist — the layout is landscape-only and removes all previous responsive complexity
  8. The existing game logic, stores, and reactions work identically (no gameplay changes)
**Plans:** 4 plans
Plans:
- [x] 14-01-PLAN.md — ElementGrid component + game page 2-panel layout rewrite
- [x] 14-02-PLAN.md — Right panel workspace adaptation (compact slots, result, hint+daily utility row)
- [x] 14-03-PLAN.md — TopBar + BottomBar simplification + global CSS cleanup + portrait overlay
- [x] 14-04-PLAN.md — Integration: delete Shelf, build verification, human smoke test
**UI hint**: yes

### Phase 15: Android Play Store Prep
**Goal**: Alchemica is live on Google Play with RevenueCat configured — purchases work on Android and the store listing is complete with all required metadata
**Depends on**: Phase 14
**Requirements**: PLAY-01, PLAY-02
**Success Criteria** (what must be TRUE):
  1. User can complete a "Remove Ads" or "Hints x10" purchase on Android via RevenueCat (RC API key live, entitlement + Offering configured in RC dashboard)
  2. The signed AAB is submitted to Google Play with a complete store listing (title, description, screenshots, age rating)
  3. RevenueCat dashboard confirms an entitlement is granted after a test purchase on Android
  4. Google Play pre-launch report shows no critical errors on the submitted AAB
**Plans**: 2 plans
Plans:
- [ ] 15-01-PLAN.md — RevenueCat env-var wiring + RC/Play Console product setup + build gate
- [ ] 15-02-PLAN.md — Play Store screenshots, listing metadata, content rating, AAB upload & review submission

### Phase 16: Capacitor iOS Platform
**Goal**: Alchemica builds and runs on a real iOS device and internal testers can install via TestFlight — identical gameplay to Android
**Depends on**: Phase 15
**Requirements**: IOS-01, IOS-02
**Success Criteria** (what must be TRUE):
  1. Xcode project builds successfully with no code signing errors (provisioning profile and certificate configured)
  2. A signed IPA is uploaded to App Store Connect and internal testers receive a TestFlight installation link
  3. The app installs and runs on a real iPhone — all game features function identically to Android
  4. TestFlight build passes Apple's automated processing with no binary rejections
**Plans**: 3 plans

### Phase 17: iOS Plugin Integration
**Goal**: AdMob rewarded ads and RevenueCat purchases both work on iOS — full feature parity with Android
**Depends on**: Phase 16
**Requirements**: IOS-03, IOS-04
**Success Criteria** (what must be TRUE):
  1. User can watch a rewarded ad on iOS to earn a hint (AdMob iOS App ID configured in Info.plist, rewarded ad loads and completes)
  2. User can purchase "Remove Ads" or a hint bundle on iOS via StoreKit (App Store Connect products linked to RevenueCat)
  3. RevenueCat iOS correctly syncs entitlements — purchased users permanently see no ad button after reinstall
  4. No crashes or regressions on iOS for game flows unrelated to ads or IAP
**Plans**: 2 plans

### Phase 18: App Store Submission
**Goal**: Alchemica is submitted to the App Store with complete metadata, screenshots for all required device sizes, and accurate Privacy Nutrition Labels
**Depends on**: Phase 17
**Requirements**: IOS-05
**Success Criteria** (what must be TRUE):
  1. App Store listing has screenshots for all required device sizes (iPhone 6.9" and 6.5" minimum)
  2. Privacy Nutrition Labels accurately declare all data types collected (purchases, identifiers, usage data)
  3. App binary is submitted for review via App Store Connect with no metadata validation errors
  4. App passes Apple's automated review checks before entering the human review queue
**Plans**: 2 plans

---

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1–5. Mobile PWA | v1 | 25/25 | Complete | 2026-05-02 |
| 6–8. Achievements & Daily | v2 | 16/16 | Complete | 2026-05-02 |
| 9. Capacitor Native Shell | v3 | 7/7 | Complete | 2026-05-03 |
| 10. Streak Bonus | v3 | done | Complete | 2026-05-03 |
| 11. AdMob Rewarded Ads | v3 | done | Complete | 2026-05-03 |
| 12. IAP & Purchase Logic | v3 | 5/5 | Complete | 2026-05-03 |
| 13. Main Menu Screen | v4 | done | Complete | 2026-05-03 |
| 14. Landscape Game UX | v5 | 4/4 | Complete | 2026-05-03 |
| 15. Android Play Store Prep | v6 | 0/2 | Not started | - |
| 16. Capacitor iOS Platform | v6 | 0/3 | Not started | - |
| 17. iOS Plugin Integration | v6 | 0/2 | Not started | - |
| 18. App Store Submission | v6 | 0/2 | Not started | - |

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
| MOTZ-02 | Phase 12 | Done |
| MOTZ-03 | Phase 12 | Done |
| MOTZ-05 | Phase 12 | Done |
| MOTZ-06 | Phase 12 | Done |

**Coverage: 11/11 v3 requirements mapped. No orphans.**

### v4 Requirements

| Requirement | Phase | Status |
|-------------|-------|--------|
| MENU-01 | Phase 13 | Done |
| MENU-05 | Phase 13 | Done |

**Coverage: 2/2 v4 requirements mapped. No orphans.**

### v6 Requirements

| Requirement | Phase | Status |
|-------------|-------|--------|
| PLAY-01 | Phase 15 | Pending |
| PLAY-02 | Phase 15 | Pending |
| IOS-01 | Phase 16 | Pending |
| IOS-02 | Phase 16 | Pending |
| IOS-03 | Phase 17 | Pending |
| IOS-04 | Phase 17 | Pending |
| IOS-05 | Phase 18 | Pending |

**Coverage: 7/7 v6 requirements mapped. No orphans.**

---

## Backlog (deferred)

- ~~PLAT-04: iOS App Store (Capacitor iOS)~~ — promoted to v6 (Phases 16–18)
- SOCL-01–03: Cloud save + leaderboards — v5, requires backend
- DALY-06: Push notification on daily reset — v5, requires native/backend
- CMS-01: In-app element/reaction editor — v4+
- MENU-02–04, MENU-06–07: Play/Continue with progress, New Game confirm, Settings shortcut, BG particles, Credits — v5
