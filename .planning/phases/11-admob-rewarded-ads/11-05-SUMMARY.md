---
plan: 11-05
phase: 11-admob-rewarded-ads
status: complete
commit: 06e5a91
---

# Summary: Plan 11-05 — Verification Gate

## Results
- `npm run check`: 1 error in `vite.config.ts` (pre-existing, unrelated to Phase 11 — confirmed by stash test). 0 errors in Phase 11 files.
- `npm run build`: ✔ done (exits 0)
- `npx cap sync android`: ✔ Sync finished 0.102s (exits 0)

## UAT Criteria (pending device test)
1. Open app on Android — no crash, no console errors from AdMob
2. During 30s cooldown + balance=0: Watch ad sub-button appears
3. Tap 📺 Watch ad — test ad plays
4. Ad completes — hint balance increments by 1
5. With balance > 0 — hint fires without starting cooldown
6. Web/PWA — Watch Ad button never rendered

## ⚠ Manual step before production
Replace test IDs in `admob.ts`, `AndroidManifest.xml`, `capacitor.config.ts` with real AdMob IDs.
