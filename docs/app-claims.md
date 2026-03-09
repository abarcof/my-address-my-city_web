# App Claims Registry
## My Address, My City

**Author:** Aicardo Barco Fajardo · abarcof@gmail.com

This document lists every factual claim the app makes or implies to residents. Each claim must trace to a verified data source. Claims that cannot be supported must not ship.

---

## How to Use This Document

- Before shipping a feature, add its claims here
- Each claim has a verification status
- Claims marked "Not yet verified" must be validated before the feature goes live
- If a claim cannot be verified, the feature must be modified or removed

---

## Claim Status Definitions

| Status | Meaning |
|---|---|
| **Verified** | Claim confirmed by querying the actual data source and observing the expected response |
| **Partially verified** | Data source exists and is documented, but the specific claim has not been tested end-to-end |
| **Not yet verified** | Claim is planned but the underlying data has not been validated |
| **Unsupportable** | Claim cannot be backed by available data — must not ship |

---

## Phase 1 Claims

### This Address Module

| # | Claim the app makes | Data source | Status |
|---|---|---|---|
| 1.1 | "This location is zoned as [type]" | Zoning FeatureServer `/Zoning/FeatureServer/0` | **Live-tested (2026-03-07)** — spatial query returned `ZoningCode=T5`, `ZoningDesc=Urban Center Zone` for City Hall coordinates. Endpoint, query behavior, field structure, and `outSR=4326` reprojection all confirmed. This claim is supportable with the confirmed field names. |
| 1.2 | "This location is in [flood zone category]" | Flood Hazard Zones, GIS_Overlays MapServer layer 2 | **Live-tested (2026-03-07)** — spatial query returned real feature with `FLD_ZONE`, `FLOODWAY`, `SFHA_TF`. MapServer query support confirmed. This claim is supportable with the confirmed field names. |
| 1.3 | "This location is in Council District [number/name]" | Multiple sources with fallback chain | **Implementation-constrained (2026-03-08)** — Tries (1) SDE_City_Council/MapServer/0, (2) Capture/CityCouncil_and__Territories layers 0–4, (3) proxy from Code Violations (CouncilDistrict) within 0.15 mi, (4) proxy from 311 (District) within 0.15 mi. Proxy method inferred from nearby records when polygon layers return empty. City Hall (103 N Perry St) returns District 3 via 311 proxy. Shows "Council district data not available" only when all sources fail. |
| 1.4 | "This location is in [neighborhood]" | NSD_Neighborhoods FeatureServer | **Endpoint confirmed** — field structure known (`NEIGHBRHD`). Live query not yet executed. High confidence based on FeatureServer type. |
| 1.5 | "This location has parcel ID [id]" and property record (owner, address, assessed value, land acres) | Parcels FeatureServer `/Parcels/FeatureServer/0` | **Implementation-constrained (2026-03-07)** — City Hall returns ParcelNo, OwnerName, PropertyAddr1, TotalValue, Calc_Acre; residential (2560 Bell Rd) may return empty. Partial coverage. Shows empty state where no parcel found. Link to montgomery.capturecama.com for full property lookup. |
| 1.6 | "Trash and recycling pickup is [schedule]" | QAlert_311 MapServer layer 6 | **Live-tested (2026-03-07)** — Layer 6 returns Day_1, Day_2 (e.g. "Wednesday", "Friday"). City Hall and residential both return data. Format: "Day_1 & Day_2". |
| 1.7 | "Data sourced from City of Montgomery official GIS" | All of the above | **Strengthened (2026-03-07)** — browser CORS confirmed working. Architecture routes all data queries directly to `gis.montgomeryal.gov` from the browser. The claim is now stronger because direct browser access is confirmed and no proxy intermediary is needed. Must still be re-verified once all Phase 1 queries are running in-app. If any query falls back to cached/static data, this claim must be qualified. |

### City Resources Module

| # | Claim the app makes | Data source | Status |
|---|---|---|---|
| 1.8 | "Report an issue to the city" | Link to Montgomery's official reporting tool | Not yet verified — need to confirm the correct URL |
| 1.9 | "Verify zoning with the city" | Link to Montgomery GIS Viewer / zoning page | Partially verified — GIS Viewer exists at `montgomeryal.gov` |
| 1.10 | "Contact your council district" | Link to council contact page | Not yet verified — need to confirm URL |

### General Phase 1 Claims

