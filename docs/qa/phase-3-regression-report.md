# Phase 3 Regression Report
## My Address, My City — Post-Phase 3 Verification

**Date:** 2026-03-08  
**Audit type:** Code-based (live browser testing not possible — npm not in PATH)

---

## 1. Phase 1 Regression Results

| Feature | Status | Notes |
|---------|--------|-------|
| Address search | **No regression** | SearchBar, geocode.ts unchanged. Uses Nominatim. |
| Map click | **No regression** | CityMap ClickHandler, reverseGeocode unchanged. |
| This Address tab | **No regression** | ThisAddress, use-snapshot, zoning, flood-zone, neighborhoods unchanged. |
| Zoning card | **No regression** | InfoCard, useZoning, fetchZoning unchanged. |
| Flood card | **No regression** | useFloodZone, fetchFloodZone unchanged. |
| Neighborhood card | **No regression** | useNeighborhood, fetchNeighborhood unchanged. |
| Next Steps tab | **No regression** | NextSteps component unchanged. |
| Out-of-bounds (This Address) | **No regression** | OutOfBoundsNotice shown when !isWithinMontgomery. |

**Phase 1 verdict:** No code changes to Phase 1. Behavior preserved.

---

## 2. Phase 2 Regression Results

| Feature | Status | Notes |
|---------|--------|-------|
| What's Closest tab | **No regression** | WhatsClosest, use-closest unchanged. |
| Parks | **No regression** | parks.ts, fetchNearestPark unchanged. |
| Hospitals | **No regression** | hospitals.ts, fetchNearestHospital unchanged. |
| Community centers | **No regression** | community-centers.ts unchanged. |
| ClosestCategoryCard | **No regression** | Component unchanged. |
| Map markers (closest) | **No regression** | CityMap uses useClosest data; unchanged. |

**Phase 2 verdict:** No code changes to Phase 2. Behavior preserved.

---

## 3. Phase 2.1 Regression Results

| Feature | Status | Notes |
|---------|--------|-------|
| Montgomery boundary | **No regression** | boundary.ts, montgomery-city-boundary.json unchanged. |
| isWithinMontgomery | **No regression** | address-store setLocation calls isWithinMontgomery. |
| Out-of-bounds notice | **No regression** | OutOfBoundsNotice component unchanged. |
| maxBounds | **No regression** | CityMap MAX_BOUNDS, maxBoundsViscosity unchanged. |
| Query gating | **No regression** | use-snapshot, use-closest use enabled: isWithinMontgomery. |

**Phase 2.1 verdict:** No code changes to Phase 2.1. Behavior preserved.

---

## 4. Phase 3 Functional Results

| Feature | Status | Notes |
|---------|--------|-------|
| What's Happening Nearby tab | **Implemented** | New tab in TabContainer, App.tsx. |
| Code Violations card | **Implemented** | code-violations.ts, HappeningCategoryCard. |
| Building Permits card | **Implemented** | building-permits.ts, HappeningCategoryCard. |
| 311 Requests card | **Implemented** | service-requests.ts, HappeningCategoryCard. |
| Count badges | **Implemented** | "X nearby" in HappeningCategoryCard. |
| Max 3 visible items | **Implemented** | items.slice(0, 3) in HappeningCategoryCard. |
| Dates shown | **Implemented** | formatDateForDisplay in each item. |
| Status labels | **Implemented** | normalizeStatus in each service. |
| Footer | **Implemented** | "Available city records may include older entries..." |
| Independent states | **Implemented** | Three separate useQuery hooks; per-category loading/empty/error. |
| Montgomery gating | **Implemented** | use-happening enabled: coordinates && isWithinMontgomery. |
| Per-category retry | **Implemented** | refetchCodeViolations, refetchBuildingPermits, refetchServiceRequests. |

**Phase 3 verdict:** Implementation complete. Live validation pending (manual test required).

---

## 5. Integration Points Verified

- Tab type extended in address-store.ts
- TabContainer TABS array includes whats-happening-nearby
- App.tsx PanelContent renders WhatsHappeningNearby for active tab
- No shared state conflicts; each phase uses its own hooks
- CityMap does not show Phase 3 markers (by design — out of scope)

---

## 6. Live Testing Status

**Live browser testing could not be performed** in this audit session because:
- `npm` and `npx` are not recognized in the terminal environment
- Node.js may not be on PATH in the audit context

**Recommendation:** Run manual validation using `docs/manual-validation-session-pack.md` and the 10-scenario matrix in `docs/qa/phase-3-test-matrix.md` before freezing Phase 3.
