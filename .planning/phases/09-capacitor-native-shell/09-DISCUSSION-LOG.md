# Phase 9: Capacitor Native Shell — Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-02
**Phase:** 9 — Capacitor Native Shell
**Areas discussed:** App identity, Plugin scope, Signing & release build, Haptics upgrade

---

## App identity

| Option | Description | Selected |
|--------|-------------|----------|
| com.mostafa.alchemica | Personal namespace — simple, tied to developer name | |
| io.alchemica.app | Product namespace — cleaner for a brand | ✓ |
| com.alchemica.game | Game-focused namespace — descriptive | |

**App ID choice:** `io.alchemica.app`

| Option | Description | Selected |
|--------|-------------|----------|
| Alchemica | Clean, matches existing PWA short_name | ✓ |
| Alchemica — Element Lab | More descriptive, better discoverability | |

**Display name:** `Alchemica`

---

## Plugin scope

| Option | Description | Selected |
|--------|-------------|----------|
| Minimum shell only | @capacitor/core + @capacitor/android only | |
| Shell + splash + status bar | Core + @capacitor/splash-screen + @capacitor/status-bar | |
| Shell + splash + status bar + haptics | All of the above + @capacitor/haptics | ✓ |

**Plugin set:** core, android, splash-screen, status-bar, haptics

| Option | Description | Selected |
|--------|-------------|----------|
| Lock to landscape | Match PWA manifest; set screenOrientation: landscape in Capacitor config | ✓ |
| Allow both | Let Android handle rotation | |
| You decide | Researcher picks based on current layout | |

**Orientation:** Locked to landscape

---

## Signing & release build

| Option | Description | Selected |
|--------|-------------|----------|
| Set up keystore in Phase 9 | Generate keystore now, configure Gradle signing, produce signed AAB | ✓ |
| Debug build only in Phase 9 | Skip keystore; verify app runs first; defer signing | |

**Signing approach:** Keystore in Phase 9 (PLAT-02 fully satisfied)

| Option | Description | Selected |
|--------|-------------|----------|
| Local keystore + .env file (gitignored) | Keystore local, passwords in local.properties (gitignored) | ✓ |
| Documented manual step only | PLAN.md documents keytool command; no secrets config in repo | |
| CI-ready via GitHub Actions secrets | Base64-encoded keystore in GitHub secret for CI builds | |

**Secrets handling:** Local keystore + `android/local.properties` (gitignored)

---

## Haptics upgrade

| Option | Description | Selected |
|--------|-------------|----------|
| Upgrade to @capacitor/haptics | Replace navigator.vibrate with Haptics.impact() / Haptics.notification() | ✓ |
| Keep navigator.vibrate | No code change; works in WebView but less native feel | |

**Haptics:** Upgrade to @capacitor/haptics

| Option | Description | Selected |
|--------|-------------|----------|
| Keep web fallback | Check Capacitor.isNativePlatform(); use native haptics on device, navigator.vibrate on web | ✓ |
| Native only | Remove navigator.vibrate entirely; haptics only on Android | |

**Web fallback:** Yes — preserve PWA haptics experience (PLAT-03)

---

## Claude's Discretion

- `capacitor.config.ts` WebDir value (`build` — from SvelteKit adapter-static output)
- npm script names for cap:sync, cap:android, cap:build
- Gradle signing block structure in `android/app/build.gradle`
- `@capacitor/assets` vs. manual icon placement for Android icon set

## Deferred Ideas

- **More screens** (main menu, profile, settings redesign) — raised by user; new UI capability, belongs in its own future phase (v4 roadmap)
- **iOS / App Store** — explicitly deferred to v4
- **CI/CD Play Store deploy** — local signing is Phase 9; CI pipeline is a future concern
