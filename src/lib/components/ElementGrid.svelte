<script lang="ts">
  import { unlockedElements } from '../stores/game.js';
  import { ELEMENTS } from '../data/elements.js';
  import { REACTIONS } from '../data/reactions.js';
  import ElementCard from './ElementCard.svelte';

  const CATEGORY_ORDER = ['basic', 'earth', 'water', 'gas', 'compound', 'energy', 'metal', 'space'];
  const CATEGORY_LABELS: Record<string, string> = {
    basic: 'Basics', earth: 'Earth', water: 'Water', gas: 'Gas',
    compound: 'Compounds', energy: 'Energy', metal: 'Metals', space: 'Space',
  };
  const CATEGORY_ICONS: Record<string, string> = {
    basic: '🔵', earth: '🌍', water: '💧', gas: '💨',
    compound: '🧪', energy: '⚡', metal: '⚙️', space: '🌌',
  };

  // Static: total elements per category
  const allCatCounts: Record<string, number> = (() => {
    const counts: Record<string, number> = {};
    for (const el of Object.values(ELEMENTS)) {
      counts[el.category] = (counts[el.category] ?? 0) + 1;
    }
    return counts;
  })();

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

  // Reactive: elements grouped by category, in CATEGORY_ORDER, alphabetically within each group
  const groups = $derived.by(() => {
    const byCategory: Record<string, string[]> = {};
    for (const k of $unlockedElements) {
      const cat = ELEMENTS[k]?.category ?? 'basic';
      (byCategory[cat] ??= []).push(k);
    }
    for (const keys of Object.values(byCategory)) {
      keys.sort((a, b) => (ELEMENTS[a]?.name ?? a).localeCompare(ELEMENTS[b]?.name ?? b));
    }
    return CATEGORY_ORDER
      .filter(cat => (byCategory[cat]?.length ?? 0) > 0)
      .map(cat => ({ cat, keys: byCategory[cat] }));
  });
</script>

<div class="element-grid-panel">
  <div class="grid-scroll">
    {#if $unlockedElements.size === 0}
      <p class="empty-grid">No elements yet. Go combine some!</p>
    {:else}
      {#each groups as group (group.cat)}
        <div class="cat-section">
          <div class="cat-header">
            <span class="cat-icon">{CATEGORY_ICONS[group.cat] ?? '▪'}</span>
            <span class="cat-label">{CATEGORY_LABELS[group.cat] ?? group.cat}</span>
            <span class="cat-count">{group.keys.length}<span class="cat-total">/{allCatCounts[group.cat] ?? '?'}</span></span>
          </div>
          <div class="cat-grid">
            {#each group.keys as key (key)}
              <ElementCard elementKey={key} mode="grid" hasMore={hasMoreSet.has(key)} />
            {/each}
          </div>
        </div>
      {/each}
    {/if}
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

  .grid-scroll {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    display: flex;
    flex-direction: column;
  }

  /* Category section */
  .cat-section {
    display: flex;
    flex-direction: column;
  }

  .cat-header {
    position: sticky;
    top: 0;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 5px 10px;
    background: #080f1a;
    border-bottom: 1px solid #1a2e4a;
    border-top: 1px solid #1a2e4a;
  }

  .cat-section:first-child .cat-header {
    border-top: none;
  }

  .cat-icon {
    font-size: 11px;
    line-height: 1;
  }

  .cat-label {
    font-family: 'Space Mono', monospace;
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #4a6080;
    flex: 1;
  }

  .cat-count {
    font-family: 'Space Mono', monospace;
    font-size: 9px;
    color: #4af0c0;
  }

  .cat-total {
    color: #2a4060;
  }

  .cat-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(76px, 1fr));
    gap: 6px;
    padding: 8px;
  }

  .empty-grid {
    color: #2a3550;
    font-size: 11px;
    text-align: center;
    padding: 32px 16px;
    line-height: 1.6;
  }
</style>
