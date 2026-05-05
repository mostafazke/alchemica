# Phase 24: Design Tokens & Compliance — Discussion Log

**Date:** 2026-05-05
**Phase:** 24 — Design Tokens & Compliance
**Outcome:** CONTEXT.md created. Ready for planning.

---

## Areas Discussed

### Token Rollout Breadth

**Question:** How broadly should Phase 24's token migration reach — all 16 components, stable components only, or just define tokens in app.css?

**Context:** Phase 25 rebuilds ElementCard + element shelf; Phase 26 rebuilds the mixing chamber. Tokenizing those components now would mean double work.

**Options presented:**
- Tokenize all 16 components now (full compliance, some double-work)
- Tokenize only stable components now — defer ElementCard/shelf/chamber to Phase 25/26 ← **SELECTED**
- Phase 24 only defines tokens in app.css — no component migration at all

**Decision:** Tokenize stable components only. Phase 25/26 rebuild targets get their token migration when written fresh. This avoids patching components that are about to be completely rewritten.

**Stable components confirmed:** TopBar, BottomSheet, DiscoveryLog, DiscoveryItem, AchievementGallery, AchievementToast, HintButton, ElementDetail, main menu route, settings route.

---

### Compliance Fixes on Pre-Rebuild Components

**Question:** For touch targets (TOUCH-01–05) and font sizes (A11Y-01) in components scheduled for Phase 25/26 rebuilds — fix now as standalone patches, or defer?

**Decision:** Fix ALL compliance items now, including in rebuild-scheduled components. Compliance must hold immediately — users experience the app today, not after Phase 25/26. Zero regressions is non-negotiable.

---

## Decisions Carried Forward (from Phase 19 Discussion, 2026-05-03)

All Phase 19 implementation decisions (D-01 through D-08) carried forward unchanged into Phase 24 CONTEXT.md:
- D-01–D-03: Semantic color token naming, ~15 tokens, category colors stay inline
- D-04: Animation timing tokens added now
- D-05: Radius values corrected to match DESIGN_SYSTEM.md
- D-07: Global `:focus-visible` in app.css
- D-08: Update UX-AUDIT.md issue #8 alongside TOUCH-05 verification

## Phase 23 Completions (no re-work needed)

The following requirements were resolved during Phase 23 execution and UAT:
- SAFE-01: Custom reset confirmation modal ✅
- SAFE-02: DiscoveryLog visible on all screen sizes (BottomSheet fix) ✅
- A11Y-03: Reset button has destructive (red) styling ✅

Phase 24 will verify and mark these complete only.

## Deferred Ideas

None — discussion was focused and in-scope.
