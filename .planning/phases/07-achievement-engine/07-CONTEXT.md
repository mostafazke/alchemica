# Phase 7: Achievement Engine & Daily Logic — Context

**Gathered:** 2026-05-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 7 delivers all headless engine logic: milestone badge detection, ACHV-06 back-calculation, date-seeded daily challenge, streak computation, and a sound utility. Zero UI components — those ship in Phase 8. Phase 7 provides functions and stores that Phase 8's components will call and subscribe to.

</domain>

<decisions>
## Implementation Decisions

### Achievement Engine — Hook Point (discussed)

- **D-01:** `checkAchievements()` is called **inside `applyReaction()`** in `src/lib/game/reactions.ts`, immediately after `unlockedElements` is updated with the new element. Single choke-point, no subscribe side-effects on store hydration.
- **D-02:** `applyReaction()` return type is extended: `{ result: string | null; isNew: boolean; newBadge: AchievementId | null; dailyCompleted: boolean }`. `newBadge` is the newly awarded badge (or `null`). `dailyCompleted` is `true` if this reaction just completed today's daily challenge. Phase 8 UI reads these to drive toast, pulse, and daily confirmation.
- **D-03:** `checkAchievements()` is idempotent — it checks `get(earnedAchievements).has(id)` before awarding. Re-running (e.g., on a repeated reaction) never double-awards.
- **D-04:** Thresholds: `badge_10` at 10, `badge_25` at 25, `badge_50` at 50, `badge_61` at 61 (from ACHV-01/02/03/04). Checked against `unlockedElements.size` at the moment of unlock.

### ACHV-06 Back-Calculation

- **D-05:** `backfillAchievements()` is a separate function in `src/lib/game/achievements.ts`. It is called **once in `src/lib/stores/game.ts` during module initialization**, after `loadSave()` and after achievement stores are hydrated with saved data. It silently awards any badges the player already earned (elements ≥ threshold but badge not yet in set).
- **D-06:** Back-fill does NOT return a `newBadge` signal — no toast or chime for back-calculated achievements. These are silent corrections. Per D-04 in Phase 6: the game is not published until Phase 7 is complete, so all players will hit Phase 7 fresh.

### Daily Challenge Engine

- **D-07:** Challenge element pool = all elements where `category !== 'basic'`. Excludes `fire`, `water`, `earth`, `air` (the 4 starting elements). This gives ~58 valid targets across the 62-element library.
- **D-08:** Deterministic date-seeding algorithm:
  ```ts
  function getTodayDateStr(): string {
    return new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD in user's local timezone
  }

  function getDailyChallengeKey(): string {
    const dateStr = getTodayDateStr();
    const seed = dateStr.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const pool = Object.keys(ELEMENTS)
      .filter(k => ELEMENTS[k].category !== 'basic')
      .sort(); // sort for deterministic order regardless of import order
    return pool[seed % pool.length];
  }
  ```
  Same element for all players on the same local calendar date. Consistent with streak logic (both use local date).
- **D-09:** `dailyCompleted` detection happens **inside `applyReaction()`** — after the reaction result is determined, check if `result === get(dailyChallengeTarget) && !get(dailyCompleted)`. If true, call `completeDailyChallenge()` and return `dailyCompleted: true`.
- **D-10:** `completeDailyChallenge()` in `src/lib/game/daily.ts` handles streak computation and updates `streakCount` and `lastCompletedDate` (the two stores from Phase 6). No new localStorage fields needed — Phase 6 save schema already has both.

### New Stores (Phase 7)

- **D-11:** Two new stores in a new file `src/lib/stores/daily.ts`:
  - `dailyChallengeTarget = writable<string>(getDailyChallengeKey())` — computed once on module load; changes each calendar day on next page load
  - `dailyCompleted = derived([lastCompletedDate], ([$date]) => $date === getTodayDateStr())` — derived from `lastCompletedDate` (in achievements.ts); automatically reflects persisted state
- **D-12:** `daily.ts` imports `lastCompletedDate` from `achievements.ts` (one-way). `daily.ts` does NOT import from `game.ts`. No circular dependencies.

### Streak Logic

- **D-13:** Timezone: user's **local calendar date** (`new Date().toLocaleDateString('en-CA')`). Natural UX — the player's day starts at midnight on their clock. Consistent between daily challenge and streak.
- **D-14:** `completeDailyChallenge()` logic:
  ```
  today = getTodayDateStr()
  yesterday = subtract 1 day from today (ISO string)

  if lastCompletedDate === today:
    no-op (already completed today, guard against double-completion)
  else if lastCompletedDate === yesterday:
    streakCount.update(n => n + 1)   // consecutive day
  else:
    streakCount.set(1)               // first completion or gap
  lastCompletedDate.set(today)
  ```
- **D-15:** Streak reset (`STRK-03`) is implicit — the next time the player completes a challenge, the `lastCompletedDate !== yesterday` branch sets streak to 1. No scheduled job needed.

### Sound Utility

- **D-16:** `src/lib/effects/sound.ts` — pure headless utility, no UI. Exports `playChime()`.
- **D-17:** Implementation: Web Audio API oscillator synthesis (no external file, no CDN). Short tone sequence (e.g., two ascending notes). **iOS-safe**: `AudioContext` is created lazily on first call and immediately `resume()`d (iOS requires AudioContext to start in a user-gesture context; the React button tap qualifies).
- **D-18:** `playChime()` is built in Phase 7 as a headless function. Phase 8 calls it from the achievement unlock handler (alongside showing the toast). Phase 7 does NOT call it — there is no toast in Phase 7.

### New Files

| File | Role |
|------|------|
| `src/lib/game/achievements.ts` | `checkAchievements()`, `backfillAchievements()`, threshold constants |
| `src/lib/game/daily.ts` | `getTodayDateStr()`, `getDailyChallengeKey()`, `completeDailyChallenge()` |
| `src/lib/stores/daily.ts` | `dailyChallengeTarget` writable, `dailyCompleted` derived store |
| `src/lib/effects/sound.ts` | `playChime()` — Web Audio synthesis, iOS-safe |

### Modified Files

| File | Change |
|------|--------|
| `src/lib/game/reactions.ts` | Call `checkAchievements()` + `checkDailyCompletion()` after unlock; extend return type |
| `src/lib/stores/game.ts` | Call `backfillAchievements()` during module init (after loadSave) |

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Scope
- `.planning/ROADMAP.md` §"Phase 7: Achievement Engine & Daily Logic" — Goal, success criteria (6), requirements list
- `.planning/REQUIREMENTS.md` §ACHV-01/02/03/04, ACHV-06, DALY-02/03/04, STRK-02/03 — 9 requirements this phase covers

### Existing Code (must read before touching)
- `src/lib/game/reactions.ts` — `applyReaction()` (return type to extend), `resolveReaction()`, `getHint()`
- `src/lib/stores/game.ts` — init sequence, `loadSave()`, `backfillAchievements()` call goes here
- `src/lib/stores/achievements.ts` — `earnedAchievements`, `streakCount`, `lastCompletedDate` (Phase 6 output)
- `src/lib/types.ts` — `AchievementId` union type (Phase 6 output)
- `src/lib/data/elements.ts` — `ELEMENTS` record; daily challenge pool filters by `category !== 'basic'`

### Architecture Constraints
- No circular imports: `daily.ts` → `achievements.ts` only; nothing imports back from `game.ts`
- `applyReaction()` is the only call-site for both `checkAchievements()` and daily completion detection
- `backfillAchievements()` is silent (no signal returned, no toast, no chime)
- Sound utility is headless — it has no knowledge of achievement IDs or UI state
</canonical_refs>
