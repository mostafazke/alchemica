<script lang="ts">
  import { get } from 'svelte/store';
  import { ELEMENTS } from '../data/elements.js';
  import { slots } from '../stores/game.js';
  import { soundMuted } from '../stores/settings.js';
  import { playSlotPlace, playSlotClear } from '../effects/sound.js';
  import ElementIcon from './ElementIcon.svelte';

  let { which, isReady = false, isReacting = false }: {
    which: 'a' | 'b';
    isReady?: boolean;
    isReacting?: boolean;
  } = $props();

  const elementKey = $derived($slots[which]);
  const el = $derived(elementKey ? ELEMENTS[elementKey] : null);

  const slotState = $derived.by((): 'empty' | 'filled' | 'ready' | 'reacting' => {
    if (!el) return 'empty';
    if (isReacting) return 'reacting';
    if (isReady) return 'ready';
    return 'filled';
  });

  const ariaLabel = $derived(
    el
      ? `Mixing slot ${which.toUpperCase()}: ${el.name}`
      : `Mixing slot ${which.toUpperCase()}: empty`
  );

  let prevKey: string | null = null;
  $effect(() => {
    const key = $slots[which];
    if (key !== null && prevKey === null) {
      if (!get(soundMuted)) playSlotPlace();
    }
    prevKey = key;
  });

  function clearSlot(e: MouseEvent) {
    e.stopPropagation();
    if (!get(soundMuted)) playSlotClear();
    slots.update((s) => ({ ...s, [which]: null }));
  }
</script>

<!-- Layer 3 token vars are set in <style>; state classes drive overrides -->
<div
  class="mixing-slot"
  class:filled={slotState === 'filled' || slotState === 'ready' || slotState === 'reacting'}
  class:ready={slotState === 'ready'}
  class:reacting={slotState === 'reacting'}
  aria-label={ariaLabel}
>
  {#if el}
    {#key elementKey}
      <div class="slot-icon {el.color} entering"><ElementIcon key={elementKey} /></div>
    {/key}
    <div class="slot-name">{el.name}</div>
    <button
      class="slot-clear"
      onclick={clearSlot}
      aria-label="Clear slot {which.toUpperCase()}"
    >✕</button>
  {:else}
    <span class="slot-placeholder">+</span>
  {/if}
</div>

<style>
  /* ─── Layer 3: component-scoped token defaults ─── */
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

  /* ─── Base layout ─── */
  .mixing-slot {
    position: relative;
    width: 56px;
    height: 56px;
    border-radius: 8px;
    border: 2px var(--slot-border-style) var(--slot-border);
    background: var(--slot-bg);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    user-select: none;
    transition: border-color 0.15s, background 0.15s;
    cursor: default;
  }

  /* ─── Energy states ─── */
  @keyframes breathe {
    0%, 100% { transform: scale(1.0); }
    50%       { transform: scale(0.97); }
  }
  .mixing-slot.ready {
    animation: breathe 2s ease-in-out infinite;
  }

  @keyframes slot-pulse {
    0%   { transform: scale(1.0); }
    40%  { transform: scale(1.05); }
    100% { transform: scale(1.0); }
  }
  .mixing-slot.reacting {
    animation: slot-pulse 0.4s ease-out;
  }

  /* ─── Fill animation ─── */
  @keyframes slot-enter {
    from { transform: scale(0.6); opacity: 0; }
    to   { transform: scale(1.0); opacity: 1; }
  }
  .slot-icon.entering {
    animation: slot-enter 180ms ease-out both;
  }

  /* ─── Inner elements ─── */
  .slot-icon {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    font-size: 20px;
    flex-shrink: 0;
  }
  .slot-name {
    font-size: var(--text-micro);
    color: var(--color-text-secondary);
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 52px;
  }
  .slot-placeholder {
    font-size: 20px;
    color: var(--color-border-mid);
    line-height: 1;
  }

  /* ─── Clear button: 44×44px hit area via padding ─── */
  .slot-clear {
    position: absolute;
    top: 0;
    right: 0;
    background: transparent;
    border: none;
    color: var(--color-text-muted);
    cursor: pointer;
    font-size: var(--text-micro);
    line-height: 1;
    border-radius: 4px;
    /* 44×44px minimum tap target */
    min-width: 44px;
    min-height: 44px;
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    padding: 6px 6px 0 0;
    touch-action: manipulation;
  }
  .slot-clear:hover {
    color: var(--color-danger);
    background: color-mix(in srgb, var(--color-danger) 15%, transparent);
  }
</style>
