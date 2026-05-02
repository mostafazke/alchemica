# Roadmap: Alchemica

**Project:** Alchemica — Mobile-first element combination PWA
**Updated:** 2026-05-02

---

## ✅ Milestone v1 — Mobile PWA (SHIPPED 2026-05-02)

5 phases · 25 plans · 61 elements · 27/27 requirements · PR #1 · git tag v1
Full archive: [.planning/milestones/v1-ROADMAP.md](milestones/v1-ROADMAP.md)

---

## Milestone v2 — (Not yet planned)

Run `/gsd-new-milestone` to define v2 requirements and roadmap.

Known v2 candidates:
- Self-host Space Mono font (completes ARCH-07 design intent)
- Achievement system (PROG-01)
- Discovery percentage on homescreen (PROG-02)
- Cloud save sync (SOCL-01)
- In-app content editor (CMS-01/CMS-02)
- Native iOS/Android via Capacitor (PLAT-01)
- Sound effects with mute toggle (PLAT-02)
- Lighthouse PWA ≥ 90 audit (requires deployed URL)
- Real-device offline test


**Goal:** Migrate the working game from a single HTML file into a Svelte + TypeScript project with identical gameplay. The game must be playable at the end of this phase — every element, reaction, score, and combo working exactly as before.

**Requirements:** ARCH-01, ARCH-02, ARCH-03, ARCH-04, ARCH-07, CONT-04, GAME-01, GAME-07

**Success Criteria:**
1. `npm run dev` serves the game and all 32 elements are selectable and combinable
2. All ~45 reactions produce correct results with correct scoring and combo tracking
3. Game state (unlocked elements, discoveries, score) persists across page refresh via localStorage
4. Elements and reactions are defined exclusively in `lib/data/elements.ts` and `lib/data/reactions.ts` — no element data in component files
5. Fonts load locally with no network requests in production build

**Plans:**
1. Scaffold Vite + Svelte 5 + TypeScript project, configure Vite, set up directory structure
2. Port element and reaction data to typed TypeScript files (`elements.ts`, `reactions.ts`, `types.ts`)
3. Build Svelte stores (`game.ts`) with localStorage persistence and versioned save format
4. Build UI components: `App.svelte`, `TopBar.svelte`, `Shelf.svelte`, `ElementCard.svelte`, `MixingChamber.svelte`, `Slot.svelte`, `ResultDisplay.svelte`, `DiscoveryLog.svelte`, `BottomBar.svelte`
5. Port particle system to `lib/effects/particles.ts` and wire to Svelte component lifecycle

**UI hint:** yes

---

## Phase 2: Mobile Layout & Responsive Design

**Goal:** Make the game fully usable on mobile. The 3-column desktop layout collapses to a mobile-optimized single-column layout with a bottom sheet for discoveries. All touch targets meet 44px minimum.

**Requirements:** LAYT-01, LAYT-02, LAYT-03, LAYT-04, LAYT-05, TOUC-04, GAME-02

**Success Criteria:**
1. On a 375px-wide viewport the layout is single column with no horizontal overflow
2. Discoveries panel slides up as a bottom sheet on mobile portrait; renders as a sidebar on desktop
3. Every tappable element (cards, slots, React button, tabs) has a minimum 44×44px touch area
4. Element shelf groups elements by category with visible section headers
5. React button spans full width at 52px height on mobile
6. Double-tap zoom does not trigger on element cards or slots

**Plans:**
1. Convert lab-wrapper to CSS Grid with `grid-template-areas` and 3 responsive breakpoints
2. Build `BottomSheet.svelte` component with CSS slide-up animation and drag handle
3. Implement category-grouped shelf with section headers and collapsible groups
4. Audit and enforce 44px touch targets across all interactive elements
5. Add `touch-action: manipulation` and viewport meta tag; test on real device viewport sizes

**UI hint:** yes

---

## Phase 3: Touch, Persistence & Save/Load

**Goal:** Complete the touch interaction layer and give players full control over their save data. Haptic feedback, long-press details, swipe gestures, and export/import are all functional.

**Requirements:** TOUC-01, TOUC-02, TOUC-03, GAME-05, GAME-06

**Success Criteria:**
1. Tapping React button on a mobile device produces a vibration pulse on successful reaction
2. Long-pressing an element card for 500ms shows a detail card with name, formula, description, and recipe
3. Swiping left/right on the shelf tab row switches between All / Basic / Found filters
4. Player can tap "Export Save" and receive a downloadable JSON file with their full game state
5. Player can upload a previously exported JSON file and have their progress fully restored
6. Importing a save from an older version schema shows a compatibility warning (not a crash)

