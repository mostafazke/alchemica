<script lang="ts">
  import { get } from 'svelte/store';
  import { Capacitor } from '@capacitor/core';
  import { dailyChallengeTarget, dailyCompleted } from '../stores/daily.js';
  import { streakCount } from '../stores/achievements.js';
  import { ELEMENTS } from '../data/elements.js';
  import { soundMuted, notificationsEnabled, notificationsAsked } from '../stores/settings.js';
  import { playDailyComplete } from '../effects/sound.js';
  import { shareDailyCard } from '../utils/share.js';
  import { requestAndSchedule, scheduleStreakNotification } from '../effects/notifications.js';
  import { logDailyChallengeCompleted } from '../effects/analytics.js';
  import { shouldShowRating } from '../effects/rating.js';
  import RatingPrompt from './RatingPrompt.svelte';

  const isNative = Capacitor.isNativePlatform();
  const element = $derived(ELEMENTS[$dailyChallengeTarget] ?? null);
  const streakLabel = $derived(
    $streakCount > 0 ? `🔥 ${$streakCount} day streak` : '🔥 Start your streak!'
  );

  // Track previous value to detect the false→true transition during a session.
  let prevCompleted = $state($dailyCompleted);
  $effect(() => {
    const completed = $dailyCompleted;
    if (completed && !prevCompleted) {
      if (!get(soundMuted)) playDailyComplete();
      logDailyChallengeCompleted(get(streakCount), $dailyChallengeTarget);
      // Native: show rationale or reschedule if already enabled
      if (isNative) {
        if (!get(notificationsAsked)) {
          showNotifPrompt = true;
        } else if (get(notificationsEnabled)) {
          // Update title with new streak count
          scheduleStreakNotification(get(streakCount));
        }
      }
      // Delayed rating prompt — after celebration settles, and only if notif prompt isn't showing
      const ratingTimer = setTimeout(() => {
        if (!showNotifPrompt && shouldShowRating()) {
          showRatingPrompt = true;
        }
      }, 2000);
      return () => clearTimeout(ratingTimer);
    }
    prevCompleted = completed;
  });

  let dailyShareMsg = $state<string | null>(null);
  let showNotifPrompt = $state(false);
  let showRatingPrompt = $state(false);

  async function handleDailyShare() {
    if (!$dailyCompleted || !element) return;
    dailyShareMsg = '…';
    const res = await shareDailyCard($dailyChallengeTarget, $streakCount);
    if (res.method === 'clipboard' && res.ok) {
      dailyShareMsg = 'Copied!';
      setTimeout(() => { dailyShareMsg = null; }, 1500);
    } else {
      dailyShareMsg = null;
    }
  }

  async function acceptNotifications() {
    showNotifPrompt = false;
    notificationsAsked.set(true);
    const granted = await requestAndSchedule(get(streakCount));
    notificationsEnabled.set(granted);
  }

  function declineNotifications() {
    showNotifPrompt = false;
    notificationsAsked.set(true);
    notificationsEnabled.set(false);
  }
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
    <button class="daily-share-btn" onclick={handleDailyShare} aria-label="Share daily completion">
      {dailyShareMsg ?? '🔗 Share'}
    </button>
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

{#if showNotifPrompt}
  <div class="notif-prompt" role="complementary" aria-label="Notification permission request">
    <span class="notif-icon">🔔</span>
    <div class="notif-body">
      <span class="notif-title">Stay on your streak!</span>
      <span class="notif-sub">Get notified when tomorrow's challenge is ready?</span>
    </div>
    <div class="notif-actions">
      <button class="notif-yes" onclick={acceptNotifications}>Yes!</button>
      <button class="notif-no" onclick={declineNotifications}>No thanks</button>
    </div>
  </div>
{/if}

<RatingPrompt bind:open={showRatingPrompt} />

<style>
  .daily-challenge {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 8px 12px;
    background: var(--color-bg-surface);
    border: 1px solid var(--color-border-subtle);
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
    color: var(--color-text-muted);
  }
  .target-element {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .target-symbol {
    font-size: 14px;
    color: var(--color-text-secondary);
    font-family: 'Space Mono', monospace;
    font-weight: 700;
  }
  .target-name {
    font-family: 'Space Mono', monospace;
    font-size: 13px;
    font-weight: 700;
    color: var(--color-text-primary);
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
    color: var(--color-text-secondary);
  }

  .streak-label {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    color: var(--color-text-muted);
    text-align: center;
  }
  .daily-challenge.complete .streak-label {
    color: #e8b84b;
  }

  .daily-share-btn {
    margin-top: 2px;
    padding: 3px 12px;
    font-size: 11px;
    font-family: 'Space Mono', monospace;
    background: transparent;
    border: 1px solid var(--color-border-mid);
    border-radius: 6px;
    color: var(--color-accent);
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s;
    white-space: nowrap;
  }
  .daily-share-btn:hover {
    border-color: var(--color-accent);
    color: #fff;
  }

  /* ── Notification rationale prompt ─────────────────────────────── */
  .notif-prompt {
    position: fixed;
    bottom: calc(env(safe-area-inset-bottom, 0px) + 12px);
    right: 12px;
    z-index: 350;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px 14px;
    border-radius: 14px;
    background: var(--color-bg-deep);
    border: 1px solid rgba(232, 184, 75, 0.4);
    box-shadow: 0 8px 32px rgba(60, 30, 10, 0.18);
    max-width: min(280px, 88vw);
    animation: notif-in 0.28s cubic-bezier(0.34, 1.3, 0.64, 1) both;
  }
  @keyframes notif-in {
    from { opacity: 0; transform: translateY(8px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0)    scale(1);   }
  }
  .notif-icon {
    font-size: 20px;
    line-height: 1;
  }
  .notif-body {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  .notif-title {
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    font-weight: 700;
    color: #e8b84b;
  }
  .notif-sub {
    font-size: 11px;
    color: var(--color-text-secondary);
    line-height: 1.4;
  }
  .notif-actions {
    display: flex;
    gap: 6px;
    margin-top: 2px;
  }
  .notif-yes {
    flex: 1;
    background: rgba(232, 184, 75, 0.12);
    border: 1px solid rgba(232, 184, 75, 0.4);
    border-radius: 8px;
    color: #e8b84b;
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    font-weight: 700;
    min-height: 36px;
    cursor: pointer;
    touch-action: manipulation;
    transition: background 0.15s;
  }
  .notif-yes:hover { background: rgba(232, 184, 75, 0.2); }
  .notif-no {
    flex: 1;
    background: transparent;
    border: 1px solid var(--color-border-mid);
    border-radius: 8px;
    color: var(--color-text-muted);
    font-size: 11px;
    min-height: 36px;
    cursor: pointer;
    touch-action: manipulation;
    transition: color 0.15s, border-color 0.15s;
  }
  .notif-no:hover { color: var(--color-text-secondary); border-color: var(--color-text-muted); }
</style>
