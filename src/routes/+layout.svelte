<script lang="ts">
	import '../app.css';
	import OfflineIndicator from '$lib/components/OfflineIndicator.svelte';
	import { onMount } from 'svelte';

	const { children } = $props();

	onMount(() => {
		if (screen.orientation?.lock) {
			screen.orientation.lock('landscape').catch(() => {
				// Browser may reject the lock outside a user gesture or on desktop — silently ignore
			});
		}
	});
</script>

{@render children()}
<OfflineIndicator />
