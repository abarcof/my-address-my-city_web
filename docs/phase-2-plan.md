---
name: Phase 2 What's Closest
overview: "Implement the What's Closest module with Parks as core, Community Centers as optional extension."
todos:
  - id: block-1
    content: "Parks layer validation (browser console)"
  - id: block-2
    content: "Add queryWithinRadius to arcgis-client"
  - id: block-3
    content: "Distance utils and types"
  - id: block-4
    content: "Parks service"
  - id: block-5
    content: "useClosest hook"
  - id: block-6
    content: "ResourceCard and WhatsClosest UI"
  - id: block-7
    content: "Map markers"
  - id: block-8
    content: "Documentation"
isProject: false
---

# Phase 2 Implementation Plan
## What's Closest Module — My Address, My City

---

## 1. Executive Summary

### What Phase 2 Adds

Phase 2 introduces the **"What's Closest"** module: a resident-facing tab that answers the question *"What civic resource is nearest to me?"* by showing the 3 closest parks (and optionally community centers) to the selected address or map point, with straight-line distance and map markers.

### Why It Matters

- **Challenge fit:** Directly addresses "Civic Access & Community Communication" by surfacing proximity to public spaces.
- **Differentiation:** Phase 1 answers "What is at this address?" Phase 2 answers "What is closest?" — a natural, memorable progression for the demo.
- **Resident value:** Parks are universally understood; knowing the nearest park is immediately useful.

### Safest Release Target

**Parks-only Phase 2.** A stable, demoable module with one validated resource type is the safest release. Community Centers are an optional extension only if validation is fast and low-risk.

### Recommended Core Release Scope

- What's Closest tab
- 3 nearest parks with straight-line distance
- Map markers for the 3 nearest parks
- Loading, error, empty, and out-of-bounds states
- Phase 1 functionality fully intact

### Optional Extension Scope

- Community Centers (if validated quickly and cleanly)
- Mobile map/panel toggle (polish only, after Parks module is stable)

---

## 2. Scope Boundaries

### Core Phase 2 Scope

| Item | Description |
|------|-------------|
| What's Closest tab | New tab between "This Address" and "Next Steps" |
| Parks | Single required resource type; 3 nearest results |
| Haversine distance | Straight-line distance only; labeled as "Straight-line distance" or "Approximate distance" |
| Resource cards | Resident-friendly cards with park name and distance |
| Map markers | Markers for the 3 nearest parks; distinct from user-location marker |
| State handling | Loading, error, empty, out-of-bounds — same discipline as Phase 1 |
| Phase 1 integrity | No regression; address search, map click, This Address, Next Steps unchanged |

### Optional Extension Scope

| Item | Condition | Description |
|------|-----------|-------------|
| Community Centers | Validation is fast and low-risk | Add as second resource category; same pattern as Parks (3 nearest, distance, markers) |
| Mobile map/panel toggle | Parks module is stable first | Polish enhancement; not required for Phase 2 RC |

### Explicitly Out of Scope

| Item | Reason |
|------|--------|
| Council district | Does not belong in "What's Closest"; may be a later add-on to This Address |
| Routing / drive time / Dijkstra | Product decision: straight-line only for Phase 2 |
| Scoring model / complex interpolation | Product decision: simple proximity only |
| Hard distance cutoff | Show nearest result even if far; no filtering by max distance |
| More than 3 results per category | Product decision: 3 is the limit |
| What's Happening Nearby | Phase 3 scope; do not broaden into Phase 2 |

---

## 3. Product Framing

### Resident-Facing User Story

> "I know what this address is. Now show me what civic resource is closest to me."

The user has already seen zoning, flood context, and neighborhood in "This Address." They now want to know: *Where is the nearest park?* (and optionally, *Where is the nearest community center?*)

### Value of "What's Closest"

- **Accessibility lens:** Simple spatial access reading — "am I near or far from key civic nodes?"
- **Actionable:** A resident can decide to visit the nearest park or center.
- **Memorable:** The demo flow (address → what's here → what's closest) is easy to follow.

