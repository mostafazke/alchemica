# Story 2.2: MixingSlot Component

Status: done

## Story

As a player,
I want the mixing slots to look and feel like glass vessels in the workshop,
So that filling a slot feels like placing an ingredient, not clicking a UI widget.

## Acceptance Criteria

1. **Given** `Slot.svelte` exists and must NOT be deleted
   **When** I create `src/lib/components/MixingSlot.svelte` alongside it
   **Then** it is **56×56px** with **8px border-radius**
   **And** it accepts props: `which: 'a' | 'b'`
   **And** it reads slot state from the existing `slots` store (`src/lib/stores/game.ts`)

2. **Given** the 4 visual states must be implemented
   **When** the component renders
   **Then** `empty` state: dashed border (`--color-border-mid`), "+" glyph centered, `--color-bg-deep` background
   **And** `filled` state: solid border (`--color-border-hot`), `--color-accent-dim` background, emoji + name
   **And** `ready` state: `filled` + synchronized breathe CSS animation (`@keyframes breathe`) — subtle scale oscillation 0.97→1.0, 2s loop
   **And** `reacting` state: scale pulse + shimmer (for Phase 2 wiring — CSS classes only in Phase 1)

3. **Given** the clear button
   **When** the slot is filled
   **Then** a ✕ clear button appears with a minimum **44×44px hit area**
   **And** clicking it updates `slots` store: `slots.update(s => ({ ...s, [which]: null }))`
   **And** it calls `playSlotClear()` from `src/lib/effects/sound.js` (guard with `soundMuted` store)
   **And** it calls `e.stopPropagation()`

4. **Given** the fill animation
   **When** an element is placed in the slot (key transitions from null → non-null)
   **Then** the icon animates: scale 0.6→1.0 over 180ms, opacity 0→1 over 180ms
   **And** it calls `playSlotPlace()` (guard with `soundMuted` store)
   **And** implementation uses CSS transition on a keyed `{#key elementKey}` block

5. **Given** `prefers-reduced-motion`
   **When** the OS setting is active
   **Then** the breathe animation does not run (handled globally by `app.css`)
   **And** fill animation transitions are still preserved (opacity is exempt per Architecture §5)

6. **Given** WCAG accessibility requirements
   **When** the component renders
   **Then** `role="button"` on the outer element (or `<button>`)
   **And** `aria-label` = `"Mixing slot A: {element name}"` when filled, `"Mixing slot A: empty"` when not
   **And** `aria-pressed` is NOT used (slot is not a toggle — use aria-label state description instead)
   **And** touch target ≥ 44×44px for the slot itself (56px inherent) and clear button (explicit min sizing)

## Tasks / Subtasks

- [x] Task 1: Create MixingSlot.svelte (AC: 1, 2, 3, 4, 5, 6)
  - [x] 1.1: Create `src/lib/components/MixingSlot.svelte` — NEW file alongside `Slot.svelte` (do NOT modify or delete `Slot.svelte`)
  - [x] 1.2: Props: `let { which }: { which: 'a' | 'b' } = $props()`
  - [x] 1.3: Derive element data: `const elementKey = $derived($slots[which])` and `const el = $derived(elementKey ? ELEMENTS[elementKey] : null)`
  - [x] 1.4: Implement 4 state classes: `empty` (default), `filled`, `ready`, `reacting` — driven by `$derived` from `el` value and a future `isReady` prop (stub as `false` for now)
  - [x] 1.5: Implement Layer 3 component tokens: `--slot-bg`, `--slot-border`, `--slot-border-style` (dashed/solid)
  - [x] 1.6: Implement `empty` state: dashed border, "+" glyph, `--color-bg-deep` bg
  - [x] 1.7: Implement `filled` state: solid `--color-border-hot` border, `--color-accent-dim` bg, emoji (20px) + name (11px `--text-micro`)
  - [x] 1.8: Implement `ready` state: `filled` + `@keyframes breathe` (scale 0.97→1.0, 2s infinite ease-in-out)
  - [x] 1.9: Implement `reacting` state CSS class only — scale pulse placeholder (no JS wiring needed in this story)
  - [x] 1.10: Implement clear button (✕) — visible only when `el` is not null, min 44×44px hit area, `e.stopPropagation()`, slot clear + sound
  - [x] 1.11: Implement fill animation using `{#key elementKey}` block wrapping the icon — CSS `transition: transform 180ms ease-out, opacity 180ms` + initial scale 0.6 / opacity 0 class applied on mount then removed
  - [x] 1.12: Add `aria-label` derived from slot state and element name
  - [x] 1.13: Sound calls: `playSlotPlace()` on fill ($effect watching key transition null→non-null), `playSlotClear()` on clear button click — both guarded with `get(soundMuted)` check

