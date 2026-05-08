<script lang="ts">
  import { get } from 'svelte/store';
  import { dailyChallengeTarget, dailyCompleted } from '../stores/daily.js';
  import { streakCount } from '../stores/achievements.js';
  import { ELEMENTS } from '../data/elements.js';
  import { soundMuted } from '../stores/settings.js';
  import { playDailyComplete } from '../effects/sound.js';

  const element = $derived(ELEMENTS[$dailyChallengeTarget] ?? null);
  const streakLabel = $derived(
    $streakCount > 0 ? `🔥 ${$streakCount} day streak` : '🔥 Start your streak!'
  );

  // Track previous value to detect the false→true transition during a session.
  // Uses initial store value so sound doesn't fire if already complete on mount.
  let prevCompleted = $state($dailyCompleted);
  $effect(() => {
    const completed = $dailyCompleted;
    if (completed && !prevCompleted && !get(soundMuted)) playDailyComplete();
    prevCompleted = completed;
  });
</script>

<div class="daily-challenge" class:complete={$dailyCompleted}>
  {#if $dailyCompleted}
    <div class="complete-banner">
      <span class="complete-icon">🗓</span>
      <div class="complete-text">
        <span class="complete-heading">Daily Complete!</span>
        {#if element}
          <span class="complete-element">{element.symbol} {element.name}</span>
        {/if}
      </div>
    </div>
  {:else}
    <div class="target-row">
      <span class="today-label">Today</span>
      <span class="target-element">
        {#if element}
          <span class="target-symbol">{element.symbol}</span>
          <span class="target-name">{element.name}</span>
        {:else}
          <span class="target-name">—</span>
        {/if}
      </span>
    </div>
  {/if}
  <span class="streak-label">{streakLabel}</span>
</div>

<style>
  .daily-challenge {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 8px 12px;
    background: #0a1628;
    border: 1px solid #1a2e4a;
    border-radius: 8px;
    flex: 1;
    transition: border-color 0.3s, background 0.3s;
    flex-shrink: 0;
  }
  .daily-challenge.complete {
    border-color: rgba(232, 184, 75, 0.5);
    background: rgba(232, 184, 75, 0.04);
  }

  .target-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .today-label {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #4a6080;
  }
  .target-element {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .target-symbol {
    font-size: 14px;
    color: #8ab4d4;
    font-family: 'Space Mono', monospace;
    font-weight: 700;
  }
  .target-name {
    font-family: 'Space Mono', monospace;
    font-size: 13px;
    font-weight: 700;
    color: #e8e8f0;
  }

  .complete-banner {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .complete-icon {
    font-size: 20px;
    line-height: 1;
  }
  .complete-text {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }
  .complete-heading {
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    font-weight: 700;
    color: #e8b84b;
    letter-spacing: 0.3px;
  }
  .complete-element {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    color: #8ab4d4;
  }

  .streak-label {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    color: #4a6080;
    text-align: center;
  }
  .daily-challenge.complete .streak-label {
    color: #e8b84b;
  }
</style>
