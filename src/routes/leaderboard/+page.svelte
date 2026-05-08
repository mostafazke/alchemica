<script lang="ts">
	import { goto } from '$app/navigation';
	import { leaderboard, getPlayerName } from '$lib/stores/leaderboard.js';

	const TROPHY: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

	const playerName = getPlayerName();

	// Week label: "May 5 – May 11"
	function getWeekLabel(): string {
		const now = new Date();
		const dow = now.getUTCDay();
		const daysBack = (dow + 6) % 7;
		const mon = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - daysBack));
		const sun = new Date(mon);
		sun.setUTCDate(sun.getUTCDate() + 6);
		const fmt = (d: Date) =>
			d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
		return `${fmt(mon)} – ${fmt(sun)}`;
	}
</script>

<div class="lb-page">
	<header class="lb-header">
		<button class="back-btn" onclick={() => goto('/')} aria-label="Back to menu">← Back</button>
		<div class="lb-title-block">
			<span class="lb-icon">🏅</span>
			<span class="lb-title">This Week</span>
		</div>
		<div class="lb-week">{getWeekLabel()}</div>
	</header>

	<div class="lb-v1-badge">🔒 v1: local scores only</div>

	<div class="lb-body">
		<div class="lb-your-name">You: <span class="player-name-text">{playerName}</span></div>

		<ol class="lb-list" aria-label="Weekly leaderboard">
			{#each $leaderboard as entry (entry.name + entry.isPlayer)}
				<li
					class="lb-row"
					class:lb-row--player={entry.isPlayer}
					class:lb-row--top3={entry.rank <= 3}
				>
					<span class="lb-rank">
						{#if TROPHY[entry.rank]}
							{TROPHY[entry.rank]}
						{:else}
							{entry.rank}
						{/if}
					</span>
					<span class="lb-name">{entry.name}{#if entry.isPlayer} <span class="you-tag">(you)</span>{/if}</span>
					<span class="lb-count">{entry.weeklyCount} <span class="count-label">disc.</span></span>
				</li>
			{/each}
		</ol>

		<p class="lb-reset-note">Resets every Monday at 00:00 UTC</p>
	</div>
</div>

<style>
	.lb-page {
		display: flex;
		flex-direction: column;
		height: 100dvh;
		background: #0d1b2e;
		color: #c8d8e8;
		font-family: 'Space Mono', monospace;
		overflow: hidden;
	}

	/* ── Header ─────────────────────────────────────────────── */
	.lb-header {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		padding: 16px 16px 8px;
		border-bottom: 1px solid #1a2e4a;
		flex-shrink: 0;
		position: relative;
	}
	.back-btn {
		position: absolute;
		left: 12px;
		top: 14px;
		background: transparent;
		border: 1px solid #1a2e4a;
		border-radius: 6px;
		color: #4a6080;
		font-family: 'Space Mono', monospace;
		font-size: 11px;
		padding: 6px 10px;
		cursor: pointer;
		touch-action: manipulation;
		transition: color 0.15s, border-color 0.15s;
	}
	.back-btn:hover { color: #4af0c0; border-color: #4af0c060; }
	.lb-title-block {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.lb-icon { font-size: 22px; line-height: 1; }
	.lb-title {
		font-size: 16px;
		font-weight: 700;
		letter-spacing: 0.08em;
		color: #c9a84c;
	}
	.lb-week {
		font-size: 11px;
		color: #4a6080;
	}

	/* ── v1 badge ───────────────────────────────────────────── */
	.lb-v1-badge {
		text-align: center;
		font-size: 10px;
		color: #4a5a60;
		padding: 4px 12px;
		background: #080f1a;
		border-bottom: 1px solid #111f30;
		flex-shrink: 0;
	}

	/* ── Body ───────────────────────────────────────────────── */
	.lb-body {
		flex: 1;
		overflow-y: auto;
		padding: 12px 16px 24px;
		-webkit-overflow-scrolling: touch;
	}
	.lb-your-name {
		font-size: 11px;
		color: #4a6080;
		margin-bottom: 12px;
		text-align: center;
	}
	.player-name-text {
		color: #4af0c0;
	}

	/* ── List ───────────────────────────────────────────────── */
	.lb-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 6px;
		max-width: 480px;
		margin-inline: auto;
	}
	.lb-row {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 10px 12px;
		background: #080f1a;
		border: 1px solid #1a2e4a;
		border-radius: 8px;
		transition: border-color 0.15s;
	}
	.lb-row--player {
		border-color: #4af0c060;
		background: #0b1e18;
	}
	.lb-row--top3.lb-row:not(.lb-row--player) {
		border-color: #c9a84c40;
	}
	.lb-rank {
		font-size: 14px;
		min-width: 28px;
		text-align: center;
		flex-shrink: 0;
		color: #4a6080;
		font-weight: 700;
	}
	.lb-row--top3 .lb-rank { font-size: 18px; }
	.lb-row--player .lb-rank { color: #4af0c0; }
	.lb-name {
		flex: 1;
		font-size: 12px;
		color: #8ab4d4;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.lb-row--player .lb-name { color: #4af0c0; }
	.you-tag {
		font-size: 10px;
		color: #4af0c080;
	}
	.lb-count {
		flex-shrink: 0;
		font-size: 13px;
		font-weight: 700;
		color: #c8d8e8;
	}
	.lb-row--player .lb-count { color: #4af0c0; }
	.count-label {
		font-size: 9px;
		color: #4a6080;
		font-weight: 400;
	}

	/* ── Footer note ────────────────────────────────────────── */
	.lb-reset-note {
		text-align: center;
		font-size: 10px;
		color: #2a3a50;
		margin-top: 20px;
	}
</style>