### Why 3 Results

- **Not overwhelming:** One result feels sparse; five feels like a list. Three is a clear "top few" without clutter.
- **Consistent:** Same rule for every category (Parks, Community Centers if added).
- **Demo-friendly:** Three cards fit the side panel layout without scrolling.

### Why Straight-Line Distance Is Acceptable

- **Honest:** We do not calculate walking or driving time. Labeling as "Straight-line distance" or "Approximate distance" avoids implying routing accuracy.
- **Sufficient:** For "what's closest," relative proximity matters more than exact travel time. A resident can infer "0.3 mi" is walkable; "3.2 mi" is not.
- **Implementable:** Haversine is simple, fast, and requires no external routing API.

### Why Parks-Only Is Still a Strong Hackathon Feature

- **Single validated resource type** is more valuable than multiple weak or partially validated types.
- **Stability, speed, and clarity** matter more than breadth for scoring.
- Parks are universally understood and high-value for civic access.
- A clean Parks implementation sets the pattern for Community Centers if they validate later.

---

## 4. Data Strategy

### What Validation Means

Validation for Phase 2 means:

1. **Endpoint exists** — The service and layer are reachable from the browser.
2. **Query behavior** — A spatial "within radius" query returns features.
3. **Field structure** — We can extract a human-readable name and coordinates.
4. **Geometry handling** — We know whether features are points or polygons and how to derive coordinates.

### Parks: How to Identify the Layer

**Service:** `Streets_and_POI/MapServer`  
**Source:** [docs/data-sources.md](docs/data-sources.md) — "City Parks" layer exists; exact layer ID TBD.

**Validation steps (browser console at `about:blank` or app origin):**

1. Fetch layer list:  
   `fetch('https://gis.montgomeryal.gov/server/rest/services/Streets_and_POI/MapServer?f=json').then(r=>r.json()).then(console.log)`
2. Inspect `layers` array; identify layer with "City Parks," "Parks," or "Parks and Trails" in the name.
3. Record the layer `id` (e.g., 3, 5).
4. Run a test query with `geometry` (point), `distance=15000`, `units=esriSRUnit_Meter`, `returnGeometry=true`, `outSR=4326` for City Hall (32.376, -86.300).
5. Inspect response: geometry type, attribute field names for park name.

**Minimum required fields:**

- **Name:** One attribute that yields a resident-friendly label (e.g., `NAME`, `PARK_NAME`, `FACILITY`). Fallback to "Park" if missing.
- **Geometry:** Point or polygon; we derive coordinates for distance and markers.

### Community Centers: How to Identify the Layer

**Status:** Needs validation. May be in `Streets_and_POI` or a separate service.

**Validation steps:**

1. Check `Streets_and_POI/MapServer` layer list for "Community Center," "Recreation," or similar.
2. If not found, search ArcGIS REST directory and open data portal for community center / recreation facility layers.
3. If found within 30 minutes of exploration: run same query pattern as Parks; document layer ID and fields.
4. If not found or query fails: **do not block Phase 2.** Proceed with Parks-only.

### Geometry: Point vs Polygon

| Geometry type | How to get coordinates | Use for |
|---------------|------------------------|---------|
| **Point** | Use `geometry.x`, `geometry.y` directly (ArcGIS: x=longitude, y=latitude with `outSR=4326`) | Distance calculation, marker position |
| **Polygon** | Compute centroid from `geometry.rings[0]` (exterior ring). Simple centroid: average of all vertex x and y. | Distance calculation, marker position |

### Is Centroid Use Acceptable?

**Yes.** For polygons (e.g., park boundaries), the centroid is a reasonable representative point for "where is this park?" Residents care about approximate proximity, not exact boundary. Centroid is standard practice for point-in-polygon summaries.

### Fallback If Community Centers Do Not Validate

- **Do not block the build.** Phase 2 ships with Parks only.
- Document in `data-sources.md`: "Community Centers — not validated; deferred."
- The UI should be structured so adding a second category later is a small change (same `ResourceCard`, same hook pattern).

