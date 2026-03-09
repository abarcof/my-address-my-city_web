# Phase 1 Release Candidate QA Report

**Date**: 2026-03-07
**Tester**: Automated QA (browser automation + code review)
**Build**: Phase 1 RC (localhost:5173, Vite dev server)
**Status**: Post-fix final

---

## Test Matrix

### Search-Based Flows

| # | Input | Expected | Zoning | Flood | Neighborhood | Result |
|---|-------|----------|--------|-------|-------------|--------|
| T1 | 103 N Perry St, Montgomery, AL | Downtown civic | T5 / Urban Center Zone | Zone X (Minimal Risk) | Downtown Neighborhood Association | PASS |
| T2 | 2560 Bell Rd, Montgomery, AL | Residential/commercial area | O-1 / Office District | Zone X (Minimal Risk) | Empty (correct) | PASS |
| T3 | 3000 Eastern Blvd, Montgomery, AL | Commercial corridor | B-3 / Highway Commercial | Zone X (Minimal Risk) | Empty (correct) | PASS |
| T4 | Alabama State Capitol, Montgomery, AL | Institutional landmark | T5 / Urban Center Zone | Zone X (Minimal Risk) | Downtown Neighborhood Association | PASS |
| T5 | 99999 Fake Street Nowhere | Invalid address | Error shown, data cleared | N/A | N/A | PASS |
| T8 | 1600 Pennsylvania Ave, Washington DC | Out-of-bounds | All empty + OOB notice | N/A | N/A | PASS |

### Map Click Flows

| # | Click Location | Zoning | Flood | Neighborhood | Result |
|---|---------------|--------|-------|-------------|--------|
| T6 | Downtown (~32.376, -86.300) | T5 / Urban Center Zone | Zone X (Minimal Risk) | Downtown Neighborhood Association | PASS |
| T7 | Monroe St area (~32.379, -86.302) | T5 / Urban Center Zone | Zone X (Minimal Risk) | Downtown Neighborhood Association | PASS |
| T9 | West Montgomery (~32.361, -86.328) | R-60-d / Duplex Residential | Zone X (Minimal Risk) | Washington Park-Westcottville | PASS |

### Tab Navigation

| Test | Result |
|------|--------|
| This Address tab displays cards | PASS |
| Next Steps tab shows 3 links + disclaimer | PASS |
| Tab switching works | PASS |

---

## Timing Observations

- **Geocoding (Nominatim)**: ~1-2 seconds
- **ArcGIS queries (all 3 parallel)**: ~1-3 seconds total
- **Reverse geocoding (map click)**: ~1 second
- **Total search-to-display**: ~2-4 seconds
- **Total click-to-display**: ~2-3 seconds
- **returnGeometry=false confirmed**: All ArcGIS requests verified in network tab

---

## Bugs Found (Baseline)

### BUG-1: Search input not cleared on map click [HIGH]

**Severity**: High
**Steps to reproduce**:
1. Type an address and search (e.g., "99999 Fake Street Nowhere")
2. Click on the map
3. Observe the search input still shows the previously typed text

**Expected**: Search input should clear (or update to the reverse-geocoded address) when user clicks the map.
**Actual**: Input retains the old text. Error message also persists.
**Impact**: Confusing UX. User sees stale text in the search bar while new data loads for a different location. During demo, this looks broken.
**Root cause**: The `SearchBar` component manages its `query` state internally. Map click events update the Zustand store but do not clear the local `query` state or the `error` state in `SearchBar`.

### BUG-2: Search error message not cleared on map click [HIGH]

**Severity**: High
**Steps to reproduce**:
1. Search for an invalid address (shows error "Address not found...")
2. Click on the map
3. Error message still visible even though data loaded successfully

**Expected**: Error message should disappear when a valid location is selected via map.
**Actual**: Error persists until a new search is submitted.
**Impact**: Misleading. User sees error message while valid data is displayed below.
**Root cause**: Same as BUG-1. The `error` state in `SearchBar` is local and not influenced by external location changes.

### BUG-3: Mobile layout - map hidden, search button cut off [MEDIUM]

**Severity**: Medium
**Steps to reproduce**:
1. Resize browser to 375x667 (mobile)
2. Map is completely invisible
3. Search button may be cut off

**Expected**: Mobile-friendly layout with map visible (stacked above or below panel).
**Actual**: `flex` layout causes side panel to take all visible space; map has zero width.
**Impact**: App is unusable on mobile. Demo judges may test on mobile.
**Root cause**: `AppShell` uses `flex-1` for the map and a fixed `w-96` for the side panel with no responsive breakpoint handling.

### BUG-4: Search error message truncated in header [LOW]

**Severity**: Low
**Steps to reproduce**:
1. Search for an invalid address
2. Error message is cut off at the right edge of the header

**Expected**: Error message fully visible or wrapped.
**Actual**: Text overflows with `whitespace-nowrap` and gets clipped.
**Impact**: User cannot read the full error guidance.
**Root cause**: Error `<span>` has `whitespace-nowrap` class and the header bar has limited space.

### BUG-5: Search button disabled when input is empty (stale query text scenario) [COSMETIC]

**Severity**: Cosmetic
**Steps to reproduce**:
1. After a map click, the search input is empty but contains no whitespace
2. Search button correctly shows disabled state
3. This is correct behavior but noted for completeness

**Expected**: Disabled when empty.
**Actual**: Correctly disabled. No fix needed.

---

## Engineering Risk Assessment

