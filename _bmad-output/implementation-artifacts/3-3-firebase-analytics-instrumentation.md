# Story 3.3: Firebase Analytics Instrumentation

**Epic:** Epic 3 — Engagement Systems
**Status:** done
**Priority:** P1 — data foundation for all future data-driven decisions

---

## User Story

**As a** member of the Alchemica team,
**I want** key player actions tracked in Firebase Analytics,
**so that** we can make data-driven decisions about onboarding, monetization, and content.

---

## Acceptance Criteria

- [ ] `@capacitor-firebase/analytics` and `firebase` packages are installed and confirmed in `package.json`
- [ ] The following 10 events are instrumented (see event table below)
- [ ] All events fire asynchronously (non-blocking — no `await` at call sites)
- [ ] Analytics is disabled when the player has opted out (`analyticsEnabled` setting is `false`)
- [ ] No PII in any event params
- [ ] A `analyticsEnabled` toggle exists in the Settings page (default: `true`)
- [ ] Verified live in Firebase DebugView before shipping

### Event Table

| Event name | Trigger | Key params |
|---|---|---|
| `session_start` | App comes to foreground (layout `onMount`) | `session_number` |
| `element_discovered` | New element unlocked (`applyReaction` in `game/reactions.ts`) | `element_key`, `discovery_number`, `session_number` |
| `daily_challenge_completed` | Daily challenge marked done (`DailyChallenge.svelte`) | `streak_count`, `target_element` |
| `achievement_earned` | Badge awarded (`game/achievements.ts` → `awardAchievement`) | `achievement_id` |
| `hint_requested` | Player taps the hint button (`StuckHintPrompt.svelte`) | `failed_attempts_count` |
| `rewarded_ad_watched` | Rewarded video completes (`effects/admob.ts` `Rewarded` listener) | `placement` (`stuck\|daily\|achievement`) |
| `iap_initiated` | IAP purchase flow started (`effects/iap.ts` purchase functions) | `product_id` |
| `onboarding_completed` | Player finishes or skips tutorial (`stores/onboarding.ts` `completeOnboarding()`) | `completed` (`true\|false`), `step_reached` |
| `share_triggered` | Player taps share on discovery card (`utils/share.ts`) | `element_key`, `share_type` (`discovery\|daily`) |
| `notification_permission_granted` | Push permission accepted (`effects/notifications.ts` `requestAndSchedule()`) | — |

---

## Codebase Context

### Package status

Both packages are already declared in `package.json`:
```json
"@capacitor-firebase/analytics": "^8.2.0",
"firebase": "^12.13.0"
```
**No npm install needed** unless `node_modules` is missing them.

### Existing architecture — what NOT to change

| Concern | Current Location | Change? |
|---|---|---|
| Settings store | `src/lib/stores/settings.ts` | **Extend** — add `analyticsEnabled` |
| Settings page | `src/routes/settings/+page.svelte` | **Add** analytics toggle section |
| App layout | `src/routes/+layout.svelte` | **Add** `initAnalytics()` call in `onMount` |
| AdMob effects | `src/lib/effects/admob.ts` | **Add** `logRewardedAdWatched()` call in `Rewarded` listener |
| IAP effects | `src/lib/effects/iap.ts` | **Add** `logIapInitiated()` calls before purchase attempts |
| Notifications | `src/lib/effects/notifications.ts` | **Add** `logNotificationPermissionGranted()` call on `granted` |
| Onboarding store | `src/lib/stores/onboarding.ts` | **Add** `logOnboardingCompleted()` call in `completeOnboarding()` |
| Reactions engine | `src/lib/game/reactions.ts` | **Add** `logElementDiscovered()` call after unlock |
| Achievements engine | `src/lib/game/achievements.ts` | **Add** `logAchievementEarned()` call in `awardAchievement` |
| Hint prompt | `src/lib/components/StuckHintPrompt.svelte` | **Add** `logHintRequested()` on hint button tap |
| Daily challenge | `src/lib/components/DailyChallenge.svelte` | **Add** `logDailyChallengeCompleted()` on completion |
| Share utils | `src/lib/utils/share.ts` | **Add** `logShareTriggered()` calls |
| Analytics module | `src/lib/effects/analytics.ts` | **Create** — all logging logic lives here |

