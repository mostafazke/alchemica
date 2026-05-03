---
phase: 13
slug: main-menu-screen
status: context-complete
date: 2026-05-03
requirements: [MENU-01, MENU-05]
---

# Phase 13: Main Menu Screen — Context

**Gathered:** 2026-05-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Introduce a branded main menu screen that players see on launch. The menu shows the game title and visual identity. Tapping Play navigates to the game via a smooth animated transition. Browser/Android back from the game returns to the menu.

**In scope:**
- New SvelteKit route at `/game` (current `+page.svelte` moves here)
- New menu at `src/routes/+page.svelte`
- SvelteKit page transition animation (to and from game)
- Title / logo mark on the menu
- Single "Play" (or "Continue") call-to-action

**Out of scope (this phase):**
- Progress display on menu (e.g. "32/61 discovered") — MENU-02, v5
- New Game confirmation dialog — MENU-03, v5
- Settings shortcut on menu — MENU-04, v5
- Background particle effect on menu — MENU-06, v5
- Credits / About screen — MENU-07, v5
- Any changes to game state, save format, or store logic

</domain>

<decisions>
## Implementation Decisions

### D-01: Routing architecture — `/game` route
**Decision:** Move the existing game (`src/routes/+page.svelte`) to `src/routes/game/+page.svelte`. The menu becomes the new `src/routes/+page.svelte`. Navigation uses SvelteKit `goto('/game')` from the Play button.
**Source:** User confirmed (2026-05-03).
**Implication:** `+layout.svelte` (orientation lock, AdMob init) already wraps all routes — no layout changes needed.

### D-02: Back navigation — browser back only
**Decision:** Players return to the menu via the Android/browser back button. No in-game back button is added in this phase. The existing TopBar and BottomBar are not modified.
**Source:** User confirmed (2026-05-03).

### D-03: Menu content — title + Play button only (minimal)
**Decision:** The menu screen shows the game title ("Alchemica"), a logo mark (text-based or simple SVG alchemical symbol), and a single Play/Continue CTA. No progress teaser, no settings shortcut. Keep it minimal for v4.
**Source:** Default applied — user did not discuss; minimal scope consistent with 2-requirement milestone.

### D-04: Transition style — SvelteKit page transitions with fade/scale
**Decision:** Use SvelteKit's built-in `fly` or `fade` transition on the page components (via `+page.svelte` `<transition>` or SvelteKit's `onNavigate` hook). A brief crossfade or slide-up on navigate-to-game; reverse on back. Keep it lightweight — no custom animation library.
**Source:** Default applied. Consistent with existing Svelte transition usage in components (BottomSheet, SettingsPanel use CSS transitions).

### D-05: Visual identity — dark alchemical theme, text logo
**Decision:** The menu uses the existing app theme (`#0d1b2e` background, `#c8d8e8` text, gold accent `#c9a84c`). The title is styled text ("Alchemica") with a subtitle or tagline. No custom font or logo image asset needed in v4 — use system font with letter-spacing/weight styling consistent with the existing UI.
**Source:** Default applied. Consistent with existing visual identity; avoids new asset pipeline in a minimal phase.

</decisions>

<codebase_context>
## Codebase State

### Current routing (BEFORE this phase)
- `src/routes/+page.svelte` — the full game (TopBar, Shelf, MixingChamber, BottomBar, overlays)
- `src/routes/+layout.svelte` — orientation lock, AdMob init, `OfflineIndicator`
- `src/routes/+layout.ts` — (exists, likely empty or minimal)
- No `/game` route exists

### After this phase
- `src/routes/+page.svelte` → NEW menu component
- `src/routes/game/+page.svelte` → game (moved from `/`)
- `src/routes/game/+page.ts` → may be needed if layout or load logic required

### Transition mechanism
SvelteKit `onNavigate` + CSS view transitions (if browser supports), OR Svelte `fly`/`fade` on the page component itself. The `+layout.svelte` already wraps both routes so shared state/services are unaffected.

### Theme tokens (from `app.css` and component styles)
- Background: `#0d1b2e`
- Surface: `#1a3a5a` (card/panel bg)
- Text: `#c8d8e8`
- Gold accent: `#c9a84c` (used in TopBar, achievements)
- Danger/action: `#e74c3c`

</codebase_context>

<canonical_refs>
## Canonical References

- `src/routes/+page.svelte` — current game entry (to be moved)
- `src/routes/+layout.svelte` — shared layout (no changes expected)
- `src/app.css` — global theme tokens
- `.planning/REQUIREMENTS.md` — MENU-01, MENU-05 definitions
- `.planning/ROADMAP.md` — Phase 13 success criteria

</canonical_refs>

<technical_notes>
## Notes for Researcher / Planner

1. **File move:** The primary task is `mv src/routes/+page.svelte src/routes/game/+page.svelte`. The game component itself needs no logic changes.
2. **Layout compatibility:** `+layout.svelte` applies to all routes under `src/routes/`. The game at `/game` will automatically inherit orientation lock and AdMob init — no duplication needed.
3. **Transition API:** SvelteKit supports page transitions via `onNavigate` (view transitions API) or per-component `in:` / `out:` Svelte transitions. Prefer Svelte transitions for broadest browser compatibility given mobile PWA context.
4. **Android back gesture:** Moving to a real `/game` route means Android back will naturally return to `/`. No extra logic needed for that behavior.
5. **No store changes:** Game state stores remain unchanged. The `/game` route mounts and unmounts the game component but does not reset state — `$unlockedElements`, `$discoveries`, etc. are module-level stores that persist across route transitions.
6. **Build check:** After moving the file, run `npm run check` and `npm run build` to confirm SvelteKit can resolve the new route.

</technical_notes>
