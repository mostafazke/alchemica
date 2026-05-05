# Mobile Casual Game UI Patterns Research

_Analyzed: 2026-05-03_
_Sources: Little Alchemy 2 (web research), Duolingo (design documentation + UX analysis), Monument Valley (postmortems + ustwo design interviews)_

---

## 1. Little Alchemy 2

### Layout Structure
Three-zone horizontal layout — consistent across desktop and mobile:
- **Workspace (center/left):** Large open canvas where elements are placed freely. No grids, no snap points. Elements accumulate and persist between interactions, building a visible trail of experimentation.
- **Sidebar (right):** Scrollable vertical list of all discovered elements as compact icon tiles. Always visible; never collapses.
- **Top bar (thin strip):** "Clean up" canvas button, search/filter field, and hints button. Minimal — never competes with gameplay.

### Interaction Model
Primary gesture is **drag-and-drop** (mouse) / **tap-hold-drag** (touch). This is a deliberate metaphor choice: the physical act of dragging one thing onto another reinforces the "mixing" concept better than a menu-select pattern.

Secondary pattern: tap an element in the sidebar → instance appears on canvas → tap a second → auto-combines. Reduces drag friction on small screens.

Key rules:
- Sidebar elements are **copies** — the palette is never depleted by dragging
- No undo per-action — only a "clean up all" canvas clear
- No confirmation step — release over an element immediately triggers combination check

### Feedback Design
**Success:** Centered pop-up with large element icon + name + **a humorous one-line caption** (e.g., "Dog + Internet = Doge"). The joke is the reward. Newly created element is simultaneously added to the sidebar.

**Failure:** Silent — elements bounce back, no sound, no animation, no penalty. The absence of negative feedback is intentional: experimentation is never punished.

**Depletion:** When all combinations for an element are found, it disappears from the sidebar. A sidebar that shrinks signals mastery without a score counter.

### Discovery System
Two distinct systems:
1. **Sidebar** (interactive) — only elements usable in future combinations
2. **Encyclopedia** (reference) — all discovered items with recipes, including "final" elements no longer combinable

This split keeps the active palette clean. The encyclopedia is opt-in reference, not a forced interruption.

### What Makes It Work
| Pattern | Why It Works |
|---|---|
| Open canvas with no timer | Removes anxiety; every session feels productive |
| Silent failure | No punishment loop — players experiment freely |
| Humorous discovery captions | Micro-reward on every discovery; creates intrinsic motivation to find the next one |
| Depleted items | Completionism signal without a progress bar |
| Opt-in hints | Frustration valve; preserves discovery feeling while preventing permanent blocks |
| 720+ items | Discovery space feels boundless; no "game over" state |
| Encyclopedia as retroactive log | Trust mechanic — players can always look up recipes they've forgotten |

### Applicable to Alchemica
- **Humor in result text** is currently absent — adding witty descriptions to reactions would dramatically increase delight
- **Silent failure** aligns with current design but could go further: no retry counter, no "0 reactions possible" warning
- **Encyclopedia vs. active sidebar** — our DiscoveryLog plays this role but doesn't distinguish depleted vs. active elements
- **Drag-to-slot** would feel more physical than tap-to-select-then-react

---

## 2. Duolingo (Lesson Screen)

### Layout Structure
Highly constrained single-column vertical layout on mobile:
- **Top progress bar:** Full width, visual sweep left-to-right. No numbers — pure visual fill. Colour shifts subtly as you progress.
- **Hearts / streak counter (top-right):** Social pressure signal, always visible but never obtrusive
- **Question area (upper 50%):** Single challenge at a time. Large, centered, high contrast. The challenge type dictates the content (word, image, sentence).
- **Answer area / tap tiles (lower 50%):** Chunky answer tiles in a wrapped grid. Each tile is minimum 44×50px — large enough to tap without precision. Tiles highlight on tap with a color fill before submission.
- **Check / Continue button (pinned bottom):** Full-width, 56px tall. Changes from gray (inactive) to green (answer selected) to indicate readiness. This state transition teaches the mechanic without instructions.

### Feedback Model
This is Duolingo's most studied design decision:

**Correct answer:**
- Screen edge and answer tiles flash **green**
- Cheerful ascending chime (2-note)
- Bottom section transitions to a green confirmation bar with the correct answer restated and an encouraging phrase ("Great job!", "Correct!")
- Owl character animates (waves, celebrates) — emotional resonance
- Continue button appears full-width in green
- Entire feedback cycle takes ~0.8 seconds — fast enough to feel snappy, long enough to register

**Wrong answer:**
- Screen edge and answer tiles flash **red**
- Descending "dun-dun" tone
- Bottom section turns red, shows the correct answer with a label ("Correct solution:")
- Owl character shows a disappointed expression — mild emotional consequence
- Button says "Got it" instead of "Continue" — reframe from failure to acknowledgment
- No life lost on first attempt (in standard mode) — consequence is time, not punishment

**Key insight: the bottom bar is a feedback canvas.** The same physical space serves as: inactive prompt → active submit zone → result display → continue trigger. This eliminates layout shift and trains muscle memory: "the bottom region tells me what happened and what to do next."

### Streak & Motivation Mechanics
- **Streak counter** is always visible in TopBar — a passive motivator that players self-monitor
- **XP animation** plays at lesson end, with numbers flying into the XP bar — tangible visual representation of progress
- **Checkpoint screens** between lessons celebrate milestones with full-screen animations
- **Daily goal ring** in the homescreen acts as a compact progress tracker — players check it habitually
- Notifications are used aggressively but with emotional framing ("Duo is waiting..." rather than "Complete your lesson")

### Touch Interaction Principles
- **Zero ambiguity about tappability** — interactive elements are tiles or full-width buttons with visible surface and rounded edges. Non-interactive text is flat.
- **Tile feedback is immediate (0ms)** — tapping a tile highlights it before any server call. Perceived responsiveness matters more than actual speed.
- **One action per screen** — each interaction has exactly one correct next step. No choice paralysis.
- **Disabled states are visually clear** — the Continue button is gray and unresponsive until an answer is selected; then it becomes green. The transition itself is the affordance.

### What Makes It Work
| Pattern | Why It Works |
|---|---|
| Full-width pinned CTA | One clear next action; thumb-reachable on any phone |
| Dual-state bottom bar (result + CTA) | Eliminates layout shift; trains predictable muscle memory |
| Immediate tile highlight on tap | Zero-latency feedback; action feels responsive |
| Green/red full-screen flash | Unambiguous correct/wrong signal — works without reading text |
| Owl emotional reactions | Emotional investment without story; creates parasocial accountability |
| Streak visibility | Sunk cost psychology — players don't want to break a streak |
| Checkpoint celebrations | Milestone rewards at unpredictable intervals (variable ratio reinforcement) |

### Key Specifics (measurements + colors)
- CTA button: **56–64dp tall**, full-width minus ~16–24dp margins, pill-shaped (12–16dp radius)
- Answer tiles: **52–64dp tall** (list), ~half screen width (grid) — word bank tiles: 36–44dp
- Progress bar: **8–12dp tall**, fills discretely per question (jumps, never animates backward — even on re-inserted mistake questions)
- Correct green: `#58CC02` · Wrong red (muted coral): `#FF4B4B` · XP/reward gold: amber/yellow
- XP reward number: **floats upward** from the interaction point (like RPG damage numbers), fades over ~600ms
- Typography: rounded sans-serif throughout — rounded letterforms are an explicit "approachable, non-authoritative" emotional cue. 20–24sp for questions, 16–18sp for tiles.

### Published Design Principles (Duolingo official)
- **Non-shaming error feedback**: Copy never says "WRONG" or "INCORRECT". Errors are framed as learning. The correct answer is always shown immediately.
- **Streak freeze as anxiety reduction**: All-or-nothing streaks create churn. Streak freeze/repair were added to soften loss while preserving commitment behavior.
- **SDT motivation mapping**: Duolingo's gamification directly maps to Self-Determination Theory's three pillars — *Autonomy* (user sets pace/goal), *Relatedness* (characters + social leagues), *Competence* (immediate feedback + XP growth). Games that hit all three retain better.
- **Duo = kawaii-adjacent**: Large head-to-body ratio, oversized eyes, minimal features — maximizes expressiveness at small sizes. Emotional reactions land at 32–48dp icon size.
- **Animation as learning tool**: Duolingo acquired two animation studios specifically because "a more animated product experience leads to better learning outcomes" — not just delight.
- **Progressive disclosure**: One task, one focus, one CTA per screen. Never overload the question area.