- [x] Task 2: Verify (AC: all)
  - [x] 2.1: `npx svelte-check --threshold error` — zero new errors introduced
  - [x] 2.2: Confirm `Slot.svelte` is untouched (no modifications, no deletions)
  - [x] 2.3: Confirm `MixingSlot.svelte` imports resolve: `ELEMENTS`, `slots`, `soundMuted`, `playSlotPlace`, `playSlotClear`

### Review Findings

- [x] [Review][Decision→Patch] `<div role="button" tabindex="0">` with no onclick/onkeydown — ARIA dead-end; outer slot is a display container in Phase 1, not directly interactive. Resolved: removed `role="button"` + `tabindex="0"` from outer div. Clear `<button>` inside retains correct semantics. [src/lib/components/MixingSlot.svelte]

## Dev Notes

### Critical Constraints

- **`Slot.svelte` MUST NOT be touched.** MixingSlot is created alongside it. Route consumers (`MixingChamber.svelte`) still import `Slot.svelte`. The route switch happens in Story 2.5 (TopBar Rewrite) or the final layout wiring story. For now, MixingSlot is a standalone file not yet imported anywhere.
- **Parallel creation strategy (AR1):** New components are created alongside old ones, NOT replacing them mid-sprint. Routes switch imports only after visual QA passes.
- **Svelte 5 runes required:** Use `$props()`, `$state()`, `$derived()`, `$effect()`. No Options API style.
- **No new stores.** MixingSlot reads from the existing `slots` writable store (`src/lib/stores/game.ts`). It does NOT create new state — it mirrors what already exists.

### Source Files to Read Before Implementing

| File | Why |
|------|-----|
| `src/lib/components/Slot.svelte` | Reference implementation — slots store usage, clear logic, sound calls, CSS layout pattern to surpass |
| `src/lib/stores/game.ts` | `slots` store (line 92): `writable<Slots>({ a: null, b: null })` |
| `src/lib/types.ts` | `Slots` interface (line 26): `{ a: string \| null; b: string \| null }` |
| `src/lib/effects/sound.js` | `playSlotPlace()` and `playSlotClear()` exports |
| `src/lib/stores/settings.js` | `soundMuted` store — guard all sound calls with `get(soundMuted)` |
| `src/lib/data/elements.js` | `ELEMENTS` record — used to derive `el` from `elementKey` |
| `src/app.css` | Layer 2 semantic tokens, `@media (prefers-reduced-motion)` global block |

### Existing Slot.svelte Pattern (Reference)

The current `Slot.svelte` is 80×80px, no animation, no aria. MixingSlot must:
- Shrink to 56×56px (matching ElementCard grid-tile size)
- Add fill animation via CSS transition on `{#key elementKey}` block
- Add breathe animation for `ready` state
- Add proper ARIA labelling
- Use Layer 3 CSS tokens for state variants

```svelte
<!-- Slot.svelte slot-clear pattern to replicate in MixingSlot -->
function clearSlot(e: MouseEvent) {
  e.stopPropagation();
  if (!get(soundMuted)) playSlotClear();
  slots.update((s) => ({ ...s, [which]: null }));
}
```

Sound guard pattern: `if (!get(soundMuted)) playSlotPlace();` — use `get()` from `svelte/store`, not a reactive subscription.

### Fill Animation Approach

Use a `{#key elementKey}` block so the element re-mounts when the key changes (null→value or value→new value). Apply an `entering` CSS class on mount via `$effect`, remove after one frame:

```svelte
<!-- Conceptual pattern — adapt to Svelte 5 -->
{#key elementKey}
  <div class="slot-icon {el.color} entering" use:enterAnim>{el.symbol}</div>
{/key}
```

Or simpler: use CSS `@keyframes slot-fill` triggered by the Svelte `transition:` directive on the icon element inside the `{#if el}` block. A Svelte `in:` transition (scale from 0.6, opacity 0) achieves the AC spec without JS.

**Recommended approach:** Svelte built-in `transition:scale` or `in:fly` from `svelte/transition` if allowed, or a hand-rolled CSS `@keyframes slot-enter` applied via `class:entering` cleared in `$effect`. Architecture says "CSS transitions" for slot fill — keep it CSS.

