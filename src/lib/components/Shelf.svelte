<script lang="ts">
  import { unlockedElements } from '../stores/game.js';
  import { ELEMENTS } from '../data/elements.js';
  import { createSwipeHandler } from '../utils/touch.js';
  import ElementCard from './ElementCard.svelte';

  let filter: 'all' | 'basic' | 'found' = $state('all');

  const FILTER_ORDER: Array<'all' | 'basic' | 'found'> = ['all', 'basic', 'found'];

  const CATEGORY_META: Record<string, { label: string; icon: string }> = {
    basic:    { label: 'Basic',    icon: '⬡' },
    fire:     { label: 'Fire',     icon: '🔥' },
    water:    { label: 'Water',    icon: '💧' },
    earth:    { label: 'Earth',    icon: '🪨' },
    air:      { label: 'Air',      icon: '🌬' },
    metal:    { label: 'Metal',    icon: '⚙️' },
    energy:   { label: 'Energy',   icon: '⚡' },
    gas:      { label: 'Gas',      icon: '💨' },
    compound: { label: 'Compound', icon: '🧪' },
  };

  const CATEGORY_ORDER = ['basic', 'fire', 'water', 'earth', 'air', 'metal', 'energy', 'gas', 'compound'];

  let collapsedCategories: Set<string> = $state(new Set());
  let shelfPanelEl: HTMLElement | undefined = $state();

  function toggleCategory(cat: string) {
    const next = new Set(collapsedCategories);
    if (next.has(cat)) next.delete(cat); else next.add(cat);
    collapsedCategories = next;
  }

  $effect(() => {
    if (!shelfPanelEl) return;
    return createSwipeHandler(shelfPanelEl, {
      threshold: 40,
      onSwipeLeft: () => {
        const idx = FILTER_ORDER.indexOf(filter);
        filter = FILTER_ORDER[(idx + 1) % FILTER_ORDER.length];
      },
      onSwipeRight: () => {
        const idx = FILTER_ORDER.indexOf(filter);
        filter = FILTER_ORDER[(idx - 1 + FILTER_ORDER.length) % FILTER_ORDER.length];
      },
    });
  });

  const filteredKeys = $derived(
    [...$unlockedElements].filter((k) => {
      if (filter === 'basic') return ELEMENTS[k]?.category === 'basic';
      if (filter === 'found') return ELEMENTS[k]?.category !== 'basic';
      return true;
    })
  );

  const groupedElements = $derived(
    filter !== 'all' ? null : (() => {
      const groups = new Map<string, string[]>();
      for (const key of [...$unlockedElements]) {
        const cat = ELEMENTS[key]?.category ?? 'compound';
        if (!groups.has(cat)) groups.set(cat, []);
        groups.get(cat)!.push(key);
      }
      return CATEGORY_ORDER
        .filter(cat => groups.has(cat))
        .map(cat => ({
          cat,
          keys: groups.get(cat)!,
          meta: CATEGORY_META[cat] ?? { label: cat, icon: '⬡' }
        }));
    })()
  );
</script>

<aside class="shelf-panel" bind:this={shelfPanelEl}>
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
    {#if filter === 'all' && groupedElements}
      {#each groupedElements as group (group.cat)}
        <div class="category-group">
          <button
            class="category-header"
            onclick={() => toggleCategory(group.cat)}
          >
            <span class="cat-icon">{group.meta.icon}</span>
            <span class="cat-label">{group.meta.label}</span>
            <span class="cat-count">{group.keys.length}</span>
            <span class="cat-chevron" class:collapsed={collapsedCategories.has(group.cat)}>▾</span>
          </button>
          {#if !collapsedCategories.has(group.cat)}
            {#each group.keys as key (key)}
              <ElementCard elementKey={key} />
            {/each}
          {/if}
        </div>
      {/each}
    {:else}
      {#each filteredKeys as key (key)}
        <ElementCard elementKey={key} />
      {:else}
        <p class="empty-shelf">None yet — combine basic elements!</p>
      {/each}
    {/if}
  </div>
</aside>

<style>
  .shelf-panel {
    display: flex; flex-direction: column;
    background: #080f1a;
    border-right: 1px solid #1a2e4a;
    width: 100%; flex-shrink: 0;
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
    min-height: 36px;
    touch-action: manipulation;
  }
  .tab-btn.active, .tab-btn:hover { border-color: #4af0c060; color: #4af0c0; background: #0f2035; }
  .elements-list {
    flex: 1; overflow-y: auto;
    padding: 2px 8px 8px;
    display: flex; flex-direction: column; gap: 3px;
  }
  .empty-shelf { color: #2a3550; font-size: 11px; text-align: center; padding: 16px; }

  /* Category group styles */
  .category-group { margin-bottom: 4px; }
  .category-header {
    display: flex; align-items: center; gap: 6px;
    width: 100%; padding: 6px 4px;
    background: transparent; border: none; border-bottom: 1px solid #1a2e4a;
    color: #4a6080; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px;
    cursor: pointer; text-align: left;
    min-height: 36px;
    touch-action: manipulation;
  }
  .category-header:hover { color: #8ab4d4; }
  .cat-icon { font-size: 12px; flex-shrink: 0; }
  .cat-label { flex: 1; font-family: 'Space Mono', monospace; }
  .cat-count {
    background: #1a2e4a; color: #4af0c0;
    font-size: 9px; padding: 1px 5px; border-radius: 8px;
    font-family: 'Space Mono', monospace;
  }
  .cat-chevron { font-size: 10px; transition: transform 0.2s; }
  .cat-chevron.collapsed { transform: rotate(-90deg); }
</style>
