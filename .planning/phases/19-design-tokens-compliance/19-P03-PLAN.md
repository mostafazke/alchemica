---
phase: 19
plan: P03
title: "Token Migration — Batch A (High Complexity)"
wave: 2
depends_on: [P01, P02]
requirements: [TOKEN-02, A11Y-01, A11Y-02]
files_modified:
  - src/lib/components/SettingsPanel.svelte
  - src/lib/components/ElementCard.svelte
  - src/lib/components/AchievementGallery.svelte
  - src/lib/components/ResultDisplay.svelte
  - src/lib/components/HintButton.svelte
  - src/lib/components/TopBar.svelte
autonomous: true
estimated_tasks: 2
must_haves:
  truths:
    - "Zero hardcoded hex values in style blocks of these 6 components (except ElementCard category colors per D-03, TopBar streak-fire colors, HintButton watch-ad colors)"
    - "All font-size values ≥11px in these components (15 violations fixed)"
    - "Low-contrast #2a3550/#2a4060 text replaced with var(--color-text-muted) or var(--color-text-secondary)"
    - "All replacements use exact var(--token) references from the token set"
  artifacts:
    - path: "src/lib/components/SettingsPanel.svelte"
      provides: "Tokenized styles (41→~25 replaced, 2 font-size fixes)"
    - path: "src/lib/components/ElementCard.svelte"
      provides: "Tokenized styles (11 replaced, 16 category colors inline per D-03, 3 font-size fixes)"
    - path: "src/lib/components/AchievementGallery.svelte"
      provides: "Tokenized styles (13 replaced, 3 font-size fixes)"
    - path: "src/lib/components/ResultDisplay.svelte"
      provides: "Tokenized styles (17 replaced, 5 font-size fixes, 2 contrast fixes)"
    - path: "src/lib/components/HintButton.svelte"
      provides: "Tokenized styles (14 replaced, 2 watch-ad inline, 2 font-size fixes)"
    - path: "src/lib/components/TopBar.svelte"
      provides: "Tokenized styles (12 replaced, 4 streak inline)"
---

# Plan P03: Token Migration — Batch A (High Complexity)

## Objective
Migrate all hardcoded hex color values and fix all font-size violations in the 6 highest-complexity components. Uses the token definitions established in P01. Also fixes A11Y-02 contrast issues in ResultDisplay.

## Hex → Token Mapping Reference

Use this mapping for ALL replacements in this plan:

| Hex Value | Token |
|-----------|-------|
| `#080f1a` | `var(--color-bg-deep)` |
| `#0a1520` | `var(--color-bg-surface)` |
| `#0a1628` | `var(--color-bg-surface)` |
| `#0a1a2a` | `var(--color-bg-surface)` |
| `#0d1b2e` | `var(--color-bg-raised)` |
| `#0f2035` | `var(--color-bg-hover)` |
| `#0f3028` | `var(--color-bg-selected)` |
| `#0a2018` | `var(--color-bg-selected)` |
| `#0a2a1a` | `var(--color-bg-selected)` |
| `#1a2e4a` | `var(--color-border-subtle)` |
| `#1a3a5a` | `var(--color-border-mid)` |
| `#4af0c0` | `var(--color-accent)` |
| `#4af0c060` | `var(--color-accent-muted)` |
| `#4af0c040` | `var(--color-accent-dim)` |
| `#c8d8e8` | `var(--color-text-primary)` |
| `#e8e8f0` | `var(--color-text-bright)` |
| `#8ab4d4` | `var(--color-text-secondary)` |
| `#4a6080` | `var(--color-text-muted)` |
| `#e8b84b` | `var(--color-gold)` |
| `#ffe44a` | `var(--color-gold-bright)` |
| `#ff6b6b` | `var(--color-danger)` |
| `#ff6060` | `var(--color-danger)` |
| `#6cc87a` | `var(--color-success)` |
| `#ff6b6b20` | keep inline (one-off alpha) |
| `#ff6b6b40` | keep inline (one-off alpha) |
| `#ff405040` | keep inline (one-off alpha) |
| `#4af0c030` | keep inline (rare alpha) |
| `#4af0c020` | keep inline (rare alpha) |
| `#4af0c080` | keep inline (rare alpha) |

