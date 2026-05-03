/**
 * bgm.ts — Background music manager using HTMLAudioElement.
 * Simpler than Web Audio for looping music; handles mute/volume without
 * requiring a user-gesture-resumed AudioContext.
 */

let el: HTMLAudioElement | null = null;
let _muted = false;
const VOLUME = 0.35;

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
