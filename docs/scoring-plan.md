# Scoring Plan
## My Address, My City

This document maps every feature and phase to the hackathon rubric. The goal is to make scoring intentional, not accidental.

---

## Rubric Summary

| Criterion | Points | Weight | What judges look for |
|---|---|---|---|
| Consistency with challenge statements | 15 | 37.5% | How directly the solution addresses the chosen challenge |
| Quality and design | 10 | 25% | Code repository quality, design artifacts, UX polish |
| Originality and impact | 10 | 25% | How different is this from existing solutions, how meaningful is the potential effect |
| Commercialisation potential | 5 | 12.5% | Plausible path for this to exist beyond the hackathon |
| **Total** | **40** | **100%** | |
| Bright Data bonus | variable | extra | Optional bonus for integrating Bright Data |

**Late penalty:** -1 point per 2-hour window past the March 9, 9AM CT deadline. Max penalty: -5.

---

## Strategy by Criterion

### 1. Consistency with Challenge Statements (15 pts)

**Our challenge:** Civic Access & Community Communication

**How we score high:**

| Feature | Challenge fit justification |
|---|---|
| Address search + map click | Residents access civic information about their own location — core civic access |
| This Address (zoning, flood, district) | Turns fragmented public records into a readable civic snapshot |
| Next Steps (city links, report issue) | Direct community communication — connects the resident to city services |
| What's Closest (nearest civic resources) | Shows spatial accessibility to public services — civic access in geographic terms |
| What's Happening Nearby (311, violations, permits) | Surfaces neighborhood-level city activity — community awareness |
| Plain language throughout | Removes the barrier between public data and public understanding |

**Risk:** Overbuilding features that are technically impressive but don't connect to the challenge. Avoid this.

**Target:** 14–15/15 by Phase 3.

---

### 2. Quality and Design (10 pts)

**How judges assess this:** Code repository and design artifacts.

| What scores points | Where we deliver it |
|---|---|
| Clear repo structure | Folder structure documented in `architecture.md`, consistent naming |
| Readable code | TypeScript, small files, service-layer separation, no business logic in UI |
| Documentation | PRD, architecture, data-sources, scoring-plan, demo-script, validation-log |
| UX polish | Tailwind-based clean design, card layout, loading/error/empty states |
| Consistent design language | Single-screen layout, tab navigation, Leaflet map, resident-friendly labels |
| No dead code or unused dependencies | Phase 4 repo cleanup |

**Phase-by-phase build-up:**

| Phase | Quality actions | Estimated score |
|---|---|---|
| Phase 1 | Working layout, clean code, basic docs | 6.5/10 |
| Phase 2 | Better UX polish, more complete docs | 7.5/10 |
| Phase 3 | Full feature set with consistent design | 8.5/10 |
| Phase 4 | Polished README, clean repo, no dead code, complete docs | 9.5–10/10 |

---

### 3. Originality and Impact (10 pts)

**How we differentiate:**

