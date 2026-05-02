# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## GSD Workflow

This project uses Get-Shit-Done (GSD) for structured execution.

**Planning artifacts:** `.planning/`
- `PROJECT.md` — project context and requirements
- `REQUIREMENTS.md` — 27 v1 requirements with REQ-IDs
- `ROADMAP.md` — 5-phase execution plan
- `STATE.md` — current progress tracker

**Current phase:** Phase 1 — Foundation (Svelte Scaffold & Game Engine)

**Workflow commands:**
- `/gsd-discuss-phase 1` — gather context before planning
- `/gsd-plan-phase 1` — create PLAN.md for Phase 1
- `/gsd-execute-phase 1` — execute the plan
- `/gsd-progress` — check current status

**Rules:**
- Always read `.planning/STATE.md` at the start of a session to understand current phase
- Commit each plan's work atomically before moving to the next
- Never skip phases — each phase depends on the previous being stable
- Run `npm run check` (svelte-check) after every significant change

## Project Goal

Transform the single-file `alchemica.html` element combination game into a solid, scalable mobile game with proper architecture, offline support, and mobile-first design.

## Current State

Single HTML file (31KB) containing:
- Inline CSS styles (lines ~5-484)
- HTML structure (lines ~486-556)
- Vanilla JavaScript game logic (lines ~558-976)
- 32 elements with reaction system
- Canvas-based particle effects
- Grid layout (220px sidebars + flexible center)

**Current Issues for Mobile**:
- Desktop-first grid layout (3-column with fixed 220px sidebars)
- No touch optimization
- No save system (progress lost on reload)
- No responsive breakpoints
- Missing viewport meta tag for mobile
- Assets loaded from CDN (requires internet)

## Target Architecture

### Tech Stack

- **Framework**: Svelte 5 + TypeScript
- **Build tool**: Vite
- **PWA**: vite-plugin-pwa (Workbox)
- **Styling**: Svelte scoped `<style>` blocks + global CSS custom properties
- **State**: Svelte stores (no external state library needed)
- **Particles**: Vanilla Canvas API (no game engine needed for this scope)

### File Structure

```
alchemica/
├── src/
│   ├── app.html                    # Entry point with mobile meta tags
│   ├── App.svelte                  # Root layout component
│   ├── lib/
│   │   ├── components/
│   │   │   ├── TopBar.svelte
│   │   │   ├── Shelf.svelte        # Element list + filter tabs
│   │   │   ├── ElementCard.svelte
│   │   │   ├── MixingChamber.svelte
│   │   │   ├── Slot.svelte
│   │   │   ├── ResultDisplay.svelte
│   │   │   ├── DiscoveryLog.svelte
│   │   │   ├── DiscoveryItem.svelte
│   │   │   └── BottomBar.svelte
│   │   ├── data/
│   │   │   ├── elements.ts         # Typed ELEMENTS record
│   │   │   └── reactions.ts        # REACTIONS + MULTI_REACTIONS maps
│   │   ├── stores/
│   │   │   ├── game.ts             # Core game state (Svelte writable stores)
│   │   │   └── settings.ts         # Sound, haptics preferences
│   │   ├── game/
│   │   │   ├── reactions.ts        # Reaction resolution logic
│   │   │   └── scoring.ts          # Score/combo system
│   │   ├── effects/
│   │   │   └── particles.ts        # Canvas particle system
│   │   └── utils/
│   │       ├── storage.ts          # Versioned localStorage wrapper
│   │       └── touch.ts            # Touch/haptic helpers
│   ├── assets/
│   │   └── fonts/                  # Self-hosted fonts (offline support)
│   └── sw.ts                       # Service worker (via vite-plugin-pwa)
├── dist/                           # Build output (gitignored)
├── package.json
├── svelte.config.js
├── vite.config.ts
├── tsconfig.json
└── .gitignore
```

### TypeScript Types (`lib/types.ts`)

```ts
export type Category = 'basic' | 'fire' | 'water' | 'earth' | 'air' | 'metal' | 'energy' | 'gas' | 'compound';

export interface Element {
  name: string;
  symbol: string;
  category: Category;
  color: string;
  desc: string;
  formula: string;
  recipe?: string;
}

export interface Discovery {
  key: string;
  recipe: string;
  timestamp: number;
}

export interface GameState {
  unlockedElements: Set<string>;
  discoveries: Discovery[];
  slots: { a: string | null; b: string | null };
  combo: number;
  score: number;
}
```

### Module Responsibilities

**State Management** (`stores/game.ts`):
- Svelte `writable` stores — reactive by default, no manual subscribe/notify needed
- `$effect` or `subscribe` auto-saves to localStorage on change
- Store shape mirrors `GameState` above, split into individual stores for granular reactivity

```ts
export const unlockedElements = writable<Set<string>>(new Set(['fire','water','earth','air']));
export const discoveries = writable<Discovery[]>([]);
export const slots = writable<{ a: string | null; b: string | null }>({ a: null, b: null });
export const combo = writable<number>(1);
export const score = writable<number>(0);
```

**Storage** (`utils/storage.ts`):
- Versioned save format for migrations
- Export/import save data as JSON
- Cloud sync hooks (future: Firebase/Supabase)

**Touch Handling** (`utils/touch.ts`):
- Long-press for element details
- Swipe gestures for tab switching
- Haptic feedback on reactions (Vibration API)
- Prevent double-tap zoom

