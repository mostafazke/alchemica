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
