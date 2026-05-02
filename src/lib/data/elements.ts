import type { Element } from '../types.js';

export const ELEMENTS: Record<string, Element> = {
  fire:     { name: 'Fire',      symbol: '🔥', category: 'basic',    color: 'cat-fire',     desc: 'Pure combustion energy, source of heat and light.',           formula: '⚡' },
  water:    { name: 'Water',     symbol: '💧', category: 'basic',    color: 'cat-water',    desc: 'H₂O. Essential for life, solvent of the universe.',           formula: 'H₂O' },
  earth:    { name: 'Earth',     symbol: '🪨', category: 'basic',    color: 'cat-earth',    desc: 'Solid mineral matter forming planetary crusts.',              formula: 'SiO₂' },
  air:      { name: 'Air',       symbol: '🌬', category: 'basic',    color: 'cat-air',      desc: 'Mixture of N₂, O₂, Ar and trace gases.',                     formula: 'N₂O₂' },

  steam:    { name: 'Steam',     symbol: '♨️', category: 'gas',      color: 'cat-gas',      desc: 'Water in gaseous phase above 100°C.',                        formula: 'H₂O(g)',    recipe: 'Fire + Water' },
  mud:      { name: 'Mud',       symbol: '🟫', category: 'compound', color: 'cat-compound', desc: 'Wet soil mixture, essential to early pottery.',               formula: 'SiO₂·H₂O', recipe: 'Earth + Water' },
  dust:     { name: 'Dust',      symbol: '💨', category: 'gas',      color: 'cat-gas',      desc: 'Tiny solid particles suspended in air.',                     formula: '(SiO₂)ₙ',  recipe: 'Earth + Air' },
  lava:     { name: 'Lava',      symbol: '🌋', category: 'compound', color: 'cat-compound', desc: 'Molten rock at 700–1200°C. Basalt upon cooling.',             formula: 'MgO·SiO₂', recipe: 'Fire + Earth' },
  wind:     { name: 'Wind',      symbol: '🌀', category: 'gas',      color: 'cat-gas',      desc: 'Bulk movement of air driven by pressure gradients.',         formula: 'Δp→v',      recipe: 'Air + Air' },
  plasma:   { name: 'Plasma',    symbol: '⚡', category: 'energy',   color: 'cat-energy',   desc: '4th state of matter — ionized high-energy gas.',             formula: 'e⁻+ions',   recipe: 'Fire + Air' },
  cloud:    { name: 'Cloud',     symbol: '☁️', category: 'gas',      color: 'cat-gas',      desc: 'Condensed water droplets suspended in atmosphere.',          formula: 'H₂O(l/s)',  recipe: 'Water + Air' },
  rain:     { name: 'Rain',      symbol: '🌧', category: 'water',    color: 'cat-water',    desc: 'Precipitation falling from cumulonimbus clouds.',            formula: 'H₂O↓',      recipe: 'Cloud + Earth' },
  iron:     { name: 'Iron',      symbol: '⚙️', category: 'metal',    color: 'cat-metal',    desc: 'Fe. Transition metal, core of terrestrial planets.',         formula: 'Fe',         recipe: 'Fire + Earth + Earth' },
  salt:     { name: 'Salt',      symbol: '🧂', category: 'compound', color: 'cat-compound', desc: 'NaCl. Ionic crystal, vital electrolyte.',                    formula: 'NaCl',       recipe: 'Water + Earth' },
  ice:      { name: 'Ice',       symbol: '🧊', category: 'water',    color: 'cat-water',    desc: 'Crystalline solid water. Density 0.917 g/cm³.',              formula: 'H₂O(s)',    recipe: 'Water + Air' },
  smoke:    { name: 'Smoke',     symbol: '🌫', category: 'gas',      color: 'cat-gas',      desc: 'Aerosol from incomplete combustion.',                        formula: 'C+CO₂',     recipe: 'Fire + Dust' },
  glass:    { name: 'Glass',     symbol: '🪟', category: 'compound', color: 'cat-compound', desc: 'Amorphous SiO₂. Transparent at room temp.',                 formula: 'SiO₂(amorp)', recipe: 'Fire + Sand' },
  sand:     { name: 'Sand',      symbol: '🏜', category: 'earth',    color: 'cat-earth',    desc: 'Granular material, mostly quartz (SiO₂).',                  formula: 'SiO₂(gr)',  recipe: 'Earth + Wind' },
  volcano:  { name: 'Volcano',   symbol: '🗻', category: 'earth',    color: 'cat-earth',    desc: 'Rupture in crust where magma erupts.',                       formula: 'MgO+CO₂',   recipe: 'Lava + Earth' },
  oxygen:   { name: 'Oxygen',    symbol: 'O₂', category: 'gas',      color: 'cat-gas',      desc: "Diatomic gas. 21% of Earth's atmosphere. Supports combustion.", formula: 'O₂',      recipe: 'Water + Plasma' },
  hydrogen: { name: 'Hydrogen',  symbol: 'H₂', category: 'gas',      color: 'cat-gas',      desc: 'Lightest element. Most abundant in universe.',               formula: 'H₂',         recipe: 'Water + Plasma' },
  storm:    { name: 'Storm',     symbol: '⛈', category: 'energy',   color: 'cat-energy',   desc: 'Severe weather — lightning, thunder, torrential rain.',      formula: 'H₂O+e⁻',   recipe: 'Cloud + Plasma' },
  obsidian: { name: 'Obsidian',  symbol: '◼', category: 'earth',    color: 'cat-earth',    desc: 'Volcanic glass. Forms when lava cools rapidly.',             formula: 'SiO₂(obs)', recipe: 'Lava + Water' },
  rust:     { name: 'Rust',      symbol: '🔶', category: 'compound', color: 'cat-compound', desc: 'Fe₂O₃. Iron oxide formed by oxidation.',                    formula: 'Fe₂O₃',     recipe: 'Iron + Water' },
  steam_engine: { name: 'Engine', symbol: '🚂', category: 'compound', color: 'cat-compound', desc: 'Steam engine — converts thermal energy to mechanical work.', formula: 'ΔH→W',     recipe: 'Steam + Iron' },
  crystal:  { name: 'Crystal',   symbol: '💎', category: 'compound', color: 'cat-compound', desc: 'Lattice structure. Atoms arranged in repeating pattern.',    formula: '(SiO₂)∞',  recipe: 'Ice + Sand' },
  lightning: { name: 'Lightning', symbol: '⚡', category: 'energy',  color: 'cat-energy',   desc: 'Electrostatic discharge. Up to 1 billion volts.',           formula: 'e⁻(atm)',   recipe: 'Storm + Earth' },
  acid_rain: { name: 'Acid Rain', symbol: '🟡', category: 'compound', color: 'cat-compound', desc: 'pH<5.6 precipitation. H₂SO₄ + HNO₃ dissolved.',           formula: 'H₂SO₄',     recipe: 'Rain + Smoke' },
  magnet:   { name: 'Magnet',    symbol: '🧲', category: 'metal',    color: 'cat-metal',    desc: 'Ferromagnetic material with persistent magnetic field.',    formula: 'Fe₃O₄',     recipe: 'Iron + Lightning' },
  rainbow:  { name: 'Rainbow',   symbol: '🌈', category: 'energy',   color: 'cat-energy',   desc: 'Optical/met. phenomenon from refraction in water drops.',   formula: 'hν/λ',      recipe: 'Rain + Sunlight' },
  sunlight: { name: 'Sunlight',  symbol: '☀️', category: 'energy',   color: 'cat-energy',   desc: 'Electromagnetic radiation from nuclear fusion in the Sun.', formula: 'hν',         recipe: 'Fire + Plasma' },
};

export const BASIC_ELEMENTS = ['fire', 'water', 'earth', 'air'] as const;
export type BasicElement = (typeof BASIC_ELEMENTS)[number];
