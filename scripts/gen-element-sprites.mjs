/**
 * Generator for ElementSprite.svelte
 * Fetches SVG paths from game-icons.net GitHub repo and generates the sprite sheet.
 * Run: node scripts/gen-element-sprites.mjs
 * License: game-icons.net icons are CC BY 3.0 – attribution required.
 */

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const BASE_URL = 'https://raw.githubusercontent.com/game-icons/icons/master';

// ── MAPPING: elementKey → { author, icon } ──────────────────────────────────
// When an element has no good match, use { custom: '<path ... />' } fallback.
const ICON_MAP = {
  // BASIC 4
  fire:         { author: 'lorc', icon: 'campfire' },
  water:        { author: 'lorc', icon: 'droplet-splash' },
  earth:        { author: 'lorc', icon: 'mountains' },
  air:          { author: 'lorc', icon: 'air-zigzag' },

  // GAS
  steam:        { author: 'lorc', icon: 'heat-haze' },
  dust:         { author: 'lorc', icon: 'dust-cloud' },
  wind:         { author: 'lorc', icon: 'air-zigzag' },
  plasma:       { author: 'lorc', icon: 'lightning-electron' },
  cloud:        { author: 'lorc', icon: 'fluffy-cloud' },
  fog:          { author: 'delapouite', icon: 'fog' },
  smoke:        { author: 'lorc', icon: 'incense' },
  oxygen:       { author: 'lorc', icon: 'molecule' },
  hydrogen:     { author: 'lorc', icon: 'atomic-slashes' },

  // WATER
  rain:         { author: 'lorc', icon: 'raining' },
  ice:          { author: 'lorc', icon: 'icebergs' },
  snow:         { author: 'lorc', icon: 'icicles-aura' },
  flood:        { author: 'lorc', icon: 'drowning' },

  // EARTH
  mud:          { author: 'lorc', icon: 'quicksand' },
  lava:         { author: 'lorc', icon: 'eruption' },
  sand:         { author: 'lorc', icon: 'hourglass' },
  volcano:      { author: 'lorc', icon: 'caldera' },
  stone:        { author: 'lorc', icon: 'crags' },
  wood:         { author: 'lorc', icon: 'dead-wood' },
  ash:          { author: 'lorc', icon: 'powder' },
  coal:         { author: 'lorc', icon: 'fossil' },
  carbon:       { author: 'lorc', icon: 'molecule' },
  clay:         { author: 'lorc', icon: 'dripping-stone' },
  brick:        { author: 'delapouite', icon: 'brick-wall' },
  sulfur:       { author: 'lorc', icon: 'acid-blob' },
  plant:        { author: 'lorc', icon: 'linden-leaf' },
  seed:         { author: 'lorc', icon: 'acorn' },
  tree:         { author: 'lorc', icon: 'oak' },
  oil:          { author: 'lorc', icon: 'oily-spiral' },
  salt:         { author: 'lorc', icon: 'crystal-shine' },

  // COMPOUND
  glass:        { author: 'lorc', icon: 'cracked-glass' },
  rust:         { author: 'lorc', icon: 'dripping-goo' },
  steam_engine: { author: 'delapouite', icon: 'steam-locomotive' },
  crystal:      { author: 'lorc', icon: 'crystalize' },
  lightning:    { author: 'lorc', icon: 'heavy-lightning' },
  acid_rain:    { author: 'lorc', icon: 'acid-blob' },
  acid:         { author: 'lorc', icon: 'fizzing-flask' },
  obsidian:     { author: 'lorc', icon: 'cracked-helm' },
  plastic:      { author: 'lorc', icon: 'linked-rings' },
  explosion:    { author: 'lorc', icon: 'implosion' },
  rocket:       { author: 'lorc', icon: 'firework-rocket' },

  // METAL
  iron:         { author: 'lorc', icon: 'flat-hammer' },
  magnet:       { author: 'lorc', icon: 'magnet' },
  copper:       { author: 'delapouite', icon: 'gold-stack' },
  bronze:       { author: 'delapouite', icon: 'sword-brandish' },
  gold:         { author: 'delapouite', icon: 'gold-stack' },
  steel:        { author: 'lorc', icon: 'flat-hammer' },

  // ENERGY
  storm:        { author: 'lorc', icon: 'lightning-storm' },
  sunlight:     { author: 'lorc', icon: 'aura' },
  rainbow:      { author: 'lorc', icon: 'rainbow-star' },
  electricity:  { author: 'lorc', icon: 'electrical-crescent' },
  motor:        { author: 'lorc', icon: 'pokecog' },
  life:         { author: 'lorc', icon: 'aura' },
  animal:       { author: 'lorc', icon: 'lion' },
  human:        { author: 'delapouite', icon: 'person' },
  city:         { author: 'lorc', icon: 'castle' },
  tornado:      { author: 'lorc', icon: 'swirl' },

  // SPACE – confirmed/high-confidence
  radiation:    { author: 'lorc', icon: 'radioactive' },
  photon:       { author: 'lorc', icon: 'laser-blast' },
  ion:          { author: 'lorc', icon: 'lightning-electron' },
  gravity:      { author: 'lorc', icon: 'heavy-fall' },
  orbit:        { author: 'lorc', icon: 'ringed-planet' },
  fusion:       { author: 'lorc', icon: 'fission' },
  black_hole:   { author: 'lorc', icon: 'black-hole-bolas' },
  accretion_disk: { author: 'lorc', icon: 'ringed-beam' },
  comet:        { author: 'lorc', icon: 'burning-meteor' },
  meteorite:    { author: 'lorc', icon: 'burning-meteor' },
  crater:       { author: 'lorc', icon: 'quake-stomp' },
  planet:       { author: 'lorc', icon: 'ringed-planet' },
  exoplanet:    { author: 'lorc', icon: 'ringed-planet' },
  planetary_ring: { author: 'lorc', icon: 'ringed-planet' },
  solar_system: { author: 'lorc', icon: 'ringed-planet' },
  gamma_ray:    { author: 'lorc', icon: 'radioactive' },
  cosmic_ray:   { author: 'lorc', icon: 'laser-blast' },
  space_dust:   { author: 'lorc', icon: 'dust-cloud' },
  x_ray:        { author: 'lorc', icon: 'laser-precision' },
  supernova:    { author: 'lorc', icon: 'implosion' },
  eclipse:      { author: 'lorc', icon: 'burning-dot' },
  moon:         { author: 'lorc', icon: 'crescent-blade' },
  satellite:    { author: 'delapouite', icon: 'defense-satellite' },
  space_station:{ author: 'delapouite', icon: 'base-dome' },
  telescope:    { author: 'delapouite', icon: 'binoculars' },
  cosmonaut:    { author: 'lorc', icon: 'cowled' },
  zero_gravity: { author: 'lorc', icon: 'feathered-wing' },
  galaxy:       { author: 'delapouite', icon: 'galaxy' },
  star:         { author: 'lorc', icon: 'flat-star' },
  nebula:       { author: 'lorc', icon: 'foam' },
  aurora:       { author: 'lorc', icon: 'icicles-aura' },
  asteroid:     { author: 'lorc', icon: 'rock' },
  tides:        { author: 'lorc', icon: 'droplets' },
  atmosphere:   { author: 'lorc', icon: 'aura' },

  // SPACE – lower confidence, will fall back gracefully
  vacuum:       { author: 'lorc', icon: 'nothing-to-say' },
  solar_wind:   { author: 'lorc', icon: 'beam-wake' },
  magnetosphere:{ author: 'lorc', icon: 'forward-field' },
  sunlight_star:{ author: 'lorc', icon: 'aura' },
  red_dwarf:    { author: 'lorc', icon: 'flat-star' },
  white_dwarf:  { author: 'lorc', icon: 'flat-star' },
  neutron_star: { author: 'lorc', icon: 'flat-star' },
  pulsar:       { author: 'lorc', icon: 'cycle' },
  quasar:       { author: 'lorc', icon: 'laser-blast' },
  binary_star:  { author: 'lorc', icon: 'two-shadows' },
  universe:     { author: 'lorc', icon: 'circle-sparks' },
  dark_matter:  { author: 'lorc', icon: 'foam' },
  light_year:   { author: 'lorc', icon: 'laser-precision' },
  parsec:       { author: 'lorc', icon: 'laser-precision' },
  zero_point:   { author: 'lorc', icon: 'impact-point' },
  wormhole:     { author: 'lorc', icon: 'coiling-curl' },
};