### Applicable to Alchemica
- **React button state** should transition visually (gray → active green glow) only when both slots are filled — currently it uses `opacity: 0.4` disabled but could have a more active "ready" state
- **Result area as dual-purpose zone** (like Duolingo's bottom bar): could serve as both the result display AND the next-action prompt, collapsing the current separate ResultDisplay + React button into one unified zone
- **Full-screen flash on new discovery** — currently uses border-color change on a card. A brief green screen-edge flash (like Duolingo's correct answer) would be far more satisfying
- **Floating score burst** — "+100" or "NEW" animating upward from the mixing point on discovery (like Duolingo's XP float) is more satisfying than a static badge
- **Streak counter is partially there** (`streakCount`) but buried in the TopBar at 12px — it deserves its own visible flame icon treatment
- **Combo = Duolingo's XP surge** — the combo mechanic could use an animated number burst rather than a badge change
- **Non-shaming failure copy** — "No reaction found" → remove it entirely or replace with neutral particle scatter only (silent failure model)

---

## 3. Monument Valley (ustwo)

### Core Design Philosophy
Monument Valley's entire UI philosophy is captured in one principle: **the world IS the interface.** There are no buttons, no menus, no HUD during gameplay. The player discovers what is interactive by touching things and observing what responds. Every interactive element is embedded in the environment itself.

### Interaction Model
Three interaction layers, each discovered through exploration:

**Tap to move:** Tapping any reachable floor tile makes Ida walk to it. There is no "move" button — the destination IS the button. The floor highlights briefly on tap to confirm the input was registered.

**Drag to rotate:** Certain architectural elements (arches, platforms, cranks) are rotatable. These have a visual handle (a circular control or a crank shape) that is part of the world geometry. Players discover these are interactive by trying — there is no tooltip, no blinking indicator. The first time a rotation reveals a new path, the player understands the mechanic permanently.

**Press to hold:** Some elements require sustained pressure. The visual feedback is a circular fill animation on the element itself, not on a separate progress bar. The feedback is where the action is.

**No onscreen controls at all during gameplay.** No joystick, no arrow buttons, no action buttons. The entire screen is the controller.

### Feedback Design
**Spatial audio:** Every interaction produces a sound that originates from the location of the touch. Rotating a platform in the bottom-left produces sound from the bottom-left speaker. This spatial feedback reinforces the sense that you are physically manipulating the environment.

**World response:** When Ida reaches a totem or landmark, the architecture subtly glows or shifts color. There is no score popup — the world itself acknowledges the progress.

**Silence as feedback:** When nothing happens on a tap, that IS information. The absence of response tells the player "this area is not reachable yet." No error message, no buzzer — the world simply doesn't respond.

**Chapter completion:** A brief, ambient cinematic plays (no UI chrome) followed by a soft glow on Ida. Then a gentle transition to the next chapter menu — a circular arrangement of level tiles shown as illustrations. Tapping a level opens it. The menu feels like part of the world.

### Minimal Chrome Philosophy
During gameplay, only two UI elements exist:
1. **The menu button** (top-left corner): A small square icon. Tapping reveals a minimal overlay (restart, menu, no settings during play).
2. **Crow/character speech** (story elements): Text appears in the world as speech bubbles, not as a dialogue box overlay. Even narrative is spatially embedded.

No score. No timer. No lives. No level number displayed during play. All meta-information is stripped to preserve the sense of being inside the world rather than playing a game on top of it.

### Navigation Between Levels
The **chapter select screen** is the only menu-heavy surface. It uses:
- A vertical scroll of circular level illustrations (like a storybook table of contents)
- Locked levels are visually distinct but not hidden — the shape of the level is shown but the illustration is desaturated. Curiosity about the locked content drives forward motivation.
- Completed levels show a small star or completion marker — minimal but present
- The transition from chapter select into a level is an animated zoom-in: the illustration expands to fill the screen, fading into the actual level. No loading screen flash.

### What Makes It Work
| Pattern | Why It Works |
|---|---|
| World IS the interface | No layer of abstraction between player and game world; full immersion |
| Tap destination, not direction | Direct manipulation feels natural vs. virtual joystick |
| No HUD during play | Removes the "I am playing a game" reminder; full emotional investment |
| Spatial audio feedback | Feedback originates from interaction point; reinforces physicality |
| Silent non-response for unreachable areas | No punishment; player self-corrects through exploration |
| Animated level transition (zoom-in) | Eliminates the loading screen as a jarring interruption |
| Locked-but-visible levels | Teaser mechanic — curiosity is stronger than an icon with a padlock |
| Circular chapter select | Spatial navigation that feels different from a list; memorable |

### Applicable to Alchemica
- **Slot as direct destination:** Rather than "tap element then slot fills", dragging an element card directly onto a slot would feel like Monument Valley's "tap the floor tile" directness
- **No reaction button** as a future direction: if both slots fill, auto-react (with a brief delay and cancel option) — remove the explicit action step
- **Transition between menu and game** — currently an instant route change. A brief zoom-in or cross-fade would feel like entering the world rather than loading a screen
- **Locked elements visible but desaturated** — showing undiscovered elements as silhouettes in the grid (rather than hiding them) would create the MV "curiosity pull" for completionists
- **Result display as world-embedded feedback** — instead of a separate card, the discovery could animate out from the slot area itself (icon expands from the mixing point), making feedback spatial rather than overlaid

---

## Cross-Game Synthesis: What Makes Mobile Casual Games Work

### 5 Universal Principles

**1. Direct manipulation over menus**
All three games put interactive elements in the primary visual field as direct touch targets — not behind buttons or menus. Little Alchemy 2 drags elements together. Duolingo taps answer tiles directly. Monument Valley taps the destination floor. The action IS the object.

**2. Silence is neutral, not negative**
Failed/invalid attempts produce no negative audio, no animation penalty, no counter decrement. Little Alchemy 2 bounces elements back silently. Monument Valley simply doesn't respond. Duolingo is the exception (buzzer + red flash) but this works because Duolingo's loop is explicitly competitive (streaks, hearts). For a pure exploration game like Alchemica, silent failure is the right model.

**3. One clear next action at all times**
Duolingo's pinned CTA. Monument Valley's single tap target per state. Little Alchemy 2's persistent "drag element onto another" affordance. The player is never left wondering "what can I do now?" The interface communicates the next move through visual emphasis, not instructions.

**4. Micro-rewards at variable intervals**
Little Alchemy 2's humorous captions. Duolingo's owl celebration + XP surge. Monument Valley's architectural transformation. Each game delivers small, delightful rewards at unpredictable moments — which is more addictive than predictable rewards (variable ratio reinforcement schedule). The reward isn't always the same: sometimes it's funny, sometimes it's beautiful, sometimes it's just satisfying.

**5. Progress visibility without score anxiety**
None of these games show a raw number as the primary progress signal. Little Alchemy 2 shows a growing sidebar. Duolingo shows a fill bar. Monument Valley shows a filled chapter illustration. Progress is felt spatially and visually, not calculated numerically. Players feel they are building something, not accumulating points.

### Applied to Alchemica: Priority Improvements

| Insight | Current Alchemica State | Recommended Change |
|---|---|---|
| Silent failure | Shows "No reaction" red text + error icon | Remove error text; subtle particle disperse only |
| Humor as micro-reward | Flat descriptive result text | Add witty one-liner to each successful reaction |
| Direct manipulation | Tap-to-slot then press React | Add drag-to-slot; make both slots filled trigger ready-state glow |
| Unified feedback zone | Separate React button + ResultDisplay | Merge into single bottom zone that transforms from CTA → result → CTA |
| Progress visibility | Raw score number | Supplement with "X/32 discovered" fill bar or sidebar growth |
| Locked element curiosity | Hidden undiscovered elements | Show silhouettes of undiscovered elements in grid (grayed out) |
| Transition quality | Instant route change menu→game | Add 250ms cross-fade or zoom-in transition |
| Spatial feedback | Centered result card overlay | Animate discovery icon expanding from mixing point |
