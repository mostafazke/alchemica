---
milestone: v1
audited: 2026-05-02
status: gaps_found
scores:
  requirements: 24/27
  phases: 5/5
  integration: 10/12 flows pass
  flows: 10/12
gaps:
  requirements:
    - id: "GAME-01"
      status: "partial"
      phase: "Phase 1"
      claimed_by_plans: ["01-02-PLAN.md"]
      completed_by_plans: []
      verification_status: "missing"
      evidence: "Iron (original element) requires a 3-element reaction (fire+earth+earth) handled by MULTI_REACTIONS. MULTI_REACTIONS is exported from data/reactions.ts but never imported anywhere in src/. applyReaction() only does 2-element REACTIONS lookups. MixingChamber has no third slot. Iron is permanently unreachable. Additionally, hydrogen (original element) has recipe 'Water + Plasma' but reactions.ts maps 'water+plasma' → 'oxygen' only — no entry produces 'hydrogen'. Both elements were in the original 32."
    - id: "CONT-01"
      status: "partial"
      phase: "Phase 4"
      claimed_by_plans: ["04-01-PLAN.md"]
      completed_by_plans: []
      verification_status: "missing"
      evidence: "61 elements defined in elements.ts (requirement: 60+). However, iron is permanently unreachable (MULTI_REACTIONS unused) and its 10-element downstream chain is also locked: rust, steam_engine, magnet, bronze, steel → rocket, motor, electricity, city. Hydrogen also unreachable. At least 11 of 57 discoverable elements cannot be discovered at runtime. Quantity threshold passes; reachability fails."
  integration:
    - from: "data/reactions.ts MULTI_REACTIONS"
      to: "game/reactions.ts applyReaction (never imported)"
      issue: "Iron and its 10-element chain unreachable"
      severity: "critical"
    - from: "elements.ts hydrogen recipe 'Water + Plasma'"
      to: "reactions.ts (maps 'water+plasma' → 'oxygen' only)"
      issue: "Hydrogen permanently unreachable, no reaction produces it"
      severity: "critical"
  flows:
    - flow: "Iron discovery and downstream chain (rust, steel, bronze, magnet, motor, electricity, rocket, city)"
      breaks_at: "applyReaction — MULTI_REACTIONS never imported; no 3-input UI"
      affected_reqs: ["GAME-01", "CONT-01"]
    - flow: "Hydrogen discovery"
      breaks_at: "data/reactions.ts — 'water+plasma' → 'oxygen' only, no entry produces 'hydrogen'"
      affected_reqs: ["GAME-01"]

tech_debt:
  - phase: "all-phases"
    items:
      - "Space Mono font referenced in 20+ component files but no @font-face declared, no .woff2 files in assets, no CDN link. Falls silently to system monospace. ARCH-07 requires self-hosted fonts — technically no CDN dependency but design intent is unmet."
  - phase: "03-touch-persistence"
    items:
      - "hintCooldownEndsAt store not subscribed to saveToStorage — hint cooldown resets to 0 on every page reload, allowing cooldown bypass by refreshing. Affects GAME-03 integrity."
  - phase: "04-content-hints"
    items:
      - "TopBar hardcodes '/32' denominator (line 9) — should be Object.keys(ELEMENTS).length. With 61 elements defined, the progress indicator is wrong once Phase 4 elements are discovered."
  - phase: "01-foundation"
    items:
      - "resolveReaction export in game/reactions.ts has zero consumers. Dead code / orphaned export."
      - "@tailwindcss/vite is configured in vite.config.ts despite CLAUDE.md/AGENTS.md explicitly prohibiting Tailwind. No utility classes used in components so no runtime cost, but violates stated tech constraint."
      - "REQUIREMENTS.md traceability table has all 27 requirements listed as 'Pending' — never updated to reflect completion."

nyquist:
  compliant_phases: []
  partial_phases: []
  missing_phases: [1, 2, 3, 4, 5]
  overall: "MISSING — No VALIDATION.md files exist in any phase directory"
---

# Milestone v1 — Audit Report

**Project:** Alchemica — Mobile-first element combination PWA
**Milestone:** v1 (Phases 1–5)
**Audited:** 2026-05-02
**Overall Status:** ⚠ GAPS FOUND

---

## Scores

| Dimension | Score | Status |
|-----------|-------|--------|
| Requirements | 24/27 satisfied | ⚠ 3 partial |
| Phases | 5/5 complete | ✓ |
| Integration flows | 10/12 pass | ⚠ 2 broken |
| VERIFICATION.md coverage | 0/5 phases | ✗ None exist |
| SUMMARY.md coverage | 2/5 phases | ✗ Phases 3–5 missing |
| Nyquist VALIDATION.md | 0/5 phases | ✗ None exist |