**Particle System** (`effects/particles.ts`):
- Object pooling to reduce GC pressure
- `requestAnimationFrame` with delta time
- Pause when tab inactive (Page Visibility API)
- Configurable particle count (performance setting)

## Mobile-First Design Requirements

### Responsive Layout Breakpoints

```css
/* Mobile portrait: single column, bottom sheet for discoveries */
@media (max-width: 768px) {
  .lab-wrapper {
    grid-template-columns: 1fr;
    grid-template-rows: 56px 1fr auto;
  }
  .shelf-panel { /* Bottom drawer or modal */ }
  .discoveries-panel { /* Swipeable bottom sheet */ }
}

/* Mobile landscape: 2-column (shelf + center) */
@media (min-width: 769px) and (max-width: 1024px) { }

/* Desktop: original 3-column grid */
@media (min-width: 1025px) { }
```

### Mobile Optimizations

**Touch Targets**:
- Minimum 44×44px (Apple HIG)
- Element cards: expand to 56px height on mobile
- Slot size: increase to 110px on mobile
- React button: full-width, 52px height

**Performance**:
- Reduce particle count on low-end devices (navigator.hardwareConcurrency)
- Use CSS transforms instead of top/left for animations
- Debounce rapid taps on React button
- Lazy render off-screen discovery items (virtual scrolling)

**Offline Support**:
- Service worker caches all assets
- localStorage for game state
- Works fully offline after first load
- Add to homescreen prompt (PWA manifest)

## Build Setup

### Initial Setup Commands

```bash
# Scaffold with Vite's Svelte-TS template
npm create vite@latest alchemica -- --template svelte-ts
cd alchemica

# Add PWA support
npm install -D vite-plugin-pwa

# Optional: add gh-pages for deploy
npm install -D gh-pages
```

### package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "check": "svelte-check --tsconfig ./tsconfig.json",
    "deploy": "vite build && gh-pages -d dist"
  }
}
```

### Development Workflow

```bash
# Start dev server with hot reload
npm run dev

# Build for production (minified, optimized)
npm run build

# Preview production build locally
npm run preview
```

## Migration Strategy

### Phase 1: Svelte Scaffold + Data Migration
1. Scaffold project with `npm create vite@latest -- --template svelte-ts`
2. Port `ELEMENTS` and `REACTIONS` to typed `.ts` data files
3. Create Svelte stores matching current game state shape
4. Build `App.svelte` shell with same 3-column layout (no visual changes yet)
5. Verify game logic works identically before any mobile changes

### Phase 2: Mobile Layout
1. Add viewport meta tag
2. Convert grid to responsive flexbox
3. Implement bottom sheet for discoveries
4. Increase touch target sizes
5. Add touch gestures

### Phase 3: State & Storage
1. Centralize state management
2. Implement localStorage save/load
3. Add settings panel (sound, haptics)
4. Export/import save data

### Phase 4: PWA Features
1. Add manifest.json
2. Implement service worker
3. Add to homescreen prompt
4. Offline mode indicator
5. Update notification

### Phase 5: Polish & Optimization
1. Optimize particle system
2. Add haptic feedback
3. Sound effects (optional)
4. Performance monitoring
5. Analytics hooks (privacy-respecting)

## Key Technical Decisions

**Why Svelte + TypeScript?**
- Compiles to vanilla JS — no runtime, smallest possible bundle for this game type
- Reactive stores replace hand-written DOM diffing and event wiring
- Scoped `<style>` blocks per component eliminate class name collisions
- TypeScript catches data shape mistakes early (element keys, reaction maps)
- Single-file components (`.svelte`) keep template + logic + styles co-located

**Why Vite?**
- Zero config with the `svelte-ts` template
- Fast HMR with Svelte plugin
- Built-in code splitting and tree-shaking
- `vite-plugin-pwa` integrates cleanly for service worker + manifest

**Why localStorage over IndexedDB?**
- Simple key-value storage sufficient
- ~5MB limit enough for save data
- Synchronous API simpler
- Can migrate to IndexedDB if cloud sync added

**Why CSS Grid over Flexbox?**
- Grid for overall layout (topbar/content/bottombar)
- Flexbox for components (shelf items, slot rows)
- Better responsive control with grid-template-areas

## Current Game Data

**Elements**: 32 total (4 basic + 28 discoverable)
**Reactions**: ~45 two-element reactions
**Categories**: fire, water, earth, air, metal, energy, gas, compound
**Scoring**: 100 points × combo for new, 10 × combo for known
**Max Combo**: 8x

## Code Locations (Current Single File)

- Element definitions: lines 559-592
- Reaction mappings: lines 594-644
- Multi-element reactions: lines 647-651
- Particle system: lines 873-971
- Render functions: lines 674-863
- Game state: lines 653-660
- UI event handlers: lines 711-766

## Mobile Testing

```bash
# Test on local network devices
vite --host

# Use browser dev tools device emulation
# Chrome DevTools: Toggle device toolbar (Ctrl+Shift+M)

# Real device testing via ngrok/cloudflare tunnel
npx ngrok http 5173
```

## Progressive Enhancement Strategy

**Core Experience** (works everywhere):
- Element selection and combination
- Result display
- Basic localStorage save

**Enhanced Experience** (modern browsers):
- Particle effects (Canvas API)
- Haptic feedback (Vibration API)
- Install prompt (PWA)
- Share button (Web Share API)

**Graceful Degradation**:
- No canvas: show CSS animations only
- No localStorage: session-only mode warning
- No service worker: online-only mode
