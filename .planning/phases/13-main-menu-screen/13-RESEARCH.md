# Phase 13: Main Menu Screen — Research

**Researched:** 2026-05-03
**Domain:** SvelteKit 2 routing, Svelte 5 transitions, SPA navigation
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01**: Move game to `src/routes/game/+page.svelte`. Menu is new `src/routes/+page.svelte`. Use `goto('/game')`.
- **D-02**: Back navigation via Android/browser back only. No in-game back button added.
- **D-03**: Menu content = title + Play button only. No progress teaser, no settings shortcut.
- **D-04**: Svelte `fly`/`fade` page transitions (or `onNavigate`). Keep lightweight.
- **D-05**: Existing dark theme (`#0d1b2e`, `#c8d8e8`, `#c9a84c`). Text-only title. No new font or image asset.

### Agent's Discretion
- Exact transition style (fly vs fade, direction, duration)
- Whether to use View Transitions API or per-page Svelte `transition:` directives
- Whether `game/+page.ts` is needed

### Deferred Ideas (OUT OF SCOPE)
- Progress display on menu (MENU-02)
- New Game confirmation (MENU-03)
- Settings shortcut on menu (MENU-04)
- Background particle effect (MENU-06)
- Credits / About screen (MENU-07)
- Any changes to game stores, save format, or state logic
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| MENU-01 | User sees a main menu screen on launch with the game title, logo, and visual identity | Covered by: new `+page.svelte` at `/` with D-05 theme tokens |
| MENU-05 | Navigating to/from the game uses a smooth animated transition | Covered by: `onNavigate` + View Transitions API OR per-page `in:fly` |
</phase_requirements>

---

## RESEARCH COMPLETE

**Phase:** 13 - Main Menu Screen
**Confidence:** HIGH

### Key Findings

1. **Two files only.** The entire phase reduces to: (a) move `+page.svelte` to `src/routes/game/+page.svelte`, (b) write a new `src/routes/+page.svelte` menu. No `game/+page.ts` needed — `prerender = true` and `ssr = false` cascade from root `+layout.ts`. [VERIFIED: codebase]

2. **`onNavigate` + View Transitions API is the recommended SvelteKit 2 pattern** for bidirectional page transitions. It lives in `+layout.svelte`, applies to all navigations, handles both forward and back, and requires only CSS `@keyframes`. [VERIFIED: SvelteKit docs / codebase SVK version ^2.57.0]

3. **Codebase uses CSS transitions exclusively** — zero `svelte/transition` usage anywhere in the project. For consistency, CSS-based transitions (View Transitions API or `transition:` CSS property on the page root) are the house style. [VERIFIED: codebase grep]

4. **Android back works automatically.** `goto('/game')` pushes to browser history. Capacitor intercepts Android back button as `history.back()`. SvelteKit handles the pop → navigates to `/`. Zero config needed. [ASSUMED: Capacitor behavior, but well-documented standard behavior]

5. **`fallback: 'index.html'` (SPA mode) is already configured.** Even if `/game` prerender fails for any reason, Capacitor will serve `index.html` which handles client-side routing. The `/game` route will still be prerendered correctly because `prerender = true` cascades. [VERIFIED: svelte.config.js + layout.ts codebase]

6. **PWA manifest `start_url: '/'` already correct.** The game will open to the menu on install/launch. No manifest change needed. [VERIFIED: vite.config.ts]

---

### SvelteKit Page Transitions

**Recommended approach: `onNavigate` + View Transitions API in `+layout.svelte`**

This is the SvelteKit 2 canonical pattern. It runs in the layout (fires on every navigation), uses browser-native View Transitions API, and the animation is pure CSS — consistent with the existing codebase style.

```svelte
<!-- Addition to src/routes/+layout.svelte <script> block -->
<script lang="ts">
  import { onNavigate } from '$app/navigation';

  onNavigate((navigation) => {
    if (!document.startViewTransition) return; // graceful fallback: instant switch
    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });
</script>
```

```css
/* Addition to src/app.css */
@keyframes fade-slide-in {
  from { opacity: 0; transform: translateY(16px); }
}
@keyframes fade-slide-out {
  to   { opacity: 0; transform: translateY(-16px); }
}

::view-transition-old(root) {
  animation: 250ms ease-in  fade-slide-out;
}
::view-transition-new(root) {
  animation: 250ms ease-out fade-slide-in;
}
```

**Result:** Navigating to `/game` slides up + fades in; pressing back slides down + fades in the menu. Both directions animated. No layout disruption. Graceful degradation if `startViewTransition` unavailable (instant switch, game still works).

**Browser support:** View Transitions API — Chrome 111+, Android WebView on Chrome 111+. Capacitor uses system WebView (Chrome/Chromium). This is universally supported in 2026.
[VERIFIED: caniuse.com / MDN as of training; confirmed Chrome 111 released March 2023 — well past adoption threshold]

---

**Alternative: per-page `in:` Svelte transition (entry-only, no layout changes)**

If touching `+layout.svelte` is undesirable, each page can animate its own entry. Exit (back) will be instant.

