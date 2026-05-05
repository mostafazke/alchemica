<script lang="ts">
  import { goto } from '$app/navigation';
  import { get } from 'svelte/store';
  import { unlockedElements, discoveries, score, hintBalance, purchasedNoAds } from '$lib/stores/game.js';
  import { earnedAchievements, streakCount, lastCompletedDate } from '$lib/stores/achievements.js';
  import type { AchievementId } from '$lib/types.js';
  import { downloadSave, importSave } from '$lib/utils/storage.js';
  import { soundMuted, hapticsMuted } from '$lib/stores/settings.js';
  import { resetGame } from '$lib/stores/game.js';
  import { Capacitor } from '@capacitor/core';
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

  // Reset confirmation modal (custom — not window.confirm)
  let showResetModal = $state(false);

  // Import save state
  let importStatus: { ok: boolean; message: string } | null = $state(null);
  let fileInputEl: HTMLInputElement | undefined = $state();

  function handleBack() {
    goto('/');
  }

  function handleResetClick() {
    showResetModal = true;
  }

  function handleResetConfirm() {
    resetGame();
    showResetModal = false;
    goto('/');
  }

  function handleResetCancel() {
    showResetModal = false;
  }

  function handleExport() {
    downloadSave();
  }

  function handleImportClick() {
    fileInputEl?.click();
  }

  function handleFileChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const json = ev.target?.result as string;
      const result = importSave(json, {
        setUnlocked: (keys) => unlockedElements.set(new Set(keys)),
        setDiscoveries: (d) => discoveries.set(d),
        setScore: (n) => score.set(n),
        setEarnedAchievements: (ids: AchievementId[]) => earnedAchievements.set(new Set(ids)),
        setStreakCount: (n) => streakCount.set(n),
        setLastCompletedDate: (d) => lastCompletedDate.set(d),
        setHintBalance: (n) => hintBalance.set(n),
        setPurchasedNoAds: (v) => purchasedNoAds.set(v),
      });
      importStatus = result.ok
        ? { ok: true, message: result.warning ? `Imported! Warning: ${result.warning}` : 'Save imported successfully!' }
        : { ok: false, message: result.error ?? 'Import failed.' };
      target.value = '';
      setTimeout(() => { importStatus = null; }, 5000);
    };
    reader.readAsText(file);
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
      <div class="section-label">Sound</div>
      <label class="mute-toggle">
        <input
          type="checkbox"
          checked={$soundMuted}
          onchange={(e) => soundMuted.set((e.target as HTMLInputElement).checked)}
        />
        <span class="mute-label">
          {$soundMuted ? '🔇 Achievement chime muted' : '🔊 Achievement chime on'}
        </span>
      </label>
    </section>

    <section class="settings-section">
      <div class="section-label">Haptics</div>
      <label class="mute-toggle">
        <input
          type="checkbox"
          checked={$hapticsMuted}
          onchange={(e) => hapticsMuted.set((e.target as HTMLInputElement).checked)}
        />
        <span class="mute-label">
          {$hapticsMuted ? '🔇 Vibration off' : '📳 Vibration on'}
        </span>
      </label>
    </section>

    <section class="settings-section">
      <div class="section-label">Save Data</div>
      <div class="save-actions">
        <button class="action-btn export-btn" onclick={handleExport}>
          ⬇ Export Save
        </button>
        <button class="action-btn import-btn" onclick={handleImportClick}>
          ⬆ Import Save
        </button>
      </div>
      {#if importStatus}
        <div class="import-status" class:ok={importStatus.ok} class:error={!importStatus.ok}>
          {importStatus.message}
        </div>
      {/if}
      <p class="save-hint">
        Export saves your progress as a JSON file.<br />
        Import restores a previously exported save.
      </p>
    </section>

    {#if isNative}
      <section class="settings-section">
        <div class="section-label">Purchases</div>
        <div class="purchase-cards">
          {#if $purchasedNoAds}
            <button class="purchase-card purchase-card-owned" disabled>
              <span class="purchase-icon">✓</span>
              <span class="purchase-name">Ads Removed</span>
              <span class="purchase-price">Owned</span>
            </button>
          {:else}
            <button
              class="purchase-card"
              disabled={$isPurchasing}
              onclick={handlePurchaseRemoveAds}
            >
              <span class="purchase-icon">🚫</span>
              <span class="purchase-name">Remove Ads</span>
              <span class="purchase-price">{$removeAdsPrice}</span>
            </button>
          {/if}
          <button
            class="purchase-card"
            disabled={$isPurchasing}
            onclick={handlePurchaseHints}
          >
            <span class="purchase-icon">💡</span>
            <span class="purchase-name">10 Hints</span>
            <span class="purchase-price">{$hintBundlePrice}</span>
          </button>
        </div>
        {#if $purchaseError}
          <div class="import-status error">
            {$purchaseError}
          </div>
        {/if}
        <button
          class="restore-btn"
          disabled={$isPurchasing}
          onclick={handleRestore}
        >
          {$isPurchasing ? 'Working…' : 'Restore Purchases'}
        </button>
      </section>
    {/if}

    <section class="settings-section danger-section">
      <div class="section-label">Danger Zone</div>
      <button class="reset-btn" onclick={handleResetClick}>
        ↺ Reset Game
      </button>
      <p class="save-hint">This will permanently erase all progress.</p>
    </section>

  </div>

  <!-- Reset confirmation modal -->
  {#if showResetModal}
    <div class="modal-overlay" role="none" onclick={handleResetCancel}></div>
    <div class="modal" role="alertdialog" aria-modal="true" aria-labelledby="reset-modal-title">
      <h2 id="reset-modal-title" class="modal-title">Reset Game?</h2>
      <p class="modal-body">This will permanently erase all your progress, discoveries, and achievements.</p>
      <div class="modal-actions">
        <button class="modal-btn modal-btn-cancel" onclick={handleResetCancel}>Cancel</button>
        <button class="modal-btn modal-btn-reset" onclick={handleResetConfirm}>Reset</button>
      </div>
    </div>
  {/if}

  <input
    bind:this={fileInputEl}
    type="file"
    accept=".json,application/json"
    style="display:none"
    onchange={handleFileChange}
  />
</div>

<style>
  .settings-page {
    min-height: 100dvh;
    background: #0d1b2e;
    display: flex;
    flex-direction: column;
  }
  .settings-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: env(safe-area-inset-top, 0px) max(16px, env(safe-area-inset-right, 16px)) 0 max(16px, env(safe-area-inset-left, 16px));
    min-height: calc(52px + env(safe-area-inset-top, 0px));
    background: #0d1b2e;
    border-bottom: 1px solid #1a2e4a;
    flex-shrink: 0;
  }
  .back-btn {
    background: transparent;
    border: 1px solid #1a3a5a;
    border-radius: 6px;
    color: #4a6080;
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
    color: #4af0c0;
    border-color: #4af0c040;
  }
  .settings-title {
    font-family: 'Space Mono', monospace;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #4af0c0;
    margin: 0;
  }
  .settings-body {
    overflow-y: auto;
    flex: 1;
    padding-bottom: env(safe-area-inset-bottom, 0px);
  }
  .settings-section {
    padding: 16px;
    border-top: 1px solid #1a2e4a;
  }
  .settings-section:first-child {
    border-top: none;
  }
  .section-label {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #4a6080;
    margin-bottom: 10px;
  }
  .mute-toggle {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    min-height: 44px;
    touch-action: manipulation;
  }
  .mute-toggle input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: #4af0c0;
    cursor: pointer;
    flex-shrink: 0;
  }
  .mute-label {
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    color: #8ab4d4;
    user-select: none;
  }
  .save-actions {
    display: flex;
    gap: 8px;
    margin-bottom: 10px;
  }
  .action-btn {
    flex: 1;
    padding: 10px 8px;
    border-radius: 8px;
    border: 1px solid #1a3a5a;
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    cursor: pointer;
    transition: all 0.15s;
    min-height: 44px;
    touch-action: manipulation;
  }
  .export-btn {
    background: #0a1a2a;
    color: #4af0c0;
    border-color: #4af0c040;
  }
  .export-btn:hover { background: #0f2035; border-color: #4af0c0; }
  .import-btn {
    background: #0a1a2a;
    color: #8ab4d4;
    border-color: #1a3a5a;
  }
  .import-btn:hover { background: #0f2035; border-color: #4af0c040; }
  .import-status {
    padding: 8px 10px;
    border-radius: 8px;
    font-size: 12px;
    margin-bottom: 8px;
  }
  .import-status.ok { background: #0a2a1a; color: #4af0c0; border: 1px solid #4af0c040; }
  .import-status.error { background: #2a0a0a; color: #ff6b6b; border: 1px solid #ff6b6b40; }
  .save-hint {
    font-size: 11px;
    color: #2a4060;
    line-height: 1.5;
  }
  .purchase-cards {
    display: flex;
    gap: 8px;
    margin-bottom: 10px;
  }
  .purchase-card {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 12px 8px;
    border-radius: 8px;
    border: 1px solid #1a3a5a;
    background: #0a1a2a;
    color: #8ab4d4;
    font-family: 'Space Mono', monospace;
    cursor: pointer;
    transition: all 0.15s;
    min-height: 44px;
    touch-action: manipulation;
  }
  .purchase-card:not(:disabled):hover {
    border-color: #4af0c060;
    background: #0f2035;
  }
  .purchase-card:disabled { opacity: 0.5; cursor: not-allowed; }
  .purchase-card-owned { border-color: #4af0c040; color: #4af0c0; background: #0a2a1a; }
  .purchase-icon { font-size: 18px; line-height: 1; }
  .purchase-name { font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: inherit; }
  .purchase-price { font-size: 11px; color: #4af0c0; }
  .purchase-card-owned .purchase-price { color: #4af0c080; }
  .restore-btn {
    width: 100%;
    background: transparent;
    border: none;
    color: #4a6080;
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    cursor: pointer;
    padding: 8px 0 0;
    text-decoration: underline;
    text-align: center;
    min-height: 44px;
    touch-action: manipulation;
    transition: color 0.15s;
  }
  .restore-btn:hover:not(:disabled) { color: #8ab4d4; }
  .restore-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .danger-section .reset-btn {
    width: 100%;
    padding: 10px 16px;
    border-radius: 8px;
    border: 1px solid #ff6b6b40;
    background: transparent;
    color: #ff6b6b;
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.15s;
    min-height: 44px;
    touch-action: manipulation;
    margin-bottom: 8px;
  }
  .danger-section .reset-btn:hover {
    background: #2a0a0a;
    border-color: #ff6b6b;
  }
  /* Reset confirmation modal */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 500;
  }
  .modal {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 501;
    width: min(320px, 90vw);
    background: #0d1b2e;
    border: 1px solid #1a3a5a;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
  }
  .modal-title {
    font-family: 'Space Mono', monospace;
    font-size: 14px;
    color: #ff6b6b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 0 0 12px;
  }
  .modal-body {
    font-size: 13px;
    color: #8ab4d4;
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
    border: 1px solid #1a3a5a;
    color: #8ab4d4;
  }
  .modal-btn-cancel:hover { border-color: #4af0c040; color: #c8d8e8; }
  .modal-btn-reset {
    background: #c0392b;
    border: 1px solid #c0392b;
    color: white;
  }
  .modal-btn-reset:hover { background: #e74c3c; border-color: #e74c3c; }
</style>
