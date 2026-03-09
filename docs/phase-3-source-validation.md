# Phase 3 Source Validation Report
## My Address, My City — What's Happening Nearby

**Date:** 2026-03-07  
**Scope:** Validation and discovery only. No code changes.

---

## 1. Executive Summary

All three Phase 3 data categories were validated. **Two sources are usable now** (Code Violations, Building Permits). **One source required discovery** — the originally documented QAlert_311 service contains sanitation schedules only; the actual 311 service requests are in a different service (`HostedDatasets/Received_311_Service_Request`), which is **usable now**.

| Source | Status | Access | Spatial | Recommendation |
|--------|--------|--------|---------|----------------|
| Code Violations | **Usable now** | FeatureServer | Radius query works | **Core** |
| Building Permits | **Usable now** | FeatureServer | Radius query works | **Core** |
| 311 Service Requests | **Usable now** | MapServer | Radius query works | **Core** |
| QAlert_311 (original) | **Reject** | MapServer | N/A | Sanitation only — not 311 requests |

**Key finding:** The DCAT catalog at `opendata.montgomeryal.gov/api/feed/dcat-us/1.1.json` revealed the correct endpoints. Code Violations and Building Permits are on `gis.montgomeryal.gov` as HostedDatasets, not on the Open Data Portal as flat downloads. The 311 dataset is `HostedDatasets/Received_311_Service_Request/MapServer/0`, not `QAlert/QAlert_311`.

**Browser feasibility:** All validated endpoints are on `gis.montgomeryal.gov`. CORS was confirmed working for this server (2026-03-07). Server-side Invoke-RestMethod succeeded for all three. Browser access is expected to work.

---

## 2. Source-by-Source Validation

### 2.1 Code Violations

| Dimension | Result |
|-----------|--------|
| **A. Source status** | **Usable now** |
| **B. Access pattern** | FeatureServer — `HostedDatasets/Code_Violations/FeatureServer/0` |
| **C. Browser feasibility** | Direct browser access expected (same server as validated CORS) |
| **D. Spatial feasibility** | Can query by radius — `distance` + `units=esriSRUnit_StatuteMile` confirmed |
| **E. Field structure** | See below |
| **F. Product recommendation** | **Core for Phase 3** |

**Endpoint:**
```
https://gis.montgomeryal.gov/server/rest/services/HostedDatasets/Code_Violations/FeatureServer/0
```

**Geometry:** Point (esriGeometryPoint)

**Key fields for resident-friendly cards:**
| Field | Type | Use |
|-------|------|-----|
| OffenceNum | String | Case ID |
| CaseDate | Date | When reported |
| CaseType | String | e.g. NUISANCE |
| CaseStatus | String | OPEN, CLOSED |
| Address1 | String | Street address |
| ComplaintRem | String | Description (may be null) |
| CouncilDistrict | String | District |
| LienStatus | String | Lien info |

**Live test:** Spatial radius query (0.5 mi from City Hall) returned 4 features. Sample: OffenceNum C00136396, CaseType NUISANCE, CaseStatus CLOSED, Address1 "425 ALABAMA ST", CaseDate 2022-06-22.

---

### 2.2 Building Permits (Construction Permits)

| Dimension | Result |
|-----------|--------|
| **A. Source status** | **Usable now** |
| **B. Access pattern** | FeatureServer — `HostedDatasets/Construction_Permits/FeatureServer/0` |
| **C. Browser feasibility** | Direct browser access expected |
| **D. Spatial feasibility** | Can query by radius — confirmed |
| **E. Field structure** | See below |
| **F. Product recommendation** | **Core for Phase 3** |

**Endpoint:**
```
https://gis.montgomeryal.gov/server/rest/services/HostedDatasets/Construction_Permits/FeatureServer/0
```

**Geometry:** Point (esriGeometryPoint)

**Key fields for resident-friendly cards:**
| Field | Type | Use |
|-------|------|-----|
| PermitNo | String | Permit ID |
| IssuedDate | Date | When issued |
| PermitStatus | String | e.g. ISSUED |
| PermitDescription | String | e.g. "Alteration/Rennovation Commercial" |
| PhysicalAddress | String | Project address |
| CodeDetail | String | Building, Electric, Gas, Mechanic |
| ProjectType | String | New, Alteration, Existing |

**Live test:** Spatial radius query (0.5 mi from City Hall) returned multiple features. Sample: PermitNo BD250036, PermitDescription "Alteration/Rennovation Commercial", PhysicalAddress "200 COOSA ST MONTGOMERY AL 36104", IssuedDate 2025-01-08.

---

### 2.3 311 Service Requests

