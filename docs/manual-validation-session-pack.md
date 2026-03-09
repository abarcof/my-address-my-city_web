# Manual Validation Session Pack
## My Address, My City — Phase 1

---

## A. Introduction

This file is the operational companion to `docs/phase-1-validation-plan.md` (strategy) and `docs/phase-1-manual-validation-checklist.md` (quick reference). Use this file to actually run the tests, record results, and make the go/no-go decision.

**No application code implementation should begin until the minimum go/no-go criteria defined in Section E are met.**

All tests run in a web browser using the developer console (F12 → Console) or the address bar.

---

## B. Run in This Order

| Order | Test ID | Target | Priority |
|---|---|---|---|
| 1 | V1 | CORS | **Critical minimum** |
| 2 | V2 | Zoning query | **Critical minimum** |
| 3 | V3 | Geocoding (Nominatim) | **Critical minimum** |
| 4 | V4 | Flood zone query | Recommended |
| 5 | V5 | Council district discovery | Recommended |
| 6 | V6 | Parcel query | Recommended |
| 7 | V7 | Neighborhood query | Recommended |

If V1 fails, stop and resolve CORS before running V2–V7.
If V1 passes, run V2 and V3 immediately — they are the two most important data tests.

---

## C. Exact Browser Execution Steps

### V1 — CORS

**Open:** any page (even `about:blank`). Open DevTools console (F12).

**Paste:**

```javascript
fetch('https://gis.montgomeryal.gov/server/rest/services/Zoning/FeatureServer/0?f=json').then(r=>r.json()).then(d=>console.log('CORS OK',d)).catch(e=>console.error('CORS BLOCKED',e));
```

**If it works:** Console prints `CORS OK` followed by a JSON object containing layer metadata (fields, geometryType, etc.).

**If it fails:** Console shows a CORS error (`Access-Control-Allow-Origin` missing) or a network error.

**Classification:**
- **Pass:** `CORS OK` + valid JSON
- **Partial:** Response received but is HTML, a redirect, or truncated
- **Fail:** CORS error, 403, or network error

**If Fail:** You will need to set up a Vite dev proxy before continuing. See `architecture.md` CORS Mitigation Strategy. After proxy is configured, re-run V2–V7 through the proxy.

---

### V2 — Zoning Query

**Open in browser address bar:**

```
https://gis.montgomeryal.gov/server/rest/services/Zoning/FeatureServer/0/query?where=1%3D1&geometry=%7B%22x%22%3A-86.3077%2C%22y%22%3A32.3791%7D&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=*&outSR=4326&f=json
```

This queries zoning at City Hall (103 N Perry St).

**If it works:** JSON response with a `features` array containing at least one object. Inside `features[0].attributes` you will see field names like zone type, description, etc. Record every field name you see.

**If it fails:** Empty `features` array, error message, or HTML response.

**Classification:**
- **Pass:** `features` array with 1+ results and readable attributes
- **Partial:** Response is valid JSON but `features` is empty — may be a coordinate format issue (try swapping x/y)
- **Fail:** Error, 403, or no JSON response

**Record:** All field names from `attributes`.

---

### V3 — Geocoding (Nominatim)

**Open in browser address bar — Address 1 (City Hall):**

```
https://nominatim.openstreetmap.org/search?q=103+N+Perry+St,+Montgomery,+AL&format=json&limit=1&countrycodes=us
```

**Open in browser address bar — Address 2 (Residential):**

```
https://nominatim.openstreetmap.org/search?q=2560+Bell+Rd,+Montgomery,+AL&format=json&limit=1&countrycodes=us
```

**If it works:** JSON array with one object. Check `lat` and `lon`:
- City Hall expected: lat ≈ 32.379, lon ≈ -86.308
- Bell Rd expected: lat ≈ 32.362, lon ≈ -86.213

**If it fails:** Empty array, wrong city, or coordinates far off (>200m from expected).

**Classification:**
- **Pass:** Both addresses return coordinates within ~100m of expected
- **Partial:** 1 of 2 accurate
- **Fail:** 0 of 2 accurate or no results

**If Fail:** Register for a free ArcGIS developer account at `developers.arcgis.com` and test the ArcGIS World Geocoder instead.

---

### V4 — Flood Zone Query

**Open in browser address bar:**

```
https://gis.montgomeryal.gov/server/rest/services/Capture/GIS_Overlays/MapServer/2/query?where=1%3D1&geometry=%7B%22x%22%3A-86.3077%2C%22y%22%3A32.3791%7D&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=*&outSR=4326&f=json
```

**If it works:** JSON with `features` array. May be empty if City Hall is not in a flood zone — that is a valid result, not a failure.

**If it fails:** Error message like "Query operation not supported" or HTML response.

