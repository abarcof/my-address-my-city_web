# Technical Architecture
## My Address, My City

---

## Design Philosophy

This application is **resident-facing, not GIS-analyst-facing**. Every architectural decision flows from this principle:

- The user sees plain language, not field names
- The UI shows concise cards, not data tables
- Errors degrade gracefully into helpful messages, not stack traces
- Raw GIS payloads never reach UI components

---

## System Overview

```
┌─────────────────────────────────────────────────────┐
│                    Browser (SPA)                     │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────┐ │
│  │  Search   │  │   Map    │  │    Side Panel      │ │
│  │   Bar     │  │ (Leaflet)│  │  ┌──────────────┐  │ │
│  └────┬─────┘  └────┬─────┘  │  │ This Address │  │ │
│       │              │        │  │ What's Close │  │ │
│       ▼              ▼        │  │ Happening    │  │ │
│  ┌─────────────────────────┐  │  │ Next Steps   │  │ │
│  │      Zustand Store      │  │  └──────────────┘  │ │
│  │  (selected coordinates) │  └────────────────────┘ │
│  └────────────┬────────────┘                         │
│               │                                      │
│               ▼                                      │
│  ┌─────────────────────────┐                         │
│  │   TanStack Query Hooks  │                         │
│  │  (caching, dedup, retry)│                         │
│  └────────────┬────────────┘                         │
│               │                                      │
│               ▼                                      │
│  ┌─────────────────────────┐                         │
│  │    Service Layer        │  ← normalization here   │
│  │  services/datasets/*    │                         │
│  │  services/api/*         │                         │
│  │  services/search/*      │                         │
│  └────────────┬────────────┘                         │
│               │                                      │
└───────────────┼──────────────────────────────────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Montgomery ArcGIS    │
    │  gis.montgomeryal.gov │
    │  + Open Data Portal   │
    │  + Geocoder           │
    └───────────────────────┘
```

---

## Tech Stack

| Layer | Technology | Justification |
|---|---|---|
| Framework | React 18+ | Component model, ecosystem, team familiarity |
| Language | TypeScript | Type safety across service layer and UI |
| Build tool | Vite | Fast dev server, simple config, Vercel-friendly |
| Styling | Tailwind CSS | Utility-first, fast iteration, consistent design |
| Map | Leaflet + react-leaflet | Free, no API key, proven for civic apps |
| Data fetching | TanStack Query | Caching, retry, loading states out of the box |
| UI state | Zustand | Lightweight, no boilerplate, only for selected address/coordinates |
| Deployment | Vercel (preferred) or GitHub Pages | Instant deploys, custom domain, edge functions if needed |

---

## Architecture Layers

### 1. UI Layer (`src/components/`, `src/features/`)

- Receives **normalized, typed data** from hooks
- Never imports from `services/` directly
- Never parses raw ArcGIS JSON
- Handles three explicit states: **loading**, **data**, **error/empty**
- Uses Tailwind for styling; no inline style objects

### 2. Hook Layer (`src/features/*/use*.ts`)

- Uses TanStack Query to call service functions
- Provides typed return values to components
- Handles caching, deduplication, and stale-while-revalidate
- Queries are keyed by coordinates — when the user selects a new point, all queries refetch

### 3. Service Layer (`src/services/`)

**This is the normalization boundary.**

```
src/services/
  api/
    arcgis-client.ts     # Generic ArcGIS query helper
  datasets/
    zoning.ts            # Calls ArcGIS → returns ZoningResult
    flood-zone.ts        # Calls ArcGIS → returns FloodZoneResult
    council.ts           # Calls ArcGIS → returns CouncilDistrictResult
    parcels.ts           # Calls ArcGIS → returns ParcelResult
  search/
    geocode.ts           # Address string → { lat, lng }
```

Rules:
- Each dataset file owns one data source
- Input: coordinates (lat/lng in WGS84)
- Output: a clean, typed TypeScript interface
- Raw ArcGIS `attributes` and `geometry` objects are mapped to app-specific types here
- If the external service returns an unexpected shape, the service file returns a typed error or empty result — never throws raw errors into UI

