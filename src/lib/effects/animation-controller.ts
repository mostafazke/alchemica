/**
 * AnimationController — single-canvas overlay animation service.
 *
 * Wraps the existing particle pool logic from particles.ts with named methods
 * matching the Phase 1 animation contracts. One instance per game session,
 * shared via Svelte context ('animationController').
 *
 * Preserves:
 * - 120-particle pool with object pooling (no GC churn)
 * - perfMultiplier scaling by navigator.hardwareConcurrency
 * - Visibility pause (stops RAF when tab is hidden)
 * - Resize-to-parent in animate loop
 *
 * Color palette: warm gold / amber / brass (replaces teal / neon from particles.ts)
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
  type: 'burst' | 'bubble' | 'fail' | 'flash' | 'shimmer';
  active: boolean;
}

const MAX_PARTICLES = 120;

// Scale particle count based on available CPU cores (0.5× on 2-core, 1× on 4-core, 2× on 8-core)
const perfMultiplier = Math.max(0.5, Math.min(2, (navigator.hardwareConcurrency ?? 4) / 4));

// Jewel-tone brass / gold / ember — visible on cream/parchment background
const BURST_COLORS = [
  '#c8880a', // brass-700 (primary accent)
  '#d4980a', // gold-400 (darkened)
  '#8b3a20', // ember-700 (danger)
  '#e8a818', // brass-500 (mid gold)
  '#c8880a', // brass-700 (repeat to weight)
  '#d4980a', // gold-400 (repeat)
];

export class AnimationController {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private pool: Particle[];
  private particleRafId = 0;  // particle loop RAF handle
  private effectRafId = 0;    // screenFlash / radialShimmer RAF handle
  private paused = false;
  private onVisibilityChange: () => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;

    this.pool = Array.from({ length: MAX_PARTICLES }, () => ({
      x: 0, y: 0, vx: 0, vy: 0, life: 0,
      decay: 0.02, size: 3, color: '#c8880a',
      type: 'burst' as const, active: false,
    }));

    this.onVisibilityChange = () => {
      this.paused = document.hidden;
      if (!this.paused && this.pool.some((p) => p.active)) {
        this.scheduleAnimate();
      }
    };
    document.addEventListener('visibilitychange', this.onVisibilityChange);
  }

  /** Trigger on successful reaction — warm burst + rising bubbles */
  successBurst(cx: number, cy: number): void {
    const burstCount = Math.round(60 * perfMultiplier);
    const bubbleCount = Math.round(20 * perfMultiplier);

    for (let i = 0; i < burstCount; i++) {
      const p = this.acquire();
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
      const p = this.acquire();
      if (!p) break;
      p.x = cx + (Math.random() - 0.5) * 80;
      p.y = cy + 30;
      p.vx = (Math.random() - 0.5);
      p.vy = -(1 + Math.random() * 2);
      p.life = 1;
      p.decay = 0.008 + Math.random() * 0.01;
      p.size = 3 + Math.random() * 6;
      p.color = '#c8880a'; // bubble ring color (drawn via strokeStyle, not fillStyle)
      p.type = 'bubble';
      p.active = true;
    }

    this.scheduleAnimate();
  }

  /** Trigger on failed reaction — single warm particle rises and fades */
  failureParticle(cx: number, cy: number): void {
    const p = this.acquire();
    if (!p) return;
    p.x = cx + (Math.random() - 0.5) * 20;
    p.y = cy;
    p.vx = (Math.random() - 0.5) * 0.6;
    p.vy = -2.5;
    p.life = 1;
    p.decay = 0.012;  // ~800ms lifetime at 60fps
    p.size = 4;
    p.color = 'rgba(120, 80, 40, 0.45)';
    p.type = 'fail';
    p.active = true;

    this.scheduleAnimate();
  }

  /** Screen-edge flash — radial gradient pulse inward from edges over ~200ms */
  screenFlash(color: string, opacity: number): void {
    const w = this.canvas.width || this.canvas.parentElement?.offsetWidth || 0;
    const h = this.canvas.height || this.canvas.parentElement?.offsetHeight || 0;
    if (!w || !h) return;

    let alpha = opacity;
    const decay = opacity / 12; // 12 frames ≈ 200ms at 60fps

    const drawFrame = () => {
      if (alpha <= 0) return;

      // Edge flash: four corner-sourced gradients
      const corners: [number, number][] = [[0, 0], [w, 0], [0, h], [w, h]];
      for (const [ox, oy] of corners) {
        const grad = this.ctx.createRadialGradient(ox, oy, 0, ox, oy, Math.max(w, h) * 0.6);
        grad.addColorStop(0, this.hexToRgba(color, alpha));
        grad.addColorStop(1, this.hexToRgba(color, 0));
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(0, 0, w, h);
      }

      alpha -= decay;
      this.effectRafId = requestAnimationFrame(drawFrame);
    };

    cancelAnimationFrame(this.effectRafId);
    this.effectRafId = requestAnimationFrame(drawFrame);
  }

  /** Radial shimmer — expanding warm gradient from center, ~180ms */
  radialShimmer(cx: number, cy: number): void {
    const maxRadius = 150;
    let radius = 20;
    const step = (maxRadius - 20) / 11; // 11 frames ≈ 180ms at 60fps

    const drawFrame = () => {
      if (radius > maxRadius) return;

      const alpha = (1 - (radius - 20) / (maxRadius - 20)) * 0.35;
      const grad = this.ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      grad.addColorStop(0, `rgba(200, 136, 10, ${alpha})`);  // brass-700
      grad.addColorStop(0.6, `rgba(200, 152, 20, ${alpha * 0.5})`); // brass-500
      grad.addColorStop(1, 'rgba(200, 136, 10, 0)');
      this.ctx.fillStyle = grad;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      radius += step;
      this.effectRafId = requestAnimationFrame(drawFrame);
    };

    cancelAnimationFrame(this.effectRafId);
    this.effectRafId = requestAnimationFrame(drawFrame);
  }

  /** Stop all active animations (e.g., when navigating away) */
  stop(): void {
    cancelAnimationFrame(this.particleRafId);
    cancelAnimationFrame(this.effectRafId);
    this.particleRafId = 0;
    this.effectRafId = 0;
    for (const p of this.pool) { p.active = false; }
    if (this.canvas.width && this.canvas.height) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  /** Remove event listeners and stop animations — call from onDestroy in MixingChamber */
  destroy(): void {
    this.stop();
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
  }

  private acquire(): Particle | null {
    return this.pool.find((p) => !p.active) ?? null;
  }

  private scheduleAnimate(): void {
    cancelAnimationFrame(this.particleRafId);
    if (!this.paused) {
      this.particleRafId = requestAnimationFrame(() => this.animate());
    }
  }

  private animate(): void {
    if (this.paused) return;

    // Resize canvas to match its parent container (same as particles.ts)
    const parent = this.canvas.parentElement;
    if (parent) {
      this.canvas.width = parent.offsetWidth;
      this.canvas.height = parent.offsetHeight;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    let anyActive = false;

    for (const p of this.pool) {
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

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.life);

      if (p.type === 'bubble') {
        this.ctx.strokeStyle = p.color; // brass-700 ring
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.stroke();
      } else {
        this.ctx.fillStyle = p.color;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.restore();
    }

    if (anyActive) {
      this.particleRafId = requestAnimationFrame(() => this.animate());
    } else {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  /** Convert hex color string to rgba — used by screenFlash */
  private hexToRgba(hex: string, alpha: number): string {
    const h = hex.replace('#', '');
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
  }
}