**Classification:**
- **Pass:** Valid JSON response (even if `features` is empty — empty means "not in a flood zone")
- **Partial:** Response works but missing expected fields or returning unexpected format
- **Fail:** Error message indicating query is not supported on this MapServer layer

**If empty result:** Try a point nearer to the Alabama River: change coordinates to `"x":-86.320,"y":32.373` (URL-encode if needed). If that also returns empty, the layer may not support queries.

**Record:** Whether query is supported at all, and any field names returned.

---

### V5 — Council District Discovery

**Step 1 — Open in browser address bar:**

```
https://gis.montgomeryal.gov/server/rest/services/Capture/CityCouncil_and__Territories/FeatureServer?f=json
```

Look for a `layers` array in the JSON. Find any layer with "council" or "district" in the name. **Layer 5 is Code Enforcement Districts — skip it.**

**Step 2 — If not found above, try:**

```
https://gis.montgomeryal.gov/server/rest/services/SDE_City_Council/MapServer?f=json
```

Again look for a `layers` array with council districts.

**Step 3 — Once you find the layer, query it.** Replace `[SERVICE_PATH]` and `[LAYER_ID]`:

```
https://gis.montgomeryal.gov/server/rest/services/[SERVICE_PATH]/[LAYER_ID]/query?where=1%3D1&geometry=%7B%22x%22%3A-86.3077%2C%22y%22%3A32.3791%7D&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=*&outSR=4326&f=json
```

**Classification:**
- **Pass:** Layer found, query returns district number/name for City Hall
- **Partial:** Layer found but query returns empty or unexpected format
- **Fail:** No council district layer found in either service

**Record:** The exact service path, layer ID, and all field names.

---

### V6 — Parcel Query

**Open in browser address bar:**

```
https://gis.montgomeryal.gov/server/rest/services/Parcels/FeatureServer/0/query?where=1%3D1&geometry=%7B%22x%22%3A-86.3077%2C%22y%22%3A32.3791%7D&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=*&outSR=4326&f=json
```

**If it works:** JSON with parcel attributes (owner name, address, area, etc.).

**If it fails:** Error or empty results.

**Classification:**
- **Pass:** Features returned with human-readable attributes
- **Partial:** Features returned but fields are mostly IDs/codes with no useful resident-facing info
- **Fail:** Query fails or returns error

**Record:** All field names from `attributes`. Note which fields would be useful to display.

---

### V7 — Neighborhood Query

**Open in browser address bar:**

```
https://gis.montgomeryal.gov/server/rest/services/NSD_Neighborhoods/FeatureServer/0/query?where=1%3D1&geometry=%7B%22x%22%3A-86.3077%2C%22y%22%3A32.3791%7D&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=NEIGHBRHD&outSR=4326&f=json
```

**If it works:** JSON with `features[0].attributes.NEIGHBRHD` containing a neighborhood name (e.g., "Downtown").

**If it fails:** Error or empty response.

**Classification:**
- **Pass:** Returns `NEIGHBRHD` value
- **Partial:** Returns data but `NEIGHBRHD` is null or empty
- **Fail:** Query fails, SRID issue, or error

**If Fail due to SRID:** This service uses EPSG:3857. If `inSR=4326` is rejected, the fallback is to convert coordinates to Web Mercator before querying.

---

## D. Copy/Paste Results Template

Copy this section into `docs/validation-log.md` after running the tests. Fill in each entry.

