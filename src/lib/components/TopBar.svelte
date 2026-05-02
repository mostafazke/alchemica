<script lang="ts">
  import { score, combo, unlockedElements } from '../stores/game.js';
  import { resetGame } from '../stores/game.js';
  import { earnedAchievements, streakCount } from '../stores/achievements.js';
  import { ELEMENTS } from '../data/elements.js';

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
  <div class="top-bar-title">⚗️ Alchemica</div>
  <div class="top-bar-stats">
    <span class="stat" class:badge-pulse={pulseActive}>{$unlockedElements.size}/{Object.keys(ELEMENTS).length} discovered</span>
    <span class="stat combo" class:pulse={$combo > 1} class:streak={$streakCount >= 1}>x{$combo}{$streakCount >= 1 ? ' 🔥' : ''}</span>
    <span class="stat score">{$score}</span>
    <button class="reset-btn" onclick={resetGame} title="Reset game">↺</button>
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
  .top-bar-title {
    font-family: 'Space Mono', monospace;
    font-size: 16px;
    color: #4af0c0;
    font-weight: 700;
    letter-spacing: 1px;
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
  }
  .stat.combo {
    color: #ffe44a;
    font-size: 15px;
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
  .reset-btn {
    background: transparent;
    border: 1px solid #1a3a5a;
    border-radius: 6px;
    color: #4a6080;
    font-size: 16px;
    cursor: pointer;
    padding: 2px 8px;
    line-height: 1.4;
    transition: all 0.15s;
  }
  .reset-btn:hover { color: #ff6b6b; border-color: #ff6b6b40; }
  @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.3)} }
  .combo.pulse { animation: pulse 0.3s ease; }
  @media (max-width: 360px) {
    .top-bar-stats { gap: 8px; }
    .top-bar-title { font-size: 14px; }
    .stat { font-size: 11px; }
  }
</style>
