<script lang="ts">
  import { onMount } from 'svelte';
  import { ELEMENTS } from '../data/elements.js';
  import { QUIPS } from '../data/quips.js';
  import { shareDiscoveryCard } from '../utils/share.js';

  let {
    result,
    onDismiss,
  }: { result: string; onDismiss: () => void } = $props();

  const el = $derived(ELEMENTS[result] ?? null);
  const quip = $derived(QUIPS[result] ?? null);

  let exiting = $state(false);
  let flashVisible = $state(true);
  let shareMsg = $state<string | null>(null);
  let dismissTimer: ReturnType<typeof setTimeout> | null = null;

  function dismiss() {
    if (exiting) return;
    exiting = true;
    if (dismissTimer !== null) {
      clearTimeout(dismissTimer);
      dismissTimer = null;
    }
    // Wait for exit animation (180ms) then call onDismiss
    setTimeout(() => onDismiss(), 180);
  }

  onMount(() => {
    // Screen-edge flash: opacity 0→1 over 80ms then 1→0 over 80ms (total 160ms)
    // flashVisible is true initially, CSS handles the animation; remove after 160ms
    setTimeout(() => { flashVisible = false; }, 160);

    // Auto-dismiss after 4000ms
    dismissTimer = setTimeout(() => dismiss(), 4000);

    return () => {
      if (dismissTimer !== null) clearTimeout(dismissTimer);
    };
  });

  async function handleShare(e: MouseEvent) {
    e.stopPropagation();
    shareMsg = '…';
    const res = await shareDiscoveryCard(result);
    if (res.method === 'clipboard' && res.ok) {
      shareMsg = 'Copied!';
      setTimeout(() => { shareMsg = null; }, 1500);
    } else {
      shareMsg = null;
    }
  }
</script>

