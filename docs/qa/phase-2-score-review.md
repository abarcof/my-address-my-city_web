# Phase 2 Score Review
## Hackathon Rubric Estimate

**Date:** March 7, 2025  
**Rubric total:** 40 points

---

## Before-Audit Baseline

| Criterion | Points | Max | Notes |
|-----------|--------|-----|-------|
| Challenge fit | 13.5 | 15 | Civic access via address + map; What's Closest adds proximity |
| Quality and design | 8 | 10 | Clean code, docs, UX; some mobile constraints |
| Originality and impact | 7.5 | 10 | Address-first civic snapshot; differentiation from GIS dashboards |
| Commercialisation potential | 3 | 5 | White-label civic product narrative; Montgomery pilot |
| **Total** | **32** | **40** | |

---

## After-Audit Estimate

| Criterion | Points | Max | Change | Notes |
|-----------|--------|-----|--------|-------|
| Challenge fit | 14 | 15 | +0.5 | What's Closest strengthens civic access; verified working |
| Quality and design | 8.5 | 10 | +0.5 | Audit confirms no critical bugs; release-ready |
| Originality and impact | 7.5 | 10 | 0 | Same; nearest-by-category is clear differentiator |
| Commercialisation potential | 3 | 5 | 0 | Narrative unchanged |
| **Total** | **33** | **40** | **+1** | |

---

## Scoring by Rubric Category

### Challenge fit (15)

- **Score:** 14/15
- **Explanation:** The app directly addresses Civic Access & Community Communication. Address search and map click provide civic information. This Address (zoning, flood, neighborhood) and What's Closest (nearest park, hospital) create a clear civic snapshot. Next Steps connects to city services. Minor gap: no Montgomery-area geocode validation; out-of-area addresses can be searched.

### Quality and design (10)

- **Score:** 8.5/10
- **Explanation:** Code is clean, TypeScript, service-layer separation. Documentation exists. UX has loading/error/empty states. Mobile layout is functional but constrained. No critical UX flaws found in audit.

### Originality and impact (10)

- **Score:** 7.5/10
- **Explanation:** Address-first civic snapshot inverts the typical GIS-layer paradigm. What's Closest frames proximity as civic accessibility. Plain language throughout. Impact is meaningful for residents. Not highly novel technically, but the framing and UX are differentiated.

### Commercialisation potential (5)

- **Score:** 3/5
- **Explanation:** White-label civic product for mid-size cities is plausible. Montgomery is pilot. Scalability narrative exists but is not heavily emphasized in the app or docs. Could be strengthened in README and demo closing.

---

## Honest Limitations

- **Geocoder scope:** Nominatim accepts any US address; no Montgomery-only validation.
- **Community centers:** Not activated; one category remains unavailable.
- **Mobile:** Map height constrained on small screens; no map/panel toggle.
- **Phase 3:** What's Happening Nearby not implemented; limits impact narrative.

---

## Score Summary

| Metric | Value |
|--------|-------|
| Before audit | 32/40 |
| After audit | 33/40 |
| Delta | +1 |
