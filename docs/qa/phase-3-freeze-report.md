# Phase 3 Freeze Report
## My Address, My City — What's Happening Nearby

**Date:** 2026-03-07  
**Status:** **FROZEN**

---

## Freeze Summary

Phase 3 (What's Happening Nearby) is now **frozen** and ready for Phase 4 or final submission.

All modules are stable:
- **Phase 1:** This Address, Next Steps — frozen
- **Phase 2:** What's Closest — frozen
- **Phase 2.1:** Montgomery-only validation — frozen
- **Phase 3:** What's Happening Nearby — **frozen**

---

## Phase 3 Scope (Frozen)

| Feature | Status |
|---------|--------|
| Code Violations (0.5 mi, last 12 months) | Frozen |
| Building Permits (0.5 mi, last 12 months) | Frozen |
| 311 Requests (0.5 mi, last 12 months) | Frozen |
| Tab subtitle: "Recent public records within approximately 0.5 miles" | Frozen |
| Badge: "Showing X recent" | Frozen |
| Empty states: "No recent X found within the last 12 months" | Frozen |
| Footer: "Showing records from the last 12 months" | Frozen |
| 12-month filter (primary: cutoff; safeguard: year check) | Frozen |

---

## Final Fixes Before Freeze

1. **12-month recency filter** — Primary rule: exact cutoff. Safeguard: year >= currentYear - 1.
2. **ArcGIS date parsing** — `parseArcGISDateToTimestamp` handles number, numeric string, /Date(ms)/, ISO.
3. **Old records fix** — No 2021 records shown; only last 12 months.

---

## MCP Retest (Pre-Freeze)

| Test | Address | Result |
|------|---------|--------|
| Tab subtitle | 103 N Perry St | PASS |
| Badge "Showing X recent" | 103 N Perry St | PASS |
| No old records | 103 N Perry St | PASS — only 2025 dates |
| Empty states | 2500 Mobile Hwy | PASS — all 3 categories |
| Footer | All | PASS |
| Mixed data | 700 Cloverdale Rd | PASS — 2025 permits only |

**All tests PASS.**

---

## Do Not Change (Post-Freeze)

- Phase 3 service layer (code-violations, building-permits, service-requests)
- 12-month filter logic (cutoff primary, year safeguard)
- UI copy (subtitle, badge, empty states, footer)
- Query keys, TanStack Query config
- Phase 1, 2, 2.1 code

---

## Next Steps

- Phase 4: Finalist package, demo polish, commercialization
- Optional: Bright Data enrichment (only if safe)

---

**Phase 3 is now ready for final freeze.**