| Dimension | Result |
|-----------|--------|
| **A. Source status** | **Usable now** |
| **B. Access pattern** | MapServer — `HostedDatasets/Received_311_Service_Request/MapServer/0` |
| **C. Browser feasibility** | Direct browser access expected |
| **D. Spatial feasibility** | Can query by radius — MapServer supports spatial query, confirmed |
| **E. Field structure** | See below |
| **F. Product recommendation** | **Core for Phase 3** |

**Endpoint:**
```
https://gis.montgomeryal.gov/server/rest/services/HostedDatasets/Received_311_Service_Request/MapServer/0
```

**Important:** This is **not** `QAlert/QAlert_311/MapServer`. That service contains sanitation schedules (garbage, recycling, curbside trash). The actual 311 service requests are in `HostedDatasets/Received_311_Service_Request`.

**Geometry:** Point (esriGeometryPoint)

**Key fields for resident-friendly cards:**
| Field | Type | Use |
|-------|------|-----|
| Request_ID | Integer | Request ID |
| Create_Date | Date | When created |
| Department | String | e.g. Building Maintenance, Urban Forestry |
| Request_Type | String | e.g. COM Plumbing, Tree Maintenance, Fire Electrical |
| Address | String | Request address |
| Status | String | Closed, etc. |
| District | Integer | Council district |

**Live test:** Spatial radius query (0.5 mi from City Hall) returned 5 features. Sample: Request_ID 317650, Department "Building Maintenance", Request_Type "COM Plumbing", Address "25 WASHINGTON AVE", Status "Closed", Create_Date 2021.

**Caveat:** Layer has `isDataArchived: true` with `startArchivingMoment`. Data may be historical. Sample records are from 2021. Verify recency during implementation; if only old data, label accordingly in UI.

---

### 2.4 QAlert_311 (Original Candidate) — REJECTED

| Dimension | Result |
|-----------|--------|
| **A. Source status** | **Not usable** — wrong content |
| **B. Access pattern** | MapServer |
| **C. Browser feasibility** | N/A |
| **D. Spatial feasibility** | N/A |
| **E. Field structure** | N/A |
| **F. Product recommendation** | **Reject** |

**Endpoint:** `QAlert/QAlert_311/MapServer`

**Layers:** City Council District, MPD District, Sanitation (Bulk Drop-Off, Recycling, Garbage Schedule, Holiday Schedule, Curbside Trash). **No 311 service request points.** This service is for sanitation routing, not "what's happening nearby" in the 311 sense.

**Action:** Do not use. Use `HostedDatasets/Received_311_Service_Request/MapServer/0` instead.

---

## 3. Technical Feasibility Summary

| Requirement | Code Violations | Building Permits | 311 Requests |
|-------------|-----------------|------------------|--------------|
| Endpoint exists | Yes | Yes | Yes |
| Same server as Phase 1–2 (gis.montgomeryal.gov) | Yes | Yes | Yes |
| Spatial query by radius | Yes | Yes | Yes |
| Point geometry | Yes | Yes | Yes |
| outSR=4326 | Yes | Yes | Yes |
| Resident-friendly fields | Yes | Yes | Yes |
| maxRecordCount 2000 | Yes | Yes | Yes |

**Implementation pattern:** All three can use the existing `queryWithinRadius` from `arcgis-client.ts` with `servicePath`:
- `HostedDatasets/Code_Violations/FeatureServer/0`
- `HostedDatasets/Construction_Permits/FeatureServer/0`
- `HostedDatasets/Received_311_Service_Request/MapServer/0` (MapServer supports same query params)

---

## 4. Product Recommendation per Source

| Source | Recommendation | Rationale |
|--------|----------------|-----------|
| Code Violations | **Core** | Validated, spatial query works, resident value high |
| Building Permits | **Core** | Validated, spatial query works, resident value high |
| 311 Service Requests | **Core** | Validated, correct service found, resident value high |
| QAlert_311 | **Reject** | Wrong content (sanitation only) |

---

## 5. Final Recommendation for Smallest Viable Phase 3

**All three validated sources (Code Violations, Building Permits, 311 Service Requests) are safe to implement as core Phase 3.**

- Use 0.5 mile radius (consistent with Phase 2 patterns; document in UI)
- Reuse `queryWithinRadius` from arcgis-client
- Create services: `code-violations.ts`, `construction-permits.ts`, `received-311.ts`
- Create `WhatsHappening.tsx` tab with three category cards
- Gate by `isWithinMontgomery` (same as snapshot and closest)
- No optional/deferred sources — all three are validated and low-risk

**Ready to move into planning mode.**