---

## Critical Gaps (Blockers)

### Gap 1 — GAME-01: Iron unreachable (MULTI_REACTIONS never wired)

**REQ-ID:** GAME-01 — All 32 existing elements and reactions preserved
**Phase:** Phase 1 (data scaffolded), Phase 4 (reactions defined)
**Severity:** 🔴 BLOCKER

**Root cause:** Iron requires a 3-element reaction (`fire + earth + earth`) stored in `MULTI_REACTIONS`. This map is exported from `src/lib/data/reactions.ts` line 177 but has **zero imports anywhere in `src/`**. `applyReaction()` in `game/reactions.ts` only constructs 2-key strings and looks up `REACTIONS`. `MixingChamber.svelte` provides only 2 slots with no UI path to supply a 3rd input.

**Downstream impact:** Iron blocks 10 more elements:

| Element | Chain |
|---------|-------|
| rust | Iron + Water |
| steam_engine | Steam + Iron |
| magnet | Iron + Lightning |
| bronze | Copper + Iron |
| steel | Iron + Carbon |
| rocket | Explosion + Steel |
| motor | Electricity + Magnet |
| electricity | Lightning + Copper → needs Copper (reachable), but Motor needs it |
| city | Human + Steel |

**Fix options (choose one):**
1. **Simple (recommended):** Add a 2-element iron reaction, e.g., `lava + air → iron` or `earth + earth → stone` then `stone + fire → iron`. No UI changes needed. Also add `water+plasma → hydrogen` entry.
2. **Complete:** Implement multi-element support — wire `MULTI_REACTIONS` into `applyReaction`, extend `MixingChamber` to a 3-slot UI.

---

### Gap 2 — GAME-01: Hydrogen unreachable (missing reaction entry)

**REQ-ID:** GAME-01 — All 32 existing elements and reactions preserved
**Phase:** Phase 1/4
**Severity:** 🔴 BLOCKER

**Root cause:** `hydrogen` is defined in `elements.ts` with recipe `Water + Plasma` but `reactions.ts` line 50 maps `'water+plasma'` → `'oxygen'` only. No reaction entry produces `'hydrogen'`. Both oxygen and hydrogen share the same recipe text in `elements.ts`.

**Fix:** Add `'water+plasma2': 'hydrogen'` with a distinct key, OR give hydrogen a different recipe (e.g., `'water+lightning' → 'hydrogen'` or `'plasma+plasma' → 'hydrogen'`).

---

### Gap 3 — CONT-01: 11+ Elements Unreachable at Runtime

**REQ-ID:** CONT-01 — Element library expanded from 32 to 60+ elements
**Phase:** Phase 4
**Severity:** 🔴 BLOCKER

61 elements are defined in `elements.ts` (requirement passes on count alone), but iron + hydrogen + the entire iron downstream chain (9 elements) cannot be discovered at runtime. The requirement's spirit — a reachable expanded library — is not met.

---

## Tech Debt (Non-Blocking)

### TD-1: Space Mono font not self-hosted (ARCH-07 partial)

`'Space Mono', monospace` declared in 20+ component CSS blocks (TopBar, BottomBar, Shelf, MixingChamber, ResultDisplay, HintButton, ElementCard, ElementDetail, DiscoveryLog, DiscoveryItem, SettingsPanel). No `@font-face` declaration in `src/app.css`. No `.woff2` files in `src/lib/assets/`. No CDN `<link>` in `app.html`.

The game has **zero CDN dependencies** (ARCH-07 literally met), but Space Mono silently falls to the system monospace stack. The intended design is unrendered on devices without Space Mono installed.

**Fix:** Download Space Mono woff2 files from Google Fonts, place in `static/fonts/`, add `@font-face` to `app.css`.

---

### TD-2: Hint cooldown not persisted (GAME-03 integrity)

`hintCooldownEndsAt` store in `game.ts` is not subscribed to `saveToStorage`. On every page reload the cooldown resets to 0, allowing players to bypass the 30-second limit by refreshing.

**Fix:** Add to `saveToStorage` and load from localStorage in `loadSave()`.

---

### TD-3: TopBar hardcodes `/32` denominator

`TopBar.svelte` line 9: `{$unlockedElements.size}/32`. With 61 elements defined, the denominator is wrong once Phase 4 elements start unlocking.

