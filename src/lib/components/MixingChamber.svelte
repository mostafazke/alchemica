<script lang="ts">
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import Slot from './Slot.svelte';
  import ResultDisplay from './ResultDisplay.svelte';
  import { slots, combo } from '../stores/game.js';
  import { unlockedElements } from '../stores/game.js';
  import { applyReaction } from '../game/reactions.js';
  import { initParticles, triggerSuccessParticles, triggerFailParticles } from '../effects/particles.js';
  import { hapticSuccess, hapticFail } from '../utils/touch.js';
  import { toastQueue } from '../stores/toast.js';
  import { discoveryBannerQueue } from '../stores/discoveryBanner.js';
  import { soundMuted } from '../stores/settings.js';
  import { playChime, playReactionSuccess, playDiscovery, playFailure, playComboUp } from '../effects/sound.js';
  import HintButton from './HintButton.svelte';
  import DailyChallenge from './DailyChallenge.svelte';
  import { ELEMENTS } from '../data/elements.js';
  import { failedComboCount, stuckPromptVisible } from '../stores/hintPrompt.js';
  import { warmupAd } from '../effects/admob.js';

  let canvasEl: HTMLCanvasElement;
  let result: string | null = $state(null);
  let isNew: boolean = $state(false);
  let attempted: boolean = $state(false);

  const canReact = $derived($slots.a !== null && $slots.b !== null);

  onMount(() => {
    initParticles(canvasEl);
  });

  function doReaction() {
    if (!$slots.a || !$slots.b) return;
    const prevCombo = get(combo);
    const reaction = applyReaction($slots.a, $slots.b);
    result = reaction.result;
    isNew = reaction.isNew;
    attempted = true;

    const cx = canvasEl.parentElement!.offsetWidth / 2;
    const cy = canvasEl.parentElement!.offsetHeight * 0.38;

    if (reaction.result) {
      // Reset stuck-player state on any successful combination
      failedComboCount.set(0);
      stuckPromptVisible.set(false);
      triggerSuccessParticles(cx, cy);
      hapticSuccess();
      if (!get(soundMuted)) {
        if (reaction.isNew) playDiscovery();
        else playReactionSuccess();
        if (get(combo) > prevCombo) playComboUp();
      }
      if (reaction.newBadge !== null) {
        toastQueue.update((q) => [...q, reaction.newBadge!]);
        if (!get(soundMuted)) playChime();
      }
      if (reaction.isNew) {
        discoveryBannerQueue.update((q) => [...q, {
          elementKey: reaction.result!,
          discoveryNumber: get(unlockedElements).size,
          totalElements: Object.keys(ELEMENTS).length,
        }]);
      }
    } else {
      triggerFailParticles(cx, cy);
      hapticFail();
      if (!get(soundMuted)) playFailure();
      // Track consecutive fails — warm up ad on 2nd, show prompt on 3rd
      failedComboCount.update((n) => {
        const next = n + 1;
        if (next === 2) warmupAd();
        if (next >= 3) stuckPromptVisible.set(true);
        return next;
      });
    }
  }
</script>

<section class="mixing-chamber">
  <canvas bind:this={canvasEl} class="particle-canvas"></canvas>

  <div class="slots-row">
    <Slot which="a" />
    <div class="plus-sign">+</div>
    <Slot which="b" />
  </div>

  <button
    class="react-btn"
    disabled={!canReact}
    onclick={doReaction}
  >
    ⚗ React
    {#if $combo > 1}
      <span class="combo-badge">x{$combo}</span>
    {/if}
  </button>

  <ResultDisplay {result} {isNew} {attempted} />

  <div class="utility-row">
    <HintButton />
    <DailyChallenge />
  </div>
</section>

<style>
  .mixing-chamber {
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 8px 16px;
    overflow: visible;
    min-width: 0;
    min-height: 0;
  }
  .particle-canvas {
    position: absolute; inset: 0;
    pointer-events: none;
    width: 100%; height: 100%;
  }
  .slots-row { display: flex; align-items: center; gap: 12px; }
  .plus-sign { font-size: 20px; color: #1a3a5a; font-weight: 700; user-select: none; }
  .react-btn {
    position: relative;
    padding: 10px 36px;
    background: linear-gradient(135deg, #1a4a3a, #0f3028);
    border: 1px solid #4af0c060;
    border-radius: 10px;
    color: #4af0c0;
    font-family: 'Space Mono', monospace;
    font-size: 14px; font-weight: 700;
    cursor: pointer;
    transition: background 0.2s, box-shadow 0.2s;
    letter-spacing: 1px;
    min-height: 44px;
    touch-action: manipulation;
    width: 100%;
    max-width: 280px;
  }
  .react-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #2a6a5a, #1f4038);
    box-shadow: 0 0 20px #4af0c030;
  }
  .react-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .combo-badge {
    position: absolute; top: -8px; right: -8px;
    background: #ffe44a; color: #0d1b2e;
    font-size: 10px; font-weight: 700;
    padding: 2px 6px; border-radius: 10px;
  }
  .utility-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    max-width: 320px;
    flex-shrink: 0;
  }
</style>
