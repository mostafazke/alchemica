# Technical Research: Should Alchemica Maintain Web/Desktop Support Alongside Mobile?

**Date:** 2026-05-08  
**Researcher:** GitHub Copilot (autonomous)  
**Topic:** Cross-platform strategy — web/desktop vs. mobile-only for Alchemica  
**Codebase:** SvelteKit 5 + Vite + TailwindCSS + Capacitor v8 + Android  
**Status:** Complete

---

## Executive Summary

**Recommendation: Keep web/desktop support. Double down on it as a marketing funnel.**

The cost of maintaining the web platform in Alchemica is effectively **zero** — the entire codebase already is a web app; Capacitor just wraps it. Dropping web support would mean deleting a user acquisition channel, slowing the dev loop, and closing off future iOS expansion, in exchange for nothing meaningful. The current architecture is already the best practice pattern: web is the dev environment and organic discovery surface, Android is the monetization layer.

---

## 1. The Current Architecture (Audit)

Alchemica's platform breakdown today:

| Layer | Technology | Platform |
|---|---|---|
| App logic & UI | SvelteKit 5 + Svelte Runes | Web (shared) |
| Styles | TailwindCSS 4 | Web (shared) |
| Build | Vite + `@sveltejs/adapter-static` | Outputs to `build/` |
| PWA | `vite-plugin-pwa`, SW, manifest | Web |
| Offline | Service worker | Web |
| Mobile wrapper | Capacitor v8 | Android only |
| Ads | AdMob rewarded (hints) | Native-only (`isNativePlatform()` guard) |
| IAP | RevenueCat — Remove Ads + Hints bundle | Native-only (`isNativePlatform()` guard) |
| Haptics | `@capacitor/haptics` | Native-only |
| Touch events | `src/lib/utils/touch.ts` | Platform-branched |

**Key observation:** The codebase has 17 instances of `Capacitor.isNativePlatform()` guards. All monetization is already correctly isolated behind these guards. The web version is a fully playable, ad-free, purchase-free version of the game — by design, not by accident.

### What "dropping web" would actually mean

To truly drop web, the team would need to:
1. Remove `adapter-static` and PWA configuration
2. Remove the service worker
3. Eliminate all `isNativePlatform()` guards (no longer needed)
4. Lose the `npm run dev` → browser feedback loop (have to run on device/emulator)
5. Lose the SEO/sharable URL entry point
6. Lose the `cap:sync` build pipeline (which already produces the correct artefact)

None of those trade-offs benefit the product.

---

## 2. The Cost-Benefit Reality

### Cost of keeping web: near-zero

The Capacitor model is explicitly: **"your web app, running natively."** The SvelteKit static adapter already does the right thing — it builds a fully standalone client-side app that Capacitor ingests from `build/`. There is no separate web codebase to maintain. Every feature written for Android automatically works on web, and vice versa, with the one exception of native APIs, which are already gated.

**Developer experience bonus:** The entire dev loop (`npm run dev`, HMR, Vitest, Playwright) runs in browser. This is 10× faster than Android emulator cycles. Dropping web would mean developers test only on device/emulator — a significant productivity hit.

### Cost of dropping web: high

| Lost asset | Impact |
|---|---|
| SEO / Google search visibility | No organic discovery outside the Play Store |
| Shareable URLs (link to discovery, share reaction result) | Social sharing loses its viral loop potential |
| PWA install on Android (bypasses Play Store 30% cut) | Loses an alternative acquisition/distribution path |
| Fast browser dev loop | Developers must use emulator for iteration |
| Future iOS expansion | Any iOS build would also be web-wrapped; dropping web now complicates it |
| Fallback if Play Store suspends the app | No web fallback means total distribution loss |

---

## 3. Industry Data

### Mobile dominates game downloads, but web feeds the funnel

- **142.2 billion** apps+games downloaded in 2025 (3.1% growth, reversing a 3-year decline)
- **45.3 billion** were games — Google Play accounted for **73.5%** of total downloads
- Mobile ad spend reached **$419B in 2025** (+7.4% YoY), confirming the mobile ad market is strong
- App consumer spending hit **$166.8B** in 2025; games and apps now nearly equal at $83B each
- iOS captures **70% of consumer spending** despite ~26% of downloads — the iOS user is far more valuable per install

