# Story 2.4: ShelfGrid + FilterTabs Components

Status: done

## Story

As a player,
I want to browse and filter my elements in a responsive grid with category tabs,
So that I can find elements quickly as my collection grows.

## Acceptance Criteria

1. **Given** `ElementGrid.svelte` exists and must NOT be deleted
   **When** I create `src/lib/components/ShelfGrid.svelte` alongside it
   **Then** it is a new standalone file — `ElementGrid.svelte` is not modified or deleted

2. **Given** the grid layout spec
   **When** `ShelfGrid` renders unlocked elements
   **Then** it uses CSS Grid: `repeat(auto-fill, minmax(56px, 1fr))` with `4px` gap
   **And** it scrolls vertically within the shelf panel (overflow-y: auto)
   **And** it renders `ElementCard` instances for each element in the active filter

3. **Given** `FilterTabs.svelte` doesn't exist yet
   **When** I create `src/lib/components/FilterTabs.svelte` as a child of ShelfGrid
   **Then** "All" tab is always first and always present
   **And** category tabs appear only when ≥1 element in that category is discovered
   **And** each tab shows a count badge of discovered elements in that category
   **And** tabs are minimum 44px height (NFR1 touch target)
   **And** `role="tablist"` on the container with `role="tab"` on each tab, `aria-selected` on the active one

4. **Given** the filter interaction
   **When** a tab is selected
   **Then** filtering is instant — the visible element set changes immediately
   **And** the grid applies an opacity crossfade (150ms, CSS transition) on filter change
   **And** active tab uses `transition: background-color 100ms, color 100ms` (per architecture.md §CSS Transitions)

5. **Given** the `hasMore` visual state (from ElementCard Story 2.1)
   **When** ShelfGrid renders cards
   **Then** it passes `hasMore={hasMoreSet.has(key)}` to each `ElementCard`
   **And** `hasMoreSet` is derived with the same logic as `ElementGrid.svelte` (reactions that can produce undiscovered elements)

## Tasks / Subtasks

- [x] Task 1: Create FilterTabs.svelte (AC: 3, 4)
  - [x] 1.1: Create `src/lib/components/FilterTabs.svelte`
  - [x] 1.2: Props: `let { activeFilter = 'all', onFilterChange }: { activeFilter?: string; onFilterChange: (cat: string) => void } = $props()`
  - [x] 1.3: Receive `tabs: Array<{ cat: string; label: string; count: number }>` prop — ShelfGrid derives the tab list and passes it in
  - [x] 1.4: Render `role="tablist"` container with `role="tab"` buttons, `aria-selected={activeFilter === tab.cat}`
  - [x] 1.5: Each tab: label text + count badge span. Min-height 44px.
  - [x] 1.6: Active tab: `background-color` + `color` 100ms transition
  - [x] 1.7: Layer 3 tokens: `--tab-bg-active`, `--tab-color-active`, `--tab-bg-idle`, `--tab-color-idle`

- [x] Task 2: Create ShelfGrid.svelte (AC: 1, 2, 5)
  - [x] 2.1: Create `src/lib/components/ShelfGrid.svelte`
  - [x] 2.2: Import: `unlockedElements` from `../stores/game.js`, `ELEMENTS` from `../data/elements.js`, `REACTIONS` from `../data/reactions.js`, `ElementCard` from `./ElementCard.svelte`, `FilterTabs` from `./FilterTabs.svelte`
  - [x] 2.3: Derive `hasMoreSet` — identical logic to `ElementGrid.svelte` (reactive set of keys that can produce ≥1 undiscovered element)
  - [x] 2.4: Derive `tabs` — "All" first (count = total unlocked), then one entry per discovered category (count = elements in that category), sorted by `CATEGORY_ORDER`
  - [x] 2.5: State: `let activeFilter = $state('all')` — `'all'` or a category string
  - [x] 2.6: Derive `visibleKeys` — when `activeFilter === 'all'` return all unlocked keys, else filter by category; sort alphabetically by name
  - [x] 2.7: CSS Grid: `repeat(auto-fill, minmax(56px, 1fr))`, gap `4px`, padding `6px`
  - [x] 2.8: Vertical scroll: outer container `overflow: hidden`, inner `.grid-scroll` `overflow-y: auto; -webkit-overflow-scrolling: touch`
  - [x] 2.9: Opacity crossfade on filter change: `{#key activeFilter}` block wrapping the grid with `animation: fade-in 150ms`
  - [x] 2.10: Empty state: short message when `$unlockedElements.size === 0`
  - [x] 2.11: Pass `hasMore={hasMoreSet.has(key)}` to each `ElementCard`
  - [x] 2.12: Layer 3 tokens: `--shelf-bg`, `--shelf-border`

