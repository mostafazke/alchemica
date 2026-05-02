# Requirements: Alchemica v3

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