**What this means for Alchemica:** Android (Play Store) is the right primary distribution target — large download volume. But iOS monetization is significantly stronger per user. This makes a future iOS expansion very compelling, and that future is much simpler if the web foundation is preserved.

### Capacitor is used in real games

Capacitor is confirmed to be used by **Vampire Survivors** (one of the most successful indie games in recent memory, >12M copies), validating that a web-wrapped approach is viable for production game distribution at scale. If it's good enough for a $5 Steam hit, it's good enough for a puzzle game.

### The "hybrid tax" is real but manageable for this game type

Capacitor runs the web app in a WebView. For graphically-intensive 3D games this matters. For **Alchemica** — a DOM-based element-combination puzzle game — WebView performance is more than adequate. There is no 3D render loop, no particle physics, no canvas-heavy rendering. The performance ceiling is not a constraint.

---

## 4. The Monetization Gap Problem

The web version has **zero monetization**:
- No AdMob (native-only SDK)
- No IAP (RevenueCat, native-only)
- No payment alternative on web

This is a real asymmetry. However, it should be viewed as a **feature, not a bug**:

### Web as freemium funnel

The free/ad-free web version is an acquisition tool. A user who discovers Alchemica via Google, plays it for 30 minutes, and enjoys it becomes a strong candidate for converting to the Android install — where they can remove ads, buy hint bundles, and generate revenue.

This is the same model Wordle used to grow: free web version → massive word-of-mouth → NYT acquisition. The web version is the "demo" that creates advocates who convert.

### The alternative web monetization path

If web monetization ever becomes a priority, the path forward is not AdMob (not available in browser) but:
- **PWA subscriptions via Stripe/Paddle** — web-based payment processors  
- **Google Play Billing on Android PWA installs** — when users install via Add to Home Screen, the PWA is still web and can't use Google Play Billing  
- **Accept the asymmetry** — web is CAC investment, Android is LTV harvest

---

## 5. Platform-Specific Risk Analysis

### Risk: Web cannibalizes Android installs

**Assessment: Low.** Casual puzzle games convert from web to native when the native experience is better (haptics, smoother gestures, push notifications for daily challenges, offline caching without SW complexity). Alchemica already has haptics and native-feel optimizations. The Android app has differentiated value.

### Risk: Maintaining two UX surfaces splits design attention

**Assessment: Minimal.** The responsive design already handles mobile and desktop layouts. There's no separate "desktop UI" to maintain — it's the same SvelteKit app rendered at a wider viewport. The `isNativePlatform()` guards already cleanly separate feature sets.

### Risk: Play Store policy changes or app removal

**Assessment: This is actually an argument FOR keeping web.** If Google suspends the app for any reason (policy violation, content flags, payment disputes), having a web version means zero downtime for users. For an indie game without a support team, this is meaningful business continuity.

### Risk: Web version users expect feature parity

**Assessment: Manageable with clear messaging.** A simple "Get the full experience" banner on web, pointing to the Play Store, sets expectations correctly and converts interested players.

---

## 6. Future Platform Expansion Scenarios

### iOS

The single strongest argument for keeping the web foundation: **iOS expansion is free**.

When the team is ready for iOS:
1. `npx cap add ios`
2. Configure AdMob / RevenueCat iOS keys
3. Submit to App Store

The entire game logic, UI, and all Svelte components are already cross-platform. iOS support is a Capacitor config change and a signing certificate, not a rewrite. **This path evaporates if you drop the web foundation.**

iOS represents disproportionate revenue per user (~70% of app consumer spending from 26% of downloads). Being iOS-ready when the time is right is a significant option value.

### Desktop (Electron via Capacitor)

Capacitor has a community Electron target (`@capacitor-community/electron`). If a desktop version ever makes sense (Steam?), it's also a build configuration away. Low value now but worth not closing off.

### Web app store distribution (Samsung Galaxy Store, etc.)

PWAs can be distributed through alternative app stores as TWAs (Trusted Web Activities). This is a free discovery channel the team gets for free by keeping the web build healthy.

---

## 7. Decision Framework

