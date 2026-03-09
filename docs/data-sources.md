# Data Sources
## My Address, My City

**Author:** Aicardo Barco Fajardo · abarcof@gmail.com

This document inventories all data sources planned for the application, grouped by build phase. Each source includes a validation status reflecting what has been confirmed as of the documentation date.

---

## Validation Status Definitions

Each data source has four independent verification dimensions:

| Dimension | What it means |
|---|---|
| **Endpoint existence** | The URL or service name has been confirmed in the ArcGIS REST directory, open data portal, or indexed search results |
| **Query behavior** | A spatial or attribute query has been executed against the endpoint and returned a parseable response |
| **Field structure** | The response field names and types have been inspected and mapped to app-level types |
| **App readiness** | The data source has been integrated into the app, tested end-to-end, and displays correctly in the UI |

### Summary Status Labels

| Status | Meaning |
|---|---|
| **Endpoint confirmed** | The endpoint URL, service type, and layer ID have been found in directory listings or search indexes. No live query has been executed. |
| **Partially verified** | Endpoint confirmed AND at least one additional dimension (query behavior or field structure) has been partially observed, but not fully tested in-app. |
| **Needs validation** | Referenced in research or PRD but no concrete endpoint or dataset page has been confirmed. May not exist in the expected form. |
| **Live-tested** | A live query has been executed and the response inspected. Field names are known. Not yet integrated into app. |
| **App-ready** | Fully integrated and tested in the running app. |

**Note on server accessibility:** Server-side fetch attempts to `gis.montgomeryal.gov` returned HTTP 403 Forbidden. However, a subsequent **browser-side `fetch()` test from `about:blank` succeeded (2026-03-07)**, confirming that the server includes CORS headers for browser-origin requests. **Direct browser access is the confirmed default implementation path.** A CORS proxy is not required but remains documented as a fallback.

---

## ArcGIS Server Base URL

```
https://gis.montgomeryal.gov/server/rest/services
```

All ArcGIS endpoints below are relative to this base unless otherwise noted.

### Important Technical Notes

- **Spatial reference:** Montgomery's ArcGIS services use SRID 102629 (State Plane Alabama West, US feet). Leaflet uses WGS84 (EPSG:4326). All queries should request `outSR=4326` for server-side reprojection, or use `proj4` client-side.
- **Max record count:** ArcGIS services return a maximum of 2000 records per request. Point-based lookups (Phase 1–2) are unaffected. Area queries (Phase 3) may need spatial filtering to stay within limits.
- **CORS:** **Direct browser access to `gis.montgomeryal.gov` is confirmed working (2026-03-07).** A browser `fetch()` from `about:blank` returned JSON successfully. The server includes CORS headers permitting browser-origin requests. A proxy is **not required** for the default implementation path. The proxy strategy is retained in `architecture.md` as a documented fallback only.

---

## Phase 1 — Shippable MVP

### Zoning

| Field | Value |
|---|---|
| Endpoint | `/Zoning/FeatureServer/0` |
| Type | FeatureServer |
| Query method | Spatial query by point (intersects) |
| Spatial reference | 102629 (State Plane Alabama West); `outSR=4326` confirmed working |
| Endpoint existence | **Confirmed** |
| Query behavior | **Live-tested — Pass** — spatial point query returned a feature for City Hall coordinates (2026-03-07) |
| Field structure | **Confirmed** — response includes at least `ZoningCode` (e.g., "T5") and `ZoningDesc` (e.g., "Urban Center Zone"). Geometry returned successfully with outSR=4326 reprojection. Full field list may contain additional attributes not yet cataloged. |
| App readiness | **Not started** — but data source is validated for implementation |
| Source | https://gis.montgomeryal.gov/server/rest/services/Zoning/FeatureServer |
| Notes | Single "Zoning" layer at ID 0. Polygon geometry. MaxRecordCount 2000. Supports JSON and Query operations. Has versioned data. This is now the **most validated Phase 1 data source**. Live test confirmed endpoint, query behavior, field structure, and coordinate reprojection all work. |

