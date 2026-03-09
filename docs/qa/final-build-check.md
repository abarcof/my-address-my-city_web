# Final Build Check — Phase 4

**Purpose:** Verify the project builds and runs before submission.

---

## Commands to Run

```bash
# Install dependencies (if needed)
npm install

# TypeScript + Vite build
npm run build

# Development server
npm run dev
```

---

## Expected Results

| Command | Expected |
|---------|----------|
| `npm run build` | Exit 0. No TypeScript errors. Vite builds to `dist/`. |
| `npm run dev` | Dev server starts. App loads at localhost. |

---

## Smoke Test (Manual)

1. Open app in browser
2. Map loads, centered on Montgomery
3. Search for `103 N Perry St, Montgomery, AL` or click City Hall preset
4. Civic Snapshot Summary appears
5. This Address tab shows zoning, flood, neighborhood
6. What's Closest tab shows park, hospital, community center
7. What's Happening Nearby tab shows records or empty states
8. Next Steps tab shows three links
9. Click Outside Montgomery preset — out-of-bounds message appears
10. Click "About this data" — drawer opens
11. Click "Copy link" — copies URL; paste in new tab — same location and tab restore
12. On mobile viewport: Map/Details toggle switches views

---

## If Build Fails

- **TypeScript errors:** Check `tsconfig.json` and fix type issues
- **Vite errors:** Check `vite.config.ts` and imports
- **Missing deps:** Run `npm install`

---

## Phase 4 + Final Pass Additions (New Files)

- `src/features/summary/` — CivicSnapshotSummary, use-civic-summary
- `src/types/summary.ts`
- `src/components/help/` — AboutDataDrawer, AboutDataButton
- `src/components/demo/DemoPresetButtons.tsx`
- `src/components/actions/CopyLinkButton.tsx`
- `src/content/about-data.ts`, `src/content/demo-presets.ts`
- `src/utils/url-state.ts`
- `src/hooks/use-url-sync.ts`
- `src/services/datasets/council.ts`
- `src/config/app-config.ts`
- `src/config/feature-flags.ts`

All use existing dependencies. No new packages added.