<!-- Screen-edge flash (position: fixed, renders outside mixing-chamber) -->
{#if flashVisible}
  <div class="edge-flash" aria-hidden="true"></div>
{/if}

<!-- Full-chamber overlay (position: absolute, constrained to mixing-chamber) -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="discovery-overlay"
  class:exiting
  onclick={dismiss}
>
  <!-- 1px progress bar along top edge -->
  <div class="progress-bar" class:exiting></div>

  {#if el}
    <!-- ✦ NEW DISCOVERY badge -->
    <div class="discovery-badge">✦ NEW DISCOVERY</div>

    <!-- Element icon: 72×72px with category color class -->
    <div class="discovery-icon {el.color}">{el.symbol}</div>

    <!-- Element name -->
    <div class="discovery-name">{el.name}</div>

    <!-- Formula -->
    <div class="discovery-formula">{el.formula}</div>

    <!-- Flavor quip -->
    {#if quip}
      <div class="discovery-quip">"{quip}"</div>
    {/if}
  {/if}

  <!-- Share button -->
  <button class="discovery-share-btn" onclick={handleShare} aria-label="Share discovery">
    {shareMsg ?? '🔗 Share'}
  </button>

  <!-- Continue button -->
  <button class="discovery-continue-btn" onclick={dismiss} aria-label="Continue mixing">
    Continue →
  </button>
</div>

<style>
  /* ── Screen-edge flash ────────────────────────────────────────────── */
  .edge-flash {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 9999;
    background: rgba(74, 240, 192, 0.08);
    animation: edge-flash 160ms ease both;
  }
  @keyframes edge-flash {
    0%   { opacity: 0; }
    50%  { opacity: 1; }
    100% { opacity: 0; }
  }

  /* ── Overlay ──────────────────────────────────────────────────────── */
  .discovery-overlay {
    position: absolute;
    inset: 0;
    z-index: 10;
    background: rgba(6, 18, 34, 0.96);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 16px;
    cursor: pointer;
    animation: overlay-enter 180ms ease-out both;
    border-radius: inherit;
    overflow: hidden;
  }
  .discovery-overlay.exiting {
    animation: overlay-exit 180ms ease-in both;
  }
  @keyframes overlay-enter {
    from { opacity: 0; transform: scale(0.92); }
    to   { opacity: 1; transform: scale(1.0); }
  }
  @keyframes overlay-exit {
    from { opacity: 1; transform: scale(1.0); }
    to   { opacity: 0; transform: scale(0.95); }
  }

  /* ── Progress bar ─────────────────────────────────────────────────── */
  .progress-bar {
    position: absolute;
    top: 0;
    left: 0;
    height: 1px;
    width: 0;
    background: #4af0c0;
    animation: progress 4000ms linear forwards;
    border-radius: 0 1px 1px 0;
  }
  .progress-bar.exiting {
    animation: none;
  }
  @keyframes progress {
    from { width: 0; }
    to   { width: 100%; }
  }

  /* ── Badge ────────────────────────────────────────────────────────── */
  .discovery-badge {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    color: #ffe44a;
    text-transform: uppercase;
    letter-spacing: 2px;
    text-align: center;
  }

  /* ── Icon ─────────────────────────────────────────────────────────── */
  .discovery-icon {
    width: 72px;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    font-size: 36px;
    animation: icon-spring 400ms cubic-bezier(0.34, 1.56, 0.64, 1) 180ms both;
    flex-shrink: 0;
  }
  @keyframes icon-spring {
    from { transform: scale(0.1); }
    to   { transform: scale(1.0); }
  }

  /* Category color classes (mirrored from ElementCard global) */
  :global(.discovery-icon.cat-fire)     { background: #2d1810; color: #ff6b35; }
  :global(.discovery-icon.cat-water)    { background: #0d2040; color: #5ab4ff; }
  :global(.discovery-icon.cat-earth)    { background: #1a2010; color: #96c84a; }
  :global(.discovery-icon.cat-air)      { background: #1a1a2e; color: #c8c8ff; }
  :global(.discovery-icon.cat-metal)    { background: #2a2a1a; color: #c8b460; }
  :global(.discovery-icon.cat-energy)   { background: #2d1a40; color: #d05aff; }
  :global(.discovery-icon.cat-gas)      { background: #1a2a2a; color: #80d0c0; }
  :global(.discovery-icon.cat-compound) { background: #2a1a2a; color: #d080a0; }
  :global(.discovery-icon.cat-space)    { background: #0a0a1e; color: #7eb8f7; }
  :global(.discovery-icon.cat-basic)    { background: #1a2a3a; color: #8ab4d4; }

  /* ── Name ─────────────────────────────────────────────────────────── */
  .discovery-name {
    font-size: 16px;
    font-weight: 700;
    color: #4af0c0;
    text-align: center;
  }

  /* ── Formula ──────────────────────────────────────────────────────── */
  .discovery-formula {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    color: #4a6080;
    text-align: center;
  }

  /* ── Quip ─────────────────────────────────────────────────────────── */
  .discovery-quip {
    font-size: 13px;
    font-style: italic;
    color: #6a8aa4;
    text-align: center;
    max-width: 220px;
    line-height: 1.4;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  /* ── Share button ─────────────────────────────────────────────────── */
  .discovery-share-btn {
    margin-top: 4px;
    padding: 6px 16px;
    background: transparent;
    border: 1px solid rgba(232, 184, 75, 0.3);
    border-radius: 8px;
    color: rgba(232, 184, 75, 0.8);
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    cursor: pointer;
    transition: border-color 0.15s, color 0.15s;
    min-height: 44px;
    touch-action: manipulation;
  }
  .discovery-share-btn:hover {
    border-color: rgba(232, 184, 75, 0.6);
    color: #ffe44a;
  }

  /* ── Continue button ──────────────────────────────────────────────── */
  .discovery-continue-btn {
    width: 100%;
    min-height: 44px;
    background: transparent;
    border: 1px solid #4af0c060;
    border-radius: 8px;
    color: #4af0c0;
    font-family: 'Space Mono', monospace;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
    touch-action: manipulation;
    margin-top: 4px;
  }
  .discovery-continue-btn:hover {
    background: rgba(74, 240, 192, 0.08);
    border-color: #4af0c0;
  }
</style>
