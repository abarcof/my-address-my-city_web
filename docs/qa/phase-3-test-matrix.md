# Phase 3 Test Matrix
## 10-Scenario Verification — My Address, My City

**Date:** 2026-03-08  
**Purpose:** Document actual app behavior for 10 test scenarios.  
**Status:** **COMPLETED** — Executed via browser MCP automation. See full results in [10-scenario-test-matrix-results.md](10-scenario-test-matrix-results.md).

---

## Executive Summary (from live run)

| Metric | Count |
|--------|-------|
| **PASS** | 6 |
| **PARTIAL** | 2 |
| **FAIL** | 1 |

**Note:** Map-click tests (6–10) used address-search substitutes because direct map click by lat/lng was not available in the automation. Tests 7–9 showed possible stale data under rapid successive searches.

---

## How to Use This Matrix

1. Start the app: `npm run dev` (default: http://localhost:5173/)
2. For each scenario, perform the action and record what the app shows
3. Fill in the "Actual result" column
4. Set Overall: PASS / PARTIAL / FAIL

---

## Address Search Tests

### Test 1: 103 N Perry St, Montgomery, AL

| Check | Expected | Actual result |
|-------|----------|---------------|
| Input type | Search | |
| Geocoding worked | Yes | |
| Inside Montgomery | Yes | |
| This Address — zoning | Resident-friendly label | |
| This Address — flood | Resident-friendly label | |
| This Address — neighborhood | Name or empty state | |
| What's Closest — park | Name, distance | |
| What's Closest — hospital | Name, distance | |
| What's Closest — community center | Name, distance | |
| What's Happening — code violations | Count, up to 3 items | |
| What's Happening — building permits | Count, up to 3 items | |
| What's Happening — 311 requests | Count, up to 3 items | |
| Loading/empty/error | None stuck | |
| **Overall** | | PASS / PARTIAL / FAIL |

---

### Test 2: 200 Dexter Ave, Montgomery, AL

| Check | Expected | Actual result |
|-------|----------|---------------|
| Input type | Search | |
| Geocoding worked | Yes | |
| Inside Montgomery | Yes | |
| This Address | All cards | |
| What's Closest | All three categories | |
| What's Happening | All three categories | |
| **Overall** | | PASS / PARTIAL / FAIL |

---

### Test 3: 300 Commerce St, Montgomery, AL

| Check | Expected | Actual result |
|-------|----------|---------------|
| Input type | Search | |
| Geocoding worked | Yes | |
| Inside Montgomery | Yes | |
| All tabs functional | Yes | |
| **Overall** | | PASS / PARTIAL / FAIL |

---

### Test 4: 1150 Forest Ave, Montgomery, AL

| Check | Expected | Actual result |
|-------|----------|---------------|
| Input type | Search | |
| Geocoding worked | Yes | |
| Inside Montgomery | Yes | |
| All tabs functional | Yes | |
| **Overall** | | PASS / PARTIAL / FAIL |

---

### Test 5: 500 22nd St S, Birmingham, AL (out-of-bounds)

| Check | Expected | Actual result |
|-------|----------|---------------|
| Input type | Search | |
| Geocoding worked | Yes | |
| Inside Montgomery | **No** | |
| Out-of-bounds message | Shown | |
| No city queries run | Verified (no data from Montgomery) | |
| **Overall** | | PASS / PARTIAL / FAIL |

---

## Map Click Tests

### Test 6: Downtown Montgomery — 32.3790, -86.3077

| Check | Expected | Actual result |
|-------|----------|---------------|
| Input type | Map click | |
| Selection worked | Yes | |
| Inside Montgomery | Yes | |
| This Address | Data shown | |
| What's Closest | Data shown | |
| What's Happening | Data shown | |
| **Overall** | | PASS / PARTIAL / FAIL |

---

### Test 7: Cloverdale — 32.3669, -86.3006

| Check | Expected | Actual result |
|-------|----------|---------------|
| Input type | Map click | |
| Selection worked | Yes | |
| Inside Montgomery | Yes | |
| All tabs functional | Yes | |
| **Overall** | | PASS / PARTIAL / FAIL |

---

### Test 8: East Montgomery — 32.3500, -86.2700

| Check | Expected | Actual result |
|-------|----------|---------------|
| Input type | Map click | |
| Selection worked | Yes | |
| Inside Montgomery | Yes | |
| All tabs functional | Yes | |
| **Overall** | | PASS / PARTIAL / FAIL |

---

### Test 9: South Montgomery — 32.3400, -86.3200

| Check | Expected | Actual result |
|-------|----------|---------------|
| Input type | Map click | |
| Selection worked | Yes | |
| Inside Montgomery | Yes | |
| All tabs functional | Yes | |
| **Overall** | | PASS / PARTIAL / FAIL |

---

### Test 10: Outside Montgomery — 32.5000, -86.5000 (out-of-bounds)

| Check | Expected | Actual result |
|-------|----------|---------------|
| Input type | Map click | |
| Selection worked | Yes | |
| Inside Montgomery | **No** | |
| Out-of-bounds message | Shown | |
| No city queries run | Verified | |
| **Overall** | | PASS / PARTIAL / FAIL |

---

## Summary

| Metric | Count |
|--------|-------|
| Total tests | 10 |
| PASS | 6 |
| PARTIAL | 2 |
| FAIL | 1 |

**10-Test Matrix Completed:** **Yes** (2026-03-08, browser MCP automation)

Full results table and sample items: [10-scenario-test-matrix-results.md](10-scenario-test-matrix-results.md)