### Layer 3 Tokens to Define

```css
/* MixingSlot.svelte <style> */
.mixing-slot {
  --slot-bg: var(--color-bg-deep);
  --slot-border: var(--color-border-mid);
  --slot-border-style: dashed;
}
.mixing-slot.filled {
  --slot-bg: var(--color-accent-dim);
  --slot-border: var(--color-border-hot);
  --slot-border-style: solid;
}
/* Apply tokens */
.mixing-slot {
  background: var(--slot-bg);
  border: 2px var(--slot-border-style) var(--slot-border);
}
```

### Breathe Animation

```css
@keyframes breathe {
  0%, 100% { transform: scale(1.0); }
  50%       { transform: scale(0.97); }
}
.mixing-slot.ready {
  animation: breathe 2s ease-in-out infinite;
}
```

The global `prefers-reduced-motion` block in `app.css` already sets `animation-duration: 0.01ms !important` — the breathe animation automatically collapses without any per-component media query.

### ARIA Pattern

```svelte
<div
  class="mixing-slot"
  class:filled={!!el}
  class:ready={isReady}
  class:reacting={isReacting}
  role="button"
  tabindex="0"
  aria-label={el ? `Mixing slot ${which.toUpperCase()}: ${el.name}` : `Mixing slot ${which.toUpperCase()}: empty`}
>
```

Note: `which.toUpperCase()` → "A" or "B" for natural language label.

### What Story 2.3 Depends On

Story 2.3 (ActionZone) is independent of MixingSlot — they are sibling components. No API contract changes needed here that would block 2.3.

### Previous Story Learnings (Story 2.1)

- **TypeScript return type annotation on `$derived.by`:** When a derived's type includes a union member that is never returned (like `'power'`), TypeScript narrows the inferred type and flags impossible comparisons. Add explicit return type: `$derived.by((): 'empty' | 'filled' | 'ready' | 'reacting' => { ... })` if that pattern applies.
- **`--text-micro` token:** Use `font-size: var(--text-micro)` instead of hardcoded `11px` for all 11px text. Token is defined in `app.css:68`.
- **svelte-check pre-existing errors:** `vite.config.ts:75` and `DiscoveryBanner.svelte:81` are pre-existing errors — not regressions. Zero new errors is the bar.
- **Layer 3 token pattern confirmed:** Define defaults in base class rule, override in modifier classes. Works correctly in Svelte scoped styles.

### References

- Architecture §1 — Component file structure, parallel creation strategy [Source: `_bmad-output/planning-artifacts/architecture.md#1`]
- Architecture §2 — Runes vs stores decision table [Source: `_bmad-output/planning-artifacts/architecture.md#2`]
- Architecture §4 — CSS token layering, Layer 3 pattern [Source: `_bmad-output/planning-artifacts/architecture.md#4`]
- Architecture §5 — Animation system: CSS transitions table, breathe 2s loop, `prefers-reduced-motion` [Source: `_bmad-output/planning-artifacts/architecture.md#5`]
- Epics file Story 2.2 AC [Source: `_bmad-output/planning-artifacts/epics.md#Story-2-2`]
- Existing `Slot.svelte` [Source: `src/lib/components/Slot.svelte`]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6 (GitHub Copilot)

### Debug Log References

### Completion Notes List

- Created `src/lib/components/MixingSlot.svelte` — 56×56px, 8px radius, 4 CSS states, Layer 3 tokens
- Fill animation via `{#key elementKey}` + `@keyframes slot-enter` (scale 0.6→1.0, opacity 0→1, 180ms)
- Breathe animation via `@keyframes breathe` (scale 0.97→1.0, 2s loop) on `.ready` class — auto-collapses via `prefers-reduced-motion` global block in `app.css`
- Reacting state: `@keyframes slot-pulse` CSS stub, no JS wiring (future story)
- `--text-micro` token used for `slot-name` (learned from Story 2.1 CR)
- `Slot.svelte` not touched — only pre-existing Story 1.1 token changes present in git diff
- svelte-check: 2 errors (pre-existing vite.config.ts + DiscoveryBanner.svelte), 0 new errors
- `playSlotPlace()` / `playSlotClear()` found in `src/lib/effects/sound.ts` (not .js); `soundMuted` in `src/lib/stores/settings.ts`

### File List

- `src/lib/components/MixingSlot.svelte` (NEW)