**Fix:** Change to `{$unlockedElements.size}/{Object.keys(ELEMENTS).length}` (import `ELEMENTS` from data).

---

### TD-4: Dead export `resolveReaction`

`src/lib/game/reactions.ts` exports `resolveReaction` with zero consumers across `src/`. Orphaned export from refactoring.

**Fix:** Remove or use it.

---

### TD-5: Tailwind CSS plugin installed (violates stated constraint)

`@tailwindcss/vite` configured in `vite.config.ts`. CLAUDE.md and AGENTS.md both explicitly state "no Tailwind, no CSS-in-JS". No Tailwind utility classes found in components — no runtime cost — but the plugin violates the project's stated tech constraints.

**Fix:** Remove `@tailwindcss/vite` from `vite.config.ts` and `package.json`.

---

### TD-6: REQUIREMENTS.md traceability never updated

All 27 entries in the traceability table still show `Status: Pending`. The file was created during planning and never updated during execution.

**Fix:** Update all 27 statuses to `Complete` (or `Partial` for GAME-01, CONT-01) as part of milestone completion.

---

## Requirements Coverage Table

| REQ-ID | Description | Phase | Status | Evidence |
|--------|-------------|-------|--------|----------|
| ARCH-01 | Vite + Svelte 5 + TypeScript | 1 | ✓ satisfied | package.json, svelte.config.js, vite.config.ts |
| ARCH-02 | Elements/reactions in typed TS data files | 1 | ✓ satisfied | elements.ts + reactions.ts decoupled from UI |
| ARCH-03 | Game state via Svelte writable stores | 1 | ✓ satisfied | game.ts; all components use $store syntax |
| ARCH-04 | Auto-save to localStorage with versioned format | 1 | ✓ satisfied | subscribe(saveToStorage) for 3 stores; SaveData version field |
| ARCH-05 | Service worker + Workbox offline caching | 5 | ✓ satisfied | VitePWA + workbox globPatterns; 18 entries precached |
| ARCH-06 | PWA manifest with icons/theme enables install | 5 | ✓ satisfied | manifest in vite.config.ts; icons in static/ |
| ARCH-07 | Self-hosted fonts, zero CDN deps | 1 | ⚠ partial | Zero CDN deps ✓; Space Mono not self-hosted, falls to system monospace |
| LAYT-01 | 3-breakpoint responsive layout | 2 | ✓ satisfied | +page.svelte 768/1024px breakpoints |
| LAYT-02 | Discoveries as bottom sheet on mobile | 2 | ✓ satisfied | BottomSheet.svelte with slide-up animation |
| LAYT-03 | ≥44×44px touch targets | 2 | ✓ satisfied | app.css touch-action:manipulation; 44px min-height on cards |
| LAYT-04 | Slots 110×110px on mobile | 2 | ✓ satisfied | Slot.svelte @media 768px → 110px w/h |
| LAYT-05 | React button full-width 52px mobile | 2 | ✓ satisfied | MixingChamber.svelte @media 768px width:100%; min-height:52px |
| TOUC-01 | Haptic feedback on reaction | 3 | ✓ satisfied | hapticSuccess/Fail from touch.ts in MixingChamber.doReaction() |
| TOUC-02 | Long-press element detail | 3 | ✓ satisfied | createLongPress wired in ElementCard.svelte $effect |
| TOUC-03 | Swipe to switch shelf tabs | 3 | ✓ satisfied | createSwipeHandler wired in Shelf.svelte $effect |
| TOUC-04 | Double-tap zoom disabled | 2 | ✓ satisfied | user-scalable=no in app.html; touch-action:manipulation in CSS |
| GAME-01 | All 32 original elements reachable | 1 | 🔴 partial | Iron + hydrogen permanently unreachable (2 of 32) |
| GAME-02 | Category-grouped shelf browsing | 2 | ✓ satisfied | Shelf.svelte CATEGORY_META/CATEGORY_ORDER; 9 grouped sections |
| GAME-03 | Hint system with 30s cooldown | 4 | ✓ satisfied | HintButton.svelte + getHint() in game/reactions.ts; cooldown via hintCooldownEndsAt |
| GAME-04 | Share via Web Share API + clipboard fallback | 4 | ✓ satisfied | shareDiscovery in utils/share.ts; wired to ResultDisplay + DiscoveryItem |
| GAME-05 | Export progress as JSON download | 3 | ✓ satisfied | downloadSave in utils/storage.ts; wired to SettingsPanel |
| GAME-06 | Import JSON save with version check | 3 | ✓ satisfied | importSave validates schema + version; wired to SettingsPanel FileReader |
| GAME-07 | Score/combo system (100×combo new, 10×combo known, 8× max) | 1 | ✓ satisfied | applyReaction: newCombo = min(current+1, 8); points formula present |
| CONT-01 | 60+ elements with valid discovery chains | 4 | 🔴 partial | 61 defined; 11+ unreachable at runtime (iron chain + hydrogen) |
| CONT-02 | Accurate scientific desc + formula for all elements | 4 | ✓ satisfied | All ELEMENTS entries have desc + formula fields |
| CONT-03 | Consistent 8-category taxonomy | 4 | ✓ satisfied | All elements have category from 8-value Category type |
| CONT-04 | Element/reaction data in standalone TS files | 1 | ✓ satisfied | data/elements.ts + data/reactions.ts; no element data in component files |
| PWA-01 | Offline after first load | 5 | ✓ satisfied | Workbox SW + prerender=true + localStorage game state |
| PWA-02 | Installable standalone (Chrome/Safari/Edge) | 5 | ✓ satisfied | display:standalone in manifest; icons present |
| PWA-03 | Offline/online indicator | 5 | ✓ satisfied | OfflineIndicator.svelte wired in +layout.svelte |

