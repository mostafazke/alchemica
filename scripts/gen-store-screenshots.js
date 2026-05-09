/**
 * Generate App Store & Google Play screenshots from the running dev server.
 * Usage: node scripts/gen-store-screenshots.js
 * Requires the dev server to be running (auto-detects port 5173 or 5174).
 *
 * Approach: The game is landscape-only (portrait shows "rotate device"), so we:
 * 1. Render the game at 1280×800 landscape viewport
 * 2. Take a PNG screenshot of the game
 * 3. Compose a portrait store screenshot: headline (top) + game image (center)
 *
 * Produces 5 portrait screenshots at two sizes:
 *   - App Store:   1290×2796  (iPhone 6.7")
 *   - Google Play:  1080×1920
 */

import { chromium } from 'playwright';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STATIC_DIR = join(__dirname, '..', 'static');

/** Try to connect to the dev server on common ports. */
async function detectPort() {
  for (const port of [5173, 5174, 5175, 4173]) {
    try {
      await new Promise((resolve, reject) => {
        const req = https.get(`https://localhost:${port}/`, { rejectUnauthorized: false, timeout: 2000 }, (res) => {
          res.resume();
          resolve(port);
        });
        req.on('error', reject);
        req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
      });
      return port;
    } catch { /* try next */ }
  }
  throw new Error('Dev server not found on ports 5173-5175 or 4173. Start it with: npm run dev');
}

const PORT = await detectPort();
const BASE_URL = `https://localhost:${PORT}`;
console.log(`Using dev server at ${BASE_URL}`);

// ──────────────────────────────────────────────
// Game state helpers
// ──────────────────────────────────────────────

const BASIC_ELEMENTS = ['fire', 'water', 'earth', 'air'];

const MODERATE_ELEMENTS = [
  ...BASIC_ELEMENTS,
  'steam', 'mud', 'dust', 'lava', 'wind', 'plasma', 'cloud',
  'rain', 'iron', 'salt', 'ice',
];

const RICH_ELEMENTS = [
  ...MODERATE_ELEMENTS,
  'smoke', 'glass', 'sand', 'volcano', 'oxygen', 'hydrogen',
  'storm', 'obsidian', 'rust', 'crystal', 'lightning',
  'acid_rain', 'magnet', 'rainbow', 'sunlight', 'stone', 'fog',
  'snow', 'flood', 'wood', 'ash', 'coal', 'carbon', 'steel',
  'clay', 'brick', 'sulfur', 'acid', 'copper', 'bronze', 'gold',
  'plant', 'seed', 'tree', 'oil', 'plastic', 'explosion',
  'rocket', 'electricity', 'motor',
];

const DISCOVERY_ELEMENTS = [...BASIC_ELEMENTS, 'steam', 'mud', 'dust', 'lava'];

function makeSaveData(elements, opts = {}) {
  const { score = 100, streakCount = 0, lastCompletedDate = null, achievements = [], hintBalance = 0 } = opts;
  const discoveries = elements
    .filter((e) => !BASIC_ELEMENTS.includes(e))
    .map((key, i) => ({ key, index: i, time: Date.now() - (elements.length - i) * 60000 }));
  return JSON.stringify({
    version: 3,
    data: { unlockedElements: elements, discoveries, score, earnedAchievements: achievements, streakCount, lastCompletedDate, hintBalance, purchasedNoAds: false },
  });
}

function getTodayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// ──────────────────────────────────────────────
// Screenshot configs
// ──────────────────────────────────────────────

const STORE_SIZES = [
  { suffix: 'appstore', width: 1290, height: 2796 },
  { suffix: 'googleplay', width: 1080, height: 1920 },
];

const GAME_WIDTH = 1280;
const GAME_HEIGHT = 800;

const SCREENSHOTS = [
  {
    id: 1,
    headline: 'Discover 300+ elements<br>through real science',
    seed: (p) => seedState(p, DISCOVERY_ELEMENTS, { score: 250 }),
    afterLoad: triggerDiscoveryBanner,
  },
  {
    id: 2,
    headline: 'A new science challenge<br>every day',
    seed: (p) => seedState(p, MODERATE_ELEMENTS, { score: 1200, streakCount: 14, lastCompletedDate: getTodayStr(), achievements: ['badge_10'] }),
    afterLoad: openDailyPanel,
  },
  {
    id: 3,
    headline: 'Earn achievements.<br>Explore everything.',
    seed: (p) => seedState(p, RICH_ELEMENTS, { score: 5000, streakCount: 7, achievements: ['badge_10', 'badge_25', 'badge_50'] }),
    afterLoad: openAchievements,
  },
  {
    id: 4,
    headline: '300+ elements to discover',
    seed: (p) => seedState(p, RICH_ELEMENTS, { score: 4500, streakCount: 5, achievements: ['badge_10', 'badge_25', 'badge_50'] }),
    afterLoad: null,
  },
  {
    id: 5,
    headline: 'Clean, distraction-free<br>mixing experience',
    seed: (p) => seedState(p, MODERATE_ELEMENTS, { score: 800, streakCount: 3, achievements: ['badge_10'] }),
    afterLoad: null,
  },
];

