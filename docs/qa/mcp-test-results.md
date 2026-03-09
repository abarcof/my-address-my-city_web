# MCP Browser Test Results

**Date:** 2026-03-08  
**Tests:** 10

---

## Test 1: Initial Load
**Action:** Navigate to http://localhost:5173/  
**Expected:** App loads, map visible, tabs visible, empty state message  
**Result:** PASS — Page loads, search bar, demo presets, map, tabs (This Address selected), "Search for an address or click the map..." message visible

---

## Test 2: Demo Preset - City Hall
**Action:** Click "City Hall" demo preset  
**Expected:** Map zooms to City Hall, panel populates with data  
**Result:** PASS — URL updates with lat/lng/tab/label, Copy link appears, Civic Summary, zoning, flood, neighborhood, council district (not available) shown

---

## Test 3: What's Closest Tab
**Action:** Click What's Closest tab  
**Expected:** Nearest park, community center, hospital with distances  
**Result:** PASS — Lister Hill Plaza, Armory Learning Arts Center, Capital Hill Health Care & Rehab with "Approximate distance: 0.4 mi"

---

## Test 4: What's Happening Nearby Tab
**Action:** Click What's Happening Nearby tab  
**Expected:** Code violations, permits, 311 requests  
**Result:** PASS — Building permits shown, empty states for code violations and 311

---

## Test 5: Next Steps Tab
**Action:** Click Next Steps tab  
**Expected:** Report an Issue, Verify Zoning, City Resources links  
**Result:** PASS — All three links visible with descriptions

---

## Test 6: About This Data Drawer
**Action:** Click "About this data"  
**Expected:** Drawer opens with data sources and methods  
**Result:** PASS — Drawer opens, sections: This Address, What's Closest, What's Happening Nearby, Montgomery Only, Informational Purpose. Close works.

---

## Test 7: Copy Link Button
**Action:** Click Copy link (when location selected)  
**Expected:** Button appears when location selected; click copies URL  
**Result:** PASS — Button visible when City Hall selected. Click executes (clipboard not verifiable in MCP).

---

## Test 8: Outside Montgomery Preset
**Action:** Click "Outside Montgomery" preset  
**Expected:** Out-of-bounds message  
**Result:** PASS — "This location appears to be outside Montgomery. This app shows city information only for addresses within city limits." + actionable message

---

## Test 9: URL / Deep Link Restore
**Action:** Navigate to http://localhost:5173/?lat=32.377&lng=-86.301&tab=whats-closest&label=City%20Hall  
**Expected:** App loads with City Hall location and What's Closest tab active  
**Result:** PASS — Location and tab restored correctly. Data loads (Civic Summary, park, community center, hospital)

---

## Test 10: Layout and Tabs
**Action:** Verify tabs above content, no empty space, layout correct  
**Expected:** Tabs (This Address, What's Closest, etc.) at top of panel; content scrollable below  
**Result:** PASS — Tabs visible at top of right panel. Content in scrollable area. Map left, panel right on desktop. Mobile: map (h-48/sm:h-64) on top, panel below.
