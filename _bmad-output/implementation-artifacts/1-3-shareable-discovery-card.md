# Story 1.3: Shareable Discovery Card

**Epic:** Epic 1 — Discovery & Growth
**Status:** done
**Priority:** P0 — highest K-factor story in the milestone

---

## User Story

**As a** player who just discovered a new element,
**I want** to share a branded image card of my discovery to social media or messaging,
**so that** I can celebrate with friends and invite them to play Alchemica.

---

## Acceptance Criteria

- [ ] After discovering any new element, the "Share" button in `ResultDisplay` generates a canvas-rendered PNG card (no server call)
- [ ] Card contains: element symbol + name, discovery count (e.g., "Discovery #47 of 61"), element formula, game logo (`/icon-192.png`), tagline "Play Alchemica", and `desc` as a science snippet
- [ ] Card renders within 300ms of button tap
- [ ] Native share sheet opens with the generated image (iOS `UIActivityViewController` / Android `ACTION_SEND`)
- [ ] On daily challenge completion, a second "Share Challenge" button appears in `DailyChallenge` component with format: "I solved today's Alchemica challenge! 🧪 ({element.name}) — Day {streak} streak"
- [ ] Works offline — no external images fetched at share time (logo loaded from `/icon-192.png` bundled asset)
- [ ] Falls back to text share if `navigator.share({ files })` not supported
- [ ] Share button shows "Copied!" feedback for 1.5s on clipboard fallback

---

## Codebase Context

### Existing Architecture — What NOT to change

| Concern | Current Location | Keep? |
|---|---|---|
| Text share (current) | `src/lib/utils/share.ts` → `shareDiscovery()` | **Extend** — add canvas variant alongside it |
| Share button UI | `src/lib/components/ResultDisplay.svelte` → `handleShare()` | **Update** — call new canvas function |
| Reaction flow | `src/lib/game/reactions.ts` → `applyReaction()` | No change |
| Discovery data | `src/lib/stores/game.ts` → `unlockedElements`, `discoveries` | Read-only access |
| Daily challenge UI | `src/lib/components/DailyChallenge.svelte` | **Add** share button to `.complete` block |
| Game stores | `src/lib/stores/` | No structural changes |

### Existing Element Type (types.ts)

```ts
export interface Element {
  name: string;
  symbol: string;       // emoji or text symbol (e.g. '🔥', 'O₂')
  category: Category;
  color: string;        // CSS class name
  desc: string;         // science description — USE as "science fact" on card
  formula: string;      // chemical formula
  recipe?: string;
}
```

> **Note:** No `scienceFact` field exists — use `el.desc` as the science snippet on the card. Do NOT add a new field to the type; `desc` is sufficient and already populated for all elements.

### Current share.ts (src/lib/utils/share.ts)