**Plans:**
1. Build `lib/utils/touch.ts` — long-press detector, swipe handler, haptic helper (Vibration API wrapper)
2. Build `ElementDetail.svelte` tooltip/popover component wired to long-press events
3. Wire swipe handler to shelf tab switching
4. Build `lib/utils/storage.ts` — versioned save format, export-to-JSON, import-from-JSON with schema validation
5. Add Export / Import buttons to settings panel or bottom bar

**UI hint:** yes

---

## Phase 4: Content Expansion & Hint System

**Goal:** Grow the element library from 32 to 60+ elements with accurate scientific content, add a hint system, and wire up the Web Share API for sharing discoveries.

**Requirements:** GAME-03, GAME-04, CONT-01, CONT-02, CONT-03

**Success Criteria:**
1. Game contains 60+ elements with valid reaction chains — every new element is reachable through combinations
2. All elements have accurate scientific descriptions (≥1 sentence) and correct chemical formulas
3. All elements are assigned to one of 8 categories with consistent category rules
4. Tapping "Hint" reveals a valid unused combination after a 30-second cooldown (button shows countdown)
5. Tapping Share on a discovered element invokes Web Share API (or falls back to clipboard copy on unsupported browsers)

**Plans:**
1. Design and write 28+ new elements with reactions — validate full discovery tree (no orphaned elements)
2. Review and improve all 32 existing element descriptions and formulas for scientific accuracy
3. Build hint engine in `lib/game/reactions.ts` — find a valid unused combination, expose with cooldown timer
4. Build `HintButton.svelte` with countdown display and disable state
5. Build share utility in `lib/utils/share.ts` — Web Share API with clipboard fallback; add share trigger to `DiscoveryItem.svelte` and result display

**UI hint:** yes

---

## Phase 5: PWA, Offline & Polish

**Goal:** Ship the game as a fully installable, offline-capable PWA. Service worker caches all assets, the manifest enables homescreen install, and the production build has no CDN dependencies.

**Requirements:** ARCH-05, ARCH-06, PWA-01, PWA-02, PWA-03

**Success Criteria:**
1. Disabling network after first load does not break any game functionality — all assets served from cache
2. Chrome and Safari both show "Add to Home Screen" / install prompt for the app
3. Installed app opens in standalone mode (no browser chrome)
4. An offline/online status indicator appears in the UI when the network connection is lost
5. `npm run build` produces a dist/ with no external CDN references (verified with `grep -r 'cdn\|googleapis\|gstatic' dist/`)
6. Lighthouse PWA score ≥ 90 on mobile

**Plans:**
1. Configure `vite-plugin-pwa` with Workbox GenerateSW strategy; define runtime caching rules for all asset types
2. Create `public/manifest.json` with name, short_name, icons (192px + 512px), theme_color, background_color, display: standalone
3. Create PWA icons (SVG → PNG export at 192px and 512px); place in `public/icons/`
4. Build `OfflineIndicator.svelte` — subscribes to `navigator.onLine` events; shows/hides toast
5. Run Lighthouse audit; fix any PWA score gaps; verify full offline flow on real device

**UI hint:** yes

---

## Requirement Coverage

| Phase | Requirements | Count |
|-------|-------------|-------|
| Phase 1 | ARCH-01, ARCH-02, ARCH-03, ARCH-04, ARCH-07, CONT-04, GAME-01, GAME-07 | 8 |
| Phase 2 | LAYT-01, LAYT-02, LAYT-03, LAYT-04, LAYT-05, TOUC-04, GAME-02 | 7 |
| Phase 3 | TOUC-01, TOUC-02, TOUC-03, GAME-05, GAME-06 | 5 |
| Phase 4 | GAME-03, GAME-04, CONT-01, CONT-02, CONT-03 | 5 |
| Phase 5 | ARCH-05, ARCH-06, PWA-01, PWA-02, PWA-03 | 3 (5 incl. polish) |

**Total:** 27 v1 requirements → 27 mapped → 0 unmapped ✓

---

## Dependency Order

```
Phase 1 (Scaffold + Engine)
  └─► Phase 2 (Mobile Layout)       — needs working Svelte components
        └─► Phase 3 (Touch + Save)  — needs layout finalized
              └─► Phase 4 (Content) — needs stable game engine
                    └─► Phase 5 (PWA) — needs complete app to cache
```

Phases must run sequentially — each depends on the previous being stable.
