/**
 * discoveryBanner.ts — Queue store for the full-width discovery celebration banner.
 * MixingChamber pushes payloads here on new element discoveries.
 * DiscoveryBanner.svelte drains them one at a time.
 */
import { writable } from 'svelte/store';

export interface DiscoveryBannerPayload {
  elementKey: string;
  discoveryNumber: number; // snapshot of unlocked count at moment of discovery
  totalElements: number;   // snapshot of total elements in ELEMENTS map
}

/** FIFO queue of discovery banner payloads waiting to be shown. */
export const discoveryBannerQueue = writable<DiscoveryBannerPayload[]>([]);
