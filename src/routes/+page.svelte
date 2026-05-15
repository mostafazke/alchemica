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

	function toggleSound() {
		soundMuted.update((m) => !m);
	}

	function getCurrentTierAndProgress() {
		const discoveryCount = $discoveries.length;
		const currentBadge = BADGES.find((b) => b.threshold <= discoveryCount) || BADGES[0];
		const nextBadge = BADGES.find((b) => b.threshold > discoveryCount);

		if (nextBadge) {
			const progress = discoveryCount - (BADGES[BADGES.indexOf(currentBadge) - 1]?.threshold ?? 0);
			const needed = nextBadge.threshold - (BADGES[BADGES.indexOf(currentBadge) - 1]?.threshold ?? 0);
			return `${currentBadge.name} · ${progress}/${needed} to ${nextBadge.name}`;
		}
		return `${currentBadge.name} · Master Alchemist`;
	}

	let discoverySheetOpen = $state(false);
	let achievementsOpen = $state(false);

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
		lastSeenCount = $discoveries.length;
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('alchemica_last_seen_discoveries', String($discoveries.length));
		}
	}
</script>

<main class="menu">

	<!-- Top bar: sound toggle (left) + settings (right) -->
	<header class="top-bar">
		<button class="icon-btn" onclick={toggleSound} aria-label="Toggle sound">
			{$soundMuted ? '🔇' : '🔊'}
		</button>
		<button class="icon-btn" onclick={() => goto('/settings')} aria-label="Settings">
			⚙️
		</button>
	</header>

	<!-- Brand -->
	<div class="brand">
		<div class="logo-mark" aria-hidden="true">⚗</div>
		<h1 class="title">Alchemica</h1>
		<p class="tagline">Combine elements. Discover the world.</p>
	</div>

	<!-- Flex spacer pushes CTAs toward the center/lower half -->
	<div class="spacer"></div>

	<!-- Score & tier progress (only when player has started) -->
	{#if $score > 0}
		<div class="score-section">
			<p class="score-stat">{$score} pts</p>
			<p class="score-context">{getCurrentTierAndProgress()}</p>
		</div>
	{/if}

	<!-- Primary CTA -->
	<button class="play-btn" onclick={play}>
		<span class="play-icon">⚗</span>
		{$discoveries.length > 0 || $score > 0 ? 'Resume Game' : 'Play'}
	</button>

	<!-- Daily challenge -->
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

	<!-- Secondary actions grid -->
	<div class="secondary-grid">
		<button class="secondary-card" onclick={openDiscoveries} aria-label={discoverySheetOpen ? 'Close discoveries' : 'View discoveries'}>
			<span class="secondary-icon">{discoverySheetOpen ? '✕' : '📋'}</span>
			<span class="secondary-label">Discoveries</span>
			{#if unreadCount > 0 && !discoverySheetOpen}
				<span class="secondary-badge">{unreadCount}</span>
			{/if}
		</button>
		<button class="secondary-card" onclick={() => { achievementsOpen = true; }} aria-label="View badges">
			<span class="secondary-icon">🏆</span>
			<span class="secondary-label">Badges</span>
		</button>
		<button class="secondary-card" onclick={() => goto('/leaderboard')} aria-label="Weekly leaderboard">
			<span class="secondary-icon">🏅</span>
			<span class="secondary-label">Ranking</span>
		</button>
	</div>

	<BottomSheet open={discoverySheetOpen} onClose={() => { discoverySheetOpen = false; }}>
		<DiscoveryLog />
	</BottomSheet>

	<AchievementGallery open={achievementsOpen} onClose={() => achievementsOpen = false} />

</main>

<style>
	.menu {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100dvh;
		background: var(--color-bg-deep);
		padding:
			calc(0.75rem + env(safe-area-inset-top, 0px))
			1.25rem
			calc(1.25rem + env(safe-area-inset-bottom, 0px));
		gap: 0.75rem;
		overflow: hidden;
	}

	/* ── Top bar ─────────────────────────────────────── */
	.top-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		flex-shrink: 0;
	}

	.icon-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		background: var(--color-accent-dim);
		border: 1px solid var(--color-border-subtle);
		border-radius: var(--radius-lg);
		font-size: 1.1rem;
		cursor: pointer;
		color: var(--color-text-secondary);
		transition: background 0.15s, border-color 0.15s;
		-webkit-tap-highlight-color: transparent;
		touch-action: manipulation;
	}

	.icon-btn:hover {
		background: var(--color-bg-hover);
		border-color: var(--color-border-active);
	}

	.icon-btn:active {
		transform: scale(0.94);
	}

	/* ── Brand ───────────────────────────────────────── */
	.brand {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.35rem;
		text-align: center;
		flex-shrink: 0;
	}

	.logo-mark {
		font-size: clamp(2rem, 6vw, 3rem);
		line-height: 1;
		filter: drop-shadow(0 0 10px color-mix(in srgb, var(--raw-brass-500) 50%, transparent));
	}

	.title {
		font-size: clamp(1.5rem, 5vw, 2.5rem);
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--raw-brass-500);
		text-shadow: 0 0 20px color-mix(in srgb, var(--raw-brass-500) 30%, transparent);
		margin: 0;
	}

	.tagline {
		font-size: clamp(0.65rem, 1.8vw, 0.8rem);
		color: var(--color-text-muted);
		letter-spacing: 0.04em;
		margin: 0;
	}

	/* ── Spacer ──────────────────────────────────────── */
	.spacer {
		flex: 1;
		min-height: 0.5rem;
		max-height: 3rem;
	}

	/* ── Score ───────────────────────────────────────── */
	.score-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.1rem;
		flex-shrink: 0;
	}

	.score-stat {
		font-family: 'Space Mono', monospace;
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--color-accent-text);
		margin: 0;
	}

	.score-context {
		font-family: 'Space Mono', monospace;
		font-size: 0.6rem;
		color: var(--color-text-muted);
		margin: 0;
		letter-spacing: 0.02em;
	}

	/* ── Primary CTA ─────────────────────────────────── */
	.play-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.6rem;
		padding: 0.95rem 1.5rem;
		width: min(320px, 100%);
		background: linear-gradient(135deg, var(--raw-brass-700), var(--raw-brass-500));
		color: var(--raw-ink-900);
		font-family: 'Space Mono', monospace;
		font-size: 1rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		border: none;
		border-radius: var(--radius-xl);
		cursor: pointer;
		box-shadow: 0 6px 20px color-mix(in srgb, var(--raw-brass-700) 35%, transparent);
		transition: all 0.15s ease;
		-webkit-tap-highlight-color: transparent;
		touch-action: manipulation;
		flex-shrink: 0;
	}

	.play-btn:hover {
		background: linear-gradient(135deg, var(--raw-brass-500), var(--raw-brass-300));
		box-shadow: 0 8px 28px color-mix(in srgb, var(--raw-brass-700) 50%, transparent);
		transform: translateY(-1px);
	}

	.play-btn:active {
		transform: scale(0.97);
		box-shadow: 0 3px 12px color-mix(in srgb, var(--raw-brass-700) 30%, transparent);
	}

	.play-icon {
		font-size: 1.15rem;
		line-height: 1;
	}

	/* ── Daily challenge ─────────────────────────────── */
	.daily-btn {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.65rem 1rem;
		width: min(320px, 100%);
		background: transparent;
		border: 1.5px solid var(--color-border-mid);
		border-radius: var(--radius-lg);
		cursor: pointer;
		transition: border-color 0.15s, background 0.15s;
		-webkit-tap-highlight-color: transparent;
		touch-action: manipulation;
		flex-shrink: 0;
	}

	.daily-btn:hover {
		border-color: var(--color-border-hot);
		background: var(--color-accent-dim);
	}

	.daily-btn:active {
		transform: scale(0.98);
	}

	.daily-btn.completed {
		border-color: var(--color-border-active);
	}

	.daily-icon {
		font-size: 1.2rem;
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
		font-size: 9px;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		color: var(--color-accent-text);
	}

	.daily-status {
		font-size: 12px;
		color: var(--color-text-primary);
	}

	.completed-text { color: var(--color-accent-text); }

	.arrow-icon {
		font-size: 1rem;
		color: var(--color-text-muted);
		flex-shrink: 0;
		transition: color 0.15s, transform 0.15s;
	}

	.daily-btn:hover .arrow-icon {
		color: var(--color-accent-text);
		transform: translateX(2px);
	}

	/* ── Secondary grid ──────────────────────────────── */
	.secondary-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.5rem;
		width: min(320px, 100%);
		flex-shrink: 0;
	}

	.secondary-card {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.3rem;
		padding: 0.75rem 0.5rem;
		background: var(--color-bg-surface);
		border: 1px solid var(--color-border-subtle);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: border-color 0.15s, background 0.15s;
		-webkit-tap-highlight-color: transparent;
		touch-action: manipulation;
	}

	.secondary-card:hover {
		border-color: var(--color-border-mid);
		background: var(--color-bg-raised);
	}

	.secondary-card:active {
		transform: scale(0.96);
	}

	.secondary-icon {
		font-size: 1.4rem;
		line-height: 1;
	}

	.secondary-label {
		font-family: 'Space Mono', monospace;
		font-size: 9px;
		text-transform: uppercase;
		letter-spacing: 0.4px;
		color: var(--color-text-muted);
		white-space: nowrap;
	}

	.secondary-badge {
		position: absolute;
		top: 4px;
		right: 4px;
		background: var(--color-accent);
		color: #fff;
		font-size: 9px;
		font-weight: 700;
		border-radius: 10px;
		padding: 1px 5px;
		min-width: 16px;
		text-align: center;
		line-height: 1.4;
	}
</style>
