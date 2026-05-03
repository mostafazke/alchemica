<script lang="ts">
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import TopBar from '$lib/components/TopBar.svelte';
	import ElementGrid from '$lib/components/ElementGrid.svelte';
	import MixingChamber from '$lib/components/MixingChamber.svelte';
	import DiscoveryLog from '$lib/components/DiscoveryLog.svelte';
	import BottomBar from '$lib/components/BottomBar.svelte';
	import BottomSheet from '$lib/components/BottomSheet.svelte';
	import SettingsPanel from '$lib/components/SettingsPanel.svelte';
	import AchievementGallery from '$lib/components/AchievementGallery.svelte';
	import AchievementToast from '$lib/components/AchievementToast.svelte';
	import { soundMuted } from '$lib/stores/settings.js';
	import { playBgm, stopBgm, setBgmMuted } from '$lib/effects/bgm.js';

	onMount(() => {
		setBgmMuted(get(soundMuted));
		playBgm('/game.mp3');
		const unsub = soundMuted.subscribe((m) => setBgmMuted(m));
		return () => { unsub(); stopBgm(); };
	});

	let discoverySheetOpen = $state(false);
	let settingsOpen = $state(false);
	let achievementsOpen = $state(false);
</script>

<div class="app">
	<TopBar />
	<div class="lab-wrapper">
		<div class="left-panel">
			<ElementGrid />
		</div>
		<div class="right-panel">
			<MixingChamber />
		</div>
	</div>
	<BottomBar
		{discoverySheetOpen}
		onToggleDiscoveries={() => discoverySheetOpen = !discoverySheetOpen}
		{achievementsOpen}
		onToggleAchievements={() => achievementsOpen = !achievementsOpen}
		{settingsOpen}
		onToggleSettings={() => settingsOpen = !settingsOpen}
	/>
	<BottomSheet open={discoverySheetOpen} onClose={() => discoverySheetOpen = false}>
		<DiscoveryLog />
	</BottomSheet>
	<SettingsPanel open={settingsOpen} onClose={() => settingsOpen = false} />
	<AchievementGallery open={achievementsOpen} onClose={() => achievementsOpen = false} />
	<AchievementToast />
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
		grid-template-columns: 55fr 45fr;
		overflow: hidden;
		min-height: 0;
	}
	.left-panel {
		overflow: hidden;
		min-height: 0;
	}
	.right-panel {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		min-height: 0;
		align-items: center;
		border-left: 1px solid #1a2e4a;
	}
</style>
