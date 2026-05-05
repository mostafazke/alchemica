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
    border: 2px dashed #1a3a5a;
    border-radius: 10px;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 3px;
    background: #080f1a;
    transition: border-color 0.2s, background 0.2s;
    user-select: none;
  }
  .slot.filled { border: 2px solid #4af0c060; background: #0a1a2a; }
  .slot-icon {
    width: 32px; height: 32px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 6px; font-size: 18px;
  }
  .slot-name { font-size: 9px; color: #8ab4d4; text-align: center; }
  .slot-placeholder { font-size: 24px; color: #1a3a5a; }
  .slot-clear {
    position: absolute; top: 3px; right: 3px;
    background: transparent; border: none; color: #4a6080;
    cursor: pointer; font-size: 11px; padding: 3px; line-height: 1;
    border-radius: 4px;
    min-width: 24px; min-height: 24px;
    touch-action: manipulation;
  }
  .slot-clear:hover { color: #ff6b6b; background: #ff6b6b20; }
</style>
