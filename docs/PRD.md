# Product Requirements Document
## My Address, My City

**Author:** Aicardo Barco Fajardo · abarcof@gmail.com

---

## 1. Product Objective

My Address, My City is a public web application, deployable via link, designed for residents and general users. It transforms an address or a map point into a clear and useful snapshot of the immediate urban context.

The app must answer three simple questions:

1. What is exactly at this point?
2. What is closest to this point?
3. What is happening near this point?

The core idea remains the best general option due to its balance between available data, civic value, and visual demo potential. Montgomery has a particularly strong ecosystem in planning/development clarity, service delivery, public safety signals, and city resources visible in the open data portal.

---

## 2. Hackathon Positioning

| Track | Alignment |
|---|---|
| Primary | Civic Access & Community Communication |
| Secondary | Smart Cities / Infrastructure / Public Spaces |
| Optional tertiary | Public Safety / City Analytics |

This combination is strategic because the rubric awards 15 out of 40 points for consistency with challenge statements. Montgomery has a strong opportunity to turn fragmented official data into a clearer, more actionable experience for residents.

---

## 3. Product Principles

The app will NOT be:
- a technical GIS viewer
- a chatbot as the core experience
- a prediction or scoring system
- a complex multi-screen portal

The app WILL be:
- an address-based answer engine
- written in plain civic language
- visually clear
- grounded in official data
- always pointing to a useful next step

The submission must be a working prototype plus a short demo, not a finished commercial product.

---

## 4. Final Product Form

### Recommended design

A single main screen with:
- search bar at the top
- map at the center
- side panel (left or right)
- tabs or modules inside the panel

### Tabs / Modules (as implemented)

- This Address
- What's Closest
- Nearby City Records
- City Resources
- Phase 4 only: Recent Official Context / Bonus (when Bright Data enabled)

This structure is preferred over multiple screens because it:
- makes the demo easier to follow
- reduces navigation overhead
- keeps the jury focused
- protects the MVP

---

## 5. User Inputs

Two entry points from the start:

**A. Search by address**
The user types an address.

**B. Select on map**
The user clicks on the map.

This reduces technical risk. If address search is slow or fails, map click keeps the demo alive.

---

## 6. Tone and Experience

The app should feel:
- simple
- civic
- useful
- fast
- trustworthy
- non-technical

**Good labels:** Zoning, Flood context, District, What's closest, What's happening nearby, What can I do next?

**Bad labels:** raw GIS field names, overly technical terminology, dense tables

---

## 7. Module Structure

### Module 1 — This Address

**Purpose:** Show the exact information associated with the queried point.

**Content (as implemented):**
- Zoning
- Flood risk
- Council district
- Neighborhood
- Property record (parcel)
- Trash & recycling schedule
- Short plain-language summary

**Value:** This module covers the core question: "What does this address mean within Montgomery's urban system?" The Zoning Lookup, Flood Zone Lookup, and address-based ecosystem are among the strongest and most buildable parts of the open data portal.

---

### Module 2 — What's Closest

**Purpose:** Show the nearest resources to the point.

**Logic:**
- No complex scoring
- No Kriging
- No explicit Dijkstra

Only:
- nearest resource
- simple distance or relative proximity
- a useful human-readable label

**Initial recommended resources** (subject to dataset validation):
- Community Centers
- Parks and Trails
- Other validated civic resources from the portal

If validated, additional critical resources may include: police stations, fire stations, shelters, or equivalent services.

**Technical differentiator:** Accessibility as a lens — not a complex model, but a spatial access reading. Simple proximity logic showing whether a resident is near or far from key civic nodes.

**Distance labeling rule:** All distances displayed to residents must be labeled as "approximate distance" or "straight-line distance" unless true routing or travel-time logic is implemented. The app must never imply walking, driving, or transit time unless it actually calculates it.

---

### Module 3 — What's Happening Nearby

**Purpose:** Show active or recent urban signals around the point.

**Initial content:**
- Nearby 311 service requests
- Nearby code violations
- Nearby permits

**UX idea:** This module must not overwhelm with tables. It should answer something like:
- "There are open code issues near this address"
- "Recent permits were issued nearby"
- "Nearby city service requests include…"

This helps with originality/impact because it turns a layer viewer into an app with useful contextual awareness.

