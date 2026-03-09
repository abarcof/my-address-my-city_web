# Phase 3 QA Report
## What's Happening Nearby — My Address, My City

**Date:** 2026-03-07  
**Phase:** 3 — What's Happening Nearby

---

## 1. Implementation Complete

Phase 3 has been implemented according to the locked specification.

### Delivered Features

- New tab "What's Happening Nearby" between What's Closest and Next Steps
- Three category cards: Code Violations, Building Permits, 311 Requests
- Fixed 0.5-mile radius with UI disclosure
- Independent loading, empty, and error states per category
- Montgomery-only gating (no queries outside city limits)
- Resident-friendly labels and date formatting
- Max 3 visible items per category with total count
- Sort: recency first, then proximity

---

## 2. Regression Checklist

Before marking Phase 3 as shippable, verify:

- [ ] Address search works (Phase 1)
- [ ] Map click works (Phase 1)
- [ ] This Address tab displays zoning, flood, neighborhood (Phase 1)
- [ ] What's Closest tab displays parks, community centers, hospitals (Phase 2)
- [ ] Next Steps tab displays links (Phase 1)
- [ ] Out-of-bounds message when selecting outside Montgomery (Phase 2.1)
- [ ] What's Happening Nearby tab loads and shows three categories
- [ ] Each category shows loading, then data or empty/error
- [ ] No console errors during normal flow

---

## 3. Known Caveats

- **311 data recency:** Layer has `isDataArchived: true`. Sample data from 2021. UI includes disclaimer: "Available city records may include older entries. Dates are shown for context."
- **Count accuracy:** When `exceededTransferLimit` is true, count reflects returned features, not true total. MVP acceptable.
- **Per-category retry:** Each card has its own Retry button; retrying one category does not retry others.

---

## 4. Recommended Manual Validation

1. Search for a Montgomery address (e.g., "103 N Perry St, Montgomery, AL")
2. Click the "What's Happening Nearby" tab
3. Verify all three categories load (or show empty if no data in 0.5 mi)
4. Select a point outside Montgomery; verify out-of-bounds message
5. Verify Phase 1 and Phase 2 tabs still work
