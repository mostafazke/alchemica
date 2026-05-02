# Phase 9: Capacitor Native Shell — Pattern Map

**Mapped:** 2026-05-02
**Files analyzed:** 7 new/modified files
**Analogs found:** 5 / 7

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `capacitor.config.ts` | config | request-response | `vite.config.ts` | role-match (both are TS config exports with plugin objects) |
| `src/lib/utils/touch.ts` | utility | event-driven | `src/lib/utils/share.ts` | role-match (async platform API with fallback) |
| `android/app/src/main/AndroidManifest.xml` | config | — | `svelte.config.js` (adapter config) | partial (both are platform output configs) |
| `android/app/build.gradle` | config | — | no analog | no analog |
| `android/local.properties` | config | — | `.env` pattern in `.gitignore` | partial (gitignored secrets file) |
| `package.json` (modify) | config | — | `package.json` (existing scripts) | exact (append to existing scripts block) |
| `.gitignore` (modify) | config | — | `.gitignore` (existing) | exact (append new ignore patterns) |

---

## Pattern Assignments

### `capacitor.config.ts` (new — config, app identity)

**Analog:** `vite.config.ts`

The project's config convention is TypeScript files that import a type, define a typed `const`, and export it as default. Both `vite.config.ts` and `svelte.config.js` follow this pattern. `capacitor.config.ts` should match exactly.

**Config export pattern** (`vite.config.ts` lines 1–8):
```typescript
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';
// ...
export default defineConfig({
  plugins: [ ... ],
});
```

**Target pattern for `capacitor.config.ts`** (from RESEARCH.md canonical config):
```typescript
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.alchemica.app',    // D-01 — permanent, Play Store locked
  appName: 'Alchemica',         // D-02, D-03
  webDir: 'build',              // D-10 — adapter-static outputs to build/ (svelte.config.js line 10)

  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#0d1b2e',   // matches vite.config.ts theme_color line 18
      androidScaleType: 'CENTER_CROP',
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0d1b2e',
      overlaysWebView: false,
    },
  },
};

export default config;
```

**webDir alignment:** `svelte.config.js` lines 10–12 show `adapter({ fallback: 'index.html' })` with no explicit `outDir`, which means SvelteKit adapter-static uses its default output directory `build/`. This confirms `webDir: 'build'` is correct (D-10).

**Theme color source:** `vite.config.ts` lines 18–19 show `theme_color: '#0d1b2e'` and `background_color: '#0d1b2e'` — use the same value in `capacitor.config.ts` `backgroundColor` for visual consistency.

**Orientation note (D-05 / Pitfall 3):** There is no `screenOrientation` key in `CapacitorConfig`. Do NOT add it to this file — it belongs in `AndroidManifest.xml` only.

---

### `src/lib/utils/touch.ts` (modify — utility, event-driven)

**Analog:** `src/lib/utils/share.ts`

`share.ts` is the closest structural match: an async utility that checks for native API availability (`navigator.share`), tries it, and falls back to a secondary API (`navigator.clipboard`). The `touch.ts` upgrade follows the same structure: check `Capacitor.isNativePlatform()`, use native API, fall back to `navigator.vibrate`.

**Platform-check + fallback pattern** (`src/lib/utils/share.ts` lines 27–44):
```typescript
// Web Share API (mobile browsers, Chrome Android, Safari iOS)
if (navigator.share) {
  try {
    await navigator.share({ title: 'Alchemica', text, url });
    return { ok: true, method: 'share' };
  } catch {
    // User cancelled or permission denied — fall through to clipboard
  }
}

// Clipboard API fallback
if (navigator.clipboard?.writeText) {
  try {
    await navigator.clipboard.writeText(`${text} ${url}`);
    return { ok: true, method: 'clipboard' };
  } catch {
    // Clipboard unavailable
  }
}
```

