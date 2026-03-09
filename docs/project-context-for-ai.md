# Project Context for AI — My Address, My City

**Purpose:** Share this document with an AI (or paste into a new chat) so it understands the full project in one place. Use when onboarding a new agent or when context is lost.

---

## 1. What This Is

**My Address, My City** is a resident-facing civic web app for Montgomery, Alabama. Built for the World Wide Vibes Hackathon 2026 — **Civic Access & Community Communication** challenge.

**Core idea:** Turn one address or one map click into a clear civic snapshot. The app answers three questions:

1. **What is true about this address?** — Zoning, flood zone, neighborhood, council district (This Address)
2. **What is closest to this address?** — Nearest park, community center, hospital (What's Closest)
3. **What is happening near this address?** — Code violations, building permits, 311 requests, last 12 months, 0.5 miles (What's Happening Nearby)

Plus **Next Steps** — four official city links. **Civic Snapshot Summary** at top. **Demo presets** (City Hall, Residential, Outside Montgomery). **About This Data**, **Copy Link**.

---

## 2. Tech Stack

- **React 18** + **TypeScript**
- **Vite** — build
- **Tailwind CSS** — styling
- **Leaflet / react-leaflet** — map
- **TanStack Query** — data fetching, caching
- **Zustand** — UI state (coordinates, label, active tab)
- **Vercel** — deployment; optional serverless API for Bright Data

Property data: direct browser fetch to Montgomery GIS (`gis.montgomeryal.gov`). No proxy needed (CORS confirmed).

---

## 3. Key Constraints & Rules

- **Resident-facing** — not GIS-analyst-facing. Plain language, no raw GIS field names.
- **English only** — code, docs, labels, comments.
- **Montgomery-only** — outside city limits shows friendly message; no city queries run.
- **Read-only MVP** — no auth, no write-back, no user accounts.
- **Every claim must be verifiable** — see `docs/app-claims.md`.
- **Frozen phases** — Phase 1, 2, 2.1, 3 are frozen. Do not change core behavior.

---

## 4. Current State (as of 2026-03-08)

| Module | Status |
|--------|--------|
| This Address | Zoning, flood, neighborhood, council district (with fallback) |
| What's Closest | Parks, community centers, hospitals + approximate distance |
| What's Happening Nearby | Code violations, permits, 311 — 12 months, 0.5 mi |
| Next Steps | Four official city links |
| Civic Snapshot Summary | Compact summary at top when location selected |
| Demo presets | City Hall, Residential, Outside Montgomery |
| About This Data | Transparency drawer |
| Copy Link | Shareable deep link |
| Official Live Context | Bright Data bonus — implemented, **disabled by default** |

---

## 5. Architecture (Simplified)

```
Browser (SPA)
  → Zustand store (coordinates, label, tab)
  → TanStack Query hooks (keyed by coordinates)
  → Service layer (src/services/)
  → Montgomery ArcGIS (gis.montgomeryal.gov)
```

**Folder structure:**
- `src/features/` — snapshot, closest, happening, summary, official-live-context
- `src/services/datasets/` — zoning, flood-zone, neighborhoods, council, parks, hospitals, community-centers, code-violations, building-permits, service-requests
- `src/components/` — layout, map, search, cards, feedback, tabs
- `src/config/` — app-config.ts, feature-flags.ts
- `api/` — official-live-context.ts (Vercel serverless, Bright Data)

---

## 6. Bright Data Bonus (Optional)

- **Module:** Official Live Context — up to 3 recent official web updates from city domains
- **Location:** Section below What's Happening Nearby (when enabled)
- **Flag:** `BRIGHT_DATA_ENABLED` in `src/config/feature-flags.ts` (default: false)
- **Env:** `BRIGHTDATA_API_KEY` or `BRIGHT_DATA_API_KEY`; optional `BRIGHT_DATA_SERP_ZONE`
- **Allowed domains:** montgomeryal.gov, capture.montgomeryal.gov, gis.montgomeryal.gov
- **Docs:** `docs/bright-data-scaffold.md`

---

## 7. Key Documents (Read When Needed)

| Document | Use |
|----------|-----|
| `README.md` | Project overview, getting started |
| `AGENTS.md` | Modules, phases, scope, workflow rules |
| `docs/submission-brief.md` | Pitch narrative |
| `docs/demo-script-final.md` | Demo flow 60–90 s |
| `docs/app-claims.md` | Claims registry, verification status |
| `docs/architecture.md` | Full technical architecture |
| `docs/bright-data-scaffold.md` | Bright Data activation |
| `docs/handoff-this-address-parcel-trash.md` | Handoff: add Parcel ID + Trash & Recycling to This Address |
| `.cursor/rules/` | UX, data, scoring, validation rules |

---

## 8. How to Work on This

1. **Before changes:** Restate task, list affected files, propose smallest viable change.
2. **Read relevant docs** — especially app-claims, architecture.
3. **Do not change** Phase 1, 2, 2.1, 3 core behavior.
4. **After changes:** Summarize what changed; confirm demo still works.
5. **Prefer** stable demo over extra features.

---

## 9. Hackathon Scoring (40 pts)

- Consistency with challenge: 15
- Quality and design: 10
- Originality and impact: 10
- Commercialisation: 5
- Bright Data bonus: variable (optional)

---

## 10. Quick Reference

- **Build:** `npm run build`
- **Dev:** `npm run dev` (Vite) or `vercel dev` (with API)
- **Demo flow:** 60–90 seconds; see demo-script-final.md
- **Config:** `src/config/app-config.ts` — city name, radius, Next Steps links, etc.
