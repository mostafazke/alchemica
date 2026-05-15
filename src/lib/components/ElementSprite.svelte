<!--
  ElementSprite — SVG sprite sheet for all element icons.
  Rendered once (hidden) in the layout; each ElementIcon references
  a symbol via <use href="#el-{key}">.

  Design language:
  • 24×24 viewBox, stroke-width 1.5, round linecaps/joins
  • Strokes/fills use currentColor — category color cascades in from ElementIcon
  • Basic four elements use classical alchemical triangle notation
  • Every element key gets a unique icon — no duplicates
-->
<svg aria-hidden="true" focusable="false" style="display:none;position:absolute" xmlns="http://www.w3.org/2000/svg">
  <defs>

    <!-- ── BASIC 4 — Classical alchemical triangles ── -->
    <symbol id="el-fire" viewBox="0 0 24 24">
      <!-- Upward triangle (alchemical fire) + inner flame curl -->
      <polygon points="12,3 21,19 3,19" />
      <path d="M12,10 C10,14 14,14 12,18" />
    </symbol>

    <symbol id="el-water" viewBox="0 0 24 24">
      <!-- Downward triangle (alchemical water) -->
      <polygon points="12,21 3,5 21,5" />
    </symbol>

    <symbol id="el-earth" viewBox="0 0 24 24">
      <!-- Downward triangle + horizontal bar (alchemical earth) -->
      <polygon points="12,21 3,5 21,5" />
      <line x1="6" y1="13" x2="18" y2="13" />
    </symbol>

    <symbol id="el-air" viewBox="0 0 24 24">
      <!-- Upward triangle + horizontal bar (alchemical air) -->
      <polygon points="12,3 21,19 3,19" />
      <line x1="6" y1="11" x2="18" y2="11" />
    </symbol>

    <!-- ── GAS CATEGORY ── -->
    <symbol id="el-steam" viewBox="0 0 24 24">
      <!-- Three rising wavy lines -->
      <path d="M8,20 C7,17 9,15 8,12 C7,9 9,7 8,4" />
      <path d="M12,20 C11,17 13,15 12,12 C11,9 13,7 12,4" />
      <path d="M16,20 C15,17 17,15 16,12 C15,9 17,7 16,4" />
    </symbol>

    <symbol id="el-dust" viewBox="0 0 24 24">
      <!-- Scattered particles -->
      <circle cx="7" cy="7" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="15" cy="5" r="1" fill="currentColor" stroke="none" />
      <circle cx="19" cy="10" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="5" cy="14" r="1" fill="currentColor" stroke="none" />
      <circle cx="11" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="18" cy="17" r="1" fill="currentColor" stroke="none" />
      <circle cx="8" cy="19" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="14" cy="19" r="1" fill="currentColor" stroke="none" />
    </symbol>

    <symbol id="el-wind" viewBox="0 0 24 24">
      <!-- Three sweeping horizontal curves -->
      <path d="M3,7 Q8,4 14,7 Q17,9 21,7" />
      <path d="M3,12 Q9,9 15,12 Q18,14 21,12" />
      <path d="M5,17 Q11,14 16,17 Q19,19 21,17" />
    </symbol>

    <symbol id="el-plasma" viewBox="0 0 24 24">
      <!-- Lightning bolt inside circle -->
      <circle cx="12" cy="12" r="9" />
      <path d="M13,5 L9,12 H13 L10,19" />
    </symbol>

    <symbol id="el-cloud" viewBox="0 0 24 24">
      <!-- Three-bump cloud arc -->
      <path d="M4,17 Q4,12 8,12 Q9,8 12,8 Q15,8 16,11 Q21,11 21,15 Q21,17 18,17 H6 Q4,17 4,17 Z" />
    </symbol>

    <symbol id="el-fog" viewBox="0 0 24 24">
      <!-- Three horizontal fading lines -->
      <line x1="3" y1="8" x2="21" y2="8" />
      <line x1="5" y1="13" x2="19" y2="13" />
      <line x1="7" y1="18" x2="17" y2="18" />
    </symbol>

    <symbol id="el-smoke" viewBox="0 0 24 24">
      <!-- Two intertwining curling wisps -->
      <path d="M9,21 C9,18 12,16 10,13 C8,10 11,8 9,5" />
      <path d="M15,21 C15,18 12,16 14,13 C16,10 13,8 15,5" />
    </symbol>

    <symbol id="el-oxygen" viewBox="0 0 24 24">
      <!-- Two interlocked circles (O=O diatomic bond) -->
      <circle cx="8" cy="12" r="5" />
      <circle cx="16" cy="12" r="5" />
      <line x1="11.5" y1="10.5" x2="12.5" y2="10.5" />
      <line x1="11.5" y1="13.5" x2="12.5" y2="13.5" />
    </symbol>

    <symbol id="el-hydrogen" viewBox="0 0 24 24">
      <!-- Atom: nucleus + orbital ellipse -->
      <circle cx="12" cy="12" r="2.5" />
      <ellipse cx="12" cy="12" rx="9" ry="4" />
    </symbol>

    <!-- ── WATER CATEGORY ── -->
    <symbol id="el-rain" viewBox="0 0 24 24">
      <!-- Cloud silhouette + three rain drops -->
      <path d="M4,11 Q4,7 8,7 Q9,4 12,4 Q15,4 16,7 Q20,7 20,11" />
      <line x1="8" y1="15" x2="7" y2="20" />
      <line x1="12" y1="14" x2="11" y2="19" />
      <line x1="16" y1="15" x2="15" y2="20" />
    </symbol>

    <symbol id="el-ice" viewBox="0 0 24 24">
      <!-- Six-pointed snowflake with branch ticks -->
      <line x1="12" y1="2" x2="12" y2="22" />
      <line x1="2.7" y1="7" x2="21.3" y2="17" />
      <line x1="21.3" y1="7" x2="2.7" y2="17" />
      <path d="M10,4 L12,7 L14,4" />
      <path d="M10,20 L12,17 L14,20" />
      <path d="M5,10 L7.5,11.5 L5,13" />
      <path d="M19,10 L16.5,11.5 L19,13" />
    </symbol>

    <symbol id="el-snow" viewBox="0 0 24 24">
      <!-- Simpler three-line snowflake + central dot -->
      <line x1="12" y1="2" x2="12" y2="22" />
      <line x1="2.7" y1="7" x2="21.3" y2="17" />
      <line x1="21.3" y1="7" x2="2.7" y2="17" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </symbol>

    <symbol id="el-flood" viewBox="0 0 24 24">
      <!-- Three stacked wave lines -->
      <path d="M2,9 Q6,6 10,9 Q14,12 18,9 Q21,7 22,9" />
      <path d="M2,14 Q6,11 10,14 Q14,17 18,14 Q21,12 22,14" />
      <path d="M2,19 Q6,16 10,19 Q14,22 18,19 Q21,17 22,19" />
    </symbol>

    <!-- ── EARTH CATEGORY ── -->
    <symbol id="el-mud" viewBox="0 0 24 24">
      <!-- Drop falling into surface ripples -->
      <path d="M12,3 Q16,7 16,11 Q16,15 12,16 Q8,15 8,11 Q8,7 12,3 Z" />
      <path d="M4,19 Q12,16 20,19" />
    </symbol>

    <symbol id="el-lava" viewBox="0 0 24 24">
      <!-- Volcano triangle with dripping lava -->
      <path d="M4,21 L12,4 L20,21 Z" />
      <path d="M11,10 Q9,14 10,18" />
      <path d="M14,12 Q16,16 15,20" />
    </symbol>

    <symbol id="el-sand" viewBox="0 0 24 24">
      <!-- Hourglass -->
      <path d="M5,2 L19,2 L13,11 L13,13 L19,22 L5,22 L11,13 L11,11 Z" />
    </symbol>

    <symbol id="el-volcano" viewBox="0 0 24 24">
      <!-- Cone mountain with eruption particles -->
      <path d="M3,22 L12,4 L21,22 Z" />
      <line x1="12" y1="4" x2="10" y2="1" />
      <line x1="12" y1="4" x2="14" y2="1" />
      <line x1="12" y1="4" x2="15.5" y2="2.5" />
    </symbol>

    <symbol id="el-stone" viewBox="0 0 24 24">
      <!-- Irregular boulder polygon -->
      <path d="M9,3 Q13,2 17,4 Q21,7 21,12 Q20,18 16,20 Q12,22 8,20 Q3,17 3,11 Q3,6 9,3 Z" />
    </symbol>

    <symbol id="el-wood" viewBox="0 0 24 24">
      <!-- Tree cross-section: concentric rings + grain line -->
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="3" />
      <line x1="3" y1="12" x2="21" y2="12" />
    </symbol>

    <symbol id="el-ash" viewBox="0 0 24 24">
      <!-- Particles rising from ground line -->
      <line x1="3" y1="21" x2="21" y2="21" />
      <line x1="9" y1="21" x2="8" y2="16" />
      <line x1="12" y1="21" x2="11" y2="14" />
      <line x1="15" y1="21" x2="14" y2="17" />
      <circle cx="8" cy="15" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="11" cy="12" r="2" fill="currentColor" stroke="none" />
      <circle cx="14" cy="15" r="1.5" fill="currentColor" stroke="none" />
    </symbol>

    <symbol id="el-coal" viewBox="0 0 24 24">
      <!-- Regular hexagon (coal crystal face) -->
      <path d="M12,3 L20,7.5 L20,16.5 L12,21 L4,16.5 L4,7.5 Z" />
    </symbol>

    <symbol id="el-carbon" viewBox="0 0 24 24">
      <!-- Benzene ring (hexagon + inner circle = aromatic ring) -->
      <path d="M12,3 L20,7.5 L20,16.5 L12,21 L4,16.5 L4,7.5 Z" />
      <circle cx="12" cy="12" r="4" />
    </symbol>

    <symbol id="el-clay" viewBox="0 0 24 24">
      <!-- Ceramic bowl shape -->
      <path d="M5,7 Q3,13 5,18 Q12,22 19,18 Q21,13 19,7" />
      <line x1="3" y1="7" x2="21" y2="7" />
    </symbol>

    <symbol id="el-brick" viewBox="0 0 24 24">
      <!-- Rectangle divided into brickwork pattern -->
      <rect x="2" y="7" width="20" height="10" rx="1" />
      <line x1="12" y1="7" x2="12" y2="17" />
      <line x1="2" y1="12" x2="7" y2="12" />
      <line x1="17" y1="12" x2="22" y2="12" />
    </symbol>

    <symbol id="el-sulfur" viewBox="0 0 24 24">
      <!-- Two nested rhombuses (rhombic sulfur crystal) -->
      <path d="M12,2 L22,12 L12,22 L2,12 Z" />
      <path d="M12,7 L17,12 L12,17 L7,12 Z" />
    </symbol>

    <symbol id="el-plant" viewBox="0 0 24 24">
      <!-- Simple leaf shape -->
      <path d="M12,21 Q12,12 6,5 Q12,4 18,5 Q12,12 12,21 Z" />
    </symbol>

    <symbol id="el-seed" viewBox="0 0 24 24">
      <!-- Oval with twin sprout lines -->
      <ellipse cx="12" cy="15" rx="5" ry="6" />
      <path d="M12,9 Q10,5 7,3" />
      <path d="M12,9 Q14,5 17,3" />
    </symbol>

    <symbol id="el-tree" viewBox="0 0 24 24">
      <!-- Circle crown + trunk + ground line -->
      <circle cx="12" cy="9" r="7" />
      <line x1="12" y1="16" x2="12" y2="21" />
      <line x1="9" y1="21" x2="15" y2="21" />
    </symbol>

    <symbol id="el-oil" viewBox="0 0 24 24">
      <!-- Barrel with horizontal bands -->
      <path d="M8,4 Q7,2 12,2 Q17,2 16,4 L17,20 Q17,22 12,22 Q7,22 7,20 Z" />
      <line x1="7" y1="8" x2="17" y2="8" />
      <line x1="7" y1="14" x2="17" y2="14" />
      <ellipse cx="12" cy="4" rx="4" ry="1.5" />
    </symbol>

    <!-- ── COMPOUND CATEGORY ── -->
    <symbol id="el-salt" viewBox="0 0 24 24">
      <!-- 3D cube projection (NaCl crystal) -->
      <path d="M12,2 L20,7 L20,17 L12,22 L4,17 L4,7 Z" />
      <line x1="12" y1="2" x2="12" y2="12" />
      <line x1="4" y1="7" x2="12" y2="12" />
      <line x1="20" y1="7" x2="12" y2="12" />
    </symbol>

    <symbol id="el-glass" viewBox="0 0 24 24">
      <!-- Hourglass / vessel silhouette -->
      <path d="M6,2 L18,2 L14,12 L18,22 L6,22 L10,12 Z" />
    </symbol>

    <symbol id="el-rust" viewBox="0 0 24 24">
      <!-- Gear with corrosion dash marks -->
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="2.5" />
      <line x1="12" y1="3" x2="12" y2="7" />
      <line x1="12" y1="17" x2="12" y2="21" />
      <line x1="3" y1="12" x2="7" y2="12" />
      <line x1="17" y1="12" x2="21" y2="12" />
      <path d="M7,7 L9,9" stroke-dasharray="1,1" />
      <path d="M15,15 L17,17" stroke-dasharray="1,1" />
      <path d="M6,14 L8,15" stroke-dasharray="1,1" />
    </symbol>

    <symbol id="el-steam_engine" viewBox="0 0 24 24">
      <!-- Two locomotive drive wheels + connecting rod -->
      <circle cx="7" cy="15" r="4.5" />
      <circle cx="17" cy="15" r="4.5" />
      <circle cx="7" cy="15" r="1.5" />
      <circle cx="17" cy="15" r="1.5" />
      <line x1="7" y1="10.5" x2="17" y2="10.5" />
      <path d="M7,10.5 L8,6 Q12,4 16,6 L17,10.5" />
    </symbol>

    <symbol id="el-crystal" viewBox="0 0 24 24">
      <!-- Gem octahedral projection with cross lines -->
      <path d="M12,2 L20,9 L17,20 L7,20 L4,9 Z" />
      <line x1="12" y1="2" x2="7" y2="20" />
      <line x1="12" y1="2" x2="17" y2="20" />
      <line x1="4" y1="9" x2="20" y2="9" />
    </symbol>

    <symbol id="el-lightning" viewBox="0 0 24 24">
      <!-- Classic zigzag bolt -->
      <path d="M13,2 L8,13 H13 L11,22 L16,11 H11 Z" />
    </symbol>

    <symbol id="el-acid_rain" viewBox="0 0 24 24">
      <!-- Cloud silhouette + wavy corrosive drops -->
      <path d="M4,11 Q4,7 8,7 Q9,4 12,4 Q15,4 16,7 Q20,7 20,11" />
      <path d="M9,14 Q8.5,16 9,18" />
      <path d="M13,12 Q12.5,15 13,17" />
      <path d="M17,14 Q16.5,16 17,18" />
    </symbol>

    <symbol id="el-acid" viewBox="0 0 24 24">
      <!-- Conical Erlenmeyer flask with bubbles -->
      <path d="M9,2 L9,8 L4,18 Q3,22 8,22 L16,22 Q21,22 20,18 L15,8 L15,2" />
      <line x1="8" y1="2" x2="16" y2="2" />
      <circle cx="9" cy="17" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="13" cy="15" r="1" fill="currentColor" stroke="none" />
    </symbol>

    <symbol id="el-obsidian" viewBox="0 0 24 24">
      <!-- Sharp volcanic glass shard -->
      <path d="M12,2 L19,8 L21,15 L15,22 L9,20 L3,13 L6,5 Z" />
      <path d="M12,2 L14,11 L9,20" />
    </symbol>

    <symbol id="el-plastic" viewBox="0 0 24 24">
      <!-- Chain of three hexagon rings (polymer) -->
      <path d="M4,10 L7,7 L10,10 L10,14 L7,17 L4,14 Z" />
      <path d="M10,10 L13,7 L16,10 L16,14 L13,17 L10,14 Z" />
      <path d="M16,10 L19,7 L22,10 L22,14 L19,17 L16,14 Z" />
    </symbol>

    <symbol id="el-explosion" viewBox="0 0 24 24">
      <!-- Starburst: 8 rays from center circle -->
      <circle cx="12" cy="12" r="3" />
      <line x1="12" y1="2" x2="12" y2="8" />
      <line x1="12" y1="16" x2="12" y2="22" />
      <line x1="2" y1="12" x2="8" y2="12" />
      <line x1="16" y1="12" x2="22" y2="12" />
      <line x1="4.9" y1="4.9" x2="9.1" y2="9.1" />
      <line x1="14.9" y1="14.9" x2="19.1" y2="19.1" />
      <line x1="19.1" y1="4.9" x2="14.9" y2="9.1" />
      <line x1="9.1" y1="14.9" x2="4.9" y2="19.1" />
    </symbol>

    <symbol id="el-rocket" viewBox="0 0 24 24">
      <!-- Pointed fuselage + fins + exhaust -->
      <path d="M12,2 Q16,4 16,10 L16,18 L12,22 L8,18 L8,10 Q8,4 12,2 Z" />
      <circle cx="12" cy="9" r="2.5" />
      <path d="M8,15 L5,21 L8,19" />
      <path d="M16,15 L19,21 L16,19" />
    </symbol>

    <!-- ── METAL CATEGORY ── -->
    <symbol id="el-iron" viewBox="0 0 24 24">
      <!-- Gear: center circle + inner hole + 8 spoke lines -->
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="2" />
      <line x1="12" y1="2" x2="12" y2="7.5" />
      <line x1="12" y1="16.5" x2="12" y2="22" />
      <line x1="2" y1="12" x2="7.5" y2="12" />
      <line x1="16.5" y1="12" x2="22" y2="12" />
      <line x1="4.9" y1="4.9" x2="7.8" y2="7.8" />
      <line x1="16.2" y1="16.2" x2="19.1" y2="19.1" />
      <line x1="19.1" y1="4.9" x2="16.2" y2="7.8" />
      <line x1="7.8" y1="16.2" x2="4.9" y2="19.1" />
    </symbol>

    <symbol id="el-magnet" viewBox="0 0 24 24">
      <!-- Horseshoe magnet -->
      <path d="M5,4 L5,13 Q5,20 12,20 Q19,20 19,13 L19,4" />
      <line x1="3" y1="4" x2="7" y2="4" />
      <line x1="17" y1="4" x2="21" y2="4" />
    </symbol>

    <symbol id="el-copper" viewBox="0 0 24 24">
      <!-- Atom with three orbital ellipses (Bohr model) -->
      <circle cx="12" cy="12" r="2.5" />
      <ellipse cx="12" cy="12" rx="9" ry="3.5" />
      <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(-60 12 12)" />
    </symbol>

    <symbol id="el-bronze" viewBox="0 0 24 24">
      <!-- Two interlocked circles (Cu + Fe alloy) -->
      <circle cx="8" cy="12" r="5.5" />
      <circle cx="16" cy="12" r="5.5" />
    </symbol>

    <symbol id="el-gold" viewBox="0 0 24 24">
      <!-- Filled solar disc with 8 rays (alchemical gold = ☉) -->
      <circle cx="12" cy="12" r="5" fill="currentColor" />
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
      <line x1="4.9" y1="4.9" x2="7.8" y2="7.8" />
      <line x1="16.2" y1="16.2" x2="19.1" y2="19.1" />
      <line x1="19.1" y1="4.9" x2="16.2" y2="7.8" />
      <line x1="7.8" y1="16.2" x2="4.9" y2="19.1" />
    </symbol>

    <symbol id="el-steel" viewBox="0 0 24 24">
      <!-- Gear (iron) with small hexagon carbon lattice attached -->
      <circle cx="9.5" cy="13" r="4" />
      <circle cx="9.5" cy="13" r="2" />
      <line x1="9.5" y1="5" x2="9.5" y2="9" />
      <line x1="9.5" y1="17" x2="9.5" y2="21" />
      <line x1="1.5" y1="13" x2="5.5" y2="13" />
      <line x1="13.5" y1="13" x2="17" y2="13" />
      <path d="M16,5 L19.5,7 L19.5,11 L16,13 L12.5,11 L12.5,7 Z" />
    </symbol>

    <!-- ── ENERGY CATEGORY ── -->
    <symbol id="el-storm" viewBox="0 0 24 24">
      <!-- Cloud outline + lightning bolt below -->
      <path d="M4,11 Q4,6 8.5,6 Q9,3 12,3 Q15,3 16,6 Q20.5,6 20,10 H4" />
      <path d="M13,11 L10,17 H13 L11,22" />
    </symbol>

    <symbol id="el-sunlight" viewBox="0 0 24 24">
      <!-- Empty solar disc + 8 rays -->
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
      <line x1="4.9" y1="4.9" x2="7.8" y2="7.8" />
      <line x1="16.2" y1="16.2" x2="19.1" y2="19.1" />
      <line x1="19.1" y1="4.9" x2="16.2" y2="7.8" />
      <line x1="7.8" y1="16.2" x2="4.9" y2="19.1" />
    </symbol>

    <symbol id="el-rainbow" viewBox="0 0 24 24">
      <!-- Three concentric arcs -->
      <path d="M2,19 Q2,5 12,5 Q22,5 22,19" />
      <path d="M5,19 Q5,9 12,9 Q19,9 19,19" />
      <path d="M8,19 Q8,13 12,13 Q16,13 16,19" />
    </symbol>

    <symbol id="el-electricity" viewBox="0 0 24 24">
      <!-- Sine wave -->
      <path d="M2,12 Q4,6 6,12 Q8,18 10,12 Q12,6 14,12 Q16,18 18,12 Q20,6 22,12" />
    </symbol>

    <symbol id="el-motor" viewBox="0 0 24 24">
      <!-- Circle + inner ring + rotation arrow -->
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12,4 A8,8 0 0,1 20,12" />
      <path d="M18,10.5 L20,12 L18,13.5" />
    </symbol>

    <symbol id="el-life" viewBox="0 0 24 24">
      <!-- DNA double helix with rungs -->
      <path d="M9,2 Q15,4 9,7 Q15,10 9,13 Q15,16 9,19 Q15,22 9,22" />
      <path d="M15,2 Q9,5 15,8 Q9,11 15,14 Q9,17 15,20" />
      <line x1="9" y1="4.5" x2="15" y2="4.5" />
      <line x1="9" y1="8.5" x2="15" y2="8.5" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="15.5" x2="15" y2="15.5" />
      <line x1="9" y1="19.5" x2="15" y2="19.5" />
    </symbol>

    <symbol id="el-animal" viewBox="0 0 24 24">
      <!-- Paw print: main pad + three toe pads -->
      <ellipse cx="12" cy="15" rx="5" ry="4" fill="currentColor" stroke="none" />
      <circle cx="6.5" cy="9.5" r="2" fill="currentColor" stroke="none" />
      <circle cx="11" cy="7.5" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="17.5" cy="9.5" r="2" fill="currentColor" stroke="none" />
    </symbol>

    <symbol id="el-human" viewBox="0 0 24 24">
      <!-- Stick figure -->
      <circle cx="12" cy="5" r="3" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="7" y1="11" x2="17" y2="11" />
      <line x1="12" y1="16" x2="8" y2="22" />
      <line x1="12" y1="16" x2="16" y2="22" />
    </symbol>

    <symbol id="el-city" viewBox="0 0 24 24">
      <!-- Skyline silhouette -->
      <rect x="2" y="14" width="4" height="8" />
      <rect x="6" y="9" width="4" height="13" />
      <rect x="10" y="5" width="4" height="17" />
      <rect x="14" y="10" width="4" height="12" />
      <rect x="18" y="15" width="4" height="7" />
      <line x1="1" y1="22" x2="23" y2="22" />
    </symbol>

    <symbol id="el-tornado" viewBox="0 0 24 24">
      <!-- Funnel shape narrowing to a point -->
      <path d="M4,3 Q12,6 20,3" />
      <path d="M6,8 Q12,10 18,8" />
      <path d="M8,13 Q12,14 16,13" />
      <path d="M10,17 Q12,18 14,17" />
      <line x1="12" y1="19" x2="12" y2="22" />
    </symbol>

    <!-- ── SPACE CATEGORY ── -->
    <symbol id="el-vacuum" viewBox="0 0 24 24">
      <!-- Dashed circle + X (empty nothingness) -->
      <circle cx="12" cy="12" r="9" stroke-dasharray="3,3" />
      <line x1="8" y1="8" x2="16" y2="16" />
      <line x1="16" y1="8" x2="8" y2="16" />
    </symbol>

    <symbol id="el-ion" viewBox="0 0 24 24">
      <!-- Atom + plus sign (charged particle) -->
      <circle cx="12" cy="12" r="3" />
      <ellipse cx="12" cy="12" rx="9" ry="4.5" />
      <line x1="17.5" y1="5" x2="21.5" y2="5" />
      <line x1="19.5" y1="3" x2="19.5" y2="7" />
    </symbol>

    <symbol id="el-photon" viewBox="0 0 24 24">
      <!-- Electromagnetic wave with direction arrow -->
      <path d="M2,12 Q4,7 6,12 Q8,17 10,12 Q12,7 14,12 Q16,17 18,12 Q20,7 22,12" />
      <path d="M20,9 L22,12 L20,15" />
    </symbol>

    <symbol id="el-radiation" viewBox="0 0 24 24">
      <!-- Three-sector trefoil (radiation symbol) -->
      <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
      <path d="M12,4 L9.5,10 L14.5,10 Z" fill="currentColor" stroke="none" />
      <path d="M12,4 L9.5,10 L14.5,10 Z" fill="currentColor" stroke="none" transform="rotate(120 12 12)" />
      <path d="M12,4 L9.5,10 L14.5,10 Z" fill="currentColor" stroke="none" transform="rotate(240 12 12)" />
    </symbol>

    <symbol id="el-solar_wind" viewBox="0 0 24 24">
      <!-- Three rightward flowing waves with arrowheads -->
      <path d="M2,7 Q7,5 12,7 Q16,9 20,7" />
      <path d="M18,5 L20,7 L18,9" />
      <path d="M2,12 Q7,10 12,12 Q16,14 20,12" />
      <path d="M18,10 L20,12 L18,14" />
      <path d="M2,17 Q7,15 12,17 Q16,19 20,17" />
      <path d="M18,15 L20,17 L18,19" />
    </symbol>

    <symbol id="el-gravity" viewBox="0 0 24 24">
      <!-- Gravity well: concentric rings + downward arrows -->
      <circle cx="12" cy="15" r="6" />
      <circle cx="12" cy="15" r="2.5" fill="currentColor" stroke="none" />
      <line x1="12" y1="5" x2="12" y2="9" />
      <path d="M10,7 L12,9 L14,7" />
      <line x1="5" y1="8" x2="7" y2="11" />
      <path d="M6,10.5 L7,11 L7,9" />
      <line x1="19" y1="8" x2="17" y2="11" />
      <path d="M18,10.5 L17,11 L17,9" />
    </symbol>

    <symbol id="el-orbit" viewBox="0 0 24 24">
      <!-- Orbit ellipse with central body and orbiting planet -->
      <circle cx="12" cy="12" r="3.5" fill="currentColor" stroke="none" />
      <ellipse cx="12" cy="12" rx="9" ry="5" />
      <circle cx="3" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </symbol>

    <symbol id="el-atmosphere" viewBox="0 0 24 24">
      <!-- Globe + dashed atmospheric boundary arc -->
      <circle cx="12" cy="12" r="7" />
      <circle cx="12" cy="12" r="9.5" stroke-dasharray="4,2" />
    </symbol>

    <symbol id="el-magnetosphere" viewBox="0 0 24 24">
      <!-- Shield / oval with side deflection curves -->
      <path d="M12,2 Q22,7 22,12 Q22,19 12,22 Q2,19 2,12 Q2,7 12,2 Z" />
      <path d="M2.5,10 Q0.5,12 2.5,14" />
      <path d="M21.5,10 Q23.5,12 21.5,14" />
    </symbol>

    <symbol id="el-aurora" viewBox="0 0 24 24">
      <!-- Four vertical wavy curtain bands -->
      <path d="M5,3 Q7,7 5,11 Q3,15 5,19" />
      <path d="M9,2 Q11,6 9,10 Q7,14 9,18" />
      <path d="M15,2 Q17,6 15,10 Q13,14 15,18" />
      <path d="M19,3 Q21,7 19,11 Q17,15 19,19" />
    </symbol>

    <symbol id="el-nebula" viewBox="0 0 24 24">
      <!-- Overlapping soft clouds with embedded stars -->
      <circle cx="8" cy="10" r="5" />
      <circle cx="15" cy="8" r="4" />
      <circle cx="14" cy="15" r="4" />
      <circle cx="12" cy="11" r="1" fill="currentColor" stroke="none" />
      <circle cx="7" cy="7" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="17" cy="17" r="0.8" fill="currentColor" stroke="none" />
    </symbol>

    <symbol id="el-star" viewBox="0 0 24 24">
      <!-- Five-pointed star -->
      <polygon points="12,2 14.5,9.5 22,9.5 16,14.5 18.5,22 12,17.5 5.5,22 8,14.5 2,9.5 9.5,9.5" />
    </symbol>

    <symbol id="el-fusion" viewBox="0 0 24 24">
      <!-- Atom model: filled nucleus + 3 orbital rings + burst lines -->
      <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
      <ellipse cx="12" cy="12" rx="9" ry="3.5" />
      <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(-60 12 12)" />
      <line x1="12" y1="2" x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="22" />
    </symbol>

    <symbol id="el-sunlight_star" viewBox="0 0 24 24">
      <!-- Star of David (two overlapping triangles = stellar light) -->
      <polygon points="12,2 20,16 4,16" />
      <polygon points="12,22 4,8 20,8" />
    </symbol>

    <symbol id="el-red_dwarf" viewBox="0 0 24 24">
      <!-- Small star: circle + 4 short stubby rays -->
      <circle cx="12" cy="12" r="6" />
      <line x1="12" y1="3" x2="12" y2="6.5" />
      <line x1="12" y1="17.5" x2="12" y2="21" />
      <line x1="3" y1="12" x2="6.5" y2="12" />
      <line x1="17.5" y1="12" x2="21" y2="12" />
    </symbol>

    <symbol id="el-white_dwarf" viewBox="0 0 24 24">
      <!-- Compact star: filled circle inside open ring -->
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="5.5" fill="currentColor" stroke="none" />
    </symbol>

    <symbol id="el-neutron_star" viewBox="0 0 24 24">
      <!-- Ultra-dense: small filled circle + two perpendicular rotation ellipses -->
      <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
      <ellipse cx="12" cy="12" rx="9" ry="3" />
      <ellipse cx="12" cy="12" rx="9" ry="3" transform="rotate(90 12 12)" />
    </symbol>

    <symbol id="el-supernova" viewBox="0 0 24 24">
      <!-- Large starburst: 10 rays + filled center -->
      <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
      <line x1="12" y1="2" x2="12" y2="7" />
      <line x1="12" y1="17" x2="12" y2="22" />
      <line x1="2" y1="12" x2="7" y2="12" />
      <line x1="17" y1="12" x2="22" y2="12" />
      <line x1="4.9" y1="4.9" x2="7.8" y2="7.8" />
      <line x1="16.2" y1="16.2" x2="19.1" y2="19.1" />
      <line x1="19.1" y1="4.9" x2="16.2" y2="7.8" />
      <line x1="7.8" y1="16.2" x2="4.9" y2="19.1" />
      <line x1="2.3" y1="7.3" x2="5.5" y2="9.5" />
      <line x1="18.5" y1="14.5" x2="21.7" y2="16.7" />
    </symbol>

    <symbol id="el-pulsar" viewBox="0 0 24 24">
      <!-- Neutron star + tilted rotation beam + poles -->
      <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
      <ellipse cx="12" cy="12" rx="8" ry="3" transform="rotate(30 12 12)" />
      <line x1="12" y1="3" x2="12" y2="8.5" />
      <line x1="12" y1="15.5" x2="12" y2="21" />
    </symbol>

    <symbol id="el-black_hole" viewBox="0 0 24 24">
      <!-- Filled singularity + accretion ring -->
      <circle cx="12" cy="12" r="5" fill="currentColor" stroke="none" />
      <ellipse cx="12" cy="12" rx="9.5" ry="3.5" />
    </symbol>

    <symbol id="el-accretion_disk" viewBox="0 0 24 24">
      <!-- Three concentric ellipses (disk layers) -->
      <circle cx="12" cy="12" r="2.5" />
      <ellipse cx="12" cy="12" rx="6" ry="2.5" />
      <ellipse cx="12" cy="12" rx="9.5" ry="4" />
    </symbol>

    <symbol id="el-quasar" viewBox="0 0 24 24">
      <!-- Bright core + accretion ring + polar jets -->
      <circle cx="12" cy="12" r="3.5" fill="currentColor" stroke="none" />
      <ellipse cx="12" cy="12" rx="8" ry="3" />
      <line x1="12" y1="3" x2="12" y2="8.5" />
      <line x1="12" y1="15.5" x2="12" y2="21" />
    </symbol>

    <symbol id="el-binary_star" viewBox="0 0 24 24">
      <!-- Two stars orbiting each other -->
      <circle cx="7.5" cy="12" r="4.5" />
      <circle cx="16.5" cy="12" r="3" />
      <path d="M7.5,7.5 Q12,5 16.5,9" stroke-dasharray="2,2" />
    </symbol>

    <symbol id="el-moon" viewBox="0 0 24 24">
      <!-- Crescent moon -->
      <path d="M16,4 A8,8 0 1,0 16,20 A6,6 0 1,1 16,4 Z" />
    </symbol>

    <symbol id="el-tides" viewBox="0 0 24 24">
      <!-- Moon disc + two ocean waves below -->
      <circle cx="12" cy="6" r="3" />
      <path d="M3,14 Q7,11 11,14 Q15,17 19,14 Q22,12 22,14" />
      <path d="M3,19 Q7,16 11,19 Q15,22 19,19 Q22,17 22,19" />
    </symbol>

    <symbol id="el-eclipse" viewBox="0 0 24 24">
      <!-- Dark moon disc covering solar circle -->
      <circle cx="14" cy="12" r="7" />
      <circle cx="9" cy="12" r="7" fill="currentColor" stroke="none" />
    </symbol>

    <symbol id="el-asteroid" viewBox="0 0 24 24">
      <!-- Irregular rocky polygon + surface crack -->
      <path d="M8,4 L16,3 L21,9 L20,16 L14,21 L6,19 L2,13 L4,7 Z" />
      <path d="M10,9 Q12,8 14,10" />
    </symbol>

    <symbol id="el-comet" viewBox="0 0 24 24">
      <!-- Small nucleus + three tail streaks -->
      <circle cx="7" cy="8" r="4" />
      <line x1="10" y1="11" x2="20" y2="16" />
      <line x1="11" y1="8" x2="22" y2="9" />
      <line x1="10" y1="5" x2="21" y2="2" />
    </symbol>

    <symbol id="el-meteorite" viewBox="0 0 24 24">
      <!-- Irregular shape + re-entry streak -->
      <path d="M10,6 L16,4 L19,10 L16,17 L10,18 L7,12 Z" />
      <line x1="15" y1="4" x2="21" y2="20" />
      <line x1="19" y1="10" x2="22" y2="20" />
    </symbol>

    <symbol id="el-crater" viewBox="0 0 24 24">
      <!-- Bowl / impact hollow -->
      <ellipse cx="12" cy="18" rx="8" ry="4" />
      <path d="M4,18 Q12,10 20,18" />
    </symbol>

    <symbol id="el-planet" viewBox="0 0 24 24">
      <!-- Globe + tilted ring (Saturn-like) -->
      <circle cx="12" cy="12" r="6.5" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-15 12 12)" />
    </symbol>

    <symbol id="el-exoplanet" viewBox="0 0 24 24">
      <!-- Star + planet + dashed orbit line -->
      <circle cx="6" cy="6" r="3.5" fill="currentColor" stroke="none" />
      <circle cx="17" cy="15" r="2.5" />
      <line x1="8" y1="8" x2="15" y2="13" stroke-dasharray="2,2" />
    </symbol>

    <symbol id="el-planetary_ring" viewBox="0 0 24 24">
      <!-- Planet + wide flat ring -->
      <circle cx="12" cy="12" r="6" />
      <ellipse cx="12" cy="12" rx="10.5" ry="3" />
    </symbol>

    <symbol id="el-solar_system" viewBox="0 0 24 24">
      <!-- Central sun + two orbital rings + two planets -->
      <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="6.5" />
      <circle cx="12" cy="12" r="10" />
      <circle cx="18.5" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="3" cy="9" r="1" fill="currentColor" stroke="none" />
    </symbol>

    <symbol id="el-x_ray" viewBox="0 0 24 24">
      <!-- Prominent X with crosshairs -->
      <line x1="5" y1="3" x2="19" y2="21" stroke-width="2.5" />
      <line x1="19" y1="3" x2="5" y2="21" stroke-width="2.5" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="12" y1="2" x2="12" y2="22" />
    </symbol>

    <symbol id="el-gamma_ray" viewBox="0 0 24 24">
      <!-- High-frequency zigzag wave -->
      <path d="M2,12 L5,5 L8,12 L11,5 L14,12 L17,5 L20,12 L22,12" />
    </symbol>

    <symbol id="el-cosmic_ray" viewBox="0 0 24 24">
      <!-- Particles hitting atmosphere line then scattering -->
      <line x1="4" y1="2" x2="8" y2="11" />
      <line x1="12" y1="2" x2="12" y2="11" />
      <line x1="20" y1="2" x2="16" y2="11" />
      <path d="M2,12 Q12,10 22,12" />
      <line x1="6" y1="11" x2="2" y2="18" />
      <line x1="8" y1="11" x2="10" y2="18" />
      <line x1="12" y1="11" x2="12" y2="18" />
      <line x1="14" y1="11" x2="16" y2="18" />
      <line x1="16" y1="11" x2="20" y2="18" />
    </symbol>

    <symbol id="el-space_dust" viewBox="0 0 24 24">
      <!-- Tiny scattered dots -->
      <circle cx="5" cy="8" r="1" fill="currentColor" stroke="none" />
      <circle cx="10" cy="5" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="15" cy="7" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="19" cy="10" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="7" cy="14" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="17" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="17" cy="15" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="8" cy="19" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="3" cy="17" r="1" fill="currentColor" stroke="none" />
      <circle cx="20" cy="18" r="0.8" fill="currentColor" stroke="none" />
    </symbol>

    <symbol id="el-dark_matter" viewBox="0 0 24 24">
      <!-- Two dashed rings (invisible mass) -->
      <circle cx="12" cy="12" r="8" stroke-dasharray="3,3" />
      <circle cx="12" cy="12" r="4" stroke-dasharray="2,2" />
    </symbol>

    <symbol id="el-light_year" viewBox="0 0 24 24">
      <!-- Ruler + light wave overlay -->
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M2,12 Q5,8 8,12 Q11,16 14,12" />
      <line x1="2" y1="9" x2="2" y2="15" />
      <line x1="22" y1="9" x2="22" y2="15" />
    </symbol>

    <symbol id="el-parsec" viewBox="0 0 24 24">
      <!-- Parallax angle: two lines from apex + arc + baseline -->
      <line x1="12" y1="2" x2="3" y2="21" />
      <line x1="12" y1="2" x2="21" y2="21" />
      <path d="M5.5,14 A8,8 0 0,1 18.5,14" />
      <line x1="2" y1="21" x2="22" y2="21" />
    </symbol>

    <symbol id="el-galaxy" viewBox="0 0 24 24">
      <!-- Spiral galaxy arm -->
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
      <path d="M12,10 Q18,10 18,12 Q18,16 12,16 Q6,16 6,12 Q6,8 12,8 Q16,8 17,10" />
      <path d="M17,10 Q20,8 21,12 Q22,17 16,20 Q11,22 7,20 Q2,17 4,12 Q5,7 9,5" />
    </symbol>

    <symbol id="el-universe" viewBox="0 0 24 24">
      <!-- Cosmic boundary circle with scattered stars -->
      <circle cx="12" cy="12" r="10" />
      <circle cx="7" cy="7" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="4" r="1" fill="currentColor" stroke="none" />
      <circle cx="18" cy="7" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="20" cy="13" r="1" fill="currentColor" stroke="none" />
      <circle cx="16" cy="19" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="9" cy="19" r="1" fill="currentColor" stroke="none" />
      <circle cx="4" cy="15" r="0.8" fill="currentColor" stroke="none" />
    </symbol>

    <symbol id="el-satellite" viewBox="0 0 24 24">
      <!-- Square body + two lateral solar panels + uplink antenna -->
      <rect x="9" y="9" width="6" height="6" rx="1" />
      <line x1="1" y1="12" x2="9" y2="12" />
      <rect x="1" y="10" width="6" height="4" rx="0.5" />
      <line x1="15" y1="12" x2="23" y2="12" />
      <rect x="17" y="10" width="6" height="4" rx="0.5" />
      <line x1="12" y1="4" x2="12" y2="9" />
    </symbol>

    <symbol id="el-space_station" viewBox="0 0 24 24">
      <!-- Cross-shaped modular structure with core hub -->
      <rect x="5" y="9" width="14" height="6" rx="2" />
      <rect x="9" y="3" width="6" height="18" rx="2" />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
    </symbol>

    <symbol id="el-telescope" viewBox="0 0 24 24">
      <!-- Optical tube on tripod -->
      <rect x="5" y="9" width="13" height="5" rx="1" transform="rotate(-15 12 12)" />
      <line x1="12" y1="16" x2="7" y2="22" />
      <line x1="12" y1="16" x2="17" y2="22" />
      <line x1="12" y1="16" x2="12" y2="22" />
    </symbol>

    <symbol id="el-zero_gravity" viewBox="0 0 24 24">
      <!-- Floating figure with stars -->
      <circle cx="12" cy="6" r="3" />
      <path d="M12,9 Q14,13 12,16 Q10,13 12,9" />
      <path d="M8,11 Q7,15 8,17" />
      <path d="M16,11 Q17,15 16,17" />
      <circle cx="5" cy="5" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="19" cy="4" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="3" cy="15" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="21" cy="17" r="0.8" fill="currentColor" stroke="none" />
    </symbol>

    <symbol id="el-cosmonaut" viewBox="0 0 24 24">
      <!-- Astronaut helmet + visor -->
      <circle cx="12" cy="10" r="7" />
      <path d="M7.5,8 Q9,14 16.5,14" />
      <path d="M6,12 Q6,18 8,20 Q12,22 16,20 Q18,18 18,12" />
    </symbol>

    <symbol id="el-zero_point" viewBox="0 0 24 24">
      <!-- Quantum ground-state: sine wave + baseline + node dot -->
      <path d="M3,12 Q6,6 9,12 Q12,18 15,12 Q18,6 21,12" />
      <circle cx="12" cy="17" r="1.5" fill="currentColor" stroke="none" />
      <line x1="10" y1="20" x2="14" y2="20" />
    </symbol>

    <symbol id="el-wormhole" viewBox="0 0 24 24">
      <!-- Spacetime funnel tunnel -->
      <ellipse cx="12" cy="7" rx="8" ry="4" />
      <path d="M4,7 Q4,17 12,17" />
      <path d="M20,7 Q20,17 12,17" />
      <ellipse cx="12" cy="17" rx="4" ry="2" />
    </symbol>

    <!-- Fallback for any unknown key -->
    <symbol id="el-fallback" viewBox="0 0 24 24">
      <path d="M12,3 L21,12 L12,21 L3,12 Z" />
      <circle cx="12" cy="12" r="2.5" />
    </symbol>

  </defs>
</svg>
