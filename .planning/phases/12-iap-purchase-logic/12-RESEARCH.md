# Phase 12: IAP & Purchase Logic — Research

**Researched:** 2026-05-03
**Domain:** In-app purchases / Google Play Billing / RevenueCat / Capacitor 8
**Confidence:** HIGH (plugin verified on npm; API patterns verified from official docs)

---

## Summary

Phase 12 adds two purchasable products (remove-ads non-consumable, 10-hint consumable),
purchase restoration, and the suppression of all ad surfaces for purchasers.

The recommended approach is `@revenuecat/purchases-capacitor` v13.0.1 — the only
native Capacitor plugin for IAP that explicitly declares `@capacitor/core >= 8.0.0`
peer dependency, was updated 2 days ago, and handles purchase acknowledgment
automatically (critical: Google refunds unacknowledged purchases within 3 days).

**A hard blocker exists in the current codebase:** `android:launchMode="singleTask"`
in `AndroidManifest.xml` will silently cancel purchases when users are redirected
to a banking app for payment verification. Must change to `singleTop` before shipping.

Two manual steps cannot be automated by the plan: (1) creating a free RevenueCat
account and obtaining an API key, and (2) creating two IAP products in Google Play
Console. Both must be done by the developer before the plan can be executed.

**Primary recommendation:** Use `@revenuecat/purchases-capacitor`; change `launchMode`
to `singleTop`; migrate save to v3 folding `hintBalance` + adding `purchasedNoAds`.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Purchase flow (billing sheet) | Android Native (RevenueCat SDK) | — | Google Play Billing lives natively |
| Entitlement state | RevenueCat backend + client cache | localStorage (v3 save) | Server-authoritative; local is cache |
| `purchasedNoAds` store | Svelte store (`stores/game.ts`) | versioned save v3 | Reactive; persisted across sessions |
| `hintBalance` store | Svelte store (existing) | versioned save v3 | Already exists; v3 migration folds it in |
| Purchase UI | `SettingsPanel.svelte` | — | Existing panel; new "Purchases" section |
| Ad surface suppression | `HintButton.svelte` guard | any future ad surfaces | `!$purchasedNoAds` condition |
| Restore purchases | `iap.ts` service module | SettingsPanel button | Single `restorePurchases()` call |

---

## Plugin Selection

### Selected: `@revenuecat/purchases-capacitor` v13.0.1

[VERIFIED: npm registry + official GitHub README]

| Property | Value |
|----------|-------|
| Package | `@revenuecat/purchases-capacitor` |
| Version | `13.0.1` |
| Published | 2026-04-20 (2 weeks ago) |
| Last commit | 2 days ago (actively maintained) |
| Peer deps | `@capacitor/core >= 8.0.0` ✅ exact match |
| License | MIT |
| Type | Native Capacitor plugin (TypeScript + Kotlin + Swift) |
| Backend required | Free RevenueCat account (rev.cat/signup) |

### Why not the alternatives

| Plugin | Reason Rejected |
|--------|----------------|
| `@capacitor-community/in-app-purchases` | Does not exist on npm (returns 404) [VERIFIED: npm] |
| `@capgo/capacitor-purchases` | Deprecated — officially transferred to RevenueCat org |
| `cordova-plugin-purchase` v13.15.4 | Cordova plugin (uses compat bridge, not native Capacitor); keywords confirm `ecosystem:cordova` [VERIFIED: npm] |
| Raw Google Play Billing Library | Requires custom Capacitor plugin wrapper — hand-rolling IAP acknowledgment is a known error-prone operation |

### Installation

```bash
npm install @revenuecat/purchases-capacitor
npx cap sync android
```

No additional `build.gradle` changes needed — RevenueCat brings its own billing
library dependency and manages Google Play Billing Library version internally.

### Required manual pre-steps (cannot be in plan tasks)

1. Create free RevenueCat account at https://app.revenuecat.com/signup
2. Create app in RevenueCat dashboard → get **Android API key** (starts with `goog_`)
3. In Google Play Console → create two in-app products:
   - `remove_ads` — Non-consumable, price $2.99–$4.99
   - `hints_10` — Consumable, price $0.99–$1.99
4. Link Google Play app to RevenueCat; configure entitlement `remove_ads` (maps to product `remove_ads`)
5. Set up at least one **license tester** account in Google Play Console

---

## Google Play Billing API — Key Patterns

### Product types for this phase

[VERIFIED: RevenueCat docs + Google Play Billing docs]

