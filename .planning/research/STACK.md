# Stack Research: Alchemica v2 — Achievements & Progression

**Mode:** Ecosystem (stack additions for new features)
**Confidence:** HIGH

---

## Summary

No new runtime dependencies required. All v2 capabilities achievable with Web APIs and Svelte built-ins.

---

## Toast Notifications

**Decision: Custom `AchievementToast.svelte` — 0KB bundle delta.**

- `svelte-french-toast` 1.2.0 requires `svelte ^3.57.0 || ^4.0.0` — incompatible with Svelte 5
- `svelte-french-toast` 2.0.0-alpha.0 adds Svelte 5 support but is pre-release
- `svelte-sonner` 1.1.1 is Svelte 5 compatible but carries `runed` + 3 transitive packages for a single notification type
- A 30-line custom component with Svelte's built-in `fly`/`fade` transitions is the correct call

---

## Sound Effects

**Decision: Web Audio API — no library. 0KB bundle delta.**

- Howler.js 2.2.4: ~8KB gzipped. Its value is cross-browser audio format fallback (MP3/OGG) and audio sprite sheets — irrelevant for a synthesized chime
- Tone.js 15.1.22: 1.06MB tgz — eliminated immediately
- A `playChime(muted)` util is ~20 lines of native `OscillatorNode` + `GainNode`

---

## Animations

**Decision: Svelte built-in `scale`/`fly` transitions with `elasticOut` easing — 0KB delta.**

- `elasticOut` from `svelte/easing` produces the badge "pop" effect
- Already the pattern in the codebase (`panel-appear` in SettingsPanel, `pulse` in TopBar)

---

## Save Schema

**Decision: Bump `SAVE_VERSION` 1 → 2, keep `SAVE_KEY = 'alchemica_v1'` unchanged.**

- Add `migrateV1 → V2` function: appends `earnedAchievements: []` to existing saves
- On load, re-evaluate achievements against current `unlockedElements.size` to grant earned badges silently (no retroactive toasts)
- Store mute state under a separate key `alchemica_sound_muted` (preference, not progress — survives `resetGame()`)

---

## New Files

| File | Purpose |
|------|---------|
| `src/lib/data/achievements.ts` | Typed `AchievementDef[]` config |
| `src/lib/stores/achievements.ts` | `earnedAchievements: writable<Set<string>>` with auto-save |
| `src/lib/stores/toasts.ts` | `activeToast` store + `showAchievementToast()` helper |
| `src/lib/utils/sound.ts` | `playChime(muted)` via Web Audio API |
| `src/lib/components/AchievementToast.svelte` | Fly-in toast, elasticOut badge pop |
| `src/lib/components/AchievementGallery.svelte` | Earned/locked badge grid overlay |

## Modified Files

| File | Change |
|------|--------|
| `src/lib/stores/game.ts` | Bump `SAVE_VERSION` to 2; migration v1→v2 |
| `src/lib/game/reactions.ts` | Call achievement check on new discovery |
| `src/lib/components/SettingsPanel.svelte` | Add mute toggle |
| `src/lib/components/BottomBar.svelte` | Add Achievements nav button |
| `src/routes/+layout.svelte` | Mount `<AchievementToast />` |

---

## Library Version Table

| Library | Version | Decision |
|---------|---------|----------|
| svelte-french-toast | 1.2.0 | ❌ Incompatible with Svelte 5 |
| svelte-french-toast | 2.0.0-alpha.0 | ❌ Pre-release |
| svelte-sonner | 1.1.1 | ❌ Dependency overhead not justified |
| howler.js | 2.2.4 | ❌ 8KB gzipped for a 20-line native equivalent |
| Tone.js | 15.1.22 | ❌ 1MB+ synthesis framework |
