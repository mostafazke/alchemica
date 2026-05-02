<script lang="ts">
  import { ELEMENTS } from '../data/elements.js';
  import { slots } from '../stores/game.js';

  let { which }: { which: 'a' | 'b' } = $props();

  const elementKey = $derived($slots[which]);
  const el = $derived(elementKey ? ELEMENTS[elementKey] : null);

  function clearSlot(e: MouseEvent) {
    e.stopPropagation();
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
    width: 90px; height: 90px;
    border: 2px dashed #1a3a5a;
    border-radius: 12px;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 4px;
    background: #080f1a;
    transition: border-color 0.2s, background 0.2s;
    user-select: none;
  }
  .slot.filled { border: 2px solid #4af0c060; background: #0a1a2a; }
  .slot-icon {
    width: 40px; height: 40px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 8px; font-size: 22px;
  }
  .slot-name { font-size: 10px; color: #8ab4d4; text-align: center; }
  .slot-placeholder { font-size: 28px; color: #1a3a5a; }
  .slot-clear {
    position: absolute; top: 4px; right: 4px;
    background: transparent; border: none; color: #4a6080;
    cursor: pointer; font-size: 11px; padding: 3px; line-height: 1;
    border-radius: 4px;
    min-width: 20px; min-height: 20px;
    touch-action: manipulation;
  }
  .slot-clear:hover { color: #ff6b6b; background: #ff6b6b20; }
  @media (max-width: 768px) {
    .slot {
      width: 110px;
      height: 110px;
    }
    .slot-clear {
      min-width: 32px;
      min-height: 32px;
      font-size: 13px;
      padding: 6px;
    }
  }
  @media (orientation: landscape) and (max-height: 520px) {
    .slot { width: 80px; height: 80px; }
    .slot-icon { width: 34px; height: 34px; font-size: 20px; }
  }
</style>
