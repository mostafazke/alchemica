# Milestone v2: Achievements & Daily Hook

**Status:** SHIPPED 2026-05-02
**Phases:** 6–8 (3 phases)
**Plans:** 16 total (4+5+7)
**Requirements:** 21/21 ✓
**Git tag:** v2 (pending)
**Branch:** phase-5/pwa-polish (Alchemica main flow)

---

## Milestone Scope

Give players a reason to come back every day — achievement milestones for long-term progress and a daily challenge with streak for daily habit.

**Shipped features:**
- Discovery milestone badges: Apprentice (10), Alchemist (25), Sage (50), Grand Master (61)
- TopBar "N/61 discovered" counter with gold pulse animation on badge unlock
- Achievement gallery (BottomBar 🏆 Badges button → full-screen overlay, earned/locked 2×2 grid)
- Achievement unlock toast (top-center, FIFO queue, 2.5s auto-dismiss)
- Achievement chime (iOS-safe Web Audio API) with mute toggle in Settings
- Daily challenge: date-seeded target element, auto-completes on discovery, gold banner on completion
- Streak counter: consecutive daily completions, persisted, always visible
- v1→v2 save migration: earnedAchievements + streakCount + lastCompletedDate, zero data loss
- Backward-compatible backfill: v1 saves immediately earn all already-crossed badge thresholds

---

## Phase Details

### Phase 6: Data Foundation & Save Schema

**Goal**: The app can store, migrate, and surface v2 progress data without losing any v1 player saves
**Requirements**: ACHV-05, ACHV-06, PROG-01, STRK-04 (4 requirements)
**Plans**: 4/4 complete

**Plans:**
- 06-01: Added `AchievementId` union type (`badge_10 | badge_25 | badge_50 | badge_61`) and `SaveDataV2` interface to `types.ts`
- 06-02: Created `src/lib/stores/achievements.ts` with 3 writable stores: `earnedAchievements` (Set), `streakCount` (number), `lastCompletedDate` (string|null)
- 06-03: Upgraded `game.ts` + `storage.ts` to SaveDataV2 schema with full v1→v2 migration (Set serialized as array, auto-backfill achievements on load, new save key `alchemica_v2`)
- 06-04: Updated `TopBar.svelte` discovery counter to "N/61 discovered" format

**Success criteria met:**
- ✓ v1 saves load without data loss
- ✓ TopBar shows correct count on first load
- ✓ Earned achievements pre-computed on first v2 load (backfill)
- ✓ Set round-trips correctly through JSON

---

### Phase 7: Achievement Engine & Daily Logic

**Goal**: Headless achievement detection, daily challenge, streak logic, and sound — no UI coupling
**Requirements**: ACHV-01, ACHV-02, ACHV-03, ACHV-04, DALY-02, DALY-03, DALY-04, STRK-02, STRK-03 (9 requirements)
**Plans**: 5/5 complete

**Plans:**
- 07-01: Created `game/achievements.ts` — `checkAchievements(count)` returns `AchievementId|null` on crossing, `backfillAchievements(count)` adds all crossed thresholds; `THRESHOLDS=[10,25,50,61]`
- 07-02: Created `effects/sound.ts` — `playChime()` using lazy AudioContext singleton (C5→E5 oscillators), iOS-safe: calls `ctx.resume()` before scheduling, fails silently
- 07-03: Created `game/daily.ts` — `getTodayDateStr()` (YYYY-MM-DD local), `getDailyChallengeKey()` (date-seeded hash into non-basic element pool), `completeDailyChallenge()` (updates streak + lastCompletedDate)
- 07-04: Created `stores/daily.ts` — `dailyChallengeTarget` writable (initialized from `getDailyChallengeKey()`), `dailyCompleted` derived (compares lastCompletedDate to today)
- 07-05: Extended `game/reactions.ts` + `stores/game.ts` — `applyReaction()` returns `{ result, isNew, newBadge: AchievementId|null, dailyCompleted: boolean }`; `backfillAchievements()` called on game init

