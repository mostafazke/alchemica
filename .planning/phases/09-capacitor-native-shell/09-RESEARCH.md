# Phase 9: Capacitor Native Shell — Research

**Researched:** 2026-05-02
**Domain:** Capacitor Android native wrapper, signing, haptics, PWA coexistence
**Confidence:** HIGH (core stack), MEDIUM (PWA coexistence edge cases)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** App ID: `io.alchemica.app` — permanent, locked for Play Store registration
- **D-02:** Display name: `Alchemica` — matches existing PWA `short_name`
- **D-03:** Capacitor app name in `capacitor.config.ts`: `Alchemica`
- **D-04:** Install in Phase 9: `@capacitor/core`, `@capacitor/cli`, `@capacitor/android`, `@capacitor/splash-screen`, `@capacitor/status-bar`, `@capacitor/haptics`
- **D-05:** Orientation locked to landscape at the native level — set `screenOrientation: "landscape"` in `capacitor.config.ts` (matches PWA manifest `orientation: "landscape"`)
- **D-06:** Generate a release keystore in Phase 9 — full PLAT-02 compliance (signed AAB) from the start
- **D-07:** Keystore stored locally; passwords in `android/local.properties` (gitignored). Never committed. Plan should document the `keytool` command and `build.gradle` signing block.
- **D-08:** Upgrade `src/lib/utils/touch.ts` to use `@capacitor/haptics` — replace `navigator.vibrate` calls with `Haptics.impact()` / `Haptics.notification()`
- **D-09:** Keep web fallback: check `Capacitor.isNativePlatform()` — use `@capacitor/haptics` on native, fall back to `navigator.vibrate` on web/PWA. PLAT-03 (web build unchanged) is preserved.
- **D-10:** `capacitor.config.ts` must point `webDir` to `build` (SvelteKit adapter-static outputs to `build/`, not `dist/`)
- **D-11:** Add npm scripts: `"cap:sync": "npm run build && npx cap sync"`, `"cap:android": "npm run cap:sync && npx cap open android"`, `"cap:build": "npm run build && npx cap sync && cd android && ./gradlew bundleRelease"`

### Claude's Discretion
- None noted in CONTEXT.md for this phase.

### Deferred Ideas (OUT OF SCOPE)
- More screens (main menu, settings redesign, profile page) — v4 roadmap backlog
- CI/CD for Play Store deploy — local signing (D-07) is Phase 9; CI-based deployment can be added later
- iOS / App Store — explicitly deferred to v4
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| PLAT-01 | User's game runs as a native Android application via Capacitor | Capacitor installation steps, `npx cap add android`, `capacitor.config.ts` setup, WebView serving `build/` |
| PLAT-02 | App submittable to Google Play with correct app ID, icons, splash screen, signed release build | `@capacitor/assets` icon/splash generation, keystore + Gradle signing, `./gradlew bundleRelease` |
| PLAT-03 | Existing web PWA build continues to function identically alongside native build | No vite.config.ts changes required; service workers work inside Android WebView; PWA and Capacitor share the same `build/` output |
</phase_requirements>

---

## Summary

