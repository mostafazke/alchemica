<script lang="ts">
  let { key }: { key: string } = $props();
  // Resolve to fallback symbol if the key has no corresponding <symbol> in ElementSprite.
  // SVG <use> silently renders nothing for unknown IDs, so we catch it here instead.
  const knownKeys = new Set(['fire','water','earth','air','steam','dust','wind','plasma','cloud','fog','smoke','oxygen','hydrogen','rain','ice','snow','flood','mud','lava','sand','volcano','stone','wood','ash','coal','carbon','clay','brick','sulfur','plant','seed','tree','oil','salt','glass','rust','steam_engine','crystal','lightning','acid_rain','acid','obsidian','plastic','explosion','rocket','iron','magnet','copper','bronze','gold','steel','storm','sunlight','rainbow','electricity','motor','life','animal','human','city','tornado','vacuum','ion','photon','radiation','solar_wind','gravity','orbit','atmosphere','magnetosphere','aurora','nebula','star','fusion','sunlight_star','red_dwarf','white_dwarf','neutron_star','supernova','pulsar','black_hole','accretion_disk','quasar','binary_star','moon','tides','eclipse','asteroid','comet','meteorite','crater','planet','exoplanet','planetary_ring','solar_system','x_ray','gamma_ray','cosmic_ray','space_dust','dark_matter','light_year','parsec','galaxy','universe','satellite','space_station','telescope','zero_gravity','cosmonaut','zero_point','wormhole']);
  const id = $derived(knownKeys.has(key) ? `el-${key}` : 'el-fallback');
</script>

<svg
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="1.5"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
  style="display:block;width:100%;height:100%"
>
  <use href="#{id}" />
</svg>