### How to Avoid Blocking with Open-Ended Data Exploration

- **Time box:** 30 minutes max for Community Centers discovery. If unresolved, drop.
- **Parks first:** Validate Parks before writing any Community Centers code.
- **Go/no-go:** Phase 2 proceeds when Parks validates. Community Centers are additive only.

---

## 5. Resident-Facing UX

### Tab Behavior

- Tab order: **This Address** | **What's Closest** | **Next Steps**
- Clicking "What's Closest" shows the module content.
- Tab state persists when user switches; no auto-refresh on tab change.
- When no location is selected, show the same prompt as This Address.

### Section Header Wording

- **Tab label:** "What's Closest"
- **Section header (when data exists):** "Nearest Parks" (or "Nearest Parks" + "Nearest Community Centers" if both categories exist)
- **Intro line (optional):** "Civic resources nearest to your selected location."

### Result Card Wording

- **Title:** Park name (e.g., "Oak Park")
- **Subtitle:** "Straight-line distance: 0.3 mi" or "Approximate distance: 0.3 mi"
- **No raw GIS field names** (e.g., no `NAME`, `OBJECTID`, `Shape_Area`)

### Distance Labels

- Always use one of: "Straight-line distance" or "Approximate distance"
- Format: "X.X mi" (one decimal)
- Never imply walking, driving, or transit time

### Empty States

| Scenario | Wording |
|----------|---------|
| No location selected | "Search for an address or click the map to get started." |
| No parks in radius | "No parks found within the search area." |
| Query error | "Could not reach city data right now. Please try again." with retry button |
| Out of bounds | "This location appears to be outside Montgomery. Try selecting a location within the city." (reuse Phase 1 pattern) |

### Loading States

- Use `<LoadingCard title="What's Closest" />` (same pattern as This Address)
- No skeleton for individual cards; one loading card for the whole module

### Out-of-Bounds Wording

- Reuse `OutOfBoundsNotice` or equivalent from Phase 1
- Show when all Phase 1 queries return empty (same logic as This Address)

### Wording If a Resource Category Is Unavailable

- If Parks query fails: show ErrorCard with retry
- If Community Centers are in scope but fail: show inline note "Community centers data is not available." Do not block the Parks display.

### Wording If Only One Resource Type Is Supported

- No special wording needed. Section header "Nearest Parks" is sufficient.
- Do not say "Only parks are supported" — that sounds like a limitation. Simply show what we have.

---

## 6. Map Behavior

### Anchor Point Behavior

- The user-selected address/location remains the **primary anchor** on the map.
- Existing blue marker and `FlyToSelected` behavior unchanged.
- Map centers/flys to the selected point when it changes.

### Marker Behavior

- **User location:** Blue default Leaflet marker (existing).
- **Resource markers:** Distinct icon (e.g., green marker, or different icon) so they are visually distinguishable.
- **Number of markers:** Up to 3 (the 3 nearest parks). If Community Centers added, up to 3 more (6 total max).
- **Position:** Park centroid or point coordinates.

### Refresh Behavior

- Markers update when `coordinates` change (new search or map click).
- TanStack Query refetches; markers re-render with new data.
- No manual refresh button required.

### Marker/List Relationship

- Markers and list show the **same** 3 resources.
- Clicking a marker could show a popup with park name (optional, low priority).
- No requirement to sync hover between list and map in Phase 2.

### Avoiding Clutter

- Maximum 3 park markers + 1 user marker = 4 markers. Manageable.
- If Community Centers added: 3 + 3 + 1 = 7 markers. Still acceptable.
- Do not add labels on the map; keep markers simple.

### Keeping Selected Address Visually Primary

- User marker: default (blue) and/or slightly larger.
- Resource markers: smaller or different color (e.g., green).
- User marker is always present when a location is selected; resource markers appear only when data loads.

---

## 7. Normalized Data Model

### Closest Resource Result

