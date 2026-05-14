# Story 3-3: MixingChamber Integration & Route Switch

**Epic:** Epic 3 — Animation & Integration
**Status:** ready-for-dev
**Priority:** P1 — completes Epic 3; required before any full end-to-end testing

---

## Story

As a player,
I want to play the fully redesigned game with all new components wired together,
so that the warm workshop experience — now in its sunlit parchment form — is complete end-to-end.

> **Path D Note:** This story is spec'd for the approved light theme direction (2026-05-14 sprint change). The DiscoveryOverlay backdrop (currently `rgba(0,0,0,0.85)` from Story 3.2) remains as-is in this story — Story 4.3 redesigns it for the light theme. The wiring here is theme-agnostic; components auto-adapt via tokens.

---

## Acceptance Criteria

**AC1 — MixingChamber becomes a layout shell with canvas ownership**

- MixingChamber.svelte is refactored so that it:
  - Owns the `<canvas>` element and creates `AnimationController` on mount
  - Provides the controller via `setContext('animationController', controller)` so children can call animation methods
  - Imports and renders: `ShelfGrid` (left panel), `MixingSlot ×2` + `ActionZone` (center/right panel)
  - Retains all existing reaction logic (`doReaction`, `applyReaction`, `canReact` derived, auto-react timer, `$effect`)
  - Retains all existing haptic, sound, and store update calls
  - Retains `contracting` class on world-contract animation

**AC2 — Canvas and AnimationController wired correctly**

- `canvasEl` is bound to the `<canvas>` element in MixingChamber template
- `AnimationController` is instantiated on mount: `const ac = new AnimationController(canvasEl); setContext('animationController', ac)`
- Controller is available before any child `onMount` calls (Svelte guarantees parent mount before child mount — but children access via `getContext` at init time, not in `onMount`, so this is safe)
- On component destroy, `controller.destroy()` is called if the controller exposes that method (check `animation-controller.ts`)
- `getContext` calls in `DiscoveryOverlay` (Story 3.2) and `MixingChamber` itself (world-contract shimmer) now resolve to the live controller

**AC3 — MixingSlot props wired for ready/reacting states**

- MixingChamber passes `isReady={canReact}` to both MixingSlot instances
  - When `canReact` is true (both slots filled), both slots enter `ready` state (breathe animation — already CSS-implemented in Story 2.2)
- MixingChamber passes `isReacting={contracting}` to both MixingSlot instances
  - During the 360ms world-contract window, both slots enter `reacting` state
- Fill/clear event handlers already use the `slots` store — no additional wiring needed (Slot.svelte→MixingSlot.svelte uses same store interface)

**AC4 — ActionZone receives reaction results**

- MixingChamber passes the reaction state to ActionZone as props:
  ```
  <ActionZone {result} {isNew} {attempted} />
  ```
  where `result: string | null`, `isNew: boolean`, `attempted: boolean`
- ActionZone derives its display state from these props (already implemented in Story 2.3)
- The `ResultDisplay` import is replaced by `ActionZone`; `ResultDisplay.svelte` is NOT deleted yet

**AC5 — Frequency store wired on successful reaction**

- When `doReaction()` fires and `reaction.result` is non-null:
  - `incrementFrequency($slots.a)` is called
  - `incrementFrequency($slots.b)` is called
  - Import: `import { incrementFrequency } from '../stores/frequency.js'`
- This enables ElementCard energy states (fresh/settled/power) to update in real time

**AC6 — Route switch in `game/+page.svelte`**

- `ElementGrid` import replaced with `ShelfGrid`
- `DiscoveryBanner` import removed (now rendered inside ShelfGrid or as standalone — check current ShelfGrid.svelte for whether it includes DiscoveryBanner; if not, keep it in the route)
- `MixingChamber` import stays — it is now the full layout shell
- Any top-level layout restructuring needed for the new shell (MixingChamber now owns its canvas, so the route no longer needs to provide a canvas mount point)
- All existing non-visual imports remain: TopBar, AchievementToast, FirstRunOverlay, StuckHintPrompt, EventBanner, soundMuted, playBgm, stopBgm, setBgmMuted

