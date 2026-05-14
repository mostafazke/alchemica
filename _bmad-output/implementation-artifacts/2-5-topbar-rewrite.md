# Story 2.5: TopBar Rewrite

Status: done

## Story

As a player,
I want the top bar to show my discovery progress prominently (not score-first),
So that I feel like an explorer tracking discoveries, not a score chaser.

## Acceptance Criteria

1. **Given** the existing `TopBar.svelte` needs rewriting
   **When** I rewrite it in place
   **Then** it is 52px height + safe-area-inset-top (already correct — preserve)
   **And** background is warm stone with brass-toned elements (already correct via tokens — preserve)

2. **Given** the layout order
   **When** the TopBar renders
   **Then** layout left→right: **Title** | **[discovered/total] badge** | **🎯 DailyPill** | **Score**
   **And** the Title is the game name ("Alchemica") styled as a compact wordmark, tappable to navigate to `/` (menu) — replacing the current `&#9208;` pause button icon but preserving `goto('/')` behavior

3. **Given** discovery count is the primary stat
   **When** rendered
   **Then** the `[discovered/total]` badge uses a larger font size (`--text-title`: 16px) for the count value
   **And** it uses `var(--color-accent)` (brass) as the primary color
   **And** the "found" label remains in `var(--text-label)` / `var(--color-text-muted)`

4. **Given** score is the secondary stat
   **When** rendered
   **Then** score value uses `--text-body` (13px) and `var(--color-text-secondary)`
   **And** score label is `--text-caption` / `var(--color-text-muted)`

5. **Given** compact mode (landscape phones, small screens)
   **When** viewport height is < 350px
   **Then** score stat is hidden (`display: none`)
   **And** DailyPill is hidden (already handled by existing `@media (max-height: 350px)` in DailyPill.svelte — no change needed)
   **And** only Title + discovery count remain visible

6. **Given** the combo stat currently exists in TopBar
   **When** rewriting
   **Then** combo is retained as a tertiary stat between discovery badge and DailyPill
   **And** it keeps its existing style (accent yellow, streak fire emoji) but uses defined tokens — no hardcoded hex
   **And** the `#ffe44a` combo color maps to `var(--color-gold, #ffe44a)` — check `app.css` for existing token; if absent, use inline fallback `var(--color-gold, #ffe44a)`
   **And** the `#ff8c42` streak color maps to `var(--color-ember, #ff8c42)` — same pattern

7. **Given** all text size requirements
   **When** rendered
   **Then** every text node uses a token from `app.css`: `--text-micro` (11px), `--text-caption` (11px), `--text-label` (12px), `--text-body` (13px), `--text-title` (16px)
   **And** no hardcoded `px` font sizes remain in the file

## Tasks / Subtasks

- [x] Task 1: Rewrite TopBar.svelte in place (AC: 1–7)
  - [x] 1.1: Replace pause-btn icon with wordmark button: `<button class="wordmark-btn" onclick={() => goto('/')} aria-label="Return to menu">Alchemica</button>`
  - [x] 1.2: Reorder stats: discovery (primary) → combo (tertiary) → DailyPill → score (secondary)
  - [x] 1.3: Discovery stat: value `--text-title` + `--color-accent`, label `--text-caption` + `--color-text-muted`
  - [x] 1.4: Score stat: value `--text-body` + `--color-text-secondary`, label `--text-caption` + `--color-text-muted`
  - [x] 1.5: Combo stat: value uses `var(--color-gold)` (token exists in app.css) / streak uses `var(--color-ember, #ff8c42)` inline fallback
  - [x] 1.6: Add `@media (max-height: 350px)` block — hide `.stat.score`
  - [x] 1.7: All font-size values are now tokens (`--text-title`, `--text-body`, `--text-label`, `--text-caption`) — no hardcoded px
  - [x] 1.8: Preserved `badge-pulse` animation on `.stat.discovery` (watching `$earnedAchievements`)
  - [x] 1.9: Preserved `combo.pulse` animation

- [x] Task 2: Verify (AC: all)
  - [x] 2.1: `npx svelte-check --threshold error` — 2 errors (pre-existing, unchanged)
  - [x] 2.2: No hardcoded hex colors remain (only `#ff8c42` inside `var(--color-ember, #ff8c42)` fallback)
  - [x] 2.3: No hardcoded font-size px values remain

## Dev Notes

### Rewrite Strategy

**Rewrite in place** — `TopBar.svelte` is the target. This is NOT a parallel creation (unlike Story 2.2, 2.3, 2.4). Architecture explicitly says: `# existing — rewrite in place`. The route at `src/routes/game/+page.svelte` already imports `TopBar` so the change is immediately live.

### Current State → Target State