- [x] Task 3: Verify (AC: all)
  - [x] 3.1: `npx svelte-check --threshold error` — zero new errors (2 pre-existing unchanged)
  - [x] 3.2: Confirm `ElementGrid.svelte` is untouched
  - [x] 3.3: Confirm both new files are NOT imported in any route yet (parallel creation AR1)

## Dev Notes

### Critical Constraints

- **`ElementGrid.svelte` MUST NOT be touched.** ShelfGrid and FilterTabs are created alongside it. The route switch from ElementGrid → ShelfGrid happens in Story 3.x (integration).
- **Parallel creation strategy (AR1):** ShelfGrid.svelte will not be imported anywhere until visual QA passes.
- **Svelte 5 runes:** `$state`, `$derived`, `$derived.by`, `$props`. No Options API.
- **`hasMore` logic must be preserved.** This drives the ElementCard `power` visual state. Copy the derived logic verbatim from `ElementGrid.svelte:27-39`.

### Existing ElementGrid.svelte — Key Reference Points

| Feature | ElementGrid | ShelfGrid |
|---|---|---|
| Layout | Category sections (grouped) | Flat grid + FilterTabs |
| Grid columns | `minmax(76px, 1fr)` | `minmax(56px, 1fr)` (matches ElementCard 56px) |
| Gap | `6px` | `4px` |
| Category filter | None — shows all groups | FilterTabs: `'all'` or single category |
| `hasMore` derivation | ✅ lines 27–39 | Copy verbatim |
| `CATEGORY_ORDER` | `['basic', 'earth', 'water', 'gas', 'compound', 'energy', 'metal', 'space']` | Same |
| `CATEGORY_LABELS` | Record mapping | Same labels |

### FilterTabs Prop Contract

```typescript
// FilterTabs.svelte props
let {
  activeFilter = 'all',
  tabs,
  onFilterChange,
}: {
  activeFilter?: string;
  tabs: Array<{ cat: string; label: string; count: number }>;
  onFilterChange: (cat: string) => void;
} = $props();
```

ShelfGrid derives `tabs` and passes down. FilterTabs is a pure display component.

### Tab List Derivation (ShelfGrid)

```typescript
const CATEGORY_ORDER = ['basic', 'earth', 'water', 'gas', 'compound', 'energy', 'metal', 'space'];
const CATEGORY_LABELS: Record<string, string> = {
  basic: 'Basics', earth: 'Earth', water: 'Water', gas: 'Gas',
  compound: 'Compounds', energy: 'Energy', metal: 'Metals', space: 'Space',
};

const tabs = $derived.by((): Array<{ cat: string; label: string; count: number }> => {
  const byCat: Record<string, number> = {};
  for (const k of $unlockedElements) {
    const cat = ELEMENTS[k]?.category ?? 'basic';
    byCat[cat] = (byCat[cat] ?? 0) + 1;
  }
  const categoryTabs = CATEGORY_ORDER
    .filter(cat => (byCat[cat] ?? 0) > 0)
    .map(cat => ({ cat, label: CATEGORY_LABELS[cat] ?? cat, count: byCat[cat] }));
  return [{ cat: 'all', label: 'All', count: $unlockedElements.size }, ...categoryTabs];
});
```

### Opacity Crossfade on Filter Change

The AC says "opacity crossfade 150ms". The `{#key}` pattern causes an element re-mount which resets animation — but for a simple opacity fade-in, wrap the grid in a div that starts at `opacity: 0` and transitions to `opacity: 1` via CSS. The `{#key activeFilter}` block triggers re-mount of that div:

```svelte
{#key activeFilter}
  <div class="grid-inner">
    {#each visibleKeys as key (key)}
      <ElementCard elementKey={key} mode="grid" hasMore={hasMoreSet.has(key)} />
    {/each}
  </div>
{/key}
```

