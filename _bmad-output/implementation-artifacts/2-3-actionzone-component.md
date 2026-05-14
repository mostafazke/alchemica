# Story 2.3: ActionZone Component

Status: done

## Story

As a player,
I want the result area to transform in place (like Duolingo) with "Not yet" failure language,
So that results feel like the room responding, not a database reporting.

## Acceptance Criteria

1. **Given** `ResultDisplay.svelte` exists and must NOT be deleted
   **When** I create `src/lib/components/ActionZone.svelte` alongside it
   **Then** it is a new standalone file, not modifying `ResultDisplay.svelte`

2. **Given** the 4 visual states must be implemented
   **When** the component renders based on the `state` and `result` props
   **Then** `idle` state: centred italic text "Tap two elements to combine" in `--color-text-muted`
   **And** `discovery` state: emoji + "✦ NEW: {name}" in `--color-accent` + "+N pts" float animation
   **And** `known` state: emoji + name + recipe in `--color-text-primary` + "+N pts" float animation (dimmer)
   **And** `failure` state: italic "Not yet…" in `--color-text-secondary` — never red, never "No Reaction"
   **And** all state transitions happen in place with no layout shift (fixed container height)
   **And** `aria-live="assertive"` wraps discovery content, `aria-live="polite"` wraps known content

3. **Given** the "+N pts" float animation
   **When** a result (discovery or known) is shown
   **Then** a "+N pts" label floats upward via `@keyframes float-up` over 600ms then fades out
   **And** the float animation triggers on each new result (keyed to a changing value)
   **And** discovery points show brighter (`--color-accent`), known points show dimmer (`--color-text-muted`)

4. **Given** the component API
   **When** used by a parent
   **Then** it accepts: `state: 'idle' | 'discovery' | 'known' | 'failure'`, `result: string | null`, `pts: number`
   **And** `result` is the element key (used to look up `ELEMENTS[result]` internally)
   **And** `pts` defaults to 0 — parent passes the score delta so ActionZone doesn't need to compute it

5. **Given** WCAG accessibility requirements
   **When** the component renders
   **Then** `aria-live="assertive"` is on the discovery content region
   **And** `aria-live="polite"` is on the known/failure content region
   **And** all text meets minimum `--text-micro` (11px) size
   **And** the float "+N pts" animation respects `prefers-reduced-motion` (collapses via global `app.css` rule)

## Tasks / Subtasks

- [x] Task 1: Create ActionZone.svelte (AC: 1, 2, 3, 4, 5)
  - [x] 1.1: Create `src/lib/components/ActionZone.svelte` — NEW file alongside `ResultDisplay.svelte` (do NOT modify or delete `ResultDisplay.svelte`)
  - [x] 1.2: Props: `let { state: zoneState = 'idle', result = null, pts = 0 }: { state?: 'idle' | 'discovery' | 'known' | 'failure'; result?: string | null; pts?: number } = $props()` (prop aliased internally to avoid `$state` rune naming collision)
  - [x] 1.3: Derive element data: `const el = $derived(result ? ELEMENTS[result] : null)`
  - [x] 1.4: Implement fixed-height container (min-height set to accommodate tallest state without layout shift)
  - [x] 1.5: Implement Layer 3 component tokens: `--zone-bg`, `--zone-border`
  - [x] 1.6: Implement `idle` state: centred italic text in `--color-text-muted`
  - [x] 1.7: Implement `discovery` state: emoji (large, ~28px) + "✦ NEW: {name}" in `--color-accent` + pts float — use `aria-live="assertive"` wrapper
  - [x] 1.8: Implement `known` state: emoji + name + recipe in `--color-text-primary` + pts float (dimmer) — use `aria-live="polite"` wrapper
  - [x] 1.9: Implement `failure` state: italic "Not yet…" in `--color-text-secondary` — zero red, zero "No Reaction" language — use `aria-live="polite"` wrapper
  - [x] 1.10: Implement `@keyframes float-up` — translateY upward (~20px) + opacity 0→1→0 over 600ms, triggered by `{#key}` on a float element when state is discovery or known
  - [x] 1.11: Verify `pts` float renders correctly for discovery (bright `--color-accent`) vs known (muted `--color-text-muted`)

