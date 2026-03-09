# Validation Log
## My Address, My City

This document tracks every verification action taken during the project. It serves as evidence that the team validated AI-generated output, tested data sources, and confirmed that the app works as claimed.

The hackathon guidance explicitly emphasizes the need to verify what AI generates. This log is that proof.

---

## Validation Readiness Rules

These rules govern how validation relates to implementation and shipping:

1. **No feature is considered complete until the relevant claim in `app-claims.md` is validated.** A feature that displays data from an untested endpoint is not done — it is a risk.

2. **No later phase should start unless earlier phase validation is sufficient for a safe demo.** Moving to Phase 2 while Phase 1 has unvalidated claims means the submission is not protected.

3. **Failures and uncertainties must be logged, not hidden.** If a test fails or produces unexpected results, log it here with the date, the result, and what action was taken. Hiding a failed test is worse than documenting it — judges and team members need to see what was tried.

4. **Validation is not a one-time event.** If the city updates their GIS server or an endpoint changes behavior, previously validated claims may need re-testing. Log re-validations as new entries.

5. **AI-generated code must be reviewed before any claim it supports is marked as validated.** The fact that code was generated does not mean it works. Review and test.

---

## How to Use This Document

1. Every time a data source is tested, log the result here
2. Every time an AI-generated feature is reviewed, log the review here
3. Every time a claim from `app-claims.md` is confirmed or invalidated, update both documents
4. Keep entries in chronological order within each section
5. Be honest — log failures and surprises, not just successes

---

## Section 1: Data Source Validation

### Template

```
### [Source Name]
- **Date:** YYYY-MM-DD
- **Endpoint:** [URL]
- **Test performed:** [what you queried]
- **Test coordinates:** [lat, lng used]
- **Expected result:** [what you expected]
- **Actual result:** [what you got]
- **Status:** Confirmed / Failed / Partial / Unexpected
- **Notes:** [any observations]
- **Action taken:** [what changed as a result]
```

### Entries

*(No entries yet — this section will be populated during pre-implementation validation)*

---

## Section 2: CORS and Infrastructure Validation

### Template

```
### [Test Name]
- **Date:** YYYY-MM-DD
- **Test:** [what was tested]
- **Result:** [pass/fail + details]
- **Impact:** [what this means for architecture]
- **Action taken:** [proxy added / direct calls confirmed / etc.]
```

### Entries

### Server-Side Fetch Test (Non-Browser)
- **Date:** 2026-03-07
- **Test:** HTTP GET requests from a server-side environment (not a browser) to multiple `gis.montgomeryal.gov` endpoints including `/Zoning/FeatureServer/0?f=json`, `/Parcels/FeatureServer/0?f=json`, `/Capture/GIS_Overlays/MapServer/2`, and `opendata.montgomeryal.gov/datasets/code-violation-new`
- **Result:** All returned **HTTP 403 Forbidden**
- **Impact:** This does NOT conclusively answer the browser CORS question. Server-side fetch uses different headers than a browser. Municipal ArcGIS servers sometimes block non-browser requests (bots, scrapers) while allowing browser-origin requests. However, this is a **yellow flag** — it suggests the server may have access restrictions that also affect browsers.
- **Action taken:** Browser-based CORS test remains the mandatory first pre-implementation step. The 403 result is logged but not treated as a definitive CORS failure.

### V1 — Browser CORS Test (Attempt 1 — Inconclusive)
- **Date:** 2026-03-07
- **Test:** Browser console `fetch()` to `https://gis.montgomeryal.gov/server/rest/services/Zoning/FeatureServer/0?f=json`
- **Result:** **Inconclusive**
- **Reason:** The test was executed from a page context with a Content Security Policy (CSP) that restricts outgoing requests. The CSP of the hosting page — not the Montgomery server — blocked or interfered with the request. This does NOT constitute a real browser CORS failure from the Montgomery endpoint.
- **Impact:** Direct browser access to `gis.montgomeryal.gov` remained unconfirmed after this attempt.
- **Action taken:** V1 re-run from a clean browser context (see Attempt 2 below).