### 4. State Layer (`src/store/`)

- **Zustand** store holds only lightweight UI state:
  - Selected coordinates (`{ lat: number; lng: number } | null`)
  - Selected address label (string)
  - Active tab
- No business logic in the store
- No data fetching in the store

### 5. Type Layer (`src/types/`)

- Shared TypeScript interfaces consumed by services, hooks, and components
- Separate files for each domain: `address.ts`, `snapshot.ts`, `closest.ts`, `nearby.ts`

---

## Data Flow (Phase 1)

```
User types address           User clicks map
       │                           │
       ▼                           ▼
  geocode.ts                 Leaflet click event
  (Nominatim)                      │
       │                           │
       └──────────┬────────────────┘
                  │
                  ▼
           Zustand store
        { lat, lng, label }
                  │
                  ▼
         TanStack Query hooks
         (useSnapshot, etc.)
                  │
        ┌─────────┼──────────────┬───────────────────────┐
        ▼         ▼              ▼                        ▼
    zoning.ts  flood.ts  neighborhoods.ts   [council.ts / parcels.ts]
    (validated) (validated) (high confidence)  (optional — add if validated)
        │         │              │                        │
        ▼         ▼              ▼                        ▼
    Direct browser fetch to gis.montgomeryal.gov
    (CORS confirmed — no proxy needed)
    (with outSR=4326 for coordinate conversion)
        │         │              │                        │
        ▼         ▼              ▼                        ▼
    Normalized typed results
                  │
                  ▼
         ThisAddress component
         (cards with plain language)
```

---

## Implementation Gate: Browser Access Validation

**Status: GATE PASSED (2026-03-07).** Browser-side data access path is confirmed.

**Confirmed path: Direct browser access.** A browser `fetch()` from `about:blank` to `gis.montgomeryal.gov` returned JSON successfully. The server includes CORS headers permitting browser-origin requests. No proxy is required for the default implementation path.

**History:**
- Server-side fetch attempts returned HTTP 403 Forbidden (does not affect browser requests).
- Browser CORS test attempt 1: Inconclusive — ran from CSP-restricted page context.
- Browser CORS test attempt 2: **PASS** — ran from `about:blank`. JSON returned.

**Implementation decision:**
- Use **direct browser `fetch()` calls** to `gis.montgomeryal.gov` in all service files.
- The proxy path (Vite dev proxy + Vercel serverless function) is documented in the CORS Mitigation Strategy section as a **fallback only**, not the default.
- If a specific endpoint later rejects browser requests, a per-endpoint proxy can be added without changing the overall architecture.

---

## CORS Mitigation Strategy

**The problem:** Montgomery's ArcGIS server (`gis.montgomeryal.gov`) may not include CORS headers allowing browser-origin requests. A pure client-side SPA would be blocked.

**Strategy:**

1. **Test first.** Before writing any service code, make a test fetch from a browser to a known endpoint. If CORS headers are present, no proxy is needed.

2. **If CORS is blocked — development:** Use Vite's built-in proxy in `vite.config.ts`:
   ```
   server: {
     proxy: {
       '/gis': {
         target: 'https://gis.montgomeryal.gov',
         changeOrigin: true,
         rewrite: (path) => path.replace(/^\/gis/, '')
       }
     }
   }
   ```

3. **If CORS is blocked — production:** Add a minimal Vercel edge function or serverless function that proxies requests. This is a single file (`api/proxy.ts`), not a backend architecture. It adds no business logic — only forwards the request and returns the response.

This approach keeps the app frontend-first while handling the most likely infrastructure blocker.

---

## Coordinate System Handling

Montgomery ArcGIS services use **mixed spatial references:**
- Most services (Zoning, Parcels, Flood Zones): **SRID 102629** (State Plane Alabama West, US feet)
- NSD_Neighborhoods: **EPSG:3857** (Web Mercator)

