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
      <p class="empty-disc">No discoveries yet</p>
    {/each}
  </div>
</aside>

<style>
  .discoveries-panel {
    display: flex; flex-direction: column;
    background: #080f1a;
    border-left: 1px solid #1a2e4a;
    width: 210px; flex-shrink: 0;
    overflow: hidden;
  }
  .disc-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 12px 6px;
  }
  .disc-title { font-family: 'Space Mono', monospace; font-size: 10px; text-transform: uppercase; color: #4a6080; letter-spacing: 1px; }
  .disc-count { font-family: 'Space Mono', monospace; font-size: 10px; color: #4af0c0; }
  .disc-list {
    flex: 1; overflow-y: auto;
    padding: 0 8px 8px;
    display: flex; flex-direction: column; gap: 3px;
  }
  .empty-disc { color: #2a3550; font-size: 11px; text-align: center; padding: 16px; }
</style>