### V1 — Browser CORS Test (Attempt 2 — PASS)
- **Date:** 2026-03-07
- **Test:** Browser console `fetch()` to `https://gis.montgomeryal.gov/server/rest/services/Zoning/FeatureServer/0?f=json` executed from `about:blank`
- **Result:** **Pass**
- **Response:** The zoning endpoint returned JSON successfully from a browser `fetch()` call.
- **Impact:** This confirms that **direct browser access is viable** for at least the tested zoning endpoint on `gis.montgomeryal.gov`. The server includes CORS headers permitting browser-origin requests. A CORS proxy is **not required** for the default implementation path.
- **Action taken:** Architecture updated to reflect that direct browser access is the confirmed default path. Proxy path retained as a documented fallback only.

### V2 — Zoning Spatial Query (Live Test)
- **Date:** 2026-03-07
- **Test:** Spatial point query to `/Zoning/FeatureServer/0/query` using City Hall coordinates (x=-86.3077, y=32.3791), inSR=4326, outSR=4326, outFields=*
- **Result:** **Pass**
- **Response:** JSON with `features` array containing one feature.
- **Confirmed field values:**
  - `ZoningCode` = `T5`
  - `ZoningDesc` = `Urban Center Zone`
- **Geometry returned:** Yes, with outSR=4326 reprojection working correctly
- **Impact:** This confirms: (a) the endpoint exists and is reachable, (b) spatial point queries work, (c) field structure includes at least `ZoningCode` and `ZoningDesc`, (d) server-side reprojection via `outSR=4326` works. Zoning is now the most validated Phase 1 data source.
- **Action taken:** Claim 1.1 upgraded to "Live-tested." Data-sources.md updated.

### V4 — Flood Zone Query (Live Test)
- **Date:** 2026-03-07
- **Test:** Spatial point query to `/Capture/GIS_Overlays/MapServer/2/query` using the same point-query pattern as V2
- **Result:** **Pass**
- **Response:** JSON with `features` array containing a real feature.
- **Confirmed field values:**
  - `FLD_ZONE` — flood zone designation
  - `FLOODWAY` — floodway indicator
  - `SFHA_TF` — Special Flood Hazard Area true/false
- **Impact:** This confirms: (a) the MapServer layer supports spatial queries (the primary risk for this source is resolved), (b) the response includes usable fields for resident-facing display, (c) flood zone is now a validated Phase 1 data source. The exact resident-facing wording can be simplified later, but the underlying data is confirmed usable.
- **Action taken:** Claim 1.2 upgraded to "Live-tested." Flood zone removed from "highest-risk" designation in data-sources.md.

### V6 — Parcel Query (Residential Point Test)
- **Date:** 2026-03-07
- **Test:** Spatial point query to `/Parcels/FeatureServer/0/query` for a residential point
- **Result:** **Not usable (empty)**
- **Response:** `features` array returned empty (`[]`)
- **Impact:** This does not necessarily mean the endpoint is broken — the query may require different parameters, a different geometry type, or the test point may not intersect any parcel polygon. However, for current planning purposes, **parcels should NOT be treated as a validated Phase 1 dependency**. The endpoint exists, but query behavior is not producing usable results with the standard point-query pattern.
- **Action taken:** Parcels moved to optional/deferred status for Phase 1. Not blocked, but not relied upon.

### Phase 2.1 — Montgomery Boundary (Static Asset)
- **Date:** 2026-03-07
- **Test:** Create static boundary from official City Limits layer (OneView/City_County/MapServer/5)
- **Result:** **Partial — bbox fallback used**
- **Details:** Direct GeoJSON export from `.../MapServer/5/query?where=1%3D1&...&f=geojson` returned HTTP 403 from server-side fetch. Browser-side fetch not attempted. Used official extent-derived bbox as polygon: southWest [-86.445884, 32.206711], northEast [-86.069115, 32.481961]. Saved as `src/data/montgomery-city-boundary.json`. Point-in-polygon and maxBounds implemented.
- **Action taken:** Static local boundary created. Boundary logic and maxBounds validated in implementation.

