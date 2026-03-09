# Phase 1 Manual Validation Checklist
## 15-Minute Browser Execution Sheet

Estimated time: 15 minutes. All tests use a browser and its developer console.

**Pre-requisite:** Open any browser. Open DevTools (F12 → Console tab).

---

## Test Order

| # | Test | Time |
|---|---|---|
| 1 | CORS | 2 min |
| 2 | Zoning query | 2 min |
| 3 | Geocoding (Nominatim) | 3 min |
| 4 | Flood zone query | 2 min |
| 5 | Council district discovery | 3 min |
| 6 | Parcels + Neighborhoods | 3 min |

---

## Test 1 — CORS (2 min)

Paste into browser console:

```javascript
fetch('https://gis.montgomeryal.gov/server/rest/services/Zoning/FeatureServer/0?f=json')
  .then(r => r.json())
  .then(d => console.log('CORS OK', d))
  .catch(e => console.error('CORS BLOCKED', e));
```

| Result | Meaning | Next step |
|---|---|---|
| `CORS OK` + JSON object | Direct browser access works | Continue to Test 2. No proxy needed. |
| CORS error in console | Server blocks browser-origin requests | **Stop.** Set up Vite dev proxy before continuing. See `architecture.md` CORS section. |
| 403 Forbidden | Server blocks this request entirely | Investigate: try adding `?f=json` or different endpoint. If persistent, proxy + custom headers needed. |
| Network error / timeout | Server may be down | Wait 5 min, retry. If still down, log as blocker. |

**Log result in `docs/validation-log.md` Section 2.**

---

## Test 2 — Zoning Query (2 min)

Paste into console (or use browser address bar):

```
https://gis.montgomeryal.gov/server/rest/services/Zoning/FeatureServer/0/query?where=1%3D1&geometry=%7B%22x%22%3A-86.3077%2C%22y%22%3A32.3791%7D&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=*&outSR=4326&f=json
```

This queries the zoning at City Hall (103 N Perry St).

| Result | Meaning | Next step |
|---|---|---|
| JSON with `features` array, at least 1 feature | Zoning spatial query works | Record the field names from `attributes`. Continue. |
| `features: []` (empty) | Query works but returned nothing | Check coordinates. Try `-86.3077, 32.3791` vs `32.3791, -86.3077` (x=longitude, y=latitude in ArcGIS). |
| Error or HTML response | Query not supported or wrong params | Try removing `geometry` and adding `where=OBJECTID=1` to test basic query support. |

**Record field names in `docs/validation-log.md` Section 1.**

---

## Test 3 — Geocoding / Nominatim (3 min)

Open in browser:

**Address 1 (City Hall):**
```
https://nominatim.openstreetmap.org/search?q=103+N+Perry+St,+Montgomery,+AL&format=json&limit=1&countrycodes=us
```

**Address 2 (Residential):**
```
https://nominatim.openstreetmap.org/search?q=2560+Bell+Rd,+Montgomery,+AL&format=json&limit=1&countrycodes=us
```

For each, check:
- Does it return a result?
- Is `lat` near 32.37–32.38 (City Hall) or 32.36 (Bell Rd)?
- Is `lon` near -86.30 (City Hall) or -86.21 (Bell Rd)?

| Result | Meaning | Next step |
|---|---|---|
| Both within ~100m of expected | Nominatim is good enough for Phase 1 | Use Nominatim as primary geocoder. |
| 1 of 2 accurate | Nominatim is marginal | Acceptable, but document the miss. Consider ArcGIS geocoder as upgrade. |
| 0 of 2 accurate or no results | Nominatim fails for Montgomery | Switch to ArcGIS World Geocoder. Register at developers.arcgis.com for a free key. |

**Log results (both addresses) in `docs/validation-log.md` Section 3.**

---

## Test 4 — Flood Zone Query (2 min)

Open in browser:

```
https://gis.montgomeryal.gov/server/rest/services/Capture/GIS_Overlays/MapServer/2/query?where=1%3D1&geometry=%7B%22x%22%3A-86.3077%2C%22y%22%3A32.3791%7D&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=*&outSR=4326&f=json
```

