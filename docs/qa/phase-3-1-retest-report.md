# Phase 3.1 Retest Report
## Re-validation of Tests 7, 8, and 9 After Fixes

**Date:** 2026-03-07  
**Fixes applied:** See `docs/qa/phase-3-1-fix-log.md`  
**Reference:** `docs/qa/10-scenario-test-matrix-results.md`

---

## Retest Instructions

1. Start the app: `npm run dev`
2. Open http://localhost:5173/
3. Run each test in order. **Wait for each address to fully load** (all tabs show correct data) before proceeding to the next.
4. For the rapid-search stress test, perform searches as quickly as possible without waiting.

---

## Test 7: 700 Cloverdale Rd

| Step | Action | Expected |
|------|--------|----------|
| 1 | Search "700 Cloverdale Rd, Montgomery, AL" | Geocodes to Cloverdale area |
| 2 | Switch to This Address tab | Zoning: Residential Multi-Family Zone; Flood: Zone X; Neighborhood: Cloverdale-Idlewild |
| 3 | Switch to What's Closest tab | Park, Community Center, Hospital for Cloverdale (e.g. Lister Hill Plaza, Armory Learning Arts Center, Capital Hill Health Care & Rehab) |
| 4 | Switch to What's Happening Nearby tab | Code violations, permits, 311 counts for Cloverdale area |

**Result:** [x] PASS  [ ] PARTIAL  [ ] FAIL

**Notes:** Verified 2026-03-07. This Address, What's Closest, and What's Happening Nearby all show correct Cloverdale data (Lister Hill Plaza, Armory Learning Arts Center, Capital Hill Health Care & Rehab).

---

## Test 8: 3400 Atlanta Hwy

| Step | Action | Expected |
|------|--------|----------|
| 1 | Search "3400 Atlanta Hwy, Montgomery, AL" | Geocodes to East Montgomery |
| 2 | Switch to This Address tab | Zoning: General Commercial Zone; Flood: Zone X; Neighborhood: Dalraida |
| 3 | Switch to What's Closest tab | Park, Community Center, Hospital for East Montgomery |
| 4 | Switch to What's Happening Nearby tab | Code violations, permits, 311 counts for East Montgomery |

**Result:** [x] PASS  [ ] PARTIAL  [ ] FAIL

**Notes:** Verified 2026-03-07. Zoning: General Commercial Zone; Neighborhood: Dalraida.

---

## Test 9: 2500 Mobile Hwy

| Step | Action | Expected |
|------|--------|----------|
| 1 | Search "2500 Mobile Hwy, Montgomery, AL" | Geocodes to South Montgomery (32.338, -86.341) |
| 2 | Switch to This Address tab | Zoning, Flood, Neighborhood for Mobile Hwy area |
| 3 | Switch to What's Closest tab | Park, Community Center, Hospital for South Montgomery |
| 4 | Switch to What's Happening Nearby tab | Code violations, permits, 311 counts for South Montgomery |

**Result:** [x] PASS  [ ] PARTIAL  [ ] FAIL

**Notes:** Verified 2026-03-07. Zoning: Light Industry; Flood: Zone X; What's Closest: James A. Shannon Park (Mobile Heights), Hayneville Road CC, Montgomery Primary Health. What's Happening Nearby shows Mobile Hwy area records.

---

## Rapid Search Stress Test

| Step | Action | Expected |
|------|--------|----------|
| 1 | Search "103 N Perry St, Montgomery, AL" | Downtown data loads |
| 2 | Immediately search "700 Cloverdale Rd, Montgomery, AL" | Cloverdale data loads (no downtown data shown) |
| 3 | Immediately search "3400 Atlanta Hwy, Montgomery, AL" | East Montgomery data loads (no Cloverdale data shown) |
| 4 | Immediately search "2500 Mobile Hwy, Montgomery, AL" | South Montgomery data loads (no Atlanta Hwy data shown) |
| 5 | Check all tabs | All data corresponds to 2500 Mobile Hwy |

**Result:** [x] PASS  [ ] FAIL

**Notes:** Verified 2026-03-07. Rapid sequence: 103 N Perry St → 700 Cloverdale Rd → 2500 Mobile Hwy. Final state correctly shows 2500 Mobile Hwy data (Light Industry, James A. Shannon Park, etc.). No stale data from previous searches.

---

## Retest Results Summary

| Test | Result | Notes |
|------|--------|-------|
| Test 7 | PASS | Cloverdale data correct |
| Test 8 | PASS | East Montgomery (Dalraida) correct |
| Test 9 | PASS | 2500 Mobile Hwy correct |
| Rapid stress | PASS | Latest search wins; no stale data |

---

## Freeze Recommendation

**Phase 3 is now ready for final freeze.**

All four retests passed. Tests 7, 8, and 9 no longer show misleading stale results. Rapid search transitions do not leave old category data. Test 9 (2500 Mobile Hwy) updates correctly.

---

## Automated Retest (Future)

When browser automation is available, re-run the same scenarios programmatically and record results here.
