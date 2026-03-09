# Demo Script
## My Address, My City

---

## Phase 1 Demo (Standalone — Shippable MVP)

Target duration: **40–50 seconds**

Use this script if Phase 1 is the final submission. This is a complete, self-contained demo.

### Before the Demo

- App open in a browser tab, map of Montgomery visible
- No address selected — clean starting state
- Backup address ready; demo tested once privately

### Flow

| Step | Action | Narration | Duration |
|---|---|---|---|
| Opening | — | "This is My Address, My City — a civic web app for Montgomery, Alabama. Give it one address, and it tells you what a resident needs to know." | 5s |
| Search | Type `103 N Perry St, Montgomery, AL` | "Let's start with City Hall." Map zooms, marker appears, panel populates. | 5s |
| This Address | "This Address" tab active by default | "We see: the zoning designation, flood zone status, council district, and neighborhood context — all pulled from configured Montgomery data sources and displayed in a resident-friendly way." Point to cards. | 12s |
| Next Steps | Click "Next Steps" tab | "The app connects residents to action — report an issue, verify zoning, or reach city departments." Point to links. | 8s |
| Map click | Click a residential area on the map | "This works for any location. Click anywhere in Montgomery — same instant snapshot." Wait for data. | 8s |
| Closing | — | "One address. Your city. Clear answers." | 4s |
| **Total** | | | **~42s** |

### Phase 1 Backup Plans

| Problem | Recovery |
|---|---|
| Address search fails | Click directly on the map — "You can also just click anywhere." |
| Data returns empty | "This location doesn't have that data — the app tells you that clearly." Show the empty state. |
| App is slow | Have a screen recording ready as backup |

---

## Full Demo (Phase 3+ — All Modules)

Target duration: **60–90 seconds**

This script assumes the app includes Phases 1, 2, and 3. Steps marked *(Phase 2+)* or *(Phase 3+)* are only included if those phases are stable and demoable.

### Before the Demo

- Open the app in a browser tab, already loaded
- Map should be visible, centered on Montgomery
- No address selected yet — clean starting state
- Have a backup address ready in case the primary one fails
- Test the demo flow once privately before presenting

### Flow

#### Opening (5 seconds)

> "This is My Address, My City — a civic web app for Montgomery, Alabama. You give it one address, and it tells you everything a resident needs to know."

---

#### Step 1 — Search by Address (5 seconds)

**Action:** Type `103 N Perry St, Montgomery, AL` in the search bar.

> "Let's start with City Hall."

The map zooms to the location. A marker appears. The side panel populates.

---

#### Step 2 — This Address (12 seconds)

**Action:** The "This Address" tab is active by default.

> "Immediately, we see: this location is zoned [zoning type], it's in [flood zone status], it belongs to Council District [number], and here's the neighborhood context."

Point to each card briefly. Do not read every field — summarize.

> "This is pulled from configured Montgomery data sources and displayed in a resident-friendly way."

---

#### Step 3 — Next Steps (8 seconds)

**Action:** Click the "Next Steps" tab.

> "The app doesn't just inform — it connects residents to action. Report an issue, verify zoning, or reach city departments directly."

Point to the links. Do not click them — just show they exist.

---

#### Step 4 — What's Closest *(Phase 2+)* (12 seconds)

**Action:** Click the "What's Closest" tab.

> "What's the nearest park? The closest community center? The app shows approximate distance and marks it on the map."

Point to the map markers and distance labels.

> "This is accessibility made simple — no complex models, just clear answers about what's nearby."

**If Phase 2 is unstable:** Skip this step entirely. Do not mention it.

---

#### Step 5 — What's Happening Nearby *(Phase 3+)* (12 seconds)

**Action:** Click the "What's Happening Nearby" tab.

> "Are there open code violations near this address? Recent building permits? City service activity?"

Point to the summary cards.

> "This turns a static lookup into neighborhood awareness. Residents can see what's actually happening around them."

**If Phase 3 is unstable:** Skip this step entirely. Do not mention it.

---

#### Step 6 — Different Location (8 seconds)

**Action:** Click a different point on the map — somewhere in a residential area.

> "And this works for any location in Montgomery."

Wait for data to load. Briefly show the updated "This Address" tab.

> "Click anywhere. Same instant snapshot."

---

#### Closing (5 seconds)

> "One address. Your city. Clear answers. That's My Address, My City."

---

### Full Demo Time Estimate

| Step | Duration |
|---|---|
| Opening | 5s |
| Search | 5s |
| This Address | 12s |
| Next Steps | 8s |
| What's Closest *(Phase 2+)* | 12s |
| What's Happening *(Phase 3+)* | 12s |
| Different location | 8s |
| Closing | 5s |
| **Total** | **~67 seconds** |

---

## Backup Plans (All Demos)

| Problem | Recovery |
|---|---|
| Address search fails | Click directly on the map — say "You can also just click anywhere." |
| One tab fails to load | Skip to the next tab — say "Let me show you another view." |
| A Phase 2+ or 3+ module is unstable | Hide the tab before the demo. Never show a broken module. |
| Entire app is slow | Have a screen recording ready as a backup demo |
| Data returns empty | Say "This location doesn't have [X] data — the app handles that gracefully" and show the empty state message |

---

## Key Demo Principles

1. **Show, don't explain.** Let the UI speak. Narrate what the audience sees, not how it was built.
2. **Never read field names aloud.** Summarize in plain language.
3. **Keep moving.** If something doesn't work, move to the next thing. Never debug live.
4. **End strong.** The tagline should be the last thing the audience hears.
5. **Stay under 90 seconds.** Judges have many demos to watch. Respect their time.
6. **Never show an unstable module.** If a later-phase tab is broken, remove it from the UI before recording. A clean 3-tab demo beats a broken 5-tab demo.
7. **Do not overclaim data provenance.** Say "configured Montgomery data sources" rather than "official data" unless end-to-end validation is complete.

---

## Demo Addresses (Must Be Validated Before Demo)

| Address | Why |
|---|---|
| 103 N Perry St, Montgomery, AL | City Hall — expected to have rich data across all layers |
| 251 S Lawrence St, Montgomery, AL | Rosa Parks Museum area — recognizable landmark |
| A residential address TBD | Shows the app works for regular residents, not just landmarks |

**Note:** All demo addresses must be tested against the live app before the submission demo recording. Do not assume an address "works" because it sounds reasonable — test it.