```ts
interface CivicResource {
  name: string;      // Resident-facing
  lat: number;       // WGS84
  lng: number;       // WGS84
  distanceKm: number;
}
```

### Category

```ts
interface ClosestResult {
  parks: CivicResource[];
  communityCenters?: CivicResource[];  // Optional; only if validated
}
```

### Marker Data

- Same as `CivicResource`: `lat`, `lng`, `name` (for popup/title).
- No separate marker type; reuse `CivicResource`.

### Raw GIS Fields (Hidden)

- All ArcGIS `attributes` and `geometry` stay in the service layer.
- UI never receives `OBJECTID`, `Shape_Area`, `NAME` (raw), `rings`, etc.
- Service layer maps to `CivicResource` before returning.

### Resident-Facing Fields

| Field | Source | Display |
|-------|--------|---------|
| `name` | Normalized from GIS name attribute | Card title |
| `distanceKm` | Haversine calculation | Formatted as "X.X mi" |
| `lat`, `lng` | From geometry (point or centroid) | Map marker position |

---

## 8. Technical Architecture

### Integration with Existing Structure

Phase 2 adds a parallel feature module alongside `snapshot/`. It does not modify Phase 1 services, hooks, or components. It reuses:

- `arcgis-client` (extended with `queryWithinRadius`)
- `LoadingCard`, `ErrorCard`, `EmptyCard`, `OutOfBoundsNotice`
- `InfoCard` styling patterns (for `ResourceCard`)
- `useAddressStore` for coordinates
- TanStack Query for caching and refetch

### Services

| File | Purpose |
|------|---------|
| `src/services/api/arcgis-client.ts` | Add `queryWithinRadius(servicePath, coordinates, distanceMeters, outFields)` — returns features with geometry |
| `src/services/datasets/parks.ts` | Fetch parks within radius, normalize to `CivicResource[]`, sort by Haversine, take top 3 |
| `src/services/datasets/community-centers.ts` | (Optional) Same pattern as parks; only if validated |

### Hooks

| File | Purpose |
|------|---------|
| `src/features/closest/use-closest.ts` | `useQuery` keyed by coordinates; calls `fetchClosestParks` (and optionally `fetchClosestCommunityCenters`); returns `ClosestResult` |

### State

- No new Zustand state. Coordinates from `useAddressStore`. Tab state extended to include `'whats-closest'`.
- Closest data lives in TanStack Query cache only.

### UI

| File | Purpose |
|------|---------|
| `src/features/closest/WhatsClosest.tsx` | Main module; handles loading/error/empty; renders section + ResourceCards |
| `src/components/cards/ResourceCard.tsx` | Card for name + distance; reuses InfoCard styling |

### Map Integration

- `CityMap` imports `useClosest`; when `data?.parks` exists, renders `<Marker>` for each.
- User marker and `FlyToSelected` unchanged.
- Resource markers use distinct icon.

### Utility Functions

| File | Purpose |
|------|---------|
| `src/utils/distance.ts` | `haversineKm(lat1, lng1, lat2, lng2)`, `formatDistance(km)` → "X.X mi" |

### What Is Reused from Phase 1

- `arcgis-client` (extended, not replaced)
- Feedback components: `LoadingCard`, `ErrorCard`, `EmptyCard`, `OutOfBoundsNotice`
- Tab container pattern
- Store pattern
- TanStack Query pattern
- Coordinate flow: store → hook → service

---

## 9. Exact Files

### Files to Create

| Path | Purpose |
|------|---------|
| `src/utils/distance.ts` | Haversine + formatDistance |
| `src/types/closest.ts` | CivicResource, ClosestResult |
| `src/services/datasets/parks.ts` | Parks fetch and normalize |
| `src/features/closest/use-closest.ts` | useClosest hook |
| `src/components/cards/ResourceCard.tsx` | Resource card component |
| `src/features/closest/WhatsClosest.tsx` | What's Closest module |

### Files to Modify

