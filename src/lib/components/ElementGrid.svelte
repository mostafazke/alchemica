<script lang="ts">
  import { unlockedElements } from '../stores/game.js';
  import { ELEMENTS } from '../data/elements.js';
  import { REACTIONS } from '../data/reactions.js';
  import ElementCard from './ElementCard.svelte';

  // Ordered list of all possible categories + their display labels
  const CATEGORY_ORDER = ['basic', 'earth', 'water', 'gas', 'compound', 'energy', 'metal', 'space'];
  const CATEGORY_LABELS: Record<string, string> = {
    basic: 'Basics', earth: 'Earth', water: 'Water', gas: 'Gas',
    compound: 'Compounds', energy: 'Energy', metal: 'Metals', space: 'Space',
  };

  // Persist selected filter across sessions
  const FILTER_KEY = 'alchemica_shelf_filter';
  let filter: string = $state(
    typeof localStorage !== 'undefined' ? (localStorage.getItem(FILTER_KEY) ?? 'all') : 'all'
  );
  $effect(() => {
    if (typeof localStorage !== 'undefined') localStorage.setItem(FILTER_KEY, filter);
  });

  // Static: total elements per category across all ELEMENTS
  const allCatCounts: Record<string, number> = (() => {
    const counts: Record<string, number> = {};
    for (const el of Object.values(ELEMENTS)) {
      counts[el.category] = (counts[el.category] ?? 0) + 1;
    }
    return counts;
  })();

  // Active categories (have at least one element defined), in display order
  const activeCategories = CATEGORY_ORDER.filter(cat => (allCatCounts[cat] ?? 0) > 0);

  // Reactive: unlocked count per category
  const unlockedCatCounts = $derived.by(() => {
    const counts: Record<string, number> = {};
    for (const k of $unlockedElements) {
      const cat = ELEMENTS[k]?.category;
      if (cat) counts[cat] = (counts[cat] ?? 0) + 1;
    }
    return counts;
  });

  // Reactive: set of element keys that can produce at least one undiscovered element
  // (player has the element + has at least one partner that together form something new)
  const hasMoreSet = $derived.by(() => {
    const unlocked = $unlockedElements;
    const result = new Set<string>();
    for (const k of unlocked) {
      const canMakeNew = Object.entries(REACTIONS).some(([rxnKey, product]) => {
        if (unlocked.has(product)) return false; // already discovered
        const [a, b] = rxnKey.split('+');
        // k is one reactant; the other reactant must also be unlocked
        return (a === k && unlocked.has(b)) || (b === k && unlocked.has(a));
      });
      if (canMakeNew) result.add(k);
    }
    return result;
  });

  // Reactive: filtered + alphabetically sorted keys
  const filteredKeys = $derived.by(() => {
    const keys = [...$unlockedElements].filter((k) =>
      filter === 'all' ? true : ELEMENTS[k]?.category === filter
    );
    return keys.sort((a, b) =>
      (ELEMENTS[a]?.name ?? a).localeCompare(ELEMENTS[b]?.name ?? b)
    );
  });
</script>

<div class="element-grid-panel">
  <div class="grid-tabs" role="tablist" aria-label="Element categories">
    <!-- All tab -->
    <button
      class="tab-btn"
      class:active={filter === 'all'}
      role="tab"
      aria-selected={filter === 'all'}
      onclick={() => (filter = 'all')}
    >
      All ({$unlockedElements.size})
    </button>
    <!-- Per-category tabs -->
    {#each activeCategories as cat (cat)}
      {@const unlocked = unlockedCatCounts[cat] ?? 0}
      {@const total = allCatCounts[cat] ?? 0}
      <button
        class="tab-btn"
        class:active={filter === cat}
        role="tab"
        aria-selected={filter === cat}
        onclick={() => (filter = cat)}
      >
        {CATEGORY_LABELS[cat] ?? cat}
        <span class="tab-count">{unlocked}/{total}</span>
      </button>
    {/each}
  </div>

  <div class="grid-scroll">
    {#each filteredKeys as key (key)}
      <ElementCard elementKey={key} mode="grid" hasMore={hasMoreSet.has(key)} />
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
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  .grid-tabs::-webkit-scrollbar { display: none; }
  .tab-btn {
    flex-shrink: 0;
    padding: 5px 8px;
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
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    white-space: nowrap;
  }
  .tab-btn.active,
  .tab-btn:hover {
    border-color: #4af0c060;
    color: #4af0c0;
    background: #0f2035;
  }
  .tab-count {
    font-size: 9px;
    color: #4a6080;
    display: block;
  }
  .tab-btn.active .tab-count { color: #4af0c080; }
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
