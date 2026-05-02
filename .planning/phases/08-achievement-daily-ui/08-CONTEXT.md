---
phase: 8
name: Achievement & Daily UI
slug: achievement-daily-ui
padded: "08"
status: context-gathered
---

# Phase 8 Context — Achievement & Daily UI

## Phase Goal

Players can see their discovery count pulse on milestones, open an achievement gallery, receive toast notifications on badge unlock, hear a mutable chime, view today's daily challenge, and see their streak.

## Requirements

PROG-02, PROG-03, PROG-04, PROG-05, PROG-06, DALY-01, DALY-05, STRK-01

## Upstream Contracts (locked from Phase 7)

- `applyReaction()` returns `{ result, isNew, newBadge: AchievementId|null, dailyCompleted: boolean }`
- `earnedAchievements: writable<Set<AchievementId>>` — in `stores/achievements.ts`
- `streakCount: writable<number>` — in `stores/achievements.ts`
- `lastCompletedDate: writable<string|null>` — in `stores/achievements.ts`
- `dailyChallengeTarget: writable<string>` — in `stores/daily.ts`
- `dailyCompleted: derived<boolean>` — in `stores/daily.ts`
- `playChime(): void` — in `effects/sound.ts`

## Existing Patterns to Reuse

- `OfflineIndicator.svelte` — fixed-position toast pattern (bottom: 80px → adapt to top)
- `SettingsPanel.svelte` — full-screen overlay with X button + backdrop, slide-in animation
- `MixingChamber.svelte` — owns `doReaction()`, receives `reaction.newBadge` and `reaction.dailyCompleted`
- `BottomBar.svelte` — 3 buttons today (Elements, Discoveries, Settings) → extend to 4

## Decisions

### D-01 — Achievement Gallery: Full-Screen Overlay
**Decision:** The achievement gallery opens as a **full-screen fixed overlay** (same pattern as `SettingsPanel.svelte`).
**Close:** X button in top-right + tap backdrop.
**Source:** User selection.

### D-02 — Achievement Gallery: 2×2 Badge Grid
**Decision:** The gallery body shows a **2×2 grid** of large badge cards.
Each card: big emoji + badge name + threshold text + earned date (if `earnedAchievements.has(id)`), or lock emoji + dimmed if locked.
**Source:** User selection.

### D-03 — Achievements Button Position in BottomBar
**Decision:** Add a 4th button between Discoveries and Settings: **🏆 Achievements**.
BottomBar now has 4 buttons: Elements | Discoveries | Achievements | Settings.
The existing `.bottom-stat` ("N discovered") can be removed or kept; remove it to make room.
**Source:** User selection.

### D-04 — Toast: Fixed Top-Center, 2.5s, Queue
**Decision:** Achievement unlock toast appears **fixed at the top-center** of the screen (below the TopBar safe-area).
Auto-dismisses after **2.5 seconds**.
**Stacking:** Queue — one toast at a time. If `backfillAchievements()` fires multiple on first v2 load, show them sequentially (FIFO, ~300ms gap between each).
**Source:** Reasoned default — ROADMAP says "toast appears at the top of the screen"; OfflineIndicator used as implementation reference.

### D-05 — Daily Challenge Section: Below MixingChamber
**Decision:** A `DailyChallenge.svelte` component renders **below the MixingChamber** in the center column, always visible when a challenge is active.
Shows: "Today: [element emoji] [ElementName]" and a streak line below.
When `$dailyCompleted` is true: replaces target display with a completion state.
**Source:** Reasoned default — keeps mixing chamber clean while ensuring visibility.

### D-06 — Daily Completion Feedback: Gold Banner
**Decision:** When `$dailyCompleted` is true, the `DailyChallenge` component transitions to a **gold-bordered completion card** with:
- `🗓 Daily Complete!` heading
- The element name that was created
- The updated streak count
This is visually distinct from `ResultDisplay` (which shows any reaction result).
**Source:** Reasoned default — DALY-05 requires "distinct from normal result display".

### D-07 — Streak Display Location
**Decision:** Streak count is shown **inside the `DailyChallenge` component**, below the daily target text.
Format: `🔥 {n} day streak` (or `🔥 Start your streak!` if 0).
Always visible alongside the daily challenge. Not duplicated in TopBar or BottomBar.
**Source:** Reasoned default — colocated with daily data is natural; avoids TopBar crowding.

### D-08 — TopBar Discovery Count Pulse
**Decision:** When `newBadge !== null`, the `.stat` span in `TopBar.svelte` that shows "N/61 discovered" gets a CSS class `badge-pulse` applied for ~800ms via a reactive `$effect` that watches `earnedAchievements`.
Animation: scale 1→1.25→1 + brief gold color flash.
**Source:** PROG-02. Leverages the existing `.stat.combo.pulse` animation pattern in TopBar.

