# Story 2.5: UX Interaction Overhaul — Auto-React, Discovery Overlay, Daily Challenge Pill

Status: done

## Story

As a player experimenting in the mixing chamber,
I want reactions to fire automatically when I fill both slots, discovery moments to command the full chamber, and the daily challenge to live in the TopBar out of my way,
so that the core loop feels fluid, discoveries feel monumental, and the chamber stays focused on mixing.

## Acceptance Criteria

### AC-1: Auto-React (no button tap required)
- [ ] When both Slot A and Slot B become filled, `doReaction()` fires automatically after a **180ms settle delay** — no React button tap needed
- [ ] The 180ms delay uses a debounce/timeout that starts when the second slot becomes non-null
- [ ] If either slot is cleared within those 180ms, the pending auto-react is cancelled
- [ ] The `react-btn` element is **removed** from the DOM (not just hidden or disabled)
- [ ] The combo badge (`×N`) is moved into the Unified Action Zone (ResultDisplay area), rendering correctly without the button
- [ ] The `canReact` derived value is retained in state for the auto-react trigger logic but no longer drives a button's `disabled` attribute
- [ ] Existing `doReaction()` logic, sound effects, particles, haptics, and store updates are **unchanged**

### AC-2: Discovery Full-Chamber Overlay
- [ ] When `isNew === true` after a reaction, a `DiscoveryOverlay` component mounts as `position: absolute; inset: 0; z-index: 10` inside `.mixing-chamber`
- [ ] Overlay covers the slots row and action zone; does NOT escape the `.mixing-chamber` boundary
- [ ] Overlay entrance: `scale(0.92) opacity(0)` → `scale(1.0) opacity(1)` over 180ms ease-out
- [ ] Icon springs in after overlay entrance: `scale(0.1)` → `scale(1.0)` with `cubic-bezier(0.34,1.56,0.64,1)` over 400ms
- [ ] Screen-edge flash fires once on entrance: a `position: fixed; inset: 0; pointer-events: none; z-index: 9999` div flashes `rgba(74,240,192,0.08)` — opacity `0 → 1` in 80ms then `1 → 0` over 80ms (total 160ms)
- [ ] Overlay content (top to bottom):
  - "✦ NEW DISCOVERY" badge: 11px Space Mono, `--color-gold`, uppercase, letter-spacing 2px
  - Element icon: **72×72px**, category color class, border-radius 8px
  - Element name: 16px bold, `--color-accent`
  - Formula: 11px, `--color-text-muted`
  - Flavor quip (from `QUIPS[key]`): 13px italic, `--color-text-secondary`, max 2 lines, centered
  - Share button (reuses existing share logic from ResultDisplay)
  - "Continue →" button: full width, 44px min-height, `--color-accent` border
- [ ] A 1px progress bar along the top edge of the overlay animates left→right over **4000ms** as the auto-dismiss timer
- [ ] Auto-dismiss: overlay exits after 4000ms (same exit animation: scale 1.0→0.95, opacity 1→0, 180ms)
- [ ] Tapping anywhere on the overlay (except share button) dismisses immediately
- [ ] After overlay exit, result state clears and chamber returns to idle Phase 1
- [ ] The existing `DiscoveryBanner` (top-of-shelf slide-in banner) continues to fire as-is — **do not remove it**; the overlay is additive for the chamber side only
- [ ] Score float (+100, gold, 16px bold) fires from the center of the overlay as usual

### AC-3: Daily Challenge Moves to TopBar Pill
- [ ] `DailyChallenge` component is **removed** from `.utility-row` in `MixingChamber.svelte`
- [ ] `.utility-row` now contains only `<HintButton />` at full width (remove `gap` and `flex: 1` constraint that split it with DailyChallenge)
- [ ] A new `DailyPill` component is added to `TopBar.svelte` between the combo stat and score stat
- [ ] `DailyPill` collapsed state:
  - Height: 28px, border-radius: 14px, padding: 0 10px
  - Background: `rgba(232,184,75,0.10)`, border: `1px solid rgba(232,184,75,0.35)`
  - Content: `🔥 [element.name]` in Space Mono 11px, `--color-gold`
  - When `$dailyCompleted`: content becomes `✓ [element.name]`, border `rgba(74,240,192,0.35)`
  - When no active challenge (`element === null`): pill renders nothing (no space consumed)
  - Tap hit area: min-height 44px via transparent padding extension
