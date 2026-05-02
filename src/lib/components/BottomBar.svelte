<script lang="ts">
  import { discoveries } from '../stores/game.js';
</script>

<footer class="bottom-bar">
  <span class="bottom-stat">🧪 {$discoveries.length} discovered</span>
</footer>

<style>
  .bottom-bar {
    display: none;
    height: 48px;
    background: #0d1b2e;
    border-top: 1px solid #1a2e4a;
    align-items: center;
    justify-content: center;
    padding: 0 16px;
    flex-shrink: 0;
  }
  @media (max-width: 768px) {
    .bottom-bar { display: flex; }
  }
  .bottom-stat { font-family: 'Space Mono', monospace; font-size: 11px; color: #4a6080; }
</style>