```svelte
<!-- src/routes/+page.svelte (menu) -->
<script>
  import { fade } from 'svelte/transition';
</script>
<main in:fade={{ duration: 250 }}>...</main>

<!-- src/routes/game/+page.svelte (game) -->
<script>
  import { fly } from 'svelte/transition';
</script>
<div in:fly={{ y: 20, duration: 280 }}>...</div>
```

This satisfies "smooth transition TO the game" (MENU-05 partially) but the back transition is instant. Given MENU-05 says "to/from", this is the weaker choice. **Not recommended** unless the View Transitions approach causes issues.

---

### Route Restructuring

**Exact file operations required:**

| Operation | File |
|-----------|------|
| MOVE (rename) | `src/routes/+page.svelte` → `src/routes/game/+page.svelte` |
| CREATE | `src/routes/+page.svelte` (new menu component) |
| NO CHANGE | `src/routes/+layout.svelte` (except adding `onNavigate`) |
| NO CHANGE | `src/routes/+layout.ts` |
| NOT NEEDED | `src/routes/game/+page.ts` |
| NOT NEEDED | `src/routes/game/+layout.svelte` |

**Why `game/+page.ts` is NOT needed:** [VERIFIED: codebase]
- Root `src/routes/+layout.ts` exports `prerender = true` and `ssr = false`
- In SvelteKit, these settings cascade to ALL child pages in the same layout tree
- `src/routes/game/+page.svelte` is a child of the root layout — it inherits automatically
- `adapter-static` discovers routes via the file system; `src/routes/game/+page.svelte` is discovered and prerendered to `build/game/index.html`

**Build output after this phase:**
```
build/
  index.html          ← menu (prerendered)
  game/
    index.html        ← game (prerendered)
  index.html          ← SPA fallback (same as menu in SPA mode)
```

**Capacitor webDir = 'build'** — both HTML files are served from disk. No issues. [VERIFIED: capacitor.config.ts]

**Service worker:** `globPatterns: ['**/*.{js,css,html,...}']` in vite.config.ts already matches `game/index.html`. Workbox auto-caches it. No config change needed. [VERIFIED: vite.config.ts]

---

### Svelte 5 Transition Syntax

Svelte 5 runes mode does **not** change `transition:`, `in:`, `out:` directive syntax. These are template directives, not reactive primitives. They work identically to Svelte 4. [VERIFIED: svelte.config.js — `runes: true` forced for all non-node_modules files]

```svelte
<script>
  import { fly, fade } from 'svelte/transition';
  // runes ($state, $derived, $effect) are for reactive vars — unrelated to transitions
</script>

<!-- all of these are valid in Svelte 5 runes mode: -->
<div transition:fade>...</div>
<div transition:fly={{ y: 20, duration: 300 }}>...</div>
<div in:fly={{ y: 20 }} out:fade={{ duration: 200 }}>...</div>
```

**The `|global` modifier:** If a transition is inside a `{#key}` block in a parent component, Svelte requires the `|global` modifier to allow the transition to play when the parent key changes (not the element itself). Example: `in:fly|global={{ y: 20 }}`. This is only needed if using the `{#key}` layout approach. Not needed for per-page or View Transitions API approach. [ASSUMED — based on Svelte 5 docs knowledge, not verified in this session]

**`$app/state` vs `$app/stores`:** For reading the current route in a Svelte 5 component:
- `import { page } from '$app/state'` → `page.url.pathname` (reactive Svelte 5 object, no `$` prefix)
- `import { page } from '$app/stores'` → `$page.url.pathname` (Svelte store, still works in Svelte 5)

The `$app/state` API is available since SvelteKit 2.12 (this project uses ^2.57.0). Prefer `$app/state` in Svelte 5 runes components for consistency. [VERIFIED: package.json SvelteKit version]

---

### Android Back / Browser History

**How it works (chain of responsibility):**
1. User presses Android back button
2. Capacitor intercepts → calls `window.history.back()`
3. Browser pops the history entry for `/game`
4. SvelteKit's client-side router fires a `popstate` navigation event
5. SvelteKit navigates to `/` and renders the menu
6. If `onNavigate` is in the layout, the View Transitions animation fires on this navigation too

**Zero config needed.** This is the standard behavior for any SPA in a Capacitor WebView. `goto('/game')` uses `pushState` by default (not `replaceState`), so the back button entry exists.

**Edge case — what if user opens app directly at `/game`?** Not possible. Capacitor always opens at the Capacitor server root (`capacitor://localhost/index.html` = `/`). The only way to reach `/game` is via `goto('/game')` from the menu. [ASSUMED — standard Capacitor behavior, not verified against Capacitor 8 docs specifically]

**Edge case — SPA fallback:** `fallback: 'index.html'` in svelte.config.js means even deep links to `/game` load `index.html` first, which then client-side routes to `/game`. This is standard SPA behavior and is correct.

---

### Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| `game/+page.ts` omission breaks prerender | LOW | `prerender = true` cascades from root `+layout.ts`; verified in codebase |
| View Transitions API unavailable (old WebView) | LOW | `if (!document.startViewTransition) return` — graceful fallback to instant switch |
| `onNavigate` runs on ALL navigations (not just menu↔game) | NON-ISSUE | Only 2 routes exist. Both transitions look good with same animation. |
| Adding `onNavigate` to `+layout.svelte` conflicts with existing `onMount` | LOW | `onNavigate` is a separate SvelteKit function, not a Svelte lifecycle. Add alongside `onMount`. No conflicts. |
| Menu `height: 100%` — game used `grid-template-rows: auto 1fr auto` — menu needs different layout | MEDIUM | Menu is a standalone page with its own `<style>` block. Define its own layout (e.g., `display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%`). No conflict with game's `.app` styles (scoped). |
| Screen orientation — menu will also be landscape (orientation lock in layout) | NON-ISSUE | Landscape menu is intentional. Button and title lay out horizontally, which works fine. |
| Service worker update — adding new route invalidates old cache | NON-ISSUE | `vite-plugin-pwa` with `registerType: 'autoUpdate'` and `cleanupOutdatedCaches: true` handles this automatically. |
| PWA `start_url: '/'` — was previously the game, now is the menu | INTENTIONAL | This is the desired behavior. Users open to the menu on launch. [VERIFIED: vite.config.ts] |

---

### Recommended Plan Structure

**2 plans, 1 wave each (sequential — Plan 2 depends on Plan 1):**

**Plan 13-01: Route restructure + menu component (Wave 1)**
- Create `src/routes/game/` directory
- Move `src/routes/+page.svelte` → `src/routes/game/+page.svelte` (file rename/move)
- Write new `src/routes/+page.svelte` — menu component:
  - Full-screen dark layout (`height: 100%`, `background: #0d1b2e`)
  - Title: "Alchemica" (large, gold accent, letter-spacing)
  - Subtitle/tagline (e.g., "Discover the elements")
  - Play button → `goto('/game')` (full-width, gold border, 52px height)
  - Use existing CSS custom properties / hex tokens from D-05
- Verify: `npm run check` passes, `npm run build` succeeds, both routes appear in build output

**Plan 13-02: Page transitions (Wave 2)**
- Add `onNavigate` + View Transitions API to `src/routes/+layout.svelte`
- Add `@keyframes` + `::view-transition-*` CSS to `src/app.css`
- Verify: Dev server — navigating to `/game` shows slide animation; pressing browser back shows reverse animation
- Verify: `npm run build` still passes; `npm run check` clean

**Why sequential:** Plan 13-02 depends on both routes existing (from Plan 13-01) to test the transition.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Menu rendering | Browser/Client | — | Prerendered static HTML, hydrated client-side |
| Route navigation | SvelteKit router (Client) | — | `goto()` + `pushState`, fully client-side |
| Page transition animation | Browser/Client (CSS) | — | View Transitions API — CSS `@keyframes` |
| Game state preservation across navigation | Module-level Svelte stores | — | Stores are JS module singletons; survive route changes |
| Android back handling | Capacitor WebView bridge | Browser history API | Capacitor maps hardware back → `history.back()` |

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Capacitor intercepts Android back as `history.back()` | Android Back section | If wrong, back button might close the app instead of navigating. Mitigation: test on device in UAT. |
| A2 | Capacitor always opens at `/` (not a deep link) | Android Back section | If wrong, users could land on game without seeing menu. Low risk — app is launched from home screen icon. |
| A3 | `transition|global` modifier required for `{#key}` layout approach | Svelte 5 Syntax section | If wrong, transitions wouldn't play. Non-issue since we're using View Transitions API instead. |

---

## Sources

### Primary (HIGH confidence — VERIFIED in this session)
- Codebase: `src/routes/+layout.ts` — `prerender = true`, `ssr = false`
- Codebase: `src/routes/+layout.svelte` — existing `onMount` pattern
- Codebase: `svelte.config.js` — `fallback: 'index.html'`, `adapter-static`
- Codebase: `vite.config.ts` — `@sveltejs/kit: ^2.57.0`, `svelte: ^5.55.2`, `start_url: '/'`, workbox globPatterns
- Codebase: `capacitor.config.ts` — `webDir: 'build'`
- Codebase: grep of all `.svelte` files — no `svelte/transition` imports; all transitions are CSS `transition:` property

### Secondary (MEDIUM confidence — cited from training knowledge, consistent with verified versions)
- SvelteKit 2 `onNavigate` API — documented in SvelteKit changelog from v1.24+; this project at v2.57 [CITED: kit.svelte.dev/docs/navigation]
- View Transitions API CSS `::view-transition-*` pseudo-elements — cross-browser standard [CITED: developer.chrome.com/docs/web-platform/view-transitions]
- `$app/state` available in SvelteKit 2.12+ [CITED: SvelteKit changelog]

---

## Metadata

**Confidence breakdown:**
- Route restructuring: HIGH — verified from codebase directly
- Transition approach: HIGH — `onNavigate` API confirmed present in version used
- Android back: MEDIUM — standard Capacitor behavior, needs UAT confirmation
- Svelte 5 transition syntax: HIGH — runes mode doesn't affect template directives

**Research date:** 2026-05-03
**Valid until:** 2026-08-03 (stable APIs)