### Parcels

| Field | Value |
|---|---|
| Endpoint | `/Parcels/FeatureServer/0` |
| Type | FeatureServer |
| Query method | Spatial query by point (intersects) |
| Spatial reference | 102629 (State Plane Alabama West); `outSR=4326` works |
| Endpoint existence | **Confirmed** — appears in ArcGIS REST directory |
| Query behavior | **Partially verified (2026-03-07)** — City Hall (32.377, -86.3009) returns 1 feature. Residential (2560 Bell Rd) returns empty. Partial coverage; graceful empty state required. |
| Field structure | **Confirmed** — `ParcelNo`, `PID`, `OwnerName`, `PropertyAddr1`, `PropertyCity`, `PropertyState`, `PropertyZip`, `TotalValue`, `Calc_Acre`. ParcelNo primary. Property record card displays owner, situs address, assessed value, land acres. |
| App readiness | **App-ready (2026-03-07)** — Integrated in This Address. Link to property records: https://montgomery.capturecama.com/ |
| Source | https://gis.montgomeryal.gov/server/rest/services/Parcels/FeatureServer |
| Notes | Layer ID 0. Polygon geometry. Partial coverage across Montgomery. Show empty state where no parcel found. Property lookup link: montgomery.capturecama.com (Montgomery County Citizen Access Portal). |

### Flood Hazard Zones

| Field | Value |
|---|---|
| Endpoint | `/Capture/GIS_Overlays/MapServer/2` |
| Type | MapServer layer |
| Query method | Spatial query by point (intersects) |
| Spatial reference | 102629 (State Plane Alabama West); `outSR=4326` expected to work (confirmed on other services) |
| Endpoint existence | **Confirmed** |
| Query behavior | **Live-tested — Pass (2026-03-07)** — spatial point query returned a real feature. MapServer query support is confirmed for this layer. |
| Field structure | **Confirmed** — response includes at least `FLD_ZONE` (flood zone designation), `FLOODWAY` (floodway indicator), `SFHA_TF` (Special Flood Hazard Area true/false). Additional fields may exist but are not yet cataloged. |
| App readiness | **Not started** — but data source is validated for implementation |
| Source | https://gis.montgomeryal.gov/server/rest/services/Capture/GIS_Overlays/MapServer/2 |
| Notes | Originally the highest-risk Phase 1 source due to MapServer query uncertainty. **That risk is now resolved.** Spatial queries work. The confirmed fields are sufficient for resident-facing flood context display. Other layers in this service: Historic Properties (ID 1), Tree Inventory (IDs 4, 5), City Owned Properties (ID 6), Zoning (ID 7). |

### Council Districts

| Field | Value |
|---|---|
| Endpoint | `/SDE_City_Council/MapServer/0` (preferred) |
| Type | MapServer |
| Query method | Spatial query by point (intersects) — **not yet tested** |
| Endpoint existence | **Confirmed (2026-03-07)** — `SDE_City_Council/MapServer` exists with layer 0 = `SDE.City_Council`. This is the most likely council district polygon layer. |
| Query behavior | **Not tested** — service discovered but no spatial point query has been executed |
| Field structure | **Unknown** — field names not yet retrieved |
| App readiness | **Not started — optional for Phase 1** |
| Source | https://gis.montgomeryal.gov/server/rest/services/SDE_City_Council/MapServer |
| Notes | Service discovery confirmed the correct endpoint. The earlier candidate `CityCouncil_and__Territories/FeatureServer` was found to contain Code Enforcement Districts at layer 5, not city council districts. `SDE_City_Council/MapServer/0` is the most promising layer. **Council remains optional for Phase 1** — it may be added during implementation if the point-query validates cleanly, but Phase 1 does not depend on it. |

### Neighborhoods

