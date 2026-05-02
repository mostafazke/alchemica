# Research Summary: Alchemica v2 — Achievements & Progression

**Project:** Alchemica v2
**Domain:** Casual mobile puzzle game — achievement system retrofit
**Researched:** 2026-05-02
**Confidence:** HIGH

---

## Executive Summary

Alchemica v2 adds a discovery milestone achievement system to a fully-shipped Svelte 5 + TypeScript PWA. No new runtime dependencies are required — all v2 capabilities are achievable with Web APIs already in scope and Svelte built-ins already in use.

The recommended approach layers data → stores → engine → UI. The achievement engine is a plain function (`checkAchievements(count)`) called explicitly inside the `isNew` branch of `applyReaction`. The toast is a fixed-position overlay mounted in `+layout.svelte`. The achievement gallery is a modal overlay — not a SvelteKit route — to avoid breaking PWA back-navigation on iOS standalone mode.

**Three risks to manage up front:**
1. localStorage schema bump currently drops all v1 saves if implemented naively (fix: migration ladder, keep key `alchemica_v1`)
2. iOS AudioContext requires direct user-gesture call chain for chime to play (fix: lazy creation inside `onclick`)
3. Re-awarding already-earned achievements on save import (fix: include `earnedAchievements` in save schema, silent flag on load/import)

---

## Stack Additions

**No new runtime dependencies. All zero bundle delta.**

| Capability | Approach | Rejected Alternatives |
|------------|----------|-----------------------|
| Toast notifications | Custom `AchievementToast.svelte` + Svelte `fly`/`fade` transitions | `svelte-french-toast` (Svelte 5 incompatible), `svelte-sonner` (dependency overhead) |
| Sound effect | Web Audio API `OscillatorNode` (~20 lines) | Howler.js (8KB gzipped), Tone.js (1MB) |
| Badge animation | Svelte `scale` + `elasticOut` from `svelte/easing` | Any external animation library |
| Save schema | Bump `SAVE_VERSION` 1→2, keep `SAVE_KEY` unchanged | — |
| Sound mute | Separate localStorage key `alchemica_sound_muted` (preference, not progress) | — |

---

## Features

### Table Stakes (must ship)
- Discovery milestone badges (10/25/50/61) with emoji + name + threshold
- Persistent achievement state (versioned save schema v2, migration from v1)
- Achievement unlock toast (fixed position, auto-dismiss 2.5s)
- Achievement gallery (earned ✓ / locked 🔒, accessible from BottomBar)
- TopBar discovery counter polished to "42/61 discovered" (already 80% built)

### Differentiators (should ship)
- Badge unlock chime (Web Audio API oscillator, mutable)
- Badge emoji + short character name ("Pyromancer", "Grand Alchemist")
- Specific toast copy ("Pyromancer — 25 elements discovered!")
- TopBar counter pulse on milestone crossing (reuse existing `.combo.pulse` CSS)

### Anti-Features (do not build)
- Retroactive toasts on load — spammy; evaluate silently
- Achievement points/XP layer — competes with existing score system
- Time-based achievements — creates pressure in a low-stress exploration game
- Achievement gallery as SvelteKit route — breaks iOS PWA back-navigation
- Progress bar in gallery — earned/locked cards already communicate progress

---

## Architecture

**Integration point:** `lib/game/reactions.ts` `applyReaction()` `isNew` branch
**Toast delivery:** `toastQueue` writable store → `AchievementToast.svelte` in `+layout.svelte`
**Gallery:** Fixed-position modal overlay in `+page.svelte` (SettingsPanel pattern)

### New Files (8)
| File | Purpose |
|------|---------|
| `src/lib/data/achievements.ts` | Static `ACHIEVEMENT_DEFS: AchievementDef[]` config |
| `src/lib/game/achievements.ts` | `checkAchievements(count)`, `deriveEarnedAchievementsFromCount()` |
| `src/lib/stores/achievements.ts` | `earnedAchievements: writable<Set<string>>` + auto-save |
| `src/lib/stores/settings.ts` | `soundEnabled` writable |
| `src/lib/stores/toasts.ts` | `toastQueue`, `pushToast()`, `dismissToast()` |
| `src/lib/utils/sound.ts` | `playChime(muted)` via Web Audio API |
| `src/lib/components/AchievementToast.svelte` | Fly-in toast, elasticOut pop, auto-dismiss |
| `src/lib/components/AchievementGallery.svelte` | Full-screen modal, earned/locked grid |