| Product | Google Play Type | RevenueCat Handling |
|---------|-----------------|---------------------|
| Remove Ads | NON_CONSUMABLE (one-time purchase) | Tracked as entitlement `remove_ads`; `isActive: true` permanently |
| Hint Bundle (+10) | CONSUMABLE (can be purchased multiple times) | RevenueCat auto-consumes; appears in `nonSubscriptionTransactions` |

### Acknowledgment requirement (CRITICAL)

Google Play automatically **refunds** any purchase not acknowledged within:
- **License tester accounts:** 3 minutes [VERIFIED: developer.android.com/google/play/billing/test]
- **Production:** 3 days

RevenueCat handles acknowledgment automatically when `purchasesAreCompletedBy`
is not specified (defaults to `REVENUECAT`). **Never set `purchasesAreCompletedBy: MY_APP`
unless you manually implement acknowledgment.**

### Core lifecycle

```typescript
// Source: docs.revenuecat.com/docs/getting-started/installation/capacitor
import { Purchases, LOG_LEVEL } from '@revenuecat/purchases-capacitor';

// 1. Configure once at app start (native-only)
await Purchases.configure({ apiKey: 'goog_your_key' });

// 2. Get current offerings (products from dashboard)
const offerings = await Purchases.getOfferings();
const removeAdsPackage = offerings.current?.availablePackages
  .find(p => p.product.identifier === 'remove_ads');
const hintBundlePackage = offerings.current?.availablePackages
  .find(p => p.product.identifier === 'hints_10');

// 3. Purchase
const result = await Purchases.purchasePackage({ aPackage: removeAdsPackage! });
// result.customerInfo.entitlements.active['remove_ads']?.isActive === true

// 4. Restore (user taps "Restore Purchases")
const { customerInfo } = await Purchases.restorePurchases();

// 5. Get current state on app start
const { customerInfo } = await Purchases.getCustomerInfo();
const hasNoAds = !!customerInfo.entitlements.active['remove_ads']?.isActive;

// 6. Listen for real-time updates
await Purchases.addCustomerInfoUpdateListener((info) => {
  purchasedNoAds.set(!!info.entitlements.active['remove_ads']?.isActive);
});
```

### Hint bundle consumable pattern

```typescript
// After purchase completes:
const result = await Purchases.purchasePackage({ aPackage: hintBundlePackage! });
// RevenueCat auto-consumes (no manual consume call needed)
// Grant the hints immediately:
hintBalance.update(n => n + 10);
```

### Error handling — user cancelled

```typescript
import { PURCHASES_ERROR_CODE } from '@revenuecat/purchases-capacitor';
try {
  await Purchases.purchasePackage({ aPackage: pkg });
} catch (err: unknown) {
  const purchaseErr = err as { code: string; userCancelled?: boolean };
  if (purchaseErr.userCancelled) return; // silent — user dismissed sheet
  // show error message for other codes
}
```

### `launchMode` blocker — MUST FIX

[VERIFIED: docs.revenuecat.com/docs/getting-started/installation/capacitor — "Additional Android Setup"]

Current `AndroidManifest.xml` has `android:launchMode="singleTask"`.
RevenueCat docs state:

> If your Activity's launchMode is set to anything other than **standard** or **singleTop**,
> backgrounding your app can cause the purchase to get cancelled.

This occurs when users verify payment via a banking app (common in EU). The fix:

```xml
<!-- android/app/src/main/AndroidManifest.xml — change singleTask → singleTop -->
<activity
    android:name=".MainActivity"
    android:launchMode="singleTop"   <!-- was singleTask -->
    ...>
```

`singleTop` still prevents duplicate app instances (same functional behavior for
Capacitor deep links) while allowing the purchase flow to complete.

---

## Purchase Persistence Strategy

### purchasedNoAds — acceptable security posture

[ASSUMED — standard practice for mobile games of this scope]

**Q: Can `purchasedNoAds` be spoofed from localStorage on rooted devices?**
**A: Yes, but it doesn't matter here.** Rationale:

1. RevenueCat's `getCustomerInfo()` is called on every app start and re-validates
   entitlements from the RC server → even if local state is tampered, it resets
2. A rooted user who manually sets `purchasedNoAds = true` in localStorage only
   hides ads from themselves — there is no server-side content gating, only UI suppression
3. For a casual mobile game (not a subscription SaaS), this risk is accepted by
   the industry standard (same approach used by most casual game IAP implementations)

### State model