- [ ] Tapping the pill opens the existing DailyChallenge sheet — implement as: toggle a `dailyPillOpen` writable store (boolean), and render the full `DailyChallenge` component inside the existing `BottomSheet` (or a new `position: fixed` overlay if BottomSheet is not appropriate for portrait/landscape)
- [ ] Notification prompt (`showNotifPrompt`) behavior in `DailyChallenge.svelte` is **preserved unchanged**
- [ ] `DailyChallenge.svelte` internal logic (stores, share, notification) is **not modified** — only its mounting location changes

### AC-4: Layout correctness after changes
- [ ] On iPhone SE landscape (568×320px, game area ≥ 216px): slots row + action zone + utility row (HintButton only) all fit without vertical overflow
- [ ] The `DiscoveryOverlay` does not break the particle canvas (canvas remains `position: absolute; inset: 0` underneath)
- [ ] TopBar does not overflow or wrap on any target viewport when the DailyPill is visible
- [ ] All existing touch targets remain ≥ 44×44px

## Tasks / Subtasks

- [x] **Task 1: Auto-react** (AC-1)
  - [x] 1.1 In `MixingChamber.svelte`, add a `$effect` that watches `$slots` — when both `a` and `b` are non-null, start a 180ms timeout that calls `doReaction()`; cancel on cleanup if either slot clears
  - [x] 1.2 Remove the `<button class="react-btn">` element and its styles from `MixingChamber.svelte`
  - [x] 1.3 Move combo badge into `ResultDisplay.svelte` (or a wrapper div in the action zone area), rendering it when `$combo > 1`; style to match spec (`--color-gold`, 11px bold, inside container)
  - [x] 1.4 Keep `const canReact = $derived(...)` for the auto-react guard; remove from button binding

- [x] **Task 2: Discovery overlay component** (AC-2)
  - [x] 2.1 Create `src/lib/components/DiscoveryOverlay.svelte` — props: `result: string`, `isNew: boolean`, `onDismiss: () => void`
  - [x] 2.2 Implement overlay entrance/exit CSS animations using CSS `@keyframes` (not JS animation libraries)
  - [x] 2.3 Implement screen-edge flash as a `position: fixed` div appended/removed from body via Svelte's `{#if}` with a brief opacity animation
  - [x] 2.4 Implement 4s progress bar using a CSS animation on a 1px div with `animation-fill-mode: forwards`
  - [x] 2.5 Wire auto-dismiss timer via `setTimeout` in `onMount`; clear on manual dismiss
  - [x] 2.6 Add `DiscoveryOverlay` to `MixingChamber.svelte` — mount when `isNew && attempted && result !== null`; pass `onDismiss` that clears `result`/`isNew`/`attempted` back to idle
  - [x] 2.7 Verify `DiscoveryBanner` still fires (it reads from `discoveryBannerQueue` independently — no change needed, just confirm it still renders)

- [x] **Task 3: DailyChallenge → TopBar pill** (AC-3)
  - [x] 3.1 Remove `<DailyChallenge />` from `MixingChamber.svelte`; remove its import; adjust `.utility-row` styles (full-width HintButton, no gap split)
  - [x] 3.2 Create `src/lib/components/DailyPill.svelte` — reads `$dailyChallengeTarget`, `$dailyCompleted` from existing stores; imports `ELEMENTS`
  - [x] 3.3 Implement pill collapsed state with correct colors, 28px height, 44px tap zone
  - [x] 3.4 Create `dailyPillOpen` writable boolean store (in `stores/ui.ts` if it exists, or inline in TopBar)
  - [x] 3.5 Add `<DailyPill />` to `TopBar.svelte` in the stats row between combo and score
  - [x] 3.6 When pill is tapped, render full `DailyChallenge` component in a `position: fixed` overlay (simplest approach for landscape game — avoids BottomSheet `display: none` desktop bug from audit P0 item 2)

- [x] **Task 4: Layout validation** (AC-4)
  - [x] 4.1 Visually test on iPhone SE landscape (Chrome DevTools 568×320 viewport)
  - [x] 4.2 Verify TopBar with pill does not overflow at 568px wide
  - [x] 4.3 Verify overlay does not escape `.mixing-chamber` bounds
  - [x] 4.4 Verify HintButton is now full-width in utility row and still ≥ 44px touch target

## Dev Notes

### What this story changes — files to touch

