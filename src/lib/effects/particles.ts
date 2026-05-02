/**
 * Canvas particle system — ported from alchemica.html and improved:
 * - Object pooling: pre-allocated pool, no GC churn from splice/push
 * - Performance scaling: count scales with navigator.hardwareConcurrency
 * - Visibility pause: stops RAF loop when tab is hidden
 * - Accepts canvas element as parameter (no hard-coded DOM query)
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  decay: number;
  size: number;
  color: string;
  type: 'burst' | 'bubble' | 'fail';
  active: boolean;
}

const MAX_PARTICLES = 120;
const pool: Particle[] = Array.from({ length: MAX_PARTICLES }, () => ({
  x: 0, y: 0, vx: 0, vy: 0, life: 0,
  decay: 0.02, size: 3, color: '#4af0c0',
  type: 'burst' as const, active: false,
}));

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let rafId = 0;
let paused = false;

// Scale particle count based on available CPU cores (0.5× on 2-core, 1× on 4-core, 2× on 8-core)
const perfMultiplier = Math.max(0.5, Math.min(2, (navigator.hardwareConcurrency ?? 4) / 4));

const BURST_COLORS = ['#4af0c0', '#ffe44a', '#ff6b6b', '#5ab4ff', '#d05aff', '#96c84a'];

export function initParticles(canvasEl: HTMLCanvasElement): void {
  canvas = canvasEl;
  ctx = canvas.getContext('2d');

  document.addEventListener('visibilitychange', () => {
    paused = document.hidden;
    if (!paused && pool.some((p) => p.active)) {
      scheduleAnimate();
    }
  });
}

function acquireParticle(): Particle | null {
  return pool.find((p) => !p.active) ?? null;
}

export function triggerSuccessParticles(cx: number, cy: number): void {
  const burstCount = Math.round(60 * perfMultiplier);
  const bubbleCount = Math.round(20 * perfMultiplier);

  for (let i = 0; i < burstCount; i++) {
    const p = acquireParticle();
    if (!p) break;
    const angle = Math.random() * Math.PI * 2;
    const speed = 1.5 + Math.random() * 4;
    p.x = cx; p.y = cy;
    p.vx = Math.cos(angle) * speed;
    p.vy = Math.sin(angle) * speed - 2;
    p.life = 1;
    p.decay = 0.015 + Math.random() * 0.02;
    p.size = 2 + Math.random() * 5;
    p.color = BURST_COLORS[Math.floor(Math.random() * BURST_COLORS.length)];
    p.type = 'burst';
    p.active = true;
  }

  for (let i = 0; i < bubbleCount; i++) {
    const p = acquireParticle();
    if (!p) break;
    p.x = cx + (Math.random() - 0.5) * 80;
    p.y = cy + 30;
    p.vx = (Math.random() - 0.5);
    p.vy = -(1 + Math.random() * 2);
    p.life = 1;
    p.decay = 0.008 + Math.random() * 0.01;
    p.size = 3 + Math.random() * 6;
    p.color = '#4af0c040';
    p.type = 'bubble';
    p.active = true;
  }

  scheduleAnimate();
}

export function triggerFailParticles(cx: number, cy: number): void {
  const count = Math.round(20 * perfMultiplier);

  for (let i = 0; i < count; i++) {
    const p = acquireParticle();
    if (!p) break;
    p.x = cx + (Math.random() - 0.5) * 40;
    p.y = cy;
    p.vx = (Math.random() - 0.5) * 2;
    p.vy = (Math.random() - 0.5) * 2;
    p.life = 1;
    p.decay = 0.03;
    p.size = 2 + Math.random() * 3;
    p.color = '#ff405070';
    p.type = 'fail';
    p.active = true;
  }

  scheduleAnimate();
}

function scheduleAnimate(): void {
  cancelAnimationFrame(rafId);
  if (!paused) {
    rafId = requestAnimationFrame(animate);
  }
}

function animate(): void {
  if (!canvas || !ctx || paused) return;

  // Resize canvas to match its parent container
  const parent = canvas.parentElement;
  if (parent) {
    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let anyActive = false;

  for (const p of pool) {
    if (!p.active) continue;

    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.08; // gravity
    p.vx *= 0.98; // drag
    p.life -= p.decay;

    if (p.life <= 0) {
      p.active = false;
      continue;
    }

    anyActive = true;

    ctx.save();
    ctx.globalAlpha = Math.max(0, p.life);

    if (p.type === 'bubble') {
      ctx.strokeStyle = '#4af0c0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  if (anyActive) {
    rafId = requestAnimationFrame(animate);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