Phase 9 wraps the existing SvelteKit PWA as an Android app using Capacitor. The project already has a working `build/` output from `@sveltejs/adapter-static` with a proper `index.html <head>` (Capacitor's hard prerequisite). The PWA (`vite-plugin-pwa` + workbox service worker) lives inside `build/` and continues to work when Android WebView loads it — service workers ARE supported in Android WebView (Chrome-based, API 24+), so no conditional build logic is required for PLAT-03.

The environment has Android SDK platform android-36, Android Studio (version 2025.3.1 with bundled JBR 21), Node 24.14.1, and system Java 17. This means **Capacitor 8 is the best version to install** — it targets compileSdk 36 (already installed), requires Node 22+ (env has 24), and needs JDK 17+ for builds (Android Studio's bundled JBR 21 handles this). Installing Capacitor 6 would require downloading SDK platform android-34; Capacitor 7 would require android-35. Neither is installed.

The CONTEXT.md decisions do not pin a Capacitor version number. Installing the `latest` tag (`@capacitor/*@latest` = v8.3.1) is the recommended path for this greenfield installation given the installed SDK environment. The planner should note this divergence from the "Capacitor 6" framing in the discussion and install `@latest` instead.

**Primary recommendation:** Install Capacitor 8 (`@latest`) — it matches the installed Android SDK 36, Android Studio 2025.3.1, and Node 24 environment precisely. Attempting Capacitor 6 without first downloading SDK platform 34 will cause Gradle build failures.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| App identity (appId, appName) | Native shell config | — | `capacitor.config.ts` sets these; not a web concern |
| Web asset serving | Android WebView | — | Capacitor copies `build/` into the native project; WebView serves it |
| PWA service worker | Browser engine (WebView) | — | Chrome-based WebView supports SW; no special Android treatment needed |
| Screen orientation lock | Native (AndroidManifest.xml) | capacitor.config.ts | Manifest `android:screenOrientation` is the authoritative lock |
| Haptic feedback | Native (Capacitor plugin) | Web (navigator.vibrate) | Platform-gated in `touch.ts`; native gets Taptic/Vibrator, web falls back |
| Splash screen | Native (Android drawable) | — | `@capacitor/assets` generates Android 12+ adaptive icon + splash |
| Status bar styling | Native (StatusBar plugin) | — | Called in app boot to style/hide native status bar |
| Game state persistence | LocalStorage (WebView) | — | `localStorage` persists inside the native container per-app |
| Release AAB signing | Gradle (android/app/build.gradle) | — | Signing config in Gradle; keystore in gitignored `local.properties` |

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@capacitor/core` | 8.3.1 | Runtime bridge between web and native | Required for all Capacitor functionality |
| `@capacitor/cli` | 8.3.1 | CLI tooling (`npx cap sync`, `npx cap add android`) | Dev dependency; required for scaffold and sync |
| `@capacitor/android` | 8.3.1 | Android platform project generator | Required for Android target |

[VERIFIED: npm registry — `npm view @capacitor/core dist-tags` shows `latest: 8.3.1`]

### Plugins (Phase 9 scope per D-04)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@capacitor/haptics` | 8.0.2 | Native haptic feedback (Taptic Engine / Android Vibrator) | Touch reactions in MixingChamber |
| `@capacitor/splash-screen` | 8.0.1 | Splash screen show/hide + config | App launch visual |
| `@capacitor/status-bar` | 8.0.2 | Style/hide native status bar | Immersive game display |
| `@capacitor/assets` | 3.0.5 (devDep) | Generate Android adaptive icons and splash drawables | Asset generation pipeline |

[VERIFIED: npm registry — `npm view @capacitor/haptics version`, `@capacitor/splash-screen version`, `@capacitor/status-bar version`, `@capacitor/assets version`]

### Installation Commands

```bash
# Production dependencies
npm install @capacitor/core @capacitor/android @capacitor/haptics @capacitor/splash-screen @capacitor/status-bar

# Dev dependency
npm install -D @capacitor/cli @capacitor/assets

# Initialize (creates capacitor.config.ts)
npx cap init Alchemica io.alchemica.app --web-dir build

# Add Android platform (creates android/ directory)
npx cap add android
```

[CITED: capacitorjs.com/docs/getting-started]

---

## Architecture Patterns

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│  Web build pipeline                                             │
│  npm run build → SvelteKit adapter-static → build/             │
│                                                                 │
│   build/index.html (has <head>) ← Capacitor prerequisite met   │
│   build/sw.js (workbox PWA SW)                                  │
│   build/_app/...                                                │
└───────────────────────────┬─────────────────────────────────────┘
                            │ npx cap sync copies build/ → android/
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  Capacitor native project  (android/)                           │
│                                                                 │
│   android/app/src/main/assets/public/ ← copied web files       │
│   android/app/src/main/AndroidManifest.xml                      │
│   android/app/build.gradle ← signing config                     │
│   android/local.properties ← keystore secrets (gitignored)     │
└───────────────────────────┬─────────────────────────────────────┘
                            │ ./gradlew bundleRelease
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  Android runtime                                                │
│                                                                 │
│   AndroidActivity → BridgeActivity                              │
│   ├── CapacitorWebView (Chrome-based) loads assets/public/      │
│   │   ├── Serves index.html                                     │
│   │   ├── Runs workbox SW (SW supported in WebView API 24+)     │
│   │   └── Svelte app runs, stores → localStorage                │
│   └── Capacitor plugin bridge                                   │
│       ├── @capacitor/haptics → Android Vibrator                 │
│       ├── @capacitor/status-bar → WindowInsetsController        │
│       └── @capacitor/splash-screen → Android SplashScreen      │
└─────────────────────────────────────────────────────────────────┘
```

### capacitor.config.ts — Canonical Configuration

```typescript
// Source: capacitorjs.com/docs/config + D-01 through D-11
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.alchemica.app',    // D-01 — permanent, Play Store locked
  appName: 'Alchemica',         // D-02, D-03
  webDir: 'build',              // D-10 — SvelteKit adapter-static output

  android: {
    // minSdkVersion inherited from variables.gradle (24 in Cap 8)
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#0d1b2e',  // match game theme
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

**Note on orientation (D-05):** There is no top-level `screenOrientation` property in `capacitor.config.ts`. Orientation locking is done in `android/app/src/main/AndroidManifest.xml` on the `<activity>` element:

```xml
<activity
  android:screenOrientation="sensorLandscape"
  ...>
```

`sensorLandscape` allows both landscape-left and landscape-right based on sensor, which is correct for a game. Use `landscape` to lock to one direction only.

[CITED: capacitorjs.com/docs/guides/screen-orientation, capacitorjs.com/docs/android/configuration]

### android/ Directory Structure (generated by npx cap add android)

```
android/
├── app/
│   ├── src/main/
│   │   ├── assets/public/       ← npx cap sync copies build/ here
│   │   ├── java/io/alchemica/app/
│   │   │   └── MainActivity.java
│   │   ├── res/
│   │   │   ├── drawable/        ← splash screen images
│   │   │   ├── mipmap-*/        ← app icons (adaptive)
│   │   │   └── values/styles.xml
│   │   └── AndroidManifest.xml
│   └── build.gradle             ← signing config goes here
├── local.properties             ← gitignored; SDK path + keystore secrets
├── build.gradle
├── gradle/wrapper/gradle-wrapper.properties
└── variables.gradle             ← Cap 8: minSdk=24, compileSdk=36, targetSdk=36
```

**What to add to .gitignore:**

```gitignore
# Capacitor Android
android/
# Exception: keep capacitor.config.ts and any manually tracked files
# Note: most teams gitignore android/ entirely and regenerate from cap sync
# Alternative: commit android/ but gitignore secrets
android/local.properties
android/.gradle/
android/app/.cxx/
android/app/release/
```

**Recommended approach:** Commit the `android/` directory but gitignore the secrets and build artifacts. This preserves the Gradle customizations (signing config, orientation) across syncs. Add these lines to `.gitignore`:

```gitignore
# Capacitor Android secrets and build artifacts
android/local.properties
android/.gradle/
android/app/release/
android/build/
```

[ASSUMED — gitignore strategy for android/ is a common-sense recommendation not explicitly stated in official Capacitor docs]

### Haptics Upgrade Pattern (D-08, D-09)

The existing `touch.ts` has three functions with `navigator.vibrate` calls. All three must be upgraded while preserving the web fallback (PLAT-03 gate).

```typescript
// Source: capacitorjs.com/docs/apis/haptics + D-08, D-09
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';

/** Vibrate on success reaction */
export async function hapticSuccess(): Promise<void> {
  try {
    if (Capacitor.isNativePlatform()) {
      await Haptics.notification({ type: NotificationType.Success });
    } else if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  } catch {
    // silently ignore — not supported
  }
}

/** Vibrate on failed reaction */
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

/** Generic haptic pulse */
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

**Callers impact:** The functions change from `void` to `Promise<void>`. All callers in `MixingChamber.svelte` and any other component call these fire-and-forget; they do not `await` the result and do not need to change. The return type change is backwards-compatible for fire-and-forget usage.

[CITED: capacitorjs.com/docs/apis/haptics]

### Keystore Generation and Gradle Signing

**Step 1: Generate keystore (one-time manual command, never automated)**

```bash
keytool -genkey -v \
  -keystore android/alchemica-release-key.jks \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10950 \
  -alias alchemica-key
```

`10950` days = ~30 years. Google Play requires validity until Oct 22, 2033 minimum; 30 years covers this.

[CITED: developer.android.com/studio/publish/app-signing]

**Step 2: Store secrets in android/local.properties (gitignored)**

```properties
# android/local.properties (existing SDK path line preserved)
sdk.dir=C\:\\Users\\mosta\\AppData\\Local\\Android\\Sdk

# Release signing secrets — NEVER commit
RELEASE_KEYSTORE_PATH=alchemica-release-key.jks
RELEASE_KEYSTORE_PASSWORD=<password>
RELEASE_KEY_ALIAS=alchemica-key
RELEASE_KEY_PASSWORD=<password>
```

**Step 3: Load and use in android/app/build.gradle**

```groovy
// android/app/build.gradle (Groovy syntax — Capacitor's default)
// At top of file, before android {} block:
def localProps = new Properties()
def localPropsFile = rootProject.file('local.properties')
if (localPropsFile.exists()) {
    localPropsFile.withInputStream { localProps.load(it) }
}

android {
    // ... existing config ...
    
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

**Step 4: Build signed AAB**

```bash
cd android && ./gradlew bundleRelease
# Output: android/app/build/outputs/bundle/release/app-release.aab
```

[CITED: developer.android.com/studio/publish/app-signing]

### Icon and Splash Screen Generation

**Using @capacitor/assets (recommended over manual placement)**

```
assets/
├── icon-only.png       ← 1024×1024 minimum, square subject
├── icon-foreground.png ← 1024×1024 for adaptive icon foreground
├── icon-background.png ← 1024×1024 for adaptive icon background
├── splash.png          ← 2732×2732 minimum
└── splash-dark.png     ← 2732×2732 (optional dark mode variant)
```

The existing `static/icon-192.png` and `static/icon-512.png` are NOT sufficient as source files — they are too small (512px vs 1024px minimum) and are the wrong shape for adaptive icons. A new `assets/icon-only.png` must be created at 1024×1024.

```bash
# Generate all Android icons and splash drawables
npx capacitor-assets generate --android

# Output locations (Capacitor manages these automatically):
# android/app/src/main/res/mipmap-*/        ← launcher icons
# android/app/src/main/res/drawable/        ← splash drawables
```

**Android 12+ behavior change:** Android 12+ shows a smaller icon on a colored background instead of a full-screen image during launch. The `backgroundColor` in `capacitor.config.ts` SplashScreen config controls the background color.

[CITED: capacitorjs.com/docs/guides/splash-screens-and-icons]

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Platform detection | Custom `window.Capacitor` check | `Capacitor.isNativePlatform()` from `@capacitor/core` | Official API, handles all edge cases |
| Haptic feedback mapping | Custom vibration patterns | `Haptics.impact({ style: ImpactStyle.* })` | Native API maps to correct platform-specific feedback |
| Asset resizing | Manual image editing for each density | `npx capacitor-assets generate` | Generates all required density variants (ldpi, mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi) |
| Gradle sync logic | Manual file copying | `npx cap sync` | Handles copy + native dependency update atomically |
| Screen orientation code | JS orientation lock | `android:screenOrientation` in AndroidManifest.xml | Native lock is more reliable, not defeatable by JS |

---

## Common Pitfalls

### Pitfall 1: androidScheme Data Loss (Critical for fresh install)

**What goes wrong:** In Capacitor 6+, the default `androidScheme` is `https`. This affects `localStorage` partitioning — data saved under the `https://localhost` origin is separate from `http://localhost`. For a fresh install (no prior app data), this is harmless and `https` is correct. For an existing app being upgraded, switching schemes destroys all saved data.

**Why it happens:** Each scheme creates a different origin in the WebView, and `localStorage` is origin-scoped.

**How to avoid:** This is a new Phase 9 install — there is no prior app data to lose. Use the default `https` scheme. Do NOT add `server: { androidScheme: "http" }` unless migrating an existing Capacitor app that previously used `http`.

**Warning signs:** If game state is not persisting across app restarts, check the scheme configuration.

[CITED: capacitorjs.com/docs/updating/6-0]

### Pitfall 2: Wrong Capacitor Version vs Installed Android SDK

**What goes wrong:** Installing Capacitor 6 (`@capacitor/core@6`) requires `compileSdkVersion 34` (Android API 34 platform). The environment only has `android-36` and `android-36.1` installed. Capacitor 7 requires API 35 (also not installed). Gradle will fail with "Failed to find target with hash string 'android-34'".

**Why it happens:** Capacitor versions pin their compileSdkVersion in `variables.gradle`.

**How to avoid:** Install `@capacitor/*@latest` (= Capacitor 8, compileSdk 36). The environment already has android-36. Do not manually pin to `@6`.

**Warning signs:** Gradle sync fails immediately after `npx cap add android` if compileSdk doesn't match installed SDK platforms.

[VERIFIED: npm registry — `npm view @capacitor/core dist-tags` shows latest=8.3.1; environment has android-36; Cap 8 docs specify compileSdk 36]

### Pitfall 3: Orientation Lock Configuration Location

**What goes wrong:** The CONTEXT.md says "set `screenOrientation: 'landscape'` in `capacitor.config.ts`" but there is no top-level `screenOrientation` key in the `CapacitorConfig` type. Setting an unknown key is silently ignored.

**Why it happens:** Orientation is an Android-native concern, not a Capacitor bridge concern.

**How to avoid:** Set orientation in `android/app/src/main/AndroidManifest.xml`:

```xml
<activity
  android:name="io.alchemica.app.MainActivity"
  android:screenOrientation="sensorLandscape"
  ...>
```

The `sensorLandscape` value respects the physical sensor to allow landscape-left and landscape-right, matching the PWA manifest `"orientation": "landscape"`.

[CITED: capacitorjs.com/docs/guides/screen-orientation]

### Pitfall 4: webDir Mismatch Causes Blank Screen

**What goes wrong:** If `capacitor.config.ts` has `webDir: 'dist'` (Vite default) instead of `webDir: 'build'` (SvelteKit adapter-static default), `npx cap sync` copies an empty or missing directory, and the app shows a blank screen.

**Why it happens:** `npx cap init` auto-detects webDir but may choose `dist` for Vite-based projects.

**How to avoid:** Set `webDir: 'build'` explicitly in `capacitor.config.ts` (D-10). Verify with `ls build/index.html` before first sync.

[VERIFIED: build directory confirmed at `C:\mostafa\front_end\projects\alchemica\build\index.html`]

### Pitfall 5: Service Worker Behavior in Android WebView

**What goes wrong:** Some developers think PWA service workers don't work in Capacitor Android and try to disable them, breaking the web build.

**What's actually true:** Android WebView (API 24+, Chrome-based) DOES support service workers when the app uses the `https` androidScheme. The workbox SW registered by `vite-plugin-pwa` will run inside the WebView. This is generally harmless for native apps — the SW caches assets for faster loads, but Capacitor is already loading assets from local disk so the caching is redundant, not harmful.

**How to avoid:** Do NOT disable `VitePWA` in `vite.config.ts` for the native build. The same `build/` output is shared between PWA and Capacitor (PLAT-03 requirement). Adding a `process.env.CAPACITOR_PLATFORM` conditional would break the unified build pipeline.

[ASSUMED — based on WebView Chrome engine capabilities and Capacitor's use of https scheme by default]

### Pitfall 6: @capacitor/haptics on Web — Graceful Degradation

**What goes wrong:** Calling `Haptics.impact()` on web (browser) does NOT throw an error — it silently resolves. This means the `Capacitor.isNativePlatform()` guard in the upgraded `touch.ts` is defensive programming, not a crash prevention.

**Why it matters:** The web fallback to `navigator.vibrate` is still needed because `@capacitor/haptics` on web does NOT call `navigator.vibrate` internally — it simply no-ops.

**How to avoid:** Keep both branches in the platform check: native gets `Haptics.*`, web gets `navigator.vibrate`. The pattern in the Code Examples section is correct.

[CITED: capacitorjs.com/docs/apis/haptics — "On devices that don't have Taptic Engine or Vibrator, the API calls will resolve without performing any action"]

### Pitfall 7: Java 17 vs JDK 21 for Gradle Builds

**What goes wrong:** Capacitor 7 requires JDK 21. The system `java` is 17. Running `./gradlew bundleRelease` with system Java when using Cap 7 can fail.

**Why it doesn't apply:** This phase installs Capacitor 8, not 7. Capacitor 8 requires Node 22+ (env has 24) and doesn't explicitly require JDK 21 in docs. Gradle builds for Cap 8 will use Android Studio's bundled JBR 21 (`C:\Program Files\Android\Android Studio\jbr`), not the system Java 17. If running Gradle from the command line outside Android Studio, set `org.gradle.java.home=C:/Program Files/Android/Android Studio/jbr` in `android/local.properties` or `android/gradle.properties`.

[VERIFIED: `C:\Program Files\Android\Android Studio\jbr\bin\java.exe` is OpenJDK 21.0.9]

### Pitfall 8: StatusBar overlaysWebView on Android 16+

**What goes wrong:** `StatusBar.overlaysWebView` and `setBackgroundColor()` do not work on Android 15+ (enforced edge-to-edge system UI). Setting these in `capacitor.config.ts` for Android 16 devices has no effect.

**How to avoid:** Set `overlaysWebView: false` and `style: "DARK"` in config — these work on API 24-14. On API 16+ the status bar will be handled by the system edge-to-edge enforcement. For a landscape game, the status bar is hidden by the landscape orientation lock anyway.

[CITED: capacitorjs.com/docs/apis/status-bar — "Android 16+ Breaking Changes"]

---

## Code Examples

### Verified: capacitor.config.ts

```typescript
// Source: capacitorjs.com/docs/config
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.alchemica.app',
  appName: 'Alchemica',
  webDir: 'build',
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#0d1b2e',
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

### Verified: Haptics in touch.ts (complete upgrade)

```typescript
// Source: capacitorjs.com/docs/apis/haptics + D-08/D-09 pattern
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';

export async function hapticSuccess(): Promise<void> {
  try {
    if (Capacitor.isNativePlatform()) {
      await Haptics.notification({ type: NotificationType.Success });
    } else if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  } catch { /* silently ignore */ }
}

export async function hapticFail(): Promise<void> {
  try {
    if (Capacitor.isNativePlatform()) {
      await Haptics.notification({ type: NotificationType.Error });
    } else if ('vibrate' in navigator) {
      navigator.vibrate([20, 30, 20]);
    }
  } catch { /* silently ignore */ }
}

export async function haptic(pattern: number | number[] = 30): Promise<void> {
  try {
    if (Capacitor.isNativePlatform()) {
      await Haptics.impact({ style: ImpactStyle.Light });
    } else if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  } catch { /* silently ignore */ }
}
```

### Verified: AndroidManifest.xml orientation lock

```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<!-- Find the <activity android:name=".MainActivity"> element and add: -->
<activity
  android:name="io.alchemica.app.MainActivity"
  android:screenOrientation="sensorLandscape"
  android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode|density"
  ...>
```

`density` must be in `configChanges` for Capacitor 8 (new requirement from Cap 8 migration guide).

[CITED: capacitorjs.com/docs/updating/8-0]

### Verified: npm scripts (package.json additions per D-11)

```json
{
  "scripts": {
    "cap:sync":    "npm run build && npx cap sync",
    "cap:android": "npm run cap:sync && npx cap open android",
    "cap:build":   "npm run build && npx cap sync && cd android && ./gradlew bundleRelease"
  }
}
```

**Windows note:** `cd android && ./gradlew bundleRelease` in `cap:build` uses a bash-compatible chained command. On Windows PowerShell, this may need to be `cd android; gradlew.bat bundleRelease`. The `npm run cap:build` script should use `&&` syntax which works in both bash and the Git Bash subprocess that npm spawns.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Capacitor 6 (compileSdk 34) | Capacitor 8 (compileSdk 36) | Latest as of 2026-05 | Must install android-36 SDK (already installed) |
| `capacitor.config.json` | `capacitor.config.ts` (TypeScript) | Cap 3 | Typed config with IDE autocomplete |
| Full-screen splash images | Android 12+ adaptive splash (icon on background) | Android 12 | Only icon + background color needed; full-screen splash is legacy |
| `navigator.vibrate` only | `@capacitor/haptics` with platform check | Per project requirement | Better haptic patterns on iOS Taptic Engine; Android Vibrator still used |
| Manual density icon creation | `npx capacitor-assets generate` | @capacitor/assets v2+ | Single source image generates all density variants |

---

## Runtime State Inventory

This is a greenfield Capacitor install — no prior native app exists, no migration from an existing Android package. No runtime state audit is needed.

**Category answers (explicit):**
- Stored data: None — no prior Capacitor app has been installed. `localStorage` data from any prior web/PWA session does not carry over to the native container (different origin).
- Live service config: None — no Google Play Developer Console registration yet (PLAT-02 is first submission).
- OS-registered state: None — no prior APK installed.
- Secrets/env vars: None — keystore will be generated in this phase.
- Build artifacts: `build/` exists from prior web build — this is the source for `npx cap sync`, not something to be replaced.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Android SDK platform android-36 | Capacitor 8 compileSdk 36 | ✓ | android-36.1 | — |
| Android Build Tools | Gradle builds | ✓ | 36.1.0 | — |
| ADB | Device testing | ✓ | 1.0.41 (37.0.0-14910828) | — |
| Android Studio | Gradle JDK 21, open project | ✓ | 2025.3.1 (AI-253) | — |
| Android Studio JBR (JDK 21) | Gradle for Cap 7/8 | ✓ | OpenJDK 21.0.9 | — |
| System Java (keytool) | Keystore generation | ✓ | OpenJDK 17.0.18 (keytool ships with JDK) | — |
| Node.js 22+ | Capacitor 8 CLI | ✓ | 24.14.1 | — |
| npm | Package installation | ✓ | 11.11.0 | — |
| Physical Android device / emulator | PLAT-01 device testing | ✗ | — | Android emulator (must download image) |

**Missing dependencies with no fallback:**
- Physical Android device: Required to fully verify PLAT-01 ("user can install and run on a real device"). Plan must include a manual verification step. An AVD (emulator) can be used for basic testing but does not satisfy "real device" requirement.

**Missing dependencies with fallback:**
- Android emulator system image: Not visible from `ls $ANDROID_HOME/system-images`, but can be downloaded via Android Studio's Device Manager or `sdkmanager`. Fallback is to run on device via ADB.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.3 (unit), Playwright 1.59.1 (e2e) |
| Config file | `vite.config.ts` (vitest config embedded) |
| Quick run command | `npm run test:unit -- --run` |
| Full suite command | `npm run test` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PLAT-01 | App launches on Android device | Manual (device) | — manual only — | N/A |
| PLAT-01 | Capacitor bridge initializes | unit | `npm run test:unit -- --run src/lib/utils/touch.test.ts` | ❌ Wave 0 |
| PLAT-02 | Signed AAB file produced | Manual (build) | `npm run cap:build` (inspect output) | N/A |
| PLAT-02 | Icon and splash assets generated | Manual (visual) | `npx capacitor-assets generate --android` | N/A |
| PLAT-03 | Web build serves correctly (no regression) | e2e | `npm run test:e2e` | ✅ (playwright) |
| PLAT-03 | hapticSuccess/hapticFail/haptic work on web (navigator.vibrate path) | unit | `npm run test:unit -- --run src/lib/utils/touch.test.ts` | ❌ Wave 0 |
| D-08/D-09 | Haptics functions use Capacitor on native path | unit (mocked) | `npm run test:unit -- --run src/lib/utils/touch.test.ts` | ❌ Wave 0 |

### Sampling Rate

- **Per task commit:** `npm run check` (svelte-check — type safety) + `npm run test:unit -- --run`
- **Per wave merge:** `npm run test` (full suite)
- **Phase gate:** Full suite green + manual device verification before `/gsd-verify-work`

### Wave 0 Gaps

- [ ] `src/lib/utils/touch.test.ts` — unit tests for upgraded haptic functions covering:
  - Web path (`Capacitor.isNativePlatform()` returns false → `navigator.vibrate` called)
  - Native path (mocked `Capacitor.isNativePlatform()` returns true → `Haptics.*` called)
  - Error path (both methods unavailable → no throw)

*(Playwright e2e tests already exist; no framework install needed)*

---

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | No auth in this phase |
| V3 Session Management | no | No session management |
| V4 Access Control | no | No access control |
| V5 Input Validation | no | No new user inputs |
| V6 Cryptography | yes | Keystore: RSA-2048, keytool standard; never hand-roll |

### Known Threat Patterns for Capacitor Android

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Keystore file committed to git | Information Disclosure | `android/local.properties` and `*.jks` in `.gitignore`; documented in plan |
| Keystore password in build.gradle hardcoded | Information Disclosure | Load from `local.properties` via `Properties`; never hardcode |
| `android:debuggable="true"` in release build | Tampering | Ensure release buildType does not set `debuggable true`; default is false |
| WebView debug enabled in production | Information Disclosure | `android.webContentsDebuggingEnabled` defaults to false in release builds |
| Mixed content (HTTP assets in HTTPS WebView) | Tampering | `allowMixedContent` defaults to false; all game assets are served locally |

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Committing `android/` (minus secrets) is preferred over gitignoring it entirely | Architecture Patterns > Gitignore | If android/ is gitignored, Gradle signing customizations and AndroidManifest orientation lock would need to be re-applied after every `npx cap add android`; low risk — just document the re-apply steps |
| A2 | `@capacitor/haptics` does NOT call `navigator.vibrate` internally on web — it silently no-ops | Pitfall 6 / Code Examples | If Cap haptics does call navigator.vibrate on web, the fallback branch becomes dead code but causes no harm |
| A3 | Service workers in Android WebView (Cap 8, https scheme) work without additional configuration | Pitfall 5 | If SW registration fails in WebView, users would see stale cached content or no offline; mitigation: test on device as part of PLAT-01 |
| A4 | D-05's "screenOrientation in capacitor.config.ts" should be implemented in AndroidManifest.xml instead | Architecture Patterns | If a `screenOrientation` config key exists in a Cap 8 plugin (e.g., ScreenOrientation plugin), both approaches would work; AndroidManifest is the lower-level and more reliable |

---

## Open Questions (RESOLVED)

1. **Does the developer have a 1024×1024 app icon source file for @capacitor/assets?**
   - What we know: `static/icon-192.png` and `static/icon-512.png` exist but are too small (512px min required is 1024px)
   - What's unclear: Whether a 1024×1024 master icon exists or needs to be created from scratch
   - Recommendation: Plan should include a task to create `assets/icon-only.png` at 1024×1024 before running `npx capacitor-assets generate`
   - **Resolution:** Plan 09-05 creates `assets/icon-only.png` at 1024×1024 using ImageMagick, Node canvas, or manual copy. Multiple fallback methods provided.

2. **Will the cap:build script work on Windows without modification?**
   - What we know: `cd android && ./gradlew bundleRelease` uses bash-style chaining
   - What's unclear: npm scripts on Windows run via `sh` (Git Bash) when available; if not, `./gradlew` needs to be `gradlew.bat`
   - Recommendation: Use `npx cap build android --keystorepath ... ` or document the Windows workaround in the plan
   - **Resolution:** Plan 09-02 Task 3 uses `&&` chaining in the npm script which works via Git Bash subprocess in npm scripts on Windows. Fallback: `cd android; gradlew.bat bundleRelease`.

3. **Capacitor version: latest (v8) vs CONTEXT.md framing of "Capacitor 6"**
   - What we know: CONTEXT.md says "Capacitor 6 (latest)" but npm `latest` tag is 8.3.1; environment has android-36 (matches Cap 8), not android-34 (Cap 6 requirement)
   - What's unclear: Whether the user prefers a specific version for stability reasons
   - Recommendation: Plan should use `@latest` (v8) with a note explaining why; if the user specifically wants v6, they must first install SDK platform 34 via `sdkmanager "platforms;android-34"`
   - **Resolution:** Plans install `@capacitor/*@latest` (v8.3.1) because the installed environment has android-36 SDK which matches Cap 8's compileSdk 36. This is documented in Plan 09-02 Task 1.

---

## Sources

### Primary (HIGH confidence)
- `capacitorjs.com/docs/getting-started` — installation commands and prerequisites
- `capacitorjs.com/docs/config` — `capacitor.config.ts` reference
- `capacitorjs.com/docs/android` — Android platform setup, API level requirements
- `capacitorjs.com/docs/apis/haptics` — Haptics API, ImpactStyle, NotificationType
- `capacitorjs.com/docs/apis/splash-screen` — SplashScreen plugin config
- `capacitorjs.com/docs/apis/status-bar` — StatusBar plugin API, Android 16+ changes
- `capacitorjs.com/docs/guides/screen-orientation` — AndroidManifest orientation lock
- `capacitorjs.com/docs/guides/splash-screens-and-icons` — @capacitor/assets usage
- `capacitorjs.com/docs/updating/6-0` — androidScheme data loss warning
- `capacitorjs.com/docs/updating/7-0` — Java JDK 21 requirement (why Cap 7 is excluded)
- `capacitorjs.com/docs/updating/8-0` — Cap 8 SDK requirements, density configChanges
- `developer.android.com/studio/publish/app-signing` — keytool command, Gradle signing config
- npm registry (`npm view @capacitor/* dist-tags`) — verified versions

### Secondary (MEDIUM confidence)
- Environment probes (java -version, adb version, ls $ANDROID_HOME, Android Studio product-info.json) — verified installed toolchain

### Tertiary (LOW confidence, flagged as ASSUMED)
- gitignore strategy for android/ directory — common practice, not explicitly documented
- @capacitor/haptics web no-op behavior — stated in docs as "resolves without action" but not confirmed as "no navigator.vibrate call internally"

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — npm registry verified all package versions; Capacitor docs fetched
- Architecture: HIGH — configuration patterns fetched from official docs
- Pitfalls: HIGH (androidScheme, webDir, orientation) / MEDIUM (SW in WebView, Windows Gradle script)
- Environment: HIGH — direct probes of installed tools

**Research date:** 2026-05-02
**Valid until:** 2026-06-02 (stable ecosystem; Capacitor releases infrequently)