### Session number

Session number must be a simple session counter incremented on every foreground. Store it as a module-level variable in `analytics.ts` (not persisted — resets to 1 on app restart, increments on each `initAnalytics()` call). This avoids any store dependency.

```ts
// Inside analytics.ts
let _sessionNumber = 0;
export function initAnalytics(): void {
  _sessionNumber++;
  logEvent('session_start', { session_number: _sessionNumber });
}
```

### Analytics opt-out guard

Check `analyticsEnabled` using `get()` at the top of every log function. Import `analyticsEnabled` and `get` directly inside `analytics.ts` — this is the single opt-out gate; call sites don't need to check it.

```ts
import { get } from 'svelte/store';
import { analyticsEnabled } from '../stores/settings.js';

function shouldLog(): boolean {
  return get(analyticsEnabled) === true;
}
```

### Existing settings shape

`settings.ts` currently has: `soundMuted`, `hapticsMuted`, `notificationsEnabled`, `notificationsAsked`. The localStorage key is `'alchemica_settings'` and `loadSettings()` reads it. To add `analyticsEnabled`:

1. Add `analyticsEnabled?: boolean` to the parsed type
2. Default to `true` (opt-in by default)
3. Add to `saveSettings()` serialization
4. Export a `analyticsEnabled` writable store

### `@capacitor-firebase/analytics` API

```ts
import { FirebaseAnalytics } from '@capacitor-firebase/analytics';

// All calls are native-only — no-op on web
await FirebaseAnalytics.logEvent({ name: 'event_name', params: { key: 'value' } });
```

Use `Capacitor.isNativePlatform()` guard — all log functions must be no-ops on web/dev.

### Where `applyReaction` lives

```
src/lib/game/reactions.ts → applyReaction()
```

It returns a result and calls `unlockedElements.update()` when a new element is discovered. Add the analytics call after the unlock, passing the element key and the new size of `unlockedElements`.

### Where `awardAchievement` lives

Look for the achievement award logic in `src/lib/game/achievements.ts`. It calls `earnedAchievements.update()`. Add `logAchievementEarned(id)` there.

---

## Implementation Plan

### Files to create

| File | Purpose |
|---|---|
| `src/lib/effects/analytics.ts` | All Firebase Analytics wrappers — single source of truth for all event logging |

### Files to modify

| File | Change |
|---|---|
| `src/lib/stores/settings.ts` | Add `analyticsEnabled` store with default `true`, persist in `saveSettings()` |
| `src/routes/+layout.svelte` | Import and call `initAnalytics()` in `onMount` |
| `src/routes/settings/+page.svelte` | Add Analytics section with opt-out toggle |
| `src/lib/effects/admob.ts` | Call `logRewardedAdWatched('stuck')` in `Rewarded` listener |
| `src/lib/effects/iap.ts` | Call `logIapInitiated(productId)` at start of each purchase function |
| `src/lib/effects/notifications.ts` | Call `logNotificationPermissionGranted()` when `perm.display === 'granted'` |
| `src/lib/stores/onboarding.ts` | Call `logOnboardingCompleted(completed, stepReached)` in `completeOnboarding()` |
| `src/lib/game/reactions.ts` | Call `logElementDiscovered(key, discoveryNumber, sessionNumber)` after unlock |
| `src/lib/game/achievements.ts` | Call `logAchievementEarned(achievementId)` in award logic |
| `src/lib/components/StuckHintPrompt.svelte` | Call `logHintRequested(failedComboCount)` when hint button is tapped |
| `src/lib/components/DailyChallenge.svelte` | Call `logDailyChallengeCompleted(streak, targetElement)` on completion |
| `src/lib/utils/share.ts` | Call `logShareTriggered(elementKey, shareType)` before/after sharing |

