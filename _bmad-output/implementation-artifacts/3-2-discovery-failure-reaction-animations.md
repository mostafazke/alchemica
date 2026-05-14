# Story 3.2: Discovery, Failure & Reaction Animations

**Status:** ready-for-dev
**Epic:** 3 — Animation & Integration
**Story ID:** 3-2

---

## User Story

As a player,
I want the discovery moment to feel like emergence (not delivery), failure to feel like "not yet" (not rejection), and known results to feel efficient (not boring),
So that every outcome of the mixing loop has the right emotional weight.

---

## Acceptance Criteria

**AC1 — DiscoveryOverlay rewrite (in place)**
- Overlay fades in over 200ms with backdrop `rgba(0, 0, 0, 0.85)`
- "✦ NEW DISCOVERY" badge visible immediately on enter
- Emoji icon scales `0.1 → 1.0` via **Web Animations API** with `cubic-bezier(0.34, 1.56, 0.64, 1)` over **1.2s**
- 200ms silence gap: `playDiscovery()` fires 200ms after overlay opens (gap is in MixingChamber, not DiscoveryOverlay)
- Name + formula fade in at 300ms after overlay enters
- "Continue →" ghost button fades in at 400ms after overlay enters
- Screen-edge flash: calls `controller?.screenFlash('#d4a84a', 0.5)` via context on mount
- `role="dialog"`, `aria-modal="true"`, `aria-label="New discovery"` on overlay element
- Focus trap: first focusable element (Continue button) receives focus on mount; Tab cycles within overlay
- `prefers-reduced-motion`: skip emoji WAA scale, show final state immediately; opacity-only fades still run

**AC2 — Failure animation**
- `MixingChamber.svelte`: after `doReaction()` returns no result, call `controller?.failureParticle(cx, cy)` (no-op until canvas is mounted in 3.3)
- `MixingSlot.svelte`: add prop `isReady: boolean = false` and `isReacting: boolean = false` for wiring in 3.3
- ActionZone already shows failure state with "Not yet" copy (done in Story 2.3) — no changes needed to ActionZone
- No red anywhere; no shake animation; no error sound changes (already correct in MixingChamber)

**AC3 — Auto-react world-contract animation**
- `MixingChamber.svelte`: when `canReact` is true (both slots filled, 180ms timer starts), apply `.contracting` class to `.mixing-chamber`
- `.contracting` CSS: `@keyframes world-contract` — scale `1.0 → 0.97` over 180ms ease-in-out, then back to 1.0
- Call `controller?.radialShimmer(cx, cy)` when `canReact` first becomes true (no-op until 3.3)
- MixingSlot `ready` state: already has `@keyframes breathe` + `.mixing-slot.ready` CSS (Story 2.2) — prop wiring deferred to 3.3

**AC4 — Known-element result**
- Already complete from Story 2.3 (ActionZone `known` state shows inline result + `+N pts` float-up)
- No changes needed — verify only

---

## File Change Map

| File | Action | Notes |
|------|--------|-------|
| `src/lib/components/DiscoveryOverlay.svelte` | **REWRITE in place** | WAA emoji scale, sequence, focus trap, dialog role |
| `src/lib/components/MixingChamber.svelte` | **MODIFY** | 200ms sound delay, failureParticle call, world-contract CSS + class, radialShimmer call |
| `src/lib/components/MixingSlot.svelte` | **MODIFY** | Add `isReady` + `isReacting` props (CSS already exists, wiring deferred to 3.3) |

**Not changed:**
- `ActionZone.svelte` — failure state already implemented (Story 2.3)
- `animation-controller.ts` — complete (Story 3.1)
- `particles.ts` — untouched (AR1)

---

## Implementation Guide

### 1. DiscoveryOverlay.svelte — Full Rewrite

**Key changes from current implementation:**
- CSS `@keyframes icon-spring` (400ms) → **Web Animations API** on the emoji element ref (1.2s spring)
- Backdrop color: `rgba(6, 18, 34, 0.96)` → `rgba(0, 0, 0, 0.85)`
- CSS `.edge-flash` div → `controller?.screenFlash()` via `getContext`
- Add `role="dialog"`, `aria-modal="true"`, `aria-label="New discovery"`
- Add focus trap (focus Continue button on mount; Tab cycles within)
- Add staged fade-ins for name (300ms delay), formula (300ms delay), continue button (400ms delay)
- `prefers-reduced-motion`: detect via `window.matchMedia`, skip WAA if reduced motion