| Result | Meaning | Next step |
|---|---|---|
| JSON with flood zone data | MapServer query works | Record field names. Excellent — reduces risk. |
| `features: []` (empty) | City Hall may not be in a flood zone — this is valid | Try a point near the Alabama River (e.g., `32.373, -86.320`) where flooding is more likely. |
| Error: "Query not supported" or similar | MapServer layer doesn't allow queries | **Fallback options:** (a) use as tile overlay only, (b) pre-download GeoJSON boundaries, (c) drop flood zone from Phase 1. Log as yellow flag. |

**Log result in `docs/validation-log.md` Section 1.**

---

## Test 5 — Council District Discovery (3 min)

**Step A — List layers in CityCouncil service:**

```
https://gis.montgomeryal.gov/server/rest/services/Capture/CityCouncil_and__Territories/FeatureServer?f=json
```

Look in the JSON for a `layers` array. Find any layer with "council" or "district" in the name. Layer 5 is Code Enforcement Districts — that is NOT the right one.

**Step B — If not found above, try the MapServer:**

```
https://gis.montgomeryal.gov/server/rest/services/SDE_City_Council/MapServer?f=json
```

Look for a layer with council district polygons.

**Step C — Once found, query it:**

Replace `[ENDPOINT]` and `[LAYER_ID]` with what you found:

```
https://gis.montgomeryal.gov/server/rest/services/[ENDPOINT]/[LAYER_ID]/query?where=1%3D1&geometry=%7B%22x%22%3A-86.3077%2C%22y%22%3A32.3791%7D&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=*&outSR=4326&f=json
```

| Result | Meaning | Next step |
|---|---|---|
| Layer found, query returns district info | Council district is usable | Record endpoint, layer ID, and field names. |
| Layer found but query fails | May need different query params | Try `where=1=1&outFields=*&f=json` without geometry to confirm it's queryable. |
| No council district layer found in either service | Council district not available via spatial query | Drop from Phase 1 or use a static reference image. Log as limitation. |

**Log result in `docs/validation-log.md` Section 1.**

---

## Test 6 — Parcels + Neighborhoods (3 min)

**Parcels:**
```
https://gis.montgomeryal.gov/server/rest/services/Parcels/FeatureServer/0/query?where=1%3D1&geometry=%7B%22x%22%3A-86.3077%2C%22y%22%3A32.3791%7D&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=*&outSR=4326&f=json
```

**Neighborhoods:**
```
https://gis.montgomeryal.gov/server/rest/services/NSD_Neighborhoods/FeatureServer/0/query?where=1%3D1&geometry=%7B%22x%22%3A-86.3077%2C%22y%22%3A32.3791%7D&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=NEIGHBRHD&outSR=4326&f=json
```

| Result | Meaning | Next step |
|---|---|---|
| Both return features with attributes | Both usable | Record field names for parcels. Neighborhoods should return `NEIGHBRHD`. |
| Parcels works, Neighborhoods empty | Neighborhoods SRID issue possible | Try `inSR=3857` with Web Mercator coordinates. |
| One or both fail | Lower priority | Either can be dropped from Phase 1 without breaking the MVP. |

**Log results in `docs/validation-log.md` Section 1.**

---

## After All Tests

### Interpret results using the go/no-go table:

| Must-pass | Condition |
|---|---|
| CORS or proxy works | At least one working path to reach `gis.montgomeryal.gov` from the browser |
| Zoning query works | Spatial query returned zoning data for City Hall coordinates |
| Geocoding is usable | At least 1 of 2 test addresses geocoded accurately via Nominatim |
| 3+ data layers respond | Of zoning, flood, council, parcels, neighborhoods — at least 3 returned data |

**If all must-pass conditions are met:** Validation passes. Proceed to Phase 1 implementation planning.

**If CORS fails:** Set up Vite dev proxy. Re-run Tests 2–6 through the proxy. Then reassess.

**If geocoding is inaccurate:** Register for a free ArcGIS developer account. Test the ArcGIS World Geocoder with the same addresses. If that also fails, map click becomes the primary input.

**If council district layer is unresolved:** Drop council district from Phase 1 scope. The app ships with zoning + flood + neighborhood + parcels. Council district can be added later if the layer is found.

### Update these documents with your findings:

1. `docs/validation-log.md` — log every test result
2. `docs/data-sources.md` — update status fields for each tested source
3. `docs/app-claims.md` — update claim statuses based on test results