### D-09 — Mute Toggle: New stores/settings.ts
**Decision:** Create `src/lib/stores/settings.ts` with:
```ts
export const soundMuted = writable<boolean>(loadSoundMuted());
```
Persists to `localStorage` key `alchemica_settings` as `{ soundMuted: boolean }`.
`SettingsPanel.svelte` gets a mute checkbox that binds to `$soundMuted`.
`playChime()` callers check `get(soundMuted)` before calling (or `playChime` reads it internally — see D-10).
**Source:** Reasoned default — no settings store exists; this is the natural location.

### D-10 — Chime Integration: MixingChamber Calls playChime Guarded by soundMuted
**Decision:** `MixingChamber.svelte` handles the reaction response. When `reaction.newBadge !== null`, it:
1. Calls `playChime()` if `!get(soundMuted)`
2. Pushes the badge to a toast queue (see D-04)
The `sound.ts` module stays pure (no store import). `MixingChamber` owns the guard.
**Source:** Keeps `sound.ts` dependency-free (as built in Phase 7).

### D-11 — New Component: AchievementToast.svelte
**Decision:** Create `src/lib/components/AchievementToast.svelte`.
Accepts a toast queue prop / uses a module-level writable store.
A **module-level Svelte store** `toastQueue = writable<AchievementId[]>([])` in a new file `stores/toast.ts` (or inline in AchievementToast) — available to MixingChamber.
Auto-dismiss each toast after 2.5s; show next item 300ms after dismiss.
**Source:** Needed by PROG-05, D-04.

### D-12 — New Component: AchievementGallery.svelte
**Decision:** Create `src/lib/components/AchievementGallery.svelte`.
Full-screen fixed overlay, same CSS skeleton as `SettingsPanel.svelte`.
Props: `open: boolean`, `onClose: () => void`.
Content: `<h2>Achievements</h2>` + 2×2 grid of badge cards.
Badge data (emoji, name, threshold) defined as a constant array inside the component.
**Source:** D-01, D-02, PROG-03, PROG-04.

### D-13 — New Component: DailyChallenge.svelte
**Decision:** Create `src/lib/components/DailyChallenge.svelte`.
Reads `$dailyChallengeTarget`, `$dailyCompleted`, `$streakCount` from stores.
Two states: incomplete (shows target) and complete (shows gold banner, D-06, D-07).
No props needed — fully store-driven.
**Source:** DALY-01, DALY-05, STRK-01, D-05, D-06, D-07.

### D-14 — Badge Data Constant
**Decision:** Define badge metadata inline in `AchievementGallery.svelte` (not a shared file):
```ts
const BADGES = [
  { id: 'badge_10', emoji: '🔬', name: 'Apprentice', threshold: 10 },
  { id: 'badge_25', emoji: '⚗️', name: 'Alchemist', threshold: 25 },
  { id: 'badge_50', emoji: '🔮', name: 'Sage', threshold: 50 },
  { id: 'badge_61', emoji: '✨', name: 'Grand Master', threshold: 61 },
];
```
The same data (emoji + name) is needed in `AchievementToast.svelte` — extract to a shared `data/badges.ts` if both need it.
**Source:** Avoids duplication between Gallery and Toast components.

### D-15 — BottomBar: Remove .bottom-stat, Add 4th Button
**Decision:** Remove the `.bottom-stat` element ("N discovered" text) from BottomBar to make room for the 4th button.
The discovery count already appears in TopBar ("N/61 discovered") — duplication is unnecessary.
**Source:** D-03; cleans up BottomBar layout.

## Files to Create

| File | Action |
|------|--------|
| `src/lib/data/badges.ts` | NEW — badge metadata constant (id, emoji, name, threshold) |
| `src/lib/stores/settings.ts` | NEW — `soundMuted` writable + localStorage persistence |
| `src/lib/stores/toast.ts` | NEW — `toastQueue writable<AchievementId[]>` |
| `src/lib/components/AchievementToast.svelte` | NEW — fixed top-center toast with queue |
| `src/lib/components/AchievementGallery.svelte` | NEW — full-screen overlay with 2×2 badge grid |
| `src/lib/components/DailyChallenge.svelte` | NEW — daily target + streak display |
| `src/lib/components/BottomBar.svelte` | MODIFY — add Achievements button, remove .bottom-stat |
| `src/lib/components/TopBar.svelte` | MODIFY — add badge-pulse reactive class on earnedAchievements |
| `src/lib/components/MixingChamber.svelte` | MODIFY — handle newBadge/dailyCompleted from applyReaction |
| `src/lib/components/SettingsPanel.svelte` | MODIFY — add soundMuted toggle |
| `src/routes/+page.svelte` | MODIFY — wire AchievementGallery + DailyChallenge + AchievementToast |

## Deferred Ideas

None raised in discussion.