```
Current situation:
  Web + Android (Capacitor) = ONE codebase, TWO distribution channels

Options:
  A) Keep both  → near-zero maintenance cost, multiple distribution vectors
  B) Mobile-only → no maintenance cost saving (same code), lose discovery funnel
  C) Web-only   → lose monetization (AdMob + IAP), lose native feel, lose haptics

Option A is strictly dominant over B and C for this codebase architecture.
```

The question "should we maintain web?" is only meaningfully hard when:
- There's a **diverging codebase** (e.g., separate React Native app vs. web app) — NOT the case here
- There's a **performance constraint** that the web can't meet — NOT the case for a DOM puzzle game
- There's a **monetization opportunity** that requires mobile-only distribution — NOT the case (the guards already handle this correctly)

None of those conditions apply to Alchemica.

---

## 8. Concrete Recommendations

### Immediate (no-cost, high-value)

1. **Add a Play Store CTA on web.** When `isNativePlatform() === false`, show a small sticky banner: *"Playing on web? Get the full experience on Android →"* with the Play Store link. This converts web players to mobile installs.

2. **Ensure web is indexable.** Confirm that the SvelteKit static build produces SEO-crawlable HTML for the game's landing/info pages. The game itself is dynamic, but a proper `<title>`, `<meta description>`, and Open Graph tags on the root page give Google enough to surface the app.

3. **Add structured sharing from web.** The share functionality in `ResultDisplay.svelte` works on web via `navigator.share`. Make sure the shared URL is the web URL (not a Capacitor deep link) so shared discoveries drive web traffic.

### Short-term (next milestone)

4. **iOS expansion readiness.** Inventory which Capacitor plugins have iOS support: AdMob ✅, RevenueCat ✅, Haptics ✅, SplashScreen ✅. The blockers are App Store registration and certificates, not code. This could be done in a single sprint.

5. **PWA install prompt.** Add a dismissable "Install App" prompt for Android web users, using the `beforeinstallprompt` event. This captures users who land on web and lets them install the PWA to their home screen without the Play Store (and without the 30% cut).

### Architectural (keep doing)

6. **Keep the `isNativePlatform()` guard pattern.** It's clean, testable, and well-established in the codebase. Every new native feature should follow this pattern — the web path gracefully degrades.

7. **Never write Capacitor-specific code outside of `effects/` and `utils/`.** The current separation (all platform-specific code in `src/lib/effects/admob.ts`, `src/lib/effects/iap.ts`, `src/lib/utils/touch.ts`) is architecturally correct. Game logic in `src/lib/game/` should remain platform-agnostic.

---

## 9. Summary Scorecard

| Criterion | Keep Web | Drop Web |
|---|---|---|
| Development velocity | ✅ Faster (browser dev loop) | ❌ Emulator-only |
| Monetization | ✅ Android monetizes, web is funnel | ✅ Android monetizes (no change) |
| User acquisition | ✅ SEO + share links + web discovery | ❌ App Store only |
| Codebase complexity | ✅ Same code | ✅ Marginally less (remove guards) |
| iOS expansion path | ✅ One config step | ✅ One config step (no difference) |
| Business continuity | ✅ Web fallback if Play removed | ❌ Single point of failure |
| Design focus | ✅ Responsive already handles it | ✅ Could simplify some layout decisions |
| Viral/shareability | ✅ Links work, shareable | ❌ Deep links require app install |

**Score: Keep Web — 6 advantages, 0 disadvantages.**

---

## Sources

- BusinessOfApps — App Revenue Data 2026 (mobile ad spend $419B, consumer spending $166.8B): https://www.businessofapps.com/data/app-revenues/
- BusinessOfApps — App Downloads Data 2026 (142.2B downloads, 73.5% Google Play): https://www.businessofapps.com/data/app-statistics/
- Ionic Blog — Capacitor: Everything You've Ever Wanted to Know (Vampire Survivors case, PWA/native trade-offs): https://ionic.io/blog/capacitor-everything-youve-ever-wanted-to-know
- WhatPWACanDo.today — Browser API capability survey (offline, notifications, vibration, geolocation all supported): https://whatpwacando.today/
- Web.dev Case Studies — Real-world PWA performance improvements: https://web.dev/case-studies/
- Codebase audit — `src/lib/effects/admob.ts`, `src/lib/effects/iap.ts`, `src/lib/utils/touch.ts`, `capacitor.config.ts`
