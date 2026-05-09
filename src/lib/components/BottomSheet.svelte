<script lang="ts">
  import type { Snippet } from 'svelte';

  let { open = false, onClose, children }: {
    open: boolean;
    onClose: () => void;
    children?: Snippet;
  } = $props();

  let touchStartY = 0;

  function handleTouchStart(e: TouchEvent) {
    touchStartY = e.touches[0].clientY;
  }

  function handleTouchMove(e: TouchEvent) {
    if (e.touches[0].clientY - touchStartY > 60) {
      onClose();
    }
  }
</script>

{#if open}
  <div class="sheet-overlay" onclick={onClose} role="none"></div>
{/if}
<div class="bottom-sheet" class:open>
  <div class="sheet-handle-row" role="presentation" ontouchstart={handleTouchStart} ontouchmove={handleTouchMove}>
    <div class="sheet-handle"></div>
  </div>
  <div class="sheet-content">
    {@render children?.()}
  </div>
</div>

<style>
  .sheet-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 299;
  }
  .bottom-sheet {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    max-height: 70vh;
    background: #0d1b2e;
    border-top: 1px solid #1a2e4a;
    border-radius: 16px 16px 0 0;
    z-index: 300;
    transform: translateY(100%);
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    pointer-events: none;
  }
  .bottom-sheet.open {
    transform: translateY(0);
    pointer-events: auto;
  }
  .sheet-handle-row {
    display: flex;
    justify-content: center;
    padding: 10px 0 6px;
    flex-shrink: 0;
  }
  .sheet-handle {
    width: 36px;
    height: 4px;
    background: #1a3a5a;
    border-radius: 2px;
  }
  .sheet-content {
    flex: 1;
    overflow-y: auto;
    padding-bottom: env(safe-area-inset-bottom, 0px);
  }

</style>
