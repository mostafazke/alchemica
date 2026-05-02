<script lang="ts">
  import { ELEMENTS } from '../data/elements.js';
  import { shareDiscovery } from '../utils/share.js';

  let {
    result = null,
    isNew = false,
    attempted = false,
  }: { result?: string | null; isNew?: boolean; attempted?: boolean } = $props();

  const FAIL_MSGS = [
    'No reaction detected…',
    'These elements repel each other!',
    'Nothing happened. Try another combo.',
    'Hmm, incompatible substances.',
  ];

  const failMsg = $derived(FAIL_MSGS[Math.floor(Math.random() * FAIL_MSGS.length)]);
  const el = $derived(result ? ELEMENTS[result] : null);

  let shareMsg = $state<string | null>(null);

  async function handleShare() {
    if (!result) return;
    const res = await shareDiscovery(result);
    if (res.method === 'clipboard' && res.ok) {
      shareMsg = 'Copied!';
      setTimeout(() => { shareMsg = null; }, 1500);
    }
  }
</script>

<div
  class="result-display"
  class:success={attempted && !!result}
  class:fail={attempted && !result}
>
  {#if attempted && el}
    {#if isNew}<div class="result-new-badge">✦ NEW DISCOVERY</div>{/if}
    <div class="result-icon">{el.symbol}</div>
    <div class="result-name">{el.name}</div>
    <div class="result-desc">{el.desc}</div>
    <div class="result-formula">{el.formula}</div>
    {#if isNew}
      <button class="result-share-btn" onclick={handleShare} aria-label="Share discovery">
        {shareMsg ?? '🔗 Share'}
      </button>
    {/if}
  {:else if attempted && !result}
    <div class="result-fail-icon">🧪</div>
    <div class="result-error">{failMsg}</div>
    <div class="result-tip">Tip: Think about natural phenomena</div>
  {:else}
    <div class="result-idle">Select two elements and react</div>
  {/if}
</div>

<style>
  .result-display {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 6px; padding: 16px;
    min-height: 150px;
    border-radius: 12px;
    background: #0a1520;
    border: 1px solid #1a2e4a;
    transition: border-color 0.3s, background 0.3s;
    text-align: center;
    width: 100%;
  }
  .result-display.success { border-color: #4af0c060; background: #0a2018; }
  .result-display.fail { border-color: #ff405040; background: #1a0a0a; }
  .result-new-badge { font-size: 9px; color: #ffe44a; font-family: 'Space Mono', monospace; letter-spacing: 2px; text-transform: uppercase; }
  .result-icon { font-size: 36px; }
  .result-name { font-size: 17px; font-weight: 700; color: #4af0c0; }
  .result-desc { font-size: 11px; color: #8ab4d4; max-width: 200px; line-height: 1.4; }
  .result-formula { font-family: 'Space Mono', monospace; font-size: 10px; color: #4af0c080; }
  .result-share-btn {
    margin-top: 4px; padding: 5px 14px;
    background: transparent; border: 1px solid #4af0c030;
    border-radius: 6px; color: #4a6080;
    font-family: 'Space Mono', monospace; font-size: 10px;
    cursor: pointer; transition: all 0.15s;
    min-height: 32px; touch-action: manipulation;
  }
  .result-share-btn:hover { border-color: #4af0c060; color: #4af0c0; }
  .result-fail-icon { font-size: 26px; }
  .result-error { font-size: 13px; color: #ff6060; }
  .result-tip { font-size: 10px; color: #2a3550; }
  .result-idle { font-size: 12px; color: #2a3550; }
</style>
