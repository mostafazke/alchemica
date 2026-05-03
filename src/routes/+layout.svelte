<script lang="ts">
	import '../app.css';
	import OfflineIndicator from '$lib/components/OfflineIndicator.svelte';
	import { onMount } from 'svelte';
	import { onNavigate } from '$app/navigation';
	import { initAdMob } from '$lib/effects/admob.js';

	const { children } = $props();

	onMount(() => {
		if (screen.orientation?.lock) {
			screen.orientation.lock('landscape').catch(() => {
				// Browser may reject the lock outside a user gesture or on desktop — silently ignore
			});
		}
		initAdMob(); // non-blocking; no-op on web
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
