<script lang="ts">
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import TopBar from '$lib/components/TopBar.svelte';
	import ElementGrid from '$lib/components/ElementGrid.svelte';
	import MixingChamber from '$lib/components/MixingChamber.svelte';
	import AchievementToast from '$lib/components/AchievementToast.svelte';
	import FirstRunOverlay from '$lib/components/FirstRunOverlay.svelte';
	import DiscoveryBanner from '$lib/components/DiscoveryBanner.svelte';
	import StuckHintPrompt from '$lib/components/StuckHintPrompt.svelte';
	import { soundMuted } from '$lib/stores/settings.js';
	import { playBgm, stopBgm, setBgmMuted } from '$lib/effects/bgm.js';

	onMount(() => {
		setBgmMuted(get(soundMuted));
		playBgm('/game.mp3');
		const unsub = soundMuted.subscribe((m) => setBgmMuted(m));
		return () => { unsub(); stopBgm(); };
	});
</script>

<div class="app">
	<TopBar />
	<div class="lab-wrapper">
		<div class="left-panel">
			<DiscoveryBanner />
			<ElementGrid />
		</div>
		<div class="right-panel">
			<MixingChamber />
		</div>
	</div>
	<AchievementToast />
	<FirstRunOverlay />
	<StuckHintPrompt />
</div>

<style>
	.app {
		display: grid;
		grid-template-rows: auto 1fr;
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
		position: relative;
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
