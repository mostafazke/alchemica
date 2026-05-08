import { writable } from 'svelte/store';
import { Capacitor } from '@capacitor/core';
import { AdMob, RewardAdPluginEvents } from '@capacitor-community/admob';
import { hintBalance } from '../stores/game.js';
import { logRewardedAdWatched } from './analytics.js';

// Test Rewarded Unit ID — replace with real ID from admob.google.com before Play Store submission
const REWARD_AD_ID = 'ca-app-pub-3940256099942544/5224354917';

/** True when a rewarded ad is loaded and ready to show. */
export const isAdReady = writable<boolean>(false);

let listenersRegistered = false;

function prepareAd(): void {
  AdMob.prepareRewardVideoAd({ adId: REWARD_AD_ID }).catch(() => {
    isAdReady.set(false);
  });
}

function registerListeners(): void {
  if (listenersRegistered) return;
  listenersRegistered = true;

  AdMob.addListener(RewardAdPluginEvents.Loaded, () => {
    isAdReady.set(true);
  });

  AdMob.addListener(RewardAdPluginEvents.FailedToLoad, () => {
    isAdReady.set(false);
  });

  AdMob.addListener(RewardAdPluginEvents.Rewarded, () => {
    logRewardedAdWatched('stuck'); // current placement is always 'stuck' (hint prompt)
    hintBalance.update((n) => n + 1);
    // Preload next ad immediately after reward
    prepareAd();
  });

  AdMob.addListener(RewardAdPluginEvents.FailedToShow, () => {
    isAdReady.set(false);
    prepareAd();
  });
}

/** Warm up the next rewarded ad early (call after 2nd consecutive fail). Native-only — no-op on web. */
export function warmupAd(): void {
  if (Capacitor.isNativePlatform()) prepareAd();
}

/** Initialize AdMob and preload first rewarded ad. Native-only — no-op on web. */
export async function initAdMob(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  try {
    await AdMob.initialize();
    registerListeners();
    prepareAd();
  } catch {
    // AdMob init failure is non-fatal — ad button shows 'No ad available'
    isAdReady.set(false);
  }
}

/** Show the rewarded ad. No-op on web or when ad is not ready. */
export async function requestAdHint(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  isAdReady.set(false); // immediately disable button while ad plays
  try {
    await AdMob.showRewardVideoAd();
  } catch {
    // Show failed — FailedToShow listener handles reload
    isAdReady.set(false);
  }
}
