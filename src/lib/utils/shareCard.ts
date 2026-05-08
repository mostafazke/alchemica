/**
 * shareCard.ts — Canvas-based PNG card renderer for element discoveries.
 * Renders asynchronously; promise resolves to a Blob within 300ms.
 * Pure TypeScript — no Svelte imports.
 */
import { ELEMENTS } from '../data/elements.js';

/** Card dimensions — square format works on all social platforms */
const CARD_W = 1080;
const CARD_H = 1080;

export interface DiscoveryCardOptions {
  elementKey: string;
  discoveryNumber: number; // e.g. 47 (current unlocked count)
  totalElements: number;   // e.g. 61 (Object.keys(ELEMENTS).length)
}

export interface DailyChallengeCardOptions {
  elementKey: string;
  streakCount: number;
}

/** Load an image from a URL. Must be called in browser context only. */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Word-wrap text onto canvas at given maxWidth with lineHeight.
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

/**
 * Render a new-element discovery card to a PNG Blob.
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

  // Load logo — non-blocking; card still renders without it
  let logoImg: HTMLImageElement | null = null;
  try {
    logoImg = await loadImage('/icon-192.png');
  } catch {
    // Logo not critical — skip
  }

  // ── Background ──────────────────────────────────────────────
  const bg = ctx.createLinearGradient(0, 0, 0, CARD_H);
  bg.addColorStop(0, '#071424');
  bg.addColorStop(1, '#0a1e30');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  // Subtle sci-fi grid
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
    ctx.drawImage(logoImg, 48, 48, 72, 72);
  }

  // ── "ALCHEMICA" wordmark ─────────────────────────────────────
  ctx.font = 'bold 28px "Space Mono", monospace, sans-serif';
  ctx.fillStyle = '#4af0c0';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillText('ALCHEMICA', logoImg ? 136 : 48, 84);

  // ── Discovery badge (top-right) ──────────────────────────────
  ctx.font = '600 22px system-ui, sans-serif';
  ctx.fillStyle = '#ffe44a';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.fillText(`DISCOVERY #${opts.discoveryNumber} / ${opts.totalElements}`, CARD_W - 48, 84);

  // ── NEW DISCOVERY label ──────────────────────────────────────
  ctx.font = 'bold 18px "Space Mono", monospace, sans-serif';
  ctx.fillStyle = '#ffe44a';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('✦ NEW DISCOVERY', CARD_W / 2, 220);

  // ── Element symbol (large, centered) ────────────────────────
  const symbolFontSize = el.symbol.length <= 2 ? '200px' : '140px';
  ctx.font = `${symbolFontSize} system-ui, "Segoe UI Emoji", "Apple Color Emoji", sans-serif`;
  ctx.fillStyle = '#ffffff';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillText(el.symbol, CARD_W / 2, 420);

  // ── Element name ─────────────────────────────────────────────
  ctx.font = 'bold 72px system-ui, sans-serif';
  ctx.fillStyle = '#e8f4ff';
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'center';
  ctx.fillText(el.name, CARD_W / 2, 590);

  // ── Formula ──────────────────────────────────────────────────
  ctx.font = '32px "Space Mono", monospace, sans-serif';
  ctx.fillStyle = '#4af0c0';
  ctx.textAlign = 'center';
  ctx.fillText(el.formula, CARD_W / 2, 645);

  // ── Divider ──────────────────────────────────────────────────
  ctx.strokeStyle = 'rgba(74, 240, 192, 0.25)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(80, 685);
  ctx.lineTo(CARD_W - 80, 685);
  ctx.stroke();

  // ── Science fact (desc) — word-wrapped ──────────────────────
  ctx.font = '26px system-ui, sans-serif';
  ctx.fillStyle = '#8ab4d4';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  wrapText(ctx, el.desc, CARD_W / 2, 725, CARD_W - 160, 38);

  // ── CTA footer ───────────────────────────────────────────────
  ctx.font = 'bold 26px system-ui, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.textAlign = 'center';
  ctx.fillText('Play Alchemica — discover all the elements', CARD_W / 2, CARD_H - 52);

  // ── Border glow ──────────────────────────────────────────────
  ctx.strokeStyle = 'rgba(74, 240, 192, 0.35)';
  ctx.lineWidth = 3;
  ctx.strokeRect(16, 16, CARD_W - 32, CARD_H - 32);

  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png');
  });
}

/**
 * Render a daily challenge completion card to a PNG Blob.
 * Returns null if canvas API is unavailable.
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

  // Background — warmer green tint for daily completion
  const bg = ctx.createLinearGradient(0, 0, 0, CARD_H);
  bg.addColorStop(0, '#0d1a08');
  bg.addColorStop(1, '#0a1520');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  // Grid
  ctx.strokeStyle = 'rgba(74, 240, 192, 0.05)';
  ctx.lineWidth = 1;
  for (let x = 0; x < CARD_W; x += 60) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CARD_H); ctx.stroke();
  }
  for (let y = 0; y < CARD_H; y += 60) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CARD_W, y); ctx.stroke();
  }

  // Logo
  if (logoImg) ctx.drawImage(logoImg, 48, 48, 72, 72);

  // Wordmark
  ctx.font = 'bold 28px "Space Mono", monospace, sans-serif';
  ctx.fillStyle = '#4af0c0';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillText('ALCHEMICA', logoImg ? 136 : 48, 84);

  // Streak badge (top-right)
  const streakText = opts.streakCount > 0 ? `🔥 Day ${opts.streakCount} streak` : '🔥 First challenge!';
  ctx.font = '600 24px system-ui, sans-serif';
  ctx.fillStyle = '#ff9f43';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.fillText(streakText, CARD_W - 48, 84);

  // Daily badge label
  ctx.font = 'bold 18px "Space Mono", monospace, sans-serif';
  ctx.fillStyle = '#4af0c0';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('✦ DAILY CHALLENGE COMPLETE', CARD_W / 2, 220);

  // Calendar emoji
  ctx.font = '170px system-ui, "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillText('🗓', CARD_W / 2, 390);

  // "I solved today's challenge!"
  ctx.font = 'bold 52px system-ui, sans-serif';
  ctx.fillStyle = '#e8f4ff';
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'center';
  ctx.fillText("I solved today's challenge!", CARD_W / 2, 565);

  // Target element symbol + name
  ctx.font = `52px system-ui, "Segoe UI Emoji", "Apple Color Emoji", sans-serif`;
  ctx.fillStyle = '#ffe44a';
  ctx.textAlign = 'center';
  ctx.fillText(`${el.symbol}  ${el.name}`, CARD_W / 2, 635);

  // Divider
  ctx.strokeStyle = 'rgba(74, 240, 192, 0.25)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(80, 680);
  ctx.lineTo(CARD_W - 80, 680);
  ctx.stroke();

  // Science fact
  ctx.font = '26px system-ui, sans-serif';
  ctx.fillStyle = '#8ab4d4';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  wrapText(ctx, el.desc, CARD_W / 2, 720, CARD_W - 160, 38);

  // CTA footer
  ctx.font = 'bold 26px system-ui, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.textAlign = 'center';
  ctx.fillText('Play Alchemica — a new challenge every day', CARD_W / 2, CARD_H - 52);

  // Border
  ctx.strokeStyle = 'rgba(74, 240, 192, 0.35)';
  ctx.lineWidth = 3;
  ctx.strokeRect(16, 16, CARD_W - 32, CARD_H - 32);

  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png');
  });
}