Leaflet and the UI use **EPSG:4326** (WGS84).

**Strategy:** Pass `outSR=4326` in every ArcGIS query parameter. The ArcGIS server handles the reprojection. This avoids adding `proj4` as a client-side dependency unless server-side reprojection fails for a specific service.

For input geometry (sending a point to query), use `inSR=4326` alongside the WGS84 coordinates.

---

## Geocoding Strategy

| Priority | Service | Pros | Cons |
|---|---|---|---|
| 1 (default) | Nominatim (OSM) | Free, no API key, simple REST | Accuracy unverified for Montgomery |
| 2 (fallback) | ArcGIS World Geocoder | Best US address accuracy | Requires free developer API key |
| 3 (optional) | Montgomery Address Points | Most Montgomery-specific | Requires building a search against the FeatureServer |

Start with Nominatim. If it fails accuracy tests with known Montgomery addresses, swap to ArcGIS geocoder. The geocoding service is abstracted behind `services/search/geocode.ts` so swapping is a one-file change.

---

## Error and Empty State Strategy

Every data-consuming component must handle four states:

| State | UI Response |
|---|---|
| **Loading** | Skeleton card or spinner with "Loading..." |
| **Success with data** | Normal content display |
| **Success but empty** | Friendly message: "No zoning data found for this location" |
| **Error** | Friendly message: "Could not reach city data. Try again." with retry option |

Additionally:
- **Out of bounds:** If the selected point is outside Montgomery city limits, show: "This location appears to be outside Montgomery. Try selecting a location within the city."
- **Partial failure:** If one query fails but others succeed, show the successful data and a note for the failed one. Never block the entire panel because one endpoint is down.

---

## Phase 1 Execution Boundary

This section defines exactly what Phase 1 includes and what it intentionally excludes. It exists to prevent scope creep and protect the shippable MVP.

### Phase 1 validated core (2026-03-07):
- Leaflet map centered on Montgomery
- Address search (geocoding via Nominatim or fallback)
- Map click to select a location
- Zustand store holding the selected coordinates
- ArcGIS queries for: **zoning** (live-tested), **flood zones** (live-tested), **neighborhoods** (endpoint confirmed)
- "This Address" tab: displays all queried data in plain-language cards
- "Next Steps" tab: static links to city resources
- AppShell layout: search bar top, map center, side panel with tabs
- Loading, error, empty, and out-of-bounds states for every data card
- Basic responsive layout (desktop-first, passable on tablet)

### Phase 1 optional additions (if they validate during build):
- **Council districts** — service discovered (`SDE_City_Council/MapServer/0`), point-query not yet tested. Add if query works; omit without impacting the core.
- **Parcels** — returned empty for test point. May work with different parameters. Add if resolved; omit without impacting the core.

### Phase 1 intentionally excludes:
- "What's Closest" tab and any proximity/distance logic
- "What's Happening Nearby" tab and any 311/violations/permits data
- Bright Data or any external enrichment
- Advanced search (autocomplete, fuzzy match, address suggestions)
- Multiple address comparison
- Saved locations or bookmarks
- Any user accounts, authentication, or persistent state
- Any backend (CORS proxy is not needed — direct browser access confirmed)
- Mobile-optimized layouts (passable is sufficient; polished mobile is Phase 4)
- Print/export/share functionality

This product is a **resident-facing civic app, not a GIS viewer**. Every architectural choice — from the service-layer normalization to the plain-language cards — must preserve that character. If a decision would make the app feel more like an analyst tool than a resident tool, reject it.

---

## Phase Stability Rules

These rules are non-negotiable:

1. **Phase 1 must be shippable at all times.** Every commit after Phase 1 is complete must leave the app in a working, demoable state.

2. **Phase 2 does not start until Phase 1 is stable.** "Stable" means: address search works, map click works, This Address displays data, Next Steps shows links, layout is clean, no console errors.