- [x] Task 2: Verify (AC: all)
  - [x] 2.1: `npx svelte-check --threshold error` — zero new errors (2 errors pre-existing, unchanged)
  - [x] 2.2: Confirm `ResultDisplay.svelte` is untouched (no modifications, no deletions)
  - [x] 2.3: Confirm `ActionZone.svelte` imports resolve: `ELEMENTS`

## Dev Notes

### Critical Constraints

- **`ResultDisplay.svelte` MUST NOT be touched.** ActionZone is created alongside it. The route switch from ResultDisplay → ActionZone happens in Story 2.5 (TopBar Rewrite) or the final layout wiring story.
- **Parallel creation strategy (AR1):** New components are created alongside old ones — NOT replacing them. ActionZone.svelte will not be imported anywhere until visual QA passes.
- **Svelte 5 runes required:** Use `$props()`, `$state()`, `$derived()`, `$effect()`. No Options API.
- **No score computation inside ActionZone.** The `pts` prop is passed in from the parent. ActionZone is display-only — it does not import `score`, `combo`, or `reactions`.
- **No "No Reaction" language.** Failure state says "Not yet…" (with ellipsis). Parent selects from a variety of soft failure messages if desired — or ActionZone owns a static set.
- **No red in failure state.** Colors: `--color-text-secondary` for text, `--color-border-subtle` for border. Never `--color-danger`, never raw red hex.

### How Points Work in the Current System

From `src/lib/game/reactions.ts` (line 115):
- Discovery: `score.update(s => s + 100 * newCombo)` — pts = 100 × combo multiplier
- Known reaction: no score awarded (pts = 0)
- Failure: no score change

When ActionZone is wired into MixingChamber (future story), the parent will compute `pts` and pass it. For now, the component just displays whatever `pts` it receives.

### Existing ResultDisplay.svelte — What ActionZone Replaces

Current `ResultDisplay.svelte` props: `result?: string | null`, `isNew?: boolean`, `attempted?: boolean`

ActionZone simplifies the API — the parent controls `state` directly instead of deriving it from `isNew + attempted` booleans. The parent is responsible for translating reaction outcome → `'discovery' | 'known' | 'failure' | 'idle'`.

Current failure messages to NOT reuse (they violate AC — some say "No reaction"):
```
'No reaction detected…'          ← banned
'These elements repel each other!' ← acceptable style, can inspire variants
'Nothing happened. Try another combo.' ← acceptable
'Hmm, incompatible substances.'   ← acceptable
```

Soft failure messages for ActionZone (store as const array, pick randomly on state change):
```typescript
const FAIL_MSGS = [
  'Not yet…',
  'These don\'t react…',
  'Something\'s missing…',
  'Almost — try another path.',
];
```

### Container Height Strategy

Fixed height prevents layout shift between states. Use `min-height` that fits the tallest state (discovery). Approx 80px. The container uses `display: flex; flex-direction: column; align-items: center; justify-content: center`.

### Float-Up Animation Pattern

```css
@keyframes float-up {
  0%   { transform: translateY(0);    opacity: 1; }
  60%  { transform: translateY(-16px); opacity: 1; }
  100% { transform: translateY(-20px); opacity: 0; }
}
.pts-float {
  animation: float-up 600ms ease-out forwards;
  position: absolute;
  pointer-events: none;
  font-size: var(--text-micro);
  font-weight: 700;
}
```

Trigger by wrapping the pts span in `{#key result}` (or a separate counter that increments on each new result). The container should be `position: relative` so the float doesn't escape.

### aria-live Pattern

