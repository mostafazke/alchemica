# Story 1.2: App Store Screenshots (5 New)

Status: done

## Story

As a **potential player viewing the App Store listing**,
I want **to see compelling screenshots that show the discovery mechanic, daily challenge streak, achievements, and clean UI**,
so that **I can immediately understand what Alchemica offers and want to download it**.

## Acceptance Criteria

1. Screenshot 1: Discovery moment in progress — mixing chamber active, "New Element!" banner visible; headline: "Discover 300+ elements through real science"
2. Screenshot 2: Daily challenge UI with streak counter visible (e.g., "14-day streak!"); headline: "A new science challenge every day"
3. Screenshot 3: Achievement grid with earned badges; headline: "Earn achievements. Explore everything."
4. Screenshot 4: Element shelf showing category view with per-category completion; headline: "300+ elements to discover"
5. Screenshot 5: Full game UI (mixing chamber + shelf + top bar); headline: "Clean, distraction-free mixing experience"
6. All screenshots meet App Store (1290×2796px) and Google Play (1080×1920px) dimension requirements

## Tasks / Subtasks

- [x] Task 1: Create `scripts/gen-store-screenshots.js` to capture 5 store-ready screenshots (AC: #1–#6)
  - [x] 1.1 Add App Store (1290×2796) and Google Play (1080×1920) dimensions — portrait composition with landscape game capture
  - [x] 1.2 Add screenshot configs for 5 scenarios with routing, game state setup, and wait conditions
  - [x] 1.3 Implement headline overlay via portrait compositor page (game captured at landscape, composed into portrait frame with headline)
  - [x] 1.4 Screenshot 1 — Discovery banner injected via DOM, 8 elements unlocked
  - [x] 1.5 Screenshot 2 — Daily challenge completed with 14-day streak, DailyPill click or fallback overlay
  - [x] 1.6 Screenshot 3 — Achievement gallery overlay with 3/4 badges earned
  - [x] 1.7 Screenshot 4 — Rich element grid with 55 elements across categories
  - [x] 1.8 Screenshot 5 — Moderate game state (15 elements), clean UI layout
  - [x] 1.9 Output files: `static/store-screenshot-{1..5}-{appstore|googleplay}.png` (10 files)
- [x] Task 2: PWA manifest alignment
  - [x] 2.1 Existing `screenshot-wide.png` and `screenshot-narrow.png` kept for PWA install prompt (separate from store screenshots)
  - [x] 2.2 Script outputs confirmation message listing all generated files

## File List

| File | Action | Description |
|------|--------|-------------|
| `scripts/gen-store-screenshots.js` | Created | Playwright-based store screenshot generator (landscape capture + portrait composition) |
| `static/store-screenshot-{1..5}-appstore.png` | Created | 5 App Store screenshots (1290×2796) |
| `static/store-screenshot-{1..5}-googleplay.png` | Created | 5 Google Play screenshots (1080×1920) |

## Change Log

- Created `scripts/gen-store-screenshots.js` — new script (separate from existing `gen-screenshots.js`)
- Approach: captures game at 1280×800 landscape, composes into portrait frame with headline text using a separate Playwright page with embedded base64 game image
- Auto-detects dev server port (5173/5174/5175/4173)
- Each scenario seeds localStorage with appropriate game state before capture
- Screenshots 1-3 inject DOM overlays for discovery banner, daily panel, and achievement gallery
- 10 PNG files generated in `static/` directory

## Dev Notes

### Architecture & Approach

This is a **screenshot generation script** — the output is image files, not game code. The existing `scripts/gen-screenshots.js` uses Playwright to capture screens from the running dev server. We extend this pattern.

**Key challenge:** Screenshots need specific game states (elements unlocked, streak set, achievements earned). These states live in `localStorage`. The script must inject localStorage values before navigating to pages.

### Existing Infrastructure

| File | Purpose |
|------|---------|
| `scripts/gen-screenshots.js` | Current PWA screenshot capture — 2 screenshots (wide 1280×800, narrow 390×844) |
| `scripts/gen-icons.js` | Icon generation with raw PNG — no external deps |
| `static/screenshot-wide.png` | Existing PWA wide screenshot |
| `static/screenshot-narrow.png` | Existing PWA narrow screenshot |

### Game State Architecture (localStorage keys)

The game uses Svelte stores backed by localStorage. To seed screenshot states, inject these keys:

| Store | localStorage key | Format |
|-------|-----------------|--------|
| `unlockedElements` | `alchemica_unlocked` | JSON array of element keys: `["fire","water","steam",...]` |
| `discoveries` | `alchemica_discoveries` | JSON array of discovery entries |
| `score` | `alchemica_score` | Number |
| `combo` | `alchemica_combo` | Number |
| `streakCount` | `alchemica_streak` | Number |
| `earnedAchievements` | `alchemica_achievements` | JSON array of achievement IDs |
| `dailyChallengeTarget` | `alchemica_daily_target` | Element key string |
| `dailyCompleted` | `alchemica_daily_completed` | `"true"` or `"false"` |
| `lastCompletedDate` | `alchemica_last_completed_date` | ISO date string |

**Critical:** Verify actual localStorage key names by checking the store files in `src/lib/stores/`.

### Screenshot Dimensions

| Platform | Dimensions | Orientation | Notes |
|----------|-----------|-------------|-------|
| App Store (iPhone 6.7") | 1290×2796 | Portrait | Required for iPhone 15 Pro Max |
| Google Play | 1080×1920 | Portrait | Standard phone screenshot |

**Note:** The game UI is landscape-oriented. Store screenshots are portrait. The script should capture the game in landscape viewport but frame it within a portrait device mockup, OR capture in portrait mode (game should be responsive enough). Given the game uses `orientation: landscape`, the best approach is to:
1. Capture the game at landscape dimensions
2. Composite the capture into a portrait frame with the headline text above the game viewport

### Headline Overlay Strategy

Rather than modifying game code, inject headline text via Playwright:
- Use `page.evaluate()` to inject an absolutely-positioned overlay div with the headline text
- Style: white text on dark gradient, large font, centered above the game viewport
- This keeps the game code clean and allows easy headline text changes

### Component Locations for Reference

| Component | File | What it shows |
|-----------|------|--------------|
| Game page (main layout) | `src/routes/game/+page.svelte` | TopBar + ElementGrid + MixingChamber + banners |
| TopBar | `src/lib/components/TopBar.svelte` | Score, combo, streak fire, DailyPill |
| ElementGrid (shelf) | `src/lib/components/ElementGrid.svelte` | Category-grouped elements with completion counts |
| MixingChamber | `src/lib/components/MixingChamber.svelte` | Slots, reaction, DiscoveryOverlay, HintButton |
| DiscoveryBanner | `src/lib/components/DiscoveryBanner.svelte` | Full-width "You discovered X!" slide-in |
| DailyPill | `src/lib/components/DailyPill.svelte` | Collapsed daily challenge pill with streak |
| DailyChallenge | `src/lib/components/DailyChallenge.svelte` | Full daily challenge panel |
| AchievementGallery | `src/lib/components/AchievementGallery.svelte` | Badge grid overlay |
| DiscoveryOverlay | `src/lib/components/DiscoveryOverlay.svelte` | Element discovery celebration |

### Previous Story Learnings (from 1-1)

- PWA manifest `name` was updated to `"Alchemica: Element Discovery Lab"` — screenshots should reflect this branding
- `short_name` stayed `"Alchemica"` — this appears on home screen icons
- The game runs on `https://localhost:5173` during dev (uses basicSsl plugin)

### Element Data

Elements are defined in `src/lib/data/elements.js` (or `.ts`). Categories: basic, earth, water, gas, compound, energy, metal, space. Use real element keys from this file when seeding screenshot state.

### Badges Data

Badges are defined in `src/lib/data/badges.js` (or `.ts`). Each badge has `id`, `name`, `emoji`, `threshold`. Seed `earnedAchievements` with actual badge IDs.

### References

- [Source: epics.md — Story 1.2](_bmad-output/planning-artifacts/epics.md)
- [Source: research §6.2 — Screenshot Strategy](_bmad-output/planning-artifacts/research/domain-alchemica-best-practices-research-2026-05-09.md)
- [Source: existing gen-screenshots.js](scripts/gen-screenshots.js)

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (GitHub Copilot)

### Completion Notes

- Story context created with comprehensive screenshot generation guide
- Key technical decisions documented: Playwright-based capture, localStorage seeding, headline overlay via injection
- All component locations mapped for screenshot targeting