```typescript
// New store in stores/game.ts (or new stores/purchases.ts)
export const purchasedNoAds = writable<boolean>(
  /* initialized from v3 save on load */
);
```

**Source of truth hierarchy:**
1. RevenueCat server (checked on app start via `getCustomerInfo()`)
2. Versioned localStorage save v3 (cache for offline/instant startup)
3. `purchasedNoAds` Svelte store (reactive UI state)

**Sync pattern:** On app start → `getCustomerInfo()` → update store → save persists automatically via existing subscribe chain.

### New `iap.ts` service module (mirrors admob.ts pattern)

Create `src/lib/effects/iap.ts`:
- `initIAP()` — configure RevenueCat, set up customerInfo listener
- `purchaseRemoveAds()` — purchase flow + store update
- `purchaseHintBundle()` — purchase flow + hintBalance update
- `restorePurchases()` — RC call + store sync
- `loadOfferings()` — fetch products for price display

---

## Save Migration Plan (v2→v3)

### Current state

[VERIFIED: reading `src/lib/stores/game.ts`]

- `SAVE_KEY = 'alchemica_v1'` (unchanged across schema versions)
- `SAVE_VERSION = 2`
- `hintBalance` stored **outside** versioned save: `localStorage.setItem('alchemica_hint_balance', ...)`
- No `purchasedNoAds` field

### Target state (v3)

```typescript
// game.ts changes:
const SAVE_VERSION = 3;

interface SaveData {
  version: number;
  data: {
    // ... all existing v2 fields ...
    hintBalance: number;       // NEW — moved from separate key
    purchasedNoAds: boolean;   // NEW
  };
}
```

### Migration function (v2→v3)

Add to the `loadSave()` migration chain:

```typescript
if (parsed.version === 2) {
  const v2data = parsed.data as { /* existing v2 fields */ };
  return {
    // ... copy all v2 fields ...
    hintBalance: Number(localStorage.getItem('alchemica_hint_balance') ?? 0),
    purchasedNoAds: false,  // conservative default; RC verifies on start
  };
}
```

### Storage.ts (export/import): also bump EXPORT_VERSION to 3

```typescript
export const EXPORT_VERSION = 3;

export interface SaveFile {
  version: 3;
  data: {
    // ... existing fields ...
    hintBalance: number;
    purchasedNoAds: boolean;
  };
}
```

The import migration in `importSave()` needs a v2→v3 branch mirroring the
`loadSave()` pattern (use defaults for missing fields).

### Cleanup after v3 migration

After loading from v3, the separate `alchemica_hint_balance` key becomes
stale. The `hintBalance.subscribe()` handler should write to the versioned
save (via `saveToStorage`) instead of the separate key. The separate key
write can be removed in Phase 12. `resetGame()` should also remove the old key.

---

## Hint Bundle + hintBalance Interaction

[VERIFIED: Phase 11 CONTEXT.md D-01; HintButton.svelte source]

`hintBalance` already exists from Phase 11. Phase 12 adds a second way to increment it.

### Current flow (Phase 11)

```
Watch ad → AdMob.onRewarded → hintBalance += 1
```

### Phase 12 addition

```
Buy 10-hint bundle → RC purchase → hintBalance += 10
```

Both paths write to the **same** `hintBalance` store — no new store needed.

### HintButton ad suppression (MOTZ-05)

Current ad-button guard:

```svelte
{#if isNative && cooldownRemaining > 0 && $hintBalance === 0}
```

Phase 12 adds `purchasedNoAds` check:

```svelte
{#if isNative && cooldownRemaining > 0 && $hintBalance === 0 && !$purchasedNoAds}
```

This is the **only code change needed in HintButton.svelte** for MOTZ-05.

### The hint bundle is NOT restorable (expected behavior)

Consumables are consumed after purchase — Google Play does not retain them in
purchase history after consumption. `restorePurchases()` only restores the
`remove_ads` entitlement. This is correct and expected by Google Play policy.

---

## UI Surface — Where to Show Purchase Options

### Recommendation: New "Purchases" section in SettingsPanel.svelte

[ASSUMED — based on existing SettingsPanel structure and mobile game conventions]

**Rationale:**
- SettingsPanel already has a modal overlay, header, and section pattern
- No new component or route needed
- User flow: game screen → gear icon → Settings → "Purchases" section

### UI layout

