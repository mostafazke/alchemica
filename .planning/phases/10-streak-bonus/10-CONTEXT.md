---
phase: 10-streak-bonus
status: ready-to-plan
discussed: 2026-05-03
requirements: [STRK-05, STRK-06]
---

# Context: Phase 10 — Streak Bonus

## Phase Goal

Players on an active daily streak gain a higher combo multiplier cap, visually surfaced in the UI.

## Decisions (LOCKED)

### D-01: Streak→Bonus Formula
**Linear: +1x per streak day, capped at +3x above the base 8x maximum**

| streakCount | Combo cap |
|-------------|-----------|
| 0           | 8x (base) |
| 1           | 9x        |
| 2           | 10x       |
| 3+          | 11x (max) |

Formula: `cap = Math.min(8 + streakCount, 11)`

Source: ROADMAP Phase 10 success criteria 1–2; user confirmed linear mapping.

### D-02: Visual Indicator
**Flame suffix on the TopBar combo display: `x9 🔥`**

- When `streakCount >= 1`: append `🔥` to combo display and apply a glow/color change (CSS)
- The emoji + color signals "streak bonus active" — no new UI element needed
- Reuses the existing `.stat.combo` span in `TopBar.svelte`
- No separate badge or new stat element

### D-03: Streak Break Timing
**Immediately — bonus cap drops as soon as `streakCount` drops to 0**

- Reactive: `streakCount` store changes → `comboMax` derived value updates immediately
- No grace period, no session carry-over
- Honest with the player, simple to implement

---

## Codebase Facts (for researcher/planner)

### Current combo cap location
`src/lib/game/reactions.ts` line 44:
```ts
const newCombo = wasSuccess ? Math.min(currentCombo + 1, 8) : 1;
```
The `8` is hardcoded. Phase 10 must make this reactive to `streakCount`.

### Streak store (already exists)
`src/lib/stores/achievements.ts` exports `streakCount: writable<number>(0)`.
No new store needed — just read `streakCount` in `reactions.ts`.

### TopBar.svelte (already shows combo)
`src/lib/components/TopBar.svelte` renders `<span class="stat combo">{$combo}</span>`.
The 🔥 indicator goes here — modify the span template.

### streakCount already persisted
`src/lib/utils/storage.ts` already saves/loads `streakCount`. No storage changes needed.

---

## Out of Scope (Phase 10)

- Streak notifications (DALY-06 — deferred to v4)
- Bonus applies to scoring only (combo × points) — no separate "streak score" display
- No new achievements for streak bonus (achievement system is Phase 7, closed)
- No changes to how streak days are counted (Phase 7 daily logic unchanged)

---

## Downstream Notes for Planner

1. **Minimal surface area:** Only `reactions.ts` (combo cap logic) and `TopBar.svelte` (display) need to change. `streakCount` store and persistence are already complete.
2. **Derived value approach:** Create a `$derived` or `get(streakCount)`-based `comboMax` in `reactions.ts` — don't put the cap inline again.
3. **Regression risk:** The combo cap change affects scoring — tests should verify that `streakCount=0` still produces the same 8x cap behavior.
4. **UI risk:** The flame emoji must not break the TopBar layout on small mobile viewports (375px). Verify in CSS.
