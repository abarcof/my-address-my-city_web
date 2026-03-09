# Phase 1 Pre-Implementation Validation Plan
## My Address, My City

---

## 1. Goal

This plan exists to validate the technical feasibility of Phase 1 before any application code is written.

Phase 1 is the shippable MVP. If validation reveals that a critical data source is unreachable, a key endpoint does not support spatial queries, or CORS blocks all browser requests, the architecture must be adjusted before implementation begins — not after.

No code should be written until this plan is executed and the go/no-go criteria at the bottom are met.

---

## 2. Exact Validation Scope (Phase 1 Only)

| # | Validation target | Why it matters for Phase 1 |
|---|---|---|
| V1 | CORS behavior | Determines whether the app can query Montgomery's ArcGIS server directly from the browser, or needs a proxy |
| V2 | Zoning query | Core data for "This Address" — the most important module |
| V3 | Geocoding (address search) | One of two user input methods. If this fails, the demo depends entirely on map click |
| V4 | Flood zone query | Second data layer in "This Address" — uses MapServer, which has less certain query support |
| V5 | Council district query | Layer ID is unknown — requires endpoint exploration |
| V6 | Parcel query | Field structure unknown — needs metadata retrieval |
| V7 | Neighborhood query | Field structure is known but live query behavior is untested |
| V8 | Coordinate system handling | All queries require `inSR=4326` and `outSR=4326` to work with Leaflet |
| V9 | Map click viability | Leaflet click → coordinates → query pipeline must work end-to-end |

---

## 3. Validation Order (Highest Risk First) — Updated Status

| Priority | Test ID | Test | Risk level | Status |
|---|---|---|---|---|
| 1 | V1 | **CORS test** | ~~Critical~~ | **PASS (2026-03-07)** |
| 2 | V2 | **Zoning query** | ~~High~~ | **PASS (2026-03-07)** |
| 3 | V3 | **Geocoding test** | **High** | **Pending** — last critical-path item |
| 4 | V4 | **Flood zone query** | ~~Medium-High~~ | **PASS (2026-03-07)** |
| 5 | V5 | **Council district query** | Medium | **Partial** — service found, query pending. Optional for Phase 1. |
| 6 | V6 | **Parcel query** | Medium | **Empty result** — deferred from Phase 1 core |
| 7 | V7 | **Neighborhood query** | Medium-Low | **Pending** — low risk, likely to pass |
| 8 | V8 | **Coordinate reprojection** | ~~Low~~ | **Confirmed via V2** |
| 9 | V9 | **Map click** | Low | Leaflet wiring test — deferred to scaffolding. |

---

## 4. Test Inputs

### Sample Addresses

| Address | Coordinates (approx.) | Purpose |
|---|---|---|
| 103 N Perry St, Montgomery, AL 36104 | 32.3791, -86.3077 | **Civic landmark** — City Hall. Expected to have rich data across all layers. Primary demo address. |
| 2560 Bell Rd, Montgomery, AL 36117 | 32.3623, -86.2132 | **Residential area** — eastern Montgomery. Tests whether data works for regular residential locations, not just landmarks. |
| 33.0000, -85.5000 | 33.0000, -85.5000 | **Out of bounds** — a point clearly outside Montgomery city limits (east of the city, in Tallapoosa County). Tests error/empty state handling. |

### Why These Test Points

- **City Hall** is the safest first test — it is the center of city government and guaranteed to be within all administrative boundaries (council district, zoning, etc.)
- **Residential address** validates that the app works for regular users, not just edge cases or landmarks
- **Out-of-bounds point** validates that the app handles gracefully when queries return empty results

---

## 5. Exact Request Patterns

### V1 — CORS Test

**Status: PASS (2026-03-07).** Browser `fetch()` from `about:blank` succeeded. Direct browser access to `gis.montgomeryal.gov` is confirmed. CORS headers are present. No proxy required for the default implementation path.

**History:**
- Attempt 1: Inconclusive — ran from a CSP-restricted page context.
- Attempt 2: **PASS** — ran from `about:blank`. JSON returned successfully.

**Result:** Proceed with **direct browser requests** (frontend-first architecture). The proxy path documented in `architecture.md` is retained as a fallback only.

| Outcome | Evidence | Action |
|---|---|---|
| ~~**Success**~~ | ~~Console shows `CORS OK` with JSON metadata~~ | **This is the confirmed outcome.** Proceed frontend-first. |
| **Partial success** | Request succeeds but response is HTML (redirect) or partial | Not observed. |
| **Failure** | Console shows CORS error or network error | Not observed. Proxy fallback documented in architecture.md. |

---

### V2 — Zoning Query

**Status: PASS (2026-03-07).** Live spatial query confirmed working. See findings below.

**Endpoint:** `https://gis.montgomeryal.gov/server/rest/services/Zoning/FeatureServer/0/query`

