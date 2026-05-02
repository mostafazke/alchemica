# Requirements Archive: Alchemica v2 — Achievements & Daily Hook

**Milestone:** v2 — Achievements & Daily Hook
**Shipped:** 2026-05-02
**Status:** All 21 requirements ✓ Complete

---

## Traceability Table

| REQ-ID | Description | Phase | Status | Outcome |
|--------|-------------|-------|--------|---------|
| ACHV-01 | Badge on 10th element discovered | 7 | ✅ Complete | Validated — `checkAchievements()` in game/achievements.ts |
| ACHV-02 | Badge on 25th element discovered | 7 | ✅ Complete | Validated |
| ACHV-03 | Badge on 50th element discovered | 7 | ✅ Complete | Validated |
| ACHV-04 | Badge on all 61 elements discovered | 7 | ✅ Complete | Validated |
| ACHV-05 | Achievements persist across sessions | 6 | ✅ Complete | Validated — localStorage v2 schema |
| ACHV-06 | Back-calculate from v1 save on first v2 load | 6 | ✅ Complete | Validated — backfillAchievements() on init |
| PROG-01 | TopBar shows "N/61 discovered" | 6 | ✅ Complete | Validated — TopBar.svelte |
| PROG-02 | TopBar pulses on milestone badge unlock | 8 | ✅ Complete | Validated — badge-pulse $effect + @keyframes |
| PROG-03 | Achievement gallery accessible from BottomBar | 8 | ✅ Complete | Validated — 🏆 Badges button |
| PROG-04 | Gallery shows 4 badges earned/locked | 8 | ✅ Complete | Validated — AchievementGallery.svelte |
| PROG-05 | Unlock toast with badge emoji + name, 2.5s | 8 | ✅ Complete | Validated — AchievementToast.svelte |
| PROG-06 | Chime mutable via Settings toggle | 8 | ✅ Complete | Validated — soundMuted store + SettingsPanel toggle |
| DALY-01 | Daily challenge target visible on launch | 8 | ✅ Complete | Validated — DailyChallenge.svelte |
| DALY-02 | Challenge auto-completes on target creation | 7 | ✅ Complete | Validated — applyReaction() returns dailyCompleted |
| DALY-03 | Challenge resets each calendar day (date-seeded) | 7 | ✅ Complete | Validated — getDailyChallengeKey() hash |
| DALY-04 | Completed state persists across reload | 7 | ✅ Complete | Validated — lastCompletedDate persisted in v2 save |
| DALY-05 | Visual confirmation distinct from normal result | 8 | ✅ Complete | Validated — gold-bordered banner in DailyChallenge |
| STRK-01 | Streak count visible in UI | 8 | ✅ Complete | Validated — DailyChallenge.svelte streak label |
| STRK-02 | Streak increments on consecutive daily completions | 7 | ✅ Complete | Validated — completeDailyChallenge() |
| STRK-03 | Streak resets to 0 on missed day | 7 | ✅ Complete | Validated — date diff check in completeDailyChallenge() |
| STRK-04 | Streak persists to localStorage | 6 | ✅ Complete | Validated — streakCount in v2 save schema |

---

## Full Requirements Text

### Achievement System (ACHV)

- [x] **ACHV-01**: User earns a badge when they discover their 10th element
- [x] **ACHV-02**: User earns a badge when they discover their 25th element
- [x] **ACHV-03**: User earns a badge when they discover their 50th element
- [x] **ACHV-04**: User earns a badge when they discover all 61 elements
- [x] **ACHV-05**: User's earned achievements persist across sessions (survive reload and app restart)
- [x] **ACHV-06**: Earned achievements are back-calculated from v1 save data on first v2 load — no player loses progress they already earned

### Progress Display (PROG)

- [x] **PROG-01**: TopBar shows discovery count as "42/61 discovered" at all times
- [x] **PROG-02**: TopBar counter pulses visually when a milestone badge unlocks
- [x] **PROG-03**: User can open the achievement gallery from a BottomBar button
- [x] **PROG-04**: Achievement gallery shows all 4 badges — earned (full opacity + emoji) vs locked (dimmed + lock icon)
- [x] **PROG-05**: User sees an unlock toast when an achievement fires — badge emoji + name, auto-dismisses in 2.5s
- [x] **PROG-06**: User hears a short chime when an achievement unlocks — mutable via Settings toggle

### Daily Challenge (DALY)

- [x] **DALY-01**: User sees today's daily challenge on launch — a target element to discover ("Today: Volcano")
- [x] **DALY-02**: Daily challenge completes automatically when the player creates the target element
- [x] **DALY-03**: Challenge resets to a new target element each calendar day (date-seeded — same target for all players on the same day)
- [x] **DALY-04**: Completed challenge state persists so the challenge doesn't appear incomplete after page reload
- [x] **DALY-05**: User receives visual confirmation (distinct from the normal result display) when they complete today's challenge

### Streak (STRK)

- [x] **STRK-01**: User's daily challenge streak count is displayed in the UI
- [x] **STRK-02**: Streak increments by 1 each calendar day the user completes the daily challenge
- [x] **STRK-03**: Streak resets to 0 if the user misses completing the challenge for a full calendar day
- [x] **STRK-04**: Streak persists to localStorage and survives reload and app restart

---

## Notes on Changed Requirements

- All 21 requirements shipped as originally defined — no requirements adjusted or dropped
- PROG-06 scope clarified during Phase 8 context: mute stored in `stores/settings.ts` (separate file, not merged into game store) to avoid circular deps
- DALY-01 implementation: DailyChallenge.svelte placed below MixingChamber in `.center-col` flex wrapper (not a separate panel) — reduces layout complexity while meeting requirement