```css
.grid-inner {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(56px, 1fr));
  gap: 4px;
  padding: 6px;
  animation: fade-in 150ms ease;
}
@keyframes fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
```

### Layer 3 Tokens

ShelfGrid:
```css
.shelf-grid {
  --shelf-bg: var(--color-bg-deep);
  --shelf-border: var(--color-border-subtle);
}
```

FilterTabs:
```css
.filter-tabs {
  --tab-bg-active: var(--color-accent-dim);
  --tab-color-active: var(--color-accent);
  --tab-bg-idle: transparent;
  --tab-color-idle: var(--color-text-muted);
}
```

### ARIA Pattern for FilterTabs

```svelte
<div class="filter-tabs" role="tablist" aria-label="Filter by category">
  {#each tabs as tab (tab.cat)}
    <button
      class="tab-btn"
      class:active={activeFilter === tab.cat}
      role="tab"
      aria-selected={activeFilter === tab.cat}
      onclick={() => onFilterChange(tab.cat)}
    >
      <span class="tab-label">{tab.label}</span>
      <span class="tab-count">{tab.count}</span>
    </button>
  {/each}
</div>
```

Tab container is `display: flex; overflow-x: auto` (horizontal scroll if many categories). Each button: `min-height: 44px; flex-shrink: 0`.

### visibleKeys Derivation

```typescript
const visibleKeys = $derived.by((): string[] => {
  const keys = [...$unlockedElements].filter(k =>
    activeFilter === 'all' || (ELEMENTS[k]?.category ?? 'basic') === activeFilter
  );
  return keys.sort((a, b) => (ELEMENTS[a]?.name ?? a).localeCompare(ELEMENTS[b]?.name ?? b));
});
```

### Source Files to Read Before Implementing

| File | Why |
|---|---|
| `src/lib/components/ElementGrid.svelte` | Reference — `hasMore` derivation (lines 27–39), `CATEGORY_ORDER`, `groups` derivation, scroll container pattern |
| `src/lib/components/ElementCard.svelte` | Props: `elementKey`, `mode`, `hasMore` — confirm API unchanged from Story 2.1 |
| `src/lib/stores/game.ts` | `unlockedElements` store type |
| `src/lib/data/elements.ts` | `ELEMENTS` record — `category` field |
| `src/lib/data/reactions.ts` | `REACTIONS` record — needed for `hasMoreSet` derivation |
| `src/app.css` | Confirm `--color-accent-dim` token exists |

### Previous Story Learnings

- **Token fallbacks:** Use defined tokens only — `var(--text-body)` not `var(--text-sm, 13px)`. Check `app.css` for the token before writing it.
- **`$state` name conflicts:** Avoid naming `$state` variables or props with the same name as a Svelte rune. If a prop must be named `state`, alias via destructuring.
- **`display: contents`** on wrapper divs keeps always-present divs out of the layout flow when needed.
- **`overflow: hidden` + absolute positioned children:** Use `overflow-x: clip; overflow-y: visible` if child elements animate outside the container bounds.
- **`$state<T>` generics not supported** in svelte-check — use inferred `let x = $state(value)`.

### What Story 3.x Depends On

The integration story will swap `<ElementGrid />` import in `src/routes/game/+page.svelte` for `<ShelfGrid />`. ShelfGrid must be a drop-in with no required props (reads stores directly).

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6 (GitHub Copilot)

### Debug Log References

### Completion Notes List

- **`{#key activeFilter}` + `@keyframes fade-in`:** Used animation instead of transition for the crossfade — `{#key}` causes element re-mount so a CSS `transition` on opacity doesn't fire (no prior state to transition from); `animation: fade-in 150ms ease` works correctly on mount.
- **FilterTabs scrollbar hidden:** `scrollbar-width: none` + `::-webkit-scrollbar { display: none }` applied to allow horizontal scroll of many category tabs without showing a scrollbar on mobile.
- **`$derived.by` return type annotation** on `tabs`: explicit `: Array<{ cat: string; label: string; count: number }>` avoids TS inference issues with the mixed array construction.

### File List

- `src/lib/components/FilterTabs.svelte` — created
- `src/lib/components/ShelfGrid.svelte` — created
