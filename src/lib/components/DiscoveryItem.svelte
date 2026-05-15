<script lang="ts">
  import { ELEMENTS } from '../data/elements.js';
  import { shareDiscovery } from '../utils/share.js';
  import type { Discovery } from '../types.js';
  import ElementIcon from './ElementIcon.svelte';

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
  <div class="disc-icon {el.color}"><ElementIcon key={discovery.key} /></div>
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
    border-radius: 6px; border: 1px solid var(--color-border-subtle);
    background: var(--color-bg-surface);
  }
  .disc-icon {
    width: 30px; height: 30px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 6px; font-size: 15px; flex-shrink: 0;
  }
  .disc-info { min-width: 0; flex: 1; }
  .disc-name { font-size: 11px; font-weight: 600; color: var(--color-text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .disc-formula { font-family: 'Space Mono', monospace; font-size: 11px; color: var(--color-accent-text); }
  .disc-recipe { font-size: 11px; color: var(--color-text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
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
  .share-btn:hover { color: var(--color-accent); }
</style>