| # | Claim the app makes | Data source | Status |
|---|---|---|---|
| 1.11 | "All data is from official Montgomery city sources" | App uses only `gis.montgomeryal.gov` and `opendata.montgomeryal.gov` | **Design-constrained, partially strengthened (2026-03-07)** — CORS confirmed; browser fetches data directly from `gis.montgomeryal.gov` with no intermediary. This claim holds true as long as: (a) no third-party data is introduced, (b) the geocoder is not counted as "city data" (Nominatim is OpenStreetMap, not city-provided). Recommended scoped wording: "Property data sourced from City of Montgomery GIS." The address lookup itself is not city data unless Montgomery's own address points are used. |
| 1.12 | "The app is read-only and informational" | App design — no write operations | **Implementation-constrained** — the architecture specifies read-only. This is guaranteed by the code if implemented as designed (no POST/PUT/DELETE to city endpoints, no user accounts, no form submissions). Must be confirmed in code review. Until the app is built and reviewed, this is an intent, not a verified fact. |

---

### Montgomery-Only Validation (Phase 2.1)

| # | Claim the app makes | Data source | Status |
|---|---|---|---|
| 2.0 | "This app is designed for locations inside the City of Montgomery" | Static boundary from OneView/City_County/MapServer/5 (City Limits) | **Implementation-constrained** — boundary derived from official extent. Point-in-polygon check on address geocode and map click. Outside-Montgomery shows friendly message; no city-specific lookups run. |

---

## Phase 2 Claims

### What's Closest Module

| # | Claim the app makes | Data source | Status |
|---|---|---|---|
| 2.1 | "The nearest park is [name] at [distance]" | Streets_and_POI MapServer layer 7 (City Parks) | **Validated with centroid handling** — layer 7 confirmed. Name/geometry fields to be confirmed in-app. |
| 2.2 | "The nearest hospital is [name] at [distance]" | HostedDatasets/Health_Care_Facility FeatureServer | **Validated** — point geometry, includes hospitals. Name field to be confirmed in-app. |
| 2.3 | "The nearest community center is [name] at [distance]" | HostedDatasets/Community_Centers/FeatureServer/0 | **Implementation-constrained (Phase 2.1)** — official source confirmed. Uses FACILITY_N for name. Live in-app test pending. |
| 2.4 | Distance values shown to users | Haversine calculation on WGS84 coordinates | **Implementation-constrained** — Haversine gives straight-line distance. UI must label as "Approximate distance" or "Straight-line distance." |
| 2.5 | "The nearest police facility is [name] at [distance]" | HostedDatasets/Police_Facilities/FeatureServer/0 | **Live-tested (2026-03-07)** — spatial query confirmed. Fields: Facility_Name, Facility_Address. |

---

## Phase 3 Claims

### Nearby City Records Module (What's Happening Nearby)

| # | Claim the app makes | Data source | Status |
|---|---|---|---|
| 3.1 | "There are [N] code violations near this address" | HostedDatasets/Code_Violations/FeatureServer/0 | **Implementation-constrained (2026-03-07)** — endpoint validated, spatial radius query works. Integrated in Phase 3. |
| 3.2 | "Recent building permits were issued nearby" | HostedDatasets/Construction_Permits/FeatureServer/0 | **Implementation-constrained (2026-03-07)** — endpoint validated, spatial radius query works. Integrated in Phase 3. |
| 3.3 | Radius used for "nearby" | Fixed 0.5 miles, disclosed in UI | **Implementation-constrained** — UI states "Records from the last 12 months within 0.5 mi." |
| 3.4 | Records shown are from the last 12 months | Client-side filter on CaseDate, IssuedDate | **Implementation-constrained** — Code violations and building permits: 12 months. Records with invalid dates are excluded. 311 is not implemented. |

---

## Phase 4 Claims

### Official Live Context (Bright Data Bonus)

| # | Claim the app makes | Data source | Status |
|---|---|---|---|
| 4.1 | "The app can optionally run a live web search of official city domains and show up to 3 results — public notices, permits, news" | Bright Data SERP API; domains montgomeryal.gov, capture.montgomeryal.gov, gis.montgomeryal.gov | **Implementation-constrained (2026-03-08)** — Module implemented. Server-side only. Uses SERP API for dynamic, contextual results; not static links. Disabled by default. |

**Rule:** Any content from Bright Data must be clearly labeled as official website context and not presented as official city GIS/dataset data. This module is supplemental only.

---

## Claims That Must NOT Be Made

These claims would be unsupportable and must be avoided in all UI copy and demo narration:

| Claim to avoid | Why |
|---|---|
| "This is the official city portal" | The app is a hackathon project, not a city-sanctioned tool |
| "This data is always up to date" | We have no control over how often the city updates its GIS layers |
| "You are [X] minutes from [resource]" | We calculate straight-line distance, not travel time |
| "This area is safe / unsafe" | The app does not make safety judgments |
| "You should / should not buy property here" | The app does not provide real estate advice |
| "There are no issues near this address" | Absence of data does not mean absence of issues |
