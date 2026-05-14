<script lang="ts">
  import { get } from 'svelte/store';
  import { ELEMENTS } from '../data/elements.js';
  import { slots } from '../stores/game.js';
  import { soundMuted } from '../stores/settings.js';
  import { playSlotPlace, playSlotClear } from '../effects/sound.js';

  let { which }: { which: 'a' | 'b' } = $props();

  const elementKey = $derived($slots[which]);
  const el = $derived(elementKey ? ELEMENTS[elementKey] : null);

  let prevKey: string | null = null;
  $effect(() => {
    const key = $slots[which];
    if (key !== null && prevKey === null && !get(soundMuted)) playSlotPlace();
    prevKey = key;
  });

  function clearSlot(e: MouseEvent) {
    e.stopPropagation();
    if (!get(soundMuted)) playSlotClear();
    slots.update((s) => ({ ...s, [which]: null }));
  }
</script>

<div class="slot" class:filled={!!el}>
  {#if el}
    <div class="slot-icon {el.color}">{el.symbol}</div>
    <div class="slot-name">{el.name}</div>
    <button class="slot-clear" onclick={clearSlot}>✕</button>
  {:else}
    <span class="slot-placeholder">+</span>
  {/if}
</div>

<style>
  .slot {
    position: relative;
    width: 80px; height: 80px;
    border: 2px dashed var(--color-border-mid);
    border-radius: 10px;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 3px;
    background: var(--color-bg-deep);
    transition: border-color 0.2s, background 0.2s;
    user-select: none;
  }
  .slot.filled { border: 2px solid var(--color-border-active); background: var(--color-bg-surface); }
  .slot-icon {
    width: 32px; height: 32px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 6px; font-size: 18px;
  }
  .slot-name { font-size: 9px; color: var(--color-text-secondary); text-align: center; }
  .slot-placeholder { font-size: 24px; color: var(--color-border-mid); }
  .slot-clear {
    position: absolute; top: 0; right: 0;
    background: transparent; border: none; color: var(--color-text-muted);
    cursor: pointer; font-size: 11px; line-height: 1;
    border-radius: 4px;
    min-width: 44px; min-height: 44px;
    display: flex; align-items: flex-start; justify-content: flex-end;
    padding: 6px 6px 0 0;
    touch-action: manipulation;
  }
  .slot-clear:hover { color: #ff6b6b; background: #ff6b6b20; }
</style>