**Contrast fix (A11Y-02):**
| Hex Value | Replacement |
|-----------|-------------|
| `#2a3550` (on idle/instruction text user needs to read) | `var(--color-text-secondary)` |
| `#2a3550` (on hint/placeholder text) | `var(--color-text-muted)` |
| `#2a4060` | `var(--color-text-muted)` |

**Font-size fix (A11Y-01):** Every `font-size: 9px` and `font-size: 10px` → `font-size: var(--text-micro)` (which is 11px).

**Inline exceptions (do NOT replace):**
- ElementCard: 8 category color pairs in `:global(.cat-fire)` through `:global(.cat-compound)` (per D-03)
- TopBar: `#ff8c42`, `#ff8c4260` (streak fire glow — unique effect)
- HintButton: `#4a6fa5`, `#a0b8d8` (watch-ad button — unique styling)

## Tasks

<task id="1">
<title>Token migration: SettingsPanel + ElementCard + AchievementGallery</title>
<read_first>
- src/lib/components/SettingsPanel.svelte (full file — focus on &lt;style&gt; block, ~41 hex values)
- src/lib/components/ElementCard.svelte (full file — focus on &lt;style&gt; block, 27 hex values, 16 are category colors)
- src/lib/components/AchievementGallery.svelte (full file — focus on &lt;style&gt; block, ~13 hex values)
</read_first>
<action>
For each of the 3 components, open the file and in the `<style>` block:

1. Replace every hardcoded hex value with its corresponding `var(--token)` per the mapping table above
2. Replace every `font-size: 9px` and `font-size: 10px` with `font-size: var(--text-micro)`
3. Leave inline exceptions as-is (ElementCard category colors)

**SettingsPanel.svelte** specific font-size fixes:
- `.section-title` (line ~234): `10px` → `var(--text-micro)`
- `.purchase-name` (line ~325): `10px` → `var(--text-micro)`

**ElementCard.svelte** specific font-size fixes:
- `.el-formula` (line ~82): `9px` → `var(--text-micro)`
- `.el-category` (line ~84): `9px` → `var(--text-micro)`
- `.el-grid-name` (line ~100): `9px` → `var(--text-micro)`

**AchievementGallery.svelte** specific font-size fixes:
- `.badge-desc` (line ~121): `10px` → `var(--text-micro)`
- `.badge-progress` (line ~126): `10px` → `var(--text-micro)`
- `.badge-locked-label` (line ~132): `10px` → `var(--text-micro)`

Do NOT touch anything outside `<style>` blocks. Do NOT replace ElementCard category colors (`:global(.cat-fire)` etc).
</action>
<acceptance_criteria>
- `grep -v "^" src/lib/components/SettingsPanel.svelte | grep -oP '#[0-9a-fA-F]{6,8}' | grep -v "1a0a0a\|2a0a0a\|ff6b6b20\|ff6b6b40\|ff405040\|4af0c030\|4af0c020\|4af0c080" | wc -l` returns 0 (no replaceable hex left)
- `grep -c "font-size: 9px\|font-size: 10px" src/lib/components/SettingsPanel.svelte` returns 0
- `grep -c "font-size: 9px\|font-size: 10px" src/lib/components/ElementCard.svelte` returns 0
- `grep -c "font-size: 9px\|font-size: 10px" src/lib/components/AchievementGallery.svelte` returns 0
- `grep -c "var(--text-micro)" src/lib/components/SettingsPanel.svelte` returns at least 2
- `grep -c "var(--text-micro)" src/lib/components/ElementCard.svelte` returns at least 3
- `grep -c "var(--text-micro)" src/lib/components/AchievementGallery.svelte` returns at least 3
- `grep -c "var(--color-" src/lib/components/SettingsPanel.svelte` returns at least 15
- ElementCard still has `:global(.cat-fire)` with its original hex colors
</acceptance_criteria>
</task>

