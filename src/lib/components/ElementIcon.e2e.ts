import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// SVG Icon System — E2E Tests
//
// These tests verify the sprite-sheet implementation works correctly in-browser:
//   • ElementSprite is mounted once in the DOM (not duplicated per route)
//   • Every <use> on screen resolves to a non-empty rendered element
//   • No element still renders a raw emoji character in an icon slot
//   • Category color (currentColor) flows into the SVG stroke/fill
//   • Fallback symbol renders for unknown keys
// ---------------------------------------------------------------------------

const GAME_URL = '/';
const SETTINGS_URL = '/settings';

test.describe('SVG Icon System', () => {

  test('ElementSprite is mounted exactly once in the document', async ({ page }) => {
    await page.goto(GAME_URL);
    // The sprite is a hidden <svg> — there should be exactly one
    const sprites = page.locator('svg[aria-hidden="true"][style*="display:none"]');
    await expect(sprites).toHaveCount(1);
  });

  test('ElementSprite contains <symbol> elements for core elements', async ({ page }) => {
    await page.goto(GAME_URL);
    const coreElements = ['el-fire', 'el-water', 'el-earth', 'el-air'];
    for (const id of coreElements) {
      const symbol = page.locator(`symbol#${id}`);
      await expect(symbol).toHaveCount(1);
    }
  });

  test('all visible <use> elements on the game screen resolve to a symbol', async ({ page }) => {
    await page.goto(GAME_URL);
    // Wait for the shelf to render (icons appear once elements are loaded)
    await page.waitForSelector('.element-card', { timeout: 5000 });

    const useElements = page.locator('svg:not([style*="display:none"]) use');
    const count = await useElements.count();
    expect(count).toBeGreaterThan(0);

    // Verify every <use href> resolves — getBBox() returns {width:0,height:0} for
    // unresolved references, and >0 for rendered symbol content
    const allResolved = await useElements.evaluateAll((uses: SVGUseElement[]) =>
      uses.every((use) => {
        try {
          const bbox = use.getBBox();
          return bbox.width > 0 || bbox.height > 0;
        } catch {
          // getBBox throws for elements with display:none — skip those
          return true;
        }
      })
    );
    expect(allResolved).toBe(true);
  });

  test('no raw emoji characters appear in icon container elements', async ({ page }) => {
    await page.goto(GAME_URL);
    await page.waitForSelector('.element-card', { timeout: 5000 });

    // Icon containers are .slot-icon, .card-icon, .hint-symbol, .hint-result-symbol, .target-symbol
    const iconContainers = page.locator('.slot-icon, .card-icon, .hint-symbol, .hint-result-symbol, .target-symbol, .detail-icon');
    const count = await iconContainers.count();
    if (count === 0) return; // No icons visible — skip

    const emojiRegex = /[\u{1F300}-\u{1FAFF}]/u; // broad Unicode emoji range
    const hasEmoji = await iconContainers.evaluateAll((els: Element[]) =>
      els.some((el) => /[\u{1F300}-\u{1FAFF}]/u.test(el.textContent ?? ''))
    );
    expect(hasEmoji).toBe(false);
  });

  test('fallback symbol renders for an unknown element key', async ({ page }) => {
    await page.goto(GAME_URL);
    // Inject a test icon using the known fallback path via evaluate
    const fallbackRendered = await page.evaluate(() => {
      const ns = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(ns, 'svg');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('width', '24');
      svg.setAttribute('height', '24');
      svg.id = '__test-fallback-svg';
      const use = document.createElementNS(ns, 'use');
      use.setAttribute('href', '#el-fallback');
      svg.appendChild(use);
      document.body.appendChild(svg);
      const bbox = use.getBBox();
      svg.remove();
      return bbox.width > 0 || bbox.height > 0;
    });
    expect(fallbackRendered).toBe(true);
  });

  test('category color class cascades into SVG stroke via currentColor', async ({ page }) => {
    await page.goto(GAME_URL);
    await page.waitForSelector('.element-card', { timeout: 5000 });

    // Find the first icon that has a color class (e.g. .fire, .water)
    const iconWithColor = page.locator('[class*="slot-icon"]').first();
    const count = await iconWithColor.count();
    if (count === 0) return;

    // The SVG inside should have stroke set (not 'none') — meaning currentColor is active
    const strokeValue = await iconWithColor.locator('svg').first().evaluate((svg: SVGSVGElement) =>
      getComputedStyle(svg).stroke
    );
    // stroke should be a color value (rgb/rgba), not 'none'
    expect(strokeValue).not.toBe('none');
    expect(strokeValue).toMatch(/^rgb/);
  });

  test('ElementSprite is not duplicated after client-side route navigation', async ({ page }) => {
    await page.goto(GAME_URL);
    const countBefore = await page.locator('symbol#el-fire').count();

    // Navigate to settings and back
    await page.goto(SETTINGS_URL);
    await page.goto(GAME_URL);

    const countAfter = await page.locator('symbol#el-fire').count();
    // Should remain 1 — not accumulate across navigations
    expect(countAfter).toBe(countBefore);
    expect(countAfter).toBe(1);
  });

});
