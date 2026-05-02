<script lang="ts">
  import { score, combo, unlockedElements } from '../stores/game.js';
  import { resetGame } from '../stores/game.js';
</script>

<header class="top-bar">
  <div class="top-bar-title">⚗️ Alchemica</div>
  <div class="top-bar-stats">
    <span class="stat">🔬 {$unlockedElements.size}/32</span>
    <span class="stat combo" class:pulse={$combo > 1}>x{$combo}</span>
    <span class="stat score">{$score}</span>
    <button class="reset-btn" onclick={resetGame} title="Reset game">↺</button>
  </div>
</header>

<style>
  .top-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    height: 52px;
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
  .stat.score { color: #4af0c0; }
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
</style>
