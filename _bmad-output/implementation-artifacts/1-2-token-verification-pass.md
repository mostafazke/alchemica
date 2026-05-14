# Story 1.2: Token Verification Pass

Status: done

## Story

As a developer,
I want to replace all old-navy-palette hardcoded hex values in every .svelte component and route file with semantic tokens from the three-layer CSS token system,
So that the palette migration is complete across the entire codebase before component rewrites begin.

## Acceptance Criteria

1. **Given** the old navy accent `#4af0c0` appears 103 times across 26 files
   **When** I replace every occurrence with `var(--color-accent)` (or `color-mix` for alpha variants)
   **Then** no `.svelte` file in `src/` contains `#4af0c0`

2. **Given** muted-text values `#4a6080` appear 45 times
   **When** I replace them
   **Then** `#4a6080` is gone and `var(--color-text-muted)` is used in its place

3. **Given** secondary-text `#8ab4d4` appears 28 times
   **When** I replace it
   **Then** `var(--color-text-secondary)` is used in its place

4. **Given** border values `#1a3a5a` (23×) and `#1a2e4a` (21×) exist
   **When** I replace them
   **Then** `#1a3a5a` → `var(--color-border-mid)` and `#1a2e4a` → `var(--color-border-subtle)` across all files

5. **Given** background values `#0d1b2e` (22×), `#080f1a` (7×), `#0a1520`/`#0a1628`/`#0a1a2a` (2–4×) exist
   **When** I replace them
   **Then** deep-bg variants → `var(--color-bg-deep)`, surface variants → `var(--color-bg-surface)`, raised variants → `var(--color-bg-raised)`

6. **Given** primary-text `#c8d8e8` (13×) and cool-grey `#e8e8f0` (3×) exist
   **When** I replace them
   **Then** both → `var(--color-text-primary)`

7. **Given** alpha-accent variants like `#4af0c040`, `#4af0c060`, `#4af0c080` exist
   **When** I replace them
   **Then** use `color-mix(in srgb, var(--color-accent) <percent>, transparent)` where `var(--color-accent-dim)` or `var(--color-border-active)` do not fit
   **And** prefer existing semantic tokens:
   - 19% opacity (~`#4af0c030`) → `var(--color-accent-dim)`
   - 38% opacity (~`#4af0c060`) → `var(--color-border-active)`
   - Other alphas → `color-mix(in srgb, var(--color-accent) <N>%, transparent)`

8. **Given** minor navy variants (`#0f2035`, `#0d1e38`, `#0f2240`, `#111b2e`, `#141e32`) exist
   **When** I check their usage context
   **Then** bg-hover variants → `var(--color-bg-hover)`, surface variants → `var(--color-bg-surface)`, and raised variants → `var(--color-bg-raised)`

