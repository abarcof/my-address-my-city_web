# Submission Brief — My Address, My City

## Problem

Residents of mid-size cities struggle to get a clear picture of their address — zoning, flood risk, nearest civic resources, and what's happening nearby. Information is scattered across GIS viewers, dashboards, and department websites. Most tools are built for analysts, not for the person who lives there.

## Why It Matters

Civic access means turning public data into answers people can use. When a resident asks "What's true about my address?" or "What's happening on my block?", they should get clear answers without learning GIS. Better access builds trust and helps residents participate in their communities.

## Solution

**My Address, My City** is a resident-facing civic web app that turns one address or one map click into a civic snapshot. The app answers three questions:

1. **What is true about this address?** — Zoning, flood risk, neighborhood, council district, property record, trash schedule
2. **What is closest?** — Nearest park, community center, hospital
3. **What is happening nearby?** — Code violations, building permits (last 12 months)

Plain language. No raw GIS terms. One screen, all answers.

## What Makes It Different

- **Address-first** — Most civic portals are map-layer viewers. This inverts the paradigm: start from the resident's address, not from the data layer.
- **Resident-facing** — Built for the person who lives there, not for analysts. Every label and message is written for clarity.
- **Nearby City Records** — Turns static lookup into neighborhood awareness. Few civic apps surface recent code violations and permits in one place.
- **Single-screen UX** — No navigation complexity. One address, one screen, tab-based layout.

## Impact for Residents

Residents can quickly understand their location: zoning, flood risk, nearest parks and hospitals, and recent city activity within 0.5 miles. They get links to report issues, verify zoning, and reach city departments. The app is informative only — it does not replace official city services.

## Why Montgomery

Montgomery, Alabama has robust open GIS and open data. The City of Montgomery's ArcGIS server (gis.montgomeryal.gov) provides zoning, flood zones, neighborhoods, parks, hospitals, community centers, code violations, and building permits. Montgomery is the pilot deployment to validate the pattern with real data.

## Replicability

The pattern — one address, one civic snapshot — works in any city with ArcGIS-based open data. Most U.S. mid-size cities use ArcGIS for zoning, flood, and civic infrastructure. The app is primarily frontend, read-only; it queries existing city services directly from the browser. An optional Vercel serverless API exists for the Bright Data bonus; no custom data warehouse is required.

## Commercialisation

**My Address, My City** is a white-label civic information product for mid-size cities. Montgomery is the pilot. The pattern is replicable in any city with ArcGIS-based open data. Customers could include city governments, civic technology teams, and local organizations. The model could support annual city licensing or managed civic SaaS deployment. Scale: roughly 300 mid-size U.S. cities with open data portals.

---

**Challenge:** Civic Access & Community Communication  
**Hackathon:** World Wide Vibes Hackathon 2026  
**Author:** Aicardo Barco Fajardo · abarcof@gmail.com

---

## Bright Data Bonus (Optional)

When enabled, the app runs a **live web search** via Bright Data's SERP API — queries like `site:montgomeryal.gov [neighborhood] public notice` and `Montgomery permits update`. Results are dynamic and contextual to the selected location, unlike the static City Resources links. This is supplemental; it complements the GIS-based modules without replacing them. Disabled by default.
