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
		background: rgba(13, 27, 46, 0.92);
		border: 1px solid rgba(232, 184, 75, 0.5);
		color: #e8b84b;
		font-size: 0.8rem;
		font-weight: 600;
		padding: 6px 16px;
		border-radius: 20px;
		z-index: 9999;
		pointer-events: none;
		white-space: nowrap;
		backdrop-filter: blur(4px);
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
		animation: fade-in 0.2s ease;
	}

	.offline-toast.online {
		border-color: rgba(100, 200, 120, 0.5);
		color: #6cc87a;
	}

	@keyframes fade-in {
		from { opacity: 0; transform: translateX(-50%) translateY(8px); }
		to   { opacity: 1; transform: translateX(-50%) translateY(0); }
	}
</style>
