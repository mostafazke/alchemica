/**
 * sound.ts — Web Audio SFX synthesis.
 *
 * All functions are iOS-safe (lazy AudioContext, ctx.resume() before scheduling)
 * and fail silently if Web Audio is unavailable.
 * Callers guard with get(soundMuted) — these functions are mute-unaware.
 */

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  try {
    const w = window as Window & { webkitAudioContext?: typeof AudioContext };
    if (typeof AudioContext === 'undefined' && typeof w.webkitAudioContext === 'undefined') return null;
    if (!audioCtx) {
      const Ctx = w.webkitAudioContext ?? AudioContext;
      audioCtx = new Ctx();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

function withCtx(fn: (ctx: AudioContext, now: number) => void): void {
  try {
    const ctx = getCtx();
    if (!ctx) return;
    ctx.resume().then(() => fn(ctx, ctx.currentTime)).catch(() => {});
  } catch {}
}

/** C5 → E5 two-note chime — achievement badge unlock */
export function playChime(): void {
  withCtx((ctx, now) => {
    const notes = [
      { freq: 523.25, start: now },
      { freq: 659.25, start: now + 0.13 },
    ];
    for (const { freq, start } of notes) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.4, start + 0.01);
      gain.gain.linearRampToValueAtTime(0, start + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.14);
    }
  });
}

/** Two bubble-pop tones (~300ms) — valid reaction, known element */
export function playReactionSuccess(): void {
  withCtx((ctx, now) => {
    for (let i = 0; i < 2; i++) {
      const t = now + i * 0.11;
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(480 - i * 60, t);
      osc.frequency.exponentialRampToValueAtTime(200, t + 0.1);
      filter.type = 'bandpass';
      filter.frequency.value = 400;
      filter.Q.value = 2;
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.13);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.15);
    }
  });
}

/** 5-note ascending major fanfare (~1.1s) — new element discovered */
export function playDiscovery(): void {
  withCtx((ctx, now) => {
    // C5 E5 G5 B5 C6
    const notes = [523.25, 659.25, 783.99, 987.77, 1046.5];
    notes.forEach((freq, i) => {
      const t = now + i * 0.22;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.38, t + 0.02);
      gain.gain.linearRampToValueAtTime(0.12, t + 0.16);
      gain.gain.linearRampToValueAtTime(0, t + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.24);
      // octave harmonic for richness
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.value = freq * 2;
      gain2.gain.setValueAtTime(0, t);
      gain2.gain.linearRampToValueAtTime(0.08, t + 0.01);
      gain2.gain.linearRampToValueAtTime(0, t + 0.17);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(t);
      osc2.stop(t + 0.19);
    });
  });
}

/** Low-frequency sawtooth thud (~200ms) — no reaction / invalid combo */
export function playFailure(): void {
  withCtx((ctx, now) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.exponentialRampToValueAtTime(55, now + 0.15);
    gain.gain.setValueAtTime(0.55, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.22);
  });
}

/** Upward frequency sweep (~300ms) — combo multiplier increases */
export function playComboUp(): void {
  withCtx((ctx, now) => {
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(900, now + 0.27);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, now);
    filter.frequency.exponentialRampToValueAtTime(2000, now + 0.27);
    gain.gain.setValueAtTime(0.28, now);
    gain.gain.linearRampToValueAtTime(0.32, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.32);
  });
}

/** High-frequency tick (~70ms) — element placed into slot */
export function playSlotPlace(): void {
  withCtx((ctx, now) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 1100;
    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.07);
  });
}

/** Short downward sweep (~85ms) — slot cleared */
export function playSlotClear(): void {
  withCtx((ctx, now) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(780, now);
    osc.frequency.exponentialRampToValueAtTime(210, now + 0.07);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  });
}

/** Bell-like A5 ping (~300ms) — hint button tapped */
export function playHint(): void {
  withCtx((ctx, now) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 880; // A5
    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  });
}

/** Extended fanfare with harmony (~1.65s) — daily challenge completed */
export function playDailyComplete(): void {
  withCtx((ctx, now) => {
    // melody: G4 C5 E5 C5 E5 G5 E5 G5 C6
    const melody  = [392.0,  523.25, 659.25, 523.25, 659.25, 783.99, 659.25, 783.99, 1046.5];
    // harmony: E4 G4 C5 G4 C5 E5 C5 E5 G5
    const harmony = [329.63, 392.0,  523.25, 392.0,  523.25, 659.25, 523.25, 659.25, 783.99];
    melody.forEach((freq, i) => {
      const t = now + i * 0.18;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.35, t + 0.02);
      gain.gain.linearRampToValueAtTime(0.1, t + 0.14);
      gain.gain.linearRampToValueAtTime(0, t + 0.19);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.2);
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.value = harmony[i];
      gain2.gain.setValueAtTime(0, t);
      gain2.gain.linearRampToValueAtTime(0.14, t + 0.02);
      gain2.gain.linearRampToValueAtTime(0.04, t + 0.14);
      gain2.gain.linearRampToValueAtTime(0, t + 0.19);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(t);
      osc2.stop(t + 0.2);
    });
  });
}
