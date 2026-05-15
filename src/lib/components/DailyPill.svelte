<script lang="ts">
  import { dailyChallengeTarget, dailyCompleted } from '../stores/daily.js';
  import { ELEMENTS } from '../data/elements.js';
  import DailyChallenge from './DailyChallenge.svelte';

  const element = $derived(ELEMENTS[$dailyChallengeTarget] ?? null);

  let open = $state(false);

  function toggleOpen(e: MouseEvent) {
    e.stopPropagation();
    open = !open;
  }

  function closePanel() {
    open = false;
  }
</script>

{#if element !== null}
  <!-- Collapsed pill — 28px height, 44px tap zone via padding -->
  <div
    class="daily-pill"
    class:completed={$dailyCompleted}
    onclick={toggleOpen}
    role="button"
    tabindex="0"
    aria-label="Daily challenge: {element.name}"
    onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleOpen(e as unknown as MouseEvent); }}
  >
    <span class="pill-label">
      {#if $dailyCompleted}
        ✓ {element.name}
      {:else}
        🔥 {element.name}
      {/if}
    </span>
  </div>
{/if}

<!-- Full DailyChallenge panel — position: fixed overlay to avoid BottomSheet desktop bug -->
{#if open}
  <div class="pill-backdrop" onclick={closePanel} aria-hidden="true"></div>
  <div class="pill-panel" role="dialog" aria-label="Daily Challenge">
    <div class="pill-panel-inner">
      <DailyChallenge />
      <button class="pill-close" onclick={closePanel} aria-label="Close daily challenge">✕</button>
    </div>
  </div>
{/if}

<style>
  /* ── Collapsed pill ──────────────────────────────────────────────── */
  .daily-pill {
    display: flex;
    align-items: center;
    height: 28px;
    border-radius: 14px;
    padding: 0 10px;
    /* Extend tap area to 44px min via transparent vertical padding */
    margin: -8px 0;
    padding-top: 8px;
    padding-bottom: 8px;
    background: rgba(232, 184, 75, 0.10);
    border: 1px solid rgba(232, 184, 75, 0.35);
    cursor: pointer;
    touch-action: manipulation;
    flex-shrink: 0;
    transition: border-color 0.15s, background 0.15s;
    user-select: none;
  }
  .daily-pill.completed {
    border-color: rgba(200, 136, 10, 0.35);
    background: rgba(200, 136, 10, 0.06);
  }
  .daily-pill:hover {
    background: rgba(232, 184, 75, 0.16);
    border-color: rgba(232, 184, 75, 0.55);
  }
  .daily-pill.completed:hover {
    background: rgba(200, 136, 10, 0.10);
    border-color: rgba(200, 136, 10, 0.55);
  }
  .pill-label {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    color: var(--color-accent);
    white-space: nowrap;
    line-height: 28px;
  }
  .daily-pill.completed .pill-label {
    color: var(--color-accent);
  }

  /* ── Full-panel overlay ──────────────────────────────────────────── */
  .pill-backdrop {
    position: fixed;
    inset: 0;
    z-index: 290;
    background: transparent;
  }
  .pill-panel {
    position: fixed;
    inset: auto 0 0 0;
    z-index: 300;
    background: var(--color-bg-deep);
    border-top: 1px solid var(--color-border-subtle);
    border-radius: 16px 16px 0 0;
    animation: panel-in 0.24s cubic-bezier(0.34, 1.2, 0.64, 1) both;
  }
  @keyframes panel-in {
    from { transform: translateY(100%); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
  }
  .pill-panel-inner {
    position: relative;
    padding: 20px 16px 16px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 16px);
  }
  .pill-close {
    position: absolute;
    top: 12px;
    right: 12px;
    background: transparent;
    border: 1px solid var(--color-border-mid);
    border-radius: 6px;
    color: var(--color-text-muted);
    font-size: 14px;
    cursor: pointer;
    min-width: 44px;
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    touch-action: manipulation;
    transition: color 0.15s, border-color 0.15s;
  }
  .pill-close:hover {
    color: var(--color-accent);
    border-color: color-mix(in srgb, var(--color-accent) 25%, transparent);
  }

  @media (max-width: 400px) {
    .daily-pill { display: none; }
  }
</style>
