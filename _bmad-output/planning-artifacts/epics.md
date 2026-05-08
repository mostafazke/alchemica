---
stepsCompleted: [1, 2]
inputDocuments:
  - _bmad-output/planning-artifacts/research/domain-alchemica-best-practices-research-2026-05-09.md
  - _bmad-output/planning-artifacts/research/domain-casual-puzzle-idle-crafting-mobile-games-research-2026-05-08.md
project_name: Alchemica
date: '2026-05-09'
---

# Alchemica - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Alchemica, decomposing the best-practices research findings into three implementable, independently-shippable epics organized around user value.

**Milestone:** Alchemica Excellence v1 — 90-day roadmap
**Source research:** `domain-alchemica-best-practices-research-2026-05-09.md`

---

## Requirements Inventory

### Functional Requirements

| ID | Requirement | Source |
|---|---|---|
| FR-01 | App Store title/subtitle/keyword metadata optimized for organic search | Research §6.1 |
| FR-02 | 5 new App Store screenshots following best-practice template | Research §6.2 |
| FR-03 | Shareable discovery card (canvas-rendered image) generated on new element discovery | Research §3.2 |
| FR-04 | In-app rating prompt shown after session 5, post-daily-challenge | Research §6.3 |
| FR-05 | Daily local push notification (streak reminder, 8 PM, opt-in) | Research §7.4 |
| FR-06 | 3-step guided first-session onboarding sequence | Research §2.1 |
| FR-07 | Discovery celebration: particle burst + full-width banner on new element discovery | Research §1.1 |
| FR-08 | Hint offer trigger after 3rd consecutive failed combination (rewarded video) | Research §4.2 |
| FR-09 | "Element of the Week" event banner in main UI | Research §3.3 |
| FR-10 | Element category grouping in shelf view with per-category completion indicators | Research §1.2, §2.2 |
| FR-11 | Weekly discovery leaderboard (anonymous, local device sort) | Research §3.3 |
| FR-12 | Firebase Analytics instrumentation (10 core events) | Research §7.5 |
| FR-13 | Space Science element pack (+50 elements, astronomy/physics theme) | Research §5.1 |

### Non-Functional Requirements

| ID | Requirement | Source |
|---|---|---|
| NFR-01 | Discovery celebration animation ≤ 500ms total duration; 60fps on iOS, 30fps+ on Android | Research §7.2 |
| NFR-02 | Shareable card renders within 300ms of trigger | Research §3.2 |
| NFR-03 | Push notification permission request: show only after first daily challenge completion | Research §7.4 |
| NFR-04 | Rating prompt: never shown more than once per 365 days; pre-screened with "Enjoying Alchemica?" gate | Research §6.3 |
| NFR-05 | All new element recipes pass CVEA quality check (Combinable, Verifiable, Evocative, Anchored) | Research §5.2 |
| NFR-06 | New analytics events must not block main thread; fire asynchronously | Research §7.5 |

### FR Coverage Map

| Epic | FRs Covered |
|---|---|
| Epic 1: Discovery & Growth | FR-01, FR-02, FR-03, FR-04, FR-05 |
| Epic 2: Experience Depth | FR-06, FR-07, FR-08, FR-09 |
| Epic 3: Engagement Systems | FR-10, FR-11, FR-12, FR-13 |

---

## Epic List

1. **Epic 1: Discovery & Growth** — Maximize organic discoverability and install-to-retain conversion
2. **Epic 2: Experience Depth** — Make the first 60 seconds irresistible and every session feel rewarding
3. **Epic 3: Engagement Systems** — Build the long-term retention scaffolding that sustains a daily player for 6+ months

---

## Epic 1: Discovery & Growth

**Goal:** Maximize organic discoverability and install-to-retain conversion through ASO optimization, viral sharing mechanics, and push notification infrastructure.

**User value:** Players can find Alchemica via organic search; they naturally share discoveries with friends; they return daily thanks to timely reminders.

