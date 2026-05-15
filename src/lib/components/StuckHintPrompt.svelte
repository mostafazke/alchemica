<script lang="ts">
  import { get } from 'svelte/store';
  import { Capacitor } from '@capacitor/core';
  import { stuckPromptVisible, failedComboCount } from '../stores/hintPrompt.js';
  import { isAdReady, requestAdHint } from '../effects/admob.js';
  import { hintBalance, unlockedElements, slots } from '../stores/game.js';
  import { getStuckHint, type SmartHint } from '../game/reactions.js';
  import { ELEMENTS } from '../data/elements.js';
  import { logHintRequested } from '../effects/analytics.js';

  type Mode = 'offer' | 'watching' | 'revealed' | 'fallback';

  const isNative = Capacitor.isNativePlatform();

  let mode = $state<Mode>('offer');
  let hint = $state<SmartHint | null>(null);
  let triviaRevealed = $state(false);

  // Reset internal state each time the prompt opens
  $effect(() => {
    if (!$stuckPromptVisible) {
      mode = 'offer';
      hint = null;
      triviaRevealed = false;
    }
  });

  // Detect ad reward completion while we're waiting in 'watching' state
  let prevBalance = get(hintBalance);
  $effect(() => {
    const curr = $hintBalance;
    if (mode === 'watching' && curr > prevBalance) {
      hint = getStuckHint(get(unlockedElements), get(slots));
      mode = hint ? 'revealed' : 'fallback';
      failedComboCount.set(0);
    }
    prevBalance = curr;
  });

  function watchAd() {
    logHintRequested(get(failedComboCount));
    if (!isNative || !$isAdReady) {
      // No native ad available — give a free hint
      hint = getStuckHint(get(unlockedElements), get(slots));
      mode = hint ? 'fallback' : 'offer';
      failedComboCount.set(0);
      return;
    }
    mode = 'watching';
    requestAdHint();
  }

  function dismiss() {
    stuckPromptVisible.set(false);
    failedComboCount.set(0); // reset so it doesn't re-trigger immediately
  }

  const hintElA      = $derived(hint ? ELEMENTS[hint.a]      : null);
  const hintElB      = $derived(hint ? ELEMENTS[hint.b]      : null);
  const hintElResult = $derived(hint ? ELEMENTS[hint.result] : null);
</script>

