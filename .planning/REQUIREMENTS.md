# Requirements: Alchemica v6

**Defined:** 2026-05-03
**Milestone:** v6 — Cross-Platform Ship
**Core Value:** Players can open the game on any device, pick up where they left off, and feel the satisfaction of discovering a new element — even with no internet connection.

---

## v6 Requirements

### Android — Play Store

- [x] **PLAY-01**: User can complete a purchase on Android (RC API key live, Google Play products `remove_ads` + `hints_10` created, RC entitlement + Offering configured)
- [x] **PLAY-02**: App is submitted to Google Play (signed AAB, store listing metadata, screenshots, age rating complete)

### iOS — Platform & Distribution

- [ ] **IOS-01**: User can install and run Alchemica as a native iOS app (Capacitor iOS platform added, Xcode build succeeds, provisioning profile configured)
- [ ] **IOS-02**: User can test via TestFlight (signed IPA built, uploaded to App Store Connect, internal testers can install)
- [ ] **IOS-03**: User can watch a rewarded ad on iOS to earn a hint (AdMob iOS SDK integrated, iOS App ID in Info.plist, rewarded ad flow identical to Android)
- [ ] **IOS-04**: User can purchase remove-ads or hint bundle on iOS (RevenueCat iOS configured, App Store Connect products created, StoreKit entitlement sync works)
- [ ] **IOS-05**: App is submitted to the App Store (screenshots, metadata, Privacy Nutrition Labels, submitted for review)

---

## Future Requirements (Deferred from v6)

### iOS
- **IOS-06**: User can restore purchases via Apple ID after reinstall — already supported by RC; verify in v6 UAT, promote to requirement if gaps found

---

## Out of Scope (v6)

- Cloud save — requires user accounts and backend infrastructure (v7+)
- Real-time multiplayer — v7+
- Push notifications — v7+
- In-app content editor — v7+
- User accounts / leaderboards — v7+

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| PLAY-01 | Phase 15 | ✅ Done |
| PLAY-02 | Phase 15 | ✅ Done |
| IOS-01 | Phase 16 | Pending |
| IOS-02 | Phase 16 | Pending |
| IOS-03 | Phase 17 | Pending |
| IOS-04 | Phase 17 | Pending |
| IOS-05 | Phase 18 | Pending |

**Coverage: 7/7 v6 requirements mapped. No orphans.**

---

## v5 Requirements (COMPLETE)

### Landscape Game UX

- [ ] **UX-01**: The game is locked to landscape orientation — no portrait mode support
- [ ] **UX-02**: All unlocked elements are always visible in a scrollable grid (left panel, ~55% width), tap to select into mixing slots
- [ ] **UX-03**: Mixing workspace (slots, react, result, hint, daily) occupies the right panel (~45% width) with clear vertical hierarchy

---

## v4 Requirements (COMPLETE)

### Menu Screen

- [ ] **MENU-01**: User sees a main menu screen on launch with the game title, logo, and visual identity
- [ ] **MENU-05**: Navigating to/from the game uses a smooth animated transition

---

## Future Requirements (Deferred from v4)

### Menu Screen (deferred)
- **MENU-02**: User can tap Play/Continue to enter the game; button shows current progress (e.g. "32/61 discovered") — v5
- **MENU-03**: User can start a New Game from the menu; a confirmation dialog prevents accidental data wipe — v5
- **MENU-04**: User can open Settings from the main menu — v5
- **MENU-06**: The main menu displays a live particle/visual effect in the background — v5
- **MENU-07**: User can view a Credits/About screen listing contributors and version — v5

---

## Out of Scope (v4)

- Play/Continue with progress display — deferred; minimal scope for v4
- New Game / data-wipe confirmation — deferred; no game management in v4
- Settings from menu — existing BottomBar settings access sufficient; menu shortcut is future
- Background particles on menu — visual polish, v5+
- Credits screen — v5+

---

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| MENU-01 | Phase 13 | Pending |
| MENU-05 | Phase 13 | Pending |

**Coverage: 2/2 v4 requirements mapped. No orphans.**

---

## Archive

- v1 requirements (27 req) → [milestones/v1-REQUIREMENTS.md](milestones/v1-REQUIREMENTS.md)
- v2 requirements (21 req) → [milestones/v2-REQUIREMENTS.md](milestones/v2-REQUIREMENTS.md)
- v3 requirements (11 req) → [milestones/v3-REQUIREMENTS.md](milestones/v3-REQUIREMENTS.md)

**Defined:** 2026-05-02
**Milestone:** v3 — Revenue & Native
**Core Value:** Players can open the game on any device, pick up where they left off, and feel the satisfaction of discovering a new element — even with no internet connection.

---

## v3 Requirements

### Platform (Capacitor)

- [ ] **PLAT-01**: User's game runs as a native Android application via Capacitor
- [ ] **PLAT-02**: App can be submitted to Google Play with correct app ID, icons, splash screen, and signed release build (APK/AAB)
- [ ] **PLAT-03**: Existing web PWA build continues to function identically unchanged alongside the native build

### Monetization — AdMob (Rewarded Ads)

- [ ] **MOTZ-01**: User can watch a rewarded video ad to earn 1 free hint
- [ ] **MOTZ-04**: Ad loads asynchronously before user requests it; ad unavailable shows a friendly message without crashing
- [ ] **MOTZ-05**: Users who purchased remove-ads never see the ad button or any ads

### Monetization — IAP

- [ ] **MOTZ-02**: User can purchase a one-time "remove ads" upgrade ($2.99–$4.99) that permanently hides all ads
- [ ] **MOTZ-03**: User can purchase a 10-hint bundle IAP
- [ ] **MOTZ-06**: User can restore previous purchases after reinstall or device switch

### Streak Bonus

- [ ] **STRK-05**: Combo multiplier cap increases during active streak days (+1x per streak day, up to +3x above base 8x max)
- [ ] **STRK-06**: Active streak bonus level is visually indicated in the TopBar or BottomBar

---

## Future Requirements (Deferred from v3)

### Platform
- **PLAT-04**: iOS App Store distribution (Capacitor iOS wrapper) — v4, after Google Play proven

### Social
- **SOCL-01**: Cloud save synced across devices (Google/Apple sign-in) — v4, requires backend
- **SOCL-02**: Async leaderboard — compare discovery count with friends — v4+
- **SOCL-03**: Global leaderboard (top discovery counts) — v4+

### Engagement
- **DALY-06**: Push notification when daily challenge resets — v4, requires native/backend

### Content
- **CMS-01**: In-app editor UI — add/edit/delete elements and reactions without code changes — v4+

---

## Out of Scope (v3)

- iOS distribution — Android-only in v3; iOS in v4 after Google Play proven
- Cloud save — requires user accounts and backend infrastructure
- Push notifications — requires native push or backend; v4+
- Real-time multiplayer — requires backend + accounts; v4+
- Leaderboards — requires cloud infrastructure; v4+

---

## Traceability

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

---

## Archive

- v1 requirements (27 req) → [milestones/v1-REQUIREMENTS.md](milestones/v1-REQUIREMENTS.md)
- v2 requirements (21 req) → [milestones/v2-REQUIREMENTS.md](milestones/v2-REQUIREMENTS.md)
