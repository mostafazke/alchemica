<script lang="ts">
  import { score, combo, unlockedElements } from '../stores/game.js';
  import { earnedAchievements, streakCount } from '../stores/achievements.js';
  import { ELEMENTS } from '../data/elements.js';
  import { goto } from '$app/navigation';
  import DailyPill from './DailyPill.svelte';

  let pulseActive = $state(false);
  let prevEarnedSize = $earnedAchievements.size;

  $effect(() => {
    const size = $earnedAchievements.size;
    if (size > prevEarnedSize) {
      pulseActive = true;
      setTimeout(() => { pulseActive = false; }, 800);
    }
    prevEarnedSize = size;
  });
</script>

<header class="top-bar">
  <button class="pause-btn" onclick={() => goto('/')} aria-label="Pause - return to menu">&#9208;</button>
  <div class="top-bar-stats">
    <span class="stat" class:badge-pulse={pulseActive}>
      <span class="stat-value">{$unlockedElements.size}/{Object.keys(ELEMENTS).length}</span>
      <span class="stat-label">found</span>
    </span>
    <span class="stat combo" class:pulse={$combo > 1} class:streak={$streakCount >= 1}>
      <span class="stat-value">×{$combo}{$streakCount >= 1 ? ' 🔥' : ''}</span>
      <span class="stat-label">combo</span>
    </span>
    <DailyPill />
    <span class="stat score">
      <span class="stat-value">{$score}</span>
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
    background: #0d1b2e;
    border-bottom: 1px solid #1a2e4a;
    flex-shrink: 0;
    z-index: 10;
  }
  .pause-btn {
    background: transparent;
    border: 1px solid #1a3a5a;
    border-radius: 6px;
    color: #4a6080;
    font-size: 16px;
    cursor: pointer;
    padding: 0;
    min-width: 44px;
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    touch-action: manipulation;
    transition: color 0.15s, border-color 0.15s;
    flex-shrink: 0;
  }
  .pause-btn:hover {
    color: #4af0c0;
    border-color: #4af0c040;
  }
  .top-bar-stats {
    display: flex;
    gap: 12px;
    align-items: center;
  }
  .stat {
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    color: #8ab4d4;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1px;
  }
  .stat-value { font-size: 12px; line-height: 1; }
  .stat-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #4a6080; line-height: 1; }
  .stat.combo {
    color: #ffe44a;
    font-weight: 700;
    transition: transform 0.1s;
  }
  .stat.combo.streak {
    color: #ff8c42;
    text-shadow: 0 0 8px #ff8c4260;
  }
  .stat.score { color: #4af0c0; }
  .stat.badge-pulse {
    animation: badge-pulse 0.8s ease;
  }
  @keyframes badge-pulse {
    0%   { transform: scale(1);    color: #8ab4d4; }
    30%  { transform: scale(1.25); color: #e8b84b; }
    60%  { transform: scale(1.1);  color: #e8b84b; }
    100% { transform: scale(1);    color: #8ab4d4; }
  }
  @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.3)} }
  .combo.pulse { animation: pulse 0.3s ease; }
</style>
