<script lang="ts">
  import { score, combo, unlockedElements } from '../stores/game.js';
  import { earnedAchievements, streakCount } from '../stores/achievements.js';
  import { ELEMENTS } from '../data/elements.js';
  import { goto } from '$app/navigation';
  import DailyPill from './DailyPill.svelte';

  const TOTAL_ELEMENTS = Object.keys(ELEMENTS).length;

  let pulseActive = $state(false);
  let prevEarnedSize = $state(0);

  $effect(() => {
    const size = $earnedAchievements.size;
    if (prevEarnedSize !== 0 && size > prevEarnedSize) {
      pulseActive = true;
      setTimeout(() => { pulseActive = false; }, 800);
    }
    prevEarnedSize = size;
  });
</script>

<header class="top-bar">
  <button class="wordmark-btn" onclick={() => goto('/')} aria-label="Return to menu">Alchemica</button>
  <div class="top-bar-stats">
    <span class="stat discovery" class:badge-pulse={pulseActive}>
      <span class="stat-value discovery-value">{$unlockedElements.size}/{TOTAL_ELEMENTS}</span>
      <span class="stat-label">found</span>
    </span>
    <span class="stat combo" class:pulse={$combo > 1} class:streak={$streakCount >= 1}>
      <span class="stat-value">×{$combo}{$streakCount >= 1 ? ' 🔥' : ''}</span>
      <span class="stat-label">combo</span>
    </span>
    <DailyPill />
    <span class="stat score">
      <span class="stat-value score-value">{$score}</span>
      <span class="stat-label">score</span>
    </span>
  </div>
</header>

<style>
  .top-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: env(safe-area-inset-top, 0px) max(16px, env(safe-area-inset-right, 16px)) 0 max(16px, env(safe-area-inset-left, 16px));
    min-height: calc(52px + env(safe-area-inset-top, 0px));
    background: var(--color-bg-deep);
    border-bottom: 1px solid var(--color-border-subtle);
    flex-shrink: 0;
    z-index: 10;
  }
  .wordmark-btn {
    background: transparent;
    border: none;
    font-family: 'Space Mono', monospace;
    font-size: var(--text-label);
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-accent-text);
    cursor: pointer;
    padding: 0;
    min-width: 44px;
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    touch-action: manipulation;
    flex-shrink: 0;
  }
  .top-bar-stats {
    display: flex;
    gap: 12px;
    align-items: center;
  }
  .stat {
    font-family: 'Space Mono', monospace;
    font-size: var(--text-label);
    color: var(--color-text-secondary);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1px;
  }
  .stat-label {
    font-size: var(--text-caption);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--color-text-muted);
    line-height: 1;
  }
  /* Discovery — primary stat */
  .discovery-value {
    font-size: var(--text-title);
    color: var(--color-accent-text);
    line-height: 1;
  }
  /* Score — secondary stat */
  .score-value {
    font-size: var(--text-body);
    color: var(--color-text-secondary);
    line-height: 1;
  }
  /* Combo */
  .stat.combo {
    color: var(--color-gold);
    font-weight: 700;
    transition: transform 0.1s;
  }
  .stat.combo .stat-value { font-size: var(--text-label); line-height: 1; }
  .stat.combo.streak {
    color: var(--color-ember, #ff8c42);
    text-shadow: 0 0 8px rgba(255, 140, 66, 0.38);
  }
  /* Badge pulse on new achievement — applied to discovery stat */
  .stat.badge-pulse {
    animation: badge-pulse 0.8s ease;
  }
  @keyframes badge-pulse {
    0%   { transform: scale(1);    }
    30%  { transform: scale(1.25); }
    60%  { transform: scale(1.1);  }
    100% { transform: scale(1);    }
  }
  @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.3)} }
  .combo.pulse { animation: pulse 0.3s ease; }
  /* Compact mode — hide score when viewport is short */
  @media (max-height: 350px) {
    .stat.score { display: none; }
  }
</style>