**WAA emoji scale:**
```typescript
// Inside onMount, after overlay enters:
const emojiEl = document.querySelector('.discovery-emoji') as HTMLElement;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reducedMotion && emojiEl) {
  emojiEl.animate(
    [{ transform: 'scale(0.1)' }, { transform: 'scale(1.0)' }],
    {
      duration: 1200,
      easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      fill: 'both',
    }
  );
} else {
  // Reduced motion: show final state immediately
  if (emojiEl) emojiEl.style.transform = 'scale(1.0)';
}
```

**Context access:**
```typescript
import { getContext } from 'svelte';
import type { AnimationController } from '../effects/animation-controller.js';

// In <script> at component init (NOT inside onMount or effects):
const controller = getContext<AnimationController | undefined>('animationController');
```

Then in `onMount`:
```typescript
controller?.screenFlash('#d4a84a', 0.5);
```

**Focus trap:**
```typescript
let dialogEl: HTMLElement;
let continueBtn: HTMLButtonElement;

onMount(() => {
  continueBtn?.focus();
  // ...
});

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') { dismiss(); return; }
  if (e.key !== 'Tab') return;
  // Cycle focus within dialog
  const focusable = Array.from(
    dialogEl.querySelectorAll<HTMLElement>('button, [tabindex]:not([tabindex="-1"])')
  ).filter((el) => !el.disabled);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey) {
    if (document.activeElement === first) { e.preventDefault(); last.focus(); }
  } else {
    if (document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
}
```

**Staged fade-ins (CSS + delay classes):**
```css
.discovery-name, .discovery-formula { opacity: 0; animation: fade-in 300ms ease 300ms both; }
.discovery-continue-btn { opacity: 0; animation: fade-in 300ms ease 400ms both; }
@keyframes fade-in { from { opacity: 0 } to { opacity: 1 } }
@media (prefers-reduced-motion: reduce) {
  .discovery-name, .discovery-formula, .discovery-continue-btn { animation: none; opacity: 1; }
}
```

**Preserve from current:** Share button, quip, formula, progress bar, auto-dismiss timer (4000ms), exit animation, `el.color` icon category classes.

**Remove from current:** `.edge-flash` div + CSS + `flashVisible` state + `setTimeout(() => flashVisible = false, 160)`.

**Rename:** `.discovery-icon` → `.discovery-emoji` (to match WAA ref), keeping same 72×72px styling. Keep existing `:global(.discovery-icon.cat-*)` classes but update selector to `.discovery-emoji`.

---

### 2. MixingChamber.svelte Changes

**a) 200ms sound delay for discovery:**

Find the discovery sound call in `doReaction()`:
```typescript
if (reaction.isNew) playDiscovery();
```
Change to:
```typescript
if (reaction.isNew) setTimeout(() => { if (!get(soundMuted)) playDiscovery(); }, 200);
```
Remove `playDiscovery()` from the outer `if (!get(soundMuted))` block for the `isNew` case (restructure the sound block so discovery sound is always delayed, combo sound plays immediately).

**b) canvas context access (top of `<script>`):**
```typescript
import { getContext } from 'svelte';
import type { AnimationController } from '../effects/animation-controller.js';
const controller = getContext<AnimationController | undefined>('animationController');
```

**c) failureParticle call** — in the `else` branch of `doReaction()` (no result):
```typescript
controller?.failureParticle(cx, cy);
```
Keep existing `triggerFailParticles(cx, cy)` from particles.ts alongside — it's the old per-chamber canvas. Both fire; old canvas is live now, new controller is a no-op until 3.3. In Story 3.3, the old call is removed.

**d) World-contract + radialShimmer** — in the `$effect` block that watches `canReact`:
```typescript
let contracting = $state(false);

$effect(() => {
  if (canReact) {
    // Trigger shimmer and world-contract on first ready state
    const cx = canvasEl?.parentElement?.offsetWidth ?? 160;
    const cy = (canvasEl?.parentElement?.offsetHeight ?? 260) * 0.38;
    controller?.radialShimmer(cx, cy);
    contracting = true;
    setTimeout(() => { contracting = false; }, 360); // 2× animation duration
    autoReactTimer = setTimeout(() => { doReaction(); }, 180);
  } else {
    if (autoReactTimer !== null) { clearTimeout(autoReactTimer); autoReactTimer = null; }
  }
  return () => { if (autoReactTimer !== null) { clearTimeout(autoReactTimer); autoReactTimer = null; } };
});
```

Add `.contracting` to the `.mixing-chamber` element:
```svelte
<section class="mixing-chamber" class:contracting>
```

Add CSS:
```css
@keyframes world-contract {
  0%   { transform: scale(1.0); }
  50%  { transform: scale(0.97); }
  100% { transform: scale(1.0); }
}
.mixing-chamber.contracting {
  animation: world-contract 360ms ease-in-out;
}
@media (prefers-reduced-motion: reduce) {
  .mixing-chamber.contracting { animation: none; }
}
```