<task id="2">
<title>Token migration: ResultDisplay + HintButton + TopBar (includes A11Y-02 contrast fix)</title>
<read_first>
- src/lib/components/ResultDisplay.svelte (full file — focus on &lt;style&gt; block, ~17 hex values; lines 90-91 have #2a3550 contrast violations)
- src/lib/components/HintButton.svelte (full file — focus on &lt;style&gt; block, ~16 hex values)
- src/lib/components/TopBar.svelte (full file — focus on &lt;style&gt; block, ~16 hex values; note P02 already changed reset-btn to danger color)
</read_first>
<action>
For each of the 3 components, open the file and in the `<style>` block:

1. Replace every hardcoded hex value with its corresponding `var(--token)` per the mapping table
2. Replace every `font-size: 9px` and `font-size: 10px` with `font-size: var(--text-micro)`
3. Leave inline exceptions as-is

**ResultDisplay.svelte** specific fixes:
- `.result-new-badge` (line ~74): `9px` → `var(--text-micro)`
- `.result-desc` (line ~77): `10px` → `var(--text-micro)`
- `.result-formula` (line ~78): `10px` → `var(--text-micro)`
- `.result-share-btn` (line ~83): `10px` → `var(--text-micro)`
- `.result-tip` (line ~90): `10px` → `var(--text-micro)`
- **A11Y-02 contrast fix:** `.result-tip` color `#2a3550` → `var(--color-text-muted)` (hint text)
- **A11Y-02 contrast fix:** `.result-idle` color `#2a3550` → `var(--color-text-secondary)` (instruction text users need to read — use secondary for higher contrast)

**HintButton.svelte** specific fixes:
- `.hint-label` (line ~131): `10px` → `var(--text-micro)`
- `.hint-name` (line ~135): `10px` → `var(--text-micro)`
- Keep `#4a6fa5` and `#a0b8d8` inline (watch-ad button unique colors)

**TopBar.svelte** specific:
- No font-size violations in TopBar
- Keep `#ff8c42` and `#ff8c4260` inline (streak fire glow)
- P02 already changed reset-btn to `#ff6b6b` — replace that with `var(--color-danger)` now
- Replace `#ff6b6b40` in reset-btn border with `var(--color-danger)` is not possible (alpha variant) — keep inline
</action>
<acceptance_criteria>
- `grep -c "font-size: 9px\|font-size: 10px" src/lib/components/ResultDisplay.svelte` returns 0
- `grep -c "font-size: 9px\|font-size: 10px" src/lib/components/HintButton.svelte` returns 0
- `grep -c "#2a3550" src/lib/components/ResultDisplay.svelte` returns 0 (contrast violations fixed)
- `grep "\.result-idle" -A3 src/lib/components/ResultDisplay.svelte | grep -c "var(--color-text-secondary)"` returns 1
- `grep "\.result-tip" -A3 src/lib/components/ResultDisplay.svelte | grep -c "var(--color-text-muted)"` returns 1
- `grep -c "var(--color-" src/lib/components/ResultDisplay.svelte` returns at least 8
- `grep -c "var(--color-" src/lib/components/HintButton.svelte` returns at least 8
- `grep -c "var(--color-" src/lib/components/TopBar.svelte` returns at least 6
- TopBar still has `#ff8c42` (streak fire, inline exception)
- HintButton still has `#4a6fa5` (watch-ad, inline exception)
</acceptance_criteria>
</task>

## Verification
```bash
# No font-size below 11px in any Batch A component
for f in SettingsPanel ElementCard AchievementGallery ResultDisplay HintButton TopBar; do
  echo "=== $f ===" && grep -n "font-size: [0-9]px\|font-size: 10px" "src/lib/components/$f.svelte" || echo "PASS"
done

# No #2a3550 contrast violations
grep -rn "#2a3550" src/lib/components/ResultDisplay.svelte  # should return nothing

# Token adoption — all components use var() references
for f in SettingsPanel ElementCard AchievementGallery ResultDisplay HintButton TopBar; do
  echo "=== $f: $(grep -c 'var(--color-' "src/lib/components/$f.svelte") token refs ==="
done

# Build
npm run build
```