| Path | Change |
|------|--------|
| `src/services/api/arcgis-client.ts` | Add `queryWithinRadius` |
| `src/store/address-store.ts` | Extend Tab type with `'whats-closest'` |
| `src/components/tabs/TabContainer.tsx` | Add What's Closest tab |
| `src/app/App.tsx` | Render WhatsClosest when tab active |
| `src/components/map/CityMap.tsx` | Add park markers via useClosest |
| `docs/data-sources.md` | Update Parks (and optionally Community Centers) validation status |
| `docs/app-claims.md` | Update claim 2.1, 2.3 |
| `docs/validation-log.md` | Log Phase 2 validation |

### Optional (Community Centers Extension)

| Path | Purpose |
|------|---------|
| `src/services/datasets/community-centers.ts` | Only if validated |
| `src/features/closest/use-closest.ts` | Add community centers to ClosestResult |
| `src/features/closest/WhatsClosest.tsx` | Add Community Centers section |

### Files to Leave Untouched

- All Phase 1 feature files: `ThisAddress.tsx`, `NextSteps.tsx`, `use-snapshot.ts`
- Phase 1 services: `zoning.ts`, `flood-zone.ts`, `neighborhoods.ts`
- `SearchBar`, `AppShell`, `SidePanel`
- `geocode.ts`

---

## 10. Implementation Blocks

### Block 1: Data Validation (Parks)

**Purpose:** Confirm Parks layer exists, get layer ID and field names.  
**Files affected:** None (browser console + docs).  
**Dependencies:** None.  
**Risk:** Low.  
**Done condition:** Layer ID and name field documented in `data-sources.md`; test query returns features.  
**Cut if needed:** Cannot cut — blocking for all Phase 2 work.

---

### Block 2: ArcGIS Client Extension

**Purpose:** Add `queryWithinRadius` to support "nearest" queries.  
**Files affected:** `src/services/api/arcgis-client.ts`.  
**Dependencies:** Block 1 (need layer path).  
**Risk:** Low.  
**Done condition:** Function returns features with geometry for a test point + radius.  
**Cut if needed:** Cannot cut — required for parks service.

---

### Block 3: Distance Utils and Types

**Purpose:** Haversine and formatting; type definitions.  
**Files affected:** `src/utils/distance.ts`, `src/types/closest.ts`.  
**Dependencies:** None.  
**Risk:** None.  
**Done condition:** `haversineKm` and `formatDistance` work; types compile.  
**Cut if needed:** Cannot cut — required for parks service.

---

### Block 4: Parks Service

**Purpose:** Fetch parks, normalize, sort, take top 3.  
**Files affected:** `src/services/datasets/parks.ts`.  
**Dependencies:** Blocks 1, 2, 3.  
**Risk:** Medium (geometry handling if polygons).  
**Done condition:** Service returns `CivicResource[]` for a test coordinate.  
**Cut if needed:** Cannot cut — core Phase 2.

---

### Block 5: useClosest Hook

**Purpose:** TanStack Query wrapper for closest data.  
**Files affected:** `src/features/closest/use-closest.ts`.  
**Dependencies:** Block 4.  
**Risk:** Low.  
**Done condition:** Hook returns data when coordinates set; refetches on coordinate change.  
**Cut if needed:** Cannot cut — required for UI.

---

### Block 6: ResourceCard and WhatsClosest UI Shell

**Purpose:** Render closest parks in the panel.  
**Files affected:** `src/components/cards/ResourceCard.tsx`, `src/features/closest/WhatsClosest.tsx`, `TabContainer`, `address-store`, `App.tsx`.  
**Dependencies:** Block 5.  
**Risk:** Low.  
**Done condition:** Tab visible; WhatsClosest shows loading/error/empty/success states; cards display name and distance.  
**Cut if needed:** Cannot cut — core Phase 2.

---

### Block 7: Map Markers

**Purpose:** Show park markers on the map.  
**Files affected:** `src/components/map/CityMap.tsx`.  
**Dependencies:** Block 5.  
**Risk:** Low.  
**Done condition:** 3 park markers appear when data loads; distinct from user marker.  
**Cut if needed:** Can defer to a follow-up block if time is short; Phase 2 gate requires markers but they can be added last.

