<script lang="ts">
  import { ELEMENTS } from '../data/elements.js';
  import { shareDiscovery } from '../utils/share.js';
  import type { Discovery } from '../types.js';

  let { discovery }: { discovery: Discovery } = $props();
  const el = $derived(ELEMENTS[discovery.key]);

  let copied = $state(false);

  async function handleShare() {
    const result = await shareDiscovery(discovery.key);
    if (result.method === 'clipboard' && result.ok) {
      copied = true;
      setTimeout(() => { copied = false; }, 1500);
    }
  }
</script>

{#if el}
<div class="disc-item">
  <div class="disc-icon {el.color}">{el.symbol}</div>
  <div class="disc-info">
    <div class="disc-name">{el.name}</div>
    <div class="disc-formula">{el.formula}</div>
    <div class="disc-recipe">{discovery.recipe}</div>
  </div>
  <button class="share-btn" onclick={handleShare} aria-label="Share {el.name}" title="Share">
    {copied ? '✓' : '🔗'}
  </button>
</div>
{/if}

<style>
  .disc-item {
    display: flex; align-items: center; gap: 8px;
    padding: 6px 8px;
    border-radius: 6px; border: 1px solid #1a2e4a;
    background: #0a1520;
  }
  .disc-icon {
    width: 30px; height: 30px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 6px; font-size: 15px; flex-shrink: 0;
  }
  .disc-info { min-width: 0; flex: 1; }
  .disc-name { font-size: 11px; font-weight: 600; color: #c8d8e8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .disc-formula { font-family: 'Space Mono', monospace; font-size: 11px; color: #4af0c0; }
  .disc-recipe { font-size: 11px; color: #4a6080; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .share-btn {
    flex-shrink: 0;
    background: transparent; border: none;
    color: #2a4060; font-size: 13px;
    cursor: pointer; padding: 0;
    border-radius: 6px; min-width: 44px; min-height: 44px;
    display: flex; align-items: center; justify-content: center;
    touch-action: manipulation; transition: color 0.15s;
    line-height: 1;
  }
  .share-btn:hover { color: #4af0c0; }
</style>