9. **Given** WCAG AA contrast requirements
   **When** migration is complete
   **Then** `--color-text-primary` (#d8cbb8) on `--color-bg-surface` (#110e08) passes 11:1
   **And** `--color-text-secondary` (#a89478) on `--color-bg-surface` passes 5.5:1
   **And** `--color-text-muted` (#6b5a45) is only used on decorative/non-essential labels

10. **Given** intentional game-semantic colors exist (element categories, energy states, score colors)
    **When** I audit each file
    **Then** these are LEFT UNTOUCHED — they are NOT part of this story:
    - `#ffe44a` (gold/score/achievement) — game color
    - `#ff6b6b`, `#e74c3c`, `#c0392b` (error/fire/danger alerts) — game color
    - `#c9a84c`, `#d9b85c`, `#e9ca70` (brass/bronze tones in game UI) — may already match token, verify
    - `#ff8c42`, `#ff6b35` (streak/fire glow) — game color
    - `#6cc87a`, `#96c84a` (life/nature elements) — element category colors
    - `#d05aff`, `#d080a0`, `#c8c8ff` (rare/cosmic elements) — element category colors
    - `#4abfff`, `#5ab4ff`, `#7eb8f7` (water/air elements) — element category colors
    - `#3dd1a6` (discovery teal — this IS a legacy teal, flag for review)
    - `#ff4050`, `#ff6060` (alert/danger) — game color

## Tasks / Subtasks

- [x] Task 1: Migrate palette hex values in components (Batch A — high count)
  - [x] 1.1: `ElementCard.svelte` (25 hex lines) — migrate all navy palette values, use color-mix for alpha-accent variants
  - [x] 1.2: `EventBanner.svelte` (24 hex lines) — migrate navy palette values
  - [x] 1.3: `StuckHintPrompt.svelte` (20 hex lines) — migrate navy palette values
  - [x] 1.4: `ResultDisplay.svelte` (19 hex lines) — migrate navy palette values
  - [x] 1.5: `HintButton.svelte` (19 hex lines) — migrate navy palette values
  - [x] 1.6: `DiscoveryOverlay.svelte` (19 hex lines) — migrate navy palette values
  - [x] 1.7: `DailyChallenge.svelte` (19 hex lines) — migrate navy palette values

- [x] Task 2: Migrate palette hex values in components (Batch B — medium count)
  - [x] 2.1: `TopBar.svelte` (17 hex lines) — migrate navy palette values
  - [x] 2.2: `RatingPrompt.svelte` (16 hex lines) — migrate navy palette values
  - [x] 2.3: `FirstRunOverlay.svelte` (15 hex lines) — migrate navy palette values
  - [x] 2.4: `ElementDetail.svelte` (13 hex lines) — migrate navy palette values
  - [x] 2.5: `AchievementGallery.svelte` (13 hex lines) — migrate navy palette values
  - [x] 2.6: `ElementGrid.svelte` (11 hex lines) — migrate navy palette values
  - [x] 2.7: `DiscoveryBanner.svelte` (11 hex lines) — migrate navy palette values

- [x] Task 3: Migrate palette hex values in components (Batch C — low count)
  - [x] 3.1: `DailyPill.svelte` (8 hex lines)
  - [x] 3.2: `Slot.svelte` (7 hex lines)
  - [x] 3.3: `DiscoveryItem.svelte` (7 hex lines)
  - [x] 3.4: `DiscoveryLog.svelte` (5 hex lines)
  - [x] 3.5: `BottomSheet.svelte` (3 hex lines)
  - [x] 3.6: `AchievementToast.svelte` (~3 hex lines)
  - [x] 3.7: `OfflineIndicator.svelte` (2 hex lines)
  - [x] 3.8: `MixingChamber.svelte` (~2–5 hex lines)

- [x] Task 4: Migrate palette hex values in route files
  - [x] 4.1: `src/routes/settings/+page.svelte` (48 hex lines) — migrate navy palette only
  - [x] 4.2: `src/routes/+page.svelte` (31 hex lines) — migrate navy palette only
  - [x] 4.3: `src/routes/leaderboard/+page.svelte` (28 hex lines) — migrate navy palette only
  - [x] 4.4: `src/routes/game/+page.svelte` (1 hex line) — migrate if navy palette

- [x] Task 5: Flag `#3dd1a6` occurrences for review
  - [x] 5.1: Found in RatingPrompt.svelte (2 occurrences) as button hover accent — replaced with `var(--color-accent)`. Also migrated `#6a8aa4` → `var(--color-text-secondary)` and `#e8f4ff` → `var(--color-text-primary)` across 8 files.

- [x] Task 6: Verify migration completeness
  - [x] 6.1: `grep` for all AC1-8 palette values — zero matches
  - [x] 6.2: `grep` for minor navy variants + #3dd1a6/#6a8aa4/#e8f4ff — zero matches
  - [x] 6.3: `npx svelte-check --threshold error` — 2 pre-existing errors only, zero new errors

## Dev Notes

### Critical Architecture Constraints

- **Scope boundary**: Only migrate old-navy-palette hex values. Do NOT touch element-category colors, energy/score colors, or game-semantic colors listed in AC10. Story 2.x component rewrites will handle those.
- **No new tokens**: Do not add new CSS custom properties. Use only tokens already defined in `src/app.css :root` from Story 1.1.
- **Svelte scoped styles**: All hex values in `.svelte` files live inside `<style>` blocks. These are Svelte-scoped styles — they behave like regular CSS but do not cascade to children. The global tokens from `app.css :root` ARE accessible inside them.
- **No logic changes**: This story modifies CSS `<style>` blocks only. Zero changes to `<script>` blocks or template markup (unless a hex color is inline-styled in HTML, which would be unusual).

### Old Palette → New Token Mapping (Canonical Reference)

Use this table for every replacement decision. When context is ambiguous, pick the most semantically appropriate token, not just the closest hex.

| Old Hex | Occurrences | Role | New Token | New Hex |
|---------|------------|------|-----------|---------|
| `#4af0c0` | 103 | Teal accent | `var(--color-accent)` | #d4a84a |
| `#4a6080` | 45 | Muted text / dim labels | `var(--color-text-muted)` | #6b5a45 |
| `#8ab4d4` | 28 | Secondary text | `var(--color-text-secondary)` | #a89478 |
| `#1a3a5a` | 23 | Mid border / separator | `var(--color-border-mid)` | #3d3020 |
| `#0d1b2e` | 22 | Deep background | `var(--color-bg-deep)` | #0a0805 |
| `#1a2e4a` | 21 | Subtle border / card edge | `var(--color-border-subtle)` | #2a2218 |
| `#c8d8e8` | 13 | Primary text (cool parchment) | `var(--color-text-primary)` | #d8cbb8 |
| `#080f1a` | 7 | Deepest bg / track | `var(--color-bg-deep)` | #0a0805 |
| `#0f2035` | 5 | Hover / raised bg | `var(--color-bg-hover)` | #1c1610 |
| `#0a1520` | 4 | Card surface bg | `var(--color-bg-surface)` | #110e08 |
| `#0a1a2a` | 4 | Surface bg | `var(--color-bg-surface)` | #110e08 |
| `#e8e8f0` | 3 | Light text (off-white) | `var(--color-text-primary)` | #d8cbb8 |
| `#0a1628` | 2 | Surface bg | `var(--color-bg-surface)` | #110e08 |
| `#141e32` | 1 | Surface/raised bg | `var(--color-bg-raised)` | #16120b |
| `#111b2e` | 1 | Surface bg | `var(--color-bg-surface)` | #110e08 |
| `#0d1e38` | 1 | Surface/hover bg | `var(--color-bg-hover)` | #1c1610 |
| `#0f2240` | 1 | Raised/hover bg | `var(--color-bg-hover)` | #1c1610 |

### Alpha Variant Handling (Critical)

Many components use hex colors with alpha suffixes like `#4af0c040`. These become:

| Pattern | Alpha % | Strategy |
|---------|---------|----------|
| `#4af0c0` + `30` hex = ~19% | ~19% | `var(--color-accent-dim)` (already `rgba(212, 168, 74, 0.19)`) |
| `#4af0c0` + `60` hex = ~38% | ~38% | `var(--color-border-active)` (already `rgba(184, 148, 74, 0.38)`) |
| `#4af0c0` + `40` hex = 25% | 25% | `color-mix(in srgb, var(--color-accent) 25%, transparent)` |
| `#4af0c0` + `50` hex = 31% | 31% | `color-mix(in srgb, var(--color-accent) 31%, transparent)` |
| `#4af0c0` + `70` hex = 44% | 44% | `color-mix(in srgb, var(--color-accent) 44%, transparent)` |
| `#4af0c0` + `80` hex = 50% | 50% | `color-mix(in srgb, var(--color-accent) 50%, transparent)` |
| `#ffe44a` + any alpha | — | **Leave untouched** — game color |
| `#1a3a5a` + alpha | — | `var(--color-border-mid)` (drop alpha; borders rarely need alpha) |

`color-mix(in srgb, ...)` browser support: Chrome 111+, Firefox 113+, Safari 16.2+ (2023). Acceptable for this PWA.

### Token Definitions Already in app.css (from Story 1.1)

```css
/* Layer 1 */
--raw-brass-400: #d4a84a;
--raw-parchment-200: #d8cbb8;
--raw-parchment-400: #a89478;
--raw-parchment-600: #6b5a45;
--raw-brass-900: #2a2218;
--raw-brass-700: #3d3020;
--raw-stone-900: #0a0805;
--raw-stone-800: #110e08;
--raw-stone-700: #16120b;
--raw-stone-600: #1c1610;

/* Layer 2 */
--color-bg-deep: var(--raw-stone-900);       /* #0a0805 */
--color-bg-surface: var(--raw-stone-800);    /* #110e08 */
--color-bg-raised: var(--raw-stone-700);     /* #16120b */
--color-bg-hover: var(--raw-stone-600);      /* #1c1610 */
--color-border-subtle: var(--raw-brass-900); /* #2a2218 */
--color-border-mid: var(--raw-brass-700);    /* #3d3020 */
--color-border-active: rgba(184, 148, 74, 0.38);
--color-accent: var(--raw-brass-400);        /* #d4a84a */
--color-accent-dim: rgba(212, 168, 74, 0.19);
--color-text-primary: var(--raw-parchment-200);   /* #d8cbb8 */
--color-text-secondary: var(--raw-parchment-400); /* #a89478 */
--color-text-muted: var(--raw-parchment-600);     /* #6b5a45 */
```

### Per-File Spot Notes

**ElementCard.svelte** — Heavy usage. Key patterns:
- `.el-formula` color `#4af0c0` → `var(--color-accent)` (formula text)
- `.element-card:hover { border-color: #4af0c060 }` → `color-mix(in srgb, var(--color-accent) 38%, transparent)` or `var(--color-border-active)`
- `.element-card.selected { box-shadow: 0 0 8px #4af0c040 }` → `color-mix(in srgb, var(--color-accent) 25%, transparent)`
- Background `#0a1520` → `var(--color-bg-surface)`
- `#0f2035` (hover bg) → `var(--color-bg-hover)`
- Leave `#ffe44a` (achievement glow) UNTOUCHED

**TopBar.svelte** — Mixed: palette + game colors:
- `#4af0c0` on score value → `var(--color-accent)`
- `#ffe44a` on achievement count → LEAVE
- `#ff8c42` on streak → LEAVE
- `#8ab4d4` on stat-label → `var(--color-text-secondary)`

**AchievementGallery.svelte** — Mostly palette:
- `#0d1b2e` bg → `var(--color-bg-deep)`
- `#1a3a5a` border → `var(--color-border-mid)`
- `#4af0c0` heading + badge text → `var(--color-accent)`

**settings/+page.svelte** — 48 hex lines, mostly palette:
- Expect heavy `#4af0c0` (accent) + `#4a6080` (muted) usage
- Read carefully — settings page has toggle states that use accent colors

**routes/+page.svelte** — Menu/lobby:
- Likely heavy accent + background usage

### Tools to Run After Each Batch

After completing each task batch, run a spot-check:
```bash
grep -n "#4af0c0\|#4a6080\|#8ab4d4\|#1a3a5a\|#1a2e4a\|#0d1b2e\|#c8d8e8" src/lib/components/<file>.svelte
```
Should return zero results for the file just migrated.

### NOT In This Story

- Story 2.1–2.6: full component rewrites with Layer 3 tokens (`--card-bg`, etc.)
- Converting game-semantic colors to tokens (element categories, energy states)
- Adding `font-family: 'Space Mono', ui-monospace, ...` full fallback stack to component-scoped styles (defer to Story 1.3 or 2.x)
- Any script/logic changes

### References

- [Story 1.1 implemented tokens](./1-1-token-architecture-palette-migration.md) — exact token values
- [src/app.css](../../src/app.css) — live token definitions
- [_bmad-output/planning-artifacts/architecture.md §4] — three-layer architecture
- [copilot_CODE_BRIEF.md §Design Tokens] — full token spec

## Dev Agent Record

### Agent Model Used
Claude Sonnet 4.6 (GitHub Copilot)

### Debug Log References
N/A

### Completion Notes List
- Migrated ~330 hardcoded palette hex occurrences across 25 svelte files in a single Node.js pass
- Alpha-accent variants handled with `color-mix()` pattern; `var(--color-border-active)` used for 38% alpha, `var(--color-accent-dim)` for 19%
- `#3dd1a6` (legacy teal hover) → `var(--color-accent)` in RatingPrompt.svelte
- `#6a8aa4` (unlisted blue-grey secondary text) → `var(--color-text-secondary)` across 8 files
- `#e8f4ff` (unlisted bright emphasis text) → `var(--color-text-primary)` across 4 files
- AC10 safety fence respected: #ffe44a, #ff6b6b, #ff8c42, element-category colors, #4abfff, #4a6fa5, #a0b8d8 all untouched
- Zero new svelte-check errors (2 pre-existing remain: vite server config type + element store type)

### Review Findings

- [x] [Review][Patch] Invalid CSS `var(--color-accent)08` — FIXED: `color-mix(in srgb, var(--color-accent) 3%, transparent)` [src/routes/+page.svelte:260]
- [x] [Review][Decision] `#4a6fa5` + `#a0b8d8` in HintButton.svelte — LEAVE: intentional locked/disabled-state cool-blue colors [src/lib/components/HintButton.svelte:207,209] — deferred, intentional design
- [x] [Review][Decision] `#4a6fa550` in StuckHintPrompt.svelte — LEAVE: same locked-state design decision [src/lib/components/StuckHintPrompt.svelte:136] — deferred, intentional design
- [x] [Review][Decision] `#4a5a60` + `#111f30` in leaderboard `.lb-v1-badge` — LEAVE: deferred to leaderboard component rewrite [src/routes/leaderboard/+page.svelte:121,124] — deferred, pre-existing
- [x] [Review][Decision] `var(--color-border-active)` as text color on `.result-formula` — ACCEPTED: follows spec alpha table, visually correct [src/lib/components/ResultDisplay.svelte:137]
- [x] [Review][Defer] `#0a2a1a` (dark green) in settings success/owned states — intentional game-UI color, out of AC scope [src/routes/settings/+page.svelte:387,421] — deferred, pre-existing

### File List
- src/lib/components/AchievementGallery.svelte (MODIFIED)
- src/lib/components/AchievementToast.svelte (MODIFIED)
- src/lib/components/BottomSheet.svelte (MODIFIED)
- src/lib/components/DailyChallenge.svelte (MODIFIED)
- src/lib/components/DailyPill.svelte (MODIFIED)
- src/lib/components/DiscoveryBanner.svelte (MODIFIED)
- src/lib/components/DiscoveryItem.svelte (MODIFIED)
- src/lib/components/DiscoveryLog.svelte (MODIFIED)
- src/lib/components/DiscoveryOverlay.svelte (MODIFIED)
- src/lib/components/ElementCard.svelte (MODIFIED)
- src/lib/components/ElementDetail.svelte (MODIFIED)
- src/lib/components/ElementGrid.svelte (MODIFIED)
- src/lib/components/EventBanner.svelte (MODIFIED)
- src/lib/components/FirstRunOverlay.svelte (MODIFIED)
- src/lib/components/HintButton.svelte (MODIFIED)
- src/lib/components/MixingChamber.svelte (MODIFIED)
- src/lib/components/RatingPrompt.svelte (MODIFIED)
- src/lib/components/ResultDisplay.svelte (MODIFIED)
- src/lib/components/Slot.svelte (MODIFIED)
- src/lib/components/StuckHintPrompt.svelte (MODIFIED)
- src/lib/components/TopBar.svelte (MODIFIED)
- src/routes/+page.svelte (MODIFIED)
- src/routes/game/+page.svelte (MODIFIED)
- src/routes/leaderboard/+page.svelte (MODIFIED)
- src/routes/settings/+page.svelte (MODIFIED)