// ──────────────────────────────────────────────
// State seeding
// ──────────────────────────────────────────────

async function seedState(page, elements, opts) {
  const save = makeSaveData(elements, opts);
  await page.evaluate((s) => {
    localStorage.setItem('alchemica_v1', s);
    localStorage.setItem('alchemica_onboarded', '1');
  }, save);
}

// ──────────────────────────────────────────────
// After-load interactions (run at landscape viewport)
// ──────────────────────────────────────────────

async function triggerDiscoveryBanner(page) {
  await page.evaluate(() => {
    const el = document.createElement('div');
    el.innerHTML = `
      <div style="
        position: fixed; bottom: 0; left: 0; right: 0;
        background: linear-gradient(135deg, #1a2e4a 0%, #0d1b2e 100%);
        border-top: 2px solid #e8b84b;
        padding: 16px 24px;
        display: flex; align-items: center; gap: 16px;
        z-index: 500;
      ">
        <span style="font-size: 2rem;">♨️</span>
        <div style="flex: 1;">
          <div style="color: #e8b84b; font-weight: 700; font-size: 1.1rem;">✨ New Discovery!</div>
          <div style="color: #fff; font-size: 0.95rem;">You discovered <strong>Steam</strong> — Discovery #5 of 300+</div>
          <div style="color: #8ab4f8; font-size: 0.8rem; margin-top: 4px;">Water in gaseous phase above 100°C</div>
        </div>
        <button style="background: #e8b84b; color: #0d1b2e; border: none; border-radius: 8px; padding: 8px 16px; font-weight: 700;">Share 🎉</button>
      </div>`;
    document.body.appendChild(el);
  });
  await page.waitForTimeout(300);
}

async function openDailyPanel(page) {
  try {
    const pill = page.locator('.daily-pill');
    await pill.waitFor({ timeout: 3000 });
    await pill.click();
    await page.waitForTimeout(800);
    await page.locator('.pill-panel').waitFor({ timeout: 2000 });
    return;
  } catch { /* inject fallback */ }

  await page.evaluate(() => {
    const el = document.createElement('div');
    el.innerHTML = `
      <div style="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:450;"></div>
      <div style="position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:451;width:min(340px,85%);background:#0d1b2e;border:2px solid #1a2e4a;border-radius:16px;padding:20px;text-align:center;">
        <div style="color:#e8b84b;font-size:1.2rem;font-weight:700;margin-bottom:12px;">🔥 Daily Challenge</div>
        <div style="background:#132744;border:1px solid #1a2e4a;border-radius:12px;padding:16px;margin:12px 0;">
          <div style="font-size:2.5rem;">♨️</div>
          <div style="color:#fff;font-weight:700;font-size:1.1rem;margin:4px 0;">Steam</div>
          <div style="color:#8ab4f8;font-size:0.8rem;">Water in gaseous phase above 100°C</div>
        </div>
        <div style="color:#4ade80;font-size:0.9rem;margin:8px 0;">🔥 14-day streak!</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px;">
          <div style="background:#132744;border-radius:8px;padding:8px;"><div style="color:#e8b84b;font-weight:700;">14</div><div style="color:#8ab4f8;font-size:0.75rem;">Streak</div></div>
          <div style="background:#132744;border-radius:8px;padding:8px;"><div style="color:#e8b84b;font-weight:700;">✓</div><div style="color:#8ab4f8;font-size:0.75rem;">Completed</div></div>
        </div>
      </div>`;
    document.body.appendChild(el);
  });
  await page.waitForTimeout(300);
}

