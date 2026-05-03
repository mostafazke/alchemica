<script lang="ts">
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { goto } from '$app/navigation';
	import { soundMuted } from '$lib/stores/settings.js';
	import { playBgm, stopBgm, setBgmMuted } from '$lib/effects/bgm.js';

	onMount(() => {
		setBgmMuted(get(soundMuted));
		playBgm('/intro.mp3');
		const unsub = soundMuted.subscribe((m) => setBgmMuted(m));
		return () => { unsub(); stopBgm(); };
	});

	function play() {
		goto('/game');
	}
</script>

<main class="menu">
	<div class="brand">
		<div class="logo-mark" aria-hidden="true">⚗</div>
		<h1 class="title">Alchemica</h1>
		<p class="tagline">Combine elements. Discover the world.</p>
	</div>

	<button class="play-btn" onclick={play}>
		Play
	</button>
</main>

<style>
	.menu {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100dvh;
		gap: 2.5rem;
		background: #0d1b2e;
		padding: 2rem;
	}

	.brand {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		text-align: center;
	}

	.logo-mark {
		font-size: 3.5rem;
		line-height: 1;
		filter: drop-shadow(0 0 12px #c9a84c88);
	}

	.title {
		font-size: clamp(2rem, 6vw, 3.5rem);
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: #c9a84c;
		text-shadow: 0 0 24px #c9a84c55;
		margin: 0;
	}

	.tagline {
		font-size: clamp(0.8rem, 2vw, 1rem);
		color: #c8d8e8;
		opacity: 0.65;
		letter-spacing: 0.04em;
		margin: 0;
	}

	.play-btn {
		min-width: 160px;
		padding: 0.9rem 2.5rem;
		font-size: 1.1rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #0d1b2e;
		background: #c9a84c;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		transition: background 150ms ease, transform 100ms ease;
		-webkit-tap-highlight-color: transparent;
		touch-action: manipulation;
		/* 44px minimum touch target (Apple HIG) */
		min-height: 52px;
	}

	.play-btn:hover {
		background: #d9b85c;
	}

	.play-btn:active {
		transform: scale(0.97);
		background: #b8973b;
	}
</style>
