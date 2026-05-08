<script lang="ts">
  import { ELEMENTS } from '../data/elements.js';
  import { QUIPS } from '../data/quips.js';
  import { shareDiscovery } from '../utils/share.js';
  import { untrack } from 'svelte';

  let {
    result = null,
    isNew = false,
    attempted = false,
  }: { result?: string | null; isNew?: boolean; attempted?: boolean } = $props();

  const FAIL_MSGS = [
    'No reaction detected…',
    'These elements repel each other!',
    'Nothing happened. Try another combo.',
    'Hmm, incompatible substances.',
  ];

  // Stable random fail message per `result+attempted` change
  let failMsg = $state(FAIL_MSGS[0]);
  $effect(() => {
    if (attempted && !result) {
      failMsg = FAIL_MSGS[Math.floor(Math.random() * FAIL_MSGS.length)];
    }
  });

  const el = $derived(result ? ELEMENTS[result] : null);
  const quip = $derived(result ? (QUIPS[result] ?? null) : null);

  // Trigger staggered reveal animation key
  let revealKey = $state(0);
  $effect(() => {
    if (attempted && result) untrack(() => revealKey++);
  });

  let shareMsg = $state<string | null>(null);

  async function handleShare() {
    if (!result) return;
    const res = await shareDiscovery(result);
    if (res.method === 'clipboard' && res.ok) {
      shareMsg = 'Copied!';
      setTimeout(() => { shareMsg = null; }, 1500);
    }
  }
</script>

<div
  class="result-display"
  class:success={attempted && !!result}
  class:fail={attempted && !result}
  class:new-discovery={attempted && !!result && isNew}
>
  {#if attempted && el}
    {#key revealKey}
      {#if isNew}
        <div class="result-new-badge reveal-1">✦ NEW DISCOVERY</div>
      {:else}
        <div class="result-known-badge reveal-1">Already in your collection</div>
      {/if}
      <div class="result-icon reveal-2" class:icon-new={isNew}>{el.symbol}</div>
      <div class="result-name reveal-3">{el.name}</div>
      <div class="result-formula reveal-3">{el.formula}</div>
      {#if quip}
        <div class="result-quip reveal-4">"{quip}"</div>
      {/if}
      {#if isNew}
        <button class="result-share-btn reveal-5" onclick={handleShare} aria-label="Share discovery">
          {shareMsg ?? '🔗 Share'}
        </button>
      {/if}
    {/key}
  {:else if attempted && !result}
    <div class="result-fail-icon">🧪</div>
    <div class="result-error">{failMsg}</div>
    <div class="result-tip">Try combining related elements</div>
  {:else}
    <div class="result-idle">Select two elements · tap React</div>
  {/if}
</div>

<style>
  .result-display {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 4px; padding: 10px 16px;
    min-height: 80px;
    border-radius: 10px;
    background: #0a1520;
    border: 1px solid #1a2e4a;
    transition: border-color 0.4s, background 0.4s, box-shadow 0.4s;
    text-align: center;
    width: 100%;
    max-width: 340px;
  }
  .result-display.success  { border-color: #4af0c060; background: #071a10; }
  .result-display.fail     { border-color: #ff405040; background: #1a0a0a; }
  .result-display.new-discovery {
    border-color: #ffe44a80;
    background: #0d1a06;
    box-shadow: 0 0 18px #ffe44a18;
  }

  /* Staggered reveal animations */
  @keyframes reveal-up {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes icon-pop {
    0%   { opacity: 0; transform: scale(0.5); }
    70%  { transform: scale(1.18); }
    100% { opacity: 1; transform: scale(1); }
  }
  .reveal-1 { animation: reveal-up 0.22s ease both; }
  .reveal-2 { animation: icon-pop 0.35s cubic-bezier(0.34,1.56,0.64,1) 0.1s both; }
  .reveal-3 { animation: reveal-up 0.22s ease 0.28s both; }
  .reveal-4 { animation: reveal-up 0.22s ease 0.42s both; }
  .reveal-5 { animation: reveal-up 0.22s ease 0.56s both; }

  .result-new-badge {
    font-size: 9px; color: #ffe44a;
    font-family: 'Space Mono', monospace;
    letter-spacing: 2px; text-transform: uppercase;
  }
  .result-known-badge {
    font-size: 9px; color: #4a6080;
    font-family: 'Space Mono', monospace;
    letter-spacing: 1px; text-transform: uppercase;
  }
  .result-icon { font-size: 30px; line-height: 1; }
  .result-icon.icon-new { filter: drop-shadow(0 0 8px #ffe44a60); }
  .result-name { font-size: 15px; font-weight: 700; color: #4af0c0; }
  .result-formula { font-family: 'Space Mono', monospace; font-size: 10px; color: #4af0c060; }
  .result-quip {
    font-size: 10px; color: #6a8aa4; font-style: italic;
    max-width: 200px; line-height: 1.4; margin-top: 2px;
  }
  .result-share-btn {
    margin-top: 4px; padding: 5px 14px;
    background: transparent; border: 1px solid #ffe44a30;
    border-radius: 6px; color: #ffe44a80;
    font-family: 'Space Mono', monospace; font-size: 10px;
    cursor: pointer; transition: all 0.15s;
    min-height: 44px; touch-action: manipulation;
  }
  .result-share-btn:hover { border-color: #ffe44a60; color: #ffe44a; }
  .result-fail-icon { font-size: 26px; }
  .result-error { font-size: 13px; color: #ff6060; }
  .result-tip { font-size: 10px; color: #4a6080; }
  .result-idle { font-size: 12px; color: #6a8aa4; }
</style>