| Field | Value |
|---|---|
| Endpoint | `/NSD_Neighborhoods/FeatureServer/0` |
| Type | FeatureServer |
| Query method | Spatial query by point (intersects) |
| Spatial reference | **3857 (Web Mercator)** — different from other services |
| Endpoint existence | **Confirmed** — layer metadata indexed in search results |
| Query behavior | **Not tested** — no live query executed yet |
| Field structure | **Known** — display field is `NEIGHBRHD` (String, length 50). Other fields: `Id` (Integer), `OBJECTID`, `Shape__Length`, `Shape__Area` |
| App readiness | **Not started** |
| Source | https://gis.montgomeryal.gov/server/rest/services/NSD_Neighborhoods/FeatureServer/0 |
| Notes | Layer "NSD Neighborhoods" at ID 0. Polygon geometry. MaxRecordCount 2000. Supports advanced queries and statistics. **Important:** This service uses EPSG:3857 (Web Mercator), NOT 102629 like other services. Query parameter `inSR=4326` should work since it supports datum transformation. Rendered with light purple fill and 50% transparency. |

### Geocoding (Address Search)

| Field | Value |
|---|---|
| Primary option | Nominatim / OpenStreetMap geocoder |
| Fallback option | ArcGIS World Geocoder (requires free developer API key) |
| Local option | Montgomery County Address Points layer (if available as FeatureServer with search capability) |
| Endpoint existence | **Confirmed** — Nominatim is a public, free API at `nominatim.openstreetmap.org`. ArcGIS World Geocoder requires a developer account. |
| Query behavior | **Not tested** — no Montgomery-specific accuracy test has been performed with any geocoder |
| Field structure | **Known for Nominatim** — returns JSON with `lat`, `lon`, `display_name`. Standard, well-documented API. |
| App readiness | **Not started** |
| Notes | Geocoding is NOT city-provided data. It is an external service used to convert user-typed addresses into coordinates. If Nominatim is used, the app must not claim that address lookup comes from "official city data." Accuracy threshold for Phase 1: geocoded point must land close enough that zoning/flood/district queries return correct results (~100m tolerance). See `phase-1-validation-plan.md` V3 for testing protocol. |

---

## City Boundary (Phase 2.1)

### Montgomery City Limits

| Field | Value |
|---|---|
| Official source | OneView/City_County/MapServer/5 (City Limits) |
| Type | MapServer layer, esriGeometryPolygon |
| Static asset | `src/data/montgomery-city-boundary.json` |
| Derivation | Extent-derived bbox polygon (GeoJSON). Direct GeoJSON export from layer query returned 403 from server-side; bbox from official extent used as fallback. |
| Fallback bbox (lat/lng) | southWest: [32.206711, -86.445884], northEast: [32.481961, -86.069115] |
| Usage | Point-in-polygon validation, Leaflet maxBounds, Montgomery-only civic lookups |
| Notes | Boundary is static and local. No runtime fetch. Bbox matches official City Limits layer extent (Web Mercator converted to WGS84). |

---

## Phase 2 — What's Closest

### Parks (City Parks)

| Field | Value |
|---|---|
| Endpoint | `/Streets_and_POI/MapServer/7` |
| Type | MapServer layer |
| Query method | Spatial query within radius (candidates) + Haversine nearest client-side |
| Status | **Validated with centroid handling** |
| Source | https://gis.montgomeryal.gov/server/rest/services/Streets_and_POI/MapServer/7 |
| Notes | City Parks is layer 7 within Streets_and_POI. Geometry may be point or polygon; polygon sources use centroid for distance and marker placement. Name field TBD at implementation (likely `NAME` or `FACILITY_NAME`). Browser validation recommended to confirm field names. |

### Hospitals (Health Care Facilities)

