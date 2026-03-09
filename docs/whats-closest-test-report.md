# What's Closest Test Report

**Date:** March 7, 2025  
**App URL:** http://localhost:5173/  
**Scope:** 5 address searches + 5 map clicks

---

## Summary

| Check | Result |
|-------|--------|
| Park name shows (not "Unnamed Park") | **FAIL** – Parks show URLs instead of names |
| Hospital name shows (not "Unnamed" or single letter) | **PASS** |
| Distance displays correctly | **PASS** |
| Community Center card hidden | **PASS** |
| Map markers for park and hospital | **PASS** |

---

## Address Search Tests

| # | Address | Park | Hospital | Distance | CC Hidden | Markers |
|---|---------|------|----------|----------|-----------|---------|
| 1 | 103 N Perry St, Montgomery, AL | URL (lister-hill-plaza) | CAPITAL HILL HEALTH CARE & REHAB ✓ | ✓ | ✓ | ✓ |
| 2 | 200 Coosa St, Montgomery, AL | URL (lister-hill-plaza) | CAPITAL HILL HEALTH CARE & REHAB ✓ | ✓ | ✓ | ✓ |
| 3 | 1150 Forest Ave, Montgomery, AL | URL (patton-park) | JACKSON HOSPITAL ✓ | ✓ | ✓ | ✓ |
| 4 | 1010 E South Blvd, Montgomery, AL | URL (w-a-gayle-planetarium) | JACKSON HOSPITAL/LONG TERM HOSPITAL OF MONTGOMERY ✓ | ✓ | ✓ | ✓ |
| 5 | 300 Dexter Ave, Montgomery, AL | URL (court-square-fountain) | BAPTIST MEDICAL CENTER SOUTH ✓ | ✓ | ✓ | ✓ |

---

## Map Click Tests

| # | Area | Park | Hospital | Distance | CC Hidden | Markers |
|---|-----|------|----------|----------|-----------|---------|
| 1 | Downtown (center) | URL (court-square-fountain) | BAPTIST MEDICAL CENTER SOUTH ✓ | ✓ | ✓ | ✓ |
| 2 | Residential north | URL (rosa-l-parks-park) | SOUTH HAVEN MANOR NURSING HOME ✓ | ✓ | ✓ | ✓ |
| 3–5 | Various positions | URL pattern | Valid names ✓ | ✓ | ✓ | ✓ |

---

## Bad Names / Issues

### Parks – URLs shown instead of names

All park cards display a URL instead of the park name:

- `http://www.funinmontgomery.com/parks-items/lister-hill-plaza` → should be **Lister Hill Plaza**
- `http://www.funinmontgomery.com/parks-items/patton-park` → should be **Patton Park**
- `http://www.funinmontgomery.com/parks-items/w-a-gayle-planetarium` → should be **W A Gayle Planetarium**
- `http://www.funinmontgomery.com/parks-items/court-square-fountain` → should be **Court Square Fountain**
- `http://www.funinmontgomery.com/parks-items/rosa-l-parks-park` → should be **Rosa L Parks Park**

**Root cause:** The ArcGIS parks layer has a URL field that `getName()` in `parks.ts` selects because it passes `isValidName()`. URLs should be excluded from name selection.

### Hospitals – no issues

All hospital names were valid (e.g., CAPITAL HILL HEALTH CARE & REHAB, JACKSON HOSPITAL, BAPTIST MEDICAL CENTER SOUTH). No "Unnamed Health Facility" or single-letter names observed.

---

## Errors

- No runtime errors observed during testing.
- Terminal showed a prior build error: duplicate `queryWithinRadius` export in `arcgis-client.ts` (may need resolution for clean builds).
