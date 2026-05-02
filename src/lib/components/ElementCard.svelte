<script lang="ts">
  import { ELEMENTS } from '../data/elements.js';
  import { slots } from '../stores/game.js';

  let { elementKey }: { elementKey: string } = $props();

  const el = $derived(ELEMENTS[elementKey]);
  const isSelected = $derived($slots.a === elementKey || $slots.b === elementKey);

  function handleClick() {
    slots.update((s) => {
      if (!s.a) return { ...s, a: elementKey };
      if (!s.b) return { ...s, b: elementKey };
      return { a: elementKey, b: null };
    });
  }
</script>

{#if el}
<button
  class="element-card"
  class:selected={isSelected}
  onclick={handleClick}
  title={el.desc}
>
  <div class="el-icon {el.color}">{el.symbol}</div>
  <div class="el-info">
    <div class="el-formula">{el.formula}</div>
    <div class="el-name">{el.name}</div>
    <div class="el-category">{el.category}</div>
  </div>
</button>
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
  .el-formula { font-family: 'Space Mono', monospace; font-size: 9px; color: #4af0c0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .el-name { font-size: 12px; font-weight: 600; color: #c8d8e8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .el-category { font-size: 9px; color: #4a6080; text-transform: uppercase; letter-spacing: 0.5px; }

  @media (max-width: 768px) {
    .element-card {
      min-height: 52px;
      padding: 8px 10px;
    }
    .el-icon {
      width: 36px;
      height: 36px;
      font-size: 20px;
    }
  }

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
