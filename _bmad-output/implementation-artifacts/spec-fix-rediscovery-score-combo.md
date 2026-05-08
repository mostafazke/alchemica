---
title: 'Fix: no score or combo increase on re-discovery'
type: 'bugfix'
created: '2026-05-08'
status: 'done'
route: 'one-shot'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** When a player produces an already-discovered element, `applyReaction` was awarding 10 × combo points and incrementing the combo multiplier — both visible in the TopBar score and the combo badge on the React button.

**Approach:** Move the score and combo updates inside the `isNew` branch so only genuine new discoveries award points and advance the combo. `lastSuccess` is still set to `true` for re-discoveries so the chain stays alive for a future new element.

</frozen-after-approval>

## Code Map

- `src/lib/game/reactions.ts` -- `applyReaction` — sole site of the bug and the fix

## Suggested Review Order

1. [reactions.ts — applyReaction](../../src/lib/game/reactions.ts) — core change: `cap`, `newCombo`, `combo.set`, and `score.update` moved inside `isNew` branch; `lastSuccess.set(true)` kept unconditional
