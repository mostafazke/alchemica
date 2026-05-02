/**
 * share.ts — Web Share API with clipboard fallback.
 */
import { ELEMENTS } from '../data/elements.js';

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