**AC7 — End-to-end loop verified on mobile viewport (375×667)**

- Selecting two elements → auto-react (180ms) → result displays correctly in ActionZone
- New discovery: DiscoveryOverlay shows (fade-in backdrop, WAA emoji spring, staged text, Continue button with focus trap)
- Known result: ActionZone shows inline result + `+N pts` float-up animation
- Failure: ActionZone shows "Not yet..." italic copy; `failureParticle` canvas call fires
- Shelf reflects frequency states: newly-used elements show fresh glow; high-use elements show settled state
- TopBar discovery count updates after new discovery
- Canvas particle burst fires on successful reaction; radial shimmer fires when both slots fill

**AC8 — Old component cleanup (separate commit)**

- In a **separate isolated commit** after visual QA passes:
  - Delete `Slot.svelte`
  - Delete `ResultDisplay.svelte`
  - Delete `ElementGrid.svelte`
- This commit contains ONLY file deletions — no logic changes
- Do NOT delete these files in the same commit as the integration work

---

## Tasks / Subtasks

- [ ] Task 1: Refactor MixingChamber.svelte as layout shell with canvas + context (AC: #1, #2)
  - [ ] 1.1: Add `setContext` import from `'svelte'`
  - [ ] 1.2: Add `AnimationController` instantiation in `onMount` + `setContext('animationController', ...)`
  - [ ] 1.3: Remove `getContext` call from MixingChamber (it now SETS context, not gets it)
  - [ ] 1.4: Import `ShelfGrid`, `MixingSlot`, `ActionZone` (keep `DiscoveryOverlay` import)
  - [ ] 1.5: Remove `Slot` and `ResultDisplay` imports (files still exist — just not imported)
  - [ ] 1.6: Replace template: render `<ShelfGrid>` in left panel, `<MixingSlot which="a">` + `<MixingSlot which="b">` + `<ActionZone>` in right panel
  - [ ] 1.7: Add `destroy` call in component cleanup if `AnimationController` has it

- [ ] Task 2: Wire MixingSlot ready/reacting props (AC: #3)
  - [ ] 2.1: Pass `isReady={canReact}` to both `<MixingSlot>` instances
  - [ ] 2.2: Pass `isReacting={contracting}` to both `<MixingSlot>` instances

- [ ] Task 3: Wire ActionZone props (AC: #4)
  - [ ] 3.1: Replace `<ResultDisplay {result} {isNew} {attempted} />` with `<ActionZone {result} {isNew} {attempted} />`

- [ ] Task 4: Wire frequency store in doReaction (AC: #5)
  - [ ] 4.1: Add `import { incrementFrequency } from '../stores/frequency.js'`
  - [ ] 4.2: Call `incrementFrequency($slots.a)` and `incrementFrequency($slots.b)` when `reaction.result` is non-null

- [ ] Task 5: Update route imports in `game/+page.svelte` (AC: #6)
  - [ ] 5.1: Replace `import ElementGrid from '$lib/components/ElementGrid.svelte'` with `import ShelfGrid from '$lib/components/ShelfGrid.svelte'`
  - [ ] 5.2: Replace `<ElementGrid />` usage in the template with `<ShelfGrid />`
  - [ ] 5.3: If MixingChamber now includes ShelfGrid internally, remove the separate left-panel ShelfGrid from the route (check layout architecture — see Dev Notes below)
  - [ ] 5.4: Remove any canvas mount point the route previously provided (MixingChamber owns its canvas now)

- [ ] Task 6: End-to-end smoke test (AC: #7)
  - [ ] 6.1: Play the full mixing loop — select two elements, verify auto-react fires
  - [ ] 6.2: Trigger a new discovery — verify DiscoveryOverlay animation runs
  - [ ] 6.3: Trigger a known reaction — verify ActionZone `known` state + pts float
  - [ ] 6.4: Trigger a failure — verify "Not yet..." in ActionZone + particle fires
  - [ ] 6.5: Verify frequency store updates — fresh glow on first-used element

- [ ] Task 7: Isolated cleanup commit (AC: #8)
  - [ ] 7.1: After visual QA passes, delete `Slot.svelte`, `ResultDisplay.svelte`, `ElementGrid.svelte` in a single isolated commit

---

## Dev Notes

### Layout Architecture Decision

The original route structure (`game/+page.svelte`) used a `grid-template-columns: 55fr 45fr` layout with ShelfGrid on the left and MixingChamber on the right. There are two valid approaches for this story:

**Option A — MixingChamber owns the full layout:**
MixingChamber becomes the entire game canvas (replaces the `lab-wrapper` grid). The route just renders `<MixingChamber>` and `<TopBar>`. MixingChamber internally renders ShelfGrid left + mixing area right.

**Option B — Route keeps its grid, MixingChamber handles only the right panel:**
Route keeps `55fr 45fr` grid. Route renders `<ShelfGrid>` on the left (replacing `<ElementGrid>`). MixingChamber stays in the right panel but gains canvas ownership + context. MixingChamber no longer needs to render ShelfGrid.

**Recommendation: Option B** — it minimizes change surface. The route already has the grid. Just swap `ElementGrid` → `ShelfGrid` in the route, and inside MixingChamber, the canvas + AnimationController + context setup is the main addition. This matches the epics spec: "MixingChamber as layout shell connecting ShelfGrid + Chamber + Canvas" — the shell *connects* them, the route provides the grid.

If you disagree, Option A is fine too — just document the layout decision in a comment.

### setContext Placement

`setContext` must be called during component initialization (not inside `onMount`, `$effect`, or any async callback). The `AnimationController` constructor needs the canvas element, which isn't available until mount. Solution: use a two-step pattern:

```typescript
import { setContext, onMount } from 'svelte';
import { AnimationController } from '../effects/animation-controller.js';

let canvasEl: HTMLCanvasElement;
let controller: AnimationController;

// setContext call happens at init (component creation)
// but the controller object reference is set in onMount:
// Solution: use a reactive reference pattern

onMount(() => {
  controller = new AnimationController(canvasEl);
  setContext('animationController', controller);
  // ⚠️  BUT: setContext is only valid during component init!
});
```

**The correct pattern** (from Architecture §6):

```typescript
// Create a writable store wrapper that children can subscribe to:
import { setContext, onMount } from 'svelte';
import { writable } from 'svelte/store';

const controllerStore = writable<AnimationController | undefined>(undefined);
setContext('animationController', controllerStore);  // set the store at init

onMount(() => {
  const ac = new AnimationController(canvasEl);
  controllerStore.set(ac);  // update the store value after mount
  return () => ac.destroy?.();
});
```

Children access it as:
```typescript
import { getContext } from 'svelte';
import type { Writable } from 'svelte/store';
const controllerStore = getContext<Writable<AnimationController | undefined>>('animationController');
// Then: $controllerStore?.someMethod()
```

> **However** — check the existing code first. MixingChamber currently has `getContext<AnimationController | undefined>('animationController')` (line 23), and DiscoveryOverlay also uses `getContext`. This means the context is currently expected to be set by a *parent* (the route or layout). Verify whether `+layout.svelte` sets the context. If yes, MixingChamber should keep getting it from the parent and should NOT become the context provider. The canvas ownership change may simply be an `initParticles` → `new AnimationController` replacement without any context restructuring.

> ⚠️ **READ THE ARCHITECTURE §6 CAREFULLY** before changing context ownership. Architecture §6 says: "Instantiation: MixingChamber creates the controller on mount, passes the canvas ref." — this does imply MixingChamber owns the canvas and provides context.

### Existing MixingChamber — What to Preserve

From the current `MixingChamber.svelte` (as of Story 3.2):
- All store imports: `slots`, `combo`, `unlockedElements` from `game.js`
- `applyReaction` from `reactions.js`
- `hapticSuccess`, `hapticFail` from `touch.js`
- `toastQueue`, `discoveryBannerQueue` store updates
- `soundMuted`, `playChime`, `playReactionSuccess`, `playDiscovery`, `playFailure`, `playComboUp`
- `HintButton` component
- `DiscoveryOverlay` component + `isNew`, `result`, `attempted` state + `dismissOverlay`
- `failedComboCount`, `stuckPromptVisible` from `hintPrompt.js`
- `warmupAd` from `admob.js`
- `controller?.failureParticle()` call (from Story 3.2)
- `controller?.radialShimmer()` call (from Story 3.2)
- `contracting` state + `@keyframes world-contract` CSS

**What changes:**
- `initParticles(canvasEl)` → `new AnimationController(canvasEl)` (or keep `initParticles` if canvas context pattern doesn't change — verify)
- `import Slot from './Slot.svelte'` → `import MixingSlot from './MixingSlot.svelte'`
- `import ResultDisplay from './ResultDisplay.svelte'` → `import ActionZone from './ActionZone.svelte'`
- Add `import { incrementFrequency } from '../stores/frequency.js'`
- Template: `<Slot which="a" />` → `<MixingSlot which="a" {isReady} {isReacting} />`
- Template: `<ResultDisplay ...>` → `<ActionZone {result} {isNew} {attempted} />`

### Frequency Store Integration

The `incrementFrequency` store (built in Story 2.1) should be at `src/lib/stores/frequency.ts`. Verify the exact export name before importing. The store increments both elements regardless of whether the reaction is a discovery or known result — incrementing is the correct behavior (both elements were "used").

### Discovery Banner

`DiscoveryBanner` is currently rendered in the route's `left-panel` (above ElementGrid). After the route switch, `ShelfGrid` replaces `ElementGrid` — but `DiscoveryBanner` may or may not be included inside `ShelfGrid`. Check `ShelfGrid.svelte` — if it includes DiscoveryBanner already, remove it from the route. If not, keep it in the route's left panel.

### DiscoveryOverlay Backdrop (Path D Note)

The DiscoveryOverlay backdrop is `rgba(0,0,0,0.85)` (set in Story 3.2). On the new cream background, this will look abruptly dark. This is **intentional for this story** — it works functionally. Story 4.3 redesigns the overlay to use a warm parchment fog (`rgba(250, 247, 242, 0.92)`) with jewel-tone accent elements instead of the dark backdrop. Do not touch the overlay backdrop in this story.

### Testing Verification

After completing the integration, verify:
1. `controller?.radialShimmer` actually triggers (check browser devtools if no shimmer appears)
2. `controller?.failureParticle` triggers on failure
3. `controller?.screenFlash` triggers from DiscoveryOverlay on new discovery
4. Canvas element dimensions match the game viewport (the canvas needs explicit width/height set in CSS or via ResizeObserver — check `animation-controller.ts` constructor for how it sets canvas dimensions)

### Component File Reference

| File | Status | Action |
|------|--------|--------|
| `src/lib/components/MixingChamber.svelte` | exists | Refactor — add canvas ownership, swap old components for new |
| `src/lib/components/ShelfGrid.svelte` | exists (Story 2.4) | Import in route |
| `src/lib/components/MixingSlot.svelte` | exists (Story 2.2) | Wire isReady + isReacting props |
| `src/lib/components/ActionZone.svelte` | exists (Story 2.3) | Pass result/isNew/attempted props |
| `src/lib/components/DiscoveryOverlay.svelte` | exists (Story 3.2) | No changes |
| `src/lib/components/HintButton.svelte` | exists | No changes |
| `src/routes/game/+page.svelte` | exists | Swap ElementGrid → ShelfGrid |
| `src/lib/components/Slot.svelte` | exists (old) | Keep — deleted in Task 7 cleanup commit |
| `src/lib/components/ResultDisplay.svelte` | exists (old) | Keep — deleted in Task 7 cleanup commit |
| `src/lib/components/ElementGrid.svelte` | exists (old) | Keep — deleted in Task 7 cleanup commit |