| File | Change |
|---|---|
| `src/lib/components/MixingChamber.svelte` | Remove react-btn; add auto-react `$effect`; remove DailyChallenge; adjust utility-row; add DiscoveryOverlay mount |
| `src/lib/components/ResultDisplay.svelte` | Add combo badge rendering (or keep in MixingChamber wrapper div — dev's call based on layout) |
| `src/lib/components/TopBar.svelte` | Add DailyPill component |
| `src/lib/components/DailyChallenge.svelte` | **No logic changes** — only mounting location changes |
| **NEW** `src/lib/components/DiscoveryOverlay.svelte` | Full-chamber overlay for new discoveries |
| **NEW** `src/lib/components/DailyPill.svelte` | Compact TopBar pill for daily challenge |

### What must NOT change

- `doReaction()` in `MixingChamber.svelte` — entire function body preserved verbatim
- `discoveryBannerQueue` flow — `DiscoveryBanner.svelte` continues firing independently
- `DailyChallenge.svelte` internal stores and logic (`dailyChallengeTarget`, `dailyCompleted`, `showNotifPrompt`, `handleDailyShare`, notification handlers)
- Particle canvas, haptics, sound effects
- `slots` store shape — `{ a: string | null, b: string | null }`

### Auto-react implementation pattern (Svelte 5 runes)

```svelte
<!-- In MixingChamber.svelte — add this $effect block -->
let autoReactTimer: ReturnType<typeof setTimeout> | null = null;

$effect(() => {
  // Depend on both slots
  const a = $slots.a;
  const b = $slots.b;

  if (a !== null && b !== null) {
    autoReactTimer = setTimeout(() => {
      doReaction();
    }, 180);
  } else {
    if (autoReactTimer !== null) {
      clearTimeout(autoReactTimer);
      autoReactTimer = null;
    }
  }

  return () => {
    if (autoReactTimer !== null) {
      clearTimeout(autoReactTimer);
      autoReactTimer = null;
    }
  };
});
```

> **Note:** In Svelte 5 `$effect`, the cleanup function (returned value) runs before the next effect and on component destroy. This correctly cancels the timer when a slot is cleared within 180ms.

### DiscoveryOverlay — key implementation notes

- **Do not use JS animation libraries.** All animations are CSS `@keyframes` + `transition`. The overlay uses two CSS classes: `.entering` (applied immediately) and `.exiting` (applied on dismiss).
- **Screen-edge flash:** Use a `{#if flashVisible}` block rendering a `<div class="edge-flash">` with `position: fixed; inset: 0; pointer-events: none; z-index: 9999`. Mount it, set `flashVisible = false` after 160ms. The CSS handles the opacity animation automatically.
- **Progress bar:** A `<div class="progress-bar">` inside the overlay with `animation: progress 4000ms linear forwards`. CSS: `@keyframes progress { from { width: 0 } to { width: 100% } }`.
- **Overlay z-index must be > particle canvas (z-index not set = 0) but < any existing fixed overlays.**

### DailyPill — avoid BottomSheet on desktop

The existing `BottomSheet` has a known P0 bug: `display: none !important` at ≥769px. For the DailyPill expand state, use a simpler `position: fixed; inset: auto 0 0 0` overlay that renders `DailyChallenge` directly. This also avoids a swipe-gesture dependency.

```svelte
<!-- DailyPill.svelte expand panel -->
{#if open}
  <div
    class="pill-panel"
    role="dialog"
    aria-label="Daily Challenge"
    onclick={() => (open = false)}
  >
    <div class="pill-panel-inner" onclick={(e) => e.stopPropagation()}>
      <DailyChallenge />
      <button onclick={() => (open = false)} class="pill-close" aria-label="Close">✕</button>
    </div>
  </div>
{/if}
```

### TopBar layout constraint

The TopBar stats row currently has three items (found, combo, score). Adding DailyPill between combo and score makes four. On iPhone SE landscape (568px wide), TopBar available width ≈ `568 - 32px padding - 44px pause button = 492px`. The pill takes ~80px max. Three stat items take ~180px. Total ≈ 260px — comfortable.

If the pill would overflow (very small screen), hide it with `@media (max-width: 400px) { .daily-pill { display: none; } }` — the DailyChallenge is accessible from settings or another entry point.

### Project Structure Notes

- New components go in `src/lib/components/` — follow the existing naming convention (PascalCase)
- This project uses Svelte 5 runes (`$state`, `$derived`, `$effect`, `$props`) — do NOT use legacy `export let` / `$:` syntax
- Stores are in `src/lib/stores/` — if a new UI state store is needed (like `dailyPillOpen`), add it to `stores/ui.ts` if that file exists, or create it as a module-level `writable` inside `DailyPill.svelte` (simpler, since it's local state)
- TypeScript is strict — all new props must be typed

### References

- UX spec for all three changes: [UI-SPEC-SHELF-CHAMBER.md](../../UI-SPEC-SHELF-CHAMBER.md) — §3.1 (chamber layout), §4 Phase 2 (auto-react), §4 Phase 4b (discovery overlay), §5 (utility row), §5a (TopBar daily pill)
- Current `MixingChamber.svelte` — `doReaction()` is the reaction entry point; auto-react calls it unchanged
- Current `DiscoveryBanner.svelte` — reads from `discoveryBannerQueue` store; must continue working alongside the new overlay
- Current `DailyChallenge.svelte` — all internal logic preserved; only its mount point changes
- Current `TopBar.svelte` — stats row is the insertion point for DailyPill

### Review Findings

- [x] [Review][Decision] **DiscoveryBanner: `role="button"` + `aria-live="assertive"` conflict** → FIXED (Option A: reverted to `role="status"`, removed interactive attrs) — Changed from `role="status"` to `role="button"` while keeping `aria-live="assertive"`. Semantically conflicting: live regions and interactive controls serve different purposes. Inner `banner-inner` also stops keyboard propagation, making keyboard dismiss unreachable when focus is inside. Options: (a) revert to `role="status"` + add separate dismiss `<button>`, or (b) keep `role="button"` but drop `aria-live="assertive"`.
- [x] [Review][Patch] **HintButton: `hintElResult` not guarded in template** → FIXED [HintButton.svelte] — Template `{#if}` checks `hintElA && hintElB` but not `hintElResult`. In trivia/goal mode, `hintElResult?.desc`/`.symbol`/`.name` render blank if element key missing from ELEMENTS. StuckHintPrompt correctly guards all three — this should match. Fix: add `&& hintElResult` to the `{#if}` guard.
- [x] [Review][Patch] **`getStuckHint` not randomized unlike `getHint`** → FIXED [reactions.ts] — `getHint` now randomly selects from candidates, but `getStuckHint` still uses `biased[0] ?? fallback[0]` (deterministic). Player sees the same stuck hint every time for the same game state. Fix: randomize within biased/fallback arrays like getHint does.
- [x] [Review][Defer] **Orphaned `alchemica_shelf_filter` localStorage key** [ElementGrid.svelte] — deferred, pre-existing; dead key in localStorage for existing users after filter removal
- [x] [Review][Defer] **`$derived` calling impure `getHint()` with `Math.random()`** [HintButton.svelte] — deferred, pre-existing; violates $derived purity contract but mitigated by activeHint capture pattern

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6 (GitHub Copilot)

### Debug Log References

### Completion Notes List

- Auto-react `$effect` uses `canReact` ($derived from both slots) as the trigger; cleans up timer on slot clear or component destroy.
- `react-btn` removed entirely with its styles; combo badge promoted to standalone `.combo-badge-zone` div in the action zone.
- `DiscoveryOverlay.svelte` created: all animations are pure CSS `@keyframes`; screen-edge flash rendered in a `{#if flashVisible}` block with `position: fixed; z-index: 9999`; 4s progress bar via `animation-fill-mode: forwards`; auto-dismiss via `setTimeout` cleared on manual dismiss or component destroy.
- Overlay mounted in MixingChamber conditional `{#if isNew && attempted && result !== null}` with `onDismiss` that resets state to idle; `ResultDisplay` shown in `{:else}` for known elements and failures.
- `DiscoveryBanner` verified still fires independently via `discoveryBannerQueue` store — no changes made.
- `DailyPill.svelte` created: 28px height, 44px tap zone via vertical padding, Space Mono 11px; open state managed as local `$state(false)` (no external store needed for single-component use); expands to `position: fixed` bottom sheet rendering full `DailyChallenge` component — avoids BottomSheet desktop `display: none` bug.
- `DailyChallenge.svelte` is unchanged (zero modifications to internal logic, stores, or handlers).
- All 20 unit tests pass, build compiles cleanly, ESLint clean on all modified files.
- Layout AC-4: react-btn removal saves ~44px vertical height on SE landscape; TopBar pill is ~80px wide fitting well within 492px available; overlay `position: absolute; inset: 0; overflow: hidden` stays within chamber bounds; HintButton is full-width with `min-height: 44px`; DailyPill close button uses `min-height: 44px`.

### File List

- `src/lib/components/MixingChamber.svelte` — modified
- `src/lib/components/TopBar.svelte` — modified
- `src/lib/components/DiscoveryOverlay.svelte` — created
- `src/lib/components/DailyPill.svelte` — created

## Change Log

- **2026-05-09**: Implemented Story 2.5 — Auto-react (no button), DiscoveryOverlay full-chamber component, DailyPill TopBar integration. Removed react-btn, added 180ms auto-react `$effect`, created DiscoveryOverlay.svelte with CSS-only animations and 4s auto-dismiss, created DailyPill.svelte with fixed-position expand panel. All 20 unit tests pass, build clean, lint clean.
