# Phase 3 Handoff Prompt
## My Address, My City — Complete Context for Next Agent

**Purpose:** Copy and paste this entire document as the initial prompt when starting Phase 3 in a new chat. It gives the agent full project context, document references, and clear instructions so they can work with the same clarity as the current session.

---

## INSTRUCTIONS FOR THE USER

1. Open a new chat.
2. Copy everything from the line "---" below (the PROMPT BODY) through the end of this file.
3. Paste it as your first message.
4. The agent will have full context and can proceed with Phase 3.

---

## PROMPT BODY

---

I am continuing the hackathon project **"My Address, My City"** for Montgomery, Alabama. Phase 1, Phase 2, and Phase 2.1 are **frozen and stable**. I want to implement **Phase 3: "What's Happening Nearby"**.

---

## 1. PROJECT SUMMARY

**What it is:** A resident-friendly civic web app that turns one address or one map click into a civic snapshot. The app answers three questions:

1. **What is true about this address?** (This Address — zoning, flood, neighborhood)
2. **What is closest to this address?** (What's Closest — parks, community centers, hospitals)
3. **What is happening near this address?** (What's Happening Nearby — Phase 3 scope)

**Tech stack:** React, TypeScript, Vite, Tailwind, Leaflet, TanStack Query, Zustand. Frontend-only, read-only MVP. All data from official Montgomery GIS (`gis.montgomeryal.gov`) and Open Data Portal.

**Key constraints:**
- Resident-facing, not GIS-analyst-facing
- English only (code, docs, labels, comments)
- No raw GIS field names in UI
- Every claim must trace to a verified data source
- Montgomery-only: locations outside city limits show a friendly message; no city-specific queries run

---

## 2. WHAT HAS BEEN DONE

### Phase 1 (frozen)
- Address search (Nominatim geocode)
- Map click selection
- This Address: zoning, flood zone, neighborhood
- Next Steps: links to city resources
- Tab layout: This Address | What's Closest | Next Steps

### Phase 2 (frozen)
- What's Closest: nearest park, nearest community center, nearest hospital
- Haversine distance, labeled "Approximate distance"
- Resource markers on map
- Service layer: `parks.ts`, `community-centers.ts`, `hospitals.ts` using `queryWithinRadius` + ArcGIS

### Phase 2.1 (frozen)
- Static Montgomery boundary: `src/data/montgomery-city-boundary.json`
- Boundary utility: `src/utils/boundary.ts` — `isWithinMontgomery()`, `MONTGOMERY_BOUNDS`
- Montgomery-only validation: `isWithinMontgomery` in store; snapshot and closest queries disabled when outside
- Friendly out-of-bounds message: "Sorry — this app is designed for locations inside the City of Montgomery, so we can't show city-specific information outside city limits."
- Leaflet `maxBounds` focused on Montgomery

---

## 3. DOCUMENTS YOU MUST READ

Read these files **before** implementing. They contain rules, data sources, and architecture.

### Reading order (recommended)

1. **`AGENTS.md`** — Project goal, modules, phases, scope restrictions, workflow rules. Start here.
2. **`docs/data-sources.md`** — Phase 3 section (Code Violations, Building Permits, 311). Validation status and caveats.
3. **`docs/app-claims.md`** — Phase 3 claims (3.1–3.4). What we can and cannot claim.
4. **`docs/architecture.md`** — Tech stack, service layer, normalization. How to structure new code.
5. **`docs/phase-2-plan.md`** — Pattern for What's Closest. Use as template for Phase 3.
6. **`docs/qa/phase-2-1-hardening-report.md`** — Boundary, maxBounds, Montgomery-only. Do not regress.

### Full document index

| Document | Path | What it contains |
|----------|------|------------------|
| **AGENTS.md** | `AGENTS.md` | Project goal, modules, build phases, scope restrictions, workflow rules, quality bar |
| **Project rules** | `.cursor/rules/` | Always-applied rules: 00-language, 01-project-goal, 02-build-phases, 03-tech-stack, 04-data-rules, 05-ux-rules, 06-scoring-rules, 07-claims-validation |
| **Data sources** | `docs/data-sources.md` | All ArcGIS endpoints, Phase 3 sources (Code Violations, Building Permits, 311), validation status, CORS notes |
| **App claims** | `docs/app-claims.md` | Every claim the app makes; Phase 3 claims (3.1–3.4); validation status; claims to avoid |
| **Validation log** | `docs/validation-log.md` | What has been tested; CORS, zoning, flood, parcels; Phase 2.1 entries |
| **Architecture** | `docs/architecture.md` | Tech stack, layers, service pattern, normalization rules |
| **Phase 2 plan** | `docs/phase-2-plan.md` | Pattern used for What's Closest; queryWithinRadius, Haversine, service structure |
| **Phase 2.1 hardening** | `docs/qa/phase-2-1-hardening-report.md` | What Phase 2.1 added; boundary, maxBounds, Montgomery-only |
| **Final release reports** | `docs/qa/final-*.md` | Release report, regression report, score review, freeze checklist, fix log |
| **Manual validation** | `docs/manual-validation-session-pack.md` | How to run manual validation; useful for testing Phase 3 |
| **PRD** | `docs/PRD.md` | Original product requirements; context only |

---

## 4. PHASE 3 SCOPE

**Module:** "What's Happening Nearby"

**Planned data sources (from `docs/data-sources.md`):**
- **Code Violations** — Open Data Portal: `opendata.montgomeryal.gov/datasets/code-violation-new` — API access TBD
- **Building Permits** — Open Data Portal — API access TBD
- **311 Service Requests** — `QAlert/QAlert_311/MapServer` — **Significant uncertainty:** may be sanitation-only, not general 311

**Requirements:**
- Validate each source before implementing (endpoint exists, query works, field structure known)
- Use same patterns as Phase 2: service layer, TanStack Query, resident-friendly cards
- Define and document the "nearby" radius (e.g., 0.5 miles)
- Display radius in UI
- No city-specific queries when location is outside Montgomery (already enforced)
- Update `docs/app-claims.md` and `docs/validation-log.md` for any new claims

---

## 5. WORKFLOW (HOW TO WORK)

1. **Before implementing:** Restate the task, identify affected files, propose smallest viable implementation.
2. **Validation first:** Do not ship a feature until its data source is validated. Test in browser console if needed.
3. **Follow existing patterns:** Look at `parks.ts`, `hospitals.ts`, `community-centers.ts` for service structure. Look at `use-closest.ts` and `WhatsClosest.tsx` for hook and UI patterns.
4. **After implementing:** Summarize changes, list risks, confirm phase is still shippable, suggest next step.
5. **Document:** Update `docs/data-sources.md`, `docs/app-claims.md`, `docs/validation-log.md` for any new sources or claims.

---

## 6. RULES TO OBEY

- **Do not change** Phase 1, Phase 2, or Phase 2.1 behavior
- **Do not start** Phase 4
- **Do not broaden** scope (no auth, no write-back, no ML, no complex routing)
- **Do not** display data whose origin cannot be cited
- **Do not** use raw GIS field names in UI
- **Do not** invent fields or assume undocumented behavior
- **Prefer** graceful degradation; show "Data not available" over wrong data
- **Keep** all project artifacts in English

---

## 7. KEY FILE PATHS

```
src/
├── store/address-store.ts          # coordinates, label, isWithinMontgomery
├── utils/boundary.ts               # isWithinMontgomery, MONTGOMERY_BOUNDS
├── services/
│   ├── api/arcgis-client.ts        # queryByPoint, queryWithinRadius
│   ├── datasets/                   # zoning, flood-zone, neighborhoods, parks, hospitals, community-centers
│   └── search/geocode.ts           # geocode, reverseGeocode
├── features/
│   ├── snapshot/                   # ThisAddress, use-snapshot (zoning, flood, neighborhood)
│   ├── closest/                    # WhatsClosest, use-closest
│   └── (Phase 3: happening/ or similar)
├── components/
│   ├── map/CityMap.tsx
│   ├── search/SearchBar.tsx
│   ├── cards/                      # InfoCard, ClosestCategoryCard
│   └── feedback/                   # OutOfBoundsNotice, LoadingCard, ErrorCard, EmptyCard
└── data/montgomery-city-boundary.json
```

---

## 8. YOUR TASK

Implement Phase 3: "What's Happening Nearby" with nearby 311, code violations, and building permits.

**Before implementing:**
1. Read the documents listed in section 3
2. Validate API access and field structure for each Phase 3 source (see `docs/data-sources.md`)
3. Propose the smallest viable implementation that fits the existing architecture
4. If a source cannot be validated, do not ship it; document the blocker

**During implementation:**
- Follow the service-layer pattern (normalize in service, typed output to UI)
- Add a new tab or integrate into existing layout per `App.tsx` / `TabContainer.tsx`
- Reuse LoadingCard, ErrorCard, EmptyCard, OutOfBoundsNotice
- Gate Phase 3 queries by `isWithinMontgomery` (same as snapshot and closest)

**After implementation:**
- Update docs
- Run regression check (Phase 1, 2, 2.1 still work)
- Summarize what was added and any remaining risks

---

## 9. HOW TO TALK TO ME

You can speak to me the same way the previous agent did:
- Propose before implementing
- Summarize after changes
- Ask if something is unclear
- Flag blockers (e.g., endpoint returns 403, field structure unknown)
- Prefer small, shippable steps over big batches

I will respond with decisions, clarifications, or approval to proceed.

---

**End of prompt body.**