**Success criteria:**
- App Store metadata updated (title, subtitle, keyword field, 5 screenshots)
- Shareable discovery card functional and tested on iOS + Android
- Push notification permission flow live; daily reminder scheduled on opt-in
- In-app rating prompt live with pre-screening gate

**Dependencies:** None — this epic is independently shippable.

---

### Story 1.1: ASO Metadata Overhaul

**As a** potential new player browsing the App Store,
**I want** to find Alchemica when I search "element game", "alchemy game", or "science puzzle",
**so that** I can discover a game that matches exactly what I'm looking for.

**Acceptance Criteria:**
- [ ] App Store Connect title updated to: `Alchemica: Element Discovery Lab`
- [ ] iOS subtitle updated to: `Mix elements, uncover science. Daily challenges & achievements await!`
- [ ] iOS keyword field updated: `alchemy,elements,science,crafting,puzzle,chemistry,discovery,chemistry game,little alchemy`
- [ ] Google Play short description updated (first 80 chars optimized)
- [ ] Google Play long description first 200 words contain all 7 target keywords naturally

**Notes:** Pure metadata change — no code required. Verify keyword field is exactly 100 chars on iOS.

---

### Story 1.2: App Store Screenshots (5 New)

**As a** potential player viewing the App Store listing,
**I want** to see compelling screenshots that show the discovery mechanic, daily challenge streak, achievements, and clean UI,
**so that** I can immediately understand what Alchemica offers and want to download it.

**Acceptance Criteria:**
- [ ] Screenshot 1: Discovery moment in progress — mixing chamber active, "New Element!" banner visible; headline: "Discover 300+ elements through real science"
- [ ] Screenshot 2: Daily challenge UI with streak counter visible (e.g., "14-day streak!"); headline: "A new science challenge every day"
- [ ] Screenshot 3: Achievement grid with earned badges; headline: "Earn achievements. Explore everything."
- [ ] Screenshot 4: Element shelf showing category view (once implemented in Epic 3) or current shelf; headline: "300+ elements to discover"
- [ ] Screenshot 5: Full game UI (mixing chamber + shelf + top bar); headline: "Clean, distraction-free mixing experience"
- [ ] All screenshots meet App Store (1290×2796px) and Google Play (1080×1920px) dimension requirements

**Notes:** Can use current screenshots as baseline; Screenshot 4 should be updated post-Epic 3 when category view is live.

---

### Story 1.3: Shareable Discovery Card

**As a** player who just discovered a new element,
**I want** to share a branded image card of my discovery to social media or messaging,
**so that** I can celebrate with friends and invite them to play Alchemica.

**Acceptance Criteria:**
- [ ] After discovering any new element, a "Share your discovery! 🎉" button appears in the discovery notification
- [ ] Tapping share generates a canvas-rendered PNG card (no server call) containing:
  - Element name + icon
  - Discovery number (e.g., "Discovery #47 of 300")
  - Game logo and tagline
  - "Play Alchemica" CTA text
- [ ] Card renders within 300ms of trigger
- [ ] On daily challenge completion, a second shareable format is available: "I solved today's Alchemica challenge! 🧪"
- [ ] Native share sheet opens with the generated image (iOS: `UIActivityViewController`; Android: `ACTION_SEND`)
- [ ] Works offline (no external images fetched at share time)

**Technical notes:** Use `HTMLCanvasElement` → `canvas.toBlob()` → Web Share API (`navigator.share({ files: [imageFile] })`). Capacitor's `@capacitor/share` plugin wraps this natively.

---

### Story 1.4: In-App Rating Prompt

**As a** player who has formed a habit of playing Alchemica,
**I want** to be asked to rate the app at the right moment,
**so that** my positive experience is captured as a review without feeling interrupted.

**Acceptance Criteria:**
- [ ] Rating prompt triggers after the player's 5th session AND after completing a daily challenge
- [ ] Pre-screening question shown first: "Enjoying Alchemica? ⚗️" → [Loving it!] / [Not really]
- [ ] "Loving it!" → triggers native store rating API (`SKStoreReviewRequestAPI` on iOS / Play In-App Review on Android)
- [ ] "Not really" → opens in-app feedback form (email link or text area) — does NOT open store rating
- [ ] Prompt never shown more than once per 365 days
- [ ] Prompt never shown immediately after an ad view
- [ ] Session count tracked in persistent store

