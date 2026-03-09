# Phase 3 MVP Recommendation
## My Address, My City — What's Happening Nearby

**Date:** 2026-03-07  
**Purpose:** Go/no-go and scope recommendation before planning implementation.

---

## 1. Recommended MVP Scope

| Category | Recommendation | Rationale |
|----------|----------------|-----------|
| Code Violations | **Core** | Validated. FeatureServer, radius query works. High resident value. |
| Building Permits | **Core** | Validated. FeatureServer, radius query works. High resident value. |
| 311 Service Requests | **Core** | Validated. MapServer, radius query works. Correct service found (Received_311_Service_Request, not QAlert_311). |

**All three sources are validated and recommended as core.** No optional or deferred sources for Phase 3.

---

## 2. What Should Be Core

- **Code Violations** — Nearby code enforcement cases (OffenceNum, CaseType, CaseStatus, Address1, CaseDate)
- **Building Permits** — Nearby construction permits (PermitNo, PermitDescription, PhysicalAddress, IssuedDate, PermitStatus)
- **311 Service Requests** — Nearby city service requests (Request_ID, Department, Request_Type, Address, Status, Create_Date)

**Radius:** 0.5 miles (document in UI; same pattern as Phase 2)

**Tab:** "What's Happening Nearby" — new tab between What's Closest and Next Steps (or per existing layout)

---

## 3. What Should Be Optional

**None.** All three validated sources are low-risk and fit the existing architecture. No need to scope down.

---

## 4. What Should Be Deferred

| Item | Reason |
|------|--------|
| QAlert_311 | Wrong content — sanitation schedules only, not 311 requests |
| Open Data Portal flat downloads | Not needed — all data is on gis.montgomeryal.gov as FeatureServer/MapServer |
| Additional "happening" sources | Out of scope for Phase 3; Phase 4 if desired |

---

## 5. Main Technical Risks

| Risk | Mitigation |
|------|------------|
| 311 data may be historical (archived) | Layer has `isDataArchived: true`. Sample data from 2021. If only old data in production, label as "Recent city service activity (historical)" or similar. Verify during implementation. |
| exceededTransferLimit | All three services returned `exceededTransferLimit: true` for 0.5 mi radius. Use `resultRecordCount` (e.g., 10–20 per category) to cap results. Document that we show "up to N" nearby items. |
| Browser CORS | All endpoints on gis.montgomeryal.gov. CORS confirmed for this server (2026-03-07). Low risk. |
| MapServer vs FeatureServer | Received_311 uses MapServer. Same query parameters work. No code change needed in arcgis-client. |

---

## 6. Go/No-Go Recommendation

**GO.**

- All three Phase 3 sources are validated
- Endpoints, field structure, and spatial queries confirmed
- Same server and pattern as Phase 1–2
- No blockers identified
- Ready to move into planning mode

---

## 7. Pre-Planning Checklist

- [x] Code Violations endpoint validated
- [x] Building Permits endpoint validated
- [x] 311 Service Requests endpoint validated (correct service identified)
- [x] QAlert_311 rejected (wrong content)
- [x] Spatial radius query confirmed for all three
- [x] Field structure documented for resident-friendly cards
- [x] Browser access expected (gis.montgomeryal.gov CORS confirmed)
- [x] docs/phase-3-source-validation.md created
- [x] docs/validation-log.md updated
- [x] docs/data-sources.md Phase 3 sections updated

**Ready for implementation planning.**
