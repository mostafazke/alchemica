import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import { sveltekit } from '@sveltejs/kit/vite';
import { VitePWA } from 'vite-plugin-pwa';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
	plugins: [
		tailwindcss(),
		basicSsl(),
		sveltekit(),
		VitePWA({
			registerType: 'autoUpdate',
			injectRegister: 'script',
			manifest: {
				name: 'Alchemica',
				short_name: 'Alchemica',
				description: 'Element combination puzzle game — discover all elements!',
				theme_color: '#0d1b2e',
				background_color: '#0d1b2e',
				display: 'standalone',
				display_override: ['window-controls-overlay', 'standalone', 'minimal-ui'],
				start_url: '/',
				lang: 'en',
				orientation: 'landscape',
				categories: ['games', 'entertainment'],
				icons: [
					{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
					{ src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
					{ src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
				],
				screenshots: [
					{
						src: '/screenshot-wide.png',
						sizes: '1280x800',
						type: 'image/png',
						form_factor: 'wide',
						label: 'Alchemica element lab — desktop',
					},
					{
						src: '/screenshot-narrow.png',
						sizes: '390x844',
						type: 'image/png',
						form_factor: 'narrow',
						label: 'Alchemica element lab — mobile',
					},
				],
				protocol_handlers: [
					{ protocol: 'web+alchemica', url: '/?share=%s' }
				]
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
				cleanupOutdatedCaches: true,
				clientsClaim: true,
				runtimeCaching: [
					{
						urlPattern: /\.mp3$/,
						handler: 'CacheFirst',
						options: {
							cacheName: 'audio-cache',
							expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 30 },
						},
					},
				],
			},
			devOptions: {
				enabled: true,
				type: 'module',
			}
		})
	],
	server: {
		https: true,
		host: true,
	},
	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'client',
					browser: {
						enabled: true,
						provider: playwright(),
						instances: [{ browser: 'chromium', headless: true }]
					},
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**']
				}
			},
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});

