# Feature Landscape: Achievement System for Alchemica v2

**Domain:** Casual mobile puzzle game — milestone achievement system
**Researched:** 2026-05-02
**Overall confidence:** HIGH (grounded in existing codebase inspection + well-established casual game UX patterns)

---

## Context: What Already Exists

The existing game provides the hooks that achievement features plug into:

- `unlockedElements` store — a `Set<string>`, size grows on every discovery (current max: 61)
- `discoveries` store — `Discovery[]` array, timestamp-ordered
- `score` + `combo` stores — numeric, updated on every reaction
- `SAVE_KEY = 'alchemica_v1'` with `SAVE_VERSION = 1` — ready to bump to v2
- `resetGame()` — must clear achievement state too
- `BottomBar` — 3-button nav (`Elements`, `Discoveries`, `Settings`) with room for a 4th button or badge icon
- `SettingsPanel` — modal dialog, extendable for mute toggle
- `ResultDisplay` — shows "NEW DISCOVERY" badge inline; toasts must not overlap this area
- TopBar already renders `{$unlockedElements.size}/{Object.keys(ELEMENTS).length}` as a small stat — discovery counter already exists in basic form

---

## Table Stakes

Features users expect from any achievement system. Missing = feels unfinished.

| Feature | Why Expected | Complexity | Alchemica Dependency |
|---------|--------------|------------|----------------------|
| Discovery milestone badges (10 / 25 / 50 / 61) | Standard progression reward in all discovery games; players need visible goals | Low | `unlockedElements.size` comparison on every discovery event |
| Persistent achievement state (survives reload) | Without persistence, badges are meaningless | Low | `game.ts` save schema bump from v1 → v2; add `earnedAchievements: string[]` to save |
| Achievement unlock toast notification | Tells the player something happened; silent unlock = invisible reward | Low-Med | Must coexist with existing "NEW DISCOVERY" result display; render above the lab, fixed position |
| Achievement gallery screen | Players need somewhere to review progress; "how far am I?" is a core engagement loop | Medium | New route or bottom-sheet modal; needs earned/locked state from store |
| Earned vs locked visual distinction | Obvious UX contract — earned looks full, locked looks dim | Low | Pure UI — CSS opacity/filter on badge cards |
| Discovery percentage counter in TopBar | Makes progress legible at a glance ("42/61"); players self-motivate when they see the gap | Low | TopBar already renders `{$unlockedElements.size}/{Object.keys(ELEMENTS).length}` — **already partially built**, just format/label refinement |

---

## Differentiators

Features that make the achievement moment feel special rather than mechanical.

| Feature | Value Proposition | Complexity | Alchemica Dependency |
|---------|-------------------|------------|----------------------|
| Badge unlock sound effect (short chime, mutable) | Audio reinforcement makes the milestone feel real; earns its own memory | Low-Med | New: Web Audio API oscillator burst or a single small `.mp3`/`.ogg` asset; mute toggle in SettingsPanel |
| Animated badge reveal on first unlock | The gallery card "flips" or "glows in" when first seen — transforms gallery from list into theatre | Medium | CSS keyframe animation on badge card; `$state` flag tracking `isNew` per badge for one-session reveal |
| Badge emoji + short name identity | Badges are memorable when they have character — "🔥 Pyromancer" beats "25 discoveries" | Low | Data-only: typed TS config `{ id, name, emoji, threshold, description }` |
| Milestone context in unlock toast | Toast says "Pyromancer — 25 elements discovered!" not just "Achievement unlocked" | Low | Toast receives the full badge definition, not just a flag |
| Unlock animation on TopBar counter | Counter briefly "pops" (scale pulse, already used for combo) when a milestone is crossed | Low | Reuse existing `.combo.pulse` CSS animation; trigger on `unlockedElements` size matching a threshold |

---

## Anti-Features

Features to explicitly avoid in v2.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Retroactive badge unlock on import/load | Re-showing toasts for achievements already earned in a previous session feels spammy and breaks immersion | Evaluate achievements silently on load; mark as earned without triggering toast or sound; only toast/chime during live play |
| Achievement points / XP layer on top of badges | Adds cognitive overhead; the score system already handles quantitative feedback; two numeric progression systems compete | Keep achievements purely qualitative (earned/not earned); the score is the number |
| Locked badge content preview ("??? — ???") | Artificially withholds information to create false mystery; in a discovery game the player already knows they're hunting for elements | Show locked badges with their name and threshold visible ("🔒 Collector — discover 25 elements") — reward the chase, not the reveal |
| Time-based achievements ("Discover 3 in 30 seconds") | Creates pressure in a game designed for low-stress exploration; clashes with the hint cooldown that already throttles pace | Stick to count-based milestone achievements only |
| Achievement rarity tiers (bronze / silver / gold) | Only 4 milestones (10/25/50/61) — a tier system on 4 items is decoration, not design | Use visual weight/size to differentiate (the 61-badge is the "complete" badge, larger or gold-colored) |
| Social / share from achievement gallery | The Web Share API is already wired to individual discoveries; sharing badges adds friction with low payoff | Keep gallery read-only; sharing stays on individual discovery results |
| Notifications / push reminders | Intrusive on a PWA; localStorage-only scope makes tracking meaningful triggers for re-engagement impossible | Not in scope; would require backend |
| Full-screen celebration overlay on completion | Blocks the game for 100% players who want to keep experimenting; overserves the 1% who reach completion | Toast + chime is enough; the gallery screen can highlight "COMPLETE" state with a special border/header |

---

## Feature Dependencies

