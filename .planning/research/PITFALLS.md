# Pitfalls Research: Alchemica v2 — Achievement System Retrofit

**Mode:** Pitfalls (integration-focused)
**Confidence:** HIGH

---

## Critical (data loss or permanent broken state)

### C1: localStorage Key Collision During Schema Bump

`loadSave()` in `game.ts` line 22: `if (parsed.version !== SAVE_VERSION) return null`

Bumping `SAVE_VERSION` to 2 drops every existing v1 save. All player progress resets to 4 basic elements.

**Fix:** Keep `SAVE_KEY = 'alchemica_v1'` unchanged. Replace equality check with migration ladder:
```ts
if (parsed.version === 1) {
  return { ...parsed.data, earnedAchievements: [] };
}
// unknown future version only:
return null;
```

**Test:** Seed v1 save in DevTools, load game, confirm elements survive.

---

### C2: iOS AudioContext Always Suspended Outside User-Gesture

iOS WebKit requires `AudioContext` state transition to originate directly from a tap/click handler. `store.subscribe`, `onMount`, and `$effect` do not qualify. Chime permanently silent on iOS if created from reactive context.

**Fix:** Lazy AudioContext created and resumed inside `onclick` call stack:
```ts
let ctx: AudioContext | null = null;
export function playChime(muted: boolean): void {
  if (muted) return;
  try {
    if (!ctx) ctx = new AudioContext();
    const resume = ctx.state === 'suspended' ? ctx.resume() : Promise.resolve();
    resume.then(() => { /* oscillator burst */ });
  } catch { /* fail silently */ }
}
```

`playChime()` must be called from `doReaction()` in `MixingChamber.svelte` (inside `onclick`), not from a store subscriber.

**Test:** Real iOS device (not Simulator). Chime must play on first tap after fresh load.

---

### C3: Re-Awarding Achievements on Save Import

`importSave()` calls `setUnlocked(keys)` → store subscribe fires → achievement engine sees all threshold crossings as new → 3 simultaneous chimes + toasts for previously-earned badges.

**Fix:**
1. Include `earnedAchievements` in save schema — `importSave()` restores them from file, not re-derived
2. `evaluateAchievements(silent = false)` — pass `silent = true` from `loadSave()` and `importSave()`; only show toasts during live play

---

## Moderate (UX degradation or subtle bugs)

### M1: Achievement Engine Firing on No-Op Store Updates

`reactions.ts` line 60 clones the Set even for known-element reactions. A subscribe-based engine fires on every reaction. Mandatory guard:
```ts
if (size >= a.threshold && !earned.has(a.id)) { ... }
```

### M2: Z-Index Collision with OfflineIndicator

`OfflineIndicator.svelte` uses `z-index: 9999` at `bottom: 80px`. Toast at same position overlaps it.

**Fix:** CSS z-index scale in `app.css`, toast at `top: 72px` (below TopBar):
```css
:root {
  --z-bottom-sheet: 200;
  --z-settings-panel: 400;
  --z-offline-toast: 500;
  --z-achievement-toast: 600;
}
```

### M3: Achievement Gallery as Route Breaks PWA Back-Navigation

iOS PWA standalone: swipe-back navigates history. `/achievements` route pushes history entry → swipe exits to previous website.

**Fix:** Modal overlay (`$state galleryOpen`), same as SettingsPanel pattern. No routing needed.

### M4: earnedAchievements Not Cleared on resetGame()

`resetGame()` must explicitly reset the achievements store:
```ts
earnedAchievements.set(new Set()); // required
```
Store inside main save key so `localStorage.removeItem(SAVE_KEY)` clears it atomically.

---

## Minor

### Min1: BottomBar Discovery Count Becomes Redundant
`BottomBar` center stat `{$discoveries.length} discovered` duplicates the TopBar counter. Replace it with the Achievements nav button rather than adding alongside it.

### Min2: Toast setTimeout Not Cleared on Unmount
```ts
$effect(() => {
  if (!toastVisible) return;
  const timer = setTimeout(() => { toastVisible = false; }, 2500);
  return () => clearTimeout(timer);
});
```

### Min3: Oscillator Nodes Leak if Not Disconnected
```ts
osc.onended = () => { osc.disconnect(); gain.disconnect(); };
```

### Min4: `Set<string>` Serializes to `{}` in JSON
`JSON.stringify(new Set(['x']))` → `'{}'`. Must spread to array in saveToStorage:
```ts
earnedAchievements: [...get(earnedAchievements)],
// and on load:
earnedAchievements: new Set(data.earnedAchievements ?? [])
```

---

## Phase Warning Map

| Phase Topic | Pitfall | Action |
|-------------|---------|--------|
| Save schema bump | C1: v1 saves reset | Migration ladder; keep key `alchemica_v1` |
| Achievement engine | M1: no-op fires; Min4: Set serialization | `!alreadyEarned.has(id)` guard; spread to array |
| Save import | C3: re-award on import | earnedAchievements in schema; silent=true flag |
| Chime | C2: iOS AudioContext | Lazy ctx; create+resume in onclick call stack |
| Toast component | M2: z-index conflict | CSS z-index scale; top: 72px placement |
| Gallery entry | M3: route breaks PWA back-nav | Modal overlay, not route |
| resetGame() | M4: achievements survive reset | Explicit reset in resetGame() |
