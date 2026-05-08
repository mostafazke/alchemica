<script lang="ts">
  import { toastQueue } from '../stores/toast.js';
  import { BADGES } from '../data/badges.js';
  import type { AchievementId } from '../types.js';

  let current: AchievementId | null = $state(null);
  let visible: boolean = $state(false);
  let exiting: boolean = $state(false);
  let draining = false;

  async function drain() {
    if (draining) return;
    draining = true;

    while (true) {
      let next: AchievementId | null = null;
      toastQueue.update((q) => {
        if (q.length === 0) return q;
        next = q[0];
        return q.slice(1);
      });
      if (!next) break;

      current = next;
      visible = true;
      exiting = false;

      await new Promise<void>((r) => setTimeout(r, 2500));
      exiting = true;
      await new Promise<void>((r) => setTimeout(r, 280));
      visible = false;
      exiting = false;

      await new Promise<void>((r) => setTimeout(r, 300));
    }

    draining = false;
    current = null;
  }

  $effect(() => {
    const unsubscribe = toastQueue.subscribe((q) => {
      if (q.length > 0 && !draining) {
        drain();
      }
    });
    return unsubscribe;
  });

  const badge = $derived(current ? BADGES.find((b) => b.id === current) ?? null : null);
</script>

{#if visible && badge}
  <div class="achievement-toast" class:exiting role="status" aria-live="polite">
    <span class="toast-emoji">{badge.emoji}</span>
    <div class="toast-text">
      <span class="toast-label">Achievement Unlocked</span>
      <span class="toast-name">{badge.name}</span>
    </div>
  </div>
{/if}

<style>
  .achievement-toast {
    position: fixed;
    top: calc(56px + env(safe-area-inset-top, 0px) + 8px);
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(13, 27, 46, 0.95);
    border: 1px solid rgba(74, 240, 192, 0.4);
    border-radius: 12px;
    padding: 10px 18px;
    z-index: 500;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    animation: toast-in 0.2s ease;
    white-space: nowrap;
  }
  @keyframes toast-in {
    from { opacity: 0; transform: translateX(-50%) translateY(-8px); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
  @keyframes toast-out {
    from { opacity: 1; transform: translateX(-50%) translateY(0); }
    to   { opacity: 0; transform: translateX(-50%) translateY(-8px); }
  }
  .achievement-toast.exiting { animation: toast-out 0.28s ease forwards; }
  .toast-emoji {
    font-size: 22px;
    line-height: 1;
  }
  .toast-text {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }
  .toast-label {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #4af0c0;
  }
  .toast-name {
    font-family: 'Space Mono', monospace;
    font-size: 13px;
    font-weight: 700;
    color: #e8e8f0;
  }
</style>