### Modified Files (9)
| File | Change |
|------|--------|
| `src/lib/types.ts` | Add `AchievementDef`, `EarnedAchievement` |
| `src/lib/stores/game.ts` | SAVE_VERSION → 2, v1→v2 migration, earnedAchievements in SaveData |
| `src/lib/utils/storage.ts` | EXPORT_VERSION → 2, shared migration helper |
| `src/lib/game/reactions.ts` | Add `checkAchievements` call on `isNew` |
| `src/routes/+page.svelte` | `galleryOpen` state, mount Gallery |
| `src/routes/+layout.svelte` | Mount Toast |
| `src/lib/components/BottomBar.svelte` | Achievements button (replaces redundant discovery count stat) |
| `src/lib/components/SettingsPanel.svelte` | Sound mute toggle |
| `src/lib/components/TopBar.svelte` | Label format: "42/61 discovered" |

### Z-Index Allocation
| Layer | z-index | Component |
|-------|---------|-----------|
| Shelf overlay | 199–200 | Existing |
| Bottom sheet | 299–300 | Existing |
| Settings / Gallery | 400–401 | `SettingsPanel`, `AchievementGallery` (new) |
| Toast | 500–600 | `AchievementToast` (new) |

---

## Critical Pitfalls

| # | Severity | Pitfall | Fix |
|---|----------|---------|-----|
| C1 | CRITICAL | `loadSave()` returns `null` for v1 saves when version bumped — all player progress reset | Migration ladder; keep key `alchemica_v1`; never return null for known version |
| C2 | CRITICAL | iOS AudioContext suspended outside user-gesture — chime permanently silent | Lazy `AudioContext` inside `playChime()`; called from `doReaction()` in `onclick` |
| C3 | CRITICAL | Save import re-awards achievements — 3 simultaneous toasts/chimes on import | `earnedAchievements` in save schema; `silent = true` on load/import |
| M1 | MODERATE | `Set<string>` serializes as `{}` in JSON | Spread to array on save; `new Set(data.earnedAchievements ?? [])` on load |
| M2 | MODERATE | Toast z-index collides with OfflineIndicator (`z-index: 9999`, `bottom: 80px`) | CSS z-index scale; toast at `top: 72px` (below TopBar, not bottom) |

---

## Suggested Roadmap (3 phases, continuing v1 numbering)

### Phase 6: Data Foundation & Save Schema
**Delivers:** Types + definitions, stores (achievements, settings, toasts), v1→v2 migration ladder, TopBar label polish
**Avoids:** C1 (save data loss), Min4 (Set JSON serialization)
**Standard patterns — skip research**

### Phase 7: Achievement Engine & Sound
**Delivers:** `checkAchievements()`, `deriveEarnedAchievementsFromCount()`, `playChime()`, `reactions.ts` wiring, `resetGame()` update
**Avoids:** C2 (iOS AudioContext), C3 (re-award on import), M1 (no-op firing), M4 (achievements not cleared on reset)
**QA gate: real iOS device test for chime — Simulator does not reproduce AudioContext constraint**

### Phase 8: UI — Toast, Gallery & BottomBar
**Delivers:** `AchievementToast.svelte`, `AchievementGallery.svelte`, BottomBar Achievements button, SettingsPanel mute toggle, CSS z-index scale
**Avoids:** M2 (z-index collision), M3 (route breaks PWA back-nav), Min1 (redundant stat), Min2 (setTimeout leak), Min3 (oscillator leak)
**Standard patterns — skip research**

---

## Open Decisions (settle during planning)

1. **BottomBar 4th button vs repurpose center stat** — Replace redundant "N discovered" text with Achievements button (lower complexity than adding 4th icon button). Either works; aesthetic choice for Phase 8.
2. **Toast position relative to ResultDisplay** — Confirm `top: 72px` clears `ResultDisplay` on mobile during Phase 8 visual pass.
3. **Chime frequency** — Major chord vs single note; decide in Phase 7 implementation.

---

*Research completed: 2026-05-02 | Ready for roadmap: yes*
