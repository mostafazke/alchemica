<script lang="ts">
  import { discoveries } from '../stores/game.js';

  let { shelfOpen = false, onToggleShelf, discoverySheetOpen = false, onToggleDiscoveries, settingsOpen = false, onToggleSettings }: {
    shelfOpen?: boolean;
    onToggleShelf?: () => void;
    discoverySheetOpen?: boolean;
    onToggleDiscoveries?: () => void;
    settingsOpen?: boolean;
    onToggleSettings?: () => void;
  } = $props();
</script>

<footer class="bottom-bar">
  <button
    class="bar-btn"
    class:active={shelfOpen}
    onclick={onToggleShelf}
    aria-label="Toggle elements shelf"
  >
    🧪 <span class="bar-btn-label">Elements</span>
  </button>
  <span class="bottom-stat">{$discoveries.length} discovered</span>
  <button
    class="bar-btn"
    class:active={discoverySheetOpen}
    onclick={onToggleDiscoveries}
    aria-label="Toggle discoveries"
  >
    📋 <span class="bar-btn-label">Discoveries</span>
    {#if $discoveries.length > 0}
      <span class="disc-badge">{$discoveries.length}</span>
    {/if}
  </button>
  <button
    class="bar-btn"
    class:active={settingsOpen}
    onclick={onToggleSettings}
    aria-label="Open settings"
  >
    ⚙ <span class="bar-btn-label">Settings</span>
  </button>
</footer>

<style>
  .bottom-bar {
    display: none;
    height: 56px;
    background: #0d1b2e;
    border-top: 1px solid #1a2e4a;
    align-items: center;
    justify-content: space-between;
    padding: 0 8px;
    flex-shrink: 0;
  }
  @media (max-width: 768px) {
    .bottom-bar { display: flex; }
  }
  .bottom-stat {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    color: #4a6080;
  }
  .bar-btn {
    position: relative;
    display: flex;
    align-items: center;
    gap: 4px;
    min-width: 44px;
    min-height: 44px;
    padding: 0 12px;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 8px;
    color: #4a6080;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.15s;
    touch-action: manipulation;
  }
  .bar-btn:hover, .bar-btn.active {
    color: #4af0c0;
    border-color: #4af0c040;
    background: #0f2035;
  }
  .bar-btn-label {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .disc-badge {
    position: absolute;
    top: 4px;
    right: 4px;
    background: #4af0c0;
    color: #0d1b2e;
    font-size: 9px;
    font-weight: 700;
    min-width: 16px;
    height: 16px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 3px;
    font-family: 'Space Mono', monospace;
  }
</style>