| Risk | Status | Notes |
|------|--------|-------|
| Race conditions (rapid clicks) | PASS | TanStack Query handles stale queries correctly; only latest results displayed |
| Search failure handling | PARTIAL | Data clears correctly, but search input/error persist (BUG-1, BUG-2) |
| Reverse geocoding | PASS | Works correctly; fallback to coordinates shown while reverse geocode loads |
| Flood query performance | PASS | returnGeometry=false confirmed in all network requests; responses ~1-2s |
| Browser console quality | PASS | No app errors. Only Vite HMR logs and React DevTools suggestion |
| Mobile responsiveness | FAIL | Map hidden at mobile width (BUG-3) |
| Keyboard accessibility | PASS | Search input focusable; tab buttons reachable via keyboard; acceptable for Phase 1 |

---

## Summary of Issues by Severity

| Severity | Count | Items |
|----------|-------|-------|
| Critical | 0 | - |
| High | 2 | BUG-1 (search input stale), BUG-2 (error message stale) |
| Medium | 1 | BUG-3 (mobile layout) |
| Low | 1 | BUG-4 (error message truncated) |
| Cosmetic | 0 | - |

---

## Fixes Applied

### FIX-1: Search input + error clear on map click (BUG-1 + BUG-2) [FIXED]

**File**: `src/components/search/SearchBar.tsx`

**What changed**: Added a `useEffect` that watches the Zustand store's `coordinates` and `label` values. When they change externally (from a map click), the local `query` and `error` state are cleared. A `useRef(isOwnSearch)` flag prevents the effect from clearing the input on the component's own successful searches.

**Verified**: Typed "99999 Fake Street Nowhere" -> error displayed -> clicked map -> input cleared, error gone, new data displayed correctly. Also verified that successful address search still retains the typed text.

### FIX-2: Mobile responsive layout (BUG-3) [FIXED]

**File**: `src/components/layout/AppShell.tsx`

**What changed**: Added responsive Tailwind breakpoints:
- `main`: `flex flex-col md:flex-row` (stacked on mobile, side-by-side on desktop)
- Map div: `w-full h-48 sm:h-64 md:w-auto md:h-auto md:flex-1` (fixed height + full width on mobile, flexible on desktop)
- Aside: `flex-1 md:flex-none md:w-96` (takes remaining space on mobile, fixed width on desktop)
- Header: smaller padding and font on mobile

**Verified**: Map container now has proper dimensions on mobile (w=390px verified via bounding box, was w=0 before fix).

### FIX-3: Error message wrapping (BUG-4) [FIXED]

**File**: `src/components/search/SearchBar.tsx`

**What changed**: Error message changed from `<span>` with `whitespace-nowrap` to `<p>` with responsive width (`w-full sm:w-auto`) and top margin, allowing the error text to wrap properly on narrow screens.

**Verified**: Error message "Address not found. Try a different address or click the map." is now fully visible on desktop.

---

## Post-Fix Verification

| Test | Before | After |
|------|--------|-------|
| Search then map click: input clears | FAIL | PASS |
| Search error then map click: error clears | FAIL | PASS |
| Mobile map visibility (w=0 bug) | FAIL | PASS |
| Error message truncation | FAIL | PASS |
| Normal address search | PASS | PASS (no regression) |
| TypeScript compilation | PASS | PASS |
| Production build | PASS | PASS |
| Data accuracy (all addresses) | PASS | PASS |
| Console errors | PASS (clean) | PASS (clean) |

---

## Remaining Open Issues

### OPEN-1: Mobile map interaction is limited [LOW / Deferred]

**Status**: Documented, not fixed.
**Details**: On small screens, the map has a fixed 192px (h-48) height, which limits the interactive area. For a hackathon demo, the primary presentation will be on desktop. A fully adaptive mobile layout with a toggle between map and panel views would be a Phase 2 enhancement.
**Recommendation**: Defer to Phase 2. Desktop demo is the priority.

### OPEN-2: Leaflet resize invalidation [COSMETIC / Deferred]

**Status**: Documented, not fixed.
**Details**: Resizing the browser window dynamically (e.g., toggling DevTools) can sometimes cause Leaflet map tiles to not fully render. This is a known Leaflet issue requiring `map.invalidateSize()`. It does not affect normal usage, only developer/testing workflows.
**Recommendation**: Defer. Not user-facing.

---

## Build Verification

- TypeScript `tsc --noEmit`: **PASS** (0 errors)
- Vite production build: **PASS** (dist/index.html, CSS 26.69 KB, JS 350.56 KB)
- No app-relevant console errors

---

## Phase 1 Release Decision

**Phase 1 is ready to freeze.**

All Phase 1 functionality is working correctly:
- Address search with geocoding: PASS
- Map click with reverse geocoding: PASS
- Zoning data card: PASS
- Flood context card: PASS
- Neighborhood card: PASS
- Next Steps tab: PASS
- Error states: PASS
- Empty states: PASS
- Out-of-bounds detection: PASS
- Loading states with slow indicator: PASS
- Search input clears on map click: PASS (fixed)
- Mobile basic layout: PASS (fixed)

**Recommendation**: Move to Phase 2.

**Top 3 Phase 2 priorities based on Phase 1 findings**:

1. **"What's Closest" module** - Natural next feature per PRD. Phase 1 validated the data pipeline pattern; Phase 2 can reuse the same ArcGIS client infrastructure for civic resource proximity queries.

2. **Enhanced mobile UX** - Phase 1 has basic mobile support but the map is constrained. Phase 2 should add a map/panel toggle for mobile, improving the demo experience on smaller screens.

3. **Council district integration** - The service exists (SDE_City_Council/MapServer) but point-query behavior was never validated. If it works, it strengthens the "This Address" tab with a fourth data card at minimal development cost.
