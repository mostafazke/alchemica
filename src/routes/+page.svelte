<script lang="ts">
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { goto } from '$app/navigation';
	import { soundMuted } from '$lib/stores/settings.js';
	import { playBgm, stopBgm, setBgmMuted } from '$lib/effects/bgm.js';
	import BottomSheet from '$lib/components/BottomSheet.svelte';
	import DiscoveryLog from '$lib/components/DiscoveryLog.svelte';
	import AchievementGallery from '$lib/components/AchievementGallery.svelte';
	import { discoveries, score } from '$lib/stores/game.js';
	import { dailyChallengeTarget, dailyCompleted } from '$lib/stores/daily.js';
	import { ELEMENTS } from '$lib/data/elements.js';

	onMount(() => {
		setBgmMuted(get(soundMuted));
		playBgm('/intro.mp3');
		const unsub = soundMuted.subscribe((m) => setBgmMuted(m));
		return () => { unsub(); stopBgm(); };
	});

	function play() {
		goto('/game');
	}

	let discoverySheetOpen = $state(false);
	let achievementsOpen = $state(false);

</script>

<main class="menu">
	<div class="brand">
		<div class="logo-mark" aria-hidden="true">⚗</div>
		<h1 class="title">Alchemica</h1>
		<p class="tagline">Combine elements. Discover the world.</p>
	</div>

	<button class="play-btn" onclick={play}>
		{$discoveries.length > 0 || $score > 0 ? 'Resume' : 'Play'}
	</button>

	{#if $score > 0}
		<p class="score-stat">Score: {$score}</p>
	{/if}

	<div class="daily-card" class:completed={$dailyCompleted}>
		{#if $dailyCompleted}
			<span class="daily-icon">✓</span>
			<div class="daily-info">
				<span class="daily-label">Daily Challenge</span>
				<span class="daily-status completed-text">Completed today</span>
			</div>
		{:else}
			<span class="daily-icon">⚗</span>
			<div class="daily-info">
				<span class="daily-label">Daily Challenge</span>
				<span class="daily-status">{ELEMENTS[$dailyChallengeTarget]?.name ?? $dailyChallengeTarget} available</span>
			</div>
		{/if}
	</div>

	<div class="menu-actions">
		<button class="menu-action-btn" onclick={() => discoverySheetOpen = true} aria-label="View discoveries">
			📋 Discoveries
			{#if $discoveries.length > 0}
				<span class="badge">{$discoveries.length}</span>
			{/if}
		</button>
		<button class="menu-action-btn" onclick={() => achievementsOpen = true} aria-label="View badges">
			🏆 Badges
		</button>
		<button class="menu-action-btn" onclick={() => goto('/settings')} aria-label="Open settings">
			⚙ Settings
		</button>
	</div>

	<BottomSheet open={discoverySheetOpen} onClose={() => discoverySheetOpen = false}>
		<DiscoveryLog />
	</BottomSheet>

	<AchievementGallery open={achievementsOpen} onClose={() => achievementsOpen = false} />
</main>

<style>
	.menu {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100dvh;
		gap: 1.5rem;
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
		min-height: 52px;
	}

	.play-btn:hover { background: #d9b85c; }
	.play-btn:active { transform: scale(0.97); background: #b8973b; }

	.score-stat {
		font-family: 'Space Mono', monospace;
		font-size: 0.8rem;
		color: #4af0c0;
		margin: 0;
		opacity: 0.8;
	}

	/* Daily challenge card — gold accent to distinguish from action buttons */
	.daily-card {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1.25rem;
		background: #0f1e0a;
		border: 1px solid #c9a84c60;
		border-radius: 12px;
		min-width: 220px;
		max-width: 280px;
		box-shadow: 0 0 12px #c9a84c18;
	}
	.daily-card.completed {
		background: #0a1a12;
		border-color: #4af0c060;
		box-shadow: 0 0 12px #4af0c018;
	}
	.daily-icon {
		font-size: 1.5rem;
		line-height: 1;
		flex-shrink: 0;
	}
	.daily-info {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.daily-label {
		font-family: 'Space Mono', monospace;
		font-size: 9px;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		color: #c9a84c;
	}
	.daily-status {
		font-size: 13px;
		color: #c8d8e8;
	}
	.daily-card.completed .daily-status { color: #4af0c0; }
	.completed-text { color: #4af0c0; }

	/* Action buttons row — Discoveries, Badges, Settings all share same style */
	.menu-actions {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
		justify-content: center;
	}
	.menu-action-btn {
		position: relative;
		padding: 0.6rem 1.2rem;
		min-height: 44px;
		font-family: 'Space Mono', monospace;
		font-size: 0.75rem;
		letter-spacing: 0.05em;
		color: #8ab4d4;
		background: transparent;
		border: 1px solid #1a3a5a;
		border-radius: 8px;
		cursor: pointer;
		touch-action: manipulation;
		transition: border-color 0.15s, color 0.15s;
		-webkit-tap-highlight-color: transparent;
	}
	.menu-action-btn:hover {
		border-color: #4af0c040;
		color: #c8d8e8;
	}
	.badge {
		position: absolute;
		top: -6px;
		right: -6px;
		background: #4af0c0;
		color: #0d1b2e;
		font-size: 10px;
		font-weight: 700;
		border-radius: 10px;
		padding: 1px 5px;
		min-width: 18px;
		text-align: center;
	}
</style>
