# Bright Data Bonus — Official Live Context

**Author:** Aicardo Barco Fajardo · abarcof@gmail.com

**Status:** Enabled. Zone `serp_api1` created, `BRIGHTDATA_API_KEY` in Vercel, feature flag on.

---

## What It Does (and Why It's Different)

The **Official Live Context** module is not just static links — it runs a **live web search** via Bright Data's SERP API. Unlike the curated City Resources links, this module:

- **Searches in real time** — Queries like `site:montgomeryal.gov [neighborhood] public notice`, `site:montgomeryal.gov Montgomery permits update`
- **Returns dynamic results** — Titles and descriptions from Google's index of city domains; content changes as city sites update
- **Contextual to location** — Uses the selected address/neighborhood in search queries
- Displays up to 3 results: title, source domain, summary, and link to official page

---

## Activation

1. Set `BRIGHT_DATA_ENABLED = true` in `src/config/feature-flags.ts`
2. Create a SERP API zone in [Bright Data Control Panel](https://brightdata.com/cp/zones)
3. Add environment variables (Vercel project settings or `.env`):
   - `BRIGHTDATA_API_KEY` or `BRIGHT_DATA_API_KEY` — Your Bright Data API key
   - `BRIGHT_DATA_SERP_ZONE` (optional) — Zone name, default `serp_api`

---

## Architecture

| Component | Location | Purpose |
|-----------|----------|---------|
| API route | `api/official-live-context.ts` | Vercel serverless function; never exposes token |
| Feature | `src/features/official-live-context/` | Hook + card component |
| Integration | `NextSteps.tsx` (City Resources) | Renders card when flag enabled |
| Flag | `src/config/feature-flags.ts` | `BRIGHT_DATA_ENABLED` (default: false) |

---

## Allowed Domains

- montgomeryal.gov
- capture.montgomeryal.gov
- gis.montgomeryal.gov

Only these domains are shown. All other results are filtered out.

---

## Graceful Degradation

- Token missing → API returns `{ items: [], unavailable: true }`; UI shows "Official live web context is not available in this environment."
- Flag false → Module not rendered
- API error or no results → Shows empty state message
- Core app continues to work in all cases

---

## Local Development

- **`npm run dev`** (Vite only): API calls 404; module shows unavailable state
- **`vercel dev`**: Runs Vercel serverless functions locally; full integration works with env vars set

---

## Claims

The app can optionally show recent official website context from city-owned public webpages using Bright Data. This is supplemental; it is not presented as official city GIS/dataset data.
