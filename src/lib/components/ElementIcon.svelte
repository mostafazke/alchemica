<script lang="ts">
  import { ELEMENTS } from '../data/elements.js';

  let { key }: { key: string } = $props();

  const knownKeys = new Set(['fire','water','earth','air','steam','dust','wind','plasma','cloud','fog','smoke','oxygen','hydrogen','rain','ice','snow','flood','mud','lava','sand','volcano','stone','wood','ash','coal','carbon','clay','brick','sulfur','plant','seed','tree','oil','salt','glass','rust','steam_engine','crystal','lightning','acid_rain','acid','obsidian','plastic','explosion','rocket','iron','magnet','copper','bronze','gold','steel','storm','sunlight','rainbow','electricity','motor','life','animal','human','city','tornado','vacuum','ion','photon','radiation','solar_wind','gravity','orbit','atmosphere','magnetosphere','aurora','nebula','star','fusion','sunlight_star','red_dwarf','white_dwarf','neutron_star','supernova','pulsar','black_hole','accretion_disk','quasar','binary_star','moon','tides','eclipse','asteroid','comet','meteorite','crater','planet','exoplanet','planetary_ring','solar_system','x_ray','gamma_ray','cosmic_ray','space_dust','dark_matter','light_year','parsec','galaxy','universe','satellite','space_station','telescope','zero_gravity','cosmonaut','zero_point','wormhole']);

  const CAT_COLORS: Record<string, string> = {
    'cat-fire':     '#ff6b35',
    'cat-water':    '#5ab4ff',
    'cat-earth':    '#96c84a',
    'cat-air':      '#c8c8ff',
    'cat-metal':    '#c8b460',
    'cat-energy':   '#d05aff',
    'cat-gas':      '#80d0c0',
    'cat-compound': '#d080a0',
    'cat-space':    '#7eb8f7',
  };

  const id    = $derived(knownKeys.has(key) ? `el-${key}` : 'el-fallback');
  const color = $derived(CAT_COLORS[ELEMENTS[key]?.color ?? ''] ?? '#a0a8c0');
</script>

<svg
  viewBox="0 0 512 512"
  fill={color}
  stroke="none"
  aria-hidden="true"
  style="display:block;width:100%;height:100%"
>
  <use href="#{id}" />
</svg>
