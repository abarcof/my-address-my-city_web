# Bright Data — Local Development Setup

To see Bright Data working when running `npm run dev` locally:

## Option A: Proxy to Your Vercel Deployment (Recommended)

1. **Get your Vercel URL** — From [vercel.com/dashboard](https://vercel.com/dashboard), open your project and copy the URL (e.g. `https://my-address-my-cityweb.vercel.app`).

2. **Ensure BRIGHTDATA_API_KEY is in Vercel** — Project Settings → Environment Variables. Add `BRIGHTDATA_API_KEY` with your Bright Data API key. Redeploy if you just added it.

3. **Create `.env.local`** in the project root:
   ```
   VITE_API_BASE=https://YOUR-VERCEL-URL.vercel.app
   ```
   Replace with your actual Vercel URL (no trailing slash).

4. **Run** `npm run dev` — API calls will be proxied to your Vercel deployment.

## Option B: Run Everything Locally with Vercel CLI

1. **Login:** `npx vercel login`
2. **Link project:** `npx vercel link` (select your Vercel project)
3. **Pull env vars:** `npx vercel env pull .env.local` (gets BRIGHTDATA_API_KEY from Vercel)
4. **Run:** `npx vercel dev` (runs app + serverless API locally)

## Verify

Open the app, select a Montgomery address, go to City Resources tab. You should see live search results from Bright Data instead of the "Configure the Bright Data API" message.

## If results are empty

Bright Data requires a SERP API zone. The app uses zone `serp_api1` by default. If your account has no SERP zone yet:

1. Create zone via script: `BRIGHTDATA_API_KEY=your-key node scripts/create-bright-data-serp-zone.js`
2. Add env var in Vercel: `BRIGHT_DATA_SERP_ZONE` = `serp_api1`
3. Redeploy

Or create manually at [Bright Data Zones](https://brightdata.com/cp/zones) / [Add a Zone API](https://docs.brightdata.com/api-reference/account-management-api/Add_a_Zone).