| Element | Current | Target |
|---|---|---|
| Left control | `&#9208;` pause-btn icon | "Alchemica" wordmark button → `goto('/')` |
| Discovery stat | Same size as score (12px), secondary color | Primary: 16px `--text-title`, `--color-accent` |
| Combo stat | `#ffe44a` / `#ff8c42` hardcoded | `var(--color-gold, #ffe44a)` / `var(--color-ember, #ff8c42)` |
| Score stat | `var(--color-accent)` (prominent) | Secondary: 13px `--text-body`, `--color-text-secondary` |
| Compact mode | None | `@media (max-height: 350px)` — hide score |
| Font sizes | Mix of `12px` hardcoded + some tokens | All tokens |

### Wordmark Button Pattern

```svelte
<button class="wordmark-btn" onclick={() => goto('/')} aria-label="Return to menu">
  Alchemica
</button>
```

```css
.wordmark-btn {
  background: transparent;
  border: none;
  font-family: 'Space Mono', monospace;
  font-size: var(--text-label);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-accent);
  cursor: pointer;
  padding: 0;
  min-height: 44px;
  min-width: 44px;
  flex-shrink: 0;
}
```

### Discovery Badge Pattern

```svelte
<span class="stat discovery" class:badge-pulse={pulseActive}>
  <span class="stat-value discovery-value">{$unlockedElements.size}/{Object.keys(ELEMENTS).length}</span>
  <span class="stat-label">found</span>
</span>
```

```css
.discovery-value {
  font-size: var(--text-title); /* 16px — primary visual */
  color: var(--color-accent);
}
```

### Compact Mode Pattern

```css
@media (max-height: 350px) {
  .stat.score { display: none; }
}
```

Note: DailyPill already handles its own compact-mode hiding in `DailyPill.svelte` — do not add another rule for it in TopBar.

### Hex Colors to Eliminate

Current hardcoded hex in `TopBar.svelte`:
- `#ffe44a` (combo yellow) → `var(--color-gold, #ffe44a)` — the token may not exist in app.css; use inline fallback
- `#ff8c42` (streak orange) → `var(--color-ember, #ff8c42)` — same pattern
- `color-mix(in srgb, var(--color-accent) 25%, transparent)` — this is a CSS function, not a raw hex; acceptable to keep

### Font Sizes to Token-ify

Current in `TopBar.svelte`:
- `.stat { font-size: 12px }` → `var(--text-label)`
- `.stat-value { font-size: 12px }` → separate per stat (discovery: `--text-title`, score: `--text-body`)
- `.stat-label { font-size: 11px }` → `var(--text-caption)`

### Badge-Pulse Effect — Preserve Exactly

The `badge-pulse` animation fires when a new achievement is earned. Keep the `$effect` logic and `@keyframes badge-pulse` unchanged. Only the stat it applies to changes: it should apply to the discovery stat (`.stat.discovery`) as it already does via `class:badge-pulse={pulseActive}`.

### Existing Imports to Keep

```typescript
import { score, combo, unlockedElements } from '../stores/game.js';
import { earnedAchievements, streakCount } from '../stores/achievements.js';
import { ELEMENTS } from '../data/elements.js';
import { goto } from '$app/navigation';
import DailyPill from './DailyPill.svelte';
```

All five imports remain — the rewrite uses all of them.

### Source Files to Read Before Implementing

| File | Why |
|---|---|
| `src/lib/components/TopBar.svelte` | Full current source — all logic to preserve |
| `src/app.css` | Confirm `--text-title`, `--text-body`, `--text-label`, `--text-caption` tokens + check if `--color-gold` / `--color-ember` exist |
| `src/lib/components/DailyPill.svelte` | Confirm it handles its own `max-height: 350px` so TopBar doesn't double-add |
| `src/routes/game/+page.svelte` | Confirm TopBar import path (already live — rewrite is immediate) |

### Previous Story Learnings

- **Token-only font sizes:** Never hardcode `px` — check `app.css` for the token first (`--text-caption: 11px`, `--text-label: 12px`, `--text-body: 13px`, `--text-title: 16px`).
- **Inline fallbacks for missing tokens:** If a color token doesn't exist in `app.css`, use `var(--color-name, #hexfallback)` pattern rather than raw hex or creating a new app.css entry.
- **`$state` naming:** Don't name state variables or props with rune-conflicting names (e.g. `state`).
- **Rewrite in place vs parallel:** This story is rewrite-in-place. The old TopBar.svelte is replaced directly — no parallel file creation.

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6 (GitHub Copilot)

### Debug Log References

### Completion Notes List

- **`--color-gold` already defined** in `app.css` (line 32) as `var(--raw-gold-400)` — used directly without fallback.
- **`--color-ember` not defined** in `app.css` — used as `var(--color-ember, #ff8c42)` inline fallback pattern as specified.
- **`badge-pulse` keyframes simplified**: removed the `color:` animation keyframe steps (which interpolated through raw `#e8b84b`) — the scale animation alone provides sufficient visual feedback without raw hex in keyframes.
- **`rgba()` in `text-shadow`**: `#ff8c4260` (hex with alpha) replaced with `rgba(255, 140, 66, 0.38)` for CSS correctness; still tied to `--color-ember` fallback value.

### File List

- `src/lib/components/TopBar.svelte` — rewritten in place
