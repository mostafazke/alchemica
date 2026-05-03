<script lang="ts">
  import { get } from 'svelte/store';
  import { unlockedElements, hintCooldownEndsAt, hintBalance, purchasedNoAds } from '../stores/game.js';
  import { isAdReady, requestAdHint } from '../effects/admob.js';
  import { getHint } from '../game/reactions.js';
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

  function useHint() {
    if (!canHint || !hint) return;
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
  }

  const hintElA = $derived(hint ? ELEMENTS[hint.a] : null);
  const hintElB = $derived(hint ? ELEMENTS[hint.b] : null);
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

  {#if hintVisible && hint && hintElA && hintElB}
    <div class="hint-overlay" role="status">
      <span class="hint-label">Try combining:</span>
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
      <button class="hint-dismiss" onclick={dismissHint} aria-label="Dismiss hint">✕</button>
    </div>
  {/if}
</div>

<style>
  .hint-wrapper { position: relative; display: flex; flex-direction: column; align-items: center; gap: 6px; flex: 1; }
  .hint-btn {
    padding: 8px 20px;
    min-height: 40px; min-width: 100px;
    border-radius: 8px;
    border: 1px solid #1a3a5a;
    background: #0a1520;
    color: #8ab4d4;
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    cursor: pointer;
    transition: all 0.15s;
    touch-action: manipulation;
  }
  .hint-btn:not(:disabled):hover { border-color: #4af0c060; color: #4af0c0; background: #0f2035; }
  .hint-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .hint-btn.cooling { color: #4a6080; }
  .hint-overlay {
    position: absolute; bottom: calc(100% + 8px);
    left: 50%; transform: translateX(-50%);
    background: #0d1b2e; border: 1px solid #4af0c040;
    border-radius: 12px; padding: 12px 16px;
    min-width: 220px; text-align: center;
    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    animation: hint-pop 0.2s ease;
    z-index: 10;
  }
  @keyframes hint-pop {
    from { opacity: 0; transform: translateX(-50%) translateY(6px) scale(0.95); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
  }
  .hint-label { font-size: 10px; color: #4a6080; font-family: 'Space Mono', monospace; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 8px; }
  .hint-pair { display: flex; align-items: center; justify-content: center; gap: 10px; }
  .hint-el { display: flex; flex-direction: column; align-items: center; gap: 2px; }
  .hint-symbol { font-size: 22px; }
  .hint-name { font-size: 10px; color: #4af0c0; font-family: 'Space Mono', monospace; }
  .hint-plus { font-size: 16px; color: #4a6080; }
  .hint-dismiss {
    position: absolute; top: 6px; right: 8px;
    background: transparent; border: none; color: #4a6080;
    cursor: pointer; font-size: 11px; padding: 2px 6px;
    touch-action: manipulation;
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