**Success criteria met:**
- ✓ Badge awarded exactly once per threshold crossing (no re-fire on repeat reactions)
- ✓ Same daily target for all players on same date
- ✓ Daily auto-completes on target element creation
- ✓ Completed state survives reload (derived from persisted lastCompletedDate)
- ✓ Consecutive days increment streak; missing a day resets
- ✓ Chime works on iOS without extra interaction

---

### Phase 8: Achievement & Daily UI

**Goal**: Full achievement UI — toast, gallery, daily challenge display, BottomBar integration, mute toggle
**Requirements**: PROG-02, PROG-03, PROG-04, PROG-05, PROG-06, DALY-01, DALY-05, STRK-01 (8 requirements)
**Plans**: 7/7 complete

**Wave 1 plans (foundation files):**
- 08-01: Created `data/badges.ts` (BADGES constant × 4), `stores/settings.ts` (soundMuted + localStorage), `stores/toast.ts` (toastQueue FIFO writable)

**Wave 2 plans (components + mods):**
- 08-02: Created `AchievementToast.svelte` — fixed top-center, FIFO drain (2.5s display + 300ms gap), `toast-in` animation, dark glass style
- 08-03: Created `AchievementGallery.svelte` — full-screen overlay + 2×2 badge grid, earned/locked states, `panel-appear` animation
- 08-04: Created `DailyChallenge.svelte` — store-driven, incomplete/complete states, streak always visible
- 08-05: Modified `TopBar.svelte` (badge-pulse `$effect`) + `BottomBar.svelte` (4th 🏆 Badges button, space-around)

**Wave 3 plans (wiring):**
- 08-06: Modified `MixingChamber.svelte` (newBadge→toastQueue + playChime guard) + `SettingsPanel.svelte` (Sound mute toggle section)
- 08-07: Modified `+page.svelte` (achievementsOpen state, center-col wrapper, AchievementGallery + AchievementToast mounted)

**Success criteria met:**
- ✓ TopBar pulses gold on badge unlock (~800ms)
- ✓ Achievements gallery accessible from BottomBar
- ✓ Toast appears with emoji + name, auto-dismisses after 2.5s
- ✓ Chime mute toggle persists in localStorage
- ✓ Daily challenge visible on launch
- ✓ Completion triggers gold-bordered banner
- ✓ Streak count always visible

---

## Milestone Summary

### Key Decisions

| ID | Decision |
|----|----------|
| D-01 | AchievementId as TS union type (not enum) — safer for serialization |
| D-02 | earnedAchievements stored as array in JSON, reconstructed as Set |
| D-03 | backfillAchievements() on game init — v1→v2 seamless upgrade |
| D-04 | Toast queue is FIFO, one-at-a-time with 300ms gap (handles backfill migrations showing multiple badges) |
| D-05 | Date-seeded daily via deterministic hash into non-basic element pool (local calendar date) |
| D-06 | Sound: lazy AudioContext singleton + `ctx.resume()` — iOS-safe without gesture requirement |
| D-07 | stores/settings.ts separate from game stores — no circular deps |
| D-08 | DailyChallenge.svelte below MixingChamber in `.center-col` flex wrapper |

### Tech Debt / Known Issues

- No v2-MILESTONE-AUDIT.md produced — skipped in yolo mode (deferred to v3 pre-close)
- ROADMAP.md Phase 6/8 checklist markers were stale before execution (documented artifact)
- Streak reset logic is calendar-date diff based; timezone edge cases not tested

### Stats

- **Phases:** 6, 7, 8 (3 phases)
- **Plans:** 16 total
- **Files changed:** 78 files (6,186 insertions, 1,232 deletions) from v1 tag
- **Commits:** 11 (v1..HEAD)
- **Timeline:** 2026-05-02 (single session)
- **Requirements:** 21/21 ✓
