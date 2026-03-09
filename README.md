# My Address, My City

A resident-friendly civic web app for Montgomery, Alabama. Enter an address or click the map to get a clear civic snapshot — zoning, flood zone, nearest parks and hospitals, and recent city activity nearby.

Built for the **World Wide Vibes Hackathon 2026** — **Civic Access & Community Communication** challenge.

---

## What It Does

The app answers three questions for any location in Montgomery:

1. **What is true about this address?** — Zoning, flood context, neighborhood, council district (This Address)
2. **What is closest to this address?** — Nearest park, community center, hospital (What's Closest)
3. **What is happening near this address?** — Code violations, building permits, 311 requests from the last 12 months (What's Happening Nearby)

Plus **Next Steps** — links to report issues, verify zoning, and city resources.

---

## Current Modules

| Module | Description |
|--------|-------------|
| **This Address** | Zoning, flood zone, neighborhood, council district — from official Montgomery GIS |
| **What's Closest** | Nearest park, community center, hospital with approximate straight-line distance |
| **What's Happening Nearby** | Code violations, permits, 311 requests within 0.5 miles, last 12 months only |
| **Next Steps** | Links to city services and resources |
| **Civic Snapshot Summary** | Compact summary at the top of the panel when a location is selected |
| **About This Data** | Transparency drawer explaining data sources and methods |
| **Copy Link** | Shareable deep link to the current snapshot (lat, lng, tab) |

---

## Getting Started

```bash
npm install
npm run dev
```

Open the app, enter a Montgomery address (or use the demo presets), and explore the tabs.

---

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** — build tool
- **Tailwind CSS** — styling
- **Leaflet** / **react-leaflet** — map
- **TanStack Query** — data fetching, caching
- **Zustand** — lightweight UI state (coordinates, active tab)

Frontend + optional Vercel serverless API for Bright Data. Property data fetched directly from Montgomery GIS in the browser.

---

## How It Works

1. **Search or click** — User enters an address (Nominatim geocode) or clicks the map.
2. **Montgomery check** — App verifies the point is within city limits using a static boundary. Outside points show a friendly message; no city data is queried.
3. **Data fetch** — For in-bounds points, the app queries Montgomery ArcGIS for zoning, flood zones, neighborhoods, parks, hospitals, community centers, code violations, permits, and 311 requests.
4. **Display** — Data is normalized in the service layer and shown in plain language. No raw GIS field names in the UI.

---

## Montgomery-Only Behavior

The app is designed for locations inside the City of Montgomery. Selecting a point outside city limits shows a message explaining that city-specific information is only available within Montgomery. The app does not run city queries for out-of-bounds locations.

---

## Data Sources

All property and civic data comes from the **City of Montgomery's official GIS** at `gis.montgomeryal.gov`:

- Zoning — FeatureServer
- Flood zones — MapServer
- Neighborhoods — FeatureServer
- Parks, hospitals, community centers — FeatureServer / MapServer
- Code violations, building permits, 311 requests — Open Data Portal FeatureServers

Distances use approximate straight-line (Haversine) calculation. "What's Happening Nearby" shows records within 0.5 miles and from the last 12 months only. See **About This Data** in the app for full transparency.

---

## Architecture Summary

- **Service layer** (`src/services/`) — Normalizes ArcGIS payloads into typed interfaces. UI never sees raw GIS JSON.
- **Feature hooks** (`src/features/*/use*.ts`) — TanStack Query hooks keyed by coordinates.
- **Store** (`src/store/`) — Zustand for selected coordinates, label, active tab.
- **Components** — Cards, feedback states (loading, error, empty), map, search, tabs.

See [docs/architecture.md](docs/architecture.md) for details. For AI onboarding or context handoff, use [docs/project-context-for-ai.md](docs/project-context-for-ai.md).

---

## Demo Flow (60–90 seconds)

1. Open app, show map
2. Search for an address (e.g. 103 N Perry St) or use a demo preset
3. **This Address** — zoning, flood, neighborhood, council district
4. **What's Closest** — nearest park, hospital, community center
5. **What's Happening Nearby** — code violations, permits, 311
6. **Next Steps** — links to city services
7. Optionally click outside Montgomery to show the out-of-bounds message
8. Close: "One address. Your city. Clear answers."

See [docs/demo-script-final.md](docs/demo-script-final.md) for the full script.

---

## Commercialisation

**My Address, My City** is a white-label civic information product for mid-size cities. Montgomery is the pilot. The pattern — one address, one civic snapshot — is replicable in any city with ArcGIS-based open data (which is most U.S. cities). Customers could include city governments, civic technology teams, and local organizations. The model could support annual city licensing or managed civic SaaS deployment.

---

## Build Phases

| Phase | Scope | Status |
|-------|-------|--------|
| **Phase 1** | Address search, map click, This Address, Next Steps | Frozen |
| **Phase 2** | What's Closest — nearest park, community center, hospital | Frozen |
| **Phase 2.1** | Montgomery boundary, out-of-bounds validation | Frozen |
| **Phase 3** | What's Happening Nearby — code violations, permits, 311 | Frozen |
| **Phase 4** | Civic summary, About Data, demo presets, Copy Link, white-label config, UX polish, README, submission docs | Finalist package |

---

## What Is Frozen

Phase 1, 2, 2.1, and 3 code and behavior are frozen. Phase 4 adds polish, transparency, and submission readiness without changing core modules.

---

## What Is Optional

- **Bright Data bonus** — Optional "Official Live Context" section shows up to 3 recent official web updates from city domains. Requires `BRIGHT_DATA_ENABLED = true` and server env `BRIGHTDATA_API_KEY`. See [docs/bright-data-scaffold.md](docs/bright-data-scaffold.md).

## White-Label Readiness

The app uses a lightweight config layer (`src/config/app-config.ts`) for city-specific values: city name, map center, nearby radius, official links, and active resource categories. This makes the pattern replicable for other cities with minimal code changes.

---

## License

Hackathon project. See repository for license details.