### Phase 2.1 — Police Facilities (Nearest Police Facility)
- **Date:** 2026-03-07
- **Test:** Verify HostedDatasets/Police_Facilities/FeatureServer/0 exists and supports spatial query
- **Result:** **Pass**
- **Details:** Layer metadata fetched via Invoke-RestMethod. geometryType: esriGeometryPoint. displayField: Facility_Name. Fields: Facility_Name, Facility_Address, OBJECTID. Spatial query (25 mi radius, Montgomery center) returned features. outSR=4326 works.
- **Action taken:** Implemented as fourth What's Closest category. Service: police-facilities.ts.

### Phase 2.1 — Community Centers Activation
- **Date:** 2026-03-07
- **Test:** Activate Community Centers from HostedDatasets/Community_Centers/FeatureServer/0
- **Result:** **Implementation complete**
- **Details:** Service uses queryWithinRadius + Haversine pattern. Fields: FACILITY_N (name), TYPE, ADDRESS. Category added to ACTIVE_CATEGORIES. Live in-app test pending.
- **Action taken:** Community Centers integrated. Awaiting manual validation.

### Council District — Service Discovery
- **Date:** 2026-03-07
- **Test:** Service directory exploration for council district data
- **Result:** **Service confirmed, query not validated**
- **Findings:**
  - Confirmed service: `SDE_City_Council / MapServer`
  - Confirmed layer: id 0 = `SDE.City_Council`
  - The service exists and the layer is identified.
- **Impact:** The correct service and layer are now known. However, a spatial point query has not been executed, so query behavior (whether it returns a district number/name for a point) remains unvalidated. Council should remain **optional / pending**, not core-confirmed.
- **Action taken:** Council district endpoint updated in data-sources.md. Remains optional for Phase 1 planning. Point-query test still needed for full validation.

### Phase 3 — Code Violations
- **Date:** 2026-03-07
- **Endpoint:** `HostedDatasets/Code_Violations/FeatureServer/0`
- **Test performed:** Spatial radius query (0.5 mi from City Hall 32.3791, -86.3077)
- **Expected result:** Features with code violation attributes
- **Actual result:** **Pass** — 4 features returned. Fields: OffenceNum, CaseDate, CaseType, CaseStatus, Address1, ComplaintRem, CouncilDistrict, LienStatus
- **Status:** Confirmed
- **Notes:** Point geometry. outSR=4326 works. Same queryWithinRadius pattern as Phase 2.
- **Action taken:** Documented in phase-3-source-validation.md. Core for Phase 3.

### Phase 3 — Building Permits (Construction Permits)
- **Date:** 2026-03-07
- **Endpoint:** `HostedDatasets/Construction_Permits/FeatureServer/0`
- **Test performed:** Spatial radius query (0.5 mi from City Hall)
- **Expected result:** Features with permit attributes
- **Actual result:** **Pass** — Multiple features returned. Fields: PermitNo, IssuedDate, PermitStatus, PermitDescription, PhysicalAddress, CodeDetail (Building/Electric/Gas/Mechanic)
- **Status:** Confirmed
- **Notes:** Point geometry. Rich field set for resident-friendly cards.
- **Action taken:** Documented in phase-3-source-validation.md. Core for Phase 3.

### Phase 3 — 311 Service Requests (Received_311_Service_Request)
- **Date:** 2026-03-07
- **Endpoint:** `HostedDatasets/Received_311_Service_Request/MapServer/0`
- **Test performed:** Spatial radius query (0.5 mi from City Hall)
- **Expected result:** Features with 311 request attributes
- **Actual result:** **Pass** — 5 features returned. Fields: Request_ID, Create_Date, Department, Request_Type, Address, District, Status, Close_Date, Origin
- **Status:** Confirmed
- **Notes:** MapServer (not FeatureServer) but supports spatial query. Contains real 311 data: Building Maintenance, Urban Forestry, COM Plumbing, Fire Electrical, Tree Maintenance. **Different from QAlert_311** which is sanitation-only.
- **Action taken:** Documented in phase-3-source-validation.md. Core for Phase 3. QAlert_311 rejected.