**Current `touch.ts` functions to upgrade** (lines 9–33):
```typescript
// CURRENT — synchronous, navigator.vibrate only
export function hapticSuccess(): void {
  try {
    if ('vibrate' in navigator) navigator.vibrate(50);
  } catch {
    // silently ignore — vibration not supported or blocked
  }
}

export function hapticFail(): void {
  try {
    if ('vibrate' in navigator) navigator.vibrate([20, 30, 20]);
  } catch {
    // silently ignore
  }
}

export function haptic(pattern: number | number[] = 30): void {
  try {
    if ('vibrate' in navigator) navigator.vibrate(pattern);
  } catch {
    // silently ignore
  }
}
```

**Target pattern for upgraded functions** (D-08, D-09):
```typescript
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';

export async function hapticSuccess(): Promise<void> {
  try {
    if (Capacitor.isNativePlatform()) {
      await Haptics.notification({ type: NotificationType.Success });
    } else if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  } catch {
    // silently ignore — vibration not supported or blocked
  }
}

export async function hapticFail(): Promise<void> {
  try {
    if (Capacitor.isNativePlatform()) {
      await Haptics.notification({ type: NotificationType.Error });
    } else if ('vibrate' in navigator) {
      navigator.vibrate([20, 30, 20]);
    }
  } catch {
    // silently ignore
  }
}

export async function haptic(pattern: number | number[] = 30): Promise<void> {
  try {
    if (Capacitor.isNativePlatform()) {
      await Haptics.impact({ style: ImpactStyle.Light });
    } else if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  } catch {
    // silently ignore
  }
}
```

**Non-breaking callers:** `hapticSuccess`, `hapticFail`, `haptic` change from `void` to `Promise<void>`. All callers use fire-and-forget (no `await`). No callers need changes.

**Preserve non-haptics code intact:** `touch.ts` lines 35–163 (`LongPressOptions`, `createLongPress`, `SwipeOptions`, `createSwipeHandler`) are unchanged — do not touch them.

---

### `android/app/src/main/AndroidManifest.xml` (modify after `npx cap add android`)

**Analog:** None — generated file, edit is a targeted attribute addition.

**Orientation lock change** (D-05, RESEARCH.md Pitfall 3):
Find the `<activity>` element in the generated manifest and add `android:screenOrientation="sensorLandscape"`. The full attribute set for Capacitor 8 must include `density` in `configChanges` (RESEARCH.md Code Examples):

```xml
<activity
  android:name="io.alchemica.app.MainActivity"
  android:screenOrientation="sensorLandscape"
  android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode|density"
  ...>
```

`sensorLandscape` allows landscape-left and landscape-right based on sensor, matching the PWA manifest `orientation: "landscape"` in `vite.config.ts` line 28.

---

### `android/app/build.gradle` (modify after `npx cap add android`)

**Analog:** None — Groovy Gradle file with no TypeScript/JS equivalent in this project.

**Signing config pattern** (D-06, D-07 — from RESEARCH.md Keystore section):
```groovy
// At top of file, before android {} block:
def localProps = new Properties()
def localPropsFile = rootProject.file('local.properties')
if (localPropsFile.exists()) {
    localPropsFile.withInputStream { localProps.load(it) }
}

android {
    // ... existing generated config ...

    signingConfigs {
        release {
            storeFile     file(localProps['RELEASE_KEYSTORE_PATH'] ?: '')
            storePassword localProps['RELEASE_KEYSTORE_PASSWORD'] ?: ''
            keyAlias      localProps['RELEASE_KEY_ALIAS']          ?: ''
            keyPassword   localProps['RELEASE_KEY_PASSWORD']       ?: ''
        }
    }

    buildTypes {
        release {
            signingConfig    signingConfigs.release
            minifyEnabled    false
            proguardFiles    getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

**Security constraint:** Never hardcode passwords in this file. Always load from `local.properties` via the `Properties` loader above.

---

### `android/local.properties` (new — gitignored secrets)

**Analog:** `.env` pattern (gitignored secrets). The project's `.gitignore` already has `.env` on line 77 as the established pattern for gitignored secrets.

**Format** (D-07):
```properties
# android/local.properties
# GENERATED — DO NOT COMMIT
sdk.dir=C\:\\Users\\mosta\\AppData\\Local\\Android\\Sdk

