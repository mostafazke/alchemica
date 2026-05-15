<script lang="ts">
  import { activeEvent, dismissEvent, daysRemaining } from '../stores/event.js';
  import { ELEMENTS } from '../data/elements.js';
  import { slots } from '../stores/game.js';
  import ElementIcon from './ElementIcon.svelte';

  let modalOpen = $state(false);

  const ev = $derived($activeEvent);
  const days = $derived(ev ? daysRemaining(ev.endDate) : 0);
  const targetEl = $derived(ev ? (ELEMENTS[ev.targetElement] ?? null) : null);

  // Description capped at 60 chars for banner display
  const shortDesc = $derived(ev
    ? ev.description.length > 60
      ? ev.description.slice(0, 57) + '…'
      : ev.description
    : ''
  );

  function handleBannerClick() {
    modalOpen = true;
  }

  function handleDismiss(e: MouseEvent) {
    e.stopPropagation();
    if (ev) dismissEvent(ev.id);
  }

  function handleTryNow() {
    if (!ev) return;
    // Focus target element by loading it into slot a
    slots.update((s) => ({ ...s, a: ev.targetElement }));
    modalOpen = false;
    if (ev) dismissEvent(ev.id); // dismiss banner after "Try Now"
  }

  function closeModal() {
    modalOpen = false;
  }
</script>

{#if ev}
  <!-- ── Compact banner strip ─────────────────────────────────── -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="event-banner" onclick={handleBannerClick} role="button" tabindex="0"
       onkeydown={(e) => e.key === 'Enter' && handleBannerClick()}>
    <span class="event-icon">{ev.iconKey}</span>
    <div class="event-info">
      <span class="event-title">{ev.title}</span>
      <span class="event-desc">{shortDesc}</span>
    </div>
    <span class="event-days">{days} day{days !== 1 ? 's' : ''} left</span>
    <button class="event-dismiss" onclick={handleDismiss} aria-label="Dismiss event banner">✕</button>
  </div>

  <!-- ── Detail modal ──────────────────────────────────────────── -->
  {#if modalOpen}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="modal-overlay" onclick={closeModal} aria-hidden="true"></div>
    <div class="modal" role="dialog" aria-modal="true" aria-label="{ev.title} event details">
      <div class="modal-header">
        <span class="modal-icon">{ev.iconKey}</span>
        <div class="modal-titles">
          <span class="modal-title">{ev.title}</span>
          <span class="modal-days">{days} day{days !== 1 ? 's' : ''} left</span>
        </div>
        <button class="modal-close" onclick={closeModal} aria-label="Close">✕</button>
      </div>

      <p class="modal-desc">{ev.description}</p>

      {#if targetEl}
        <div class="modal-target">
          <span class="target-label">Target element</span>
          <div class="target-el">
            <span class="target-symbol {targetEl.color}"><ElementIcon key={ev.targetElement} /></span>
            <div class="target-info">
              <span class="target-name">{targetEl.name}</span>
              <span class="target-formula">{targetEl.formula}</span>
            </div>
          </div>
        </div>
      {/if}

      <button class="try-now-btn" onclick={handleTryNow}>
        ⚗ Try Now
      </button>
    </div>
  {/if}
{/if}

<style>
  /* ── Banner strip ─────────────────────────────────────────────── */
  .event-banner {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    background: linear-gradient(90deg, var(--color-bg-hover) 0%, var(--color-bg-surface) 100%);
    border-bottom: 1px solid var(--color-border-mid);
    cursor: pointer;
    flex-shrink: 0;
    transition: background 0.15s;
  }
  .event-banner:hover { background: linear-gradient(90deg, var(--color-bg-hover) 0%, var(--color-bg-raised) 100%); }

  .event-icon {
    font-size: 20px;
    flex-shrink: 0;
    line-height: 1;
  }
  .event-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-width: 0;
  }
  .event-title {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    font-weight: 700;
    color: var(--color-accent-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .event-desc {
    font-size: 10px;
    color: var(--color-text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .event-days {
    flex-shrink: 0;
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    color: var(--color-text-muted);
    white-space: nowrap;
  }
  .event-dismiss {
    flex-shrink: 0;
    background: transparent;
    border: none;
    color: var(--color-text-muted);
    font-size: 11px;
    cursor: pointer;
    min-width: 28px;
    min-height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border-radius: 4px;
    touch-action: manipulation;
    transition: color 0.15s;
  }
  .event-dismiss:hover { color: var(--color-danger); }

  /* ── Modal overlay ────────────────────────────────────────────── */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(26, 14, 5, 0.70);
    z-index: 600;
    backdrop-filter: blur(2px);
  }
  .modal {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 601;
    width: min(320px, 90vw);
    background: var(--color-bg-deep);
    border: 1px solid var(--color-border-mid);
    border-radius: 18px;
    padding: 20px;
    box-shadow: 0 12px 40px rgba(60, 30, 10, 0.20), 0 0 0 1px rgba(180, 130, 60, 0.25);
    display: flex;
    flex-direction: column;
    gap: 14px;
    animation: modal-in 0.25s cubic-bezier(0.34, 1.3, 0.64, 1) both;
  }
  @keyframes modal-in {
    from { opacity: 0; transform: translate(-50%, -48%) scale(0.95); }
    to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  }

  .modal-header {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .modal-icon {
    font-size: 28px;
    flex-shrink: 0;
    line-height: 1;
  }
  .modal-titles {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }
  .modal-title {
    font-family: 'Space Mono', monospace;
    font-size: 14px;
    font-weight: 700;
    color: var(--color-accent-text);
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    color: var(--color-text-muted);
  }
  .modal-close {
    flex-shrink: 0;
    background: transparent;
    border: 1px solid var(--color-border-mid);
    border-radius: 6px;
    color: var(--color-text-muted);
    cursor: pointer;
    min-width: 32px;
    min-height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    padding: 0;
    touch-action: manipulation;
    transition: color 0.15s, border-color 0.15s;
  }
  .modal-close:hover { color: var(--color-danger); border-color: color-mix(in srgb, var(--color-danger) 25%, transparent); }

  .modal-desc {
    font-size: 13px;
    color: var(--color-text-secondary);
    line-height: 1.5;
    margin: 0;
  }

  /* Target element display */
  .modal-target {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px;
    background: var(--color-bg-deep);
    border: 1px solid var(--color-border-subtle);
    border-radius: 10px;
  }
  .target-label {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--color-text-muted);
  }
  .target-el {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .target-symbol {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    flex-shrink: 0;
  }
  .target-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .target-name {
    font-size: 14px;
    font-weight: 700;
    color: var(--color-text-primary);
  }
  .target-formula {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    color: var(--color-accent-text);
  }

  /* Try Now CTA */
  .try-now-btn {
    background: linear-gradient(135deg, var(--color-bg-raised), var(--color-bg-raised));
    border: 1px solid var(--color-border-active);
    border-radius: 10px;
    color: var(--color-accent-text);
    font-family: 'Space Mono', monospace;
    font-size: 13px;
    font-weight: 700;
    padding: 12px 0;
    width: 100%;
    cursor: pointer;
    touch-action: manipulation;
    transition: border-color 0.15s, background 0.15s;
    letter-spacing: 0.5px;
  }
  .try-now-btn:hover {
    border-color: var(--color-accent);
    background: linear-gradient(135deg, var(--color-bg-raised), var(--color-bg-raised));
  }
</style>