### Phase 3 — QAlert_311 (Rejected)
- **Date:** 2026-03-07
- **Endpoint:** `QAlert/QAlert_311/MapServer`
- **Test performed:** Layer metadata inspection
- **Result:** **Rejected** — Contains City Council District, MPD District, Sanitation (bulk drop-off, recycling, garbage schedules, curbside trash). No general 311 service requests.
- **Action taken:** Do not use. Use HostedDatasets/Received_311_Service_Request instead.

---

## Section 3: Geocoding Validation

### Template

```
### [Geocoder Name] — Address Test
- **Date:** YYYY-MM-DD
- **Input address:** [address string]
- **Expected coordinates:** [approximate lat, lng]
- **Returned coordinates:** [actual lat, lng]
- **Offset:** [approximate distance error]
- **Status:** Accurate / Acceptable / Inaccurate
```

### Entries

*(No entries yet — geocoder testing is a Phase 1 pre-implementation step)*

---

## Section 4: AI-Generated Code Review

### Template

```
### [Feature / File Name]
- **Date:** YYYY-MM-DD
- **Generated by:** [AI tool used]
- **Reviewed by:** [team member]
- **Review scope:** [what was checked — logic, types, edge cases, etc.]
- **Issues found:** [list any problems]
- **Corrections made:** [list any fixes]
- **Status:** Approved / Approved with changes / Rejected
```

### Entries

*(No entries yet — will be populated as features are implemented)*

---

## Section 5: Demo Verification

### Template

```
### Demo Run [#]
- **Date:** YYYY-MM-DD
- **Phase tested:** [1/2/3/4]
- **Demo addresses used:** [list]
- **All tabs loaded:** [yes/no — list any failures]
- **Time elapsed:** [seconds]
- **Issues observed:** [list]
- **Recording made:** [yes/no]
```

### Entries

*(No entries yet — will be populated during demo rehearsals)*

---

## Section 6: Claim Verification Cross-Reference

This section tracks which claims from `app-claims.md` have been validated through actual testing.

| Claim ID | Claim Summary | Validated? | Validation Date | Notes |
|---|---|---|---|---|
| 1.1 | Zoning display | **Yes — Live-tested** | 2026-03-07 | Spatial query returned ZoningCode=T5, ZoningDesc=Urban Center Zone for City Hall. Endpoint, query behavior, field structure, and outSR=4326 reprojection all confirmed. |
| 1.2 | Flood zone display | **Yes — Live-tested** | 2026-03-07 | Spatial query returned real feature with FLD_ZONE, FLOODWAY, SFHA_TF. MapServer query support confirmed. |
| 1.3 | Council district display | **Partial — service found** | 2026-03-07 | SDE_City_Council/MapServer layer 0 confirmed. Point-query not yet tested. |
| 1.4 | Parcel / neighborhood display | **Partial** | 2026-03-07 | Parcels returned empty features for test point — not usable yet. Neighborhoods endpoint known but not queried live. |
| 1.5 | Data from official city GIS | **Partial — CORS confirmed** | 2026-03-07 | Browser fetch to gis.montgomeryal.gov works (CORS pass). Data sourcing claim strengthened but not fully verified until all queries run in-app. |
| 1.6 | Report issue link | No | — | — |
| 1.7 | Zoning verification link | No | — | — |
| 1.8 | Council contact link | No | — | — |
| 1.9 | All data from official sources | No | — | — |
| 1.10 | Read-only app | No | — | — |
| 2.1 | Nearest park | **Implementation-constrained** | 2026-03-07 | Streets_and_POI/MapServer/7 integrated. Live in-app test pending. |
| 2.2 | Nearest hospital | **Implementation-constrained** | 2026-03-07 | Health_Care_Facility FeatureServer integrated. Live in-app test pending. |
| 2.3 | Nearest community center | No | — | Category not activated; no validated source. |
| 2.4 | Distance accuracy | **Implementation-constrained** | 2026-03-07 | Haversine used; UI labels as "Approximate distance." |
| 3.1 | Code violations nearby | **Implementation-constrained** | 2026-03-07 | HostedDatasets/Code_Violations/FeatureServer/0. Integrated in Phase 3. code-violations.ts service. **2026-03-07 fix:** Extended recency to 24 months; added server-side WHERE CaseDate filter; fallback if server rejects date clause. |
| 3.2 | Building permits nearby | **Implementation-constrained** | 2026-03-07 | HostedDatasets/Construction_Permits/FeatureServer/0. Integrated in Phase 3. building-permits.ts service. |
| 3.3 | 311 requests nearby | **Implementation-constrained** | 2026-03-07 | HostedDatasets/Received_311_Service_Request/MapServer/0. Integrated in Phase 3. service-requests.ts service. Data may be archived. |
| 3.4 | Radius definition | **Implementation-constrained** | 2026-03-07 | Fixed 0.5 miles. UI discloses "Public records found within approximately 0.5 miles of this location." |
| 4.1 | Recent web context | No | — | Phase 4 only |

