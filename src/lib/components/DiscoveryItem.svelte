<script lang="ts">
  import { ELEMENTS } from '../data/elements.js';
  import type { Discovery } from '../types.js';

  let { discovery }: { discovery: Discovery } = $props();
  const el = $derived(ELEMENTS[discovery.key]);
</script>

{#if el}
<div class="disc-item">
  <div class="disc-icon {el.color}">{el.symbol}</div>
  <div class="disc-info">
    <div class="disc-name">{el.name}</div>
    <div class="disc-formula">{el.formula}</div>
    <div class="disc-recipe">{discovery.recipe}</div>
  </div>
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
  .disc-info { min-width: 0; }
  .disc-name { font-size: 11px; font-weight: 600; color: #c8d8e8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .disc-formula { font-family: 'Space Mono', monospace; font-size: 9px; color: #4af0c0; }
  .disc-recipe { font-size: 9px; color: #4a6080; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
</style>
