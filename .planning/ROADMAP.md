# Roadmap: Alchemica

**Project:** Alchemica — Mobile-first element combination PWA
**Updated:** 2026-05-02

---

## ✅ Milestone v1 — Mobile PWA (SHIPPED 2026-05-02)

5 phases · 25 plans · 61 elements · 27/27 requirements · PR #1 · git tag v1
Full archive: [.planning/milestones/v1-ROADMAP.md](milestones/v1-ROADMAP.md)

---

## Milestone v2 — Achievements & Daily Hook

3 phases · 21 requirements · localStorage only · no new runtime dependencies

### Phases

- [ ] **Phase 6: Data Foundation & Save Schema** — Types, stores, v1→v2 migration ladder, TopBar counter
- [x] **Phase 7: Achievement Engine & Daily Logic** *(planned)* — Badge award logic, daily challenge engine, streak logic, sound utility
- [ ] **Phase 8: Achievement & Daily UI** — Toast, gallery, daily challenge display, BottomBar integration, mute toggle

---

## Phase Details

### Phase 6: Data Foundation & Save Schema

**Goal**: The app can store, migrate, and surface v2 progress data without losing any v1 player saves
**Depends on**: Phase 5 (v1 codebase stable)
**Requirements**: ACHV-05, ACHV-06, PROG-01, STRK-04
**Success Criteria** (what must be TRUE):
  1. A player with an existing v1 save loads the app and sees all their elements still unlocked — no data loss
  2. The TopBar shows "42/61 discovered" (or the correct count) at all times, including on first load
  3. A player who had 25+ elements in v1 immediately has the correct achievements pre-earned on first v2 load — without taking any action
  4. Earned achievements and streak survive a full page reload and browser restart
  5. Saving and loading with `earnedAchievements` as a `Set<string>` round-trips correctly through JSON (no `{}` corruption)
**Plans**: 4 plans

Plans:
- [ ] 06-01-PLAN.md — Add AchievementId type and SaveDataV2 interface to types.ts
- [ ] 06-02-PLAN.md — Create achievements.ts with 3 writable stores (store definitions only)
- [ ] 06-03-PLAN.md — Upgrade game.ts + storage.ts to v2 schema with v1 migration
- [ ] 06-04-PLAN.md — Update TopBar.svelte discovery counter text per PROG-01

### Phase 7: Achievement Engine & Daily Logic

**Goal**: The game can detect milestone crossings, award badges, run a date-seeded daily challenge, and track a multi-day streak — all as headless engine logic with no UI coupling
**Depends on**: Phase 6
**Requirements**: ACHV-01, ACHV-02, ACHV-03, ACHV-04, DALY-02, DALY-03, DALY-04, STRK-02, STRK-03
**Success Criteria** (what must be TRUE):
  1. Discovering the 10th, 25th, 50th, and 61st elements each trigger exactly one badge award (no re-fire on repeat reactions or save import)
  2. The daily challenge target is identical for all players on the same calendar date and changes at midnight
  3. Completing today's daily challenge (creating the target element) is detected automatically with no extra player action
  4. Completed daily challenge state survives a page reload — the challenge does not re-appear as incomplete
  5. Completing a daily challenge on two consecutive calendar days increments the streak to 2; missing a day resets it to 0
  6. The chime sound plays through the Web Audio API without requiring page interaction beyond the normal React button tap (iOS-safe)
**Plans**: TBD

### Phase 8: Achievement & Daily UI

**Goal**: Players can see their discovery count pulse on milestones, open an achievement gallery, receive toast notifications on badge unlock, hear a mutable chime, view today's daily challenge, and see their streak
**Depends on**: Phase 7
**Requirements**: PROG-02, PROG-03, PROG-04, PROG-05, PROG-06, DALY-01, DALY-05, STRK-01
**Success Criteria** (what must be TRUE):
  1. When a milestone badge unlocks, the TopBar counter briefly pulses (visible animation, resolves within ~1s)
  2. Tapping the Achievements button in the BottomBar opens a full-screen gallery showing all 4 badges — earned ones display at full opacity with emoji, locked ones are dimmed with a lock icon
  3. When an achievement unlocks, a toast appears at the top of the screen with the badge emoji and name, then auto-dismisses after 2.5 seconds
  4. The achievement unlock chime can be muted via a toggle in the Settings panel — the setting persists across reloads
  5. On app launch, the current day's daily challenge is visible in the UI showing the target element name
  6. Completing today's daily challenge shows a distinct visual confirmation (different from the normal reaction result display)
  7. The player's current streak count is visible in the UI at all times
**Plans**: TBD
**UI hint**: yes

---

## Requirement Coverage

| Phase | Requirements | Count |
|-------|-------------|-------|
| Phase 6 | ACHV-05, ACHV-06, PROG-01, STRK-04 | 4 |
| Phase 7 | ACHV-01, ACHV-02, ACHV-03, ACHV-04, DALY-02, DALY-03, DALY-04, STRK-02, STRK-03 | 9 |
| Phase 8 | PROG-02, PROG-03, PROG-04, PROG-05, PROG-06, DALY-01, DALY-05, STRK-01 | 8 |

**Total:** 21 v2 requirements → 21 mapped → 0 unmapped ✓

---

## Progress Table

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 6. Data Foundation & Save Schema | 0/4 | Not started | - |
| 7. Achievement Engine & Daily Logic | 0/0 | Not started | - |
| 8. Achievement & Daily UI | 0/0 | Not started | - |

---

## Dependency Order

```
Phase 6 (Data Foundation & Save Schema)
  └─► Phase 7 (Achievement Engine & Daily Logic)  — needs stores + types + migration safe
        └─► Phase 8 (Achievement & Daily UI)       — needs engine to emit events + computed values
```

Phases must run sequentially — each depends on the previous being stable.