# Release signing secrets
RELEASE_KEYSTORE_PATH=alchemica-release-key.jks
RELEASE_KEYSTORE_PASSWORD=<set-at-keytool-time>
RELEASE_KEY_ALIAS=alchemica-key
RELEASE_KEY_PASSWORD=<set-at-keytool-time>

# Optional: point Gradle to Android Studio's JBR 21 instead of system Java 17
org.gradle.java.home=C:/Program Files/Android/Android Studio/jbr
```

---

### `package.json` (modify — scripts block)

**Analog:** `package.json` (existing scripts, lines 6–18) — exact match, append to existing scripts object.

**Existing scripts block** (`package.json` lines 6–18):
```json
"scripts": {
  "dev": "vite dev --host",
  "build": "vite build",
  "preview": "vite preview",
  "prepare": "svelte-kit sync || echo ''",
  "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
  "check:watch": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch",
  "lint": "prettier --check . && eslint .",
  "format": "prettier --write .",
  "test:unit": "vitest",
  "test": "npm run test:unit -- --run && npm run test:e2e",
  "test:e2e": "playwright install && playwright test"
}
```

**New scripts to add** (D-11):
```json
"cap:sync":    "npm run build && npx cap sync",
"cap:android": "npm run cap:sync && npx cap open android",
"cap:build":   "npm run build && npx cap sync && cd android && ./gradlew bundleRelease"
```

**Windows note:** The `&&` chaining in `cap:build` works when npm runs via Git Bash (the default on Windows). If running in pure PowerShell, `./gradlew` must be `gradlew.bat`. Document this in the plan; do not change the script itself (Git Bash is standard for npm scripts on Windows).

---

### `.gitignore` (modify — append Capacitor Android entries)

**Analog:** `.gitignore` (existing) — exact match, append new section after line 174.

**Current last section** (`.gitignore` lines 162–174):
```gitignore
# Vite
vite.config.js.timestamp-*
vite.config.ts.timestamp-*
# Playwright
test-results
# Paraglide
src/lib/paraglide
project.inlang/cache/
# SQLite
*.db
```

**Entries to append** (D-07, RESEARCH.md gitignore strategy):
```gitignore
# Capacitor Android — secrets and build artifacts (android/ directory is committed)
android/local.properties
android/.gradle/
android/app/release/
android/build/
android/*.jks
assets/icon-foreground.png
assets/icon-background.png
assets/splash.png
assets/splash-dark.png
```

**Rationale:** Commit `android/` to preserve the Gradle signing config and `AndroidManifest.xml` orientation lock across `npx cap sync` runs. Only gitignore secrets (`local.properties`, `*.jks`) and build output directories.

---

### `src/lib/utils/touch.test.ts` (new — unit test, Wave 0 gap)

**Analog:** No existing unit tests in the project (`src/**/*.test.ts` — no files found). Use the project's test framework configuration in `vite.config.ts` lines 85–94 as the structural reference.

**Test framework config** (`vite.config.ts` lines 85–94):
```typescript
{
  extends: './vite.config.ts',
  test: {
    name: 'server',
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,ts}'],
    exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
  }
}
```

`touch.test.ts` is a plain Node environment test (no browser DOM needed for mocking `Capacitor.isNativePlatform()`). It belongs in the `server` project (non-svelte, node environment).

**Test structure to create:**
```typescript
// src/lib/utils/touch.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock @capacitor/core before importing touch.ts
vi.mock('@capacitor/core', () => ({
  Capacitor: { isNativePlatform: vi.fn(() => false) }
}));
vi.mock('@capacitor/haptics', () => ({
  Haptics: {
    impact: vi.fn(),
    notification: vi.fn(),
  },
  ImpactStyle: { Light: 'LIGHT' },
  NotificationType: { Success: 'SUCCESS', Error: 'ERROR' },
}));

