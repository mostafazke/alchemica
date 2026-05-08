import { writable } from 'svelte/store';
import { Capacitor } from '@capacitor/core';
import { Purchases } from '@revenuecat/purchases-capacitor';
import type { PurchasesPackage } from '@revenuecat/purchases-typescript-internal-esm';
import { purchasedNoAds, hintBalance } from '../stores/game.js';
import { logIapInitiated } from './analytics.js';

// Set VITE_RC_API_KEY in .env.local (gitignored) before building for Play Store.
// Obtain from: https://app.revenuecat.com → Project Settings → Android app → API keys
// The value starts with 'goog_' for Android projects.
// IMPORTANT: .env.local is gitignored — never paste the real key into this source file.
const RC_API_KEY = import.meta.env.VITE_RC_API_KEY ?? '';

// Product identifiers — must match exactly what is created in Google Play Console
// and configured as package identifiers in the RevenueCat dashboard offering.
const ENTITLEMENT_REMOVE_ADS = 'remove_ads';
const PRODUCT_REMOVE_ADS     = 'remove_ads';
const PRODUCT_HINTS_10       = 'hints_10';

/** Localized price string for the Remove Ads product. '$2.99' until offerings load. */
export const removeAdsPrice = writable<string>('$2.99');

/** Localized price string for the 10-Hints bundle. '$0.99' until offerings load. */
export const hintBundlePrice = writable<string>('$0.99');

/** True while any purchase or restore flow is in flight. Disables all purchase buttons. */
export const isPurchasing = writable<boolean>(false);

/**
 * Non-null when the last purchase/restore produced a user-visible error.
 * Set to null at the start of each new purchase attempt.
 */
export const purchaseError = writable<string | null>(null);

// Internal package references populated by loadOfferings().
let _removeAdsPackage: PurchasesPackage | null = null;
let _hintBundlePackage: PurchasesPackage | null = null;

/** Sync purchasedNoAds store from a live CustomerInfo entitlements object. */
function syncEntitlements(
  customerInfo: Awaited<ReturnType<typeof Purchases.getCustomerInfo>>['customerInfo']
): void {
  purchasedNoAds.set(
    !!customerInfo.entitlements.active[ENTITLEMENT_REMOVE_ADS]?.isActive
  );
}

/**
 * Initialize RevenueCat SDK, sync current entitlements, and load product offerings.
 * Native-only — no-op on web (Capacitor.isNativePlatform() guard).
 * Call once from +layout.svelte onMount (Plan 05).
 */
export async function initIAP(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  if (!RC_API_KEY) return; // No API key configured — skip IAP initialization
  try {
    await Purchases.configure({ apiKey: RC_API_KEY });
    const { customerInfo } = await Purchases.getCustomerInfo();
    syncEntitlements(customerInfo);
    await Purchases.addCustomerInfoUpdateListener((info) => {
      syncEntitlements(info);
    });
    await loadOfferings();
  } catch {
    // RC init failure is non-fatal — purchase buttons show default prices,
    // purchasedNoAds remains false (safe default: ads shown, not hidden).
  }
}

/**
 * Fetch product offerings from RevenueCat and update price stores.
 * Also populates internal _removeAdsPackage / _hintBundlePackage for purchase calls.
 */
export async function loadOfferings(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  try {
    const { current } = await Purchases.getOfferings();
    const packages = current?.availablePackages ?? [];
    const removeAdsPkg = packages.find(
      (p) => p.product.identifier === PRODUCT_REMOVE_ADS
    );
    const hintsBundlePkg = packages.find(
      (p) => p.product.identifier === PRODUCT_HINTS_10
    );
    if (removeAdsPkg) {
      _removeAdsPackage = removeAdsPkg;
      removeAdsPrice.set(removeAdsPkg.product.priceString);
    }
    if (hintsBundlePkg) {
      _hintBundlePackage = hintsBundlePkg;
      hintBundlePrice.set(hintsBundlePkg.product.priceString);
    }
  } catch {
    // Offerings fetch failure — prices remain at defaults ($2.99 / $0.99)
  }
}

/**
 * Initiate purchase of the Remove Ads non-consumable entitlement.
 * Sets purchasedNoAds store from the RC server response on success.
 * Silent on user-cancel (userCancelled === true); shows error message otherwise.
 */
export async function purchaseRemoveAds(): Promise<void> {
  if (!Capacitor.isNativePlatform() || !_removeAdsPackage) return;
  logIapInitiated(PRODUCT_REMOVE_ADS);
  isPurchasing.set(true);
  purchaseError.set(null);
  try {
    const { customerInfo } = await Purchases.purchasePackage({
      aPackage: _removeAdsPackage,
    });
    syncEntitlements(customerInfo);
  } catch (err: unknown) {
    const e = err as { userCancelled?: boolean };
    if (!e.userCancelled) {
      purchaseError.set('Purchase failed. Please try again.');
    }
  } finally {
    isPurchasing.set(false);
  }
}

/**
 * Initiate purchase of the 10-Hints consumable bundle.
 * RevenueCat auto-consumes — no manual consume call needed.
 * Grants +10 to hintBalance store on success.
 */
export async function purchaseHintBundle(): Promise<void> {
  if (!Capacitor.isNativePlatform() || !_hintBundlePackage) return;
  logIapInitiated(PRODUCT_HINTS_10);
  isPurchasing.set(true);
  purchaseError.set(null);
  try {
    await Purchases.purchasePackage({ aPackage: _hintBundlePackage });
    hintBalance.update((n) => n + 10);
  } catch (err: unknown) {
    const e = err as { userCancelled?: boolean };
    if (!e.userCancelled) {
      purchaseError.set('Purchase failed. Please try again.');
    }
  } finally {
    isPurchasing.set(false);
  }
}

/**
 * Restore previously purchased non-consumables (Remove Ads entitlement).
 * Consumables (hints_10) are NOT restored — expected behavior per Google Play policy.
 */
export async function restorePurchases(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  isPurchasing.set(true);
  purchaseError.set(null);
  try {
    const { customerInfo } = await Purchases.restorePurchases();
    syncEntitlements(customerInfo);
  } catch {
    purchaseError.set('Restore failed. Check your connection and try again.');
  } finally {
    isPurchasing.set(false);
  }
}
