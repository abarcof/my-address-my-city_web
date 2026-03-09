# Phase 2 Fix Log
## Issues Fixed During Audit

**Date:** March 7, 2025

---

## Summary

| Metric | Count |
|--------|-------|
| Issues fixed during this audit | 0 |
| Issues verified as already fixed (pre-audit) | 3 |

---

## Fixes Applied During This Audit

*None.* All 15 functional tests passed. No Critical, High, or Medium issues were found that required fixes during the audit.

---

## Pre-Audit Fixes (Verified During Audit)

The following were implemented in prior work and verified during this audit:

### FIX-P1: Park names — URL sanitization

- **Issue:** ArcGIS parks layer returned URLs (e.g., `http://www.funinmontgomery.com/parks-items/lister-hill-plaza`) which could display as place names.
- **Files changed:** `src/services/datasets/parks.ts`, `src/components/cards/ClosestCategoryCard.tsx`
- **Fix:** `isValidName()` rejects URLs; `isUrlLikeKey()` skips URL-like attribute keys; `sanitizeDisplayName()` in UI extracts slug from URL as fallback (e.g., "Lister Hill Plaza").
- **Risk level:** Low
- **Verification:** All park names display as plain text in audit tests.

### FIX-P2: Hospital names — title case

- **Issue:** Health Care Facility layer returns names in ALL CAPS (e.g., "CAPITAL HILL HEALTH CARE & REHAB").
- **Files changed:** `src/services/datasets/hospitals.ts`
- **Fix:** `toTitleCase()` normalizes names to title case before display.
- **Risk level:** Low
- **Verification:** Hospital names display in title case in audit tests.

### FIX-P3: Community center card — hide when unavailable

- **Issue:** Community centers have no validated data source; showing "not available" added clutter.
- **Files changed:** `src/features/closest/WhatsClosest.tsx`
- **Fix:** Filter `visibleCategories = categories.filter(r => r.isAvailable)` so only Parks and Hospitals render.
- **Risk level:** Low
- **Verification:** Only two category cards (Park, Hospital) shown; Community Center hidden.

---

## No New Fixes Required

The audit did not identify any additional issues requiring code changes. Phase 2 is release-ready.
