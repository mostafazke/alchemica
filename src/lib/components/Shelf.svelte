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

<aside class="shelf-panel">
  <div class="shelf-header">
    <span class="shelf-title">Elements</span>
    <span class="shelf-count">{$unlockedElements.size}</span>
  </div>
  <div class="shelf-tabs">
    <button class="tab-btn" class:active={filter === 'all'} onclick={() => filter = 'all'}>All</button>
    <button class="tab-btn" class:active={filter === 'basic'} onclick={() => filter = 'basic'}>Basic</button>
    <button class="tab-btn" class:active={filter === 'found'} onclick={() => filter = 'found'}>Found</button>
  </div>
  <div class="elements-list">
    {#each filteredKeys as key (key)}
      <ElementCard elementKey={key} />
    {:else}
      <p class="empty-shelf">None yet — combine basic elements!</p>
    {/each}
  </div>
</aside>

<style>
  .shelf-panel {
    display: flex; flex-direction: column;
    background: #080f1a;
    border-right: 1px solid #1a2e4a;
    width: 210px; flex-shrink: 0;
    overflow: hidden;
  }
  .shelf-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 12px 4px;
  }
  .shelf-title { font-family: 'Space Mono', monospace; font-size: 10px; text-transform: uppercase; color: #4a6080; letter-spacing: 1px; }
  .shelf-count { font-family: 'Space Mono', monospace; font-size: 10px; color: #4af0c0; }
  .shelf-tabs { display: flex; gap: 3px; padding: 4px 8px 6px; }
  .tab-btn {
    flex: 1; padding: 4px 0;
    background: transparent; border: 1px solid #1a2e4a; border-radius: 6px;
    color: #4a6080; font-size: 10px; cursor: pointer; transition: all 0.15s;
    min-height: 28px;
  }
  .tab-btn.active, .tab-btn:hover { border-color: #4af0c060; color: #4af0c0; background: #0f2035; }
  .elements-list {
    flex: 1; overflow-y: auto;
    padding: 2px 8px 8px;
    display: flex; flex-direction: column; gap: 3px;
  }
  .empty-shelf { color: #2a3550; font-size: 11px; text-align: center; padding: 16px; }
</style>
