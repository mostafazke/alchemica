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
	import { BADGES } from '$lib/data/badges.js';

	onMount(() => {
		setBgmMuted(get(soundMuted));
		playBgm('/intro.mp3');
		const unsub = soundMuted.subscribe((m) => setBgmMuted(m));
		return () => { unsub(); stopBgm(); };
	});

	function play() {
		goto('/game');
	}

	function openDaily() {
		goto('/game');
	}

	function getCurrentTierAndProgress() {
		const discoveryCount = $discoveries.length;
		const currentBadge = BADGES.find((b) => b.threshold <= discoveryCount) || BADGES[0];
		const nextBadge = BADGES.find((b) => b.threshold > discoveryCount);

		if (nextBadge) {
			const progress = discoveryCount - (BADGES[BADGES.indexOf(currentBadge) - 1]?.threshold ?? 0);
			const needed = nextBadge.threshold - (BADGES[BADGES.indexOf(currentBadge) - 1]?.threshold ?? 0);
			return `${currentBadge.name} • ${progress}/${needed} to ${nextBadge.name}`;
		}
		return `${currentBadge.name} • Master`;
	}

	let discoverySheetOpen = $state(false);
	let achievementsOpen = $state(false);
	let activeTab = $state<'discoveries' | 'play' | 'badges' | 'leaderboard' | 'settings'>('play');

	let lastSeenCount = $state(
		typeof localStorage !== 'undefined'
			? Number(localStorage.getItem('alchemica_last_seen_discoveries') ?? 0)
			: 0
	);
	let unreadCount = $derived($discoveries.length - lastSeenCount);

	function openDiscoveries() {
		if (discoverySheetOpen) {
			discoverySheetOpen = false;
			return;
		}
		discoverySheetOpen = true;
		activeTab = 'discoveries';
		lastSeenCount = $discoveries.length;
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('alchemica_last_seen_discoveries', String($discoveries.length));
		}
	}

</script>