import { hapticSuccess, hapticFail, haptic } from './touch.js';
import { Capacitor } from '@capacitor/core';
import { Haptics } from '@capacitor/haptics';

describe('haptic utilities — web path', () => {
  beforeEach(() => {
    vi.mocked(Capacitor.isNativePlatform).mockReturnValue(false);
    // navigator.vibrate is not available in node; set up a spy
    Object.defineProperty(navigator, 'vibrate', {
      value: vi.fn(),
      configurable: true,
    });
  });

  it('hapticSuccess calls navigator.vibrate(50) on web', async () => {
    await hapticSuccess();
    expect(navigator.vibrate).toHaveBeenCalledWith(50);
    expect(Haptics.notification).not.toHaveBeenCalled();
  });
});

describe('haptic utilities — native path', () => {
  beforeEach(() => {
    vi.mocked(Capacitor.isNativePlatform).mockReturnValue(true);
  });

  it('hapticSuccess calls Haptics.notification on native', async () => {
    await hapticSuccess();
    expect(Haptics.notification).toHaveBeenCalledWith({ type: 'SUCCESS' });
  });

  it('hapticFail calls Haptics.notification with Error type on native', async () => {
    await hapticFail();
    expect(Haptics.notification).toHaveBeenCalledWith({ type: 'ERROR' });
  });

  it('haptic calls Haptics.impact on native', async () => {
    await haptic();
    expect(Haptics.impact).toHaveBeenCalledWith({ style: 'LIGHT' });
  });
});
```

---

## Shared Patterns

### TypeScript Config Export Pattern
**Source:** `vite.config.ts` (lines 1–8) and `svelte.config.js` (lines 1–17)
**Apply to:** `capacitor.config.ts`
```typescript
// Pattern: import type, declare typed const, export default
import type { CapacitorConfig } from '@capacitor/cli';
const config: CapacitorConfig = { ... };
export default config;
```

### Platform API with Fallback Pattern
**Source:** `src/lib/utils/share.ts` (lines 26–44)
**Apply to:** `src/lib/utils/touch.ts` (haptic functions)

The canonical project pattern for optional native APIs:
1. Guard with capability check (`if (Capacitor.isNativePlatform())` or `if (navigator.share)`)
2. Try primary API in `try/catch`
3. Fall through to secondary API on failure or unavailability
4. Silent failure at outer catch — never throw to caller

### Silent Error Suppression Pattern
**Source:** `src/lib/utils/touch.ts` (lines 12–14, 21–23, 30–32)
**Apply to:** Upgraded haptic functions in `touch.ts`
```typescript
} catch {
  // silently ignore — vibration not supported or blocked
}
```
This pattern is already established in `touch.ts`. Preserve the same comment style in the upgraded functions.

### Theme Color Consistency
**Source:** `vite.config.ts` (lines 18–19)
**Apply to:** `capacitor.config.ts` plugin configs
```typescript
theme_color: '#0d1b2e',
background_color: '#0d1b2e',
```
Use `#0d1b2e` as `backgroundColor` in both `SplashScreen` and `StatusBar` plugin configs.

---

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `android/app/build.gradle` | config | — | No Groovy/Gradle files exist in this JavaScript project |
| `android/local.properties` (as a type) | config | — | No existing gitignored properties file with key=value secrets format |

---

## Metadata

**Analog search scope:** `src/lib/utils/`, `src/lib/stores/`, project root config files
**Files scanned:** `touch.ts`, `share.ts`, `storage.ts`, `package.json`, `.gitignore`, `vite.config.ts`, `svelte.config.js`, `playwright.config.ts`
**Pattern extraction date:** 2026-05-02