---

### Story 1.5: Daily Push Notification (Streak Reminder)

**As a** player with an active streak,
**I want** to receive a daily reminder before my streak window closes,
**so that** I never accidentally break a streak I care about.

**Acceptance Criteria:**
- [ ] `@capacitor/local-notifications` used for scheduling (no server required)
- [ ] Permission requested only after the player completes their FIRST daily challenge (not on launch)
- [ ] Permission request framed as: "Get notified when tomorrow's challenge is ready?" (not generic "Allow notifications?")
- [ ] Daily notification scheduled at 8:00 PM local time
- [ ] Notification title personalised by streak: "⚗️ Keep your {N}-day streak alive!" (N > 0) or "🔬 Today's science challenge is ready" (N = 0)
- [ ] Notification body: "A new element combination challenge awaits."
- [ ] Tapping notification opens app directly to the daily challenge screen
- [ ] Player can opt out from Settings screen
- [ ] Notification re-schedules automatically each day (no server needed)

---

## Epic 2: Experience Depth

**Goal:** Make the first 60 seconds irresistible for new players and make every discovery moment feel earned and shareable, while optimizing the monetization trigger to serve players at exactly the right pain point.

**User value:** New players understand the mechanic immediately and experience delight within the first minute; stuck players are helped, not blocked; every session session has a clear "next thing to discover" pull.

**Success criteria:**
- Guided 3-step onboarding completes for 100% of new installs
- Discovery celebration (particle + banner) fires on every new element unlock
- Hint rewarded video offer triggers after the 3rd consecutive failed combination
- "Element of the Week" event banner visible in the main UI

**Dependencies:** Epic 1 (shareable card reused in discovery celebration share button).

---

### Story 2.1: Guided First-Session Onboarding

**As a** new player opening Alchemica for the first time,
**I want** to be guided through my first discovery without reading instructions,
**so that** I experience the "aha moment" within my first 60 seconds.

**Acceptance Criteria:**
- [ ] On first launch only, a guided sequence activates:
  - **Step 1 (0–15s):** Animated hand highlight points to Fire + Water in the shelf; overlay text: "Try combining these →"; player completes the drag/tap combination; Steam appears
  - **Step 2 (15–40s):** "Nice! You discovered Steam 🎉" confirmation; free exploration prompt: "Now try anything you like" — player gets 2 free combinations unsupervised
  - **Step 3 (40–60s):** "You've discovered 3 elements! Keep exploring →" summary with element count
- [ ] Onboarding is skippable with a "Skip tutorial" tap target
- [ ] Once completed or skipped, onboarding never shows again (persisted flag)
- [ ] All onboarding steps use show-don't-tell (no instruction text beyond element labels and short confirmations)
- [ ] Onboarding works correctly in both portrait and landscape

---

### Story 2.2: Discovery Celebration Moment

**As a** player who just discovered a new element,
**I want** the discovery to feel special and worth celebrating,
**so that** I'm motivated to keep experimenting and sharing my discoveries.

**Acceptance Criteria:**
- [ ] On every new element discovery, a particle burst animation plays around the newly created element card (≤ 500ms, 60fps iOS / 30fps+ Android)
- [ ] A full-width discovery banner slides in from the top, containing:
  - Element icon (large, 48px)
  - "✨ New! [Element Name]" headline
  - One-sentence science fact about the element
  - Discovery count: "Discovery #N of 300"
  - Share button (links to Story 1.3 shareable card)
- [ ] Banner auto-dismisses after 3 seconds; player can dismiss earlier with a tap
- [ ] Banner does NOT block the mixing chamber (slides from top over the shelf area)
- [ ] Re-discovery of an already-known element shows a smaller, non-intrusive toast: "Already discovered [Element Name]"
- [ ] Science fact content is stored in element data (not hardcoded in the component)

---

### Story 2.3: Stuck-Player Hint Trigger (Rewarded Video)

