<script lang="ts">
  import { ELEMENTS } from '../data/elements.js';
  import ElementIcon from './ElementIcon.svelte';

  const FAIL_MSGS = [
    'Not yet…',
    'These don\'t react…',
    'Something\'s missing…',
    'Almost — try another path.',
  ];

  let {
    state: zoneState = 'idle',
    result = null,
    pts = 0,
  }: {
    state?: 'idle' | 'discovery' | 'known' | 'failure';
    result?: string | null;
    pts?: number;
  } = $props();

  const el = $derived(result ? ELEMENTS[result] : null);

  // Randomise fail message each time we enter failure state
  let failMsg = $state(FAIL_MSGS[0]);
  $effect(() => {
    if (zoneState === 'failure') {
      failMsg = FAIL_MSGS[Math.floor(Math.random() * FAIL_MSGS.length)];
    }
  });
</script>

<div
  class="action-zone"
  class:discovery={zoneState === 'discovery'}
  class:known={zoneState === 'known'}
  class:failure={zoneState === 'failure'}
>
  <!-- Discovery live region: assertive so screen reader announces immediately -->
  <div aria-live="assertive" aria-atomic="true" class="live-region">
    {#if zoneState === 'discovery' && el}
      <div class="zone-icon"><ElementIcon key={result} /></div>
      <div class="zone-label discovery-label">✦ NEW: {el.name}</div>
      {#if el.recipe}
        <div class="zone-recipe">{el.recipe}</div>
      {/if}
      {#key result}
        {#if pts > 0}
          <span class="pts-float discovery-pts">+{pts} pts</span>
        {/if}
      {/key}
    {/if}
  </div>

  <!-- Known / failure live region: polite for less intrusive announcements -->
  <div aria-live="polite" aria-atomic="true" class="live-region">
    {#if zoneState === 'known' && el}
      <div class="zone-icon zone-icon-sm"><ElementIcon key={result} /></div>
      <div class="zone-label known-label">{el.name}</div>
      {#if el.recipe}
        <div class="zone-recipe">{el.recipe}</div>
      {/if}
      {#key result}
        {#if pts > 0}
          <span class="pts-float known-pts">+{pts} pts</span>
        {/if}
      {/key}
    {:else if zoneState === 'failure'}
      <div class="zone-fail">{failMsg}</div>
    {/if}
  </div>

  <!-- Idle state: not in a live region (static prompt) -->
  {#if zoneState === 'idle'}
    <div class="zone-idle">Tap two elements to combine</div>
  {/if}
</div>

<style>
  .action-zone {
    --zone-bg: var(--color-bg-surface);
    --zone-border: var(--color-border-subtle);

    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 80px;
    width: 100%;
    max-width: 340px;
    padding: 10px 16px;
    border-radius: 10px;
    background: var(--zone-bg);
    border: 1px solid var(--zone-border);
    transition: border-color 0.35s, background 0.35s, box-shadow 0.35s;
    text-align: center;
    gap: 4px;
    overflow-x: clip;
    overflow-y: visible;
  }

  .action-zone.discovery {
    --zone-border: var(--color-border-hot);
    background: var(--color-bg-deep);
    box-shadow: 0 0 18px rgba(212, 168, 74, 0.12);
  }

  .action-zone.known {
    --zone-border: var(--color-border-active);
    background: var(--color-bg-deep);
  }

  .action-zone.failure {
    --zone-border: var(--color-border-subtle);
  }

  /* Live regions stack; only one has content at a time */
  .live-region {
    display: contents;
  }

  /* ── Idle ─────────────────────────────────────────────────────────────── */
  .zone-idle {
    font-style: italic;
    font-size: var(--text-body);
    color: var(--color-text-muted);
  }

  /* ── Shared icon ──────────────────────────────────────────────────────── */
  .zone-icon {
    font-size: 28px;
    line-height: 1;
    margin-bottom: 2px;
  }

  .zone-icon-sm {
    font-size: 22px;
  }

  /* ── Discovery ────────────────────────────────────────────────────────── */
  .discovery-label {
    color: var(--color-accent-text);
    font-weight: 700;
    font-size: var(--text-body);
  }

  /* ── Known ────────────────────────────────────────────────────────────── */
  .known-label {
    color: var(--color-text-primary);
    font-weight: 600;
    font-size: var(--text-body);
  }

  /* ── Recipe ───────────────────────────────────────────────────────────── */
  .zone-recipe {
    font-size: var(--text-micro);
    color: var(--color-text-muted);
  }

  /* ── Failure ──────────────────────────────────────────────────────────── */
  .zone-fail {
    font-style: italic;
    font-size: var(--text-body);
    color: var(--color-text-secondary);
  }

  /* ── Float-up animation ───────────────────────────────────────────────── */
  @keyframes float-up {
    0%   { transform: translateY(0);     opacity: 1; }
    60%  { transform: translateY(-14px); opacity: 1; }
    100% { transform: translateY(-20px); opacity: 0; }
  }

  .pts-float {
    position: absolute;
    top: 12px;
    right: 16px;
    font-size: var(--text-micro);
    font-weight: 700;
    pointer-events: none;
    animation: float-up 600ms ease-out forwards;
  }

  .discovery-pts {
    color: var(--color-accent);
  }

  .known-pts {
    color: var(--color-text-muted);
  }
</style>
