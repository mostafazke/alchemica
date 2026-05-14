<script lang="ts">
  import { triggerNativeReview, markRatingShown } from '../effects/rating.js';
  import { logRatingPromptShown, logRatingPromptAccepted, logRatingPromptDeclined } from '../effects/analytics.js';

  let { open = $bindable(false) }: { open: boolean } = $props();
  let showFeedback = $state(false);
  let modalEl = $state<HTMLDivElement | null>(null);

  $effect(() => {
    if (open) {
      logRatingPromptShown();
      // Move focus into the modal for keyboard / screen reader users
      requestAnimationFrame(() => {
        const first = modalEl?.querySelector<HTMLElement>('button');
        first?.focus();
      });
    }
  });

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      e.preventDefault();
      handleDismiss();
    }
    // Trap focus inside modal
    if (e.key === 'Tab' && modalEl) {
      const focusable = Array.from(modalEl.querySelectorAll<HTMLElement>('button'));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
  }

  async function handleLovingIt() {
    logRatingPromptAccepted();
    markRatingShown();
    open = false;
    await triggerNativeReview();
  }

  function handleNotReally() {
    logRatingPromptDeclined();
    markRatingShown();
    showFeedback = true;
  }

  function handleDismiss() {
    if (showFeedback) {
      showFeedback = false;
      open = false;
      return;
    }
    open = false;
  }

  function handleFeedbackClose() {
    showFeedback = false;
    open = false;
  }
</script>

{#if open}
  <div class="rating-overlay" role="none" onclick={handleDismiss}></div>
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <div bind:this={modalEl} class="rating-modal" role="alertdialog" aria-modal="true" aria-labelledby="rating-title" onkeydown={handleKeydown}>
    {#if showFeedback}
      <h2 id="rating-title" class="rating-title">Thanks for the feedback!</h2>
      <p class="rating-body">We'd love to hear how we can improve. Reach us at:</p>
      <p class="rating-email">alchemica@support.io</p>
      <div class="rating-actions">
        <button class="rating-btn rating-btn-ok" onclick={handleFeedbackClose}>Got it</button>
      </div>
    {:else}
      <h2 id="rating-title" class="rating-title">Enjoying Alchemica? ⚗️</h2>
      <p class="rating-body">Your feedback helps us make the game better for everyone.</p>
      <div class="rating-actions">
        <button class="rating-btn rating-btn-decline" onclick={handleNotReally}>Not really</button>
        <button class="rating-btn rating-btn-accept" onclick={handleLovingIt}>Loving it!</button>
      </div>
    {/if}
  </div>
{/if}

<style>
  .rating-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 500;
  }
  .rating-modal {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 501;
    width: min(340px, 90vw);
    background: var(--color-bg-deep);
    border: 1px solid var(--color-border-mid);
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
    text-align: center;
  }
  .rating-title {
    font-family: 'Space Mono', monospace;
    font-size: 15px;
    color: var(--color-accent);
    letter-spacing: 0.5px;
    margin: 0 0 12px;
  }
  .rating-body {
    font-size: 13px;
    color: var(--color-text-secondary);
    line-height: 1.5;
    margin: 0 0 20px;
  }
  .rating-email {
    font-family: 'Space Mono', monospace;
    font-size: 13px;
    color: var(--color-accent);
    margin: 0 0 20px;
  }
  .rating-actions {
    display: flex;
    gap: 8px;
    justify-content: center;
  }
  .rating-btn {
    padding: 10px 20px;
    border-radius: 8px;
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.15s;
    min-height: 44px;
    touch-action: manipulation;
  }
  .rating-btn-decline {
    background: transparent;
    border: 1px solid var(--color-border-mid);
    color: var(--color-text-secondary);
  }
  .rating-btn-decline:hover { border-color: color-mix(in srgb, var(--color-accent) 25%, transparent); color: var(--color-text-primary); }
  .rating-btn-accept {
    background: var(--color-accent);
    border: 1px solid var(--color-accent);
    color: var(--color-bg-deep);
    font-weight: 700;
  }
  .rating-btn-accept:hover { background: var(--color-accent); border-color: var(--color-accent); }
  .rating-btn-ok {
    background: var(--color-accent);
    border: 1px solid var(--color-accent);
    color: var(--color-bg-deep);
    font-weight: 700;
    min-width: 100px;
  }
  .rating-btn-ok:hover { background: var(--color-accent); border-color: var(--color-accent); }
</style>