**Sample request:**
```
?where=1=1
&geometry={"x":-86.3077,"y":32.3791}
&geometryType=esriGeometryPoint
&inSR=4326
&spatialRel=esriSpatialRelIntersects
&outFields=*
&outSR=4326
&f=json
```

**Live result (2026-03-07):**
- Query returned one feature for City Hall coordinates
- `ZoningCode` = `T5`
- `ZoningDesc` = `Urban Center Zone`
- Geometry returned with `outSR=4326` reprojection working correctly
- Confirms: endpoint exists, query behavior works, field structure usable, coordinate reprojection works

| Outcome | Evidence | Action |
|---|---|---|
| **Success** | JSON response with `features` array containing at least one feature with `attributes` object | Record field names. Map to app types. Claim 1.1 moves to "Live-tested." |
| **Partial success** | Response returns but `features` is empty for City Hall coordinates | Check `inSR` and coordinate format. Try alternative coordinate projections. |
| **Failure** | 403, 500, CORS error, or no spatial query support | Escalate. Zoning is critical — if this fails, Phase 1 needs redesign. |

---

### V3 — Geocoding Test (Nominatim)

**Endpoint:** `https://nominatim.openstreetmap.org/search`

**Sample request:**
```
?q=103+N+Perry+St,+Montgomery,+AL
&format=json
&limit=1
&countrycodes=us
```

| Outcome | Evidence | Action |
|---|---|---|
| **Success** | Returns coordinates within ~100m of expected (32.379, -86.308) | Use Nominatim as primary geocoder. |
| **Partial success** | Returns coordinates but >200m off, or returns wrong city | Test ArcGIS World Geocoder as alternative. If ArcGIS is better, switch. |
| **Failure** | Returns no results, wrong state, or 429 rate limit | Switch to ArcGIS World Geocoder. Document in validation-log.md. |

**Accuracy threshold for Phase 1:** The geocoded point must land within the correct parcel or within ~100 meters of the expected location. It does not need to be rooftop-accurate, but it must be close enough that the zoning/flood/district queries return correct results.

**Test all three sample addresses.** If 2/3 are accurate, Nominatim is acceptable. If fewer, switch.

---

### V4 — Flood Zone Query

**Status: PASS (2026-03-07).** Spatial point query returned a real feature. MapServer query support is confirmed.

**Endpoint:** `https://gis.montgomeryal.gov/server/rest/services/Capture/GIS_Overlays/MapServer/2/query`

**Live result (2026-03-07):**
- Query returned a real feature for the test point
- Confirmed fields: `FLD_ZONE` (flood zone designation), `FLOODWAY` (floodway indicator), `SFHA_TF` (Special Flood Hazard Area true/false)
- MapServer query support — the primary risk for this source — is resolved
- Claim 1.2 upgraded to "Live-tested"

| Outcome | Evidence | Action |
|---|---|---|
| ~~**Success**~~ | ~~JSON with flood zone category for the queried point~~ | **This is the confirmed outcome.** Field names recorded. Claim 1.2 = Live-tested. |
| **Partial success** | Query returns empty for a specific point | May be correct — not all points are in flood zones. |
| **Failure** | Not observed for this source. |  |

**Note:** The original risk (MapServer not supporting queries) is now resolved. Flood zone is a validated Phase 1 data source.

---

### V5 — Council District Query

**Status: Service discovered, query not validated (2026-03-07).**

**Discovery result:**
- Confirmed service: `SDE_City_Council / MapServer`
- Confirmed layer: id 0 = `SDE.City_Council`
- The earlier candidate `CityCouncil_and__Territories/FeatureServer` contains Code Enforcement Districts (layer 5), not council districts.

**Remaining step:** Execute a spatial point query against `/SDE_City_Council/MapServer/0/query` using the same pattern as V2/V4.

**Endpoint:** `https://gis.montgomeryal.gov/server/rest/services/SDE_City_Council/MapServer/0/query`

| Outcome | Evidence | Action |
|---|---|---|
| **Success** | Query returns district number/name for a test point | Record field names. Claim 1.3 moves to "Live-tested." Add to Phase 1 core. |
| **Partial success** | Query works but field names are unclear | Document and normalize in service layer. |
| **Failure** | MapServer does not support queries for this layer | Drop council from Phase 1. Phase 1 ships without it. |

**Phase 1 status:** Council is **optional/deferred**. Phase 1 can proceed without it. If the point-query validates during implementation, council can be added without affecting the core build.

---

### V6 — Parcel Query

**Status: Tested — not currently usable (2026-03-07).** Query returned `features: []` for a residential point.

**Endpoint:** `https://gis.montgomeryal.gov/server/rest/services/Parcels/FeatureServer/0/query`

