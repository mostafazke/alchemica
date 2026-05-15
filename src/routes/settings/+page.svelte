<script lang="ts">
  import { goto } from '$app/navigation';
  import { get } from 'svelte/store';
  import { purchasedNoAds, resetGame } from '$lib/stores/game.js';
  import { streakCount } from '$lib/stores/achievements.js';
  import { soundMuted, hapticsMuted, notificationsEnabled, notificationsAsked, analyticsEnabled } from '$lib/stores/settings.js';
  import { Capacitor } from '@capacitor/core';
  import { requestAndSchedule, cancelStreakNotification } from '$lib/effects/notifications.js';
  import {
    purchaseRemoveAds,
    purchaseHintBundle,
    restorePurchases,
    removeAdsPrice,
    hintBundlePrice,
    isPurchasing,
    purchaseError,
  } from '$lib/effects/iap.js';

  const isNative = Capacitor.isNativePlatform();

  let showResetModal = $state(false);

  function handleBack() { goto('/'); }

  async function handleNotificationsToggle(enabled: boolean) {
    if (enabled) {
      notificationsAsked.set(true);
      const granted = await requestAndSchedule(get(streakCount));
      notificationsEnabled.set(granted);
    } else {
      notificationsEnabled.set(false);
      await cancelStreakNotification();
    }
  }

  function handleResetConfirm() {
    resetGame();
    showResetModal = false;
    goto('/');
  }

  async function handlePurchaseRemoveAds() { await purchaseRemoveAds(); }
  async function handlePurchaseHints() { await purchaseHintBundle(); }
  async function handleRestore() { await restorePurchases(); }
</script>

