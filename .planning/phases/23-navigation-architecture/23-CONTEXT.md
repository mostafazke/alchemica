# Phase 23: Navigation Architecture - Context

**Gathered:** 2026-05-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Restructure the game navigation architecture:
1. **Game screen** — Remove BottomBar entirely. New layout: TopBar (pause left | score/stats right) + element grid (left) + mixing workspace (right). No overlays, no bottom nav.
2. **Main menu** — Add Discoveries button and Badges button (each opens a BottomSheet overlay). Add a simple daily challenge status card (completed or available — no live countdown).
3. **Settings screen** — New `/settings` SvelteKit route that renders as a full-screen overlay on top of the main menu (view-transition from `/`). Contains: reset game (custom modal), sound toggle, haptics toggle, export save, import save.
4. **Reset button** — Removed from TopBar. Lives only in the Settings screen.

No gameplay logic changes. No token work. No component style rebuilds — those belong to Phase 24+.

</domain>

<decisions>
## Implementation Decisions

### Game Screen Layout (locked)
- **D-01:** Remove `BottomBar` component and all its imports from `src/routes/game/+page.svelte`. The game screen grid becomes `grid-template-rows: auto 1fr` (TopBar + lab-wrapper only).
- **D-02:** Remove all three overlay state variables (`discoverySheetOpen`, `settingsOpen`, `achievementsOpen`) and their associated `BottomSheet`, `SettingsPanel`, `AchievementGallery` imports from game page. Game screen carries zero overlay logic.

### TopBar Redesign (locked)
- **D-03:** Remove the game title ("⚗️ Alchemica") from TopBar — it no longer appears on the game screen.
- **D-04:** Remove the reset button from TopBar — it moves to the Settings screen.
- **D-05:** Add a **pause button on the left** of TopBar — tapping it navigates to the main menu (`goto('/')`). Icon: `⏸` or similar. Min 44×44px touch target.
- **D-06:** Keep on the right side: discovered count (`N/61`), combo badge, score. Exact spacing/styling unchanged — token work deferred to Phase 24.

### Main Menu Enrichment (locked)
- **D-07:** Add a **Discoveries button** to the main menu that opens a `BottomSheet` overlay containing `DiscoveryLog`. Button shows discovery count badge (same pattern as old BottomBar Discoveries button).
- **D-08:** Add a **Badges button** to the main menu that opens a `BottomSheet` overlay containing `AchievementGallery`. Both overlays reuse existing `BottomSheet`, `DiscoveryLog`, and `AchievementGallery` components — no rewrites.
- **D-09:** Add a **simple daily challenge status card** to the main menu. Shows today's target element name and one of two states: "✓ Completed" (if `$dailyCompleted`) or "Available" (if not). No live countdown. No `setInterval`. Reads from existing `dailyChallengeTarget` and `dailyCompleted` stores directly.
- **D-10:** Add a **Settings link** on the main menu that navigates to `/settings`. Icon or text link — agent's choice.

### Settings Screen (locked)
- **D-11:** Create a new SvelteKit route `src/routes/settings/+page.svelte`. It is a **full-screen overlay** that uses the existing view-transition mechanism already in `+layout.svelte` (the `onNavigate` + `document.startViewTransition` block). Navigate to it via `goto('/settings')` from the main menu.
- **D-12:** Contents of the new settings route: reset game (with custom Svelte modal — not `window.confirm()`, per Phase 19 D-06), sound/haptics toggles, export save, import save. These are extracted/adapted from the existing `SettingsPanel.svelte` (349 lines) — the logic is already written, it just needs to live in a route instead of an overlay panel.
- **D-13:** `SettingsPanel.svelte` component is **deleted** (dead code after Phase 23). Its IAP sections (remove-ads, hint bundle, restore purchases) are included in the new settings route unless they would increase route size significantly — agent's discretion to keep or omit the IAP section.
- **D-14:** The settings route has a **back/close button** that returns to main menu (`goto('/')` or `history.back()`).

### Reset Confirmation (locked — inherited from Phase 19 D-06)
- **D-15:** Reset game uses a **custom Svelte mini-modal** — NOT `window.confirm()`. Danger-styled (red), two buttons (Cancel / Reset), implemented with a `$state` boolean in the settings route. This is the same decision as Phase 19 D-06, now applied in the settings route context.

