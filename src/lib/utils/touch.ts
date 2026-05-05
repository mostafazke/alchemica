/**
 * touch.ts — Touch interaction utilities
 * Long-press detector, swipe handler, haptic feedback
 */
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';
import { get } from 'svelte/store';
import { hapticsMuted } from '../stores/settings.js';

// ─── Haptic ──────────────────────────────────────────────────────────────────

/** Vibrate on success reaction (50ms) — uses Haptics.notification on native, navigator.vibrate on web */
export async function hapticSuccess(): Promise<void> {
  if (get(hapticsMuted)) return;
  try {
    if (Capacitor.isNativePlatform()) {
      await Haptics.notification({ type: NotificationType.Success });
    } else if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  } catch {
    // silently ignore — vibration not supported or blocked
  }
}

/** Vibrate on failed reaction (short double-pulse) — uses Haptics.notification on native, navigator.vibrate on web */
export async function hapticFail(): Promise<void> {
  if (get(hapticsMuted)) return;
  try {
    if (Capacitor.isNativePlatform()) {
      await Haptics.notification({ type: NotificationType.Error });
    } else if ('vibrate' in navigator) {
      navigator.vibrate([20, 30, 20]);
    }
  } catch {
    // silently ignore
  }
}

/** Generic haptic pulse with custom pattern — uses Haptics.impact on native, navigator.vibrate on web */
export async function haptic(pattern: number | number[] = 30): Promise<void> {
  if (get(hapticsMuted)) return;
  try {
    if (Capacitor.isNativePlatform()) {
      await Haptics.impact({ style: ImpactStyle.Light });
    } else if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  } catch {
    // silently ignore
  }
}

// ─── Long Press ───────────────────────────────────────────────────────────────

export interface LongPressOptions {
  /** Duration in ms before long-press fires. Default: 500 */
  duration?: number;
  /** Pixel distance tolerance — movement beyond this cancels the press. Default: 10 */
  tolerance?: number;
  onLongPress: () => void;
  /** Optional: fires on normal tap (no long press). */
  onTap?: () => void;
}

/**
 * Attaches long-press detection to a DOM element.
 * Returns a cleanup function to remove event listeners.
 */
export function createLongPress(
  element: HTMLElement,
  options: LongPressOptions
): () => void {
  const { duration = 500, tolerance = 10, onLongPress, onTap } = options;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let startX = 0;
  let startY = 0;
  let fired = false;

  function start(e: PointerEvent) {
    if (e.button !== 0 && e.pointerType !== 'touch') return;
    fired = false;
    startX = e.clientX;
    startY = e.clientY;
    timer = setTimeout(() => {
      fired = true;
      onLongPress();
    }, duration);
  }

  function move(e: PointerEvent) {
    if (timer === null) return;
    const dx = Math.abs(e.clientX - startX);
    const dy = Math.abs(e.clientY - startY);
    if (dx > tolerance || dy > tolerance) cancel();
  }

  function end() {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
    if (!fired && onTap) onTap();
  }

  function cancel() {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
    fired = false;
  }

  element.addEventListener('pointerdown', start);
  element.addEventListener('pointermove', move);
  element.addEventListener('pointerup', end);
  element.addEventListener('pointercancel', cancel);

  return () => {
    cancel();
    element.removeEventListener('pointerdown', start);
    element.removeEventListener('pointermove', move);
    element.removeEventListener('pointerup', end);
    element.removeEventListener('pointercancel', cancel);
  };
}

// ─── Swipe ────────────────────────────────────────────────────────────────────

export interface SwipeOptions {
  /** Minimum horizontal px to count as a swipe. Default: 50 */
  threshold?: number;
  /** Max vertical drift ratio (dy/dx) before swipe is cancelled. Default: 0.5 */
  maxVerticalRatio?: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

/**
 * Attaches left/right swipe detection to a DOM element.
 * Returns cleanup function.
 */
export function createSwipeHandler(
  element: HTMLElement,
  options: SwipeOptions
): () => void {
  const { threshold = 50, maxVerticalRatio = 0.5, onSwipeLeft, onSwipeRight } = options;
  let startX = 0;
  let startY = 0;
  let tracking = false;

  function start(e: TouchEvent) {
    if (e.touches.length !== 1) return;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    tracking = true;
  }

  function end(e: TouchEvent) {
    if (!tracking) return;
    tracking = false;
    if (e.changedTouches.length !== 1) return;
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) < threshold) return;
    if (Math.abs(dy) / Math.abs(dx) > maxVerticalRatio) return;
    if (dx < 0) onSwipeLeft?.();
    else onSwipeRight?.();
  }

  function cancelSwipe() { tracking = false; }

  element.addEventListener('touchstart', start, { passive: true });
  element.addEventListener('touchend', end, { passive: true });
  element.addEventListener('touchcancel', cancelSwipe, { passive: true });

  return () => {
    element.removeEventListener('touchstart', start);
    element.removeEventListener('touchend', end);
    element.removeEventListener('touchcancel', cancelSwipe);
  };
}