**Summary: 24 satisfied, 3 partial (GAME-01, CONT-01, ARCH-07)**

---

## Cross-Phase Integration

| Flow | Status | Notes |
|------|--------|-------|
| Basic elements → shelf → combine → save | ✓ pass | Full chain verified |
| Combine → result → haptic → auto-save | ✓ pass | All three legs wired |
| Iron discovery (3-element reaction) | 🔴 broken | MULTI_REACTIONS unused |
| Hydrogen discovery | 🔴 broken | No reaction entry |
| Hint system → cooldown timer | ✓ pass | HintButton ↔ getHint() wired |
| Share discovery (Web Share + clipboard) | ✓ pass | ResultDisplay + DiscoveryItem both wired |
| Export save as JSON | ✓ pass | SettingsPanel → downloadSave |
| Import JSON with version check | ✓ pass | FileReader → importSave |
| Long-press element detail | ✓ pass | ElementCard $effect → createLongPress |
| Swipe shelf tabs | ✓ pass | Shelf $effect → createSwipeHandler |
| PWA install prompt | ✓ pass | Manifest + icons correct |
| Offline indicator | ✓ pass | OfflineIndicator in root layout |

---

## Nyquist Compliance

| Phase | VALIDATION.md | Status | Action |
|-------|---------------|--------|--------|
| 1 — Foundation | Missing | ✗ | `/gsd-validate-phase 1` |
| 2 — Mobile Layout | Missing | ✗ | `/gsd-validate-phase 2` |
| 3 — Touch & Save | Missing | ✗ | `/gsd-validate-phase 3` |
| 4 — Content & Hints | Missing | ✗ | `/gsd-validate-phase 4` |
| 5 — PWA & Polish | Missing | ✗ | `/gsd-validate-phase 5` |

No phase has been through Nyquist validation. This is an informational finding — the codebase evidence above substitutes for formal VALIDATION.md artifacts.

---

## Verdict

**Status: `gaps_found`** — 2 critical blockers must be fixed before milestone can be marked complete.

The game is **feature-complete except for iron and hydrogen reachability**. All 5 PWA/offline requirements pass. All mobile layout requirements pass. All touch, save/load, share, and hint requirements pass. The two blockers are data-layer wiring bugs requiring ≤30 lines of code each.

### Minimum Fixes Required to Pass

**Fix 1 (Iron — 10 min):** In `src/lib/data/reactions.ts`, replace the 3-element iron recipe with a 2-element alternative, e.g.:
```ts
// Change iron from a multi-reaction to a 2-element reaction
'lava+earth': 'iron',   // or 'earth+fire' if that key is unused
```
Then update `elements.ts` iron recipe field accordingly. No UI or logic changes needed.

**Fix 2 (Hydrogen — 5 min):** In `src/lib/data/reactions.ts`, add a distinct reaction for hydrogen:
```ts
'plasma+water': 'hydrogen',  // mirror key (same inputs, different order)
// OR give hydrogen a unique recipe: 'plasma+plasma': 'hydrogen'
```
Update `elements.ts` hydrogen recipe field to match.

After both fixes, re-run `npm run check && npm run build` and confirm element count in TopBar (TD-3).
