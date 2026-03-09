# Phase 2 Regression Report
## My Address, My City

**Date:** March 7, 2025  
**Scope:** Phase 1 + Phase 2 regression checks after audit

---

## Phase 1 Regression Checks

| # | Scenario | Result | Notes |
|---|----------|--------|-------|
| P1-1 | Address search returns zoning | PASS | Urban Center Zone for downtown |
| P1-2 | Address search returns flood context | PASS | Zone X (Minimal Risk) |
| P1-3 | Address search returns neighborhood | PASS | Downtown Neighborhood Association |
| P1-4 | Map click triggers reverse geocode | PASS | Label updates from coordinates |
| P1-5 | Map click shows zoning/flood/neighborhood | PASS | All cards populate |
| P1-6 | Failed search clears data | PASS | Error message, no stale data |
| P1-7 | Out-of-bounds shows notice | PASS | "Outside Montgomery" |
| P1-8 | Next Steps tab shows links | PASS | 3 links + disclaimer |
| P1-9 | Search input clears on map click | PASS | Per Phase 1 fix |
| P1-10 | Error clears on map click | PASS | Per Phase 1 fix |

**Phase 1 regression:** **10/10 PASS**

---

## Phase 2 Regression Checks

| # | Scenario | Result | Notes |
|---|----------|--------|-------|
| P2-1 | What's Closest tab shows park | PASS | Name + distance |
| P2-2 | What's Closest tab shows hospital | PASS | Name + distance |
| P2-3 | Park name is plain text (no URL) | PASS | Lister Hill Plaza, Court Square, etc. |
| P2-4 | Hospital name is title case | PASS | Capital Hill Health Care & Rehab |
| P2-5 | Distance labeled "Approximate" | PASS | "Approximate distance: X mi" |
| P2-6 | Community center card hidden | PASS | Only Parks and Hospitals |
| P2-7 | Anchor marker visible | PASS | Blue marker at selected point |
| P2-8 | Resource markers visible | PASS | Green markers for park/hospital |
| P2-9 | Location change refreshes closest | PASS | New search → new results |
| P2-10 | Tab switch during load | PASS | No errors |

**Phase 2 regression:** **10/10 PASS**

---

## Final Regression Assessment

| Phase | Pass | Fail | Assessment |
|-------|------|------|------------|
| Phase 1 | 10 | 0 | **No regressions** |
| Phase 2 | 10 | 0 | **No regressions** |

**Conclusion:** Phase 2 implementation did not introduce regressions. Phase 1 and Phase 2 are both stable.
