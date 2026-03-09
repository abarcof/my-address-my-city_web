# What's Closest — 10-Location Analysis Report

**Date:** March 7, 2025  
**Scope:** Analysis only (no code changes)  
**App:** My Address, My City @ http://localhost:5173/

---

## Part 1 — Address Search Results (5 addresses)

| # | Address Used | Nearest Park | Nearest Hospital | Park Distance | Hospital Distance | Issues |
|---|--------------|--------------|------------------|---------------|-------------------|--------|
| 1 | 103 N Perry St, Montgomery, AL | Lister Hill Plaza | CAPITAL HILL HEALTH CARE & REHAB | 0.03 mi | 0.6 mi | None observed |
| 2 | 200 Coosa St, Montgomery, AL | Court Square | BAPTIST MEDICAL CENTER SOUTH | 0.02 mi | 0.6 mi | Geocoder normalized to "200 Coosa Court" (user typed "Coosa St") |
| 3 | 1150 Forest Ave, Montgomery, AL | Lister Hill Plaza | CAPITAL HILL HEALTH CARE & REHAB | 0.03 mi | 0.6 mi | Same results as #1; 1150 Forest Ave may geocode to similar downtown point — verify expected neighborhood |
| 4 | 1010 E South Blvd, Montgomery, AL | Lister Hill Plaza | BAPTIST MEDICAL CENTER SOUTH | 0.03 mi | 0.6 mi | None observed |
| 5 | 300 Dexter Ave, Montgomery, AL | Court Square | BAPTIST MEDICAL CENTER SOUTH | 0.02 mi | 0.6 mi | None observed |

---

## Part 2 — Map Click Results (5 locations)

| # | Approximate Area Clicked | Search Box Value After Click | Nearest Park | Nearest Hospital | Park Distance | Hospital Distance | Issues |
|---|--------------------------|-----------------------------|--------------|------------------|---------------|-------------------|--------|
| 1 | Downtown center (map center) | Cleared, then coords | Court Square | BAPTIST MEDICAL CENTER SOUTH | 0.02 mi | 0.6 mi | Search box cleared on map click; reverse geocode may lag |
| 2 | North (upper map area) | 32.37891, -86.29998 | Court Square | BAPTIST MEDICAL CENTER SOUTH | 0.6 mi | 1.2 mi | Raw coordinates shown until reverse geocode completes |
| 3 | South (lower map area) | 32.35469, -86.29998 | Lister Hill Plaza | BAPTIST MEDICAL CENTER SOUTH | 0.5 mi | 0.2 mi | None observed |
| 4 | East (right side of map) | 32.36680, -86.27998 | Oak Park | BAPTIST MEDICAL CENTER SOUTH | 0.3 mi | 1.0 mi | None observed |
| 5 | West (left side of map) | 32.36680, -86.31998 | Court Square | BAPTIST MEDICAL CENTER SOUTH | 0.2 mi | 0.6 mi | None observed |

---

## Summary of Findings

### What Works

- **Address search:** All 5 addresses geocoded and returned What's Closest results.
- **Map click:** All 5 map clicks triggered geocode and What's Closest results.
- **Parks variety:** Different parks surfaced by location (Lister Hill Plaza, Court Square, Oak Park).
- **Hospitals variety:** Two hospitals surfaced (CAPITAL HILL HEALTH CARE & REHAB, BAPTIST MEDICAL CENTER SOUTH) depending on location.
- **Distance display:** "Approximate distance: X mi" shown consistently.
- **Distance logic:** Distances change sensibly with location (e.g., north click → 0.6 mi to Court Square; south click → 0.2 mi to BAPTIST MEDICAL CENTER SOUTH).

### What Doesn't / Concerns

- **Address normalization:** "200 Coosa St" → "200 Coosa Court" — user input differs from geocoder result; may confuse residents.
- **Duplicate results:** 103 N Perry St and 1150 Forest Ave returned identical park/hospital and distances; 1150 Forest Ave may geocode to a similar downtown point.
- **Map click UX:** Search box shows raw coordinates (e.g., "32.37891, -86.29998") until reverse geocode completes; brief exposure of coordinates may feel technical.
- **Community centers:** Not shown in any test; likely filtered as unavailable per Phase 2 scope.

---

## Nearest Park: Link/URL vs Clean Name

**Answer: Clean name only.**

- Park and hospital names are rendered as plain text in `<p>` elements.
- No links or URLs are shown for the nearest park or hospital.
- Source: `ClosestCategoryCard.tsx` — `{name}` in a `<p>` tag; no `<a>` elements.

---

## Improvement Aspects Identified (Do Not Implement Yet)

1. **Address normalization feedback:** Show user when geocoder returns a different address (e.g., "Coosa St" → "Coosa Court") so residents understand the result.
2. **Reverse geocode for map clicks:** Replace raw coordinates with a human-readable label (e.g., street name or neighborhood) once reverse geocode completes.
3. **Geocode validation for 1150 Forest Ave:** Confirm whether this address should resolve to a different area; if so, investigate geocoder behavior.
4. **Hospital name casing:** "CAPITAL HILL HEALTH CARE & REHAB" and "BAPTIST MEDICAL CENTER SOUTH" use all caps; consider title-case normalization for resident-friendly display.
5. **Category labels:** Clarify whether "Nearest Park" and "Nearest Hospital" are sufficient or if "Nearest Community Center" (when available) needs different treatment.
6. **Distance unit consistency:** All distances in miles; document whether other units (e.g., feet for very short distances) are desired.
7. **Loading state for map clicks:** Ensure What's Closest shows loading state while reverse geocode and closest queries run after a map click.
8. **Out-of-bounds / no-results handling:** Not tested; document behavior when clicking outside Montgomery or in areas with no parks/hospitals in dataset.