**Note on `canvasEl`:** MixingChamber already has `let canvasEl: HTMLCanvasElement` with `bind:this`. In Story 3.3, this canvas will be replaced by the overlay canvas. For 3.2, use `canvasEl` for coordinate calculation (it reflects the current chamber dimensions, which are the same as the future overlay canvas).

---

### 3. MixingSlot.svelte Changes

Minimal change — add props and wire `slotState`:

```typescript
let { which, isReady = false, isReacting = false }: {
  which: 'a' | 'b';
  isReady?: boolean;
  isReacting?: boolean;
} = $props();

const slotState = $derived.by((): 'empty' | 'filled' | 'ready' | 'reacting' => {
  if (!el) return 'empty';
  if (isReacting) return 'reacting';
  if (isReady) return 'ready';
  return 'filled';
});
```

The CSS for `ready` (breathe) and `reacting` (pulse) already exists. These props are passed from MixingChamber in Story 3.3 when MixingSlot is imported.

---

## Dependency Notes

| Capability | Status in 3.2 | Activated in |
|------------|--------------|-------------|
| DiscoveryOverlay WAA emoji scale | ✅ live | 3.2 (rewrite is live since MixingChamber imports it) |
| Discovery focus trap + ARIA | ✅ live | 3.2 |
| 200ms discovery sound delay | ✅ live | 3.2 (MixingChamber change) |
| screenFlash canvas effect | ⬜ no-op | 3.3 (context set when canvas mounted) |
| failureParticle canvas effect | ⬜ no-op | 3.3 |
| radialShimmer canvas effect | ⬜ no-op | 3.3 |
| World-contract CSS animation | ✅ live | 3.2 (MixingChamber CSS change) |
| MixingSlot breathe animation | ⬜ prop ready | 3.3 (when MixingSlot used by MixingChamber) |

---

## Guardrails

### DO
- Use WAA for emoji (not CSS @keyframes) — architecture mandates WAA for the 1.2s spring
- Keep `getContext` calls at component init level (not inside effects/onMount)
- Use optional chaining `controller?.method()` — context is `undefined` until 3.3
- Keep `triggerFailParticles` from particles.ts alongside new `controller?.failureParticle()` in MixingChamber — don't remove it in 3.2
- Preserve existing share button in DiscoveryOverlay (UX feature, not in scope for removal)
- Preserve auto-dismiss timer (4000ms)
- Preserve progress bar animation in DiscoveryOverlay
- Keep `el.color` category color classes on emoji icon (`.cat-fire`, `.cat-water`, etc.)

### DON'T
- Use GSAP (Decision D-05)
- Call `setContext` in any component — that's Story 3.3 (MixingChamber)
- Mount a canvas element in any `.svelte` file — Story 3.3
- Remove `triggerSuccessParticles` / `triggerFailParticles` imports from MixingChamber — Story 3.3 cleanup
- Use `querySelector` for the WAA emoji target — use a `bind:this` ref instead
- Add red anywhere for failure (UX-DR2)

### Svelte 5 notes
- `getContext` returns `undefined` (not throws) when no parent has called `setContext` — safe
- WAA is browser API — call inside `onMount` only
- `window.matchMedia` — call inside `onMount` (not top-level; SSR guard)

---

## Verification

1. `npx svelte-check --threshold error` — 2 errors (pre-existing), 0 new
2. DiscoveryOverlay has `role="dialog"` and `aria-modal="true"` — grep confirms
3. DiscoveryOverlay has no `.edge-flash` div or `flashVisible` state — grep confirms removal
4. WAA call: `emojiEl.animate([{ transform: 'scale(0.1)' }, ...], { duration: 1200 })` — present in DiscoveryOverlay
5. Sound delay: `setTimeout(() => { ... playDiscovery(); }, 200)` — in MixingChamber doReaction
6. `controller?.failureParticle` and `controller?.radialShimmer` — in MixingChamber
7. `@keyframes world-contract` — in MixingChamber style block
8. No `#ffe44a` or `rgba(74, 240, 192` in DiscoveryOverlay — cold colors removed
9. `prefers-reduced-motion` block in DiscoveryOverlay CSS

---

## Completion Notes

### File List

- `src/lib/components/DiscoveryOverlay.svelte` — REWRITE in place
- `src/lib/components/MixingChamber.svelte` — modify (sound delay, canvas calls, world-contract)
- `src/lib/components/MixingSlot.svelte` — modify (add isReady/isReacting props)
