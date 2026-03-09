# Phase 4 Handoff Prompt
## My Address, My City — Complete Context for Finalist Package

**Purpose:** Copy and paste this entire document as the initial prompt when starting Phase 4 in a new chat. It gives the agent full project context, document references, and clear instructions so they can work with the same clarity as the current session.

---

## INSTRUCTIONS FOR THE USER

1. Open a new chat.
2. Copy everything from the line "---" below (the PROMPT BODY) through the end of this file.
3. Paste it as your first message.
4. The agent will have full context and can proceed with Phase 4.

---

## PROMPT BODY

---

I am continuing the hackathon project **"My Address, My City"** for Montgomery, Alabama. Phase 1, Phase 2, Phase 2.1, and Phase 3 are **frozen and stable**. I want to complete **Phase 4: Finalist Package** — repository polish, demo support, commercialization narrative, and optional Bright Data enrichment.

---

## 1. PROJECT SUMMARY

**What it is:** A resident-friendly civic web app that turns one address or one map click into a civic snapshot. The app answers three questions:

1. **What is true about this address?** (This Address — zoning, flood zone, neighborhood, council district)
2. **What is closest to this address?** (What's Closest — parks, community centers, hospitals)
3. **What is happening near this address?** (What's Happening Nearby — code violations, building permits, 311 requests, last 12 months only)

**Tech stack:** React 18, TypeScript, Vite, Tailwind CSS, Leaflet/react-leaflet, TanStack Query, Zustand. Primarily frontend; optional Vercel serverless API for Bright Data. Data from Montgomery GIS (`gis.montgomeryal.gov`).

**Hackathon:** World Wide Vibes Hackathon 2026 — **Civic Access & Community Communication** challenge. Deadline: **March 9, 2026, 9:00 AM CT**. Late penalty: -1 point per 2-hour window (max -5).

**Key constraints:**
- Resident-facing, not GIS-analyst-facing
- English only (code, docs, labels, comments)
- No raw GIS field names in UI
- Every claim must trace to a verified data source
- Montgomery-only: locations outside city limits show a friendly message

---

## 2. WHAT HAS BEEN DONE (ALL FROZEN — DO NOT CHANGE)

### Phase 1 (frozen)
- Address search (Nominatim geocode)
- Map click selection
- This Address: zoning, flood zone, neighborhood, council district (with graceful fallback)
- Next Steps: four official city links — Report a city issue, Apply for permits, Request public records, Stay informed
- Tab layout: This Address | What's Closest | What's Happening Nearby | Next Steps

### Phase 2 (frozen)
- What's Closest: nearest park, community center, hospital
- Haversine distance, labeled "Approximate distance"
- Resource markers on map
- Services: `parks.ts`, `community-centers.ts`, `hospitals.ts`

### Phase 2.1 (frozen)
- Static Montgomery boundary: `src/data/montgomery-city-boundary.json`
- `src/utils/boundary.ts` — `isWithinMontgomery()`, `MONTGOMERY_BOUNDS`
- Montgomery-only validation; out-of-bounds message; Leaflet `maxBounds`

### Phase 3 (frozen)
- What's Happening Nearby: code violations, building permits, 311 requests
- 12-month recency filter (primary: exact cutoff; safeguard: year >= currentYear - 1)
- ArcGIS date parsing: `parseArcGISDateToTimestamp` in `src/utils/format-date.ts`
- Filter: `filterToRecentOnly` in `src/utils/recent-filter.ts`
- Services: `code-violations.ts`, `building-permits.ts`, `service-requests.ts`
- UI: "Showing X recent", empty states "No recent X found within the last 12 months", footer "Showing records from the last 12 months"
- Radius: 0.5 miles, disclosed in UI

---

## 3. DOCUMENTS YOU MUST READ

Read these files **before** making changes. They contain rules, scoring strategy, and current state.

### Reading order (recommended)

1. **`AGENTS.md`** — Project goal, modules, phases, scope restrictions, workflow rules.
2. **`docs/scoring-plan.md`** — Hackathon rubric (15+10+10+5=40 pts), strategy by criterion, Phase 4 targets.
3. **`docs/phase-4-handoff-prompt.md`** — This document. Full Phase 4 context.
4. **`docs/demo-script-final.md`** — Demo flow (60–90 s), narration, backup plans.
5. **`docs/app-claims.md`** — Every claim the app makes; verification status; claims to avoid.
6. **`docs/architecture.md`** — Tech stack, service layer, folder structure.
7. **`docs/qa/phase-3-freeze-report.md`** — What Phase 3 froze; do not regress.
8. **`docs/qa/phase-3-hackathon-score.md`** — Current self-score (~8/10); gaps to close.

### Full document index

| Document | Path | What it contains |
|----------|------|------------------|
| **AGENTS.md** | `AGENTS.md` | Project goal, modules, phases, scope, workflow, quality bar |
| **Project rules** | `.cursor/rules/` | 00-language, 01-project-goal, 02-build-phases, 03-tech-stack, 04-data-rules, 05-ux-rules, 06-scoring-rules, 07-claims-validation |
| **Scoring plan** | `docs/scoring-plan.md` | Rubric, strategy, Phase 4 targets, commercialization narrative |
| **Demo script** | `docs/demo-script-final.md` | Demo flow (60–90 s), narration, backup plans |
| **App claims** | `docs/app-claims.md` | Claims registry, verification status |
| **Architecture** | `docs/architecture.md` | Tech stack, layers, service pattern |
| **Data sources** | `docs/data-sources.md` | ArcGIS endpoints, validation status |
| **Phase 3 freeze** | `docs/qa/phase-3-freeze-report.md` | Phase 3 scope frozen; MCP retest results |
| **Phase 3 score** | `docs/qa/phase-3-hackathon-score.md` | Self-score, strengths, areas to improve |
| **Phase 4 freeze** | `docs/qa/final-phase-4-freeze-audit.md` | Latest audit; four Next Steps links |
| **Bright Data** | `docs/bright-data-scaffold.md` | Official Live Context — activation, architecture |
| **Project context (AI)** | `docs/project-context-for-ai.md` | Single consolidated doc for AI onboarding |
| **PRD** | `docs/PRD.md` | Original product requirements |
| **Steps_Hackaton.txt** | `Steps_Hackaton.txt` | Hackathon rules, deadline, submission requirements |

---

## 4. PHASE 4 SCOPE

**Goal:** Maximize hackathon score (target 38–40/40) and prepare for submission.

### Mandatory Phase 4 deliverables

| Deliverable | Description | Where |
|-------------|-------------|-------|
| **README polish** | Full project description: all 3 modules, tech stack, data sources, **commercialisation paragraph** | `README.md` |
| **Demo script** | Reflect Phase 3 (12-month filter, "Showing X recent"); Council District in narration | `docs/demo-script-final.md` |
| **Commercialisation section** | One clear paragraph: white-label for cities, SaaS license, ~300 cities, Montgomery pilot | README + submission document |
| **Repo cleanup** | No dead code, unused deps; organize or archive obsolete `docs/qa/` files | Repo-wide |
| **Build verification** | `npm run build` passes; fix any TypeScript or build errors | — |
| **Submission document** | Short text: problem, solution, impact, commercialisation (for submission form) | New or existing doc |

### Optional (only if safe and time permits)

| Deliverable | Description | Risk |
|-------------|-------------|------|
| **Bright Data bonus** | "Official Live Context" section below What's Happening Nearby — **IMPLEMENTED**; disabled by default. See `docs/bright-data-scaffold.md`. | Optional — enable with `BRIGHT_DATA_ENABLED = true` and `BRIGHTDATA_API_KEY` |

### Do NOT do in Phase 4

- Change Phase 1, 2, 2.1, or 3 code or behavior
- Add auth, user accounts, write-back
- Broaden scope (ML, routing, predictive analytics)
- Break the demo flow or introduce instability

---

## 5. HACKATHON SCORING CONTEXT

| Criterion | Points | Current | Target | Phase 4 actions |
|-----------|--------|---------|--------|------------------|
| Consistency with challenge | 15 | ~14 | 14–15 | Demo script accurate; emphasize civic access in narration |
| Quality and design | 10 | ~8 | 9–10 | README, repo cleanup, clear structure |
| Originality and impact | 10 | ~7 | 9–10 | Demo narrative; "address-first" differentiation |
| Commercialisation potential | 5 | ~3.5 | 5 | Commercialisation paragraph in README + submission |
| **Total** | **40** | **~32** | **38–40** | |
| Bright Data bonus | variable | 0 | 0 or + | Optional; only if safe |

**Commercialisation narrative (from `docs/scoring-plan.md`):**
> "My Address, My City" is a white-label civic information product for mid-size U.S. cities. Montgomery is the pilot. The pattern — one address, one civic snapshot — is replicable in any city with ArcGIS-based open data. Customer: city governments, civic organizations. Revenue: annual license per city. Scale: ~300 mid-size U.S. cities with open data portals.

---

## 6. KEY FILE PATHS

```
src/
├── store/address-store.ts          # coordinates, label, isWithinMontgomery
├── utils/
│   ├── boundary.ts                 # isWithinMontgomery, MONTGOMERY_BOUNDS
│   ├── format-date.ts              # parseArcGISDateToTimestamp
│   └── recent-filter.ts            # filterToRecentOnly, getRecentCutoffMs
├── services/
│   ├── api/arcgis-client.ts
│   ├── datasets/                   # zoning, flood-zone, neighborhoods, parks, hospitals, community-centers, code-violations, building-permits, service-requests
│   └── search/geocode.ts
├── features/
│   ├── snapshot/                   # ThisAddress, NextSteps, use-snapshot
│   ├── closest/                    # WhatsClosest, use-closest
│   ├── happening/                  # WhatsHappeningNearby, use-happening
│   ├── summary/                    # CivicSnapshotSummary, use-civic-summary
│   └── official-live-context/      # Bright Data bonus (optional)
├── components/
│   ├── map/CityMap.tsx
│   ├── search/SearchBar.tsx
│   ├── cards/                      # InfoCard, ClosestCategoryCard, HappeningCategoryCard
│   └── feedback/                   # OutOfBoundsNotice, LoadingCard, ErrorCard, EmptyCard
├── config/                         # app-config.ts, feature-flags.ts
└── data/montgomery-city-boundary.json

api/
└── official-live-context.ts        # Vercel serverless (Bright Data SERP)
```

---

## 7. WORKFLOW (HOW TO WORK)

1. **Before changing:** Restate the task, list affected files, propose smallest viable change.
2. **Read first:** Use the documents in section 3 before editing.
3. **Preserve frozen phases:** Do not modify Phase 1, 2, 2.1, or 3 code.
4. **After changes:** Summarize what changed, confirm demo still works, suggest next step.
5. **Document:** Update README, demo script, or docs as needed.

---

## 8. RULES TO OBEY

- **Do not change** Phase 1, 2, 2.1, or 3 behavior or code
- **Do not** introduce auth, write-back, ML, complex routing
- **Do not** display data whose origin cannot be cited
- **Do not** use raw GIS field names in UI
- **Keep** all project artifacts in English
- **Prefer** stable demo over extra features
- **Respect** deadline: March 9, 2026, 9:00 AM CT — allocate 2+ hours buffer before submission

---

## 9. PHASE 4 TASK CHECKLIST

Use this as a working checklist. Prioritize by impact.

- [ ] Read `AGENTS.md`, `docs/scoring-plan.md`, `docs/demo-script.md`
- [ ] Update README: full description, all modules, tech stack, data sources
- [ ] Add commercialisation paragraph to README
- [ ] Review demo script: `docs/demo-script-final.md` (Council District included; Phase 3 reflected)
- [ ] Run `npm run build` — fix any errors
- [ ] Repo cleanup: dead code, unused deps, organize docs/qa
- [ ] Create or update submission document (problem, solution, impact, commercialisation)
- [ ] Optional: Enable Bright Data (set `BRIGHT_DATA_ENABLED = true` and add `BRIGHTDATA_API_KEY`)

---

## 10. HOW TO TALK TO ME

You can speak to me the same way the previous agent did:

- **Propose before implementing** — restate the task, list affected files, propose approach
- **Summarize after changes** — what changed, what risks remain, is the demo still shippable
- **Ask if unclear** — I will clarify scope, priorities, or constraints
- **Flag blockers** — e.g., build fails, missing info, conflicting requirements
- **Prefer small steps** — one deliverable at a time, confirm before moving on

I will respond with decisions, clarifications, or approval to proceed.

---

**End of prompt body.**