The file already exists with `shareDiscovery(elementKey)` for text-only sharing. **Extend** it by adding a new exported function `shareDiscoveryCard(elementKey, discoveryNumber, totalElements)` that does canvas rendering and image sharing. Keep the existing `shareDiscovery()` function intact (don't remove it — it may still be used as a fallback).

### Static assets available

- `/icon-192.png` — game icon, use as logo on card (192×192px)
- `/icon-512.png` — high-res variant (use this for crisp canvas rendering)
- **Load via `new Image()`** — set `img.src = '/icon-192.png'`, wait for `img.onload`

### Total elements count

```ts
import { ELEMENTS } from '../data/elements.js';
const totalElements = Object.keys(ELEMENTS).length; // currently 61, will grow
```

### Current discovery number

```ts
import { unlockedElements } from '../stores/game.js';
import { get } from 'svelte/store';
const discoveryNumber = get(unlockedElements).size;
```

---

## Implementation Plan

### Files to create

| File | Purpose |
|---|---|
| `src/lib/utils/shareCard.ts` | Canvas rendering logic — pure TypeScript, no Svelte |

### Files to modify

| File | Change |
|---|---|
| `src/lib/utils/share.ts` | Add `shareDiscoveryCard()` and `shareDailyCard()` exports |
| `src/lib/components/ResultDisplay.svelte` | Update `handleShare()` to call `shareDiscoveryCard()` |
| `src/lib/components/DailyChallenge.svelte` | Add share button to the `.complete` block |

> **No `@capacitor/share` plugin needed.** The Web Share API (`navigator.share({ files: [file] })`) works natively in Capacitor WebViews on both iOS (WKWebView) and Android (WebView). Capacitor exposes the full Web API surface including file sharing.

---

## Detailed Implementation

### Step 1 — Create `src/lib/utils/shareCard.ts`

This is the core canvas renderer. It must be pure TypeScript (no Svelte imports).

```ts
/**
 * shareCard.ts — Canvas-based PNG card renderer for element discoveries.
 * Renders asynchronously; promise resolves to a Blob within 300ms.
 */
import { ELEMENTS } from '../data/elements.js';

/** Card dimensions — standard OG image aspect ratio (wide enough for Instagram stories too) */
const CARD_W = 1080;
const CARD_H = 1080;

export interface DiscoveryCardOptions {
  elementKey: string;
  discoveryNumber: number;  // e.g. 47 (current unlocked count)
  totalElements: number;    // e.g. 61 (Object.keys(ELEMENTS).length)
}

export interface DailyChallengeCardOptions {
  elementKey: string;
  streakCount: number;
}

/**
 * Load an image from a URL. Returns a promise that resolves to HTMLImageElement.
 * Must be called in browser context only.
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Render a discovery card to a Blob.
 * Returns null if canvas API is unavailable (SSR / unsupported browser).
 */
export async function renderDiscoveryCard(opts: DiscoveryCardOptions): Promise<Blob | null> {
  if (typeof document === 'undefined') return null;

  const el = ELEMENTS[opts.elementKey];
  if (!el) return null;

  const canvas = document.createElement('canvas');
  canvas.width = CARD_W;
  canvas.height = CARD_H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Load logo (non-blocking if it fails — card still renders without it)
  let logoImg: HTMLImageElement | null = null;
  try {
    logoImg = await loadImage('/icon-192.png');
  } catch {
    // Logo not critical — skip it
  }

  // ── Background ──────────────────────────────────────────────
  // Deep space gradient matching the game's dark theme
  const bg = ctx.createLinearGradient(0, 0, 0, CARD_H);
  bg.addColorStop(0, '#071424');
  bg.addColorStop(1, '#0a1e30');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  // Subtle grid lines (game's sci-fi aesthetic)
  ctx.strokeStyle = 'rgba(74, 144, 226, 0.07)';
  ctx.lineWidth = 1;
  for (let x = 0; x < CARD_W; x += 60) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CARD_H); ctx.stroke();
  }
  for (let y = 0; y < CARD_H; y += 60) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CARD_W, y); ctx.stroke();
  }

  // ── Logo (top-left) ──────────────────────────────────────────
  if (logoImg) {
    const logoSize = 72;
    ctx.drawImage(logoImg, 48, 48, logoSize, logoSize);
  }

  // ── "ALCHEMICA" wordmark (top-left, next to logo) ────────────
  ctx.font = 'bold 28px "Space Mono", monospace, sans-serif';
  ctx.fillStyle = '#4af0c0';
  ctx.textBaseline = 'middle';
  ctx.fillText('ALCHEMICA', logoImg ? 136 : 48, 84);

  // ── Discovery badge (top-right) ──────────────────────────────
  const badgeText = `DISCOVERY #${opts.discoveryNumber} / ${opts.totalElements}`;
  ctx.font = '600 22px system-ui, sans-serif';
  ctx.fillStyle = '#ffe44a';
  ctx.textAlign = 'right';
  ctx.fillText(badgeText, CARD_W - 48, 84);
  ctx.textAlign = 'left';

  // ── NEW DISCOVERY label ──────────────────────────────────────
  ctx.font = 'bold 18px "Space Mono", monospace, sans-serif';
  ctx.fillStyle = '#ffe44a';
  ctx.textAlign = 'center';
  ctx.fillText('✦ NEW DISCOVERY', CARD_W / 2, 220);

  // ── Element symbol (large, centered) ────────────────────────
  // Emoji symbols need extra font handling
  ctx.font = `${el.symbol.length <= 2 ? '200px' : '140px'} system-ui, "Segoe UI Emoji", sans-serif`;
  ctx.fillStyle = '#ffffff';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillText(el.symbol, CARD_W / 2, 430);

  // ── Element name ─────────────────────────────────────────────
  ctx.font = 'bold 72px system-ui, sans-serif';
  ctx.fillStyle = '#e8f4ff';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(el.name, CARD_W / 2, 590);

  // ── Formula pill ─────────────────────────────────────────────
  ctx.font = '32px "Space Mono", monospace, sans-serif';
  ctx.fillStyle = '#4af0c0';
  ctx.fillText(el.formula, CARD_W / 2, 645);

  // ── Divider line ─────────────────────────────────────────────
  ctx.strokeStyle = 'rgba(74, 240, 192, 0.25)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(80, 690); ctx.lineTo(CARD_W - 80, 690);
  ctx.stroke();

  // ── Science fact (desc) — word-wrapped ──────────────────────
  ctx.font = '26px system-ui, sans-serif';
  ctx.fillStyle = '#8ab4d4';
  ctx.textAlign = 'center';
  wrapText(ctx, el.desc, CARD_W / 2, 730, CARD_W - 160, 38);

  // ── CTA footer ───────────────────────────────────────────────
  ctx.font = 'bold 28px system-ui, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.textAlign = 'center';
  ctx.fillText('Play Alchemica — discover all the elements', CARD_W / 2, CARD_H - 52);

  // ── Border glow ──────────────────────────────────────────────
  ctx.strokeStyle = 'rgba(74, 240, 192, 0.35)';
  ctx.lineWidth = 3;
  ctx.strokeRect(16, 16, CARD_W - 32, CARD_H - 32);

  // ── Serialize to Blob ────────────────────────────────────────
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png');
  });
}