<div class="settings-page">
  <header class="settings-header">
    <button class="back-btn" onclick={handleBack} aria-label="Back to main menu">←</button>
    <h1 class="settings-title">Settings</h1>
  </header>

  <div class="settings-body">

    <section class="settings-section">
      <div class="section-label">Audio & Feedback</div>
      <div class="section-rows">
        <div class="settings-row">
          <span class="row-icon">🔊</span>
          <div class="row-body">
            <span class="row-label">Sound Effects</span>
            <span class="row-desc">Achievement chimes and reaction sounds</span>
          </div>
          <label class="toggle-wrap" aria-label="Toggle sound effects">
            <input class="sr-only" type="checkbox"
              checked={!$soundMuted}
              onchange={(e) => soundMuted.set(!(e.target as HTMLInputElement).checked)}
            />
            <span class="toggle-track" class:on={!$soundMuted}><span class="toggle-knob"></span></span>
          </label>
        </div>
        <div class="settings-row">
          <span class="row-icon">📳</span>
          <div class="row-body">
            <span class="row-label">Haptic Feedback</span>
            <span class="row-desc">Vibration on reactions and actions</span>
          </div>
          <label class="toggle-wrap" aria-label="Toggle haptic feedback">
            <input class="sr-only" type="checkbox"
              checked={!$hapticsMuted}
              onchange={(e) => hapticsMuted.set(!(e.target as HTMLInputElement).checked)}
            />
            <span class="toggle-track" class:on={!$hapticsMuted}><span class="toggle-knob"></span></span>
          </label>
        </div>
      </div>
    </section>

    {#if isNative}
      <section class="settings-section">
        <div class="section-label">Notifications</div>
        <div class="section-rows">
          <div class="settings-row">
            <span class="row-icon">🔔</span>
            <div class="row-body">
              <span class="row-label">Daily Reminders</span>
              <span class="row-desc">Notified at 8 PM when your daily challenge is ready</span>
            </div>
            <label class="toggle-wrap" aria-label="Toggle daily reminders">
              <input class="sr-only" type="checkbox"
                checked={$notificationsEnabled}
                onchange={(e) => handleNotificationsToggle((e.target as HTMLInputElement).checked)}
              />
              <span class="toggle-track" class:on={$notificationsEnabled}><span class="toggle-knob"></span></span>
            </label>
          </div>
        </div>
      </section>
    {/if}

    <section class="settings-section">
      <div class="section-label">Privacy</div>
      <div class="section-rows">
        <div class="settings-row">
          <span class="row-icon">📊</span>
          <div class="row-body">
            <span class="row-label">Anonymous Analytics</span>
            <span class="row-desc">Helps us understand how to improve the game</span>
          </div>
          <label class="toggle-wrap" aria-label="Toggle analytics">
            <input class="sr-only" type="checkbox"
              checked={$analyticsEnabled}
              onchange={(e) => analyticsEnabled.set((e.target as HTMLInputElement).checked)}
            />
            <span class="toggle-track" class:on={$analyticsEnabled}><span class="toggle-knob"></span></span>
          </label>
        </div>
      </div>
    </section>

    {#if isNative}
      <section class="settings-section">
        <div class="section-label">Purchases</div>
        <div class="purchase-grid">
          {#if $purchasedNoAds}
            <div class="purchase-card purchase-card-owned">
              <span class="purchase-icon">✓</span>
              <span class="purchase-name">Ads Removed</span>
              <span class="purchase-status">Owned</span>
            </div>
          {:else}
            <button class="purchase-card" disabled={$isPurchasing} onclick={handlePurchaseRemoveAds}>
              <span class="purchase-icon">🚫</span>
              <span class="purchase-name">Remove Ads</span>
              <span class="purchase-price">{$removeAdsPrice}</span>
            </button>
          {/if}
          <button class="purchase-card" disabled={$isPurchasing} onclick={handlePurchaseHints}>
            <span class="purchase-icon">💡</span>
            <span class="purchase-name">10 Hints</span>
            <span class="purchase-price">{$hintBundlePrice}</span>
          </button>
        </div>
        {#if $purchaseError}
          <p class="feedback-error">{$purchaseError}</p>
        {/if}
        <button class="restore-btn" disabled={$isPurchasing} onclick={handleRestore}>
          {$isPurchasing ? 'Working…' : 'Restore Purchases'}
        </button>
      </section>
    {/if}

    <section class="settings-section">
      <div class="section-label">Advanced</div>
      <div class="section-rows">
        <button class="settings-row row-danger" type="button" onclick={() => showResetModal = true}>
          <span class="row-icon">↺</span>
          <div class="row-body">
            <span class="row-label danger-label">Reset Game</span>
            <span class="row-desc">Permanently erase all progress and achievements</span>
          </div>
          <span class="row-chevron">›</span>
        </button>
      </div>
    </section>

  </div>

  {#if showResetModal}
    <div class="modal-overlay" role="none" onclick={() => showResetModal = false}></div>
    <div class="modal" role="alertdialog" aria-modal="true" aria-labelledby="reset-modal-title">
      <h2 id="reset-modal-title" class="modal-title">Reset Game?</h2>
      <p class="modal-body">This will permanently erase all your progress, discoveries, and achievements.</p>
      <div class="modal-actions">
        <button class="modal-btn modal-btn-cancel" onclick={() => showResetModal = false}>Cancel</button>
        <button class="modal-btn modal-btn-reset" onclick={handleResetConfirm}>Reset</button>
      </div>
    </div>
  {/if}
</div>

<style>
  /* ─── Layout ────────────────────────────────────────────── */
  .settings-page {
    min-height: 100dvh;
    background: var(--color-bg-deep);
    display: flex;
    flex-direction: column;
  }
  .settings-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: env(safe-area-inset-top, 0px) max(16px, env(safe-area-inset-right, 16px)) 0 max(16px, env(safe-area-inset-left, 16px));
    min-height: calc(52px + env(safe-area-inset-top, 0px));
    background: var(--color-bg-deep);
    border-bottom: 1px solid var(--color-border-subtle);
    flex-shrink: 0;
  }
  .back-btn {
    background: transparent;
    border: 1px solid var(--color-border-mid);
    border-radius: 6px;
    color: var(--color-text-muted);
    font-size: 18px;
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
  .back-btn:hover {
    color: var(--color-accent-text);
    border-color: color-mix(in srgb, var(--color-accent) 25%, transparent);
  }
  .settings-title {
    font-family: 'Space Mono', monospace;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--color-accent-text);
    margin: 0;
  }
  .settings-body {
    overflow-y: auto;
    flex: 1;
    padding-bottom: env(safe-area-inset-bottom, 0px);
  }

  /* ─── Sections ──────────────────────────────────────────── */
  .settings-section { padding-top: 8px; }
  .section-label {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: var(--color-text-muted);
    padding: 8px 16px 6px;
  }
  .section-rows {
    border-top: 1px solid var(--color-border-subtle);
    border-bottom: 1px solid var(--color-border-subtle);
  }

  /* ─── Rows ──────────────────────────────────────────────── */
  .settings-row {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 56px;
    padding: 12px 16px;
    background: var(--color-bg-surface);
    width: 100%;
    text-align: left;
    border: none;
    cursor: default;
    font-family: inherit;
  }
  .settings-row + .settings-row { border-top: 1px solid var(--color-border-subtle); }
  .row-icon {
    font-size: 18px;
    width: 24px;
    flex-shrink: 0;
    text-align: center;
    line-height: 1;
  }
  .row-body { flex: 1; min-width: 0; }
  .row-label {
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    font-weight: 700;
    color: var(--color-text-primary);
    display: block;
  }
  .row-desc {
    font-size: 11px;
    color: var(--color-text-muted);
    display: block;
    margin-top: 2px;
    line-height: 1.4;
  }

  /* ─── Toggle switch ─────────────────────────────────────── */
  .toggle-wrap { cursor: pointer; flex-shrink: 0; }
  .sr-only {
    position: absolute; width: 1px; height: 1px;
    padding: 0; margin: -1px; overflow: hidden;
    clip: rect(0,0,0,0); white-space: nowrap; border: 0;
  }
  .toggle-track {
    display: block;
    width: 46px; height: 28px;
    border-radius: 14px;
    background: var(--color-border-mid);
    position: relative;
    transition: background 0.2s ease;
  }
  .toggle-track.on { background: var(--color-accent); }
  .toggle-knob {
    display: block;
    position: absolute;
    top: 3px; left: 3px;
    width: 22px; height: 22px;
    border-radius: 50%;
    background: white;
    box-shadow: 0 1px 4px rgba(60, 30, 10, 0.18);
    transition: transform 0.2s ease;
  }
  .toggle-track.on .toggle-knob { transform: translateX(18px); }

  /* ─── Danger row ────────────────────────────────────────── */
  .row-danger {
    cursor: pointer;
    transition: background 0.15s;
    touch-action: manipulation;
  }
  .row-danger:hover { background: color-mix(in srgb, #c0392b 5%, var(--color-bg-surface)); }
  .danger-label { color: #c0392b; }
  .row-chevron {
    font-size: 22px;
    color: var(--color-border-mid);
    flex-shrink: 0;
    line-height: 1;
    font-weight: 300;
  }

  /* ─── Purchases ─────────────────────────────────────────── */
  .purchase-grid {
    display: flex;
    gap: 8px;
    padding: 8px 16px 4px;
  }
  .purchase-card {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    padding: 14px 8px;
    border-radius: 10px;
    border: 1px solid var(--color-border-mid);
    background: var(--color-bg-surface);
    color: var(--color-text-secondary);
    font-family: 'Space Mono', monospace;
    cursor: pointer;
    transition: all 0.15s;
    touch-action: manipulation;
  }
  .purchase-card:not(:disabled):hover {
    border-color: var(--color-border-active);
    background: var(--color-bg-hover);
  }
  .purchase-card:disabled { opacity: 0.5; cursor: not-allowed; }
  .purchase-card-owned {
    border-color: var(--color-border-active);
    color: var(--color-accent-text);
    background: var(--color-accent-dim);
    cursor: default;
  }
  .purchase-icon { font-size: 20px; line-height: 1; }
  .purchase-name { font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: inherit; }
  .purchase-price { font-size: 12px; font-weight: 700; color: var(--color-accent-text); }
  .purchase-status { font-size: 10px; color: color-mix(in srgb, var(--color-accent-text) 60%, transparent); }
  .feedback-error {
    margin: 0 16px 4px;
    padding: 8px 10px;
    border-radius: 8px;
    font-size: 11px;
    background: rgba(160, 60, 30, 0.08);
    color: var(--raw-ember-700);
    border: 1px solid rgba(160, 60, 30, 0.30);
  }
  .restore-btn {
    display: block;
    width: 100%;
    background: transparent;
    border: none;
    color: var(--color-text-muted);
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    cursor: pointer;
    padding: 8px 16px 14px;
    text-align: center;
    touch-action: manipulation;
    transition: color 0.15s;
    text-decoration: underline;
    text-underline-offset: 2px;
  }
  .restore-btn:hover:not(:disabled) { color: var(--color-text-secondary); }
  .restore-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* ─── Modal ─────────────────────────────────────────────── */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(26, 14, 5, 0.65);
    z-index: 500;
  }
  .modal {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 501;
    width: min(320px, 90vw);
    background: var(--color-bg-deep);
    border: 1px solid var(--color-border-mid);
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 8px 32px rgba(60, 30, 10, 0.18);
  }
  .modal-title {
    font-family: 'Space Mono', monospace;
    font-size: 14px;
    color: #c0392b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 0 0 12px;
  }
  .modal-body {
    font-size: 13px;
    color: var(--color-text-secondary);
    line-height: 1.5;
    margin: 0 0 20px;
  }
  .modal-actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }
  .modal-btn {
    padding: 10px 20px;
    border-radius: 8px;
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.15s;
    min-height: 44px;
    touch-action: manipulation;
  }
  .modal-btn-cancel {
    background: transparent;
    border: 1px solid var(--color-border-mid);
    color: var(--color-text-secondary);
  }
  .modal-btn-cancel:hover { border-color: color-mix(in srgb, var(--color-accent) 25%, transparent); color: var(--color-text-primary); }
  .modal-btn-reset {
    background: #c0392b;
    border: 1px solid #c0392b;
    color: white;
  }
  .modal-btn-reset:hover { background: #e74c3c; border-color: #e74c3c; }
</style>
