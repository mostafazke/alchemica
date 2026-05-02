/**
 * Generate PWA icons for Alchemica.
 * Creates styled 192x192 and 512x512 PNG icons using raw PNG encoding.
 * No external dependencies required — uses only Node.js builtins.
 *
 * Icon design: dark navy bg (#0d1b2e), gold circle, white "A" lettermark
 */

import { deflateSync } from 'zlib';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STATIC_DIR = join(__dirname, '..', 'static');

// Colors
const BG = [13, 27, 46];        // #0d1b2e
const GOLD = [232, 184, 75];    // #e8b84b
const WHITE = [255, 255, 255];
const TRANSPARENT = [0, 0, 0, 0];

function crc32(buf) {
  let crc = 0xffffffff;
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c;
  }
  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.allocUnsafe(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.allocUnsafe(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBytes, data])), 0);
  return Buffer.concat([lenBuf, typeBytes, data, crcBuf]);
}

function makeIHDR(w, h) {
  const b = Buffer.allocUnsafe(13);
  b.writeUInt32BE(w, 0);
  b.writeUInt32BE(h, 4);
  b[8] = 8;  // bit depth
  b[9] = 2;  // color type: RGB
  b[10] = 0; b[11] = 0; b[12] = 0;
  return chunk('IHDR', b);
}

function lerp(a, b, t) { return Math.round(a + (b - a) * t); }

/** Draw pixel at (x,y) with given RGB color, into a flat rows array */
function setPixel(rows, x, y, rgb, w) {
  if (x < 0 || y < 0 || x >= w || y >= w) return;
  const i = x * 3;
  rows[y][i] = rgb[0];
  rows[y][i + 1] = rgb[1];
  rows[y][i + 2] = rgb[2];
}

/** Anti-aliased circle: returns coverage [0..1] for pixel center (px,py) */
function circleCoverage(px, py, cx, cy, r) {
  const dx = px - cx, dy = py - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  return Math.max(0, Math.min(1, r - dist + 0.5));
}

function blendPixel(rows, x, y, rgb, alpha, w) {
  if (x < 0 || y < 0 || x >= w || y >= w) return;
  const i = x * 3;
  const a = alpha;
  rows[y][i]   = Math.round(rows[y][i]   * (1 - a) + rgb[0] * a);
  rows[y][i+1] = Math.round(rows[y][i+1] * (1 - a) + rgb[1] * a);
  rows[y][i+2] = Math.round(rows[y][i+2] * (1 - a) + rgb[2] * a);
}

function drawFilledCircle(rows, cx, cy, r, color, w) {
  const x0 = Math.max(0, Math.floor(cx - r - 1));
  const x1 = Math.min(w - 1, Math.ceil(cx + r + 1));
  const y0 = Math.max(0, Math.floor(cy - r - 1));
  const y1 = Math.min(w - 1, Math.ceil(cy + r + 1));
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const cov = circleCoverage(x + 0.5, y + 0.5, cx, cy, r);
      if (cov > 0) blendPixel(rows, x, y, color, cov, w);
    }
  }
}

/** Draw a thick horizontal line segment with anti-aliasing */
function drawLine(rows, x1, y1, x2, y2, color, thickness, w) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const steps = Math.ceil(len) * 4;
  for (let s = 0; s <= steps; s++) {
    const t = s / steps;
    const cx = x1 + dx * t;
    const cy = y1 + dy * t;
    drawFilledCircle(rows, cx, cy, thickness / 2, color, w);
  }
}

/** Draw letter "A" centered in the icon */
function drawLetterA(rows, cx, cy, size, color, w) {
  // "A" defined as line segments in normalized coords [-0.5..0.5]
  const thick = size * 0.10;
  const h = size;
  // Left leg: bottom-left to top-center
  drawLine(rows, cx - size * 0.4, cy + h * 0.45, cx, cy - h * 0.45, color, thick, w);
  // Right leg: top-center to bottom-right
  drawLine(rows, cx, cy - h * 0.45, cx + size * 0.4, cy + h * 0.45, color, thick, w);
  // Crossbar: middle left to middle right
  const barY = cy + h * 0.05;
  drawLine(rows, cx - size * 0.22, barY, cx + size * 0.22, barY, color, thick, w);
}

/** Draw decorative dots (constellation / alchemical feel) */
function drawDots(rows, cx, cy, circleR, count, dotR, color, w) {
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    const x = cx + Math.cos(angle) * circleR;
    const y = cy + Math.sin(angle) * circleR;
    drawFilledCircle(rows, x, y, dotR, color, w);
  }
}

function generateIcon(size) {
  const w = size;
  // Init rows: each row is width*3 bytes (RGB)
  const rows = [];
  for (let y = 0; y < w; y++) {
    const row = new Uint8Array(w * 3);
    // Fill background
    for (let x = 0; x < w; x++) {
      row[x * 3]     = BG[0];
      row[x * 3 + 1] = BG[1];
      row[x * 3 + 2] = BG[2];
    }
    rows.push(row);
  }

  const cx = w / 2;
  const cy = w / 2;

  // Outer ring (gold, thin)
  const outerR = w * 0.44;
  const innerR = outerR - w * 0.025;
  // Draw ring as two filled circles (outer - inner)
  drawFilledCircle(rows, cx, cy, outerR, GOLD, w);
  drawFilledCircle(rows, cx, cy, innerR, BG, w);

  // Inner filled circle (slightly darker gold tint)
  drawFilledCircle(rows, cx, cy, w * 0.36, [25, 45, 75], w); // deeper blue fill

  // Decorative dots on ring (6 dots)
  drawDots(rows, cx, cy, outerR - w * 0.0125, 6, w * 0.025, GOLD, w);

  // Letter "A"
  drawLetterA(rows, cx, cy, w * 0.40, WHITE, w);

  // Build raw image data with PNG filter byte (0 = None) per row
  const rawRows = [];
  for (let y = 0; y < w; y++) {
    rawRows.push(Buffer.concat([Buffer.from([0]), Buffer.from(rows[y])]));
  }
  const raw = Buffer.concat(rawRows);
  const compressed = deflateSync(raw, { level: 6 });

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = makeIHDR(w, w);
  const idat = chunk('IDAT', compressed);
  const iend = chunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdr, idat, iend]);
}

mkdirSync(STATIC_DIR, { recursive: true });

console.log('Generating icon-192.png...');
writeFileSync(join(STATIC_DIR, 'icon-192.png'), generateIcon(192));
console.log('Generating icon-512.png...');
writeFileSync(join(STATIC_DIR, 'icon-512.png'), generateIcon(512));
console.log('Done! Icons written to static/');
