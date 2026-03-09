# Phase 3 Implementation Plan
## What's Happening Nearby — My Address, My City

**Date:** 2026-03-07  
**Status:** Implemented

---

## 1. Overview

Phase 3 adds the "What's Happening Nearby" module to answer the question: *What city activity is happening near this location?*

Three validated data sources:
- Code Violations — `HostedDatasets/Code_Violations/FeatureServer/0`
- Building Permits — `HostedDatasets/Construction_Permits/FeatureServer/0`
- 311 Service Requests — `HostedDatasets/Received_311_Service_Request/MapServer/0`

---

## 2. Implementation Summary

### Files Created

| File | Purpose |
|------|---------|
| `src/types/happening.ts` | HappeningItem, HappeningCategoryResult, HappeningSnapshot types |
| `src/utils/format-date.ts` | formatDateForDisplay — handles YYYY-MM-DD and epoch ms |
| `src/utils/normalize-status.ts` | normalizeStatus — resident-friendly status labels |
| `src/services/datasets/code-violations.ts` | fetchNearbyCodeViolations |
| `src/services/datasets/building-permits.ts` | fetchNearbyBuildingPermits |
| `src/services/datasets/service-requests.ts` | fetchNearbyServiceRequests |
| `src/features/happening/use-happening.ts` | Three independent useQuery hooks |
| `src/features/happening/WhatsHappeningNearby.tsx` | Tab content component |
| `src/components/cards/HappeningCategoryCard.tsx` | Category card with count, items, states |

### Files Modified

| File | Change |
|------|--------|
| `src/store/address-store.ts` | Extended Tab type with `'whats-happening-nearby'` |
| `src/components/tabs/TabContainer.tsx` | Added What's Happening Nearby tab |
| `src/app/App.tsx` | Added WhatsHappeningNearby to PanelContent |

---

## 3. Key Design Decisions

- **Radius:** Fixed 0.5 miles, disclosed in UI
- **Sort order:** Recency first, then proximity, then id
- **Visible items:** Max 3 per category; full count shown
- **Independent queries:** Three useQuery hooks so one category failure does not break the tab
- **Montgomery-only:** Queries gated by `isWithinMontgomery`
- **No per-item distance:** Distance used for sort only; not displayed in UI

---

## 4. MVP Gate Checklist

- [x] New tab "What's Happening Nearby" exists and is reachable
- [x] All 3 categories (Code Violations, Building Permits, 311 Requests) are active
- [x] Radius 0.5 miles is fixed and disclosed in UI
- [x] Each category has independent loading, empty, and error states
- [x] Montgomery-only validation is respected
- [x] Labels are resident-friendly; no raw GIS field names
- [x] Dates are visible and understandable
- [x] Max 3 visible items per category; count shown
- [x] Sort order: recency first, then proximity
