---
phase: 11
slug: admob-rewarded-ads
status: context-complete
date: 2026-05-03
requirements: [MOTZ-01, MOTZ-04]
---

# Context: Phase 11 — AdMob Rewarded Ads

## Goal

Players can watch a rewarded video ad to earn 1 free hint. The ad loads silently
before it is needed and fails gracefully. Native-only (Android via Capacitor).

## Decisions (Locked)

### D-01: Hint award model — hintBalance store
**Decision:** Watching an ad grants +1 to a new `hintBalance` writable store.
Hints drawn from balance are separate from the organic 30s cooldown system.
HintButton checks `$hintBalance > 0` first; if balance is available, use hint and
decrement — no cooldown applied. Balance persists in localStorage (Phase 12 will
fold it into the versioned save migration).
**Source:** User confirmed (2026-05-03). Phase 12 save migration anticipates this field.

### D-02: Button placement — inside HintButton, cooldown only
**Decision:** A "📺 Watch ad" sub-button appears **inside** `HintButton.svelte`
only when the 30s cooldown is active (i.e., `cooldownRemaining > 0`). It is not
shown when the free hint is available or when `hintBalance > 0`.
**Source:** User confirmed (2026-05-03).

### D-03: Web/PWA fallback — hide completely
**Decision:** The "Watch ad" button is hidden on web/PWA builds. Detection via
`Capacitor.isNativePlatform()` at runtime. On web, no disabled stub — simply absent.
**Source:** User confirmed (2026-05-03).

### D-04: Unavailable ad state — disabled button with label
**Decision:** When the AdMob plugin cannot serve an ad (not loaded yet, daily cap
reached, network failure), the "Watch ad" button shows `'No ad available'` in a
disabled state — no toast, no modal.
**Source:** User confirmed (2026-05-03).

## Codebase State

### Existing hint system (`src/lib/components/HintButton.svelte`)
- Uses `hintCooldownEndsAt` store + `getHint()` from `game/reactions.ts`
- 30s cooldown; shows `💡 Hint` when ready, `⏱ Xs` during cooldown
- Phase 11 adds `📺 Watch ad` / `No ad available` below the cooldown timer

### Capacitor setup (`capacitor.config.ts`)
- `appId: 'io.alchemica.app'` — locked, do not change
- Plugins configured: SplashScreen, StatusBar — AdMob plugin config goes here

### Store location
- New `hintBalance: writable<number>(0)` in `src/lib/stores/game.ts`
- Subscribe to `saveToStorage` (same pattern as `score`, `combo`, etc.)

## Technical Notes (for researcher/planner)

### Plugin
Use `@capacitor-community/admob` — the canonical Capacitor AdMob plugin.
Install: `npm install @capacitor-community/admob` + `npx cap sync android`.

### AdMob IDs
- AdMob App ID and Ad Unit ID must be added to:
  - `capacitor.config.ts` (plugin config: `AdMob.initialize`)
  - `android/app/src/main/AndroidManifest.xml` (meta-data `com.google.android.gms.ads.APPLICATION_ID`)
- Use Google's official test IDs during development:
  - Test App ID: `ca-app-pub-3940256099942544~3347511713`
  - Test Rewarded Unit ID: `ca-app-pub-3940256099942544/5224354917`
- Production IDs are user-owned and not yet registered — planner should note this as a
  manual step (user must create AdMob account + create app + ad unit).

### AdMob lifecycle
1. `AdMob.initialize()` on app start (once)
2. `AdMob.prepareRewardVideoAd({ adId })` — preloads the ad
3. Listen to `AdMob.addListener('onRewardedVideoAdLoaded', ...)` to know when ready
4. On button tap: `AdMob.showRewardVideoAd()` — plays ad
5. Listen to `AdMob.addListener('onRewarded', ...)` — fires when user earns reward
6. On reward: `hintBalance.update(n => n + 1)` then `prepareRewardVideoAd` again
7. On failure/close without reward: no balance change, show 'No ad available' state

### Web guard
```ts
import { Capacitor } from '@capacitor/core';
const isNative = Capacitor.isNativePlatform(); // false on web
```

## Out of Scope (Phase 11)

- MOTZ-05 (hide ads for purchasers) — Phase 12's responsibility
- Real production AdMob account setup — manual step for user
- iOS AdMob configuration — v4 (iOS deferred)
- IAP hint bundles — Phase 12
