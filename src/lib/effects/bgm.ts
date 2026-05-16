/**
 * bgm.ts — Background music manager using HTMLAudioElement.
 * Simpler than Web Audio for looping music; handles mute/volume without
 * requiring a user-gesture-resumed AudioContext.
 */

let el: HTMLAudioElement | null = null;
let _muted = false;
let _wasPlayingBeforeHide = false;
const VOLUME = 0.35;

// Pause BGM when the app/tab goes to background; resume when it returns.
// Works for both browser tabs and Capacitor WebView on Android/iOS.
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      _wasPlayingBeforeHide = !!el && !el.paused;
      el?.pause();
    } else if (_wasPlayingBeforeHide) {
      el?.play().catch(() => {});
    }
  });
}

export function playBgm(src: string): void {
  stopBgm();
  try {
    el = new Audio(src);
    el.loop = true;
    el.volume = _muted ? 0 : VOLUME;
    el.play().catch(() => {});
  } catch {}
}

export function stopBgm(): void {
  if (!el) return;
  el.pause();
  el.src = '';
  el = null;
}

export function setBgmMuted(muted: boolean): void {
  _muted = muted;
  if (el) el.volume = muted ? 0 : VOLUME;
}