/**
 * Render a daily challenge completion card.
 */
export async function renderDailyCard(opts: DailyChallengeCardOptions): Promise<Blob | null> {
  if (typeof document === 'undefined') return null;

  const el = ELEMENTS[opts.elementKey];
  if (!el) return null;

  const canvas = document.createElement('canvas');
  canvas.width = CARD_W;
  canvas.height = CARD_H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  let logoImg: HTMLImageElement | null = null;
  try { logoImg = await loadImage('/icon-192.png'); } catch { /* skip */ }

  // Background — warmer tint for daily completion
  const bg = ctx.createLinearGradient(0, 0, 0, CARD_H);
  bg.addColorStop(0, '#0d1a08');
  bg.addColorStop(1, '#0a1520');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  // Grid
  ctx.strokeStyle = 'rgba(74, 240, 192, 0.05)';
  ctx.lineWidth = 1;
  for (let x = 0; x < CARD_W; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CARD_H); ctx.stroke(); }
  for (let y = 0; y < CARD_H; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CARD_W, y); ctx.stroke(); }

  // Logo
  if (logoImg) ctx.drawImage(logoImg, 48, 48, 72, 72);

  // Wordmark
  ctx.font = 'bold 28px "Space Mono", monospace, sans-serif';
  ctx.fillStyle = '#4af0c0';
  ctx.textBaseline = 'middle';
  ctx.fillText('ALCHEMICA', logoImg ? 136 : 48, 84);

  // Streak badge
  const streakText = opts.streakCount > 0 ? `🔥 Day ${opts.streakCount} streak` : '🔥 First challenge!';
  ctx.font = '600 24px system-ui, sans-serif';
  ctx.fillStyle = '#ff9f43';
  ctx.textAlign = 'right';
  ctx.fillText(streakText, CARD_W - 48, 84);
  ctx.textAlign = 'left';

  // Daily badge
  ctx.font = 'bold 18px "Space Mono", monospace, sans-serif';
  ctx.fillStyle = '#4af0c0';
  ctx.textAlign = 'center';
  ctx.fillText('✦ DAILY CHALLENGE COMPLETE', CARD_W / 2, 220);

  // Calendar icon
  ctx.font = '180px system-ui, "Segoe UI Emoji", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textBaseline = 'middle';
  ctx.fillText('🗓', CARD_W / 2, 390);

  // "I solved today's challenge!"
  ctx.font = 'bold 52px system-ui, sans-serif';
  ctx.fillStyle = '#e8f4ff';
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'center';
  ctx.fillText("I solved today's challenge!", CARD_W / 2, 560);

  // Target element
  ctx.font = `60px system-ui, "Segoe UI Emoji", sans-serif`;
  ctx.fillText(`${el.symbol} ${el.name}`, CARD_W / 2, 630);

  // Science fact
  ctx.strokeStyle = 'rgba(74, 240, 192, 0.25)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(80, 680); ctx.lineTo(CARD_W - 80, 680); ctx.stroke();

  ctx.font = '26px system-ui, sans-serif';
  ctx.fillStyle = '#8ab4d4';
  ctx.textAlign = 'center';
  wrapText(ctx, el.desc, CARD_W / 2, 720, CARD_W - 160, 38);

  // CTA
  ctx.font = 'bold 28px system-ui, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.textAlign = 'center';
  ctx.fillText('Play Alchemica — a new challenge every day', CARD_W / 2, CARD_H - 52);

  // Border
  ctx.strokeStyle = 'rgba(74, 240, 192, 0.35)';
  ctx.lineWidth = 3;
  ctx.strokeRect(16, 16, CARD_W - 32, CARD_H - 32);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png');
  });
}

