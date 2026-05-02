<script lang="ts">
  import { BADGES } from '../data/badges.js';
  import { earnedAchievements } from '../stores/achievements.js';

  let { open = false, onClose }: {
    open?: boolean;
    onClose?: () => void;
  } = $props();
</script>

{#if open}
  <div class="gallery-overlay" onclick={onClose} role="none"></div>
  <div class="gallery-panel" role="dialog" aria-label="Achievements">
    <div class="panel-header">
      <span class="panel-title">Achievements</span>
      <button class="panel-close" onclick={onClose} aria-label="Close achievements">✕</button>
    </div>

    <div class="badges-grid">
      {#each BADGES as badge}
        {@const earned = $earnedAchievements.has(badge.id)}
        <div class="badge-card" class:earned class:locked={!earned}>
          <span class="badge-emoji">{earned ? badge.emoji : '🔒'}</span>
          <span class="badge-name">{badge.name}</span>
          <span class="badge-threshold">Discover {badge.threshold} elements</span>
          {#if earned}
            <span class="badge-earned-label">✓ Earned</span>
          {:else}
            <span class="badge-locked-label">{badge.threshold} elements needed</span>
          {/if}
        </div>
      {/each}
    </div>
  </div>
{/if}

<style>
  .gallery-overlay {
    position: fixed; inset: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 400;
  }
  .gallery-panel {
    position: fixed;
    left: 50%; top: 50%;
    transform: translate(-50%, -50%);
    z-index: 401;
    width: min(400px, 94vw);
    max-height: 90vh;
    background: #0d1b2e;
    border: 1px solid #1a3a5a;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
    animation: panel-appear 0.18s ease;
    display: flex;
    flex-direction: column;
  }
  @keyframes panel-appear {
    from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); }
    to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  }
  .panel-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 16px 12px;
    border-bottom: 1px solid #1a2e4a;
    flex-shrink: 0;
  }
  .panel-title {
    font-family: 'Space Mono', monospace;
    font-size: 13px; text-transform: uppercase;
    letter-spacing: 1px; color: #4af0c0;
  }
  .panel-close {
    background: transparent; border: none; color: #4a6080;
    cursor: pointer; font-size: 14px; padding: 4px 8px;
    border-radius: 6px; min-width: 32px; min-height: 32px;
    touch-action: manipulation; line-height: 1;
    transition: color 0.15s;
  }
  .panel-close:hover { color: #ff6b6b; }

  .badges-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    padding: 16px;
    overflow-y: auto;
  }
  .badge-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 16px 12px;
    background: #0a1628;
    border: 1px solid #1a2e4a;
    border-radius: 12px;
    text-align: center;
    transition: border-color 0.2s;
  }
  .badge-card.earned {
    border-color: rgba(74, 240, 192, 0.4);
    background: rgba(74, 240, 192, 0.04);
  }
  .badge-card.locked {
    opacity: 0.45;
  }
  .badge-emoji {
    font-size: 32px;
    line-height: 1;
  }
  .badge-name {
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    font-weight: 700;
    color: #e8e8f0;
    letter-spacing: 0.3px;
  }
  .badge-threshold {
    font-size: 10px;
    color: #4a6080;
    font-family: 'Space Mono', monospace;
  }
  .badge-earned-label {
    font-size: 10px;
    color: #4af0c0;
    font-family: 'Space Mono', monospace;
    font-weight: 700;
  }
  .badge-locked-label {
    font-size: 10px;
    color: #4a6080;
    font-family: 'Space Mono', monospace;
  }
</style>