3. **Phase 3 does not start until Phase 2 is stable.** "Stable" means: What's Closest tab works with at least one validated resource type, proximity display is readable.

4. **Phase 4 does not start unless the core submission is safe.** Phase 4 is polish and bonus. If time is short, Phase 3 ships as-is.

5. **No feature may break an earlier phase.** If adding a Phase 2 feature causes Phase 1 to regress, revert the Phase 2 change.

---

## Phase-by-Phase Scope

### Phase 1 — Shippable MVP (narrowed validated scope)
- Leaflet map centered on Montgomery
- Address search via geocoder (Nominatim or fallback)
- Map click → coordinates
- Zustand store for selected location
- ArcGIS queries (core): **zoning** (validated), **flood zones** (validated), **neighborhoods** (high confidence)
- ArcGIS queries (optional): council districts (if query validates), parcels (if resolved)
- "This Address" tab with normalized card display
- "Next Steps" tab with static city links
- AppShell layout: search bar + map + side panel
- Loading, error, empty, and out-of-bounds states
- Direct browser fetch (CORS confirmed — no proxy needed)

### Phase 2 — What's Closest
- Nearest parks (from Streets_and_POI)
- Nearest community centers (if dataset validates)
- Simple Haversine distance calculation
- "What's Closest" tab with distance + name cards
- Map markers for nearest resources

### Phase 3 — What's Happening Nearby
- Code violations within radius (from open data portal)
- Building permits within radius (from open data portal)
- 311 requests within radius (if dataset validates — see data-sources.md)
- "What's Happening Nearby" tab with summary cards
- Map layer showing nearby activity points

### Phase 4 — Finalist Package
- README polish
- Demo script finalization
- App claims validation
- Validation log completion
- Commercialization paragraph
- Optional Bright Data enrichment layer
- Repository cleanup (remove dead code, unused deps)

---

## Folder Structure

```
my-address-my-city/
├─ .cursor/rules/              # AI assistant rules
├─ docs/                       # Project documentation
├─ public/                     # Static assets
├─ src/
│  ├─ app/                     # App root, providers
│  ├─ components/
│  │  ├─ layout/               # AppShell, SidePanel
│  │  ├─ search/               # SearchBar
│  │  ├─ map/                  # CityMap
│  │  ├─ cards/                # InfoCard, ResourceCard
│  │  ├─ tabs/                 # TabContainer
│  │  └─ feedback/             # Loading, Error, Empty states
│  ├─ features/
│  │  ├─ snapshot/             # ThisAddress, NextSteps, useSnapshot
│  │  ├─ closest/              # WhatsClosest, useClosest
│  │  ├─ happening/            # WhatsHappeningNearby, useHappening
│  │  ├─ summary/              # CivicSnapshotSummary, useCivicSummary
│  │  └─ official-live-context/ # Phase 4 Bright Data bonus (optional)
│  ├─ services/
│  │  ├─ api/                  # arcgis-client
│  │  ├─ datasets/             # zoning, flood, council, parcels, etc.
│  │  └─ search/               # geocode
│  ├─ store/                   # Zustand store
│  ├─ types/                   # TypeScript interfaces
│  ├─ utils/                   # Distance calc, formatters
│  ├─ styles/                  # Tailwind entry CSS
│  └─ main.tsx                 # Vite entry point
├─ api/                       # Vercel serverless (Bright Data only)
│  └─ official-live-context.ts
├─ AGENTS.md
├─ README.md
├─ package.json
├─ tsconfig.json
├─ vercel.json                # Vercel build + SPA rewrite
└─ vite.config.ts
```

---

## Deployment

| Environment | Tool | Notes |
|---|---|---|
| Development | `vite dev` | Local dev server with optional proxy |
| Production | Vercel | Auto-deploy from GitHub, edge functions for proxy if needed |
| Fallback | GitHub Pages | Only if the final build is fully client-side with no proxy |

The Vercel deployment is preferred because it supports serverless functions (Bright Data API, CORS proxy if needed) and provides instant preview deployments for every commit.