{#if $stuckPromptVisible}
  <div class="stuck-prompt" role="complementary" aria-label="Hint offer">

    {#if mode === 'offer'}
      <div class="prompt-icon">🔍</div>
      <div class="prompt-body">
        <span class="prompt-title">Stuck?</span>
        <span class="prompt-sub">
          {isNative && $isAdReady ? 'Watch a short video for a hint' : 'Get a free hint →'}
        </span>
      </div>
      <div class="prompt-actions">
        <button class="btn-watch" onclick={watchAd}>
          {isNative && $isAdReady ? '📺 Watch' : '💡 Hint'}
        </button>
        <button class="btn-dismiss" onclick={dismiss} aria-label="Dismiss hint offer">✕</button>
      </div>

    {:else if mode === 'watching'}
      <div class="prompt-icon spin">⌛</div>
      <span class="prompt-title watching-label">Loading ad…</span>

    {:else if mode === 'revealed' || mode === 'fallback'}
      {#if mode === 'fallback'}
        <span class="fallback-label">No ad — here's a free hint</span>
      {/if}
      {#if hint && hintElA && hintElB && hintElResult}
        <div class="hint-display">
          {#if hint.mode === 'trivia' && !triviaRevealed}
            <!-- Trivia: show desc as riddle -->
            <div class="stuck-trivia">
              <span class="prompt-sub trivia-riddle">{hintElResult.desc}</span>
              <button class="btn-reveal" onclick={() => triviaRevealed = true}>Reveal ↓</button>
            </div>
          {:else}
            <!-- Goal or revealed trivia: show target element + combo -->
            <div class="hint-result-row">
              <span class="hint-res-sym">{hintElResult.symbol}</span>
              <span class="hint-res-name">{hintElResult.name}</span>
            </div>
            <div class="hint-pair">
              <span class="hint-el">
                <span class="hint-sym">{hintElA.symbol}</span>
                <span class="hint-name">{hintElA.name}</span>
              </span>
              <span class="hint-plus">+</span>
              <span class="hint-el">
                <span class="hint-sym">{hintElB.symbol}</span>
                <span class="hint-name">{hintElB.name}</span>
              </span>
            </div>
          {/if}
        </div>
      {/if}
      <button class="btn-dismiss" onclick={dismiss} aria-label="Dismiss hint">✕</button>
    {/if}

  </div>
{/if}

<style>
  .stuck-prompt {
    position: fixed;
    bottom: calc(env(safe-area-inset-bottom, 0px) + 72px);
    left: 50%;
    transform: translateX(-50%);
    z-index: 300;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border-radius: 14px;
    background: var(--color-bg-deep);
    border: 1px solid #4a6fa550;
    box-shadow: 0 8px 32px rgba(60, 30, 10, 0.18);
    max-width: min(360px, 92vw);
    animation: prompt-in 0.28s cubic-bezier(0.34, 1.3, 0.64, 1) both;
    pointer-events: all;
  }
  @keyframes prompt-in {
    from { opacity: 0; transform: translateX(-50%) translateY(8px) scale(0.96); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0)    scale(1);   }
  }

  /* Icon */
  .prompt-icon {
    font-size: 24px;
    flex-shrink: 0;
    line-height: 1;
  }
  .prompt-icon.spin {
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  /* Body text */
  .prompt-body {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
    min-width: 0;
  }
  .prompt-title {
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    font-weight: 700;
    color: var(--color-text-primary);
  }
  .prompt-sub {
    font-size: 11px;
    color: var(--color-text-secondary);
    line-height: 1.4;
  }
  .watching-label {
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    color: var(--color-text-secondary);
    flex: 1;
  }
  .fallback-label {
    font-size: 11px;
    color: #a07840;
    flex-shrink: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 130px;
  }

  /* Actions */
  .prompt-actions {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
  }
  .btn-watch {
    background: color-mix(in srgb, var(--color-accent) 8%, transparent);
    border: 1px solid color-mix(in srgb, var(--color-accent) 25%, transparent);
    border-radius: 8px;
    color: var(--color-accent-text);
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    font-weight: 700;
    padding: 6px 12px;
    min-height: 36px;
    cursor: pointer;
    touch-action: manipulation;
    transition: background 0.15s, border-color 0.15s;
    white-space: nowrap;
  }
  .btn-watch:hover { background: color-mix(in srgb, var(--color-accent) 15%, transparent); border-color: color-mix(in srgb, var(--color-accent) 50%, transparent); }

  .btn-dismiss {
    background: transparent;
    border: 1px solid var(--color-border-mid);
    border-radius: 6px;
    color: var(--color-text-muted);
    font-size: 12px;
    min-width: 32px;
    min-height: 36px;
    cursor: pointer;
    touch-action: manipulation;
    padding: 0 8px;
    transition: color 0.15s, border-color 0.15s;
    flex-shrink: 0;
  }
  .btn-dismiss:hover { color: #ff6b6b; border-color: #ff6b6b40; }

  /* Hint reveal */
  .hint-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    flex: 1;
    min-width: 0;
  }
  .hint-pair {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
  .hint-el {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }
  .hint-sym {
    font-size: 22px;
    line-height: 1;
  }
  .hint-name {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    color: var(--color-accent-text);
    white-space: nowrap;
  }
  .hint-plus {
    font-size: 16px;
    color: var(--color-text-muted);
  }
  /* Goal mode: target element row */
  .hint-result-row {
    display: flex; align-items: center; gap: 6px;
    margin-bottom: 2px;
  }
  .hint-res-sym { font-size: 20px; line-height: 1; }
  .hint-res-name {
    font-family: 'Space Mono', monospace; font-size: 12px;
    font-weight: 700; color: var(--color-text-primary);
  }
  /* Trivia mode */
  .stuck-trivia { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; width: 100%; }
  .trivia-riddle { font-style: italic; font-size: 11px !important; line-height: 1.4; color: var(--color-text-secondary) !important; }
  .btn-reveal {
    background: color-mix(in srgb, var(--color-accent) 8%, transparent); border: 1px solid color-mix(in srgb, var(--color-accent) 25%, transparent); border-radius: 6px;
    color: var(--color-accent-text); font-family: 'Space Mono', monospace; font-size: 10px;
    padding: 4px 10px; cursor: pointer; touch-action: manipulation;
    transition: background 0.15s; align-self: flex-end;
  }
  .btn-reveal:hover { background: color-mix(in srgb, var(--color-accent) 15%, transparent); }
</style>