```
┌─────────────────────────┐
│ Settings                │
│ ───────────────────────  │
│ [Sound section]          │
│ ───────────────────────  │
│ [Save Data section]      │
│ ───────────────────────  │
│ Purchases         (NEW)  │
│  [Remove Ads  $2.99 →]  │
│  [10 Hints    $0.99 →]  │
│                          │
│  Restore Purchases       │
└─────────────────────────┘
```

**Details:**
- Show entire Purchases section only on `Capacitor.isNativePlatform()`
- "Remove Ads" button: show price from `product.priceString` (fetched from RC)
  - If already owned: show "✓ Ads Removed" (disabled, no price)
- "10 Hints" button: always shows price (consumable, can always re-buy)
- "Restore Purchases" text link: below buttons, triggers `restorePurchases()`
- Inline status message (like `importStatus` pattern) for purchase success/failure/restore

### Price display: load from RevenueCat offerings

```typescript
// In SettingsPanel or iap.ts:
const offerings = await Purchases.getOfferings();
const removeAdsPrice = offerings.current?.availablePackages
  .find(p => p.product.identifier === 'remove_ads')?.product.priceString ?? '$2.99';
```

Always display the dynamic price from RC — it respects user's locale and currency.

---

## Test Environment Setup

### What's required to test IAP on Android

[VERIFIED: developer.android.com/google/play/billing/test]

IAP **cannot** be tested with only a local debug build against an arbitrary device.
The minimum required setup:

