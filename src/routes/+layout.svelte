<script lang="ts">
	import '../app.css';
	import OfflineIndicator from '$lib/components/OfflineIndicator.svelte';

	const { children } = $props();
</script>

{@render children()}
<OfflineIndicator />
