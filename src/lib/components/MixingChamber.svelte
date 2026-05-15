<script lang="ts">
  import { onMount, setContext } from 'svelte';
  import { writable } from 'svelte/store';
  import { AnimationController } from '../effects/animation-controller.js';
  import { get } from 'svelte/store';
  import MixingSlot from './MixingSlot.svelte';
  import ActionZone from './ActionZone.svelte';
  import { slots, combo, score, unlockedElements } from '../stores/game.js';
  import { applyReaction } from '../game/reactions.js';
  import { hapticSuccess, hapticFail } from '../utils/touch.js';
  import { toastQueue } from '../stores/toast.js';
  import { discoveryBannerQueue } from '../stores/discoveryBanner.js';
  import { soundMuted } from '../stores/settings.js';
  import { playChime, playReactionSuccess, playDiscovery, playFailure, playComboUp } from '../effects/sound.js';
  import HintButton from './HintButton.svelte';
  import DiscoveryOverlay from './DiscoveryOverlay.svelte';
  import { ELEMENTS } from '../data/elements.js';
  import { failedComboCount, stuckPromptVisible } from '../stores/hintPrompt.js';
  import { warmupAd } from '../effects/admob.js';
  import { incrementFrequency } from '../stores/frequency.js';

  // Context provision: writable store set at init; populated after mount so children
  // that call getContext receive the store synchronously and subscribe for the value.
  const controllerStore = writable<AnimationController | undefined>(undefined);
  setContext('animationController', controllerStore);

  let canvasEl: HTMLCanvasElement;
  let controller: AnimationController | undefined;
  let result: string | null = $state(null);
  let isNew: boolean = $state(false);
  let attempted: boolean = $state(false);
  let contracting = $state(false);
  let pts = $state(0);

  const actionState = $derived(
    !attempted ? 'idle' : result ? (isNew ? 'discovery' : 'known') : 'failure'
  ) as 'idle' | 'discovery' | 'known' | 'failure';

  function dismissOverlay() {
    result = null;
    isNew = false;
    attempted = false;
  }

  const canReact = $derived($slots.a !== null && $slots.b !== null);

  let autoReactTimer: ReturnType<typeof setTimeout> | null = null;

  $effect(() => {
    if (canReact) {
      const cx = canvasEl.parentElement!.offsetWidth / 2;
      const cy = canvasEl.parentElement!.offsetHeight * 0.38;
      controller?.radialShimmer(cx, cy);
      contracting = true;
      setTimeout(() => { contracting = false; }, 360);
      autoReactTimer = setTimeout(() => {
        doReaction();
      }, 180);
    } else {
      if (autoReactTimer !== null) {
        clearTimeout(autoReactTimer);
        autoReactTimer = null;
      }
    }

    return () => {
      if (autoReactTimer !== null) {
        clearTimeout(autoReactTimer);
        autoReactTimer = null;
      }
    };
  });

  onMount(() => {
    controller = new AnimationController(canvasEl);
    controllerStore.set(controller);
    return () => controller?.destroy();
  });

  function doReaction() {
    if (!$slots.a || !$slots.b) return;
    const prevCombo = get(combo);
    const prevScore = get(score);
    const reaction = applyReaction($slots.a, $slots.b);
    result = reaction.result;
    isNew = reaction.isNew;
    attempted = true;

    const cx = canvasEl.parentElement!.offsetWidth / 2;
    const cy = canvasEl.parentElement!.offsetHeight * 0.38;

    if (reaction.result) {
      // Wire frequency store so ElementCard energy states update in real time
      incrementFrequency($slots.a);
      incrementFrequency($slots.b);
      pts = get(score) - prevScore;
      // Reset stuck-player state on any successful combination
      failedComboCount.set(0);
      stuckPromptVisible.set(false);
      controller?.successBurst(cx, cy);
      hapticSuccess();
      if (!get(soundMuted)) {
        if (!reaction.isNew) playReactionSuccess();
        if (get(combo) > prevCombo) playComboUp();
      }
      if (reaction.isNew) setTimeout(() => { if (!get(soundMuted)) playDiscovery(); }, 200);
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
      pts = 0;
      controller?.failureParticle(cx, cy);
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

<section class="mixing-chamber" class:contracting>
  <canvas bind:this={canvasEl} class="particle-canvas"></canvas>

  <div class="slots-row">
    <MixingSlot which="a" isReady={canReact} isReacting={contracting} />
    <div class="plus-sign">+</div>
    <MixingSlot which="b" isReady={canReact} isReacting={contracting} />
  </div>

  {#if $combo > 1}
    <div class="combo-badge-zone">
      <span class="combo-badge">×{$combo}</span>
    </div>
  {/if}

  {#if isNew && attempted && result !== null}
    <DiscoveryOverlay {result} onDismiss={dismissOverlay} />
  {:else}
    <ActionZone state={actionState} {result} {pts} />
  {/if}

  <div class="utility-row">
    <HintButton />
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
  @keyframes world-contract {
    0%   { transform: scale(1.0); }
    50%  { transform: scale(0.97); }
    100% { transform: scale(1.0); }
  }
  .mixing-chamber.contracting {
    animation: world-contract 360ms ease-in-out;
  }
  @media (prefers-reduced-motion: reduce) {
    .mixing-chamber.contracting { animation: none; }
  }
  .particle-canvas {
    position: absolute; inset: 0;
    pointer-events: none;
    width: 100%; height: 100%;
  }
  .slots-row { display: flex; align-items: center; gap: 12px; }
  .plus-sign { font-size: 20px; color: var(--color-border-mid); font-weight: 700; user-select: none; }
  .combo-badge-zone {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 20px;
  }
  .combo-badge {
    background: #ffe44a; color: var(--color-bg-deep);
    font-family: 'Space Mono', monospace;
    font-size: 11px; font-weight: 700;
    padding: 2px 8px; border-radius: 10px;
    letter-spacing: 0.5px;
  }
  .utility-row {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 320px;
    flex-shrink: 0;
  }
</style>