---

## Validation Checklist (Pre-Implementation)

These must be completed before writing service layer code:

- [x] CORS test: can browser fetch from `gis.montgomeryal.gov`? — **PASS (2026-03-07)**
- [x] Zoning endpoint: query with known Montgomery coordinates — **PASS (2026-03-07)**
- [x] Flood zone endpoint: query with known Montgomery coordinates — **PASS (2026-03-07)**
- [ ] Parcels endpoint: query with known Montgomery coordinates — **returned empty; deferred**
- [x] Council district endpoint: identify correct layer ID — **SDE_City_Council/MapServer/0 found; point-query pending**
- [ ] Neighborhoods endpoint: live query test
- [ ] Geocoder test: 5 known Montgomery addresses through Nominatim
- [x] Coordinate reprojection: verify `outSR=4326` returns WGS84 coordinates — **confirmed via V2 zoning query**

These must be completed before Phase 2 implementation:

- [x] Streets_and_POI: identify parks layer ID — **Layer 7 (City Parks) confirmed** (web research 2026-03-07)
- [x] Hospitals: locate dataset — **HostedDatasets/Health_Care_Facility FeatureServer/0** (web research 2026-03-07)
- [x] Community centers: locate dataset — **HostedDatasets/Community_Centers/FeatureServer/0 confirmed and integrated (Phase 2.1)**
- [ ] Haversine distance: test calculation with known points — implementation will validate

These must be completed before Phase 3 implementation:

- [x] Code violations: test API access — **PASS (2026-03-07)** — HostedDatasets/Code_Violations/FeatureServer/0, spatial radius query works
- [x] Building permits: test API access — **PASS (2026-03-07)** — HostedDatasets/Construction_Permits/FeatureServer/0, spatial radius query works
- [x] 311 / QAlert: determine actual content — **RESOLVED (2026-03-07)** — QAlert_311 = sanitation only (REJECT). Use HostedDatasets/Received_311_Service_Request/MapServer/0 for actual 311 requests

---

## Section 7: Phase 3 Source Validation (2026-03-07)

### Phase 3 — DCAT Catalog Discovery
- **Date:** 2026-03-07
- **Test:** Fetch DCAT feed from opendata.montgomeryal.gov to discover Phase 3 dataset endpoints
- **Endpoint:** https://opendata.montgomeryal.gov/api/feed/dcat-us/1.1.json
- **Result:** **Pass** — Server-side Invoke-RestMethod succeeded. Catalog revealed FeatureServer/MapServer URLs for Code Violations, Construction Permits, and Received 311 Service Requests on gis.montgomeryal.gov.
- **Action taken:** Documented correct endpoints. Open Data Portal dataset pages (opendata.montgomeryal.gov/datasets/...) returned 403 from mcp_web_fetch; DCAT feed is the discovery path.