async function openAchievements(page) {
  await page.evaluate(() => {
    const badges = [
      { emoji: '🔬', name: 'Apprentice', threshold: 10, earned: true },
      { emoji: '⚗️', name: 'Alchemist', threshold: 25, earned: true },
      { emoji: '🔮', name: 'Sage', threshold: 50, earned: true },
      { emoji: '✨', name: 'Grand Master', threshold: 61, earned: false },
    ];
    const el = document.createElement('div');
    el.innerHTML = `
      <div style="position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:400;"></div>
      <div style="position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:401;width:min(420px,90%);max-height:85vh;background:#0d1b2e;border:2px solid #1a2e4a;border-radius:16px;padding:20px;overflow-y:auto;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
          <span style="color:#e8b84b;font-size:1.2rem;font-weight:700;">Achievements</span>
          <span style="color:#666;font-size:1.4rem;">✕</span>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          ${badges.map(b => `
            <div style="background:${b.earned ? '#1a2e4a' : '#111827'};border:1px solid ${b.earned ? '#e8b84b' : '#1a2e4a'};border-radius:12px;padding:16px;text-align:center;${b.earned ? '' : 'opacity:0.5;'}">
              <div style="font-size:2rem;">${b.earned ? b.emoji : '🔒'}</div>
              <div style="color:#fff;font-weight:600;margin:6px 0;">${b.name}</div>
              <div style="color:#8ab4f8;font-size:0.8rem;">Discover ${b.threshold} elements</div>
              <div style="color:${b.earned ? '#4ade80' : '#666'};font-size:0.75rem;margin-top:4px;">${b.earned ? '✓ Earned' : `${b.threshold} needed`}</div>
            </div>`).join('')}
        </div>
      </div>`;
    document.body.appendChild(el);
  });
  await page.waitForTimeout(300);
}

// ──────────────────────────────────────────────
// Portrait compositor — headline + game image
// ──────────────────────────────────────────────

function buildCompositorHtml(headline, gameImgBase64, size) {
  const headlinePct = 15;
  const gameWidthPct = 92;
  const fontSize = Math.round(size.height * headlinePct / 100 * 0.22);

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
* { margin:0; padding:0; box-sizing:border-box; }
html, body { width:${size.width}px; height:${size.height}px; background:#0d1b2e; overflow:hidden; }
.frame { width:100%; height:100%; display:flex; flex-direction:column; align-items:center; }
.headline { height:${headlinePct}%; width:100%; background:linear-gradient(180deg,#0d1b2e 0%,#132744 100%); display:flex; align-items:center; justify-content:center; padding:20px; }
.headline-text { color:#fff; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; font-size:${fontSize}px; font-weight:800; text-align:center; line-height:1.3; text-shadow:0 2px 8px rgba(0,0,0,0.3); }
.game-area { flex:1; display:flex; align-items:center; justify-content:center; width:100%; }
.game-img { width:${gameWidthPct}%; border-radius:16px; box-shadow:0 8px 40px rgba(0,0,0,0.5), 0 0 0 2px rgba(26,62,90,0.4); }
</style></head><body>
<div class="frame">
  <div class="headline"><div class="headline-text">${headline}</div></div>
  <div class="game-area"><img class="game-img" src="data:image/png;base64,${gameImgBase64}" /></div>
</div>
</body></html>`;
}

// ──────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────

const browser = await chromium.launch();

try {
for (const shot of SCREENSHOTS) {
  // Phase 1: Capture game at landscape dimensions
  const ctx = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await ctx.newPage();

  await page.setViewportSize({ width: 400, height: 300 });
  await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(400);
  await shot.seed(page);

  await page.setViewportSize({ width: GAME_WIDTH, height: GAME_HEIGHT });
  await page.goto(`${BASE_URL}/game`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  if (shot.afterLoad) await shot.afterLoad(page);

  const gamePng = await page.screenshot({ type: 'png' });
  const gameB64 = gamePng.toString('base64');
  await page.close();
  await ctx.close();
  console.log(`  Captured game ${shot.id} at ${GAME_WIDTH}×${GAME_HEIGHT}`);

  // Phase 2: Compose portrait screenshots
  for (const size of STORE_SIZES) {
    const filename = `store-screenshot-${shot.id}-${size.suffix}.png`;
    const html = buildCompositorHtml(shot.headline, gameB64, size);

    const compCtx = await browser.newContext();
    const compPage = await compCtx.newPage();
    await compPage.setViewportSize({ width: size.width, height: size.height });
    await compPage.setContent(html, { waitUntil: 'load' });
    await compPage.waitForTimeout(300);

    const dest = join(STATIC_DIR, filename);
    await compPage.screenshot({ path: dest, type: 'png' });
    console.log(`✓ Screenshot ${shot.id} (${size.suffix}) → static/${filename}`);

    await compPage.close();
    await compCtx.close();
  }
}

console.log('\nDone. 10 store screenshots generated in static/');
} finally {
  await browser.close();
}
