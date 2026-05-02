# Phase 6: Data Foundation & Save Schema - Context

**Gathered:** 2026-05-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 6 delivers the v2 data layer: new TypeScript types, new Svelte stores for achievements and streak, a save schema bump from version 1 to 2 with migration logic, and an updated TopBar counter. No UI components, no badge-award logic — just the data structures and storage plumbing that Phases 7 and 8 will build on.

</domain>

<decisions>
## Implementation Decisions

### Save Key & Migration Strategy

- **D-01:** Keep the same localStorage key (`alchemica_v1`). Bump `SAVE_VERSION` from `1` to `2`. On load, detect `version === 1` → run migration → write v2 shape. No new key, no stale keys.
- **D-02:** When a v1 save is detected, set `earnedAchievements = []` (empty). Phase 7's engine is responsible for back-calculating achievements on app init (ACHV-06). Phase 6 only establishes the field — it does not pre-award.
- **D-03:** New streak fields in the v2 save: `streakCount: number` (default `0`) and `lastCompletedDate: string | null` (ISO date `YYYY-MM-DD`, default `null`). These are enough for Phase 7 to compute streak logic. `bestStreak` is not added in v2.
- **D-04:** Game will not be published until all phases (6–8) are complete. Phase 7 can be relied upon to handle ACHV-06 back-calculation before any player sees the product.

### Stores Architecture

- **D-05:** Phase 6 introduces three new stores: `earnedAchievements` (`writable<Set<AchievementId>>`), `streakCount` (`writable<number>`), `lastCompletedDate` (`writable<string | null>`).
- **D-06:** New stores live in `src/lib/stores/achievements.ts` — a separate file from `game.ts`. `game.ts` stays focused on core game state (elements, discoveries, score, slots, combo).
- **D-07:** Daily challenge stores (`dailyChallengeTarget`, `dailyCompleted`, etc.) are **not** introduced in Phase 6 — they land in Phase 7 when the engine is built.
- **D-08:** `src/lib/utils/storage.ts` is updated: `EXPORT_VERSION` bumped to `2`. The export JSON includes `earnedAchievements` (serialized as array) + `streakCount` + `lastCompletedDate`. Import logic gains a v1→v2 migration path (missing fields default to empty state).

### TopBar (PROG-01)

- **D-09:** Update `TopBar.svelte` to display `"42/61 discovered"` — replace the current `🔬 {$unlockedElements.size}/{Object.keys(ELEMENTS).length}` stat span with `{$unlockedElements.size}/{Object.keys(ELEMENTS).length} discovered`.
- **D-10:** Keep the total count as `Object.keys(ELEMENTS).length` — dynamic, not hardcoded as `61`. Forwards-compatible with content expansions.
- **D-11:** No new derived store for discovery count — `$unlockedElements.size` directly in the template is sufficient. The Phase 8 pulse animation can add a derived store at that point if needed.
- **D-12:** The PROG-02 TopBar pulse animation is **not** part of Phase 6 — deferred to Phase 8.

### Set<string> Serialization

- **D-13:** `earnedAchievements` is stored as `Set<AchievementId>` in the Svelte store. Serialized to localStorage as a plain array (`[...get(earnedAchievements)]`). Reconstructed on load as `new Set<AchievementId>(data.earnedAchievements ?? [])`. Mirrors the existing pattern for `unlockedElements`.
- **D-14:** Add `export type AchievementId = 'badge_10' | 'badge_25' | 'badge_50' | 'badge_61'` to `src/lib/types.ts`. Store and all badge references use `AchievementId` — TypeScript catches typos at compile time.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Scope
- `.planning/ROADMAP.md` §"Phase 6: Data Foundation & Save Schema" — Goal, success criteria (5 criteria), requirements list
- `.planning/REQUIREMENTS.md` §ACHV-05, ACHV-06, PROG-01, STRK-04 — The 4 requirements this phase delivers

### Existing Code (must read before touching)
- `src/lib/stores/game.ts` — Current store definitions, `SAVE_KEY`, `SAVE_VERSION`, `SaveData` interface, `loadSave()`, `saveToStorage()`, `resetGame()`
- `src/lib/utils/storage.ts` — Current export/import schema (`EXPORT_VERSION = 1`), `SaveFile` interface, `importSave()` migration logic
- `src/lib/types.ts` — Types to extend with `AchievementId` and v2 save shape
- `src/lib/components/TopBar.svelte` — Component to update for PROG-01

### Architecture Decisions
- No external ADRs — decisions fully captured in this document and ROADMAP.md

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Patterns
- **unlockedElements serialization** (`game.ts:31–35`): `new Set(saved.unlockedElements)` on load, `[...get(unlockedElements)]` on save. `earnedAchievements` must follow the identical pattern.
- **Version migration stub** (`game.ts:17–27`): `loadSave()` checks `parsed.version !== SAVE_VERSION` and returns `null`. This check must become a migration branch (`version < SAVE_VERSION → migrate`) instead of a null return.
- **Separate localStorage keys** (`game.ts:48–52`, `hintCooldownEndsAt`): Shows that auxiliary state can have its own key. Streak fields go into the main save object (not separate keys) to keep export/import complete.

### Established Patterns
- All stores in `src/lib/stores/` — new `achievements.ts` fits this convention
- `subscribe(saveToStorage)` pattern for auto-save — new stores in `achievements.ts` must also subscribe to their own save function (or call the main save)
- `SAVE_KEY` and `SAVE_VERSION` are constants at the top of `game.ts` — the planner must decide whether to co-locate v2 constants there or in `achievements.ts`

### Integration Points
- `achievements.ts` stores need to be loaded from the same `alchemica_v1` key as `game.ts` — they must coordinate on a single `loadSave()` call, not two separate reads
- `resetGame()` in `game.ts` must also reset `earnedAchievements`, `streakCount`, `lastCompletedDate`
- `storage.ts` import function receives store setters via parameter — this interface must be extended for v2 fields

</code_context>

<specifics>
## Specific Ideas

- The ROADMAP success criterion explicitly flags: "Saving and loading with `earnedAchievements` as a `Set<string>` round-trips correctly through JSON (no `{}` corruption)" — the array serialization pattern in D-13 is the direct answer to this.
- The coordination problem between `game.ts` and `achievements.ts` loading from the same key is the highest-risk implementation detail. Planner should resolve it explicitly (e.g., one module owns the load, the other imports the result).

</specifics>

<deferred>
## Deferred Ideas

- **PROG-02 TopBar pulse animation** — Phase 8. Phase 6 only updates the text format.
- **Daily challenge stores** (`dailyChallengeTarget`, `dailyCompleted`, `lastChallengeDate`) — Phase 7. Engine and state are introduced together.
- **`bestStreak` field** — Not added in v2. Can be added in a future save schema version if streak leaderboards are introduced.
- **`discoveryCount` derived store** — Not added in Phase 6. Phase 8 can introduce it if the pulse animation needs a named reactive value.

</deferred>

---

*Phase: 6-Data Foundation & Save Schema*
*Context gathered: 2026-05-02*