**Radius disclosure rule:** Once implemented, the app must state the radius used for "nearby" queries (e.g., "within 0.5 miles"). The radius must be documented and consistent across datasets within this module. If different datasets use different radii, each must be labeled individually.

---
### Module 4 — City Resources

**Purpose:** Convert information into action.

**Content:**
- Report an issue
- Apply for permits
- Request public records
- Stay informed
- Request alerts (Formspree)
- Official links

**Rule:** The app informs and guides. It does not replace official decisions or transactional city systems.

---

### Module 5 — Recent Official Context *(Phase 4 only)*

**Purpose:** Add an optional layer of recent context as a bonus.

**Source:** Bright Data as an optional enrichment layer.

**Possible content:**
- Recent web context
- Related public notices
- Official pages related to the topic or area

**Rule:** This must never be a dependency of the main flow. The core must work 100% on stable, already-visible official data.

---

## 8. Build Phases

### Phase 1 — Shippable MVP (validated scope as of 2026-03-07)

This phase alone must be ready to submit.

**Validated core includes:**
- Address search (geocoding via Nominatim or fallback)
- Map click selection
- City Resources module
- Next Steps module
- Main layout
- Stable, functional demo
- Direct browser fetch to Montgomery ArcGIS (CORS confirmed)

**Optional additions if validated during build:**
- Council districts (service discovered, query pending)
- Parcels (returned empty — may be resolved with different parameters)

**Score estimate:**
| Criterion | Score |
|---|---|
| Challenge fit | 13/15 |
| Quality / design | 6.5/10 |
| Originality / impact | 6/10 |
| Commercialisation | 2/5 |
| Bonus | 0 |
| **Total** | **27.5/40** |

**Outcome:** Submittable. If time runs out here, this can be delivered.

---

### Phase 2 — What's Closest

**Includes:**
- What's Closest module
- Nearest civic resources
- Simple proximity reading
- Improved snapshot UX

**Score estimate:**
| Criterion | Score |
|---|---|
| Challenge fit | 14/15 |
| Quality / design | 7.5/10 |
| Originality / impact | 7.5/10 |
| Commercialisation | 2.5/5 |
| Bonus | 0 |
| **Total** | **31.5/40** |

**Outcome:** Highly competitive. Differentiation starts here.

---
### Phase 3 — Nearby City Records

**Includes:**
- Nearby 311
- Nearby code violations
- Nearby permits
- Visual layer and side panel summary

**Score estimate:**
| Criterion | Score |
|---|---|
| Challenge fit | 14.5/15 |
| Quality / design | 8.5/10 |
| Originality / impact | 8.5/10 |
| Commercialisation | 3.5/5 |
| Bonus | 0 |
| **Total** | **35/40** |

**Outcome:** Finalist-level product candidate.

---

### Phase 4 — Finalist Package / 40+ Bonus Layer

**Includes:**
- Polished repository
- Strong README
- Demo script
- Short pitch deck
- App claims evaluation
- Validation log
- Commercialization paragraph
- Optional Bright Data layer

**Score estimate:**
| Criterion | Score |
|---|---|
| Challenge fit | 15/15 |
| Quality / design | 9.5–10/10 |
| Originality / impact | 9–10/10 |
| Commercialisation | 5/5 |
| Bonus | yes, potential |
| **Total** | **38.5–40/40 + bonus** |

**Outcome:** Submission optimized to win.

---

## 9. Submission Safety Rule

If a later-phase module is unstable at submission time, it must be **hidden or removed** from the final build rather than shipped in a broken state. A clean, stable app with fewer modules always scores higher than a broken app with more modules.

