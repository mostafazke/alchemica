---
phase: 19
plan: P04
title: "Token Migration — Batch B (Medium Complexity)"
wave: 2
depends_on: [P01, P02]
requirements: [TOKEN-02, A11Y-01]
files_modified:
  - src/lib/components/ElementDetail.svelte
  - src/lib/components/MixingChamber.svelte
  - src/lib/components/Slot.svelte
  - src/lib/components/ElementGrid.svelte
  - src/lib/components/DailyChallenge.svelte
  - src/lib/components/BottomBar.svelte
autonomous: true
estimated_tasks: 2
must_haves:
  truths:
    - "Zero replaceable hardcoded hex values in style blocks of these 6 components (MixingChamber gradient stops stay inline)"
    - "All font-size values ≥11px in these components (9 violations fixed)"
    - "All replacements use exact var(--token) references from the token set"
  artifacts:
    - path: "src/lib/components/ElementDetail.svelte"
      provides: "Tokenized styles (13 replaced, 2 font-size fixes)"
    - path: "src/lib/components/MixingChamber.svelte"
      provides: "Tokenized styles (5 replaced, 5 gradient inline, 1 font-size fix)"
    - path: "src/lib/components/Slot.svelte"
      provides: "Tokenized styles (9 replaced, 1 font-size fix)"
    - path: "src/lib/components/ElementGrid.svelte"
      provides: "Tokenized styles (9 replaced)"
    - path: "src/lib/components/DailyChallenge.svelte"
      provides: "Tokenized styles (9 replaced, 3 font-size fixes)"
    - path: "src/lib/components/BottomBar.svelte"
      provides: "Tokenized styles (8 replaced, 2 font-size fixes)"
---

# Plan P04: Token Migration — Batch B (Medium Complexity)

## Objective
Migrate all hardcoded hex color values and fix font-size violations in 6 medium-complexity components. Uses the same token mapping as P03.

## Hex → Token Mapping Reference

Same mapping table as P03:

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
| `#6cc87a` | `var(--color-success)` |

**Font-size fix:** Every `font-size: 9px` and `font-size: 10px` → `font-size: var(--text-micro)`

**Inline exceptions (do NOT replace):**
- MixingChamber: gradient stops `#1a4a3a`, `#2a6a5a`, `#1f4038` (react button gradient — component-specific)

## Tasks

<task id="1">
<title>Token migration: ElementDetail + MixingChamber + Slot</title>
<read_first>
- src/lib/components/ElementDetail.svelte (full file — focus on &lt;style&gt; block, ~13 hex values; P02 already changed close button to 44px)
- src/lib/components/MixingChamber.svelte (full file — focus on &lt;style&gt; block, ~10 hex values, 5 gradient stops stay inline)
- src/lib/components/Slot.svelte (full file — focus on &lt;style&gt; block, ~9 hex values; P02 already changed clear button to 44px)
</read_first>
<action>
For each of the 3 components, open the file and in the `<style>` block:

1. Replace every hardcoded hex value with its corresponding `var(--token)` per the mapping table
2. Replace every `font-size: 9px` and `font-size: 10px` with `font-size: var(--text-micro)`
3. Leave MixingChamber gradient stops inline

**ElementDetail.svelte** specific font-size fixes:
- `.detail-category` (line ~92): `10px` → `var(--text-micro)`
- `.detail-recipe-label` (line ~108): `10px` → `var(--text-micro)`

**MixingChamber.svelte** specific:
- `.combo-badge` (line ~132): `10px` → `var(--text-micro)`
- Keep gradient stops inline: `#1a4a3a`, `#2a6a5a`, `#1f4038` and any gradient-related hex

**Slot.svelte** specific:
- `.slot-name` (line ~55): `9px` → `var(--text-micro)`
</action>
<acceptance_criteria>
- `grep -c "font-size: 9px\|font-size: 10px" src/lib/components/ElementDetail.svelte` returns 0
- `grep -c "font-size: 9px\|font-size: 10px" src/lib/components/MixingChamber.svelte` returns 0
- `grep -c "font-size: 9px\|font-size: 10px" src/lib/components/Slot.svelte` returns 0
- `grep -c "var(--color-" src/lib/components/ElementDetail.svelte` returns at least 6
- `grep -c "var(--color-" src/lib/components/MixingChamber.svelte` returns at least 3
- `grep -c "var(--color-" src/lib/components/Slot.svelte` returns at least 4
- `grep -c "var(--text-micro)" src/lib/components/ElementDetail.svelte` returns at least 2
- MixingChamber still has `#1a4a3a` or `#2a6a5a` (gradient inline exceptions)
</acceptance_criteria>
</task>

<task id="2">
<title>Token migration: ElementGrid + DailyChallenge + BottomBar</title>
<read_first>
- src/lib/components/ElementGrid.svelte (full file — focus on &lt;style&gt; block, ~9 hex values)
- src/lib/components/DailyChallenge.svelte (full file — focus on &lt;style&gt; block, ~9 hex values)
- src/lib/components/BottomBar.svelte (full file — focus on &lt;style&gt; block, ~8 hex values)
</read_first>
<action>
For each of the 3 components, open the file and in the `<style>` block:

1. Replace every hardcoded hex value with its corresponding `var(--token)` per the mapping table
2. Replace every `font-size: 9px` and `font-size: 10px` with `font-size: var(--text-micro)`

**ElementGrid.svelte** specific:
- Note: `.empty-grid` may have `#2a3550` — replace with `var(--color-text-muted)` (A11Y-02 adjacent fix)
- No font-size violations in ElementGrid

**DailyChallenge.svelte** specific font-size fixes:
- `.dc-label` (line ~77): `9px` → `var(--text-micro)`
- `.dc-info` (line ~123): `10px` → `var(--text-micro)`
- `.dc-streak` (line ~129): `9px` → `var(--text-micro)`

**BottomBar.svelte** specific font-size fixes:
- `.bar-btn-label` (line ~80): `10px` → `var(--text-micro)`
- `.bar-badge` (line ~90): `9px` → `var(--text-micro)`
</action>
<acceptance_criteria>
- `grep -c "font-size: 9px\|font-size: 10px" src/lib/components/ElementGrid.svelte` returns 0
- `grep -c "font-size: 9px\|font-size: 10px" src/lib/components/DailyChallenge.svelte` returns 0
- `grep -c "font-size: 9px\|font-size: 10px" src/lib/components/BottomBar.svelte` returns 0
- `grep -c "var(--color-" src/lib/components/ElementGrid.svelte` returns at least 4
- `grep -c "var(--color-" src/lib/components/DailyChallenge.svelte` returns at least 4
- `grep -c "var(--color-" src/lib/components/BottomBar.svelte` returns at least 4
- `grep -c "var(--text-micro)" src/lib/components/DailyChallenge.svelte` returns at least 3
- `grep -c "var(--text-micro)" src/lib/components/BottomBar.svelte` returns at least 2
- `grep -c "#2a3550" src/lib/components/ElementGrid.svelte` returns 0
</acceptance_criteria>
</task>

## Verification
```bash
# No font-size below 11px in any Batch B component
for f in ElementDetail MixingChamber Slot ElementGrid DailyChallenge BottomBar; do
  echo "=== $f ===" && grep -n "font-size: [0-9]px\|font-size: 10px" "src/lib/components/$f.svelte" || echo "PASS"
done

# Token adoption
for f in ElementDetail MixingChamber Slot ElementGrid DailyChallenge BottomBar; do
  echo "=== $f: $(grep -c 'var(--color-' "src/lib/components/$f.svelte") token refs ==="
done

# Build
npm run build
```
