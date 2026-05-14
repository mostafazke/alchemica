<script lang="ts">
  import { unlockedElements } from '../stores/game.js';
  import { ELEMENTS } from '../data/elements.js';
  import { REACTIONS } from '../data/reactions.js';
  import ElementCard from './ElementCard.svelte';
  import FilterTabs from './FilterTabs.svelte';

  const CATEGORY_ORDER = ['basic', 'earth', 'water', 'gas', 'compound', 'energy', 'metal', 'space'];
  const CATEGORY_LABELS: Record<string, string> = {
    basic: 'Basics', earth: 'Earth', water: 'Water', gas: 'Gas',
    compound: 'Compounds', energy: 'Energy', metal: 'Metals', space: 'Space',
  };

  // Reactive: set of element keys that can produce at least one undiscovered element
  const hasMoreSet = $derived.by(() => {
    const unlocked = $unlockedElements;
    const result = new Set<string>();
    for (const k of unlocked) {
      const canMakeNew = Object.entries(REACTIONS).some(([rxnKey, product]) => {
        if (unlocked.has(product)) return false;
        const [a, b] = rxnKey.split('+');
        return (a === k && unlocked.has(b)) || (b === k && unlocked.has(a));
      });
      if (canMakeNew) result.add(k);
    }
    return result;
  });

  // Derive tabs: "All" first, then discovered categories in CATEGORY_ORDER
  const tabs = $derived.by((): Array<{ cat: string; label: string; count: number }> => {
    const byCat: Record<string, number> = {};
    for (const k of $unlockedElements) {
      const cat = ELEMENTS[k]?.category ?? 'basic';
      byCat[cat] = (byCat[cat] ?? 0) + 1;
    }
    const categoryTabs = CATEGORY_ORDER
      .filter(cat => (byCat[cat] ?? 0) > 0)
      .map(cat => ({ cat, label: CATEGORY_LABELS[cat] ?? cat, count: byCat[cat] }));
    return [{ cat: 'all', label: 'All', count: $unlockedElements.size }, ...categoryTabs];
  });

  let activeFilter = $state('all');

  // Visible element keys for the active filter, sorted alphabetically by name
  const visibleKeys = $derived.by((): string[] => {
    const keys = [...$unlockedElements].filter(k =>
      activeFilter === 'all' || (ELEMENTS[k]?.category ?? 'basic') === activeFilter
    );
    return keys.sort((a, b) => (ELEMENTS[a]?.name ?? a).localeCompare(ELEMENTS[b]?.name ?? b));
  });

  function handleFilterChange(cat: string) {
    activeFilter = cat;
  }
</script>

<div class="shelf-grid">
  <FilterTabs {tabs} {activeFilter} onFilterChange={handleFilterChange} />

  <div class="grid-scroll">
    {#if $unlockedElements.size === 0}
      <p class="empty-shelf">No elements yet — go combine some!</p>
    {:else}
      {#key activeFilter}
        <div class="grid-inner">
          {#each visibleKeys as key (key)}
            <ElementCard elementKey={key} mode="grid" hasMore={hasMoreSet.has(key)} />
          {/each}
        </div>
      {/key}
    {/if}
  </div>
</div>

<style>
  .shelf-grid {
    --shelf-bg: var(--color-bg-deep);
    --shelf-border: var(--color-border-subtle);

    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    background: var(--shelf-bg);
    border-right: 1px solid var(--shelf-border);
  }

  .grid-scroll {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  .grid-inner {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(56px, 1fr));
    gap: 4px;
    padding: 6px;
    animation: fade-in 150ms ease;
  }

  @keyframes fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  .empty-shelf {
    color: var(--color-text-muted);
    font-size: var(--text-body);
    text-align: center;
    padding: 32px 16px;
    line-height: 1.6;
    font-style: italic;
  }
</style>
