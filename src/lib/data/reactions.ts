/**
 * Two-element reaction map: 'elementA+elementB' → result element key.
 * Both orderings are included so lookups work regardless of slot order.
 * Note: 'water+air' maps to 'cloud' (alchemica.html original behaviour).
 * Ice has no two-element reaction trigger in the original; it requires the
 * hint system or multi-element path (to be added in Phase 4).
 */
export const REACTIONS: Record<string, string> = {
  'fire+water': 'steam',
  'water+fire': 'steam',

  'earth+water': 'mud',
  'water+earth': 'mud',

  'earth+air': 'dust',
  'air+earth': 'dust',

  'fire+earth': 'lava',
  'earth+fire': 'lava',

  'air+air': 'wind',

  'fire+air': 'plasma',
  'air+fire': 'plasma',

  'water+air': 'cloud',
  'air+water': 'cloud',

  'water+wind': 'ice',
  'wind+water': 'ice',

  'cloud+earth': 'rain',
  'earth+cloud': 'rain',

  'mud+fire': 'salt',
  'fire+mud': 'salt',

  'earth+wind': 'sand',
  'wind+earth': 'sand',

  'fire+dust': 'smoke',
  'dust+fire': 'smoke',

  'fire+sand': 'glass',
  'sand+fire': 'glass',

  'lava+earth': 'volcano',
  'earth+lava': 'volcano',

  'lava+air': 'iron',
  'air+lava': 'iron',

  'water+plasma': 'oxygen',
  'plasma+water': 'oxygen',

  'steam+plasma': 'hydrogen',
  'plasma+steam': 'hydrogen',

  'cloud+plasma': 'storm',
  'plasma+cloud': 'storm',

  'lava+water': 'obsidian',
  'water+lava': 'obsidian',

  'fire+plasma': 'sunlight',
  'plasma+fire': 'sunlight',

  'rain+smoke': 'acid_rain',
  'smoke+rain': 'acid_rain',

  'storm+earth': 'lightning',
  'earth+storm': 'lightning',

  'iron+lightning': 'magnet',
  'lightning+iron': 'magnet',

  'rain+sunlight': 'rainbow',
  'sunlight+rain': 'rainbow',

  'iron+water': 'rust',
  'water+iron': 'rust',

  'ice+sand': 'crystal',
  'sand+ice': 'crystal',

  'steam+iron': 'steam_engine',
  'iron+steam': 'steam_engine',

  // ── Phase 4 new reactions ─────────────────────────────────────────────────
  'earth+earth': 'stone',

  'steam+earth': 'fog',
  'earth+steam': 'fog',

  'ice+wind': 'snow',
  'wind+ice': 'snow',

  'rain+rain': 'flood',

  'rain+earth': 'wood',
  'earth+rain': 'wood',

  'wood+fire': 'ash',
  'fire+wood': 'ash',

  'wood+earth': 'coal',
  'earth+wood': 'coal',

  'coal+fire': 'carbon',
  'fire+coal': 'carbon',

  'iron+carbon': 'steel',
  'carbon+iron': 'steel',

  'mud+earth': 'clay',
  'earth+mud': 'clay',

  'clay+fire': 'brick',
  'fire+clay': 'brick',

  'volcano+earth': 'sulfur',
  'earth+volcano': 'sulfur',

  'water+sulfur': 'acid',
  'sulfur+water': 'acid',

  'earth+lightning': 'copper',
  'lightning+earth': 'copper',

  'copper+iron': 'bronze',
  'iron+copper': 'bronze',

  'sand+acid': 'gold',
  'acid+sand': 'gold',

  'earth+sunlight': 'plant',
  'sunlight+earth': 'plant',

  'plant+wind': 'seed',
  'wind+plant': 'seed',

  'seed+earth': 'tree',
  'earth+seed': 'tree',

  'earth+coal': 'oil',
  'coal+earth': 'oil',

  'oil+steam': 'plastic',
  'steam+oil': 'plastic',

  'fire+oil': 'explosion',
  'oil+fire': 'explosion',

  'explosion+steel': 'rocket',
  'steel+explosion': 'rocket',

  'lightning+copper': 'electricity',
  'copper+lightning': 'electricity',

  'electricity+magnet': 'motor',
  'magnet+electricity': 'motor',

  'water+sunlight': 'life',
  'sunlight+water': 'life',

  'life+earth': 'animal',
  'earth+life': 'animal',

  'animal+fire': 'human',
  'fire+animal': 'human',

  'human+steel': 'city',
  'steel+human': 'city',

  'wind+storm': 'tornado',
  'storm+wind': 'tornado',

  // ── Space Science Pack reactions (Story 3.4) ──────────────────────────────
  // vacuum
  'air+explosion': 'vacuum',
  'explosion+air': 'vacuum',
  'space_dust+gravity': 'vacuum',  // clearing space
  'gravity+space_dust': 'vacuum',

  // ion
  'plasma+electricity': 'ion',
  'electricity+plasma': 'ion',
  'radiation+hydrogen': 'ion',
  'hydrogen+radiation': 'ion',

  // photon
  'sunlight+vacuum': 'photon',
  'vacuum+sunlight': 'photon',
  'fusion+electricity': 'photon',
  'electricity+fusion': 'photon',

  // radiation
  'ion+photon': 'radiation',
  'photon+ion': 'radiation',
  'supernova+electricity': 'radiation',
  'electricity+supernova': 'radiation',

  // solar_wind
  'plasma+vacuum': 'solar_wind',
  'vacuum+plasma': 'solar_wind',
  'star+ion': 'solar_wind',
  'ion+star': 'solar_wind',

  // gravity
  'vacuum+earth': 'gravity',
  'earth+vacuum': 'gravity',
  'planet+orbit': 'gravity',
  'orbit+planet': 'gravity',

  // orbit
  'gravity+rocket': 'orbit',
  'rocket+gravity': 'orbit',
  'satellite+earth': 'orbit',
  'earth+satellite': 'orbit',

  // atmosphere
  'air+gravity': 'atmosphere',
  'gravity+air': 'atmosphere',
  'planet+air': 'atmosphere',
  'air+planet': 'atmosphere',

  // magnetosphere
  'magnet+solar_wind': 'magnetosphere',
  'solar_wind+magnet': 'magnetosphere',
  'planet+magnet': 'magnetosphere',
  'magnet+planet': 'magnetosphere',

  // aurora
  'solar_wind+magnetosphere': 'aurora',
  'magnetosphere+solar_wind': 'aurora',
  'ion+atmosphere': 'aurora',
  'atmosphere+ion': 'aurora',

  // nebula
  'hydrogen+vacuum': 'nebula',
  'vacuum+hydrogen': 'nebula',
  'space_dust+steam': 'nebula',
  'steam+space_dust': 'nebula',

  // star
  'nebula+gravity': 'star',
  'gravity+nebula': 'star',
  'fusion+gravity': 'star',
  'gravity+fusion': 'star',

  // fusion
  'hydrogen+star': 'fusion',
  'star+hydrogen': 'fusion',
  'plasma+gravity': 'fusion',
  'gravity+plasma': 'fusion',

  // sunlight_star (stellar light)
  'fusion+photon': 'sunlight_star',
  'photon+fusion': 'sunlight_star',
  'star+photon': 'sunlight_star',
  'photon+star': 'sunlight_star',

  // red_dwarf
  'star+vacuum': 'red_dwarf',
  'vacuum+star': 'red_dwarf',
  'hydrogen+gravity': 'red_dwarf',
  'gravity+hydrogen': 'red_dwarf',

  // white_dwarf
  'star+carbon': 'white_dwarf',
  'carbon+star': 'white_dwarf',
  'star+ash': 'white_dwarf',
  'ash+star': 'white_dwarf',

  // neutron_star — star collapse by explosion; supernova+iron (iron core collapse)
  'star+explosion': 'neutron_star',
  'explosion+star': 'neutron_star',
  'supernova+iron': 'neutron_star',
  'iron+supernova': 'neutron_star',

  // supernova — massive star + intense radiation; 'star+explosion' is neutron_star, use different path
  'star+radiation': 'supernova',
  'radiation+star': 'supernova',
  'red_dwarf+explosion': 'supernova',
  'explosion+red_dwarf': 'supernova',

  // pulsar
  'neutron_star+radiation': 'pulsar',
  'radiation+neutron_star': 'pulsar',
  'neutron_star+magnetosphere': 'pulsar',
  'magnetosphere+neutron_star': 'pulsar',

  // black_hole — supernova + gravity; gravity+neutron_star as second pair
  'neutron_star+gravity': 'black_hole',
  'gravity+neutron_star': 'black_hole',
  'supernova+gravity': 'black_hole',
  'gravity+supernova': 'black_hole',

  // accretion_disk
  'black_hole+steam': 'accretion_disk',
  'steam+black_hole': 'accretion_disk',
  'black_hole+space_dust': 'accretion_disk',
  'space_dust+black_hole': 'accretion_disk',

  // quasar
  'black_hole+accretion_disk': 'quasar',
  'accretion_disk+black_hole': 'quasar',
  'black_hole+electricity': 'quasar',
  'electricity+black_hole': 'quasar',

  // binary_star
  'star+orbit': 'binary_star',
  'orbit+star': 'binary_star',
  'star+gravity': 'binary_star',
  'gravity+star': 'binary_star',

  // moon
  'earth+orbit': 'moon',
  'orbit+earth': 'moon',
  'planet+comet': 'moon',
  'comet+planet': 'moon',

  // tides
  'moon+water': 'tides',
  'water+moon': 'tides',
  'moon+gravity': 'tides',
  'gravity+moon': 'tides',

  // eclipse
  'moon+orbit': 'eclipse',
  'orbit+moon': 'eclipse',
  'moon+sunlight': 'eclipse',
  'sunlight+moon': 'eclipse',

  // asteroid — use stone+orbit and space_dust+vacuum (not space_dust+gravity which is already used for vacuum)
  'stone+orbit': 'asteroid',
  'orbit+stone': 'asteroid',
  'space_dust+vacuum': 'asteroid',
  'vacuum+space_dust': 'asteroid',

  // comet
  'ice+orbit': 'comet',
  'orbit+ice': 'comet',
  'asteroid+ice': 'comet',
  'ice+asteroid': 'comet',

  // meteorite
  'asteroid+atmosphere': 'meteorite',
  'atmosphere+asteroid': 'meteorite',
  'comet+atmosphere': 'meteorite',
  'atmosphere+comet': 'meteorite',

  // crater
  'meteorite+earth': 'crater',
  'earth+meteorite': 'crater',
  'asteroid+earth': 'crater',
  'earth+asteroid': 'crater',

  // planet — formed by gravity; space_dust+explosion is the nebular path
  'asteroid+gravity': 'planet',
  'gravity+asteroid': 'planet',
  'nebula+explosion': 'planet',
  'explosion+nebula': 'planet',

  // exoplanet — planet around another star; use different second pair
  'planet+star': 'exoplanet',
  'star+planet': 'exoplanet',
  'planet+solar_wind': 'exoplanet',
  'solar_wind+planet': 'exoplanet',

  // planetary_ring — planet with ice/rock debris; avoid planet+asteroid (now moon)
  'planet+asteroid': 'planetary_ring',
  'asteroid+planet': 'planetary_ring',
  'planet+ice': 'planetary_ring',
  'ice+planet': 'planetary_ring',

  // solar_system — star+asteroid as primary path; comet+star as second
  'star+comet': 'solar_system',
  'comet+star': 'solar_system',
  'star+asteroid': 'solar_system',
  'asteroid+star': 'solar_system',

  // x_ray — radiation + photon, and neutron_star + magnetosphere (not radiation which is pulsar)
  'radiation+photon': 'x_ray',
  'photon+radiation': 'x_ray',
  'neutron_star+vacuum': 'x_ray',
  'vacuum+neutron_star': 'x_ray',

  // gamma_ray — supernova + radiation; black_hole + photon as second path (not radiation=quasar)
  'supernova+radiation': 'gamma_ray',
  'radiation+supernova': 'gamma_ray',
  'black_hole+photon': 'gamma_ray',
  'photon+black_hole': 'gamma_ray',

  // cosmic_ray
  'supernova+ion': 'cosmic_ray',
  'ion+supernova': 'cosmic_ray',
  'gamma_ray+vacuum': 'cosmic_ray',
  'vacuum+gamma_ray': 'cosmic_ray',

  // space_dust
  'dust+vacuum': 'space_dust',
  'vacuum+dust': 'space_dust',
  'supernova+ash': 'space_dust',
  'ash+supernova': 'space_dust',

  // dark_matter
  'galaxy+gravity': 'dark_matter',
  'gravity+galaxy': 'dark_matter',
  'vacuum+gravity': 'dark_matter',
  'gravity+vacuum': 'dark_matter',

  // light_year
  'photon+orbit': 'light_year',
  'orbit+photon': 'light_year',
  'photon+solar_system': 'light_year',
  'solar_system+photon': 'light_year',

  // parsec
  'light_year+orbit': 'parsec',
  'orbit+light_year': 'parsec',
  'light_year+telescope': 'parsec',
  'telescope+light_year': 'parsec',

  // galaxy
  'star+dark_matter': 'galaxy',
  'dark_matter+star': 'galaxy',
  'solar_system+dark_matter': 'galaxy',
  'dark_matter+solar_system': 'galaxy',

  // universe
  'galaxy+light_year': 'universe',
  'light_year+galaxy': 'universe',
  'galaxy+dark_matter': 'universe',

  // satellite
  'rocket+orbit': 'satellite',
  'orbit+rocket': 'satellite',
  'steel+orbit': 'satellite',
  'orbit+steel': 'satellite',

  // space_station — satellite + steel, and cosmonaut + satellite
  'satellite+steel': 'space_station',
  'steel+satellite': 'space_station',
  'cosmonaut+satellite': 'space_station',
  'satellite+cosmonaut': 'space_station',

  // telescope
  'glass+electricity': 'telescope',
  'electricity+glass': 'telescope',
  'glass+iron': 'telescope',
  'iron+glass': 'telescope',

  // zero_gravity — orbit + human; zero_point is vacuum+electricity
  'orbit+human': 'zero_gravity',
  'human+orbit': 'zero_gravity',
  'space_station+human': 'zero_gravity',
  'human+space_station': 'zero_gravity',

  // cosmonaut
  'human+rocket': 'cosmonaut',
  'rocket+human': 'cosmonaut',
  'zero_gravity+human': 'cosmonaut',
  'human+zero_gravity': 'cosmonaut',

  // zero_point (zero-point energy)
  'vacuum+electricity': 'zero_point',
  'electricity+vacuum': 'zero_point',
  'vacuum+ion': 'zero_point',
  'ion+vacuum': 'zero_point',

  // wormhole
  'black_hole+gravity': 'wormhole',
  'gravity+black_hole': 'wormhole',
  'black_hole+vacuum': 'wormhole',
  'vacuum+black_hole': 'wormhole',
};

/**
 * Three-element reactions. Key format: sorted 'a+b+c' — caller must normalize.
 * Currently only one: Fire + Earth + Earth → Iron.
 */
export const MULTI_REACTIONS: Record<string, string> = {
  'fire+earth+earth': 'iron',
  'earth+earth+fire': 'iron',
  'earth+fire+earth': 'iron',
};
