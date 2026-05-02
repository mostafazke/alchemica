/**
 * sound.ts — Web Audio chime utility.
 *
 * Headless — no imports from project files.
 * iOS-safe: AudioContext created lazily inside user-gesture callstack.
 * Fails silently when Web Audio API is unavailable.
 * Per D-16, D-17, D-18, PROG-06.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof AudioContext === 'undefined' && typeof (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext === 'undefined') {
    return null;
  }
  if (!audioCtx) {
    const Ctx = (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext ?? AudioContext;
    audioCtx = new Ctx();
  }
  return audioCtx;
}

/**
 * Play a short two-note ascending chime (C5 → E5) using Web Audio oscillators.
 * Called by Phase 8 achievement unlock handler alongside the toast.
 * iOS-safe: resumes suspended context, defers scheduling until after resume.
 */
export function playChime(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    ctx.resume().then(() => {
      const now = ctx.currentTime;

      const notes: Array<{ freq: number; start: number }> = [
        { freq: 523.25, start: now },        // C5
        { freq: 659.25, start: now + 0.13 }, // E5
      ];

      for (const { freq, start } of notes) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.value = freq;

        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.4, start + 0.01);   // fast attack
        gain.gain.linearRampToValueAtTime(0, start + 0.12);     // decay

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.13);
      }
    }).catch(() => {
      // resume() rejected — audio unavailable, fail silently
    });
  } catch {
    // Web Audio API unavailable or unexpected error — fail silently
  }
}