<main class="menu">
	<div class="brand">
		<div class="logo-mark" aria-hidden="true">⚗</div>
		<h1 class="title">Alchemica</h1>
		<p class="tagline">Combine elements. Discover the world.</p>
	</div>

	{#if $score > 0}
		<div class="score-section">
			<p class="score-stat">Score: {$score}</p>
			<p class="score-context">{getCurrentTierAndProgress()}</p>
		</div>
	{/if}

	<button class="daily-btn" onclick={openDaily} class:completed={$dailyCompleted}>
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
		<span class="arrow-icon">→</span>
	</button>

	<div class="spacer"></div>

	<BottomSheet open={discoverySheetOpen} onClose={() => { discoverySheetOpen = false; }}>
		<DiscoveryLog />
	</BottomSheet>

	<AchievementGallery open={achievementsOpen} onClose={() => achievementsOpen = false} />

	<!-- Bottom Navigation -->
	<nav class="bottom-nav">
		<button
			class="nav-tab"
			class:active={activeTab === 'discoveries'}
			onclick={openDiscoveries}
			aria-label={discoverySheetOpen ? 'Close discoveries' : 'View discoveries'}
		>
			<span class="nav-icon">{discoverySheetOpen ? '✕' : '📋'}</span>
			{#if unreadCount > 0 && !discoverySheetOpen}
				<span class="nav-badge">{unreadCount}</span>
			{/if}
		</button>

		<button
			class="nav-tab nav-play"
			class:active={activeTab === 'play'}
			onclick={() => { activeTab = 'play'; play(); }}
			aria-label={$discoveries.length > 0 || $score > 0 ? 'Resume game' : 'Play game'}
		>
			<span class="nav-icon">⚗</span>
			<span class="nav-label">{$discoveries.length > 0 || $score > 0 ? 'Resume' : 'Play'}</span>
		</button>

		<button
			class="nav-tab"
			class:active={activeTab === 'badges'}
			onclick={() => { achievementsOpen = true; activeTab = 'badges'; }}
			aria-label="View badges"
		>
			<span class="nav-icon">🏆</span>
		</button>

		<button
			class="nav-tab"
			class:active={activeTab === 'leaderboard'}
			onclick={() => { activeTab = 'leaderboard'; goto('/leaderboard'); }}
			aria-label="Weekly leaderboard"
		>
			<span class="nav-icon">🏅</span>
		</button>

		<button
			class="nav-tab"
			class:active={activeTab === 'settings'}
			onclick={() => { activeTab = 'settings'; goto('/settings'); }}
			aria-label="Settings"
		>
			<span class="nav-icon">⚙️</span>
		</button>
	</nav>
</main>

<style>
	.menu {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100dvh;
		background: #0d1b2e;
		padding: 1rem;
	}

	.brand {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		text-align: center;
		flex-shrink: 0;
	}

	.logo-mark {
		font-size: 2.5rem;
		line-height: 1;
		filter: drop-shadow(0 0 12px #c9a84c88);
	}

	.title {
		font-size: clamp(1.5rem, 5vw, 2.5rem);
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: #c9a84c;
		text-shadow: 0 0 24px #c9a84c55;
		margin: 0;
	}

	.tagline {
		font-size: clamp(0.65rem, 1.5vw, 0.85rem);
		color: #c8d8e8;
		opacity: 0.65;
		letter-spacing: 0.04em;
		margin: 0;
	}

	.score-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.15rem;
		margin-top: 0.75rem;
		flex-shrink: 0;
	}

	.score-stat {
		font-family: 'Space Mono', monospace;
		font-size: 0.75rem;
		color: #4af0c0;
		margin: 0;
		opacity: 0.9;
		font-weight: 600;
	}

	.score-context {
		font-family: 'Space Mono', monospace;
		font-size: 0.6rem;
		color: #8ab4d4;
		margin: 0;
		opacity: 0.7;
		letter-spacing: 0.03em;
	}

	/* Daily challenge button — now interactive */
	.daily-btn {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.65rem 1rem;
		background: transparent;
		border: 2px solid #c9a84c60;
		border-radius: 8px;
		min-width: 180px;
		max-width: 240px;
		cursor: pointer;
		transition: all 0.15s ease;
		-webkit-tap-highlight-color: transparent;
		touch-action: manipulation;
		margin-top: 1rem;
		flex-shrink: 0;
	}

	.daily-btn:hover {
		border-color: #c9a84c;
		background: #c9a84c08;
	}

	.daily-btn:active {
		transform: scale(0.98);
	}

	.daily-btn.completed {
		border-color: #4af0c060;
	}

	.daily-btn.completed:hover {
		border-color: #4af0c0;
		background: #4af0c008;
	}

	.daily-icon {
		font-size: 1.25rem;
		line-height: 1;
		flex-shrink: 0;
	}

	.daily-info {
		display: flex;
		flex-direction: column;
		gap: 2px;
		flex: 1;
		text-align: left;
	}

	.daily-label {
		font-family: 'Space Mono', monospace;
		font-size: 8px;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		color: #c9a84c;
	}

	.daily-status {
		font-size: 12px;
		color: #c8d8e8;
	}

	.daily-btn.completed .daily-status { color: #4af0c0; }
	.completed-text { color: #4af0c0; }

	.arrow-icon {
		font-size: 1rem;
		color: #c9a84c;
		flex-shrink: 0;
		opacity: 0.6;
		transition: opacity 0.15s ease;
	}

	.daily-btn:hover .arrow-icon {
		opacity: 1;
	}

	.spacer {
		flex: 1;
	}

	/* Bottom Navigation */
	.bottom-nav {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0;
		width: 100%;
		margin: 0 -1rem -1rem;
		padding: 0.5rem 0.5rem 0.75rem;
		flex-shrink: 0;
		background: linear-gradient(to bottom, transparent, #0d1b2e);
	}

	.nav-tab {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.2rem;
		padding: 0.6rem 1rem;
		min-width: 52px;
		min-height: 52px;
		background: transparent;
		border: none;
		cursor: pointer;
		color: #8ab4d4;
		transition: color 0.15s ease;
		-webkit-tap-highlight-color: transparent;
		touch-action: manipulation;
		border-bottom: 2px solid transparent;
	}

	.nav-tab:hover {
		color: #c8d8e8;
	}

	.nav-tab.active {
		color: #c9a84c;
		border-bottom-color: #c9a84c;
	}

	.nav-icon {
		font-size: 1.3rem;
		line-height: 1;
	}

	.nav-label {
		font-size: 0.55rem;
		font-family: 'Space Mono', monospace;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		font-weight: 500;
	}

	.nav-badge {
		position: absolute;
		top: 2px;
		right: 2px;
		background: #4af0c0;
		color: #0d1b2e;
		font-size: 10px;
		font-weight: 700;
		border-radius: 10px;
		padding: 1px 5px;
		min-width: 18px;
		text-align: center;
	}

	.nav-play {
		position: relative;
		background: linear-gradient(135deg, #c9a84c, #d9b85c);
		border-radius: 12px;
		color: #0d1b2e;
		margin: 0 0.75rem;
		min-width: 62px;
		box-shadow: 0 4px 12px #c9a84c30;
		border-bottom: none;
	}

	.nav-play:hover {
		background: linear-gradient(135deg, #d9b85c, #e8c76d);
		color: #0d1b2e;
		box-shadow: 0 6px 16px #c9a84c40;
	}

	.nav-play:active {
		transform: scale(0.96);
	}

	.nav-play.active {
		color: #0d1b2e;
		border-bottom-color: transparent;
	}

</style>
