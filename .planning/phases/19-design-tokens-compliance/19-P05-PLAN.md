---
phase: 19
plan: P05
title: "Token Migration — Batch C (Low Complexity + Routes)"
wave: 2
depends_on: [P01, P02]
requirements: [TOKEN-02, A11Y-01, A11Y-02]
files_modified:
  - src/lib/components/DiscoveryItem.svelte
  - src/lib/components/DiscoveryLog.svelte
  - src/lib/components/BottomSheet.svelte
  - src/lib/components/OfflineIndicator.svelte
  - src/lib/components/AchievementToast.svelte
  - src/routes/+page.svelte
  - src/routes/game/+page.svelte
autonomous: true
estimated_tasks: 2
must_haves:
  truths:
    - "Zero replaceable hardcoded hex values in style blocks of these 7 files (menu page gold colors stay inline)"
    - "All font-size values ≥11px in these components (5 violations fixed)"
    - "Low-contrast #2a3550/#2a4060 text in DiscoveryLog and DiscoveryItem replaced with var(--color-text-muted)"
    - "All replacements use exact var(--token) references from the token set"
  artifacts:
    - path: "src/lib/components/DiscoveryItem.svelte"
      provides: "Tokenized styles (7 replaced, 2 font-size fixes, 1 contrast fix)"
    - path: "src/lib/components/DiscoveryLog.svelte"
      provides: "Tokenized styles (6 replaced, 2 font-size fixes, 1 contrast fix)"
    - path: "src/lib/components/BottomSheet.svelte"
      provides: "Tokenized styles (3 replaced; P02 already removed desktop media query)"
    - path: "src/lib/components/OfflineIndicator.svelte"
      provides: "Tokenized styles (2 replaced)"
    - path: "src/lib/components/AchievementToast.svelte"
      provides: "Tokenized styles (2 replaced, 1 font-size fix)"
    - path: "src/routes/+page.svelte"
      provides: "Tokenized menu page styles (5 replaced, 5 menu gold inline)"
    - path: "src/routes/game/+page.svelte"
      provides: "Tokenized game page styles (1 replaced)"
---

# Plan P05: Token Migration — Batch C (Low Complexity + Routes)

## Objective
Migrate all hardcoded hex color values and fix font-size violations in the 5 remaining components plus 2 route pages. Also fixes remaining A11Y-02 contrast issues in DiscoveryLog, DiscoveryItem.

## Hex → Token Mapping Reference

Same mapping table as P03/P04:

| Hex Value | Token |
|-----------|-------|
| `#080f1a` | `var(--color-bg-deep)` |
| `#0a1520` | `var(--color-bg-surface)` |
| `#0a1628` | `var(--color-bg-surface)` |
| `#0a1a2a` | `var(--color-bg-surface)` |
| `#0d1b2e` | `var(--color-bg-raised)` |
| `#0f2035` | `var(--color-bg-hover)` |
| `#0f3028` | `var(--color-bg-selected)` |
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

**Contrast fix (A11Y-02):**
- `#2a3550` → `var(--color-text-muted)` (placeholder/hint text)
- `#2a4060` → `var(--color-text-muted)` (also low contrast)

**Font-size fix:** Every `font-size: 9px` and `font-size: 10px` → `font-size: var(--text-micro)`

**Inline exceptions (do NOT replace):**
- +page.svelte (menu): `#c9a84c`, `#d9b85c`, `#b8973b`, `#c9a84c88`, `#c9a84c55` (menu gold — unique to menu page)

## Tasks

