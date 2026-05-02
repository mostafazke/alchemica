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

  'water+plasma': 'oxygen',
  'plasma+water': 'oxygen',

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
