/**
 * share.ts — Web Share API with clipboard fallback.
 * Includes canvas-based image card sharing via shareCard.ts.
 */
import { get } from 'svelte/store';
import { ELEMENTS } from '../data/elements.js';
import { unlockedElements } from '../stores/game.js';
import { renderDiscoveryCard, renderDailyCard } from './shareCard.js';

export type ShareMethod = 'share' | 'clipboard' | 'none';

export interface ShareResult {
  ok: boolean;
  method: ShareMethod;
}

/**
 * Share a discovered element via Web Share API or clipboard.
 * Safe to call in SSR — guards against missing window/navigator.
 */
export async function shareDiscovery(elementKey: string): Promise<ShareResult> {
  if (typeof window === 'undefined') return { ok: false, method: 'none' };

  const el = ELEMENTS[elementKey];
  if (!el) return { ok: false, method: 'none' };

  const text = `I discovered ${el.name} (${el.formula}) in Alchemica! 🧪`;
  const url = window.location.href;

  // Web Share API (mobile browsers, Chrome Android, Safari iOS)
  if (navigator.share) {
    try {
      await navigator.share({ title: 'Alchemica', text, url });
      return { ok: true, method: 'share' };
    } catch {
      // User cancelled or permission denied — fall through to clipboard
    }
  }

  // Clipboard API fallback
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      return { ok: true, method: 'clipboard' };
    } catch {
      // Clipboard unavailable
    }
  }

  return { ok: false, method: 'none' };
}

/**
 * Share a canvas-rendered PNG discovery card via Web Share API (files).
 * Falls back to text share if file sharing is not supported.
 */
export async function shareDiscoveryCard(elementKey: string): Promise<ShareResult> {
  if (typeof window === 'undefined') return { ok: false, method: 'none' };

  const el = ELEMENTS[elementKey];
  if (!el) return { ok: false, method: 'none' };

  const discoveryNumber = get(unlockedElements).size;
  const totalElements = Object.keys(ELEMENTS).length;

  const blob = await renderDiscoveryCard({ elementKey, discoveryNumber, totalElements });

  if (blob) {
    const file = new File([blob], `alchemica-discovery-${elementKey}.png`, { type: 'image/png' });
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: `I discovered ${el.name} in Alchemica!` });
        return { ok: true, method: 'share' };
      } catch {
        // User cancelled — not an error
        return { ok: false, method: 'none' };
      }
    }
  }

  // Fallback: text share
  return shareDiscovery(elementKey);
}

/**
 * Share a canvas-rendered daily challenge completion card.
 * Falls back to text + clipboard if file sharing is not supported.
 */
export async function shareDailyCard(elementKey: string, streakCount: number): Promise<ShareResult> {
  if (typeof window === 'undefined') return { ok: false, method: 'none' };

  const el = ELEMENTS[elementKey];
  if (!el) return { ok: false, method: 'none' };

  const blob = await renderDailyCard({ elementKey, streakCount });
  const streakText = streakCount > 0 ? ` 🔥 Day ${streakCount} streak!` : '';
  const text = `I solved today's Alchemica challenge! 🧪 ${el.symbol} ${el.name}${streakText}`;

  if (blob) {
    const file = new File([blob], `alchemica-daily-${elementKey}.png`, { type: 'image/png' });
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: text });
        return { ok: true, method: 'share' };
      } catch {
        return { ok: false, method: 'none' };
      }
    }
  }

  // Fallback: text share or clipboard
  const url = window.location.href;
  if (navigator.share) {
    try {
      await navigator.share({ title: 'Alchemica', text, url });
      return { ok: true, method: 'share' };
    } catch { /* cancelled */ }
  }
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      return { ok: true, method: 'clipboard' };
    } catch { /* unavailable */ }
  }
  return { ok: false, method: 'none' };
}
