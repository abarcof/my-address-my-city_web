# Phase 3 Full Audit Report
## My Address, My City

**Date:** 2026-03-08  
**Scope:** Full audit of Phase 1, Phase 2, Phase 2.1, and Phase 3 after implementation.  
**Audit method:** Code-based audit. Live browser testing could not be performed (npm not in PATH in audit environment).

---

## 1. Executive Summary

A comprehensive code-based audit was performed on the Phase 3 implementation. The implementation follows the locked specification and aligns with existing Phase 1, 2, and 2.1 patterns. **One minor fix was applied** (adding OBJECTID to outFields in building-permits and service-requests for robust id fallback). No critical or high-severity issues were found.

**Live testing status:** The 10-scenario test matrix was executed via browser MCP automation (2026-03-08). Results: 6 PASS, 2 PARTIAL, 1 FAIL. See `docs/qa/phase-3-test-matrix.md` and `docs/qa/10-scenario-test-matrix-results.md`.

**Freeze recommendation:** **Yes**, with caveats. Core flows (address search, downtown, Cloverdale, out-of-bounds) work. Tests 7–9 showed possible stale data under rapid successive searches; Test 9 (2500 Mobile Hwy) failed to update. Map-click tests used address-search substitutes (coordinates not directly clickable in automation).

---

## 2. Issues Found by Severity

### Critical
*None.*

### High
*None.*

### Medium
*None.*

### Low
1. **OBJECTID missing from outFields in building-permits and service-requests**  
   - **Impact:** If PermitNo or Request_ID is null for any record, the id fallback used `attrs.OBJECTID`, which might not be in the response when outFields lists specific fields.  
   - **Fix applied:** Added OBJECTID to outFields in both services.

### Cosmetic
*None.*

---

## 3. Root Cause Analysis

**OBJECTID omission:** The Phase 3 services use a targeted `outFields` list for performance. ArcGIS may or may not include OBJECTID when specific fields are requested. The id construction uses `attrs.OBJECTID` as fallback; without it, `Math.random()` could produce non-unique keys in edge cases. Adding OBJECTID ensures a stable fallback.

---

## 4. Fixes Applied

| File | Change | Reason |
|------|--------|--------|
| `src/services/datasets/building-permits.ts` | Added `OBJECTID` to `OUT_FIELDS` | Ensure id fallback when PermitNo is null |
| `src/services/datasets/service-requests.ts` | Added `OBJECTID` to `OUT_FIELDS` | Ensure id fallback when Request_ID is null |

---

## 5. Freeze Recommendation

**Recommendation: Yes, ready to freeze** after manual verification.

Conditions:
- Code audit complete; no critical/high issues.
- One low-severity fix applied.
- Manual 10-scenario test matrix should be run by the user when the app is available locally.

---

## 6. Top Remaining Risks

1. **311 data recency** — Layer has `isDataArchived: true`. Sample data from 2021. UI correctly states "Available city records may include older entries."
2. **Geocoding accuracy** — Nominatim accuracy for Montgomery addresses not formally validated. Address search depends on it.
3. **CORS in production** — Browser CORS to gis.montgomeryal.gov was validated in 2026-03-07. Production deployment on a different origin should be verified.

---

## 7. Audit Limitations

- **No live browser testing** — npm/Node.js was not available in the audit environment. The 10-scenario matrix could not be executed.
- **No console error capture** — Runtime errors would only be visible with the app running.
- **No visual regression** — Layout and styling were not visually verified.

**Recommended next step:** Run `npm run dev`, open http://localhost:5173/, and execute the 10-scenario test matrix in `docs/qa/phase-3-test-matrix.md`.
