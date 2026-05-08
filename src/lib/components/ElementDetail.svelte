<script lang="ts">
  import type { Element } from '../types.js';

  let { element, onClose }: {
    element: Element | null;
    onClose: () => void;
  } = $props();
</script>

{#if element}
  <div class="detail-overlay" onclick={onClose} role="none"></div>
  <div class="detail-card" role="dialog" aria-label="Element details">
    <button class="detail-close" onclick={onClose} aria-label="Close">✕</button>
    <div class="detail-symbol-row">
      <div class="detail-icon {element.color}">{element.symbol}</div>
      <div class="detail-header">
        <div class="detail-name">{element.name}</div>
        <div class="detail-formula">{element.formula}</div>
        <div class="detail-category">{element.category}</div>
      </div>
    </div>
    <p class="detail-desc">{element.desc}</p>
    {#if element.recipe}
      <div class="detail-recipe">
        <span class="recipe-label">Recipe</span>
        <span class="recipe-value">{element.recipe}</span>
      </div>
    {:else}
      <div class="detail-recipe">
        <span class="recipe-label">Starter element — always available</span>
      </div>
    {/if}
  </div>
{/if}

<style>
  .detail-overlay {
    position: fixed;
    inset: 0;
    z-index: 400;
    background: transparent;
  }
  .detail-card {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 401;
    width: min(320px, 90vw);
    background: #0d1b2e;
    border: 1px solid #1a3a5a;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px #4af0c020;
    animation: detail-appear 0.18s ease;
  }
  @keyframes detail-appear {
    from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); }
    to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  }
  .detail-close {
    position: absolute;
    top: 8px; right: 8px;
    background: transparent; border: none;
    color: #4a6080; font-size: 14px;
    cursor: pointer; padding: 0;
    border-radius: 6px; line-height: 1;
    min-width: 44px; min-height: 44px;
    display: flex; align-items: center; justify-content: center;
    transition: color 0.15s;
    touch-action: manipulation;
  }
  .detail-close:hover { color: #ff6b6b; }
  .detail-symbol-row {
    display: flex; align-items: center; gap: 14px;
    margin-bottom: 12px;
  }
  .detail-icon {
    width: 52px; height: 52px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 12px; font-size: 28px; flex-shrink: 0;
  }
  .detail-header { min-width: 0; }
  .detail-name {
    font-size: 18px; font-weight: 700; color: #c8d8e8;
    margin-bottom: 2px;
  }
  .detail-formula {
    font-family: 'Space Mono', monospace;
    font-size: 12px; color: #4af0c0; margin-bottom: 2px;
  }
  .detail-category {
    font-size: 10px; color: #4a6080;
    text-transform: uppercase; letter-spacing: 0.5px;
  }
  .detail-desc {
    font-size: 13px; color: #8ab4d4; line-height: 1.5;
    margin-bottom: 12px;
  }
  .detail-recipe {
    background: #080f1a;
    border: 1px solid #1a2e4a;
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 12px;
  }
  .recipe-label {
    font-family: 'Space Mono', monospace;
    color: #4a6080; font-size: 10px;
    text-transform: uppercase; letter-spacing: 0.5px;
    display: block; margin-bottom: 2px;
  }
  .recipe-value {
    color: #ffe44a; font-weight: 600;
  }
</style>
