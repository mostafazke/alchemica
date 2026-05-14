<script lang="ts">
  import { ELEMENTS } from '../data/elements.js';
  import { slots } from '../stores/game.js';
  import { createLongPress, haptic } from '../utils/touch.js';
  import ElementDetail from './ElementDetail.svelte';
  import { onboardingStep } from '../stores/onboarding.js';
  import { elementFrequency } from '../stores/frequency.js';
  import { FREQUENCY_THRESHOLDS } from '../config/thresholds.js';

  let { elementKey, mode = 'list', hasMore = false }: { elementKey: string; mode?: 'list' | 'grid'; hasMore?: boolean } = $props();

  const el = $derived(ELEMENTS[elementKey]);
  const isSelected = $derived($slots.a === elementKey || $slots.b === elementKey);
  const isOnboardHighlight = $derived(
    $onboardingStep === 1 && (elementKey === 'fire' || elementKey === 'water')
  );
  const energyState = $derived.by((): 'fresh' | 'default' | 'settled' | 'power' => {
    const count = $elementFrequency[elementKey] ?? 0;
    if (count <= FREQUENCY_THRESHOLDS.FRESH_MAX) return 'fresh';
    if (count >= FREQUENCY_THRESHOLDS.SETTLED_MIN) return 'settled';
    return 'default';
    // 'power' reserved for Phase 2
  });

  let detailOpen = $state(false);
  let buttonEl: HTMLButtonElement | undefined = $state();

  function handleClick() {
    slots.update((s) => {
      if (!s.a) return { ...s, a: elementKey };
      if (!s.b) return { ...s, b: elementKey };
      return { a: elementKey, b: null };
    });
  }

  $effect(() => {
    if (!buttonEl) return;
    return createLongPress(buttonEl, {
      duration: 500,
      onLongPress: () => {
        haptic(40);
        detailOpen = true;
      },
      onTap: handleClick,
    });
  });
</script>

{#if el}
<button
  class="element-card"
  class:grid-tile={mode === 'grid'}
  class:selected={isSelected}
  class:onboard-highlight={isOnboardHighlight}
  class:fresh={energyState === 'fresh'}
  class:settled={energyState === 'settled'}
  class:power={energyState === 'power'}
  bind:this={buttonEl}
  aria-label="{el.name}, {el.category}"
  aria-pressed={isSelected}
>
  <div class="el-icon {el.color}">{el.symbol}</div>
  {#if mode === 'grid'}
    <div class="el-grid-name">{el.name}{#if hasMore}<span class="has-more-dot" aria-label="has undiscovered combinations">◦</span>{/if}</div>
    <div class="long-press-dot" aria-hidden="true"></div>
  {:else}
    <div class="el-info">
      <div class="el-formula">{el.formula}</div>
      <div class="el-name">{el.name}</div>
      <div class="el-category">{el.category}</div>
    </div>
  {/if}
</button>
<ElementDetail element={detailOpen ? el : null} onClose={() => detailOpen = false} />
{/if}

<style>
  /* ─── Layer 3: component-scoped token defaults ─── */
  .element-card {
    --card-bg: var(--color-bg-surface);
    --card-border: var(--color-border-subtle);
    --card-glow: none;
  }

  .element-card {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 8px;
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: 8px;
    box-shadow: var(--card-glow);
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s, box-shadow 0.18s;
    width: 100%;
    text-align: left;
    min-height: 44px;
    touch-action: manipulation;
  }
  .element-card:hover { border-color: var(--color-border-active); background: var(--color-bg-hover); }

  /* ─── Energy states ─── */
  .element-card.fresh { --card-glow: 0 0 10px rgba(200, 136, 10, 0.45); }
  .element-card.settled { opacity: 0.82; }
  .element-card.power { --card-glow: 0 0 16px rgba(200, 136, 10, 0.20), 0 0 32px rgba(200, 136, 10, 0.08); }

  /* Selected state — after energy states so its glow wins */
  .element-card.selected {
    border-color: var(--color-border-hot);
    background: var(--color-bg-raised);
    box-shadow: 0 0 8px var(--color-accent-dim);
  }
  .element-card.onboard-highlight {
    border-color: #ffe44a;
    background: #1a1800;
    box-shadow: 0 0 12px #ffe44a50, 0 0 0 1px #ffe44a30;
    animation: onboard-pulse 1.4s ease-in-out infinite;
  }
  @keyframes onboard-pulse {
    0%, 100% { box-shadow: 0 0 10px #ffe44a40, 0 0 0 1px #ffe44a30; }
    50%       { box-shadow: 0 0 20px #ffe44a70, 0 0 0 2px #ffe44a50; }
  }

  /* ─── List-mode inner elements ─── */
  .el-icon {
    width: 34px; height: 34px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 6px; font-size: 18px; flex-shrink: 0;
  }
  .el-info { min-width: 0; }
  .el-formula { font-family: 'Space Mono', monospace; font-size: var(--text-micro); color: var(--color-accent); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .el-name { font-size: 12px; font-weight: 600; color: var(--color-text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .el-category { font-size: var(--text-micro); color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.5px; }

  /* ─── Grid tile mode — 56×56px, 6px radius ─── */
  .element-card.grid-tile {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    padding: 4px;
    width: 56px;
    height: 56px;
    border-radius: 6px;
    text-align: center;
  }
  .element-card.grid-tile .el-icon {
    width: 24px; height: 24px; font-size: 20px;
  }
  .el-grid-name {
    font-size: var(--text-micro);
    color: var(--color-text-secondary);
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    font-family: 'Space Mono', monospace;
  }
  .long-press-dot {
    width: 4px; height: 4px;
    border-radius: 50%;
    background: var(--color-border-mid);
    margin-top: 1px;
    transition: background 0.15s;
  }
  .element-card:hover .long-press-dot,
  .element-card.selected .long-press-dot { background: var(--color-border-active); }
  .has-more-dot {
    color: color-mix(in srgb, var(--color-accent) 50%, transparent);
    font-size: 8px;
    vertical-align: super;
    margin-left: 1px;
    pointer-events: none;
  }

  /* ─── Category icon backgrounds (game-semantic colors — do not tokenize) ─── */
  :global(.cat-fire)     { background: #2d1810; color: #ff6b35; }
  :global(.cat-water)    { background: #0d2040; color: #5ab4ff; }
  :global(.cat-earth)    { background: #1a2010; color: #96c84a; }
  :global(.cat-air)      { background: #1a1a2e; color: #c8c8ff; }
  :global(.cat-metal)    { background: #2a2a1a; color: #c8b460; }
  :global(.cat-energy)   { background: #2d1a40; color: #d05aff; }
  :global(.cat-gas)      { background: #1a2a2a; color: #80d0c0; }
  :global(.cat-compound) { background: #2a1a2a; color: #d080a0; }
  :global(.cat-space)    { background: #0a0a1e; color: #7eb8f7; }
</style>