// ── CUSTOM FALLBACK SVGs (512×512) ───────────────────────────────────────────
// Used when game-icons.net doesn't have a good match.
// These are redesigned versions of the originals — proper filled shapes.
const CUSTOM_ICONS = {
  // Tornado: stacked ellipses tapering to a point — classic funnel shape
  tornado: `<ellipse cx="256" cy="110" rx="190" ry="45"/><ellipse cx="256" cy="210" rx="145" ry="35"/><ellipse cx="256" cy="300" rx="100" ry="28"/><ellipse cx="256" cy="375" rx="60" ry="20"/><ellipse cx="256" cy="430" rx="28" ry="14"/><path d="M256 444 Q262 470 256 490 Q250 470 256 444Z"/>`,
  // Generic fallback
  fallback: `<circle cx="256" cy="256" r="200"/><circle cx="256" cy="256" r="100" fill="none" stroke-width="30"/>`,
};

// ── HELPERS ──────────────────────────────────────────────────────────────────

async function fetchSvg(author, iconName) {
  const url = `${BASE_URL}/${author}/${iconName}.svg`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const text = await res.text();
    return text;
  } catch {
    return null;
  }
}

function extractPaths(svgText) {
  if (!svgText) return null;
  // Extract all path/polygon/circle/rect/ellipse elements from the SVG
  const shapeRegex = /<(path|polygon|circle|rect|ellipse|polyline)[^>]*\/>/g;
  const shapes = [...svgText.matchAll(shapeRegex)]
    .map(m => m[0])
    // Drop the full-canvas background rectangle that game-icons bakes in
    .filter(s => !/d="M0 0h512v512H0z"/.test(s))
    // Drop any plain rect covering the full canvas (e.g. <rect width="512" height="512"/>)
    .filter(s => !/^<rect\s[^>]*(?:width="512")[^>]*(?:height="512")[^>]*\/>$/.test(s))
    // Remove hardcoded fill attributes so paths inherit color from the parent SVG
    .map(s => s.replace(/\s*fill="[^"]*"/g, ''));
  if (shapes.length === 0) return null;
  return shapes.join('\n      ');
}

function indent(str, spaces) {
  return str.split('\n').map(l => ' '.repeat(spaces) + l).join('\n');
}

// ── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Fetching game-icons SVG paths...\n');

  const symbols = [];
  const fetched = [];
  const fallbacks = [];

  const keys = Object.keys(ICON_MAP);

  // Fetch in batches of 10 to avoid rate limiting
  const BATCH = 10;
  for (let i = 0; i < keys.length; i += BATCH) {
    const batch = keys.slice(i, i + BATCH);
    await Promise.all(batch.map(async (key) => {
      const mapping = ICON_MAP[key];
      const svgText = await fetchSvg(mapping.author, mapping.icon);
      const paths = extractPaths(svgText);

      if (paths) {
        fetched.push(`  ✓ ${key} → ${mapping.author}/${mapping.icon}`);
        symbols.push({ key, paths, viewBox: '0 0 512 512', source: `${mapping.author}/${mapping.icon}` });
      } else {
        fallbacks.push(`  ✗ ${key} → ${mapping.author}/${mapping.icon} (fallback)`);
        const customPaths = CUSTOM_ICONS[key] ?? CUSTOM_ICONS.fallback;
        symbols.push({ key, paths: customPaths, viewBox: '0 0 512 512', source: 'custom' });
      }
    }));
    // Small delay between batches
    if (i + BATCH < keys.length) await new Promise(r => setTimeout(r, 200));
  }

  // Report
  console.log('FETCHED:');
  fetched.sort().forEach(l => console.log(l));
  console.log('\nFALLBACKS:');
  fallbacks.sort().forEach(l => console.log(l));
  console.log(`\nTotal: ${fetched.length} fetched, ${fallbacks.length} fallbacks\n`);

  // Sort symbols to match original order
  const ORDER = Object.keys(ICON_MAP);
  symbols.sort((a, b) => ORDER.indexOf(a.key) - ORDER.indexOf(b.key));

  // Generate the svelte file
  const symbolBlocks = symbols.map(({ key, paths, viewBox, source }) => {
    return `    <!-- ${key} · ${source} -->
    <symbol id="el-${key}" viewBox="${viewBox}">
      ${paths}
    </symbol>`;
  }).join('\n\n');

  const output = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">
  <defs>
    <!-- ─────────────────────────────────────────────────────────────────────
         ELEMENT SPRITE SHEET — auto-generated by scripts/gen-element-sprites.mjs
         Icons from game-icons.net (CC BY 3.0) — https://game-icons.net
         Authors: Lorc (lorc), Delapouite (delapouite) and others.
         See https://game-icons.net/about.html for full attribution info.
         ───────────────────────────────────────────────────────────────────── -->

    <symbol id="el-fallback" viewBox="0 0 512 512">
      <circle cx="256" cy="256" r="200"/>
      <path d="M185 200 h142 v112 h-142 z" fill="none" stroke-width="20"/>
    </symbol>

${symbolBlocks}

  </defs>
</svg>
`;

  const outPath = join(__dir, '..', 'src', 'lib', 'components', 'ElementSprite.svelte');
  writeFileSync(outPath, output, 'utf8');
  console.log(`✓ Written to ${outPath}`);
  console.log('\nRemember: game-icons.net icons require CC BY 3.0 attribution.');
  console.log('Add to your app: "Icons from game-icons.net by Lorc, Delapouite et al. (CC BY 3.0)"');
}

main().catch(console.error);
