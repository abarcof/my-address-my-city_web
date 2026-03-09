# Final Runtime Smoke Test

**Date:** 2026-03-08  
**Method:** MCP browser + prior session MCP results  
**App URL:** http://localhost:5173/

---

## Flows Validated

| # | Flow | Result | Notes |
|---|------|--------|-------|
| 1 | Address search | PASS | Nominatim geocode; tested in prior session |
| 2 | Map click | PASS | reverseGeocode; tested in prior session |
| 3 | This Address tab | PASS | Zoning, Flood, Neighborhood, Council District (fallback) |
| 4 | What's Closest tab | PASS | Park, community center, hospital with approximate distance |
| 5 | What's Happening Nearby tab | PASS | Code violations, permits, 311; 12-month filter |
| 6 | Next Steps tab | PASS | Report Issue, Verify Zoning, City Resources |
| 7 | Outside Montgomery | PASS | Friendly out-of-bounds message |
| 8 | Copy Link | PASS | Button appears when location selected; copies URL |
| 9 | Deep link restore | PASS | Opening URL with lat/lng/tab restores state |
| 10 | Mobile viewport | N/A | No Map/Details toggle (reverted). Layout: map top, panel below. |
| 11 | Council District | PASS | Graceful "not available" when no data |
| 12 | About This Data | PASS | Drawer opens, sections present, closes |
| 13 | Demo presets | PASS | City Hall, Residential, Outside Montgomery |
| 14 | Civic Snapshot Summary | PASS | Composed summary at top when location selected |

---

## Summary

**13 of 14 flows passed.** Flow 10 (mobile toggle) is not applicable — feature was reverted for layout stability.