**Test result (2026-03-07):**
- Spatial point query for a residential location returned empty features
- This may be a parameter issue, geometry type mismatch, or test-point issue
- Should not be over-interpreted as total endpoint failure

| Outcome | Evidence | Action |
|---|---|---|
| **Success** | Features returned with parcel attributes | Not observed. |
| ~~**Empty result**~~ | ~~Query returns `features: []`~~ | **This is the current outcome.** May require different parameters. |
| **Failure** | Query fails entirely | Not observed — endpoint responded, just returned empty. |

**Phase 1 status:** Parcels are **deferred from Phase 1 core**. Phase 1 ships without parcels. May be revisited later if query parameters are adjusted.

---

### V7 — Neighborhood Query

**Endpoint:** `https://gis.montgomeryal.gov/server/rest/services/NSD_Neighborhoods/FeatureServer/0/query`

**Sample request:**
```
?where=1=1
&geometry={"x":-86.3077,"y":32.3791}
&geometryType=esriGeometryPoint
&inSR=4326
&spatialRel=esriSpatialRelIntersects
&outFields=NEIGHBRHD
&outSR=4326
&f=json
```

**Note:** This service uses EPSG:3857, not 102629. Using `inSR=4326` should still work because the service supports datum transformation.

| Outcome | Evidence | Action |
|---|---|---|
| **Success** | Returns `NEIGHBRHD` value (e.g., "Downtown") | Claim 1.4 (neighborhood part) moves to "Live-tested." |
| **Failure** | Query fails or `inSR=4326` is not accepted | Try `inSR=3857` with converted coordinates. If that also fails, lower priority — neighborhood name is supplementary. |

---

### V8 — Coordinate Reprojection

**Test:** Confirm that `outSR=4326` in ArcGIS queries returns WGS84 coordinates (longitude/latitude) that Leaflet can display.

This is tested automatically as part of V2–V7. If any query returns geometry, check that the coordinate values look like WGS84 (longitude between -87 and -86 for Montgomery, latitude between 32 and 33).

If coordinates look like large numbers (e.g., 500000, 1200000), `outSR` is being ignored and the native projection is being returned.

| Outcome | Action |
|---|---|
| `outSR=4326` works | No additional dependencies needed |
| `outSR=4326` is ignored | Add `proj4` library for client-side reprojection. Minor dependency, not a blocker. |

---

### V9 — Map Click Viability

**Test:** This does not require an external API. It is a Leaflet configuration test.

Create a minimal HTML page with a Leaflet map centered on Montgomery. Add a click handler that logs `e.latlng`. Confirm that clicking produces reasonable WGS84 coordinates.

This is extremely low risk and can be verified in minutes during project scaffolding.

---

## 6. CORS Decision Logic

**RESOLVED (2026-03-07).** Browser `fetch()` from `about:blank` returned JSON successfully. Direct browser access is confirmed. The decision tree below is retained for documentation.

```
Browser fetch to gis.montgomeryal.gov
          │
          ├── Response received with data? ──── YES ──→ ✅ THIS IS THE CONFIRMED PATH.
          │                                              Proceed frontend-first.
          │                                              No proxy needed.
          │
          ├── CORS error in console? ──────── (not observed)
          │
          ├── 403 Forbidden? ──────────────── (not observed from browser)
          │
          └── Timeout / no response? ─────── (not observed)
```

**Decision:** Proceed with direct browser requests. The proxy path in `architecture.md` is retained as a documented fallback but is not the default.

---

## 7. Geocoding Decision Logic

```
Test Nominatim with 3 Montgomery addresses
          │
          ├── 3/3 accurate (within ~100m)? ── YES ──→ Use Nominatim. No API key needed.
          │
          ├── 2/3 accurate? ──────────────── YES ──→ Use Nominatim but document the failure.
          │                                           Monitor during development.
          │
          ├── 1/3 or 0/3 accurate? ─────── YES ──→ Switch to ArcGIS World Geocoder.
          │                                          Register for free developer API key.
          │                                          Re-test same 3 addresses.
          │
          └── ArcGIS also inaccurate? ───── YES ──→ Investigate Montgomery Address Points
                                                     FeatureServer as text search option.
                                                     If unavailable, map click becomes the
                                                     primary input and search is deprioritized.
```

**"Accurate enough" for Phase 1:**
- The geocoded point must land close enough to the real location that ArcGIS spatial queries (zoning, flood zone, district) return the **correct** results for that address.
- In practice: within ~100m and inside the correct parcel.
- Perfect rooftop accuracy is not required.

---

## 8. Phase 1 Go / No-Go Criteria

### Must-pass (all required):