### Agent's Discretion
- Back button icon/label for settings route (← Back, ✕, or "← Menu")
- Whether IAP section (remove ads, hint bundle, restore) is included in the settings route or omitted as low-priority for Phase 23
- Layout/arrangement of main menu buttons (Discoveries, Badges, Settings, Play) — player-friendly ordering

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Planning
- `.planning/REQUIREMENTS.md` — NAV-01 through NAV-05 are the requirements this phase addresses
- `.planning/ROADMAP.md` §Phase 23 — success criteria and depends-on chain

### Existing Components (read before modifying)
- `src/routes/game/+page.svelte` — game page being restructured (79 lines)
- `src/routes/+page.svelte` — main menu being enriched (current: ~80 lines)
- `src/routes/+layout.svelte` — contains view-transition `onNavigate` hook (reuse for /settings)
- `src/lib/components/TopBar.svelte` — being redesigned (93 lines)
- `src/lib/components/BottomBar.svelte` — being deleted
- `src/lib/components/SettingsPanel.svelte` — being deleted (logic moves to /settings route)
- `src/lib/components/BottomSheet.svelte` — reused on main menu for Discoveries + Badges overlays
- `src/lib/components/DiscoveryLog.svelte` — reused in main menu BottomSheet
- `src/lib/components/AchievementGallery.svelte` — reused in main menu BottomSheet

### Stores (read for correct imports)
- `src/lib/stores/daily.ts` — `dailyChallengeTarget` (writable), `dailyCompleted` (derived) — use directly in main menu daily card
- `src/lib/stores/game.ts` — `score`, `combo`, `unlockedElements`, `resetGame()`, `discoveries` — TopBar and settings route
- `src/lib/stores/settings.ts` — `soundMuted` — settings route toggle
- `src/lib/stores/achievements.ts` — `streakCount`, `earnedAchievements` — TopBar stats

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `BottomSheet.svelte` — generic overlay panel; accepts `open` bool + `onClose` callback + `{children}` slot. Reuse on main menu for Discoveries and Badges overlays without modification.
- `DiscoveryLog.svelte`, `AchievementGallery.svelte` — slot-ready, no props required. Drop into BottomSheet as children.
- View-transition in `+layout.svelte` — `onNavigate` + `document.startViewTransition` already wired. `/settings` route gets the transition for free.
- `dailyChallengeTarget` store — writable string (element key). Look up `ELEMENTS[key].name` for display.
- `dailyCompleted` derived store — boolean. No extra logic needed for simple card.

### Established Patterns
- Overlay state: local `$state` boolean + BottomSheet component (see current game page lines 23–25)
- Navigation: `goto('/route')` from `$app/navigation` — used in current main menu `play()` function
- Svelte 5 runes: `$state`, `$derived`, `$effect`, `$props()` — no Svelte 4 store API

### Integration Points
- Game screen `grid-template-rows` CSS changes from `auto 1fr auto` → `auto 1fr` (remove third row)
- TopBar receives no new props — self-contained store subscriptions; just add `goto` import and pause button
- Settings route imports directly from stores — no props drilling needed (same pattern as SettingsPanel today)

</code_context>

<specifics>
## Specific Ideas

- Daily challenge card: two states only — "✓ Completed today" (gold/teal) vs "⚗ [Element Name] available" (neutral). Simple visual indicator, no timer.
- Settings as overlay-feel route: full-screen dark background, close button top-left, same visual identity as the game. Should feel like a drawer/overlay despite being a real route.

</specifics>

<deferred>
## Deferred Ideas

- **Live countdown timer on daily card** — NAV-04 mentions countdown; user confirmed "simple for now". A live `setInterval`-based countdown to midnight is deferred to a future polish phase.
- **High score display on main menu** — NAV-05 mentions high score; simple to add but not discussed. Agent may include if trivial (just read `$score` from store), otherwise defer to Phase 24+.
- **DiscoveryLog inline on main menu** — Inline scrollable section (no overlay) was considered and rejected in favor of BottomSheet overlay buttons.

</deferred>

---

*Phase: 23-Navigation Architecture*
*Context gathered: 2026-05-05*
