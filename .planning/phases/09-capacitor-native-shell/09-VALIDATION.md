---
phase: 9
slug: capacitor-native-shell
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-02
---

# Phase 9 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.3 (unit), Playwright 1.59.1 (e2e) |
| **Config file** | `vite.config.ts` (vitest config embedded) |
| **Quick run command** | `npm run test:unit -- --run` |
| **Full suite command** | `npm run test` |
| **Estimated runtime** | ~10 seconds (unit), ~60 seconds (full) |

---

## Sampling Rate

- **After every task commit:** Run `npm run test:unit -- --run` + `npm run check`
- **After every plan wave:** Run `npm run test`
- **Before `/gsd-verify-work`:** Full suite must be green + manual device verification
- **Max feedback latency:** ~10 seconds (unit)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------------|-----------|-------------------|-------------|--------|
| 9-W0-haptics | 01 | 0 | PLAT-01, PLAT-03 | Platform check guards haptic calls | unit | `npm run test:unit -- --run src/lib/utils/touch.test.ts` | ❌ W0 | ⬜ pending |
| 9-01-install | 01 | 1 | PLAT-01 | N/A | manual | `npm run check` (type check after install) | ✅ | ⬜ pending |
| 9-01-config | 01 | 1 | PLAT-01 | N/A | lint | `npm run check` | ✅ | ⬜ pending |
| 9-01-haptics | 01 | 1 | PLAT-01, PLAT-03 | Capacitor.isNativePlatform() guards haptic calls; web path preserved | unit | `npm run test:unit -- --run src/lib/utils/touch.test.ts` | ❌ W0 | ⬜ pending |
| 9-02-android | 02 | 1 | PLAT-01 | N/A | manual (ADB or emulator) | `adb devices` | N/A | ⬜ pending |
| 9-02-orientation | 02 | 1 | PLAT-01 | N/A | manual (visual on device) | — | N/A | ⬜ pending |
| 9-02-icons | 02 | 1 | PLAT-02 | N/A | manual (visual) | `ls android/app/src/main/res/mipmap-*` | N/A | ⬜ pending |
| 9-03-keystore | 03 | 2 | PLAT-02 | Keystore + passwords NOT in git; local.properties gitignored | manual | `git status android/local.properties` (must be untracked) | N/A | ⬜ pending |
| 9-03-signing | 03 | 2 | PLAT-02 | No hardcoded passwords in build.gradle; loaded from local.properties | manual | verify build.gradle has `localProps['RELEASE_KEYSTORE_PASSWORD']` | N/A | ⬜ pending |
| 9-03-aab | 03 | 2 | PLAT-02 | N/A | manual (build) | `ls android/app/build/outputs/bundle/release/app-release.aab` | N/A | ⬜ pending |
| 9-04-plat03 | 04 | 3 | PLAT-03 | Web PWA build unchanged; no VitePWA modifications | e2e | `npm run test:e2e` | ✅ | ⬜ pending |
| 9-04-web-build | 04 | 3 | PLAT-03 | N/A | lint | `npm run check` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/lib/utils/touch.test.ts` — unit tests for upgraded haptic functions:
  - Web path: `Capacitor.isNativePlatform()` returns false → `navigator.vibrate` called
  - Native path: mocked `Capacitor.isNativePlatform()` returns true → `Haptics.*` called
  - Error path: both methods unavailable → no throw

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| App launches on real Android device | PLAT-01 | Requires physical device or AVD connected via ADB | `adb devices` to confirm device connected; `npm run cap:android` to open in Android Studio; run on device |
| Icons and splash screen correct | PLAT-02 | Visual verification only | Launch app on device, check launcher icon and splash; inspect `android/app/src/main/res/mipmap-*` directories |
| Signed AAB produced | PLAT-02 | Build output inspection | `npm run cap:build`; verify `android/app/build/outputs/bundle/release/app-release.aab` exists and is > 0 bytes |
| Landscape orientation locked | D-05 | Device visual behavior | Rotate device; verify app stays in landscape |
| Keystore secrets not in git | D-07 | Security audit | `git status android/` — `local.properties` and `*.jks` must not appear as tracked files |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
