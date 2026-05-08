<script lang="ts">
  import { onMount } from 'svelte';

  const STORAGE_KEY = 'alchemica_onboarded';

  let visible = $state(false);
  let step = $state(0);

  const steps = [
    { icon: '🪨', title: 'Pick an element', desc: 'Tap any element in the shelf to load it into a slot.' },
    { icon: '💧', title: 'Pick another', desc: 'Fill both slots. Order doesn\'t matter.' },
    { icon: '⚗️', title: 'Hit React', desc: 'Tap the React button and see what you discover.' },
  ];

  onMount(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      visible = true;
    }
  });

  function next() {
    if (step < steps.length - 1) {
      step++;
    } else {
      dismiss();
    }
  }

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, '1');
    visible = false;
  }
</script>

{#if visible}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="onboard-overlay" onclick={dismiss} aria-hidden="true"></div>
  <div class="onboard-card" role="dialog" aria-modal="true" aria-label="How to play">
    <div class="onboard-header">
      <span class="onboard-logo">⚗</span>
      <span class="onboard-title">How to play</span>
    </div>

    <div class="steps-track">
      {#each steps as s, i}
        <div class="step-dot" class:active={i === step} class:done={i < step}></div>
      {/each}
    </div>

    {#key step}
      <div class="step-content">
        <div class="step-icon">{steps[step].icon}</div>
        <div class="step-name">{steps[step].title}</div>
        <div class="step-desc">{steps[step].desc}</div>
      </div>
    {/key}

    <div class="onboard-actions">
      <button class="skip-btn" onclick={dismiss}>Skip</button>
      <button class="next-btn" onclick={next}>
        {step < steps.length - 1 ? 'Next →' : 'Let\'s go ⚗'}
      </button>
    </div>
  </div>
{/if}

<style>
  .onboard-overlay {
    position: fixed;
    inset: 0;
    background: rgba(4, 10, 20, 0.75);
    z-index: 500;
    backdrop-filter: blur(2px);
  }
  .onboard-card {
    position: fixed;
    left: 50%; top: 50%;
    transform: translate(-50%, -50%);
    z-index: 501;
    width: min(300px, 88vw);
    background: #0d1b2e;
    border: 1px solid #1a3a5a;
    border-radius: 18px;
    padding: 24px 20px 20px;
    box-shadow: 0 12px 40px rgba(0,0,0,0.7), 0 0 0 1px #4af0c018;
    display: flex;
    flex-direction: column;
    gap: 16px;
    animation: card-in 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  @keyframes card-in {
    from { opacity: 0; transform: translate(-50%, -46%) scale(0.94); }
    to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  }
  .onboard-header {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .onboard-logo { font-size: 20px; }
  .onboard-title {
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    font-weight: 700;
    color: #4af0c0;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  .steps-track {
    display: flex;
    gap: 6px;
    align-items: center;
  }
  .step-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #1a3a5a;
    transition: background 0.2s, transform 0.2s;
  }
  .step-dot.active  { background: #4af0c0; transform: scale(1.3); }
  .step-dot.done    { background: #4af0c060; }

  .step-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    text-align: center;
    animation: reveal-up 0.22s ease both;
    min-height: 90px;
    justify-content: center;
  }
  @keyframes reveal-up {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .step-icon { font-size: 36px; line-height: 1; }
  .step-name { font-size: 15px; font-weight: 700; color: #c8d8e8; }
  .step-desc { font-size: 12px; color: #6a8aa4; line-height: 1.5; max-width: 220px; }

  .onboard-actions {
    display: flex;
    gap: 8px;
  }
  .skip-btn {
    flex: 0 0 auto;
    background: transparent;
    border: 1px solid #1a3a5a;
    border-radius: 8px;
    color: #4a6080;
    font-size: 12px;
    padding: 0 16px;
    min-height: 44px;
    cursor: pointer;
    touch-action: manipulation;
    transition: border-color 0.15s, color 0.15s;
  }
  .skip-btn:hover { border-color: #4a6080; color: #8ab4d4; }
  .next-btn {
    flex: 1;
    background: #4af0c015;
    border: 1px solid #4af0c040;
    border-radius: 8px;
    color: #4af0c0;
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    font-weight: 700;
    min-height: 44px;
    cursor: pointer;
    touch-action: manipulation;
    transition: background 0.15s, border-color 0.15s;
  }
  .next-btn:hover { background: #4af0c025; border-color: #4af0c080; }
</style>
