# What's Closest — Categories Analysis
## Verification and Recommendations

**Date:** 2026-03-07  
**Purpose:** Verify user-provided list against current implementation and Montgomery GIS; recommend which categories to add.

---

## 1. Corrections to Your List

### Community Centers — CORRECTED

**Your list says:** ❌ NO CONFIRMED — "Solo existen como POI dentro de Streets_and_POI, sin capa dedicada"

**Actual status:** ✅ **CONFIRMED and already implemented**

- **Source:** `HostedDatasets/Community_Centers/FeatureServer/0`
- **Status:** Dedicated layer with FACILITY_N, TYPE, ADDRESS
- **Implementation:** `src/services/datasets/community-centers.ts` — live in app
- **Conclusion:** Community Centers have a dedicated FeatureServer. Your list may be outdated or from a different research pass.

### Parks — SOURCE CLARIFICATION

**Your list says:** Basemap/MapServer layer 6 "City Parks"

**Our implementation:** `Streets_and_POI/MapServer/7` — City Parks

**Verification:** Web research and our docs confirm **Streets_and_POI/MapServer/7** is the City Parks layer. Basemap/MapServer/6 may be a different or duplicate layer. We are using the correct, validated source. No change needed.

### Hospitals — PATH DIFFERENCE

**Your list says:** `Health_Care_Facility/MapServer`

**Our implementation:** `HostedDatasets/Health_Care_Facility/FeatureServer/0`

**Verification:** FeatureServer is the correct path (MapServer may be a different view). Our implementation is working. No change needed.

---

## 2. Currently Implemented (What We Have)

| Category | Endpoint | Status |
|----------|----------|--------|
| Parks | Streets_and_POI/MapServer/7 | ✅ Live |
| Community Centers | HostedDatasets/Community_Centers/FeatureServer/0 | ✅ Live |
| Hospitals | HostedDatasets/Health_Care_Facility/FeatureServer/0 | ✅ Live |
| Police Facilities | HostedDatasets/Police_Facilities/FeatureServer/0 | ✅ Live (2026-03-07) |

---

## 3. Your "Confirmed" List — Assessment

| Element | Your claim | Verification | Recommendation |
|---------|------------|--------------|----------------|
| **Parques** | Basemap/MapServer layer 6 | We use Streets_and_POI/7 (correct). Basemap/6 not verified. | Keep current — no change |
| **Hospitales** | Health_Care_Facility/MapServer | We use FeatureServer/0 (correct) | Keep current — no change |
| **Instalaciones Policiales** | HostedDatasets/Police_Facilities/FeatureServer | Web search did not find explicit reference. User claims Facility_Name, Facility_Address confirmed. | **Add if browser-validated** — high civic value |
| **Calles y POI generales** | Streets_and_POI/FeatureServer | Very broad. Multiple layers (parks, POI, etc.). "Nearest POI" is vague. | **Low priority** — would need specific layer and use case |

---

## 4. Recommended Additions (Priority Order)

### Priority 1: Police Facilities (nearest police station)

- **Endpoint:** `HostedDatasets/Police_Facilities/FeatureServer/0`
- **Fields (per your list):** Facility_Name, Facility_Address
- **Civic value:** High — residents want to know where the nearest police facility is
- **Risk:** Endpoint must be validated in browser (server-side fetch returns 403)
- **Action:** Run a browser console test before implementing:
  ```
  fetch('https://gis.montgomeryal.gov/server/rest/services/HostedDatasets/Police_Facilities/FeatureServer/0?f=json')
    .then(r=>r.json()).then(console.log)
  ```
  If it returns layer metadata, run a spatial query to confirm.

### Priority 2: (Reserved)

- **Fire stations** — Your list says not confirmed. If you find `HostedDatasets/Fire_Stations` or similar, validate and add.
- **Schools** — Your list says not exposed. Skip unless a public endpoint is found.

### Do Not Add

| Element | Reason |
|---------|--------|
| Streets_and_POI general POI | Too vague; no clear resident-facing "nearest X" value without picking a specific layer |
| Basemap/MapServer/6 | Redundant with Streets_and_POI/7; Parks already covered |
| Fire stations, schools, bus routes, recycling, voting | Per your list — not confirmed |

---

## 5. Implementation Checklist for Police Facilities

If Police_Facilities validates in browser:

1. Add `police-facilities` to `ClosestCategory` in `src/types/closest.ts`
2. Create `src/services/datasets/police-facilities.ts` (copy pattern from `community-centers.ts`)
3. Use Facility_Name → name, Facility_Address → address
4. Add to `ACTIVE_CATEGORIES` and `fetchCategory` in `use-closest.ts`
5. Update `ClosestCategoryCard` FALLBACK_NAMES and loading messages
6. Update `WhatsClosest.tsx` loading skeleton (add 4th card)
7. Update `CityMap.tsx` markers (closestItems already maps all)
8. Update `docs/data-sources.md` and `docs/app-claims.md`
9. Run manual validation

---

## 6. Summary

| Item | Status | Action |
|------|--------|--------|
| Parks | ✅ Implemented correctly | None |
| Community Centers | ✅ Implemented correctly | None — your list had incorrect "not confirmed" |
| Hospitals | ✅ Implemented correctly | None |
| Police Facilities | ⚠️ User claims confirmed | Validate in browser → add if pass |
| Streets_and_POI general | ❓ Too broad | Skip unless specific layer identified |
| Fire, schools, bus, recycling, voting | ❌ Not confirmed | Do not add |

---

## 7. Validation Required Before Adding Police Facilities

Before implementing, run this in the browser console (at `about:blank` or your app origin):

```javascript
// 1. Check layer exists
const url = 'https://gis.montgomeryal.gov/server/rest/services/HostedDatasets/Police_Facilities/FeatureServer/0?f=json';
fetch(url).then(r => r.json()).then(d => console.log('Layer:', d));

// 2. If layer exists, run a spatial query (Montgomery center)
const queryUrl = 'https://gis.montgomeryal.gov/server/rest/services/HostedDatasets/Police_Facilities/FeatureServer/0/query?where=1%3D1&geometry=%7B%22x%22%3A-86.3%2C%22y%22%3A32.37%7D&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&distance=25&units=esriSRUnit_StatuteMile&outFields=*&returnGeometry=true&outSR=4326&f=json';
fetch(queryUrl).then(r => r.json()).then(d => console.log('Query result:', d));
```

If both return valid JSON with features, proceed with implementation.
