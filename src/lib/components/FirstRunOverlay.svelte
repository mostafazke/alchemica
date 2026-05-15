<script lang="ts">
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { unlockedElements } from '../stores/game.js';
  import { onboardingStep, step2Dismissed, completeOnboarding, ONBOARD_KEY } from '../stores/onboarding.js';

  // ── Initialization ────────────────────────────────────────────
  onMount(() => {
    if (localStorage.getItem(ONBOARD_KEY)) return; // already done
    onboardingStep.set(1);

    // Watch for Steam discovery to advance to Step 2
    const unsub = unlockedElements.subscribe((unlocked) => {
      const step = get(onboardingStep);

      if (step === 1 && unlocked.has('steam')) {
        onboardingStep.set(2);
        return;
      }

      // Step 3: 3+ elements discovered AND step 2 already dismissed
      if (step === 0 && get(step2Dismissed) && unlocked.size >= 3) {
        onboardingStep.set(3);
      }
    });

    return unsub;
  });

  // When step 2 is dismissed, watch for 3+ elements to trigger step 3
  $effect(() => {
    if ($step2Dismissed && $onboardingStep === 0) {
      if (get(unlockedElements).size >= 3) {
        onboardingStep.set(3);
      }
    }
  });

  function skipAll() {
    completeOnboarding();
  }

  function dismissStep2() {
    step2Dismissed.set(true);
    onboardingStep.set(0);
    // step 3 will auto-trigger via $effect above once count reaches 3
  }

  function dismissStep3() {
    completeOnboarding();
  }
</script>

{#if $onboardingStep === 1}
  <!-- Step 1: Non-blocking hint card in corner — highlights Fire + Water in shelf -->
  <div class="hint-card hint-step1" role="complementary" aria-label="Onboarding hint">
    <div class="hint-body">
      <span class="hint-arrow">←</span>
      <span class="hint-text">Try combining <strong>🔥 Fire</strong> + <strong>💧 Water</strong></span>
    </div>
    <button class="hint-skip" onclick={skipAll} aria-label="Skip tutorial">Skip</button>
  </div>

{:else if $onboardingStep === 2}
  <!-- Step 2: Steam discovered confirmation -->
  <div class="hint-card hint-step2" role="status" aria-live="polite">
    <div class="hint-icon">♨️</div>
    <div class="hint-body">
      <span class="hint-headline">Nice! You discovered Steam 🎉</span>
      <span class="hint-sub">Now try anything you like →</span>
    </div>
    <button class="hint-got-it" onclick={dismissStep2}>Got it!</button>
  </div>

{:else if $onboardingStep === 3}
  <!-- Step 3: Summary card after 3+ discoveries -->
  <div class="hint-card hint-step3" role="status" aria-live="polite">
    <div class="hint-icon">⚗️</div>
    <div class="hint-body">
      <span class="hint-headline">You've discovered {$unlockedElements.size} elements!</span>
      <span class="hint-sub">Keep experimenting — there are {61 - $unlockedElements.size} more to find.</span>
    </div>
    <button class="hint-got-it" onclick={dismissStep3}>Keep exploring →</button>
  </div>
{/if}

<style>
  /* ── Shared card base ───────────────────────────────────────── */
  .hint-card {
    position: fixed;
    z-index: 400;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 12px;
    background: var(--color-bg-deep);
    border: 1px solid var(--color-border-mid);
    box-shadow: 0 8px 32px rgba(60, 30, 10, 0.18), 0 0 0 1px color-mix(in srgb, var(--color-accent) 9%, transparent);
    animation: card-in 0.3s cubic-bezier(0.34, 1.3, 0.64, 1) both;
    pointer-events: all;
    max-width: min(340px, 92vw);
  }
  @keyframes card-in {
    from { opacity: 0; transform: translateY(6px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0)   scale(1);    }
  }

  /* ── Step 1: bottom-left hint pointing at shelf ─────────────── */
  .hint-step1 {
    bottom: calc(env(safe-area-inset-bottom, 0px) + 12px);
    left: 12px;
    flex-wrap: nowrap;
  }
  .hint-arrow {
    font-size: 18px;
    color: var(--color-accent);
    animation: pulse-arrow 1.2s ease-in-out infinite;
    flex-shrink: 0;
  }
  @keyframes pulse-arrow {
    0%, 100% { transform: translateX(0); opacity: 1; }
    50%       { transform: translateX(-4px); opacity: 0.7; }
  }
  .hint-text {
    font-size: 13px;
    color: var(--color-text-primary);
    line-height: 1.4;
    flex: 1;
  }
  .hint-text strong { color: var(--color-text-primary); }
  .hint-skip {
    flex-shrink: 0;
    background: transparent;
    border: 1px solid var(--color-border-mid);
    border-radius: 6px;
    color: var(--color-text-muted);
    font-size: 11px;
    padding: 4px 10px;
    cursor: pointer;
    transition: color 0.15s, border-color 0.15s;
    min-height: 32px;
    touch-action: manipulation;
  }
  .hint-skip:hover { color: var(--color-text-secondary); border-color: var(--color-text-muted); }

  /* ── Step 2 & 3: center-bottom confirmation card ────────────── */
  .hint-step2,
  .hint-step3 {
    bottom: calc(env(safe-area-inset-bottom, 0px) + 12px);
    left: 50%;
    transform: translateX(-50%);
    flex-direction: row;
    border-color: var(--color-border-mid);
  }
  .hint-icon {
    font-size: 28px;
    flex-shrink: 0;
    line-height: 1;
  }
  .hint-body {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
    min-width: 0;
  }
  .hint-headline {
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    font-weight: 700;
    color: var(--color-accent);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .hint-sub {
    font-size: 11px;
    color: var(--color-text-secondary);
    line-height: 1.4;
  }
  .hint-got-it {
    flex-shrink: 0;
    background: color-mix(in srgb, var(--color-accent) 8%, transparent);
    border: 1px solid color-mix(in srgb, var(--color-accent) 25%, transparent);
    border-radius: 8px;
    color: var(--color-accent);
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    font-weight: 700;
    padding: 6px 12px;
    cursor: pointer;
    min-height: 36px;
    touch-action: manipulation;
    white-space: nowrap;
    transition: background 0.15s, border-color 0.15s;
  }
  .hint-got-it:hover { background: color-mix(in srgb, var(--color-accent) 15%, transparent); border-color: color-mix(in srgb, var(--color-accent) 50%, transparent); }
</style>

