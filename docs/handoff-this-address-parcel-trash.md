# Handoff: Add Parcel ID and Trash & Recycling to This Address

**Purpose:** Copy and paste this prompt into the chat that built Phase 1 / This Address. That chat knows the service-layer pattern, InfoCard usage, and ArcGIS client. This task adds two new cards following the exact same structure.

**Council District:** No changes. Keep as-is (number only, no representative name).

---

## INSTRUCTIONS FOR THE USER

1. Open the chat where Phase 1 / This Address was built (or a new chat if needed).
2. Copy everything from "---" below through the end of this file.
3. Paste as your message.
4. The agent will add Parcel ID and Trash & Recycling cards to This Address.

---

## PROMPT BODY

---

Add two new cards to the **This Address** module:

1. **Parcel ID** — Show the parcel identifier for the selected location, with a link to look up property details.
2. **Trash & Recycling Pickup** — Show collection schedule (e.g. "Monday & Thursday" or "Tuesday & Friday") and route if available (e.g. "Route 7B").

Follow the exact same pattern as Zoning, Flood Zone, Neighborhood, and Council District:
- Service in `src/services/datasets/`
- Hook in `src/features/snapshot/use-snapshot.ts`
- Card component in `src/features/snapshot/ThisAddress.tsx`
- Type in `src/types/snapshot.ts`
- Use `queryByPoint` from `src/services/api/arcgis-client.ts` for point-in-polygon spatial query

---

## 1. PARCEL ID

**Endpoint:** `Parcels/FeatureServer/0`  
**Base URL:** `https://gis.montgomeryal.gov/server/rest/services`

**Verified (2026-03-07):** City Hall (32.377, -86.3009) returns 1 feature. Residential (2560 Bell Rd) returns empty — partial coverage. Use graceful empty state where no parcel found.

**Confirmed fields:** `ParcelNo` (primary, e.g. "10 03 07 3 005 001.000"), `PID` (numeric fallback). Use ParcelNo as display value.

**Result type:**
```ts
interface ParcelResult {
  parcelId: string;  // or pin, mapNumber — whatever the source field is
}
```

**UI:** InfoCard with parcel ID as subtitle. Add a small link: "Look up property records" → `https://montgomery.capturecama.com/` (Montgomery County property portal — residents can search by parcel or address).

**Empty message:** "Parcel data not available for this location."

---

## 2. TRASH & RECYCLING PICKUP

**Service:** `QAlert/QAlert_311/MapServer/6`  
**Verified (2026-03-07):** Layer **6** (not 0, 1, or 2) contains garbage schedule. Layer 0 = council reps; layer 1 = districts.

**Query:** Point-in-polygon spatial query (same as flood zone). City Hall and residential both return data.

**Confirmed fields:** `Day_1`, `Day_2` (e.g. "Wednesday", "Friday"). No route field in this layer. Format as "Day_1 & Day_2".

**Result type:**
```ts
interface TrashPickupResult {
  schedule: string;   // e.g. "Wednesday & Friday" from Day_1 & Day_2
  route?: string;     // Not available in layer 6
}
```

**UI:** InfoCard with schedule as subtitle. Route badge omitted (not in layer 6).

**Empty message:** "Trash and recycling schedule not available for this location."

**Note:** Montgomery garbage is twice weekly (Mon/Thu or Tue/Fri). Recycling is twice monthly on Saturdays at drop-off locations — may be a separate layer. Focus on **garbage/trash schedule** first; recycling can be added later if data supports it.

---

## 3. PATTERN TO FOLLOW

**Service file** (e.g. `parcels.ts`):
- Import `queryByPoint` from arcgis-client
- Import `Coordinates` and result type
- Single async function `fetchParcel(coordinates)` → `ParcelResult | null`
- Normalize attributes to typed result; return null if no feature or invalid data

**Hook** (in `use-snapshot.ts`):
- `useParcel()` — queryKey `['parcel', lat, lng]`, enabled when coordinates && isWithinMontgomery

**Card** (in `ThisAddress.tsx`):
- `ParcelCard` — same structure as NeighborhoodCard: LoadingCard, ErrorCard, EmptyCard, InfoCard

**Type** (in `src/types/snapshot.ts`):
- `ParcelResult`, `TrashPickupResult`

---

## 4. CARD ORDER

Insert in This Address (after Council District):

1. Zoning  
2. Flood Context  
3. Neighborhood  
4. Council District  
5. **Parcel ID** (new)  
6. **Trash & Recycling Pickup** (new)

---

## 5. RULES

- **Graceful degradation:** If service returns empty or errors, show friendly empty/error state. Never break the app.
- **No raw GIS fields in UI:** Normalize to plain language (e.g. "Monday & Thursday" not "MON,THU").
- **Consistent styling:** Use InfoCard, LoadingCard, ErrorCard, EmptyCard like other cards.
- **Do not change** existing cards (Zoning, Flood, Neighborhood, Council District).

---

## 6. DOCS TO UPDATE AFTER IMPLEMENTATION

- `docs/data-sources.md` — Add Parcels and Trash schedule with discovered field names and validation status
- `docs/app-claims.md` — Add claims for Parcel ID and Trash & Recycling (status: Implementation-constrained until tested)

---

## 7. VALIDATION

After implementation:

1. Run `npm run build` — must pass
2. Select City Hall (103 N Perry St) or a residential preset — verify cards show or show appropriate empty state
3. If Parcels returns empty consistently, document in data-sources and keep empty state; do not block
4. If Trash layer structure differs from expectation, adapt the normalization; prioritize schedule over route