| Differentiator | Why it matters |
|---|---|
| Address-first civic snapshot | Most civic portals are map-layer viewers or dashboards. This inverts the paradigm: start from the resident's address, not from the data layer. |
| "What's Happening Nearby" | Turns static lookup into a dynamic neighborhood awareness tool. Few civic apps do this. |
| Accessibility-as-a-lens (What's Closest) | Connects to a professional spatial accessibility perspective without adding model complexity. Simple proximity, but framed as "how accessible are civic resources from where you live." |
| Plain language framing | Most civic data tools are built for analysts. This one is built for the person who lives there. |
| Single-screen, tab-based UX | No navigation complexity. One address, one screen, all answers. |

**What does NOT count as originality:**
- Using ArcGIS (everyone can)
- Using React + Leaflet (common stack)
- Having a map (expected)

**The originality is in the framing, the user experience, and the civic intent — not in the technology.**

**Phase-by-phase build-up:**

| Phase | Originality actions | Estimated score |
|---|---|---|
| Phase 1 | Address-first concept is clear but limited | 6/10 |
| Phase 2 | Accessibility lens adds differentiation | 7.5/10 |
| Phase 3 | "What's happening nearby" makes it unique | 8.5/10 |
| Phase 4 | Demo polish makes the narrative land | 9–10/10 |

---

### 4. Commercialisation Potential (5 pts)

**Our narrative:**

"My Address, My City" is a **white-label civic information product for mid-size U.S. cities**. Montgomery is the pilot deployment. The pattern — one address, one civic snapshot — is replicable in any city with ArcGIS-based open data (which is most U.S. cities).

| Element | Detail |
|---|---|
| Customer | City governments, civic organizations, community development groups |
| Revenue model | SaaS: annual license per city deployment |
| Scale | ~300 mid-size U.S. cities with open data portals |
| Competitive advantage | Resident-first UX, not another GIS dashboard |
| IP ownership | Retained by team per hackathon rules |

**Where we state this:** In the README, in the submission text, and in the demo closing. One clear paragraph is sufficient.

**Phase-by-phase build-up:**

| Phase | Commercialisation actions | Estimated score |
|---|---|---|
| Phase 1 | Concept is plausible but not articulated | 2/5 |
| Phase 2 | Scalability becomes visible | 2.5/5 |
| Phase 3 | Multi-module product looks real | 3.5/5 |
| Phase 4 | Commercialization paragraph in README + demo closing | 5/5 |

---

### 5. Bright Data Bonus

**Status:** Optional. Phase 4 only.

**Possible integration:**
- Use Bright Data's web scraping or SERP API to pull recent public web context for an address or area in Montgomery
- Display as a "Recent Official Context" tab (Module 5)
- Could include: recent city news, public meeting notices, related official pages

**Rules:**
- Only implement after the core app (Phases 1–3) is stable
- Must not break any existing functionality
- Must not become a dependency of the main flow
- If it risks the submission deadline, skip it entirely

**Risk tolerance:** Low. The bonus is not worth losing points on quality or stability.

---

## Consolidated Score Trajectory

| Phase | Challenge fit | Quality | Originality | Commercial | Bonus | Total |
|---|---|---|---|---|---|---|
| Phase 1 | 13/15 | 6.5/10 | 6/10 | 2/5 | 0 | **27.5/40** |
| Phase 2 | 14/15 | 7.5/10 | 7.5/10 | 2.5/5 | 0 | **31.5/40** |
| Phase 3 | 14.5/15 | 8.5/10 | 8.5/10 | 3.5/5 | 0 | **35/40** |
| Phase 4 | 15/15 | 9.5–10/10 | 9–10/10 | 5/5 | possible | **38.5–40 + bonus** |

---

## Phase Gate Scoring Strategy

### Why Phase 1 Must Stay Demoable at All Times

Phase 1 alone scores an estimated 27.5/40. That is a valid, submittable hackathon entry. Every phase after Phase 1 adds points, but only if it does not break Phase 1.

If Phase 2 adds a What's Closest tab but introduces a bug that makes the map stop loading — that is not +4 points. That is -27.5 points. The net effect is catastrophic.

**Rule:** After Phase 1 is complete, every commit must leave the app in a state where Phase 1 still demos cleanly. If a later-phase change causes Phase 1 to regress, the later-phase change must be reverted immediately.

### Why Unstable Bonus Features Lower the Score

An unstable bonus feature damages scoring in multiple criteria simultaneously:
- **Quality/design** drops because judges see errors, slow loads, or broken UI
- **Originality/impact** is undermined because the demo narrative is disrupted
- **Challenge fit** is weakened if the broken feature obscures the core civic access story

A clean app with 3 working modules always outscores a messy app with 5 modules where 2 are broken. Judges remember the failures more than the features.

### Late Submission Risk

The hackathon deadline is **March 9, 2026, 9:00 AM CT**. Late penalties:
- 9:01 AM → -1 point
- 11:01 AM → -2 points
- Maximum penalty: -5 points

**Rule:** Submission readiness always takes priority over feature completeness. If the choice is between finishing Phase 3 and submitting on time with Phase 2, submit on time with Phase 2. A Phase 2 submission scores ~31.5/40. A Phase 3 submission that is 2 hours late scores at most ~33/40 — barely better, and only if nothing else went wrong.

Allocate at least **2 hours** before the deadline for:
- Final demo recording
- README review
- Repository cleanup
- Submission form completion
- Buffer for unexpected issues

### Phase Cut Table

If a phase is unstable at submission time, cut it rather than ship it broken.

| Phase | Minimum shippable condition | If unstable, what gets cut first |
|---|---|---|
| Phase 1 | Address search (or map click) + zoning + flood + neighborhoods + Next Steps work end-to-end. Council and parcels are optional. | Nothing — Phase 1 is mandatory. Fix it. If council/parcels fail, show graceful "Not available" — do not block the demo. |
| Phase 2 | At least one resource type shows with distance label and map marker | Remove "What's Closest" tab entirely. Submit Phase 1 only. |
| Phase 3 | At least one nearby dataset (violations or permits) displays as summary cards | Remove "What's Happening Nearby" tab. Submit Phase 1 + 2. |
| Phase 4 | Bright Data layer adds value without errors | Remove bonus tab. Polish repo and demo. Submit Phase 1 + 2 + 3. |

---

## Validation-Informed Phase 1 Scope (2026-03-07)

Phase 1 has been narrowed to a validated core based on real test results:

| Source | Validation status | Phase 1 role |
|---|---|---|
| Zoning | **Live-tested — PASS** | Core |
| Flood zones | **Live-tested — PASS** | Core |
| Neighborhoods | **Endpoint confirmed, high confidence** | Core |
| CORS (direct browser access) | **Confirmed — PASS** | Architectural foundation |
| Geocoding (Nominatim) | **Pending test** | Core input method (map click is fallback) |
| Council districts | **Service found, query pending** | Optional — add if validates |
| Parcels | **Empty result** | Deferred |

**Scoring impact:** A Phase 1 with 3 validated data layers (zoning, flood, neighborhoods) plus Next Steps is still a strong submission. The narrower scope protects demo stability. If council and parcels validate during build, they strengthen quality/design but are not required for the estimated 27.5/40.

---

## Key Tradeoff Rules

When facing a decision during implementation:

1. **Challenge fit > extra features.** A feature that doesn't connect to Civic Access & Community Communication is a distraction, not a bonus.
2. **Stable demo > clever complexity.** If a feature is impressive but fragile, it hurts more than it helps during a live demo.
3. **Cleaner repo > broader scope.** Judges assess the GitHub repository. A messy repo with more features scores lower than a clean repo with fewer features.
4. **User value > technical novelty.** Judges are not scoring your tech stack. They are scoring whether your solution matters to someone.
5. **Ship on time > ship everything.** A late submission loses 1 point per 2-hour window. Finishing Phase 2 on time beats finishing Phase 3 one hour late.
6. **Remove broken modules > show broken modules.** A clean 3-tab app beats a 5-tab app with 2 broken tabs. Hide instability; never display it.