### Phase 3 — QAlert_311 MapServer (Sanitation Service)
- **Date:** 2026-03-07
- **Test:** Inspect QAlert/QAlert_311/MapServer layer list
- **Endpoint:** https://gis.montgomeryal.gov/server/rest/services/QAlert/QAlert_311/MapServer?f=json
- **Result:** **Confirmed — NOT 311 requests**
- **Findings:** Layers: City Council District (0), MPD District (1), Sanitation group (2) with sublayers: Saturday Bulk DropOff, Recycling Locations, Regular Garbage Schedule, Holiday Garbage Schedule, Curbside Trash Schedule. No general 311 service request data.
- **Action taken:** QAlert_311 marked REJECT for Phase 3. Use HostedDatasets/Received_311_Service_Request instead.

### Phase 3 — Code Violations FeatureServer
- **Date:** 2026-03-07
- **Test:** Layer metadata + spatial radius query (0.5 mi from City Hall)
- **Endpoint:** HostedDatasets/Code_Violations/FeatureServer/0
- **Result:** **Pass**
- **Field structure:** OffenceNum, CaseDate, CaseType, CaseStatus, LienStatus, Address1, CouncilDistrict, ComplaintRem, etc. Point geometry.
- **Spatial query:** geometry + distance=0.5 + units=esriSRUnit_StatuteMile returned 4+ features. exceededTransferLimit=true indicates more data available.
- **Action taken:** Code Violations validated. Core for Phase 3.

### Phase 3 — Construction Permits FeatureServer
- **Date:** 2026-03-07
- **Test:** Layer metadata + spatial radius query (0.5 mi from City Hall)
- **Endpoint:** HostedDatasets/Construction_Permits/FeatureServer/0
- **Result:** **Pass**
- **Field structure:** PermitNo, IssuedDate, PermitStatus, PermitDescription, ProjectType, PhysicalAddress, CodeDetail (Building/Electric/Gas/Mechanic), etc. Point geometry.
- **Spatial query:** Same radius pattern returned 4+ features with real permit data.
- **Action taken:** Building/Construction Permits validated. Core for Phase 3.

### Phase 3 — Received 311 Service Requests MapServer
- **Date:** 2026-03-07
- **Test:** Layer metadata + spatial radius query (0.5 mi from City Hall)
- **Endpoint:** HostedDatasets/Received_311_Service_Request/MapServer/0
- **Result:** **Pass**
- **Field structure:** Request_ID, Create_Date, Department, Request_Type, Address, District, Status, Close_Date, Origin. Point geometry.
- **Sample data:** Building Maintenance (COM Plumbing, Fire Electrical, Fire Carpentry), Urban Forestry (Tree Maintenance). Real 311 service requests.
- **Caveat:** Layer has isDataArchived=true; startArchivingMoment suggests archival. Data from 2021 confirmed. Recency of updates TBD.
- **Action taken:** 311 Service Requests validated. Core for Phase 3. Use this endpoint, NOT QAlert_311.

### Phase 3 — Implementation Complete
- **Date:** 2026-03-07
- **Test:** Full Phase 3 implementation per locked plan
- **Result:** **Implementation complete**
- **Files added:** src/types/happening.ts, src/utils/format-date.ts, src/utils/normalize-status.ts, src/services/datasets/code-violations.ts, src/services/datasets/building-permits.ts, src/services/datasets/service-requests.ts, src/features/happening/use-happening.ts, src/features/happening/WhatsHappeningNearby.tsx, src/components/cards/HappeningCategoryCard.tsx
- **Integration:** Tab "What's Happening Nearby" added between What's Closest and Next Steps. Montgomery-only gating applied. Three independent queries (code violations, building permits, 311 requests). Radius 0.5 miles fixed and disclosed in UI.
- **Action taken:** Phase 3 MVP implemented. Awaiting manual regression and demo validation.