| Field | Value |
|---|---|
| Endpoint | `/HostedDatasets/Health_Care_Facility/FeatureServer/0` |
| Type | FeatureServer |
| Query method | Spatial query within radius + Haversine nearest client-side |
| Status | **Validated** |
| Source | https://gis.montgomeryal.gov/server/rest/services/HostedDatasets/Health_Care_Facility/FeatureServer/0 |
| Notes | Health Care Facility layer includes hospitals, health centers, urgent care, nursing homes. Point geometry. Filter by facility type for hospitals only if field exists; otherwise show nearest health facility. Name field TBD at implementation. |

### Community Centers

| Field | Value |
|---|---|
| Endpoint | `/HostedDatasets/Community_Centers/FeatureServer/0` |
| Type | FeatureServer |
| Query method | Spatial query within radius + Haversine nearest client-side |
| Status | **Validated — Phase 2.1** |
| Source | https://gis.montgomeryal.gov/server/rest/services/HostedDatasets/Community_Centers/FeatureServer/0 |
| Notes | Point geometry. Fields: FACILITY_N (display name), TYPE, ADDRESS. Integrated in Phase 2.1 hardening. Uses same queryWithinRadius + Haversine pattern as parks and hospitals. |

### Police Facilities

| Field | Value |
|---|---|
| Endpoint | `/HostedDatasets/Police_Facilities/FeatureServer/0` |
| Type | FeatureServer |
| Query method | Spatial query within radius + Haversine nearest client-side |
| Status | **Live-tested (2026-03-07)** |
| Source | https://gis.montgomeryal.gov/server/rest/services/HostedDatasets/Police_Facilities/FeatureServer/0 |
| Notes | Point geometry. displayField: Facility_Name. Fields: Facility_Name, Facility_Address. Integrated as fourth What's Closest category. |

### City Boundary (Montgomery Limits)

| Field | Value |
|---|---|
| Endpoint | `/OneView/City_County/MapServer/5` (City Limits) |
| Type | MapServer layer |
| Status | **Static local asset — Phase 2.1** |
| Source | https://gis.montgomeryal.gov/server/rest/services/OneView/City_County/MapServer/5 |
| Local asset | `src/data/montgomery-city-boundary.json` |
| Notes | Official City Limits layer. GeoJSON export from server returned 403; static bbox polygon derived from official extent used instead. Fallback bbox: southWest [-86.445884, 32.206711], northEast [-86.069115, 32.481961] (lng, lat). Used for point-in-polygon validation and Leaflet maxBounds. |

### Fire Stations / Shelters

| Field | Value |
|---|---|
| Endpoint | TBD |
| Type | TBD |
| Status | **Needs validation** |
| Notes | Administrative boundaries for fire districts exist; whether point locations of fire stations are published as a queryable layer is unconfirmed. |

---

## Phase 3 — Nearby City Records

### Code Violations

| Field | Value |
|---|---|
| Endpoint | `/HostedDatasets/Code_Violations/FeatureServer/0` |
| Type | FeatureServer |
| Query method | Spatial query within radius (same pattern as Phase 2) |
| Status | **Live-tested (2026-03-07)** |
| Source | https://gis.montgomeryal.gov/server/rest/services/HostedDatasets/Code_Violations/FeatureServer/0 |
| Portal reference | opendata.montgomeryal.gov/datasets/CityMGM::code-violations-5 (DCAT) |
| Notes | Point geometry. Fields: OffenceNum, CaseDate, CaseType, CaseStatus, LienStatus, Address1, CouncilDistrict, ComplaintRem. Spatial radius query (0.5 mi) confirmed. outSR=4326 works. **24-month filter:** Server-side WHERE CaseDate >= (24 months ago); client-side filter reinforces. Fallback to no date filter if server rejects. |

### Building / Construction Permits

