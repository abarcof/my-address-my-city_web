# Phase 2.1 Hardening Report
## My Address, My City

**Date:** 2026-03-07  
**Scope:** Controlled hardening pass — no Phase 3, no redesign, preserve Phase 1 and Phase 2 behavior.

---

## 1. Executive Summary

Phase 2.1 hardening successfully added:

- **Community Centers** as the third active category in "What's Closest"
- **Static Montgomery boundary** stored locally as `src/data/montgomery-city-boundary.json`
- **Map maxBounds** focused on Montgomery
- **Montgomery-only validation** for address geocode and map click
- **Friendly outside-Montgomery message** replacing technical geofence language

All existing Phase 1 and Phase 2 behavior is preserved. The app remains stable and demoable.

---

## 2. What Was Added

| Item | Description |
|------|-------------|
| Community Centers | Third "What's Closest" category using HostedDatasets/Community_Centers/FeatureServer/0. Uses FACILITY_N for display name, Haversine distance. |
| Static boundary | `src/data/montgomery-city-boundary.json` — polygon derived from official City Limits extent bbox |
| Boundary utility | `src/utils/boundary.ts` — `isWithinMontgomery()`, `MONTGOMERY_BOUNDS`, point-in-polygon (ray-casting) |
| maxBounds | Leaflet `maxBounds` and `maxBoundsViscosity={0.5}` on MapContainer |
| Montgomery-only validation | `isWithinMontgomery` in address store; snapshot and closest queries disabled when outside |
| Friendly OOB message | "Sorry — this app is designed for locations inside the City of Montgomery, so we can't show city-specific information outside city limits." |

---

## 3. Boundary Strategy Used

- **Source:** OneView/City_County/MapServer/5 (City Limits layer)
- **Approach:** Direct GeoJSON export from the layer returned HTTP 403 from server-side fetch. Used the **official extent-derived bbox** as a rectangular polygon.
- **Bbox values (lng, lat):**
  - southWest: [-86.445884, 32.206711]
  - northEast: [-86.069115, 32.481961]

---

## 4. Local GeoJSON Boundary

**Yes.** A local static boundary file was created:

- **Path:** `src/data/montgomery-city-boundary.json`
- **Format:** GeoJSON FeatureCollection with one Polygon feature
- **Content:** Rectangle polygon from the official extent bbox (5 vertices, closed ring)
- **Properties:** `source: "OneView/City_County/MapServer/5 City Limits"`, `derived: "extent bbox"`

The boundary is imported at build time and used for point-in-polygon checks. No runtime fetch to the city server.

---

## 5. maxBounds Implementation Details

- **Values:** `L.latLngBounds([32.206711, -86.445884], [32.481961, -86.069115])` (Leaflet uses [lat, lng])
- **Placement:** `MapContainer` in `CityMap.tsx`
- **Options:** `maxBounds={MAX_BOUNDS}`, `maxBoundsViscosity={0.5}`
- **Effect:** Map stays focused on Montgomery; panning is constrained to the city extent.

---

## 6. Community Centers Validation and Activation Result

- **Endpoint:** HostedDatasets/Community_Centers/FeatureServer/0
- **Fields used:** FACILITY_N (primary name), NAME, ADDRESS, TYPE
- **Implementation:** `src/services/datasets/community-centers.ts` — same pattern as parks and hospitals (queryWithinRadius + Haversine nearest)
- **Activation:** Added to `ACTIVE_CATEGORIES` in `use-closest.ts`; category order: parks → community-centers → hospitals
- **Status:** Implementation complete. Live in-app validation recommended before demo.

---

## 7. Regressions Found and Fixed

- **use-closest enabled:** Initially used `useAddressStore.getState().isWithinMontgomery` (non-reactive). Fixed to use the reactive `isWithinMontgomery` from the hook.
- **WhatsClosest:** Added `OutOfBoundsNotice` when `!isWithinMontgomery`; added missing `OutOfBoundsNotice` import.
- **Loading state:** WhatsClosest loading skeleton updated to show three cards (parks, community centers, hospitals).

No other regressions identified. Address search, map click, This Address, What's Closest, Next Steps, and out-of-bounds handling behave as expected.

---

## 8. Freeze Recommendation After Phase 2.1

**Recommendation:** Freeze Phase 2.1 and perform a manual regression pass before starting Phase 3.

**Checklist:**

- [ ] Address search (Montgomery address)
- [ ] Map click (inside Montgomery)
- [ ] Map click (outside Montgomery) → friendly message
- [ ] This Address tab (inside / outside)
- [ ] What's Closest tab — parks, community centers, hospitals
- [ ] Next Steps tab
- [ ] maxBounds — map cannot pan outside Montgomery
- [ ] Markers for selected point and nearest places

---

## Files Created/Modified

| File | Action |
|------|--------|
| `src/data/montgomery-city-boundary.json` | Created |
| `src/utils/boundary.ts` | Created |
| `src/services/datasets/community-centers.ts` | Implemented (was stub) |
| `src/store/address-store.ts` | Added `isWithinMontgomery` |
| `src/features/closest/use-closest.ts` | Added community-centers, Montgomery-only enabled |
| `src/features/snapshot/use-snapshot.ts` | Montgomery-only enabled |
| `src/components/map/CityMap.tsx` | Added maxBounds |
| `src/components/feedback/OutOfBoundsNotice.tsx` | Updated message |
| `src/features/snapshot/ThisAddress.tsx` | OOB notice when outside |
| `src/features/closest/WhatsClosest.tsx` | OOB notice when outside, 3 loading cards |
| `src/features/snapshot/NextSteps.tsx` | OOB notice when outside |
| `docs/data-sources.md` | Community Centers, City Boundary |
| `docs/validation-log.md` | Phase 2.1 entries |
| `docs/app-claims.md` | Claims 2.0, 2.3 |
| `docs/qa/phase-2-1-hardening-report.md` | Created |
