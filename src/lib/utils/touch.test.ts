/**
 * touch.test.ts — Unit tests for haptic utility functions
 * Tests the @capacitor/haptics upgrade (Plan 09-03).
 *
 * Runs in Vitest `server` project (node environment).
 * Mocks @capacitor/core and @capacitor/haptics before importing touch.ts.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock @capacitor/core BEFORE importing touch.ts
vi.mock('@capacitor/core', () => ({
  Capacitor: { isNativePlatform: vi.fn(() => false) }
}));

vi.mock('@capacitor/haptics', () => ({
  Haptics: {
    impact: vi.fn().mockResolvedValue(undefined),
    notification: vi.fn().mockResolvedValue(undefined),
  },
  ImpactStyle: { Light: 'LIGHT' },
  NotificationType: { Success: 'SUCCESS', Error: 'ERROR' },
}));

import { hapticSuccess, hapticFail, haptic } from './touch.js';
import { Capacitor } from '@capacitor/core';
import { Haptics } from '@capacitor/haptics';

// ─── Web path (isNativePlatform = false) ─────────────────────────────────────

describe('haptic utilities — web path', () => {
  let vibrateSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.mocked(Capacitor.isNativePlatform).mockReturnValue(false);
    vi.mocked(Haptics.notification).mockClear();
    vi.mocked(Haptics.impact).mockClear();

    // navigator.vibrate is not available in node — define a spy
    vibrateSpy = vi.fn();
    Object.defineProperty(navigator, 'vibrate', {
      value: vibrateSpy,
      configurable: true,
    });
  });

  it('hapticSuccess calls navigator.vibrate(50) on web', async () => {
    await hapticSuccess();
    expect(vibrateSpy).toHaveBeenCalledWith(50);
    expect(Haptics.notification).not.toHaveBeenCalled();
  });

  it('hapticFail calls navigator.vibrate([20,30,20]) on web', async () => {
    await hapticFail();
    expect(vibrateSpy).toHaveBeenCalledWith([20, 30, 20]);
    expect(Haptics.notification).not.toHaveBeenCalled();
  });

  it('haptic calls navigator.vibrate with default pattern 30 on web', async () => {
    await haptic();
    expect(vibrateSpy).toHaveBeenCalledWith(30);
    expect(Haptics.impact).not.toHaveBeenCalled();
  });

  it('haptic passes custom pattern to navigator.vibrate on web', async () => {
    await haptic([10, 20, 10]);
    expect(vibrateSpy).toHaveBeenCalledWith([10, 20, 10]);
  });
});

// ─── Native path (isNativePlatform = true) ───────────────────────────────────

describe('haptic utilities — native path', () => {
  beforeEach(() => {
    vi.mocked(Capacitor.isNativePlatform).mockReturnValue(true);
    vi.mocked(Haptics.notification).mockClear();
    vi.mocked(Haptics.impact).mockClear();
  });

  it('hapticSuccess calls Haptics.notification with Success type on native', async () => {
    await hapticSuccess();
    expect(Haptics.notification).toHaveBeenCalledWith({ type: 'SUCCESS' });
  });

  it('hapticFail calls Haptics.notification with Error type on native', async () => {
    await hapticFail();
    expect(Haptics.notification).toHaveBeenCalledWith({ type: 'ERROR' });
  });

  it('haptic calls Haptics.impact with Light style on native', async () => {
    await haptic();
    expect(Haptics.impact).toHaveBeenCalledWith({ style: 'LIGHT' });
  });
});

// ─── Error path (no throw) ───────────────────────────────────────────────────

describe('haptic utilities — error path', () => {
  beforeEach(() => {
    vi.mocked(Capacitor.isNativePlatform).mockReturnValue(true);
    vi.mocked(Haptics.notification).mockRejectedValue(new Error('Hardware unavailable'));
    vi.mocked(Haptics.impact).mockRejectedValue(new Error('Hardware unavailable'));
  });

  it('hapticSuccess does not throw when Haptics.notification rejects', async () => {
    await expect(hapticSuccess()).resolves.toBeUndefined();
  });

  it('hapticFail does not throw when Haptics.notification rejects', async () => {
    await expect(hapticFail()).resolves.toBeUndefined();
  });

  it('haptic does not throw when Haptics.impact rejects', async () => {
    await expect(haptic()).resolves.toBeUndefined();
  });
});