---

### Block 8: Documentation and Claims

**Purpose:** Update docs with validation results and claims.  
**Files affected:** `docs/data-sources.md`, `docs/app-claims.md`, `docs/validation-log.md`.  
**Dependencies:** Block 1, Block 4.  
**Risk:** None.  
**Done condition:** Parks validation logged; claims 2.1, 2.3 updated.  
**Cut if needed:** Should not cut — required for claims discipline.

---

### Block 9 (Optional): Community Centers

**Purpose:** Add second resource category if validated.  
**Files affected:** `community-centers.ts`, `use-closest.ts`, `WhatsClosest.tsx`, `CityMap.tsx`, docs.  
**Dependencies:** Community Centers validation (parallel to Block 1).  
**Risk:** Medium (validation may fail).  
**Done condition:** 3 nearest community centers display with distance and markers.  
**Cut if needed:** Yes — Phase 2 ships without Community Centers if validation fails or is slow.

---

## 11. Recommended Build Order

1. **Block 1 — Data validation (Parks)** — Do first. No code. Browser console + docs.
2. **Block 2 — ArcGIS client extension** — Enables radius queries.
3. **Block 3 — Distance utils and types** — No dependencies; can run in parallel with Block 2.
4. **Block 4 — Parks service** — Core data pipeline.
5. **Block 5 — useClosest hook** — Data layer for UI.
6. **Block 6 — ResourceCard and WhatsClosest UI shell** — Tab + cards. App is demoable at this point (without map markers).
7. **Block 7 — Map markers** — Visual completeness.
8. **Block 8 — Documentation** — Ongoing; finalize after Block 4.
9. **Block 9 (optional) — Community Centers** — Only if validation is fast. After Block 7.

**Safest order:** Blocks 1–7 in sequence. After Block 6, the app is demoable (Parks in panel; markers can follow). Block 7 completes the Phase 2 gate.

---

## 12. QA / Regression Plan

### New Phase 2 Scenarios

| # | Scenario | Expected | Pass criteria |
|---|----------|----------|---------------|
| P2-1 | Search "103 N Perry St" → What's Closest tab | 3 nearest parks with distance | Cards show park names and "Straight-line distance: X.X mi" |
| P2-2 | Map click downtown → What's Closest tab | 3 nearest parks | Same as P2-1 |
| P2-3 | Map click west Montgomery | 3 nearest parks (may differ from downtown) | Results update; distances reasonable |
| P2-4 | Invalid address → What's Closest | Error or empty; no crash | Graceful handling |
| P2-5 | Out-of-bounds point | Out-of-bounds notice or empty | No raw errors |
| P2-6 | Map markers visible | 3 green (or distinct) markers + 1 blue user marker | Visually distinct; markers at park locations |
| P2-7 | Distance label | "Straight-line distance" or "Approximate distance" | No "walking" or "driving" implied |

### Phase 1 Regression Scenarios

| # | Scenario | Expected | Pass criteria |
|---|----------|----------|---------------|
| R1 | Search "103 N Perry St" → This Address | Zoning, flood, neighborhood | All cards display |
| R2 | Map click → This Address | Same as R1 | Data loads for clicked point |
| R3 | Next Steps tab | 3 links + disclaimer | Unchanged |
| R4 | Search then map click | Input clears; new data loads | BUG-1/BUG-2 fix intact |
| R5 | Invalid address then map click | Error clears; new data loads | BUG-2 fix intact |
| R6 | Mobile layout (375px) | Map visible; no cut-off | BUG-3 fix intact |

### Likely Regressions

| Risk | Mitigation |
|------|------------|
| Tab state conflicts | Extend Tab type cleanly; no removal of existing tabs |
| Map re-render on closest data | useClosest in CityMap; ensure no layout thrash |
| Coordinate race conditions | TanStack Query keys prevent stale data |

### Phase 2 RC Criteria

Phase 2 is release-candidate when:

- All P2-1 through P2-7 pass
- All R1 through R6 pass
- No console errors
- Demo (Phase 1 + 2) runs in under 60 seconds
- Parks layer validated and documented

---

## 13. Hackathon Scoring Impact

### Challenge Fit (Civic Access & Community Communication)

- Phase 2 directly answers "What civic resource is closest?" — a clear access question.
- Parks are public spaces; proximity to them supports community use.
- **Impact:** Strengthens alignment with primary track.

### Quality and Design

- Consistent card pattern with Phase 1; clean, resident-friendly language.
- Map integration adds visual clarity.
- **Impact:** Improves perceived polish.

### Originality and Impact

- "One address → what's here → what's closest" is a clear, memorable flow.
- Simple proximity (no complex scoring) is explainable and trustworthy.
- **Impact:** Differentiates from generic GIS viewers.

### Demo

- Adds a second substantive tab with real data.
- Natural narrative: "Now let's see what's closest to this address."
- **Impact:** Longer, more complete demo without complexity.

**Caveat:** Do not overstate. Phase 2 is incremental value, not a revolution. The scoring impact is real but proportional.

---

## 14. Final Recommendation

### Recommended Core Release Scope

- What's Closest tab with Parks only
- 3 nearest parks, straight-line distance, map markers
- Full state handling (loading, error, empty, out-of-bounds)
- Phase 1 fully intact

### Optional Extension Scope

- Community Centers (if validation is fast)
- Mobile map/panel toggle (polish only, after stability)

### Main Risks

1. **Parks layer not found or not queryable** — Mitigation: Validation first; fallback to open data portal if needed.
2. **Geometry is polygon with complex rings** — Mitigation: Use first ring centroid; document in validation.
3. **Regression in Phase 1** — Mitigation: Run full regression after each block.

### First Recommended Implementation Step

**Resource validation proof.** Execute Block 1 (Parks validation) before any UI or service code. Confirm:

- Layer ID for City Parks in Streets_and_POI
- Name field
- Geometry type (point vs polygon)
- Test query returns features

### Why Start with Validation

- Matches Phase 1 discipline (validation before implementation).
- Avoids building on unvalidated assumptions.
- If Parks fail, we know immediately and can pivot (e.g., open data portal) before writing code.
- UI shell work (Block 6) can use mock data for parallel progress, but the service layer (Block 4) must wait for validation.

### Alternative: UI Shell First

If the team prefers to see the tab and layout early, Block 6 can be started with mock `ClosestResult` data. Blocks 2–4 still depend on Block 1. The recommended order remains: **validation first**, then service, then hook, then UI with real data.

---

## 15. Agent Mode Prompt Sequence

### Prompt 1 (Pre-Implementation)

> Run the Phase 2 Parks validation steps from docs/phase-2-plan.md Section 4. Use the browser console at about:blank. Fetch the Streets_and_POI MapServer layer list, identify the City Parks layer ID, run a test query with distance=15000 and returnGeometry=true for City Hall (32.376, -86.300), and document the results in docs/data-sources.md and docs/validation-log.md. Do not write any application code.

### Prompt 2 (Core Implementation)

> Implement Phase 2 Blocks 2–6 from docs/phase-2-plan.md: add queryWithinRadius to arcgis-client, create distance utils and closest types, implement the parks service, useClosest hook, ResourceCard, and WhatsClosest component. Wire the What's Closest tab into the app. Use the validated Parks layer ID and field names from docs/data-sources.md. Ensure Phase 1 functionality is unchanged. Do not add map markers yet.

### Prompt 3 (Map Integration)

> Add map markers for the 3 nearest parks to CityMap.tsx per docs/phase-2-plan.md Section 6. Use a distinct icon for park markers so they are visually different from the user location marker. Ensure markers update when the selected location changes. Run the Phase 2 QA scenarios P2-1 through P2-7 and regression scenarios R1 through R6.

---

*Document version: 1.0 — Phase 2 planning*  
*Last updated: 2026-03-07*