1. **Upload APK/AAB to Google Play Internal Testing track** (doesn't need to be live)
2. **Add license tester Google accounts** in Play Console → Setup → License Testing
3. **License tester account must be logged into the test device** as the primary Play Store account
4. **Products must be "Active"** in Google Play Console product catalog

**License tester benefits:**
- Bypass production signing requirement (can sideload debug builds)
- Use test payment methods (no real charges): "Test instrument, always approves"
- Test acknowledgment in 3-minute window (not 3 days)
- Sideloaded builds still work if package name matches Play Console app

**Play Billing Lab** (optional but useful):
- Android app from Play Store for test configuration
- Can change test region, simulate price changes, accelerate subscription states

### RevenueCat sandbox

RevenueCat automatically uses sandbox mode when `isTesting = true` is not set
and the device is a license tester. Configure `setLogLevel({ level: LOG_LEVEL.DEBUG })`
during development to see RC sandbox responses.

### Step-by-step test flow for Phase 12

1. Build release AAB: `npm run cap:build`
2. Upload to Play Console Internal Testing
3. Add developer Google account as license tester
4. Install via Internal Testing track opt-in URL
5. Open Settings → Purchases section → tap "Remove Ads"
6. Verify: billing sheet shows "TEST" banner, use "Test instrument, always approves"
7. Verify: after purchase, "📺 Watch ad" button disappears from HintButton
8. Uninstall and reinstall app
9. Open Settings → Purchases → tap "Restore Purchases"
10. Verify: `purchasedNoAds` restored, ad button stays hidden

---

## Risks & Unknowns

### R-01: `launchMode="singleTask"` breaks purchase flow [HIGH — MUST FIX]

**Status:** Confirmed in `AndroidManifest.xml` line 15.
**Fix:** Change to `singleTop` (functionally equivalent for Capacitor, safe for billing).

### R-02: RevenueCat account/API key is a manual prerequisite [HIGH — BLOCK]

**Status:** Cannot be automated. Execution is blocked until the developer creates a
RevenueCat account and provides the API key.
**Mitigation:** Plan must include a manual pre-step gate before the iap.ts task.

### R-03: Products must exist in Play Console before RC can serve them [HIGH — BLOCK]

RevenueCat fetches product metadata from Google Play. If `remove_ads` and `hints_10`
products don't exist in Play Console, `getOfferings()` returns empty.
**Mitigation:** Plan must document product creation as manual pre-step.

### R-04: `hintBalance` not in versioned save yet — race condition on v3 migration [MEDIUM]

If a user upgrades from Phase 11 app to Phase 12 app:
- Their `alchemica_hint_balance` separate key may have a non-zero value
- The v2→v3 migration must read that key before the new `hintBalance` subscribe
  handler overwrites it on first `saveToStorage()` call
- Fix: Migration reads old key first, new save writes new format — order is safe
  because `loadSave()` runs before any store subscriptions are set up

### R-05: `purchasedNoAds` is false by default — brief "ads visible" flash on reinstall [LOW]

After reinstall, `purchasedNoAds = false` until `getCustomerInfo()` resolves.
The ad button might flash visible for ~1 second on first launch.
**Mitigation:** Acceptable UX for a free game; can be addressed in v4 if needed.
Alternative: Aggressive optimistic state from RC's local cache (RC caches CustomerInfo).

### R-06: RevenueCat requires INTERNET permission — already present [NONE]

`AndroidManifest.xml` already has `<uses-permission android:name="android.permission.INTERNET" />`.
No action needed.

### R-07: Google Play Billing Library version mismatch [LOW]

RevenueCat v13 internally uses Google Play Billing Library. The library version is
managed by RevenueCat, not the app's `variables.gradle`. No manual override needed.
`minSdkVersion = 24` is well above the billing library minimum (API 16).

---

## Validation Architecture

IAP flows require a physical Android device with Play Store — they cannot be unit
tested or browser-tested. Two-tier strategy:

### Tier 1: Unit tests (Vitest — automated)

Cover store behavior without real billing:

```typescript
// src/lib/stores/purchases.test.ts (new)
import { purchasedNoAds } from './game.js';
// Test: starts false, can be set true, persists via save
```

```typescript
// src/lib/stores/game.test.ts (extend existing)
// Test: v2→v3 migration preserves hintBalance from old key
// Test: v2→v3 migration sets purchasedNoAds = false
// Test: v3 load/save round-trips hintBalance + purchasedNoAds
```

### Tier 2: Manual device UAT checklist (required — no automated equivalent)

| # | Scenario | Expected |
|---|----------|----------|
| M-01 | Tap "Remove Ads" → use "always approves" test card | ✓ ad button gone immediately |
| M-02 | Tap "Remove Ads" again | Button shows "✓ Ads Removed" (disabled) |
| M-03 | Tap "10 Hints" → complete purchase | hintBalance +10 immediately |
| M-04 | Force-close and relaunch | purchasedNoAds = true persists |
| M-05 | Uninstall + reinstall → tap "Restore Purchases" | Remove Ads entitlement restored |
| M-06 | Tap "Remove Ads" → cancel billing sheet | No state change; no error shown |
| M-07 | Airplane mode → tap "Remove Ads" | Shows graceful error, no crash |

### Phase gate

Before marking Phase 12 complete:
- Vitest: `npm run test:unit -- --run` passes
- M-01 through M-07 verified on physical Android device

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | SettingsPanel is the correct UI surface for IAP (no dedicated "Store" screen) | UI Surface | Low — can move to dedicated screen in Phase 13+ |
| A2 | `purchasedNoAds` spoofing on rooted devices is acceptable for a casual game | Persistence | Low — no real content gating, only UI suppression |
| A3 | RevenueCat free tier covers this app's transaction volume | Plugin Selection | Low — RC free tier is 10k MAU/month |
| A4 | `singleTop` is safe for existing Capacitor deep-link behavior | launchMode fix | Medium — test orientation rotation after change |

---

## Sources

### Primary (HIGH confidence)

- [VERIFIED: npm registry] `@revenuecat/purchases-capacitor` v13.0.1, peerDeps `@capacitor/core >= 8.0.0`
- [CITED: github.com/RevenueCat/purchases-capacitor] Full API reference — configure, purchasePackage, restorePurchases, getCustomerInfo, addCustomerInfoUpdateListener
- [CITED: docs.revenuecat.com/docs/getting-started/installation/capacitor] Android launchMode requirement; installation steps
- [CITED: developer.android.com/google/play/billing/test] License tester setup; 3-minute acknowledgment window for testers; test payment methods
- [VERIFIED: codebase read] `SAVE_VERSION = 2`; `hintBalance` in separate key; `launchMode="singleTask"` in AndroidManifest.xml; existing SettingsPanel section pattern

### Secondary (MEDIUM confidence)

- [CITED: npm registry] `@capgo/capacitor-purchases` deprecated in favor of RevenueCat org
- [CITED: npm registry] `cordova-plugin-purchase` v13.15.4 — Cordova ecosystem only

---

## Metadata

**Confidence breakdown:**
- Plugin selection: HIGH — verified on npm + official GitHub docs
- Google Play Billing patterns: HIGH — verified from official Android docs
- Save migration: HIGH — verified from reading actual source files
- UI surface: MEDIUM — assumed based on existing patterns (A1)
- Security posture: MEDIUM — industry convention for casual games (A2)
- Test environment: HIGH — verified from official Play Billing test docs

**Research date:** 2026-05-03
**Valid until:** 2026-09-01 (RevenueCat and Play Billing move fast; verify versions before execution)
