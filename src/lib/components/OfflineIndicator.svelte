<script lang="ts">
	let online = $state(typeof navigator !== 'undefined' ? navigator.onLine : true);
	let showReconnected = $state(false);
	let reconnectedTimer: ReturnType<typeof setTimeout> | null = null;

	$effect(() => {
		function handleOnline() {
			online = true;
			showReconnected = true;
			if (reconnectedTimer) clearTimeout(reconnectedTimer);
			reconnectedTimer = setTimeout(() => {
				showReconnected = false;
			}, 2000);
		}

		function handleOffline() {
			online = false;
			showReconnected = false;
			if (reconnectedTimer) clearTimeout(reconnectedTimer);
		}

		window.addEventListener('online', handleOnline);
		window.addEventListener('offline', handleOffline);

		return () => {
			window.removeEventListener('online', handleOnline);
			window.removeEventListener('offline', handleOffline);
			if (reconnectedTimer) clearTimeout(reconnectedTimer);
		};
	});
</script>

{#if !online}
	<div class="offline-toast" role="status" aria-live="polite">
		⚡ Playing offline
	</div>
{:else if showReconnected}
	<div class="offline-toast online" role="status" aria-live="polite">
		✓ Back online
	</div>
{/if}

<style>
	.offline-toast {
		position: fixed;
		bottom: calc(80px + env(safe-area-inset-bottom, 0px));
		left: 50%;
		transform: translateX(-50%);
		background: var(--color-bg-surface);
		border: 1px solid var(--color-border-active);
		color: var(--color-accent);
		font-size: 0.8rem;
		font-weight: 600;
		padding: 6px 16px;
		border-radius: 20px;
		z-index: 9999;
		pointer-events: none;
		white-space: nowrap;
		backdrop-filter: blur(4px);
		box-shadow: 0 2px 12px var(--material-brass-shadow);
		animation: fade-in 0.2s ease;
	}

	.offline-toast.online {
		border-color: rgba(80, 140, 70, 0.45);
		color: #5a8050;
	}

	@keyframes fade-in {
		from { opacity: 0; transform: translateX(-50%) translateY(8px); }
		to   { opacity: 1; transform: translateX(-50%) translateY(0); }
	}
</style>
