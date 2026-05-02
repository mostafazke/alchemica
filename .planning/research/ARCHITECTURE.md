# Architecture Research: Alchemica v2 — Achievements & Progression

**Mode:** Architecture (integration-focused)
**Confidence:** HIGH — all findings based on direct codebase analysis

---

## Integration Point: Achievement Evaluation

**Decision: Plain function called explicitly inside `applyReaction` in `lib/game/reactions.ts`, on the `isNew` branch.**

Why not `$derived` in component: business logic tied to component lifecycle — evaluations missed if component unmounted.
Why not `unlockedElements.subscribe()`: fires on no-op Set clone at line 60 (known-element path), requires extra guards.

```ts
// lib/game/reactions.ts — applyReaction, inside if (isNew) block
const newSize = get(unlockedElements).size;
checkAchievements(newSize); // imported from lib/game/achievements.ts
```

`checkAchievements(count)` is a plain function — not a store — making it testable without Svelte lifecycle coupling.

---

## Toast Trigger

**Decision: `toastQueue` writable store in `lib/stores/toasts.ts`. No prop-drilling.**

```ts
export const toastQueue = writable<ToastItem[]>([]);
export function pushToast(item: Omit<ToastItem, 'id'>): void { ... }
export function dismissToast(id: string): void { ... }
```

`AchievementToast.svelte` renders first item, auto-dismisses after 3s. Mounted in `+layout.svelte` (never unmounted, works over any future route).

---

## localStorage Schema Migration

**Decision: Bump SAVE_VERSION 1 → 2. Keep key `alchemica_v1` unchanged. Migration ladder in `loadSave()`.**

```ts
if (parsed.version === 1) {
  const count = Array.isArray(data.unlockedElements) ? data.unlockedElements.length : 0;
  data = { ...data, earnedAchievements: deriveEarnedAchievementsFromCount(count) };
  // Do NOT return null — migrate and continue
}
```

Critical rules:
1. Never `return null` for older version — migration preserves player progress
2. Migrated data writes back on next auto-save (triggered by existing store subscribe)
3. `deriveEarnedAchievementsFromCount` is a pure function — prevents retroactive toasts
4. `importSave()` must apply the same migration (extract shared helper)

Separate localStorage key `alchemica_achievements_v1` for earned achievements:
- `resetGame()` preserves badges by default (players keep their earned rewards)
- Full reset (with achievements) as separate opt-in in SettingsPanel

---

## Achievement Gallery

**Decision: Modal overlay — NOT a SvelteKit route.**

Arguments against `/achievements` route:
- `prerender = true, ssr = false` confirmed — navigating there unmounts `+page.svelte`, destroying canvas particle system and slot state
- Single-route app pattern already established
- Deep-linking is not a v2 requirement
- No browser back-button issues

Pattern: Fixed-position overlay following `SettingsPanel.svelte` exactly. Controlled by `galleryOpen` boolean in `+page.svelte`. Full-screen (not BottomSheet — gallery benefits from full-screen real estate).

---

## New Files

| File | Purpose |
|------|---------|
| `src/lib/data/achievements.ts` | Static `ACHIEVEMENT_DEFS: AchievementDef[]` |
| `src/lib/game/achievements.ts` | `checkAchievements(count)`, `deriveEarnedAchievementsFromCount(count)` |
| `src/lib/stores/achievements.ts` | `earnedAchievements` writable + localStorage |
| `src/lib/stores/settings.ts` | `soundEnabled` writable |
| `src/lib/stores/toasts.ts` | `toastQueue`, `pushToast()`, `dismissToast()` |
| `src/lib/utils/sound.ts` | `playChime()` via Web Audio API |
| `src/lib/components/AchievementToast.svelte` | Toast UI, auto-dismiss |
| `src/lib/components/AchievementGallery.svelte` | Full-screen overlay, earned/locked grid |

## Modified Files

| File | Change |
|------|--------|
| `src/lib/stores/game.ts` | SAVE_VERSION → 2, migration v1→v2, earnedAchievements in SaveData |
| `src/lib/utils/storage.ts` | EXPORT_VERSION → 2, earnedAchievements in SaveFile, shared migration helper |
| `src/lib/types.ts` | Add AchievementDef, EarnedAchievement interfaces |
| `src/lib/game/reactions.ts` | Add checkAchievements call in isNew branch |
| `src/routes/+page.svelte` | Add galleryOpen state, mount AchievementGallery |
| `src/routes/+layout.svelte` | Mount AchievementToast |
| `src/lib/components/BottomBar.svelte` | Add Achievements button |
| `src/lib/components/SettingsPanel.svelte` | Add sound mute toggle |
| `src/lib/components/TopBar.svelte` | Label format update (already renders count) |

---

## Data Flow

```
User taps "React"
  → doReaction() → applyReaction(a, b)
    → isNew = true
      → updates unlockedElements, discoveries, score [existing]
      → checkAchievements(get(unlockedElements).size) [NEW]
        → earnedAchievements.update(...)  [auto-saves]
        → pushToast({ emoji, name })
        → playChime() [if soundEnabled]
          → toastQueue updated
            → AchievementToast (layout.svelte) shows slide-in
```

---

## Build Order

1. `lib/types.ts` — add AchievementDef, EarnedAchievement
2. `lib/data/achievements.ts` — static data
3. `lib/stores/settings.ts` — soundEnabled writable
4. `lib/stores/achievements.ts` — writable + localStorage
5. `lib/stores/toasts.ts` — standalone queue
6. `lib/utils/sound.ts` — depends on settings store
7. `lib/game/achievements.ts` — depends on 2, 4, 5, 6
8. Schema migration — `stores/game.ts` + `utils/storage.ts` (depends on 7)
9. `game/reactions.ts` — add checkAchievements call (depends on 7)
10. `components/AchievementToast.svelte` — depends on toasts store
11. `components/AchievementGallery.svelte` — depends on achievements store + definitions
12. `components/BottomBar.svelte` — Achievements button prop
13. `components/SettingsPanel.svelte` — sound toggle
14. `routes/+page.svelte` — galleryOpen, mount Gallery
15. `routes/+layout.svelte` — mount Toast

---

## Z-Index Tiers

| Layer | z-index | Component |
|-------|---------|-----------|
| Shelf overlay (mobile) | 199–200 | `.shelf-overlay`, `.shelf-container` |
| Bottom sheet | 299–300 | `BottomSheet` |
| Settings / Gallery | 400–401 | `SettingsPanel`, `AchievementGallery` |
| Toast notification | 500–600 | `AchievementToast` — above gallery |
