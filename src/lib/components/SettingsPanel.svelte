<script lang="ts">
  import { unlockedElements, discoveries, score } from '../stores/game.js';
  import { downloadSave, importSave } from '../utils/storage.js';

  let { open = false, onClose }: {
    open: boolean;
    onClose: () => void;
  } = $props();

  let importStatus: { ok: boolean; message: string } | null = $state(null);
  let fileInputEl: HTMLInputElement | undefined = $state();

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
      });

      if (result.ok) {
        importStatus = {
          ok: true,
          message: result.warning
            ? `Imported! Warning: ${result.warning}`
            : 'Save imported successfully!',
        };
      } else {
        importStatus = { ok: false, message: result.error ?? 'Import failed.' };
      }

      // Clear the input for re-use
      target.value = '';

      // Auto-clear status after 5 seconds
      setTimeout(() => { importStatus = null; }, 5000);
    };
    reader.readAsText(file);
  }
</script>

{#if open}
  <div class="panel-overlay" onclick={onClose} role="none"></div>
  <div class="settings-panel" role="dialog" aria-label="Settings">
    <div class="panel-header">
      <span class="panel-title">Settings</span>
      <button class="panel-close" onclick={onClose} aria-label="Close settings">✕</button>
    </div>

    <div class="panel-section">
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
    </div>

    <input
      bind:this={fileInputEl}
      type="file"
      accept=".json,application/json"
      style="display:none"
      onchange={handleFileChange}
    />
  </div>
{/if}

<style>
  .panel-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.5);
    z-index: 400;
  }
  .settings-panel {
    position: fixed;
    left: 50%; top: 50%;
    transform: translate(-50%, -50%);
    z-index: 401;
    width: min(340px, 92vw);
    background: #0d1b2e;
    border: 1px solid #1a3a5a;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0,0,0,0.6);
    animation: panel-appear 0.18s ease;
  }
  @keyframes panel-appear {
    from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); }
    to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  }
  .panel-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 16px 12px;
    border-bottom: 1px solid #1a2e4a;
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
  .panel-section { padding: 16px; }
  .section-label {
    font-family: 'Space Mono', monospace; font-size: 10px;
    text-transform: uppercase; letter-spacing: 0.5px;
    color: #4a6080; margin-bottom: 10px;
  }
  .save-actions { display: flex; gap: 8px; margin-bottom: 10px; }
  .action-btn {
    flex: 1; padding: 10px 8px;
    border-radius: 8px; border: 1px solid #1a3a5a;
    font-family: 'Space Mono', monospace; font-size: 11px;
    cursor: pointer; transition: all 0.15s;
    min-height: 44px; touch-action: manipulation;
  }
  .export-btn {
    background: #0a1a2a; color: #4af0c0; border-color: #4af0c040;
  }
  .export-btn:hover { background: #0f2035; border-color: #4af0c0; }
  .import-btn {
    background: #0a1a2a; color: #8ab4d4; border-color: #1a3a5a;
  }
  .import-btn:hover { background: #0f2035; border-color: #4af0c040; }
  .import-status {
    padding: 8px 10px;
    border-radius: 8px; font-size: 12px; margin-bottom: 8px;
  }
  .import-status.ok { background: #0a2a1a; color: #4af0c0; border: 1px solid #4af0c040; }
  .import-status.error { background: #2a0a0a; color: #ff6b6b; border: 1px solid #ff6b6b40; }
  .save-hint { font-size: 11px; color: #2a4060; line-height: 1.5; }
</style>