```
unlockedElements store size changes
  → Achievement engine evaluates thresholds
      → New badge earned?
          → Mark earnedAchievements in store
          → Persist to localStorage (save schema v2)
          → Trigger toast (show badge name + emoji)
          → Trigger chime (if not muted)
          → Pulse TopBar counter animation

Achievement gallery screen
  → Reads earnedAchievements store
  → Reads ACHIEVEMENTS config (typed TS array)
  → Renders earned cards (full opacity, checkmark)
  → Renders locked cards (dim, lock icon, threshold label)
  → Accessible from BottomBar (new button or Achievements entry)

SettingsPanel extension
  → Add mute toggle (boolean store, persisted)
  → Chime respects mute setting

resetGame()
  → Must clear earnedAchievements store
  → Must clear achievements from localStorage save
```

---

## What Makes Unlock Moments Feel Satisfying vs Cheap

**Satisfying:**
- Toast appears *while the player is still in the moment* — immediately after the triggering discovery, not delayed by a second render cycle
- Toast is specific: badge name, emoji, and threshold shown together ("🔥 Pyromancer — 25 discoveries!")
- Sound is short (200–400ms), harmonic, and not repeated on every reaction — only fires once per badge
- Toast auto-dismisses (2–3s) without requiring player action — never blocks the next action
- Gallery badge cards feel earned when seen — crisp, full color, distinct from locked peers
- The 61-badge ("Complete" / "Grand Alchemist") has visually heavier treatment — it is the endgame goal

**Cheap:**
- Toast says only "Achievement Unlocked" with no identity
- Toast stacks or appears on every game event (false positives)
- Chime plays on every new element discovery (not just milestones) — loses salience
- Locked badges are completely hidden — player cannot see what they are working toward
- Achievement gallery is just a flat list of checkboxes with text — no visual hierarchy

---

## Achievement Gallery Design on Mobile

**Recommended layout:**

```
[ Achievements ]                     header (matches SettingsPanel style)
───────────────────────────────────
  42 / 61 discovered   ▓▓▓▓▓▓░░  progress bar (optional, medium complexity)
───────────────────────────────────
  🔥  Pyromancer        ✓  earned
  "Discover 10 elements"
  
  ⚗️  Collector          ✓  earned
  "Discover 25 elements"
  
  🌌  Sage               🔒  locked
  "Discover 50 elements"
  
  👑  Grand Alchemist    🔒  locked
  "Discover all 61 elements"
───────────────────────────────────
```

**Structural decisions:**
- Modal dialog matches SettingsPanel patterns (overlay + centered card, `min(340px, 92vw)`)
- On mobile: single-column card list, vertically scrollable
- Card height ~72px minimum (44px touch target headroom)
- Locked cards: `opacity: 0.45`, desaturated, lock icon replaces checkmark
- Earned cards: accent border (`#4af0c0`), checkmark in accent color
- No separate route needed — bottom sheet or modal keeps navigation flat

**Access point:**
- Add an "Achievements" button to `BottomBar` (4th button, replaces the `{discoveries.length} discovered` center text which becomes redundant once TopBar shows the counter)
- OR repurpose the center `bottom-stat` text into a tappable achievements entry (lower complexity, single change)

---

## MVP Feature Priority

**Essential for v2 (table stakes + core differentiators):**

1. Achievement typed config (`id`, `name`, `emoji`, `threshold`, `description`) — data foundation everything else builds on
2. Achievement engine in `game.ts` — evaluates on `unlockedElements` change, emits to a writable `earnedAchievements` store
3. Persist `earnedAchievements` to localStorage — bump `SAVE_KEY` to `alchemica_v2`, `SAVE_VERSION` to 2, add migration from v1
4. TopBar discovery counter — polish existing `{$unlockedElements.size}/{total}` into a cleaner "42/61 discovered" label (already 80% done)
5. Unlock toast — fixed-position, auto-dismiss 2.5s, badge name + emoji, appears above MixingChamber
6. Achievement gallery screen — modal with earned/locked badge cards, accessible from BottomBar
7. Badge unlock chime — Web Audio API oscillator (no asset needed), mute toggle in SettingsPanel

**Defer or descope:**
- Animated badge reveal ("flip" animation on first gallery view) — nice but zero gameplay impact; defer to v3 if ever
- Progress bar in gallery — adds visual complexity for 4 items; the 4 cards with earned/locked already communicate progress sufficiently
- Retroactive toast replay — explicitly excluded (anti-feature)

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Table stakes | HIGH | Universal patterns in casual games; confirmed by inspecting existing game structure |
| Anti-features | HIGH | Directly derived from game design principles + existing feature interactions |
| Gallery design | HIGH | Grounded in existing SettingsPanel modal patterns in the codebase |
| Unlock moment psychology | HIGH | Well-established game UX; audio/visual reinforcement timing is canonical |
| BottomBar integration | HIGH | Codebase inspected; 3-button layout has clear room for 4th or repurposed center stat |
| Save schema migration | HIGH | `storage.ts` and `game.ts` inspected; v1 → v2 bump pattern is straightforward |

---

## Sources

- Codebase inspection: `src/lib/stores/game.ts`, `src/lib/components/TopBar.svelte`, `src/lib/components/BottomBar.svelte`, `src/lib/components/SettingsPanel.svelte`, `src/lib/utils/storage.ts`, `src/lib/types.ts`
- Domain knowledge: Achievement system UX patterns established in Little Alchemy, Monument Valley, and similar casual mobile puzzle games (training data, HIGH confidence for canonical patterns)
- Platform constraint: Web Audio API available in all modern browsers; no asset bundle cost for oscillator-based chime