/**
 * Helper: word-wrap text onto canvas at given maxWidth, with lineHeight.
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): void {
  const words = text.split(' ');
  let line = '';
  let curY = y;
  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, curY);
      line = word;
      curY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line) ctx.fillText(line, x, curY);
}
```

---

### Step 2 — Update `src/lib/utils/share.ts`

Add two new exports below the existing `shareDiscovery()` function. **Do not modify or remove the existing `shareDiscovery()` function.**

```ts
// Add these imports at the top of the file (alongside existing imports):
import { renderDiscoveryCard, renderDailyCard } from './shareCard.js';
import { get } from 'svelte/store';
import { unlockedElements } from '../stores/game.js';
import { ELEMENTS } from '../data/elements.js';

/**
 * Share a canvas-rendered PNG discovery card via Web Share API (file).
 * Falls back to text share if file sharing is not supported.
 */
export async function shareDiscoveryCard(elementKey: string): Promise<ShareResult> {
  if (typeof window === 'undefined') return { ok: false, method: 'none' };

  const el = ELEMENTS[elementKey];
  if (!el) return { ok: false, method: 'none' };

  const discoveryNumber = get(unlockedElements).size;
  const totalElements = Object.keys(ELEMENTS).length;

  const blob = await renderDiscoveryCard({ elementKey, discoveryNumber, totalElements });

  if (blob && navigator.canShare?.({ files: [new File([blob], 'discovery.png', { type: 'image/png' })] })) {
    const file = new File([blob], `alchemica-discovery-${elementKey}.png`, { type: 'image/png' });
    try {
      await navigator.share({ files: [file], title: `I discovered ${el.name} in Alchemica!` });
      return { ok: true, method: 'share' };
    } catch {
      // User cancelled — not an error
      return { ok: false, method: 'none' };
    }
  }

  // Fallback: text share
  return shareDiscovery(elementKey);
}

/**
 * Share a canvas-rendered daily challenge completion card.
 */
export async function shareDailyCard(elementKey: string, streakCount: number): Promise<ShareResult> {
  if (typeof window === 'undefined') return { ok: false, method: 'none' };

  const el = ELEMENTS[elementKey];
  if (!el) return { ok: false, method: 'none' };

  const blob = await renderDailyCard({ elementKey, streakCount });
  const streakText = streakCount > 0 ? ` 🔥 Day ${streakCount} streak!` : '';
  const text = `I solved today's Alchemica challenge! 🧪 ${el.symbol} ${el.name}${streakText}`;

  if (blob && navigator.canShare?.({ files: [new File([blob], 'daily.png', { type: 'image/png' })] })) {
    const file = new File([blob], `alchemica-daily-${elementKey}.png`, { type: 'image/png' });
    try {
      await navigator.share({ files: [file], title: text });
      return { ok: true, method: 'share' };
    } catch {
      return { ok: false, method: 'none' };
    }
  }

  // Fallback: text + clipboard
  const url = typeof window !== 'undefined' ? window.location.href : '';
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      return { ok: true, method: 'clipboard' };
    } catch { /* ignore */ }
  }
  return { ok: false, method: 'none' };
}
```

---

### Step 3 — Update `src/lib/components/ResultDisplay.svelte`

**Change `handleShare()` to call `shareDiscoveryCard()` instead of `shareDiscovery()`.**

Find the import line:
```ts
import { shareDiscovery } from '../utils/share.js';
```
Replace with:
```ts
import { shareDiscoveryCard } from '../utils/share.js';
```

Find the `handleShare()` function:
```ts
async function handleShare() {
  if (!result) return;
  const res = await shareDiscovery(result);
  if (res.method === 'clipboard' && res.ok) {
    shareMsg = 'Copied!';
    setTimeout(() => { shareMsg = null; }, 1500);
  }
}
```
Replace with:
```ts
async function handleShare() {
  if (!result) return;
  shareMsg = '…';
  const res = await shareDiscoveryCard(result);
  if (res.method === 'clipboard' && res.ok) {
    shareMsg = 'Copied!';
    setTimeout(() => { shareMsg = null; }, 1500);
  } else {
    shareMsg = null;
  }
}
```

> **Why `shareMsg = '…'`?** Canvas rendering is async (~50-200ms). Setting a loading indicator prevents the button looking frozen while the image generates.

---

### Step 4 — Update `src/lib/components/DailyChallenge.svelte`

Add a "Share" button to the existing `.complete` block. The button only shows when `$dailyCompleted` is true.

**Add this import at the top of the `<script>` block:**
```ts
import { shareDailyCard } from '../utils/share.js';

