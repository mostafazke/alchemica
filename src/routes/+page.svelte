<script lang="ts">
	import TopBar from '$lib/components/TopBar.svelte';
	import Shelf from '$lib/components/Shelf.svelte';
	import MixingChamber from '$lib/components/MixingChamber.svelte';
	import DiscoveryLog from '$lib/components/DiscoveryLog.svelte';
	import BottomBar from '$lib/components/BottomBar.svelte';
</script>

<div class="app">
	<TopBar />
	<div class="lab-wrapper">
		<Shelf />
		<MixingChamber />
		<DiscoveryLog />
	</div>
	<BottomBar />
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		height: 100%;
	}
	.lab-wrapper {
		flex: 1;
		display: flex;
		overflow: hidden;
		min-height: 0;
	}
</style>
