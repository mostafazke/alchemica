<script lang="ts">
  import { onMount } from 'svelte';
  import Slot from './Slot.svelte';
  import ResultDisplay from './ResultDisplay.svelte';
  import { slots, combo } from '../stores/game.js';
  import { applyReaction } from '../game/reactions.js';
  import { initParticles, triggerSuccessParticles, triggerFailParticles } from '../effects/particles.js';
  import { hapticSuccess, hapticFail } from '../utils/touch.js';
  import HintButton from './HintButton.svelte';

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
    const reaction = applyReaction($slots.a, $slots.b);
    result = reaction.result;
    isNew = reaction.isNew;
    attempted = true;

    const cx = canvasEl.parentElement!.offsetWidth / 2;
    const cy = canvasEl.parentElement!.offsetHeight * 0.38;

    if (reaction.result) {
      triggerSuccessParticles(cx, cy);
      hapticSuccess();
    } else {
      triggerFailParticles(cx, cy);
      hapticFail();
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

  <HintButton />
  <ResultDisplay {result} {isNew} {attempted} />
</section>

<style>
  .mixing-chamber {
    position: relative;
    flex: 1;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 20px; padding: 20px;
    overflow: hidden;
    min-width: 0;
  }
  .particle-canvas {
    position: absolute; inset: 0;
    pointer-events: none;
    width: 100%; height: 100%;
  }
  .slots-row { display: flex; align-items: center; gap: 16px; }
  .plus-sign { font-size: 22px; color: #1a3a5a; font-weight: 700; user-select: none; }
  .react-btn {
    position: relative;
    padding: 12px 40px;
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
  @media (max-width: 768px) {
    .react-btn {
      width: 100%;
      min-height: 52px;
      font-size: 16px;
      border-radius: 12px;
    }
    .mixing-chamber {
      padding: 16px;
      gap: 16px;
    }
  }
  /* Landscape on phones: compress vertical spacing */
  @media (orientation: landscape) and (max-height: 520px) {
    .mixing-chamber {
      gap: 8px;
      padding: 8px 20px;
      justify-content: center;
    }
    .react-btn {
      min-height: 44px;
      padding: 8px 32px;
      font-size: 13px;
    }
  }
</style>