let shareMsg = $state<string | null>(null);

async function handleDailyShare() {
  if (!$dailyCompleted || !element) return;
  shareMsg = '…';
  const res = await shareDailyCard($dailyChallengeTarget, $streakCount);
  if (res.method === 'clipboard' && res.ok) {
    shareMsg = 'Copied!';
    setTimeout(() => { shareMsg = null; }, 1500);
  } else {
    shareMsg = null;
  }
}
```

**In the template, inside the `{#if $dailyCompleted}` block, add the share button after the `complete-banner` div:**
```svelte
{#if $dailyCompleted}
  <div class="complete-banner">
    <!-- existing content unchanged -->
  </div>
  <button class="daily-share-btn" onclick={handleDailyShare}>
    {shareMsg ?? '🔗 Share'}
  </button>
{/if}
```

**Add style:**
```css
.daily-share-btn {
  margin-top: 4px;
  padding: 4px 14px;
  font-size: 12px;
  font-family: 'Space Mono', monospace;
  background: transparent;
  border: 1px solid rgba(74, 240, 192, 0.35);
  border-radius: 6px;
  color: #4af0c0;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}
.daily-share-btn:hover { border-color: #4af0c0; color: #fff; }
```

---

## Edge Cases & Gotchas

| Case | Handling |
|---|---|
| User cancels native share sheet | `navigator.share()` rejects — catch silently, set `shareMsg = null` |
| Browser doesn't support `canShare` | `navigator.canShare?.()` with optional chaining returns `undefined` → falls back to text share |
| Canvas not available (old Android WebView) | `canvas.getContext('2d')` returns `null` → function returns `null` → text fallback |
| Symbol is multi-char text (e.g., `'O₂'`) | Font size check in renderer: `el.symbol.length <= 2 ? '200px' : '140px'` |
| Logo image fails to load | `try/catch` around `loadImage()` → card renders without logo |
| SSR (SvelteKit prerendering) | `typeof document === 'undefined'` guard at start of `renderDiscoveryCard` |
| `unlockedElements` store read in non-reactive context | `get(unlockedElements).size` — safe snapshot read |
| Daily challenge target element missing from ELEMENTS | `if (!el) return null` guard returns null → falls back to text share |

---

## Performance Notes

- Canvas 1080×1080 renders in ~20-80ms on modern devices
- `loadImage('/icon-192.png')` is the main bottleneck — browser caches it after first load
- Total expected time from tap to share sheet open: **<150ms** (first share); **<100ms** (subsequent, logo cached)
- Target: ≤300ms (NFR-02)

---

## Testing Checklist

- [ ] Discovery share button appears only when `isNew === true`
- [ ] Share button shows `'…'` loading state immediately on tap
- [ ] Canvas card renders with: symbol, name, formula, desc, discovery count, logo, CTA
- [ ] On iOS simulator: native share sheet opens with image preview
- [ ] On Android emulator: native share sheet opens with image
- [ ] On desktop Chrome (no file share): falls back to text share (clipboard or Web Share text)
- [ ] User cancelling share sheet does not leave UI in broken state
- [ ] Daily complete share button appears after daily challenge completion
- [ ] Daily card shows correct streak count
- [ ] Elements with long `desc` wrap properly (test: `oxygen` — long desc)
- [ ] Elements with text symbols (e.g., `'O₂'`, `'H₂'`) render at smaller font without overflow

---

## Definition of Done

- [ ] `src/lib/utils/shareCard.ts` created and compiles with no TypeScript errors
- [ ] `src/lib/utils/share.ts` updated with `shareDiscoveryCard()` and `shareDailyCard()` exports
- [ ] `ResultDisplay.svelte` uses `shareDiscoveryCard()` — no regressions to existing share button behaviour
- [ ] `DailyChallenge.svelte` shows share button on completion state
- [ ] `get_errors` reports zero TypeScript errors in all changed files
- [ ] Manual smoke test: share a discovery on dev server — image appears in browser share dialog or clipboard fallback triggers
- [ ] Sprint status updated to `done` for `1-3-shareable-discovery-card`