---

## Detailed Implementation

### Step 1 — Create `src/lib/effects/analytics.ts`

```ts
/**
 * analytics.ts — Firebase Analytics event wrappers.
 *
 * All functions are no-ops on web (Capacitor.isNativePlatform() guard).
 * All functions are no-ops when the player has opted out (analyticsEnabled store).
 * All calls are fire-and-forget — never awaited at call sites.
 * No PII in any event params.
 */
import { Capacitor } from '@capacitor/core';
import { FirebaseAnalytics } from '@capacitor-firebase/analytics';
import { get } from 'svelte/store';
import { analyticsEnabled } from '../stores/settings.js';

let _sessionNumber = 0;

function shouldLog(): boolean {
  return Capacitor.isNativePlatform() && get(analyticsEnabled) === true;
}

function log(name: string, params?: Record<string, string | number | boolean>): void {
  if (!shouldLog()) return;
  FirebaseAnalytics.logEvent({ name, params }).catch(() => {}); // fire-and-forget
}

/** Call once from +layout.svelte onMount to fire session_start and increment session counter. */
export function initAnalytics(): void {
  _sessionNumber++;
  log('session_start', { session_number: _sessionNumber });
}

/** Returns the current session number (for passing to other log functions). */
export function getSessionNumber(): number {
  return _sessionNumber;
}

export function logElementDiscovered(elementKey: string, discoveryNumber: number): void {
  log('element_discovered', {
    element_key: elementKey,
    discovery_number: discoveryNumber,
    session_number: _sessionNumber,
  });
}

export function logDailyChallengeCompleted(streakCount: number, targetElement: string): void {
  log('daily_challenge_completed', {
    streak_count: streakCount,
    target_element: targetElement,
  });
}

export function logAchievementEarned(achievementId: string): void {
  log('achievement_earned', { achievement_id: achievementId });
}

export function logHintRequested(failedAttemptsCount: number): void {
  log('hint_requested', { failed_attempts_count: failedAttemptsCount });
}

export function logRewardedAdWatched(placement: 'stuck' | 'daily' | 'achievement'): void {
  log('rewarded_ad_watched', { placement });
}

export function logIapInitiated(productId: string): void {
  log('iap_initiated', { product_id: productId });
}

/**
 * @param completed true = finished tutorial; false = skipped
 * @param stepReached last step number the player reached (1, 2, or 3)
 */
export function logOnboardingCompleted(completed: boolean, stepReached: number): void {
  log('onboarding_completed', {
    completed: completed ? 'true' : 'false',
    step_reached: stepReached,
  });
}

export function logShareTriggered(elementKey: string, shareType: 'discovery' | 'daily'): void {
  log('share_triggered', {
    element_key: elementKey,
    share_type: shareType,
  });
}

export function logNotificationPermissionGranted(): void {
  log('notification_permission_granted');
}
```

### Step 2 — Extend `src/lib/stores/settings.ts`

Add `analyticsEnabled` to the existing `loadSettings()` return type, default, and `saveSettings()`:

```ts
// In the parsed type block:
analyticsEnabled?: boolean;

// In the return of loadSettings():
analyticsEnabled: parsed.analyticsEnabled !== false, // default true

// In the initial object (SSR guard):
analyticsEnabled: true,

// New export (alongside soundMuted, hapticsMuted, etc.):
export const analyticsEnabled = writable<boolean>(initial.analyticsEnabled);

// In saveSettings():
analyticsEnabled: get(analyticsEnabled),

// Subscribe:
analyticsEnabled.subscribe(saveSettings);
```

### Step 3 — Update `src/routes/+layout.svelte`

In the `onMount` block, add after `initIAP()`:

```ts
import { initAnalytics } from '$lib/effects/analytics.js';
// ...
initAnalytics(); // fire-and-forget; no-op on web
```

### Step 4 — Add toggle in `src/routes/settings/+page.svelte`