```markdown
## Validation Session — [DATE]

### V1 — CORS
- **Date/time:** 
- **URL:** https://gis.montgomeryal.gov/server/rest/services/Zoning/FeatureServer/0?f=json
- **Request:** browser console fetch()
- **Expected:** JSON metadata response
- **Observed:** 
- **Classification:** Pass / Partial / Fail
- **Notes:** 
- **Screenshot taken:** Yes / No

### V2 — Zoning
- **Date/time:** 
- **URL:** /Zoning/FeatureServer/0/query (City Hall coordinates)
- **Request:** browser address bar with spatial query
- **Expected:** features array with zoning attributes
- **Observed:** 
- **Field names found:** 
- **Classification:** Pass / Partial / Fail
- **Notes:** 
- **Screenshot taken:** Yes / No

### V3a — Geocoding (City Hall)
- **Date/time:** 
- **URL:** Nominatim search for 103 N Perry St
- **Expected:** lat ≈ 32.379, lon ≈ -86.308
- **Observed lat/lon:** 
- **Offset from expected:** 
- **Classification:** Pass / Partial / Fail
- **Notes:** 

### V3b — Geocoding (Residential)
- **Date/time:** 
- **URL:** Nominatim search for 2560 Bell Rd
- **Expected:** lat ≈ 32.362, lon ≈ -86.213
- **Observed lat/lon:** 
- **Offset from expected:** 
- **Classification:** Pass / Partial / Fail
- **Notes:** 

### V4 — Flood Zone
- **Date/time:** 
- **URL:** /Capture/GIS_Overlays/MapServer/2/query (City Hall coordinates)
- **Request:** browser address bar with spatial query
- **Expected:** JSON response (features may be empty if City Hall is not in a flood zone)
- **Observed:** 
- **Query supported:** Yes / No
- **Field names found:** 
- **Classification:** Pass / Partial / Fail
- **Notes:** 
- **Screenshot taken:** Yes / No

### V5 — Council District
- **Date/time:** 
- **Step 1 URL:** /Capture/CityCouncil_and__Territories/FeatureServer?f=json
- **Layers found:** 
- **Council layer ID:** 
- **Step 2 URL (if needed):** /SDE_City_Council/MapServer?f=json
- **Layers found:** 
- **Step 3 query result:** 
- **District returned:** 
- **Field names found:** 
- **Classification:** Pass / Partial / Fail
- **Notes:** 
- **Screenshot taken:** Yes / No

### V6 — Parcels
- **Date/time:** 
- **URL:** /Parcels/FeatureServer/0/query (City Hall coordinates)
- **Expected:** features with parcel attributes
- **Observed:** 
- **Field names found:** 
- **Useful resident-facing fields:** 
- **Classification:** Pass / Partial / Fail
- **Notes:** 
- **Screenshot taken:** Yes / No

### V7 — Neighborhoods
- **Date/time:** 
- **URL:** /NSD_Neighborhoods/FeatureServer/0/query (City Hall coordinates)
- **Expected:** NEIGHBRHD field with neighborhood name
- **Observed:** 
- **NEIGHBRHD value:** 
- **Classification:** Pass / Partial / Fail
- **Notes:** 
- **Screenshot taken:** Yes / No

### Summary
- **Tests passed:** /7
- **Tests partial:** /7
- **Tests failed:** /7
- **Go / No-go decision:** 
- **Blockers identified:** 
- **Next action:** 
```

---

## E. Minimum Decision Rule

We are ready to switch to **Plan Mode for Phase 1 implementation planning** if and only if ALL of the following are true:

1. **CORS or proxy path is confirmed** — at least one working method to reach `gis.montgomeryal.gov` from the browser (direct fetch or proxy)
2. **Zoning query works** — spatial query returns zoning data for at least one test coordinate
3. **Geocoding is usable** — at least 1 of 2 test addresses geocodes accurately via Nominatim (or an alternative geocoder is confirmed)
4. **At least 3 of 5 Phase 1 data layers are usable** — of zoning, flood zone, council district, parcels, and neighborhoods, at least 3 returned data or confirmed queryable

If all four conditions are met: **proceed to Plan Mode.**

If any condition is not met: see Section F.

---

## F. Stop Conditions

Pause and do not proceed to implementation if any of the following are true:

| Condition | Why we stop | What to do |
|---|---|---|
| Browser CORS blocked AND no working proxy path | Cannot reach city data at all | Investigate proxy options, Vercel serverless function, or alternative data access. Do not proceed until resolved. |
| Zoning query fails entirely | Core data for "This Address" is unavailable | Investigate alternative zoning endpoints (e.g., MapServer at `/Capture/GIS_Overlays/MapServer/7`). If no zoning source works, Phase 1 needs redesign. |
| Geocoding fails for all test addresses AND map click is unreliable | No user input method works | Register for ArcGIS World Geocoder. If that also fails, investigate Montgomery Address Points as a search source. |
| Fewer than 3 of 5 Phase 1 data layers respond | The "This Address" module would be too thin | Assess whether the remaining layers provide enough value for a credible demo. If not, investigate alternative data sources or reduce Phase 1 scope. |
| Council district AND flood zone both fail, leaving only zoning + parcels + neighborhoods | Phase 1 experience may be too weak for a competitive submission | Assess honestly whether a 3-layer snapshot is strong enough. Consider whether any of the failed layers can be served from pre-downloaded data instead. |

In any stop condition, **log the failure in `validation-log.md`**, discuss the fallback options, and make a deliberate decision before writing any code.

---

## G. What Stays Out of Scope

Until the go/no-go decision in Section E is met:

- No app scaffolding (no `npm create vite`, no `package.json` setup)
- No React, TypeScript, or Tailwind code
- No Leaflet map implementation
- No Bright Data integration or account setup
- No Phase 2, 3, or 4 implementation work
- No deployment setup (no Vercel, no GitHub Pages)

The only permitted work is:
- Running these browser validation tests
- Recording results in `validation-log.md`
- Updating `data-sources.md` and `app-claims.md` with findings
- Setting up a Vite dev proxy **only if** CORS validation (V1) fails
