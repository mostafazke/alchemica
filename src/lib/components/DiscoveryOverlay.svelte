<script lang="ts">
  import { onMount, getContext } from 'svelte';
  import { ELEMENTS } from '../data/elements.js';
  import { QUIPS } from '../data/quips.js';
  import { shareDiscoveryCard } from '../utils/share.js';
  import type { AnimationController } from '../effects/animation-controller.js';

  let {
    result,
    onDismiss,
  }: { result: string; onDismiss: () => void } = $props();

  const el = $derived(ELEMENTS[result] ?? null);
  const quip = $derived(QUIPS[result] ?? null);

  const controller = getContext<AnimationController | undefined>('animationController');

  let exiting = $state(false);
  let shareMsg: string | null = $state(null);
  let dismissTimer: ReturnType<typeof setTimeout> | null = null;

  let dialogEl: HTMLElement | null = $state(null);
  let continueBtn: HTMLButtonElement | null = $state(null);
  let emojiEl: HTMLElement | null = $state(null);

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
    // Screen-edge flash via AnimationController (no-op until canvas mounted in Story 3.3)
    controller?.screenFlash('#d4a84a', 0.5);

    // WAA emoji spring scale (skip for reduced-motion)
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reducedMotion && emojiEl) {
      emojiEl.animate(
        [{ transform: 'scale(0.1)' }, { transform: 'scale(1.0)' }],
        { duration: 1200, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', fill: 'both' }
      );
    }

    // Focus Continue button for accessibility
    continueBtn?.focus();

    // Auto-dismiss after 4000ms
    dismissTimer = setTimeout(() => dismiss(), 4000);

    return () => {
      if (dismissTimer !== null) clearTimeout(dismissTimer);
    };
  });

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') { dismiss(); return; }
    if (e.key !== 'Tab' || !dialogEl) return;
    const focusable = Array.from(
      dialogEl.querySelectorAll<HTMLElement>('button, [tabindex]:not([tabindex="-1"])')
    ).filter((el) => !(el as HTMLButtonElement).disabled);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

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

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  bind:this={dialogEl}
  class="discovery-overlay"
  class:exiting
  role="dialog"
  aria-modal="true"
  aria-label="New discovery"
  tabindex="-1"
  onclick={dismiss}
  onkeydown={handleKeydown}
>
  <!-- 1px progress bar along top edge -->
  <div class="progress-bar" class:exiting></div>

  {#if el}
    <!-- ✦ NEW DISCOVERY badge -->
    <div class="discovery-badge">✦ NEW DISCOVERY</div>

    <!-- Element emoji: 72×72px with category color class, WAA scale target -->
    <div class="discovery-emoji {el.color}" bind:this={emojiEl}>{el.symbol}</div>

    <!-- Name + formula fade in at 300ms -->
    <div class="discovery-name discovery-delayed">{el.name}</div>
    <div class="discovery-formula discovery-delayed">{el.formula}</div>

    <!-- Flavor quip -->
    {#if quip}
      <div class="discovery-quip">"{quip}"</div>
    {/if}
  {/if}

  <!-- Share button -->
  <button class="discovery-share-btn" onclick={handleShare} aria-label="Share discovery">
    {shareMsg ?? '🔗 Share'}
  </button>

  <!-- Continue button (fades in at 400ms, receives focus on mount) -->
  <button
    class="discovery-continue-btn"
    bind:this={continueBtn}
    onclick={dismiss}
    aria-label="Continue mixing"
  >
    Continue →
  </button>
</div>

<style>
  /* ── Overlay ──────────────────────────────────────────────────────── */
  .discovery-overlay {
    position: absolute;
    inset: 0;
    z-index: 10;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 16px;
    cursor: pointer;
    animation: overlay-enter 200ms ease-out both;
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
    background: var(--color-accent);
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

  /* ── Emoji icon ───────────────────────────────────────────────────── */
  .discovery-emoji {
    width: 72px;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    font-size: 36px;
    flex-shrink: 0;
    /* Initial scale: WAA will animate to 1.0; shown at 1.0 for reduced-motion */
    transform: scale(0.1);
  }
  @media (prefers-reduced-motion: reduce) {
    .discovery-emoji { transform: scale(1.0); }
  }

  /* Category color classes */
  :global(.discovery-emoji.cat-fire)     { background: #2d1810; color: #ff6b35; }
  :global(.discovery-emoji.cat-water)    { background: #0d2040; color: #5ab4ff; }
  :global(.discovery-emoji.cat-earth)    { background: #1a2010; color: #96c84a; }
  :global(.discovery-emoji.cat-air)      { background: #1a1a2e; color: #c8c8ff; }
  :global(.discovery-emoji.cat-metal)    { background: #2a2a1a; color: #c8b460; }
  :global(.discovery-emoji.cat-energy)   { background: #2d1a40; color: #d05aff; }
  :global(.discovery-emoji.cat-gas)      { background: #1a2a2a; color: #80d0c0; }
  :global(.discovery-emoji.cat-compound) { background: #2a1a2a; color: #d080a0; }
  :global(.discovery-emoji.cat-space)    { background: #0a0a1e; color: #7eb8f7; }
  :global(.discovery-emoji.cat-basic)    { background: #1a2a3a; color: var(--color-text-secondary); }

  /* ── Staged fade-ins ──────────────────────────────────────────────── */
  .discovery-delayed {
    opacity: 0;
    animation: fade-in 300ms ease 300ms both;
  }
  @keyframes fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @media (prefers-reduced-motion: reduce) {
    .discovery-delayed { animation: none; opacity: 1; }
  }

  /* ── Name ─────────────────────────────────────────────────────────── */
  .discovery-name {
    font-size: 16px;
    font-weight: 700;
    color: var(--color-accent);
    text-align: center;
  }

  /* ── Formula ──────────────────────────────────────────────────────── */
  .discovery-formula {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    color: var(--color-text-muted);
    text-align: center;
  }

  /* ── Quip ─────────────────────────────────────────────────────────── */
  .discovery-quip {
    font-size: 13px;
    font-style: italic;
    color: var(--color-text-secondary);
    text-align: center;
    max-width: 220px;
    line-height: 1.4;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
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
    border: 1px solid var(--color-border-active);
    border-radius: 8px;
    color: var(--color-accent);
    font-family: 'Space Mono', monospace;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
    touch-action: manipulation;
    margin-top: 4px;
    opacity: 0;
    animation: fade-in 300ms ease 400ms both;
  }
  .discovery-continue-btn:hover {
    background: rgba(74, 240, 192, 0.08);
    border-color: var(--color-accent);
  }
  @media (prefers-reduced-motion: reduce) {
    .discovery-continue-btn { animation: none; opacity: 1; }
  }
</style>
