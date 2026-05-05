<script lang="ts">
  import { unlockedElements } from '../stores/game.js';
  import { ELEMENTS } from '../data/elements.js';
  import ElementCard from './ElementCard.svelte';

  let filter: 'all' | 'basic' | 'found' = $state('all');

  const filteredKeys = $derived(
    [...$unlockedElements].filter((k) => {
      if (filter === 'basic') return ELEMENTS[k]?.category === 'basic';
      if (filter === 'found') return ELEMENTS[k]?.category !== 'basic';
      return true;
    })
  );
</script>

<div class="element-grid-panel">
  <div class="grid-tabs">
    <button class="tab-btn" class:active={filter === 'all'} onclick={() => filter = 'all'}>All</button>
    <button class="tab-btn" class:active={filter === 'basic'} onclick={() => filter = 'basic'}>Basic</button>
    <button class="tab-btn" class:active={filter === 'found'} onclick={() => filter = 'found'}>Found</button>
  </div>
  <div class="grid-scroll">
    {#each filteredKeys as key (key)}
      <ElementCard elementKey={key} mode="grid" />
    {:else}
      <p class="empty-grid">No elements yet</p>
    {/each}
  </div>
</div>

<style>
  .element-grid-panel {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    background: #080f1a;
    border-right: 1px solid #1a2e4a;
  }
  .grid-tabs {
    display: flex;
    gap: 4px;
    padding: 8px 10px;
    flex-shrink: 0;
  }
  .tab-btn {
    flex: 1;
    padding: 6px 0;
    background: transparent;
    border: 1px solid #1a2e4a;
    border-radius: 6px;
    color: #4a6080;
    font-size: 11px;
    font-family: 'Space Mono', monospace;
    cursor: pointer;
    transition: all 0.15s;
    min-height: 44px;
    touch-action: manipulation;
  }
  .tab-btn.active,
  .tab-btn:hover {
    border-color: #4af0c060;
    color: #4af0c0;
    background: #0f2035;
  }
  .grid-scroll {
    flex: 1;
    overflow-y: auto;
    padding: 8px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(76px, 1fr));
    gap: 6px;
    align-content: start;
    -webkit-overflow-scrolling: touch;
  }
  .empty-grid {
    color: #2a3550;
    font-size: 11px;
    text-align: center;
    padding: 16px;
    grid-column: 1 / -1;
  }
</style>
