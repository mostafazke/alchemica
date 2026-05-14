<script lang="ts">
  import { get } from 'svelte/store';
  import { unlockedElements, hintCooldownEndsAt, hintBalance, purchasedNoAds } from '../stores/game.js';
  import { isAdReady, requestAdHint } from '../effects/admob.js';
  import { getHint, type SmartHint } from '../game/reactions.js';
  import { ELEMENTS } from '../data/elements.js';
  import { Capacitor } from '@capacitor/core';
  import { soundMuted } from '../stores/settings.js';
  import { playHint } from '../effects/sound.js';

  const COOLDOWN_MS = 30_000;
  const isNative = Capacitor.isNativePlatform();

  let now = $state(Date.now());

  $effect(() => {
    const id = setInterval(() => { now = Date.now(); }, 1000);
    return () => clearInterval(id);
  });

  const cooldownRemaining = $derived(
    Math.max(0, Math.ceil(($hintCooldownEndsAt - now) / 1000))
  );

  const hint = $derived(
    (cooldownRemaining === 0 || $hintBalance > 0) ? getHint($unlockedElements) : null
  );

  const canHint = $derived(hint !== null && ($hintBalance > 0 || cooldownRemaining === 0));

  let hintVisible = $state(false);
  let activeHint = $state<SmartHint | null>(null);
  let triviaRevealed = $state(false);

  function useHint() {
    if (!canHint || !hint) return;
    activeHint = hint; // capture before cooldown changes hint to null
    triviaRevealed = false;
    if ($hintBalance > 0) {
      hintBalance.update((n) => n - 1);
    } else {
      hintCooldownEndsAt.set(Date.now() + COOLDOWN_MS);
    }
    if (!get(soundMuted)) playHint();
    hintVisible = true;
  }

  function dismissHint() {
    hintVisible = false;
    activeHint = null;
    triviaRevealed = false;
  }

  const hintElA      = $derived(activeHint ? ELEMENTS[activeHint.a]      : null);
  const hintElB      = $derived(activeHint ? ELEMENTS[activeHint.b]      : null);
  const hintElResult = $derived(activeHint ? ELEMENTS[activeHint.result] : null);
</script>

