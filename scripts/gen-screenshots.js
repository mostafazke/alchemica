/**
 * Capture PWA screenshots from the running dev server.
 * Usage: node scripts/gen-screenshots.js
 * Requires the dev server to be running on https://localhost:5173
 */

import { chromium } from 'playwright';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STATIC_DIR = join(__dirname, '..', 'static');

const SCREENSHOTS = [
  {
    name: 'screenshot-wide.png',
    width: 1280,
    height: 800,
    label: 'wide (desktop)',
  },
  {
    name: 'screenshot-narrow.png',
    width: 390,
    height: 844,
    label: 'narrow (mobile)',
  },
];

const URL = 'https://localhost:5173';

const browser = await chromium.launch();
const context = await browser.newContext({ ignoreHTTPSErrors: true });

for (const { name, width, height, label } of SCREENSHOTS) {
  const page = await context.newPage();
  await page.setViewportSize({ width, height });
  await page.goto(URL, { waitUntil: 'networkidle' });
  // Let fonts and particles settle
  await page.waitForTimeout(1500);
  const dest = join(STATIC_DIR, name);
  await page.screenshot({ path: dest, type: 'png' });
  console.log(`✓ ${label} → static/${name} (${width}×${height})`);
  await page.close();
}

await browser.close();
console.log('Done.');
