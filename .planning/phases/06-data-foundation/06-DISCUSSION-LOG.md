# Phase 6: Data Foundation & Save Schema - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-02
**Phase:** 6-Data Foundation & Save Schema
**Areas discussed:** Save key & migration strategy, Stores scope for Phase 6, TopBar PROG-01, Set<string> serialization

---

## Save Key & Migration Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Same key + version bump | Keep 'alchemica_v1', bump SAVE_VERSION to 2. Detect version 1 → migrate → write v2. | ✓ |
| New key 'alchemica_v2' | Read from old key once, copy to new key, leave stale key. | |
| Rename key to 'alchemica_save' | Version-neutral key with version field inside JSON. | |

**User's choice:** Same key + version bump

---

| Option | Description | Selected |
|--------|-------------|----------|
| Back-calculate from unlockedElements count | Award badges during migration if count >= thresholds. Phase 6 handles ACHV-06. | |
| Start empty, let Phase 7 engine recalculate | Migration sets earnedAchievements = []. Phase 7 does back-calc on init. | ✓ |
| You decide | Defer to planner. | |

**User's choice:** Start empty — Phase 7 engine recalculates on app init
**Notes:** User clarified: "We will not publish the game till it's 100% ready, so plan upon that." All 3 phases will ship together. Phase 7 can safely own ACHV-06 back-calculation.

---

| Option | Description | Selected |
|--------|-------------|----------|
| streakCount + lastCompletedDate | Two fields sufficient for Phase 7 streak logic. | ✓ |
| Add bestStreak too | Also store personal record for potential display. | |
| You decide | Defer to planner. | |

**User's choice:** streakCount + lastCompletedDate only

---

## Stores Scope for Phase 6

| Option | Description | Selected |
|--------|-------------|----------|
| Phase 6: earnedAchievements + streak fields only | Daily challenge stores deferred to Phase 7. | ✓ |
| Phase 6: all v2 stores including daily challenge | Phase 6 adds dailyChallengeTarget, dailyCompleted, lastChallengeDate too. | |
| You decide | Defer to planner. | |

**User's choice:** earnedAchievements + streak fields only — clean split

---

| Option | Description | Selected |
|--------|-------------|----------|
| Separate stores/achievements.ts | New stores in own file, game.ts stays focused. | ✓ |
| All in game.ts | Extend existing file. | |

**User's choice:** Separate stores/achievements.ts

---

| Option | Description | Selected |
|--------|-------------|----------|
| Yes — export/import stays in sync | Bump EXPORT_VERSION to 2, include v2 fields in export. | ✓ |
| Defer to Phase 7 or 8 | Keep storage.ts at version 1 for now. | |

**User's choice:** Bump EXPORT_VERSION to 2 in Phase 6

---

## TopBar PROG-01

| Option | Description | Selected |
|--------|-------------|----------|
| Replace stat with '42/61 discovered' text | Pure text change, stays reactive from $unlockedElements.size. | ✓ |
| Keep current format | Current '🔬 42/61' is close enough, no change needed. | |
| Add a derived discoveryCount store | Create named derived store reusable by Phase 8. | |

**User's choice:** Replace stat with '42/61 discovered' text — text format change only

---

| Option | Description | Selected |
|--------|-------------|----------|
| Keep dynamic Object.keys(ELEMENTS).length | Auto-updates if elements grow. | ✓ |
| Hardcode 61 | Simpler template. | |

**User's choice:** Keep dynamic

---

## Set<string> Serialization

| Option | Description | Selected |
|--------|-------------|----------|
| Serialize as array, reconstruct as Set on load | Simple, mirrors unlockedElements pattern. | ✓ |
| Custom JSON replacer/reviver for Set | More complex, overkill. | |
| Store as Record<string, boolean> instead | Serializes naturally but type mismatch with roadmap requirement. | |

**User's choice:** Serialize as array (same pattern as unlockedElements)

---

| Option | Description | Selected |
|--------|-------------|----------|
| Typed union in types.ts | AchievementId = 'badge_10' \| 'badge_25' \| 'badge_50' \| 'badge_61' — TypeScript safety. | ✓ |
| Plain string keys | Set<string>, no types.ts change. | |
| You decide | Defer to planner. | |

**User's choice:** Typed union in types.ts

---

## Claude's Discretion

None — user made explicit decisions in all areas.

## Deferred Ideas

- PROG-02 TopBar pulse animation → Phase 8
- Daily challenge stores → Phase 7
- `bestStreak` field → future schema version if needed
- `discoveryCount` derived store → Phase 8 if pulse animation needs it