| Field | Value |
|---|---|
| Endpoint | `/HostedDatasets/Construction_Permits/FeatureServer/0` |
| Type | FeatureServer |
| Query method | Spatial query within radius |
| Status | **Live-tested (2026-03-07)** |
| Source | https://gis.montgomeryal.gov/server/rest/services/HostedDatasets/Construction_Permits/FeatureServer/0 |
| Portal reference | opendata.montgomeryal.gov/datasets/CityMGM::construction-permit-data (DCAT) |
| Notes | Point geometry. Fields: PermitNo, IssuedDate, PermitStatus, PermitDescription, ProjectType, PhysicalAddress, CodeDetail (Building/Electric/Gas/Mechanic). Spatial radius query confirmed. **12-month client-side filter:** Records with IssuedDate older than 12 months are excluded from display. |

### 311 Service Requests (Received)

| Field | Value |
|---|---|
| Endpoint | `/HostedDatasets/Received_311_Service_Request/MapServer/0` |
| Type | MapServer |
| Query method | Spatial query within radius |
| Status | **Live-tested (2026-03-07)** |
| Source | https://gis.montgomeryal.gov/server/rest/services/HostedDatasets/Received_311_Service_Request/MapServer/0 |
| Portal reference | opendata.montgomeryal.gov/datasets/CityMGM::received-311-service-requests-1 (DCAT) |
| Notes | Point geometry. Fields: Request_ID, Create_Date, Department, Request_Type, Address, District, Status, Close_Date, Origin. Real 311 requests (Building Maintenance, Urban Forestry, etc.). **Use this endpoint, NOT QAlert_311.** Layer has isDataArchived=true; data recency TBD. **Not integrated in app** — code violations and building permits only. |

### Trash & Recycling Schedule (QAlert_311 MapServer layer 6)

| Field | Value |
|---|---|
| Endpoint | `/QAlert/QAlert_311/MapServer/6` |
| Type | MapServer layer |
| Query method | Spatial query by point (intersects) |
| Endpoint existence | **Confirmed** |
| Query behavior | **Live-tested (2026-03-07)** — City Hall and residential (2560 Bell Rd) both return 1 feature. |
| Field structure | **Confirmed** — `Day_1`, `Day_2` (e.g. "Wednesday", "Friday"). No route field in this layer. Format as "Day_1 & Day_2". |
| App readiness | **App-ready (2026-03-07)** — Integrated in This Address. |
| Source | https://gis.montgomeryal.gov/server/rest/services/QAlert/QAlert_311/MapServer |
| Notes | Layer 6 contains garbage collection schedule. Layer 0 = council reps; layer 1 = districts. **Use layer 6 only for trash schedule.** Montgomery garbage is twice weekly (e.g. Wed & Fri). |

### QAlert_311 (REJECTED for 311 — Use for Trash Schedule Only)

| Field | Value |
|---|---|
| Endpoint | `/QAlert/QAlert_311/MapServer` |
| Type | MapServer |
| Status | **Layer 6 used for Trash & Recycling in This Address** |
| Notes | Contains sanitation/garbage schedules (layer 6), council districts (layer 1), MPD districts. **Does NOT contain general 311 service requests.** For 311, use HostedDatasets/Received_311_Service_Request. |

---

## Phase 4 — Bonus Layer

### Bright Data Enrichment

| Field | Value |
|---|---|
| Endpoint | Bright Data API (external) |
| Type | Web scraping / SERP API |
| Status | **Not started** |
| Notes | Optional enrichment layer. Would pull recent public web context related to a Montgomery address or area (news, public notices, official pages). Only to be implemented if the core app is stable and the bonus does not risk the submission. Bright Data integration details will be defined in Phase 4 planning only. |

---

## Open Data Portal

**URL:** https://opendata.montgomeryal.gov/

The Montgomery Open Data Portal runs on ArcGIS Hub. Datasets may be available via:
- Direct download (CSV, GeoJSON, Shapefile)
- Hub API (JSON REST endpoints auto-generated for each dataset)
- Embedded FeatureServer links (if the dataset is backed by an ArcGIS service)

The exact API access pattern for each dataset must be confirmed by visiting the individual dataset page and checking the "API" or "Access" section.

---

## Validation Checklist (Pre-Implementation)

Before writing any service code, the following must be manually tested:

- [x] Can `gis.montgomeryal.gov` be queried from a browser (CORS test)? — **PASS**
- [x] Does `/Zoning/FeatureServer/0/query` return zoning attributes for a known Montgomery coordinate? — **PASS**
- [x] Does `/Capture/GIS_Overlays/MapServer/2/query` return flood zone data? — **PASS**
- [x] What is the correct layer ID for council districts? — **SDE_City_Council/MapServer/0 identified; query pending**
- [ ] Does `/Parcels/FeatureServer/0/query` return parcel data for a known coordinate? — **returned empty; deferred**
- [ ] Does `/NSD_Neighborhoods/FeatureServer/0/query` return neighborhood name for a known coordinate?
- [ ] Does Nominatim geocode "103 N Perry St, Montgomery, AL" accurately?
- [x] Coordinate reprojection: `outSR=4326` confirmed via zoning query

Phase 2+:
- [x] What layers exist inside `/Streets_and_POI/MapServer`?
- [x] Does the code-violation-new dataset have a spatial API? — **Yes — HostedDatasets/Code_Violations/FeatureServer/0 (2026-03-07)**
- [x] Does the building permits dataset have a spatial API? — **Yes — HostedDatasets/Construction_Permits/FeatureServer/0 (2026-03-07)**
- [x] What does QAlert_311 actually contain — general 311 or sanitation only? — **Sanitation only. Use HostedDatasets/Received_311_Service_Request/MapServer/0 for actual 311 requests (2026-03-07)**

---

## Recommended Validation Order — Updated Status

Ranked by Phase 1 importance and technical risk. Updated 2026-03-07.

| Priority | Test | Status |
|---|---|---|
| 1 | ~~**CORS test**~~ | **DONE — PASS (2026-03-07).** Browser fetch from `about:blank` succeeded. Direct access confirmed. |
| 2 | ~~**Zoning query**~~ | **DONE — PASS (2026-03-07).** ZoningCode=T5, ZoningDesc=Urban Center Zone confirmed. outSR=4326 works. |
| 3 | **Geocoding test** — Nominatim with 3–5 Montgomery addresses | **Still needed.** Address search is a Phase 1 core feature. |
| 4 | ~~**Flood zone query**~~ | **DONE — PASS (2026-03-07).** FLD_ZONE, FLOODWAY, SFHA_TF confirmed. MapServer queries work. |
| 5 | **Neighborhoods query** — `/NSD_Neighborhoods/FeatureServer/0/query` | **Still needed.** Field structure known (NEIGHBRHD). Low risk. |
| 6 | **Council district** — `/SDE_City_Council/MapServer/0/query` point test | **Optional.** Service discovered, layer 0 identified. Point-query not tested. Deferred from Phase 1 core. |
| 7 | ~~**Parcels query**~~ | **Tested — empty result (2026-03-07).** Deferred from Phase 1 core. |
| 8 | ~~**Coordinate reprojection**~~ | **Confirmed via V2 zoning query.** outSR=4326 works. |

**Remaining critical validation for Plan Mode:** Geocoding (V3) is the last critical-path item. Neighborhoods (V7) is low risk. Council and parcels are optional.

Phase 2+ and Phase 3+ validations can wait until their respective phases are about to begin.

---

## Supplementary Sources — Out of Scope Unless Specifically Validated

ArcGIS Online (`services7.arcgis.com` and similar hosted service URLs) may contain additional city-related datasets published by Montgomery or third parties. These are **not part of the Phase 1 core** and must not be added to the data source inventory unless:

1. A specific dataset is identified by URL and confirmed to contain Montgomery-specific data
2. The dataset is validated for field structure and query behavior
3. A clear reason exists for preferring it over the primary `gis.montgomeryal.gov` endpoints

The primary server (`gis.montgomeryal.gov`) is the authoritative source for Phase 1. Supplementary ArcGIS Online sources are noted here for awareness only and should not expand scope.
