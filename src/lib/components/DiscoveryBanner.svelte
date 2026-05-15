<script lang="ts">
  import { ELEMENTS } from '../data/elements.js';
  import { discoveryBannerQueue } from '../stores/discoveryBanner.js';
  import { shareDiscoveryCard } from '../utils/share.js';
  import type { DiscoveryBannerPayload } from '../stores/discoveryBanner.js';

  const DISPLAY_MS = 8000;
  const EXIT_MS = 280;

  let current: DiscoveryBannerPayload | null = $state(null);
  let visible: boolean = $state(false);
  let exiting: boolean = $state(false);
  let draining = false;
  let shareMsg = $state<string | null>(null);
  let dismissTimer: ReturnType<typeof setTimeout> | null = null;

  async function drain() {
    if (draining) return;
    draining = true;

    while (true) {
      let next: DiscoveryBannerPayload | null = null;
      discoveryBannerQueue.update((q) => {
        if (q.length === 0) return q;
        next = q[0];
        return q.slice(1);
      });
      if (!next) break;

      shareMsg = null;
      current = next;
      exiting = false;
      visible = true;

      // Auto-dismiss after DISPLAY_MS
      await new Promise<void>((resolve) => {
        dismissTimer = setTimeout(resolve, DISPLAY_MS);
      });

      await exit();
    }

    draining = false;
    current = null;
  }

  async function exit() {
    if (dismissTimer) { clearTimeout(dismissTimer); dismissTimer = null; }
    exiting = true;
    await new Promise<void>((r) => setTimeout(r, EXIT_MS));
    visible = false;
    exiting = false;
  }

  function dismiss() {
    if (!visible || exiting) return;
    exit();
    // If there are more items queued, the drain loop handles them
    // after exit() resolves.
  }

  $effect(() => {
    const unsubscribe = discoveryBannerQueue.subscribe((q) => {
      if (q.length > 0 && !draining) drain();
    });
    return unsubscribe;
  });

  async function handleShare() {
    if (!current) return;
    shareMsg = '…';
    const res = await shareDiscoveryCard(current.elementKey);
    if (res.method === 'clipboard' && res.ok) {
      shareMsg = 'Copied!';
      setTimeout(() => { shareMsg = null; }, 1500);
    } else {
      shareMsg = null;
    }
  }

  const el = $derived(current ? (ELEMENTS[current.elementKey] ?? null) : null);
</script>

{#if visible && el && current}
  <div
    class="discovery-banner"
    class:exiting
    role="status"
    aria-live="assertive"
  >
    <div class="banner-inner">
      <div class="banner-left">
        <span class="banner-symbol">{el.symbol}</span>
      </div>
      <div class="banner-body">
        <span class="banner-headline">✨ New! {el.name}</span>
        <span class="banner-formula">{el.formula}</span>
        <span class="banner-fact">{el.desc}</span>
        <span class="banner-count">Discovery #{current.discoveryNumber} of {current.totalElements}</span>
      </div>
      <div class="banner-actions">
        <button class="share-btn" onclick={handleShare} aria-label="Share discovery">
          {shareMsg ?? '🔗'}
        </button>
        <button class="close-btn" onclick={dismiss} aria-label="Dismiss">×</button>
      </div>
    </div>
    <div class="banner-progress">
      <div class="banner-progress-bar"></div>
    </div>
  </div>
{/if}

<style>
  .discovery-banner {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 20;
    padding: 0 0 0 0;
    animation: slide-down 0.3s cubic-bezier(0.34, 1.1, 0.64, 1) both;
    pointer-events: all;
    cursor: pointer;
  }
  .discovery-banner.exiting {
    animation: slide-up 0.28s ease-in both;
  }

  @keyframes slide-down {
    from { transform: translateY(-100%); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
  }
  @keyframes slide-up {
    from { transform: translateY(0);    opacity: 1; }
    to   { transform: translateY(-100%); opacity: 0; }
  }

  .banner-inner {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    background: linear-gradient(135deg, #0d1f10 0%, #071424 100%);
    border-bottom: 2px solid #ffe44a60;
    box-shadow: 0 4px 20px rgba(60, 30, 10, 0.15), 0 0 30px rgba(200, 136, 10, 0.08);
    cursor: default;
  }

  .banner-left {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    background: rgba(255, 228, 74, 0.08);
    border: 1px solid rgba(255, 228, 74, 0.25);
    border-radius: 10px;
  }
  .banner-symbol {
    font-size: 28px;
    line-height: 1;
  }

  .banner-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-width: 0;
  }
  .banner-headline {
    font-family: 'Space Mono', monospace;
    font-size: 13px;
    font-weight: 700;
    color: #ffe44a;
    letter-spacing: 0.2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .banner-formula {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    color: var(--color-accent);
    letter-spacing: 0.5px;
  }
  .banner-fact {
    font-size: 11px;
    color: var(--color-text-secondary);
    line-height: 1.3;
    /* clamp to 2 lines */
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .banner-count {
    font-family: 'Space Mono', monospace;
    font-size: 9px;
    color: var(--color-text-muted);
    letter-spacing: 0.3px;
    margin-top: 1px;
  }

  .banner-actions {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }
  .share-btn {
    padding: 4px 8px;
    background: transparent;
    border: 1px solid var(--color-border-mid);
    border-radius: 6px;
    color: var(--color-accent);
    font-size: 12px;
    cursor: pointer;
    transition: border-color 0.15s, color 0.15s;
    white-space: nowrap;
    min-width: 36px;
    text-align: center;
  }
  .share-btn:hover { border-color: var(--color-accent); color: #fff; }

  .close-btn {
    padding: 2px 8px;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    color: var(--color-text-muted);
    font-size: 14px;
    line-height: 1;
    cursor: pointer;
    transition: color 0.15s, border-color 0.15s;
  }
  .close-btn:hover { color: var(--color-text-primary); border-color: rgba(255, 255, 255, 0.3); }

  /* Progress bar — drains over DISPLAY_MS to show remaining time */
  .banner-progress {
    height: 2px;
    background: rgba(255, 228, 74, 0.12);
    overflow: hidden;
  }
  .banner-progress-bar {
    height: 100%;
    background: #ffe44a;
    animation: drain-bar 3s linear both;
    transform-origin: left;
  }
  @keyframes drain-bar {
    from { transform: scaleX(1); }
    to   { transform: scaleX(0); }
  }
</style>
