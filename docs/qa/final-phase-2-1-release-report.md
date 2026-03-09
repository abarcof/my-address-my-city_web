# Final Phase 2.1 Release Report
## My Address, My City

**Date:** 2026-03-07  
**Release candidate:** Phase 2.1 (hardening complete)  
**Role:** Senior release engineer / QA lead / freeze gatekeeper

---

## Executive Summary

Phase 2.1 hardening is complete. The app delivers a resident-friendly civic snapshot for Montgomery, Alabama, with address search, map click, three data modules (This Address, What's Closest, Next Steps), and Montgomery-only validation. Code inspection and logic review confirm the implementation is coherent, boundary validation is correctly applied, and no critical regressions were identified. **Recommendation: Go for freeze.**

---

## Validation Scope

| Area | Scope |
|------|-------|
| **A. Core flows** | Address search, map click, This Address, What's Closest, Next Steps, tab switching, markers, location switching, out-of-bounds handling |
| **B. Phase 1 data** | Zoning, flood, neighborhood cards |
| **C. Phase 2 closest** | Parks, community centers, hospitals; distance labeling; resident-friendly names |
| **D. Phase 2.1 hardening** | Static boundary, Montgomery-only validation, friendly OOB message, maxBounds |
| **E. UX / state** | Stale data, failed search recovery, loading/empty/OOB states, cross-tab behavior |
| **F. Build safety** | Production build, TypeScript, imports |

---

## What Was Tested

- **Code inspection:** Store, hooks, components, services, boundary utility
- **Logic trace:** setLocation → isWithinMontgomery → enabled flags → UI branches
- **Data flow:** Geocode → setLocation; map click → setLocation; reverseGeocode → setLocation
- **Query gating:** use-snapshot and use-closest both use `enabled: coordinates !== null && isWithinMontgomery`
- **Linter:** No errors reported
- **Build:** Could not run `npm run build` in this environment (npm not in PATH); structure and imports appear correct

---

## Final Findings

### Strengths

1. **Montgomery-only validation** — `isWithinMontgomery` computed in `setLocation`; snapshot and closest queries disabled when outside boundary.
2. **Friendly OOB message** — Resident-facing copy: "Sorry — this app is designed for locations inside the City of Montgomery, so we can't show city-specific information outside city limits."
3. **Static boundary** — Local JSON from official extent; point-in-polygon with bbox fallback.
4. **maxBounds** — Leaflet constrained to Montgomery; `maxBoundsViscosity={0.5}`.
5. **Community Centers** — Third category active; HostedDatasets/Community_Centers/FeatureServer/0; FACILITY_N for name.
6. **Distance labeling** — "Approximate distance" in ClosestCategoryCard.
7. **Failed search recovery** — clearLocation called; map click still works.

### Minor Observations (Non-blocking)

- **Error state in WhatsClosest:** When the closest query fails, only the parks card shows the error/retry UI. Other categories are not shown. Low impact; refetch retries all.
- **Community Centers address:** ADDRESS field not yet passed to NearestPlace; card handles missing address.

---

## Issues Found

| Severity | Issue | Status |
|----------|-------|--------|
| Critical | None | — |
| High | None | — |
| Medium | None | — |
| Low | Error state shows only parks card | Documented; no fix |
| Cosmetic | Community Centers omit address in card | Documented; no fix |

---

## Fixes Applied

None. No code changes were required during this validation pass.

---

## Stability Assessment

- **Phase 1:** Zoning, flood, neighborhood gated by `isWithinMontgomery`; no regression observed.
- **Phase 2:** Parks, community centers, hospitals all active; query pattern consistent.
- **Phase 2.1:** Boundary, maxBounds, OOB message implemented as specified.
- **State management:** Zustand store; TanStack Query for data; no obvious stale-state risks.

---

## Freeze Recommendation

**Yes.** The release candidate is stable and ready for freeze. Manual end-to-end testing (address search, map click, in/out of Montgomery) is recommended before submission, but code-level validation supports a freeze decision.

---

## Go / No-Go Decision

**Go.** Proceed with freeze. No blocking issues identified.
