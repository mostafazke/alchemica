<script lang="ts">
	import '../app.css';
	import OfflineIndicator from '$lib/components/OfflineIndicator.svelte';
	import { onMount } from 'svelte';
	import { onNavigate, goto } from '$app/navigation';
	import { initAdMob } from '$lib/effects/admob.js';
	import { initIAP } from '$lib/effects/iap.js';
	import { initAnalytics } from '$lib/effects/analytics.js';
	import { sessionCount } from '$lib/stores/settings.js';
	import { Capacitor } from '@capacitor/core';

	const { children } = $props();

	onMount(() => {
		if (screen.orientation?.lock) {
			screen.orientation.lock('landscape').catch(() => {
				// Browser may reject the lock outside a user gesture or on desktop — silently ignore
			});
		}
		initAdMob(); // non-blocking; no-op on web
		initIAP();   // non-blocking; no-op on web; syncs RC entitlements on native
		initAnalytics(); // fire-and-forget; no-op on web
		sessionCount.update((n) => n + 1); // persistent session counter for rating prompt

		// Navigate to game screen when player taps the daily streak notification
		if (Capacitor.isNativePlatform()) {
			import('@capacitor/local-notifications').then(({ LocalNotifications }) => {
				LocalNotifications.addListener('localNotificationActionPerformed', (action) => {
					const route = (action.notification.extra as { route?: string } | null)?.route;
					if (route) goto(route);
				}).catch(() => {});
			}).catch(() => {});
		}
	});

	onNavigate((navigation) => {
		if (!document.startViewTransition) return; // graceful degradation: instant switch
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

{@render children()}
<OfflineIndicator />

<div class="portrait-rotate-overlay">
	<span class="rotate-icon">📱</span>
	<span class="rotate-text">Rotate your device</span>
	<span class="rotate-sub">Alchemica is designed for landscape mode</span>
</div>
