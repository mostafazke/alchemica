<script lang="ts">
	import '../app.css';
	import OfflineIndicator from '$lib/components/OfflineIndicator.svelte';
	import { onMount } from 'svelte';
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
</script>

{@render children()}
<OfflineIndicator />