```svelte
<!-- Two separate live regions — browser handles announcements correctly -->
<div aria-live="assertive" aria-atomic="true">
  {#if state === 'discovery'}
    <!-- discovery content -->
  {/if}
</div>
<div aria-live="polite" aria-atomic="true">
  {#if state === 'known' || state === 'failure'}
    <!-- known / failure content -->
  {/if}
</div>
```

Both live regions are always in the DOM (not conditionally rendered). Only their content changes. This ensures the live region is registered before content changes, which is required for reliable screen reader announcements.

### Layer 3 Tokens

```css
.action-zone {
  --zone-bg: var(--color-bg-surface);
  --zone-border: var(--color-border-subtle);
}
.action-zone.discovery {
  --zone-border: var(--color-border-hot);
}
.action-zone.failure {
  --zone-border: var(--color-border-subtle); /* never red */
}
```

### Previous Story Learnings

- **`--text-micro` token:** Use `font-size: var(--text-micro)` instead of hardcoded `11px`.
- **`$derived.by` return type annotation:** Add explicit return type if TypeScript narrows union unexpectedly.
- **`aria-live` regions:** Must always be in the DOM before content is inserted — wrap the conditional `{#if}` block inside the live region, not vice versa.
- **`role="button"` anti-pattern:** Avoid adding `role="button"` to passive display containers (learned in Story 2.2 CR).

### Source Files to Read Before Implementing

| File | Why |
|------|-----|
| `src/lib/components/ResultDisplay.svelte` | Reference — current 4-state logic, animation approach, failure message pattern |
| `src/lib/data/elements.js` (`.ts`) | `ELEMENTS` record — `el.symbol`, `el.name`, `el.formula`, `el.recipe` |
| `src/lib/game/reactions.ts` line 98–145 | How pts are computed (100 × combo for discovery, 0 for known) |
| `src/lib/components/MixingChamber.svelte` | How ResultDisplay is currently wired — `{result}`, `{isNew}`, `{attempted}` props |
| `src/app.css` | Layer 2 tokens, `@media (prefers-reduced-motion)` global block |

### What Story 2.5 Depends On

Story 2.5 (TopBar Rewrite) will wire ActionZone into MixingChamber — replacing `<ResultDisplay>` with `<ActionZone state={...} result={...} pts={...}>`. ActionZone must be drop-in ready with a stable prop API after this story.

### References

- Architecture §1 — Parallel creation strategy [Source: `_bmad-output/planning-artifacts/architecture.md#1`]
- Architecture §4 — CSS token layering, Layer 3 pattern [Source: `_bmad-output/planning-artifacts/architecture.md#4`]
- Architecture §5 — Animation: `@keyframes float-up` (600ms) [Source: `_bmad-output/planning-artifacts/architecture.md#5`]
- Epics file Story 2.3 AC [Source: `_bmad-output/planning-artifacts/epics.md#Story-2-3`]
- Existing `ResultDisplay.svelte` [Source: `src/lib/components/ResultDisplay.svelte`]
- Reactions scoring [Source: `src/lib/game/reactions.ts#98`]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6 (GitHub Copilot)

### Debug Log References

### Completion Notes List

- **Prop alias pattern**: `state` prop aliased to `zoneState` internally (`let { state: zoneState } = $props()`) because naming a prop `state` causes Svelte's svelte-check to misinterpret `$state(...)` rune calls as legacy auto-store-subscriptions on the `state` variable. External API remains `state`.
- **Simplified $effect**: Removed `prevState` tracking; `$effect(() => { if (zoneState === 'failure') failMsg = randomMsg; })` is sufficient — the effect re-runs only when `zoneState` changes.
- **`$state<T>` generic not supported**: Used `let x = $state(initialValue)` (inferred) rather than `$state<Type>()` — svelte-check throws TS2347 ("Untyped function calls may not accept type arguments") with generic syntax.
- **`display: contents`** on `.live-region`: Keeps two always-present live regions in the DOM (required for reliable SR announcements) without affecting layout — content renders as if inline in the parent flex container.

### File List

- `src/lib/components/ActionZone.svelte` — created