Import `analyticsEnabled` from settings and add a section in the settings body (after Notifications, before IAP):

```svelte
<script>
  import { analyticsEnabled } from '$lib/stores/settings.js';
  // ... (alongside existing imports)
</script>

<!-- In the settings-body div: -->
<section class="settings-section">
  <div class="section-label">Analytics</div>
  <label class="mute-toggle">
    <input
      type="checkbox"
      checked={$analyticsEnabled}
      onchange={(e) => analyticsEnabled.set((e.target as HTMLInputElement).checked)}
    />
    <span class="mute-label">
      {$analyticsEnabled ? '📊 Analytics on — helps us improve the game' : '🚫 Analytics off'}
    </span>
  </label>
</section>
```

### Step 5 — Hook `element_discovered` in `src/lib/game/reactions.ts`

After the `unlockedElements.update()` call that adds a newly discovered element, add:

```ts
import { logElementDiscovered } from '../effects/analytics.js';
import { get } from 'svelte/store';
import { unlockedElements } from '../stores/game.js';
// ...
// After unlock:
logElementDiscovered(resultKey, get(unlockedElements).size);
```

### Step 6 — Hook `achievement_earned` in `src/lib/game/achievements.ts`

After `earnedAchievements.update()` adds a new achievement ID, add:

```ts
import { logAchievementEarned } from '../effects/analytics.js';
// ...
logAchievementEarned(achievementId);
```

### Step 7 — Hook `rewarded_ad_watched` in `src/lib/effects/admob.ts`

In the `RewardAdPluginEvents.Rewarded` listener, add:

```ts
import { logRewardedAdWatched } from './analytics.js';
// ...
AdMob.addListener(RewardAdPluginEvents.Rewarded, () => {
  logRewardedAdWatched('stuck'); // current placement is always 'stuck'
  hintBalance.update((n) => n + 1);
  prepareAd();
});
```

### Step 8 — Hook `iap_initiated` in `src/lib/effects/iap.ts`

At the top of `purchaseRemoveAds()` and `purchaseHintBundle()`, add:

```ts
import { logIapInitiated } from './analytics.js';
// ...
export async function purchaseRemoveAds(): Promise<void> {
  logIapInitiated(PRODUCT_REMOVE_ADS);
  // ... rest of function
}

export async function purchaseHintBundle(): Promise<void> {
  logIapInitiated(PRODUCT_HINTS_10);
  // ... rest of function
}
```

### Step 9 — Hook `notification_permission_granted` in `src/lib/effects/notifications.ts`

In `requestAndSchedule()`, after `perm.display === 'granted'` check:

```ts
import { logNotificationPermissionGranted } from './analytics.js';
// ...
if (perm.display === 'granted') {
  logNotificationPermissionGranted();
  await scheduleStreakNotification(streakN);
  return true;
}
```

### Step 10 — Hook `onboarding_completed` in `src/lib/stores/onboarding.ts`

In `completeOnboarding()`, call the analytics log before resetting the step:

```ts
import { logOnboardingCompleted } from '../effects/analytics.js';
import { get } from 'svelte/store';
// ...
export function completeOnboarding(): void {
  const step = get(onboardingStep);
  const skipped = step !== 3; // true = skipped early; false = reached step 3 naturally
  logOnboardingCompleted(!skipped, skipped ? step : 3);
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(ONBOARD_KEY, '1');
  }
  step2Dismissed.set(false);
  onboardingStep.set(0);
}
```

### Step 11 — Hook `daily_challenge_completed` in `src/lib/components/DailyChallenge.svelte`

After the daily challenge is marked done (where streak is updated), add:

```ts
import { logDailyChallengeCompleted } from '../effects/analytics.js';
// ...
logDailyChallengeCompleted(get(streakCount), targetElementKey);
```

### Step 12 — Hook `hint_requested` in `src/lib/components/StuckHintPrompt.svelte`

When the player opens the hint offer (taps the hint/watch-ad button), add:

```ts
import { logHintRequested } from '../effects/analytics.js';
import { failedComboCount } from '../stores/hintPrompt.js';
import { get } from 'svelte/store';
// ...
logHintRequested(get(failedComboCount));
```

### Step 13 — Hook `share_triggered` in `src/lib/utils/share.ts`

In `shareDiscoveryCard()` (before the share call), add:

```ts
import { logShareTriggered } from '../effects/analytics.js';
// ...
logShareTriggered(elementKey, 'discovery');
// ... existing share logic
```

In the daily challenge share path, add:

```ts
logShareTriggered(elementKey, 'daily');
```

---

## Dev Notes

- **No DebugView setup needed for development** — Firebase DebugView requires ADB flag `adb shell setprop debug.firebase.analytics.app <package-name>`. This is a verification step done manually before shipping, not part of this story's implementation.
- **`placement` in `rewarded_ad_watched`**: Currently only one placement exists (`stuck`). The enum is forward-compatible with `daily` and `achievement` placements added in future stories.
- **Type safety**: All `params` values are `string | number | boolean` — Firebase Analytics does not accept arrays or objects. Booleans passed as the string `'true'/'false'` for `onboarding_completed.completed` because Firebase string params are more reliably filterable in dashboards than boolean params.
- **`session_number`** is a module-level counter in `analytics.ts`, not a store. It resets to 1 on cold start and increments on each `initAnalytics()` call (i.e., each time the layout mounts / app foregrounds via `onMount`).

---

## Review Findings

- [x] [Review][Patch] `completeOnboarding` logs analytics when `step === 0` — sends misleading `completed: false, step_reached: 1` [src/lib/stores/onboarding.ts] — **fixed**: added early-return guard

---

## Dev Agent Record

### Files Created
- `src/lib/effects/analytics.ts` — all 10 Firebase Analytics wrappers; `initAnalytics()`, `getSessionNumber()`, and 8 domain-specific log functions

### Files Modified
- `src/lib/stores/settings.ts` — added `analyticsEnabled` writable store (default `true`), persisted in `saveSettings()`
- `src/routes/+layout.svelte` — `initAnalytics()` called in `onMount` after `initIAP()`
- `src/routes/settings/+page.svelte` — Analytics section with opt-out checkbox
- `src/lib/game/reactions.ts` — `logElementDiscovered()` hooked after unlock in `applyReaction()`
- `src/lib/game/achievements.ts` — `logAchievementEarned()` hooked after award in `checkAchievements()`
- `src/lib/effects/admob.ts` — `logRewardedAdWatched('stuck')` hooked in `Rewarded` listener
- `src/lib/effects/iap.ts` — `logIapInitiated()` hooked at top of `purchaseRemoveAds()` and `purchaseHintBundle()`
- `src/lib/effects/notifications.ts` — `logNotificationPermissionGranted()` hooked when `perm.display === 'granted'`
- `src/lib/stores/onboarding.ts` — `logOnboardingCompleted()` hooked in `completeOnboarding()` with step-based completion detection
- `src/lib/components/DailyChallenge.svelte` — `logDailyChallengeCompleted()` hooked in `$effect` on `completed && !prevCompleted` transition
- `src/lib/components/StuckHintPrompt.svelte` — `logHintRequested()` hooked at start of `watchAd()`
- `src/lib/utils/share.ts` — `logShareTriggered()` hooked in `shareDiscoveryCard()` and `shareDailyCard()`

### Completion Notes
- All 10 events from the Event Table are instrumented
- All events are fire-and-forget (no awaiting at call sites)
- `shouldLog()` gate: native-platform AND `analyticsEnabled === true` — no-op on web or when opted out
- No PII in any event params
- `analyticsEnabled` toggle added to Settings page with default `true`
- `tsc --noEmit` passes (only pre-existing `vite.config.ts` error unrelated to this story)
- All 20 existing unit tests pass
- Firebase DebugView verification is a manual pre-ship step (requires ADB flag; not part of CI)
