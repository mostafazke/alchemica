<script lang="ts">
	import TopBar from '$lib/components/TopBar.svelte';
	import Shelf from '$lib/components/Shelf.svelte';
	import MixingChamber from '$lib/components/MixingChamber.svelte';
	import DiscoveryLog from '$lib/components/DiscoveryLog.svelte';
	import BottomBar from '$lib/components/BottomBar.svelte';
	import BottomSheet from '$lib/components/BottomSheet.svelte';

	let shelfOpen = $state(false);
	let discoverySheetOpen = $state(false);
</script>

<div class="app">
	<TopBar />
	<div class="lab-wrapper">
		<div class="shelf-overlay" class:open={shelfOpen} onclick={() => shelfOpen = false} role="none"></div>
		<div class="shelf-container" class:open={shelfOpen}>
			<Shelf />
		</div>
		<MixingChamber />
		<div class="discoveries-container">
			<DiscoveryLog />
		</div>
	</div>
	<BottomBar
		{shelfOpen}
		onToggleShelf={() => shelfOpen = !shelfOpen}
		{discoverySheetOpen}
		onToggleDiscoveries={() => discoverySheetOpen = !discoverySheetOpen}
	/>
	<BottomSheet open={discoverySheetOpen} onClose={() => discoverySheetOpen = false}>
		<DiscoveryLog />
	</BottomSheet>
</div>

<style>
	.app {
		display: grid;
		grid-template-rows: auto 1fr auto;
		height: 100%;
		overflow: hidden;
	}
	.lab-wrapper {
		display: grid;
		grid-template-columns: 210px 1fr 210px;
		grid-template-areas: "shelf chamber discoveries";
		overflow: hidden;
		min-height: 0;
		position: relative;
	}
	.shelf-container {
		grid-area: shelf;
		overflow: hidden;
	}
	.discoveries-container {
		grid-area: discoveries;
		overflow: hidden;
	}
	.shelf-overlay {
		display: none;
	}

	/* Tablet: 2-column (shelf + chamber, discoveries hidden) */
	@media (max-width: 1024px) {
		.lab-wrapper {
			grid-template-columns: 200px 1fr;
			grid-template-areas: "shelf chamber";
		}
		.discoveries-container {
			display: none;
		}
	}

	/* Mobile portrait: single column */
	@media (max-width: 768px) {
		.lab-wrapper {
			grid-template-columns: 1fr;
			grid-template-areas: "chamber";
		}
		.shelf-container {
			position: fixed;
			top: 56px;
			left: 0;
			bottom: 64px;
			width: 260px;
			z-index: 200;
			transform: translateX(-100%);
			transition: transform 0.25s ease;
			overflow: hidden;
		}
		.shelf-container.open {
			transform: translateX(0);
		}
		.shelf-overlay {
			display: block;
			position: fixed;
			inset: 0;
			background: rgba(0, 0, 0, 0.5);
			z-index: 199;
			opacity: 0;
			pointer-events: none;
			transition: opacity 0.25s ease;
		}
		.shelf-overlay.open {
			opacity: 1;
			pointer-events: auto;
		}
		.discoveries-container {
			display: none;
		}
	}
</style>