<task id="1">
<title>Token migration: DiscoveryItem + DiscoveryLog + BottomSheet (includes A11Y-02)</title>
<read_first>
- src/lib/components/DiscoveryItem.svelte (full file — focus on &lt;style&gt; block, ~7 hex values; P02 already changed share-btn to 44px; line 53 has #2a4060 contrast violation)
- src/lib/components/DiscoveryLog.svelte (full file — focus on &lt;style&gt; block, ~6 hex values; line 39 .empty-disc has #2a3550)
- src/lib/components/BottomSheet.svelte (full file — focus on &lt;style&gt; block, ~3 hex values; P02 already removed desktop media query)
</read_first>
<action>
For each of the 3 components, open the file and in the `<style>` block:

1. Replace every hardcoded hex value with its corresponding `var(--token)` per the mapping table
2. Replace every `font-size: 9px` and `font-size: 10px` with `font-size: var(--text-micro)`

**DiscoveryItem.svelte** specific:
- `.disc-formula` (line ~48): `9px` → `var(--text-micro)`
- `.disc-recipe` (line ~49): `9px` → `var(--text-micro)`
- **A11Y-02:** `.share-btn` color `#2a4060` (line ~53) → `var(--color-text-muted)`

**DiscoveryLog.svelte** specific:
- `.disc-title` (line ~32): `10px` → `var(--text-micro)`
- `.disc-count` (line ~33): `10px` → `var(--text-micro)`
- **A11Y-02:** `.empty-disc` color `#2a3550` (line ~39) → `var(--color-text-muted)`

**BottomSheet.svelte** specific:
- No font-size violations
- Replace remaining hex values with tokens
</action>
<acceptance_criteria>
- `grep -c "font-size: 9px\|font-size: 10px" src/lib/components/DiscoveryItem.svelte` returns 0
- `grep -c "font-size: 9px\|font-size: 10px" src/lib/components/DiscoveryLog.svelte` returns 0
- `grep -c "#2a3550" src/lib/components/DiscoveryLog.svelte` returns 0
- `grep -c "#2a4060" src/lib/components/DiscoveryItem.svelte` returns 0
- `grep -c "var(--color-" src/lib/components/DiscoveryItem.svelte` returns at least 3
- `grep -c "var(--color-" src/lib/components/DiscoveryLog.svelte` returns at least 3
- `grep -c "var(--color-" src/lib/components/BottomSheet.svelte` returns at least 1
- `grep -c "var(--text-micro)" src/lib/components/DiscoveryItem.svelte` returns at least 2
- `grep -c "var(--text-micro)" src/lib/components/DiscoveryLog.svelte` returns at least 2
</acceptance_criteria>
</task>

<task id="2">
<title>Token migration: OfflineIndicator + AchievementToast + route pages</title>
<read_first>
- src/lib/components/OfflineIndicator.svelte (full file — focus on &lt;style&gt; block, ~2 hex values)
- src/lib/components/AchievementToast.svelte (full file — focus on &lt;style&gt; block, ~2 hex values; line 91 .toast-label has 9px)
- src/routes/+page.svelte (full file — focus on &lt;style&gt; block, ~10 hex values, 5 are menu gold inline)
- src/routes/game/+page.svelte (full file — focus on &lt;style&gt; block, ~1 hex value)
</read_first>
<action>
For each of the 4 files, open and in the `<style>` block:

1. Replace every hardcoded hex value with its corresponding `var(--token)` per the mapping table
2. Replace every `font-size: 9px` and `font-size: 10px` with `font-size: var(--text-micro)`
3. Leave menu page gold colors inline

**AchievementToast.svelte** specific:
- `.toast-label` (line ~91): `9px` → `var(--text-micro)`

**+page.svelte (menu)** specific:
- Keep inline: `#c9a84c`, `#d9b85c`, `#b8973b`, `#c9a84c88`, `#c9a84c55` (menu gold)
- Replace other standard hex values (backgrounds, borders, text colors) with tokens

**OfflineIndicator.svelte** and **game/+page.svelte**:
- Replace all hex values with tokens — no exceptions
</action>
<acceptance_criteria>
- `grep -c "font-size: 9px\|font-size: 10px" src/lib/components/AchievementToast.svelte` returns 0
- `grep -c "var(--text-micro)" src/lib/components/AchievementToast.svelte` returns at least 1
- `grep -c "var(--color-" src/lib/components/OfflineIndicator.svelte` returns at least 1
- `grep -c "var(--color-" src/lib/components/AchievementToast.svelte` returns at least 1
- `grep -c "var(--color-" src/routes/+page.svelte` returns at least 3
- Menu page still has `#c9a84c` (gold inline exception)
- `grep -c "font-size: 9px\|font-size: 10px" src/routes/+page.svelte` returns 0
- `grep -c "font-size: 9px\|font-size: 10px" src/routes/game/+page.svelte` returns 0
</acceptance_criteria>
</task>

## Verification
```bash
# No font-size below 11px in any Batch C file
for f in DiscoveryItem DiscoveryLog BottomSheet OfflineIndicator AchievementToast; do
  echo "=== $f ===" && grep -n "font-size: [0-9]px\|font-size: 10px" "src/lib/components/$f.svelte" || echo "PASS"
done
grep -n "font-size: [0-9]px\|font-size: 10px" src/routes/+page.svelte || echo "PASS"
grep -n "font-size: [0-9]px\|font-size: 10px" src/routes/game/+page.svelte || echo "PASS"

# No low-contrast colors remaining
grep -rn "#2a3550\|#2a4060" src/lib/components/ src/routes/  # should return nothing

# Token adoption
for f in DiscoveryItem DiscoveryLog BottomSheet OfflineIndicator AchievementToast; do
  echo "=== $f: $(grep -c 'var(--color-' "src/lib/components/$f.svelte") token refs ==="
done

# Full codebase check: zero hardcoded hex in component styles (except known inline exceptions)
# Run after ALL plans complete:
grep -rn '#[0-9a-fA-F]\{6\}' src/lib/components/ --include="*.svelte" | grep -v "cat-\|ff8c42\|4a6fa5\|a0b8d8\|1a4a3a\|2a6a5a\|1f4038\|1a0a0a\|2a0a0a\|ff6b6b20\|ff6b6b40\|ff405040\|4af0c030\|4af0c020\|4af0c080\|c9a84c\|d9b85c\|b8973b"

# Build
npm run build
```