Specifically:
- If Phase 3 (Nearby City Records) is unstable, remove the tab. Submit Phases 1 + 2.
- If Phase 3 (What's Happening Nearby) is unstable, remove the tab. Submit Phases 1 + 2.
- If Phase 4 bonus (Recent Official Context) is unstable, remove the tab. Submit Phases 1 + 2 + 3.
- Never leave a broken, half-working, or error-prone tab visible in the submitted app or demo recording.

The principle is: **protect the core submission at all times.**

---

## 10. Phase Gates (Go / No-Go Criteria)

Each phase has explicit conditions that must be met before moving forward. These are non-negotiable.

### Phase 1 → Phase 2 Gate

Before starting Phase 2, ALL of the following must be true:
- [ ] Address search returns correct coordinates for test addresses (or map click works as primary input)
- [ ] Map click stores coordinates and triggers data fetch
- [ ] Zoning query returns and displays data for test points (validated)
- [ ] Flood zone query returns and displays data for test points (validated)
- [ ] Neighborhoods query returns and displays data for test points (high confidence)
- [ ] "City Resources" tab shows working links
- [ ] Loading, empty, and error states all display correctly
- [ ] The app can be demoed end-to-end in under 50 seconds without errors
- [ ] No console errors in a clean run

### Phase 2 → Phase 3 Gate

Before starting Phase 3, ALL of the following must be true:
- [ ] All Phase 1 gate conditions still pass (no regression)
- [ ] At least one resource type (parks or community centers) displays with distance
- [ ] Distances are labeled as "approximate" or "straight-line"
- [ ] Map markers appear for nearest resources
- [ ] The full demo (Phase 1 + 2) runs cleanly in under 60 seconds

### Phase 3 → Phase 4 Gate

Before starting Phase 4, ALL of the following must be true:
- [ ] All Phase 2 gate conditions still pass (no regression)
- [ ] At least one "nearby" dataset (code violations or permits) displays correctly
- [ ] Radius is stated in the UI
- [ ] Summary cards display in plain language, not raw field names
- [ ] The full demo (Phase 1 + 2 + 3) runs cleanly in under 75 seconds

### Phase 4 Completion Gate

Before final submission:
- [ ] All Phase 3 gate conditions still pass
- [ ] README is complete and clear
- [ ] Demo recording is made and reviewed
- [ ] All claims in `app-claims.md` with status "Verified" have been actually tested
- [ ] `validation-log.md` is up to date
- [ ] Repository has no dead code, unused dependencies, or console errors

---

## 11. What Makes This Version Different

The real difference will not come from more complex math.
The difference will be this combination:

- Address-based civic snapshot
- Nearest civic access
- Nearby operational context
- Resident-friendly language
- Submission polish

That is far stronger for this hackathon than injecting artificial scoring or hard-to-explain interpolation.

---

## 12. GitHub and Final Submission Format

GitHub will be the primary repository.

**Recommended final format:**
- Public app with a shareable link
- GitHub repository
- Short demo
- Submission text / pitch

**Deployment recommendation:**
- Vercel if the app grows or needs extra functions
- GitHub Pages only if strictly client-side at the end

Preferred: **GitHub + Vercel**.

---

## 13. Required Documents

| File | Purpose |
|---|---|
| `docs/PRD.md` | This document |
| `docs/architecture.md` | Technical architecture |
| `docs/data-sources.md` | Validated data sources |
| `docs/scoring-plan.md` | Hackathon scoring strategy |
| `docs/demo-script.md` | Demo walkthrough script |
| `docs/app-claims.md` | Claims made by the app |
| `docs/validation-log.md` | Verification log for AI-generated output |
| `docs/submission-checklist.md` | Final submission checklist |

The validation log and app claims files are especially important because the hackathon guidance emphasizes verifying what AI generates and not assuming something works just because it looks right.

---

## 14. Geocoding Strategy

The app requires a geocoding service to convert user-typed addresses into map coordinates.

| Priority | Service | Pros | Cons |
|---|---|---|---|
| 1 (default) | Nominatim (OpenStreetMap) | Free, no API key, simple REST call | Accuracy for Montgomery addresses unverified |
| 2 (fallback) | ArcGIS World Geocoder | Best accuracy for US addresses, native to the ArcGIS ecosystem | Requires a free ArcGIS developer API key |
| 3 (optional) | Montgomery Address Points layer | Most Montgomery-specific data | Requires building a text search against a FeatureServer, more implementation work |

**Decision:** Start with Nominatim. Test with 5–10 known Montgomery addresses (e.g., City Hall at 103 N Perry St). If accuracy is insufficient, swap to ArcGIS World Geocoder. The geocoding logic lives in a single service file (`services/search/geocode.ts`), so switching providers is a one-file change with no impact on the rest of the app.

---

## 15. CORS Mitigation

Montgomery's ArcGIS server (`gis.montgomeryal.gov`) may not include CORS headers that allow direct browser requests. This is a common limitation with municipal ArcGIS deployments and must be tested before writing service code.

**Mitigation plan:**
1. **Test immediately** — before any implementation, make a simple `fetch()` call from a browser to a known endpoint. If CORS headers are present, proceed with direct client-side calls.
2. **Development fallback** — use Vite's built-in dev proxy to route requests through the local dev server.
3. **Production fallback** — add a single Vercel serverless function (`api/proxy.ts`) that forwards requests. This is not backend architecture — it is a one-file passthrough with no business logic.

This must be the **first technical validation step** before any service layer code is written.

---

## 16. Error, Empty, and Out-of-Bounds Handling

The app must handle non-happy-path states gracefully. Residents should never see raw error messages, blank screens, or unexplained empty panels.

| Scenario | User-facing response |
|---|---|
| Data is loading | Skeleton placeholder or subtle spinner with "Loading..." |
| Query returns data | Normal display |
| Query returns empty | "No [zoning/flood/etc.] data found for this location." |
| Query fails (network/server error) | "Could not reach city data right now. Please try again." with a retry button |
| Point is outside Montgomery | "This location appears to be outside Montgomery city limits. Try selecting a point within the city." |
| One query fails, others succeed | Show successful data normally; show inline error only for the failed field |
| Geocoding returns no results | "We couldn't find that address. Try a different address or click directly on the map." |

**Principle:** Partial data is better than no data. Never block the entire side panel because one of four queries failed.

---

## 17. 311 Data — Not Implemented

311 service requests are **not integrated** in the current app. The tab "Nearby City Records" shows code violations and building permits only.

- The `QAlert/QAlert_311/MapServer` contains **sanitation and garbage schedule layers** (used in This Address for trash schedule), not general 311 requests.
- `HostedDatasets/Received_311_Service_Request` is documented in `data-sources.md` as the correct 311 endpoint but is **not wired into the app**.

Phase 3 ships with code violations and building permits.

---

## 18. Commercialization Potential

My Address, My City could be offered as a **white-label civic information tool for mid-size U.S. cities**. Montgomery is the pilot. The core value proposition — turning one address into a clear civic snapshot — is not Montgomery-specific; it applies to any city that publishes open GIS data.

**Potential model:** A city government or civic organization pays a modest SaaS fee for a branded deployment. The data stays on the city's own servers. The app provides the resident-facing interface, theming, and UX layer.

**Why this is plausible:** Most cities have open data portals with similar ArcGIS-based infrastructure. The technical pattern (query by point, normalize, display) is highly replicable. The differentiation is not the technology — it is the resident-first design and the "one address, one answer" framing.

---

## 19. Demo Flow (60–90 seconds)

The demo must be tight, visual, and self-explanatory.

| Step | Action | Duration | What the audience sees |
|---|---|---|---|
| 1 | Open the app | 3s | Clean map of Montgomery, search bar prominent |
| 2 | Type "103 N Perry St" (City Hall) | 5s | Address autocomplete, map zooms to location |
| 3 | Show "This Address" tab | 12s | Zoning, flood zone, council district, neighborhood info in clean cards |
| 4 | Click "City Resources" tab | 8s | Actionable links: report issue, apply for permits, city contacts |
| 5 | Click "What's Closest" tab | 12s | Nearest park, community center with distance labels and map markers |
| 6 | Click "Nearby City Records" tab | 12s | Recent code violations, permits displayed as summary cards + map dots |
| 6 | Click "What's Happening Nearby" tab | 12s | Recent code violations, permits displayed as summary cards + map dots |
| 7 | Click a different point on the map | 8s | All tabs update instantly — demonstrates the app works for any location |
| 8 | Close with tagline | 5s | "One address. Your city. Clear answers." |
| | **Total** | **~65s** | |

**Backup plan:** If any module fails during the live demo, skip to the next tab. The single-screen layout ensures no navigation dead ends. The map click fallback (step 7) proves the app is not a static mockup.

---

## 20. Final Decision

| Item | Decision |
|---|---|
| Product | My Address, My City |
| Phase 1 | This Address |
| Phase 3 | Nearby City Records |
| Phase 3 | What's Happening Nearby |
| Phase 4 | Finalist Package + Bonus |
| Approach | civic, simple, visual, Montgomery-specific, real-data-first, GitHub-centered, build-by-phases, score-optimized |
| Goal | Deliver an app that maximizes all 40 points + bonus |
