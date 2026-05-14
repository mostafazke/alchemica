<script lang="ts">
  let {
    activeFilter = 'all',
    tabs,
    onFilterChange,
  }: {
    activeFilter?: string;
    tabs: Array<{ cat: string; label: string; count: number }>;
    onFilterChange: (cat: string) => void;
  } = $props();
</script>

<div class="filter-tabs" role="tablist" aria-label="Filter by category">
  {#each tabs as tab (tab.cat)}
    <button
      class="tab-btn"
      class:active={activeFilter === tab.cat}
      role="tab"
      aria-selected={activeFilter === tab.cat}
      onclick={() => onFilterChange(tab.cat)}
    >
      <span class="tab-label">{tab.label}</span>
      <span class="tab-count">{tab.count}</span>
    </button>
  {/each}
</div>

<style>
  .filter-tabs {
    --tab-bg-active: var(--color-accent-dim);
    --tab-color-active: var(--color-accent);
    --tab-bg-idle: transparent;
    --tab-color-idle: var(--color-text-muted);

    display: flex;
    flex-direction: row;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    gap: 2px;
    padding: 4px 6px;
    border-bottom: 1px solid var(--color-border-subtle);
    scrollbar-width: none;
  }

  .filter-tabs::-webkit-scrollbar {
    display: none;
  }

  .tab-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1px;
    min-height: 44px;
    min-width: 44px;
    padding: 4px 10px;
    border: none;
    border-radius: 6px;
    background: var(--tab-bg-idle);
    color: var(--tab-color-idle);
    cursor: pointer;
    flex-shrink: 0;
    transition: background-color 100ms, color 100ms;
  }

  .tab-btn.active {
    background: var(--tab-bg-active);
    color: var(--tab-color-active);
  }

  .tab-label {
    font-family: 'Space Mono', monospace;
    font-size: var(--text-caption);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    line-height: 1;
  }

  .tab-count {
    font-family: 'Space Mono', monospace;
    font-size: var(--text-micro);
    font-weight: 700;
    line-height: 1;
  }
</style>