<div class="hint-wrapper">
  <button
    class="hint-btn"
    class:cooling={cooldownRemaining > 0}
    disabled={!canHint}
    onclick={useHint}
    aria-label="Get a hint"
  >
    {#if cooldownRemaining > 0}
      ⏱ {cooldownRemaining}s
    {:else if hint === null}
      No hints left
    {:else}
      💡 Hint
    {/if}
  </button>

  {#if isNative && cooldownRemaining > 0 && $hintBalance === 0 && !$purchasedNoAds}
    <button
      class="ad-btn"
      disabled={!$isAdReady}
      onclick={requestAdHint}
      aria-label={$isAdReady ? 'Watch ad for hint' : 'No ad available'}
    >
      {$isAdReady ? '📺 Watch ad' : 'No ad available'}
    </button>
  {/if}

  {#if hintVisible && activeHint && hintElA && hintElB && hintElResult}
    <div class="hint-overlay" role="status">

      {#if activeHint.mode === 'trivia' && !triviaRevealed}
        <!-- ── Trivia: riddle from element description ── -->
        <span class="hint-label">🔬 Guess the element:</span>
        <p class="hint-trivia">{hintElResult?.desc}</p>
        {#if hintElResult?.formula}
          <span class="hint-formula">{hintElResult.formula}</span>
        {/if}
        <button class="hint-reveal-btn" onclick={() => triviaRevealed = true}>Show combo ↓</button>

      {:else if activeHint.mode === 'trivia'}
        <!-- ── Trivia revealed ── -->
        <span class="hint-label">It's {hintElResult?.symbol} {hintElResult?.name}! Make it:</span>
        <div class="hint-pair">
          <span class="hint-el">
            <span class="hint-symbol">{hintElA.symbol}</span>
            <span class="hint-name">{hintElA.name}</span>
          </span>
          <span class="hint-plus">+</span>
          <span class="hint-el">
            <span class="hint-symbol">{hintElB.symbol}</span>
            <span class="hint-name">{hintElB.name}</span>
          </span>
        </div>

      {:else}
        <!-- ── Goal: show target element then recipe ── -->
        <div class="hint-result-header">
          <span class="hint-result-symbol">{hintElResult?.symbol}</span>
          <span class="hint-result-name">{hintElResult?.name}</span>
        </div>
        <span class="hint-label">How to discover it:</span>
        <div class="hint-pair">
          <span class="hint-el">
            <span class="hint-symbol">{hintElA.symbol}</span>
            <span class="hint-name">{hintElA.name}</span>
          </span>
          <span class="hint-plus">+</span>
          <span class="hint-el">
            <span class="hint-symbol">{hintElB.symbol}</span>
            <span class="hint-name">{hintElB.name}</span>
          </span>
        </div>
      {/if}

      <button class="hint-dismiss" onclick={dismissHint} aria-label="Dismiss hint">✕</button>
    </div>
  {/if}
</div>

<style>
  .hint-wrapper { position: relative; display: flex; flex-direction: column; align-items: center; gap: 6px; flex: 1; }
  .hint-btn {
    padding: 8px 20px;
    min-height: 44px; min-width: 100px;
    border-radius: 8px;
    border: 1px solid var(--color-border-mid);
    background: var(--color-bg-surface);
    color: var(--color-text-secondary);
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    cursor: pointer;
    transition: all 0.15s;
    touch-action: manipulation;
  }
  .hint-btn:not(:disabled):hover { border-color: var(--color-border-active); color: var(--color-accent); background: var(--color-bg-hover); }
  .hint-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .hint-btn.cooling { color: var(--color-text-muted); }
  .hint-overlay {
    position: fixed;
    bottom: 72px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--color-bg-deep); border: 1px solid color-mix(in srgb, var(--color-accent) 25%, transparent);
    border-radius: 12px; padding: 12px 16px;
    min-width: 220px; max-width: min(320px, 90vw);
    max-height: 45vh; overflow-y: auto;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    animation: hint-pop 0.2s ease;
    z-index: 500;
  }
  @keyframes hint-pop {
    from { opacity: 0; transform: translateX(-50%) translateY(6px) scale(0.95); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
  }
  .hint-label { font-size: 11px; color: var(--color-text-muted); font-family: 'Space Mono', monospace; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 8px; }
  .hint-pair { display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 4px; }
  .hint-el { display: flex; flex-direction: column; align-items: center; gap: 2px; }
  .hint-symbol { font-size: 22px; }
  .hint-name { font-size: 11px; color: var(--color-accent); font-family: 'Space Mono', monospace; }
  .hint-plus { font-size: 16px; color: var(--color-text-muted); }
  /* Goal mode — target element header */
  .hint-result-header { display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 6px; }
  .hint-result-symbol { font-size: 28px; line-height: 1; }
  .hint-result-name { font-size: 15px; font-family: 'Space Mono', monospace; font-weight: 700; color: var(--color-text-primary); }
  /* Trivia mode */
  .hint-trivia { font-size: 12px; color: var(--color-text-secondary); line-height: 1.5; text-align: left; margin: 0 0 6px; font-style: italic; }
  .hint-formula { display: block; font-size: 10px; color: var(--color-text-muted); font-family: 'Space Mono', monospace; margin-bottom: 10px; }
  .hint-reveal-btn {
    background: color-mix(in srgb, var(--color-accent) 8%, transparent); border: 1px solid color-mix(in srgb, var(--color-accent) 25%, transparent); border-radius: 6px;
    color: var(--color-accent); font-family: 'Space Mono', monospace; font-size: 11px;
    padding: 5px 14px; cursor: pointer; touch-action: manipulation;
    transition: background 0.15s;
  }
  .hint-reveal-btn:hover { background: color-mix(in srgb, var(--color-accent) 15%, transparent); }
  .hint-dismiss {
    position: absolute; top: 0; right: 0;
    background: transparent; border: none; color: var(--color-text-muted);
    cursor: pointer; font-size: 11px; padding: 0;
    touch-action: manipulation;
    min-width: 44px; min-height: 44px;
    display: flex; align-items: center; justify-content: center;
  }
  .hint-dismiss:hover { color: #ff6b6b; }
  .ad-btn {
    padding: 6px 16px;
    border-radius: 8px;
    border: 1px solid #4a6fa5;
    background: transparent;
    color: #a0b8d8;
    font-size: 12px;
    font-family: 'Space Mono', monospace;
    cursor: pointer;
    transition: opacity 0.2s;
    touch-action: manipulation;
  }
  .ad-btn:disabled {
    opacity: 0.45;
    cursor: default;
  }
  .ad-btn:not(:disabled):active {
    opacity: 0.7;
  }
</style>
