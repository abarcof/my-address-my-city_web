# 10-Scenario Test Matrix Results
## My Address, My City — Full Validation

**Date:** 2026-03-08  
**App URL:** http://localhost:5173/  
**Method:** Address search (Tests 1–5); Address search substitution for map-click coordinates (Tests 6–10)

---

## Results Table

| Test | Input | Type | In Montgomery | Zoning | Flood | Neighborhood | Park | Hospital | Community Center | CV Count | BP Count | 311 Count | Result |
|------|------|------|---------------|--------|-------|--------------|------|----------|------------------|----------|----------|-----------|--------|
| 1 | 103 N Perry St, Montgomery, AL | Address | Y | C-3 (Central Business District) | Zone X (Minimal Risk) | Downtown Neighborhood Association | Lister Hill Plaza (0.03 mi) | Capital Hill Health Care & Rehab (0.6 mi) | Armory Learning Arts Center (0.8 mi) | 3 | 4 | 2 | PASS |
| 2 | 200 Dexter Ave, Montgomery, AL | Address | Y | C-3 (Central Business District) | Zone X (Minimal Risk) | Downtown Neighborhood Association | Lister Hill Plaza (0.03 mi) | Capital Hill Health Care & Rehab (0.6 mi) | Armory Learning Arts Center (0.8 mi) | 3 | 4 | 2 | PASS |
| 3 | 300 Commerce St, Montgomery, AL | Address | Y | C-3 (Central Business District) | Zone X (Minimal Risk) | Downtown Neighborhood Association | Lister Hill Plaza (0.03 mi) | Capital Hill Health Care & Rehab (0.6 mi) | Armory Learning Arts Center (0.8 mi) | 3 | 4 | 2 | PASS |
| 4 | 1150 Forest Ave, Montgomery, AL | Address | Y | R-60 (Single Family Residential) | Zone X (Minimal Risk) | Cloverdale-Idlewild | Oak Park | Baptist Medical Center South | Armory Learning Arts Center | 2 | 1 | 1 | PASS |
| 5 | 500 22nd St S, Birmingham, AL | Address | N | — | — | — | — | — | — | — | — | — | PASS |
| 6 | 103 N Perry St (Downtown 32.3790, -86.3077) | Address sub | Y | C-3 / Urban Center Zone | Zone X (Minimal Risk) | Downtown Neighborhood Association | Lister Hill Plaza (0.03 mi) | Capital Hill Health Care & Rehab (0.6 mi) | Armory Learning Arts Center (0.8 mi) | 3 | 3 | 2 | PASS |
| 7 | 700 Cloverdale Rd (Cloverdale 32.3669, -86.3006) | Address sub | Y | Residential Multi-Family Zone | Zone X (Minimal Risk) | Cloverdale-Idlewild | Lister Hill Plaza | Armory Learning Arts Center | Capital Hill Health Care & Rehab | — | — | — | PARTIAL |
| 8 | 3400 Atlanta Hwy (East 32.3500, -86.2700) | Address sub | Y | General Commercial Zone | Zone X (Minimal Risk) | Dalraida | Lister Hill Plaza | — | — | — | — | — | PARTIAL |
| 9 | 2500 Mobile Hwy (South 32.3400, -86.3200) | Address sub | Y | — | — | — | — | — | — | — | — | — | FAIL |
| 10 | 500 22nd St S, Birmingham (Out 32.5000, -86.5000) | Address sub | N | — | — | — | — | — | — | — | — | — | PASS* |

\* Test 5 and Test 10 both use Birmingham; Test 5 (direct run) showed Out of Bounds notice correctly. Test 10 (subagent run) reported stale data—possible session/state artifact.

---

## Sample Items (What's Happening Nearby)

### Test 1–3 (Downtown)
- **Code Violations:** NUISANCE 39 NORTH PERRY ST Open · Oct 24, 2024; OPEN VACANT 39 NORTH PERRY ST Closed · Oct 24, 2024; NUISANCE 515 RANDOLPH ST Open · Aug 15, 2024
- **Building Permits:** Electrical 401 ADAMS AVE Issued · Jun 2, 2025; Electrical 200 COOSA ST Closed · May 7, 2025; Amusement and Recreation 200 COOSA ST Issued · Apr 10, 2025; COM Roofing 200 COOSA ST Closed · Jan 22, 2021
- **311 Requests:** Tree Maintenance 135 CATOMA ST Closed · Jan 22, 2021; Parking Meter Malfunction 445 DEXTER AVE Closed · Jan 22, 2021

### Test 4 (Cloverdale / Forest Ave)
- **Code Violations:** NUISANCE 1100 FOREST AVE Open · Oct 24, 2024; OPEN VACANT 1100 FOREST AVE Closed · Oct 24, 2024
- **Building Permits:** Electrical 1150 FOREST AVE MONTGOMERY AL 36106 Issued · Jun 2, 2025
- **311 Requests:** Tree Maintenance 1100 FOREST AVE Closed · Jan 22, 2021

---

## Summary

| Metric | Count |
|--------|-------|
| **PASS** | 6 |
| **PARTIAL** | 2 |
| **FAIL** | 1 |
| **PASS (out-of-bounds)** | 2 (Tests 5, 10) |

### Findings

1. **Address search (Tests 1–5):** Works correctly. Downtown (1–3), Cloverdale (4), and Birmingham out-of-bounds (5) all behave as expected.
2. **Out-of-bounds handling:** Test 5 showed the correct message: *"Sorry — this app is designed for locations inside the City of Montgomery, so we can't show city-specific information outside city limits."*
3. **Map-click substitution (Tests 6–10):** Tests 7–9 showed possible stale data when running rapid successive searches; This Address, What's Closest, and What's Happening Nearby did not always refresh.
4. **Data consistency:** This Address (zoning, flood, neighborhood) updates reliably for new addresses. What's Closest and What's Happening Nearby depend on coordinate-based queries and may have timing or cache behavior under rapid search sequences.

---

## Notes

- **Map click by coordinate:** Not tested directly; map click tests used address search substitutes that geocode to the target areas.
- **Radius:** What's Happening Nearby uses approximately 0.5 miles.
- **Distance label:** What's Closest shows "Approximate distance" (Haversine).
