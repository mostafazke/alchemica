<script lang="ts">
  import { discoveries } from '../stores/game.js';
  import DiscoveryItem from './DiscoveryItem.svelte';
</script>

<aside class="discoveries-panel">
  <div class="disc-header">
    <span class="disc-title">Discoveries</span>
    <span class="disc-count">{$discoveries.length}</span>
  </div>
  <div class="disc-list">
    {#each $discoveries as disc (`${disc.key}-${disc.timestamp}`)}
      <DiscoveryItem discovery={disc} />
    {:else}
      <p class="empty-disc">No discoveries yet. Go combine some elements!</p>
    {/each}
  </div>
</aside>

<style>
  .discoveries-panel {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 0;
    flex: 1;
  }
  .disc-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px 8px;
    border-bottom: 1px solid var(--color-border-subtle);
    flex-shrink: 0;
  }
  .disc-title {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    text-transform: uppercase;
    color: var(--color-text-muted);
    letter-spacing: 1px;
  }
  .disc-count {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    color: var(--color-accent-text);
  }
  .disc-list {
    flex: 1;
    overflow-y: auto;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  .empty-disc {
    color: #2a3550;
    font-size: 12px;
    text-align: center;
    padding: 24px 16px;
    line-height: 1.6;
  }
</style>
