<script lang="ts">
  import { ELEMENTS } from '../data/elements.js';
  import { slots } from '../stores/game.js';
  import { createLongPress, haptic } from '../utils/touch.js';
  import ElementDetail from './ElementDetail.svelte';

  let { elementKey, mode = 'list' }: { elementKey: string; mode?: 'list' | 'grid' } = $props();

  const el = $derived(ELEMENTS[elementKey]);
  const isSelected = $derived($slots.a === elementKey || $slots.b === elementKey);

  let detailOpen = $state(false);
  let buttonEl: HTMLButtonElement | undefined = $state();

  function handleClick() {
    slots.update((s) => {
      if (!s.a) return { ...s, a: elementKey };
      if (!s.b) return { ...s, b: elementKey };
      return { a: elementKey, b: null };
    });
  }

  $effect(() => {
    if (!buttonEl) return;
    return createLongPress(buttonEl, {
      duration: 500,
      onLongPress: () => {
        haptic(40);
        detailOpen = true;
      },
      onTap: handleClick,
    });
  });
</script>

{#if el}
<button
  class="element-card"
  class:grid-tile={mode === 'grid'}
  class:selected={isSelected}
  bind:this={buttonEl}
  title={el.desc}
>
  <div class="el-icon {el.color}">{el.symbol}</div>
  {#if mode === 'grid'}
    <div class="el-grid-name">{el.name}</div>
    <div class="long-press-dot" aria-hidden="true"></div>
  {:else}
    <div class="el-info">
      <div class="el-formula">{el.formula}</div>
      <div class="el-name">{el.name}</div>
      <div class="el-category">{el.category}</div>
    </div>
  {/if}
</button>
<ElementDetail element={detailOpen ? el : null} onClose={() => detailOpen = false} />
{/if}

<style>
  .element-card {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 8px;
    background: #0a1520;
    border: 1px solid #1a2e4a;
    border-radius: 8px;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
    width: 100%;
    text-align: left;
    min-height: 44px;
    touch-action: manipulation;
  }
  .element-card:hover { border-color: #4af0c060; background: #0f2035; }
  .element-card.selected { border-color: #4af0c0; background: #0f3028; box-shadow: 0 0 8px #4af0c040; }
  .el-icon {
    width: 34px; height: 34px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 6px; font-size: 18px; flex-shrink: 0;
  }
  .el-info { min-width: 0; }
  .el-formula { font-family: 'Space Mono', monospace; font-size: 11px; color: #4af0c0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .el-name { font-size: 12px; font-weight: 600; color: #c8d8e8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .el-category { font-size: 11px; color: #4a6080; text-transform: uppercase; letter-spacing: 0.5px; }

  /* Grid tile mode */
  .element-card.grid-tile {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 6px 4px;
    min-height: 72px;
    text-align: center;
  }
  .element-card.grid-tile .el-icon {
    width: 30px; height: 30px; font-size: 18px;
  }
  .el-grid-name {
    font-size: 11px;
    color: #8ab4d4;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    font-family: 'Space Mono', monospace;
  }
  .long-press-dot {
    width: 4px; height: 4px;
    border-radius: 50%;
    background: #1a3a5a;
    margin-top: 1px;
    transition: background 0.15s;
  }
  .element-card:hover .long-press-dot,
  .element-card.selected .long-press-dot { background: #4af0c060; }

  /* Category icon backgrounds */
  :global(.cat-fire)     { background: #2d1810; color: #ff6b35; }
  :global(.cat-water)    { background: #0d2040; color: #5ab4ff; }
  :global(.cat-earth)    { background: #1a2010; color: #96c84a; }
  :global(.cat-air)      { background: #1a1a2e; color: #c8c8ff; }
  :global(.cat-metal)    { background: #2a2a1a; color: #c8b460; }
  :global(.cat-energy)   { background: #2d1a40; color: #d05aff; }
  :global(.cat-gas)      { background: #1a2a2a; color: #80d0c0; }
  :global(.cat-compound) { background: #2a1a2a; color: #d080a0; }
</style>
