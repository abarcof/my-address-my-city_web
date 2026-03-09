# Demo Checklist — My Address, My City

Use this before recording or presenting the demo.

---

## Pre-Demo

- [ ] App runs: `npm run dev` or deployed URL
- [ ] Map loads and shows Montgomery
- [ ] No address selected — clean start
- [ ] Search bar responsive
- [ ] Demo presets visible (City Hall, Residential, Outside Montgomery)
- [ ] "About this data" link visible in header
- [ ] "Copy link" button appears when a location is selected

---

## Flow Test

- [ ] Search `103 N Perry St, Montgomery, AL` or click City Hall preset
- [ ] Civic Snapshot Summary appears at top
- [ ] This Address tab shows zoning, flood, neighborhood, council district
- [ ] What's Closest tab shows park, community center, hospital with distances
- [ ] What's Happening Nearby tab shows records (or empty states) with "Showing X recent"
- [ ] Next Steps tab shows four official city links (Report issue, Apply for permits, Request public records, Stay informed)
- [ ] Outside Montgomery preset shows out-of-bounds message
- [ ] About This Data drawer opens and closes
- [ ] Copy link copies shareable URL; pasting and opening restores same location and tab

---

## No Regressions

- [ ] No console errors during flow
- [ ] Tabs switch correctly
- [ ] Map click still works
- [ ] Loading and empty states display correctly

---

## Final

- [ ] Demo script reviewed: [docs/demo-script-final.md](demo-script-final.md)
- [ ] Recording device ready (if recording)
- [ ] Backup screen recording available (if possible)