**As a** player who is stuck and can't figure out what to combine next,
**I want** to be offered a hint after I've tried several times without success,
**so that** I can get unstuck without feeling forced to pay or watch ads.

**Acceptance Criteria:**
- [ ] After 3 consecutive failed combinations (combinations that don't produce a new element), a non-intrusive prompt appears: "Stuck? 🔍 Watch a short video for a hint"
- [ ] Prompt is dismissable — player can ignore it and keep trying
- [ ] Accepting plays a rewarded AdMob video; on completion, a hint is revealed: one valid undiscovered combination using an element the player already has
- [ ] Hint selection algorithm biases toward combinations the player is "close to" (one ingredient already on the shelf)
- [ ] Failed combination counter resets after: (a) a successful discovery, (b) a hint is accepted, (c) session ends
- [ ] Rewarded video is pre-cached after the 2nd failed combination (not on trigger) to eliminate loading delay
- [ ] If no ad is available, fallback: offer hint for free with a brief "No ad available — here's a hint anyway" message

---

### Story 2.4: Element of the Week Event Banner

**As a** returning player,
**I want** to see a themed weekly challenge or spotlight event in the main UI,
**so that** I always have a fresh reason to open the app beyond the daily challenge.

**Acceptance Criteria:**
- [ ] A dismissable banner appears in the main UI (below the top bar, above the mixing chamber) when an active event is configured
- [ ] Event data is defined in a local JSON config (no server required for v1): `{ id, title, description, startDate, endDate, targetElement, iconKey }`
- [ ] Banner shows: event title, short description (max 60 chars), and days remaining ("3 days left")
- [ ] Tapping the banner shows a modal with full event details and a "Try Now" CTA that focuses the target element in the shelf
- [ ] Banner dismisses per-event (once dismissed, doesn't return for that event's ID)
- [ ] When no event is active, banner is hidden — no empty space
- [ ] Event JSON is version-controlled and can be updated via app update (no CMS needed for v1)

---

## Epic 3: Engagement Systems

**Goal:** Build the long-term retention scaffolding that sustains a daily player for 6+ months — organized content, competitive leaderboard, data-driven analytics, and new element content.

**User value:** Long-term players have organized, completionist content to work through; competitive players have weekly rankings to motivate them; the team has data to improve the game; new players have fresh content to discover.

**Success criteria:**
- Category grouping with completion % live in shelf view
- Weekly discovery leaderboard shows top players (local, anonymous)
- 10 Firebase Analytics events instrumented and visible in dashboard
- Space Science pack (+50 elements) live and discoverable

**Dependencies:** Epic 2 (discovery celebration used when unlocking new pack elements).

---

### Story 3.1: Element Category Grouping in Shelf

**As a** player who has discovered 50+ elements,
**I want** to browse my discovered elements organized by category with progress indicators,
**so that** I always know which categories are "almost complete" and have clear next goals.

**Acceptance Criteria:**
- [ ] Shelf view adds a category filter bar: tabs/chips for each category (e.g., Nature, Chemistry, Physics, Modern, Space)
- [ ] Each category chip shows completion count: "Chemistry 8/24"
- [ ] "All" tab remains available showing the current flat list
- [ ] Within a category, elements are sorted alphabetically by default
- [ ] Elements with undiscovered outgoing combinations show a subtle "◦" indicator (player has them but they lead to more)
- [ ] Category assignments stored in element data (not computed at runtime)
- [ ] "All" tab is the default on first use; last selected tab persists between sessions
- [ ] Category filter works on both mobile and desktop/PWA layouts

---

### Story 3.2: Weekly Discovery Leaderboard

**As a** competitive player,
**I want** to see how many discoveries I've made this week compared to other players,
**so that** I have a motivating weekly goal beyond the daily challenge.

**Acceptance Criteria:**
- [ ] A "This Week" leaderboard is accessible from the main navigation (tab or button)
- [ ] Leaderboard shows: rank, anonymous display name (auto-generated adjective+element: "Curious Helium"), discoveries this week, and a trophy icon for rank 1–3
- [ ] Player's own row is highlighted regardless of rank
- [ ] Leaderboard resets every Monday at 00:00 UTC
- [ ] V1 implementation: local-only simulated leaderboard using stored player history + generated ghost entries (avoids backend requirement for v1)
- [ ] Ghost entries are deterministic (seeded by week number) so they don't change on refresh
- [ ] A clear "v1: local scores only" label is shown until real network leaderboard ships
- [ ] Leaderboard screen is reachable within 2 taps from main game

---

### Story 3.3: Firebase Analytics Instrumentation

**As a** member of the Alchemica team,
**I want** key player actions tracked in Firebase Analytics,
**so that** we can make data-driven decisions about onboarding, monetization, and content.

**Acceptance Criteria:**
- [ ] `firebase` and `@capacitor-firebase/analytics` packages installed and configured
- [ ] The following 10 events are instrumented:

| Event name | Trigger | Key params |
|---|---|---|
| `session_start` | App comes to foreground | `session_number` |
| `element_discovered` | New element unlocked | `element_key`, `discovery_number`, `session_number` |
| `daily_challenge_completed` | Daily challenge marked done | `streak_count`, `target_element` |
| `achievement_earned` | Badge awarded | `achievement_id` |
| `hint_requested` | Player opens hint offer | `failed_attempts_count` |
| `rewarded_ad_watched` | Rewarded video completes | `placement` (stuck\|daily\|achievement) |
| `iap_initiated` | IAP purchase flow started | `product_id` |
| `onboarding_completed` | Player finishes or skips tutorial | `completed` (true\|false), `step_reached` |
| `share_triggered` | Player taps share on discovery card | `element_key`, `share_type` (discovery\|daily) |
| `notification_permission_granted` | Push permission accepted | — |

- [ ] All events fire asynchronously (non-blocking)
- [ ] Analytics disabled if user opts out (settings toggle)
- [ ] No PII in any event params
- [ ] Verified live in Firebase DebugView before shipping

---

### Story 3.4: Space Science Element Pack (+50 Elements)

**As a** player who has discovered most of the base elements,
**I want** a new themed expansion pack with astronomy and physics elements,
**so that** I have fresh content to discover and a reason to return to Alchemica.

**Acceptance Criteria:**
- [ ] 50 new elements added to the element data table, all in the "Space" category
- [ ] All 50 elements pass CVEA quality check: Combinable (≥2 input recipes), Verifiable (real science basis), Evocative (memorable name/icon), Anchored (Space category + cross-category links)
- [ ] Each new element has: `key`, `name`, `icon`, `category: 'space'`, `scienceFact`, and at minimum 2 `recipes`
- [ ] At least 20% of new recipes combine Space elements with existing base elements (creates discovery bridges into the new pack)
- [ ] New elements are accessible from launch (no unlock gate for v1 — they are simply part of the graph)
- [ ] Discovery celebration (Story 2.2) fires correctly for all 50 new elements
- [ ] Category grouping (Story 3.1) shows "Space 0/50" correctly before any are discovered
- [ ] Achievement thresholds reviewed: if 300 base + 50 new = 350 total, add a `badge_100` milestone at 100 discoveries

**Suggested element seeds (for planning):** Hydrogen, Helium, Nebula, Star, Supernova, Black Hole, Comet, Asteroid, Meteorite, Crater, Moon, Solar Wind, Radiation, Plasma, Fusion, Neutron Star, Galaxy, Orbit, Gravity, Telescope, Satellite, Rocket, Cosmonaut, Space Station, Aurora, Solar System, Eclipse, Tides, Magnetosphere, Dark Matter, Pulsar, Quasar, Exoplanet, Atmosphere, Vacuum, Zero Gravity, Ion, Photon, X-Ray, Gamma Ray, Space Dust, Planetary Ring, Red Dwarf, White Dwarf, Binary Star, Accretion Disk, Cosmic Ray, Light Year, Parsec, Universe

---

## Sprint Status

Sprint status tracking: see `_bmad-output/implementation-artifacts/sprint-status.yaml` (generated by sprint planning).