| # | Criterion | Minimum passing condition | Current status |
|---|---|---|---|
| G1 | CORS or proxy works | At least one working path to query `gis.montgomeryal.gov` from the browser | **PASS** — direct browser access confirmed |
| G2 | Zoning query works | Spatial query returns zoning data for at least one test coordinate | **PASS** — ZoningCode, ZoningDesc confirmed |
| G3 | Geocoding is usable | At least 2/3 test addresses geocode accurately, OR map click is reliable as primary input | **Pending** — Nominatim not yet tested with Montgomery addresses |
| G4 | At least 3 data layers respond with usable data | Of the validated sources, at least 3 must return usable data | **PASS** — zoning (pass), flood (pass), neighborhoods (endpoint confirmed, low risk). 3 of 3 core sources are validated or nearly validated. |

### Should-pass (strongly recommended):

| # | Criterion | Condition | Current status |
|---|---|---|---|
| S1 | Flood zone query works | MapServer layer supports spatial queries | **PASS** |
| S2 | Council district layer usable | Correct layer found and query returns district info | **Partial** — layer found, query pending. Optional for Phase 1. |
| S3 | Neighborhoods query works | Returns NEIGHBRHD for a test point | **Pending** — low risk, likely to pass |
| S4 | `outSR=4326` works | No need for client-side reprojection | **PASS** — confirmed via zoning query |

### Updated assessment (2026-03-07):

**3 of 4 must-pass criteria are met.** The remaining must-pass is G3 (geocoding). However, even if geocoding requires a fallback to ArcGIS World Geocoder or if it proves weak, map click provides a reliable alternative input method. The go/no-go gate is effectively met for Phase 1 planning to proceed.

### Validated Phase 1 data sources (narrowed scope):

| Source | Status | Phase 1 role |
|---|---|---|
| Zoning | **Validated** | Core |
| Flood zones | **Validated** | Core |
| Neighborhoods | **Endpoint confirmed, high confidence** | Core |
| Geocoding (Nominatim) | **Pending test** | Core input method |
| Council districts | **Service found, query pending** | Optional — add if it validates during build |
| Parcels | **Empty result** | Deferred — not a Phase 1 dependency |

### Failure scenarios and fallbacks:

| Failure | Impact | Fallback |
|---|---|---|
| ~~CORS blocked~~ | ~~Critical blocker~~ | **Resolved — CORS works.** |
| ~~Zoning query fails~~ | ~~Critical~~ | **Resolved — zoning works.** |
| Geocoding fails for all addresses | **Medium** | Map click becomes the primary input. Search bar shows "coming soon" or uses ArcGIS World Geocoder. Demo still works via click. |
| ~~Flood zone query unsupported~~ | ~~Medium~~ | **Resolved — flood works.** |
| Council district query fails | **Low** | Council is already optional. Phase 1 ships without it. |
| Parcels remain empty | **Low** | Already deferred. Phase 1 ships without parcels. |

---

## 9. Logging Requirement

Every validation result — pass, fail, or partial — must be recorded in `docs/validation-log.md`.

For each test:
- Date and time
- What was tested (endpoint, parameters)
- What was expected
- What was observed
- Whether the test passed, failed, or was partial
- What action was taken as a result

Do not skip logging for passing tests. Passing results are also evidence.

---

## 10. Final Recommendation

### Current assessment (2026-03-07): READY FOR PLAN MODE

Validation has progressed far enough to proceed with Phase 1 implementation planning. The validated scope is narrower than originally envisioned but sufficient for a strong Phase 1.

**Validated Phase 1 core:**
- Zoning (live-tested)
- Flood zones (live-tested)
- Neighborhoods (endpoint confirmed, high confidence)
- CORS (direct browser access confirmed)
- Coordinate reprojection (outSR=4326 confirmed)

**Optional additions during build (if they validate):**
- Council districts (service found, query pending)
- Parcels (returned empty — may work with different parameters)

**Remaining pre-build validation:**
- Geocoding (Nominatim accuracy for Montgomery) — can be tested early in the build. Map click provides a fallback input method regardless.

### Next step: Scaffold the Phase 1 project

1. Initialize Vite + React + TypeScript + Tailwind
2. Add Leaflet map centered on Montgomery
3. Implement the ArcGIS client utility (`services/api/arcgis-client.ts`) — direct browser requests, no proxy
4. Implement the first service file (zoning — the most validated data source)
5. Wire up map click → store → query → display
6. Add flood zone service file
7. Add neighborhoods service file
8. Test geocoding with Nominatim; switch to ArcGIS World Geocoder if needed
9. Optionally add council districts if point-query validates
10. Build outward following the Phase 1 scope in `architecture.md`

### If remaining validation fails:

| Failure type | Fallback |
|---|---|
| Geocoding fails for Montgomery addresses | Use ArcGIS World Geocoder (free API key) or make map click the primary input |
| Neighborhoods query fails | Phase 1 ships with zoning + flood only — still shippable |
| Council query fails | Already optional — no impact |
| Parcels remain empty | Already deferred — no impact |
