#!/usr/bin/env node
/**
 * Create a Bright Data SERP zone via API.
 * Run: BRIGHTDATA_API_KEY=your-key node scripts/create-bright-data-serp-zone.js
 * Or set BRIGHTDATA_API_KEY in .env.local and run from project root.
 *
 * Required: API key from https://brightdata.com/cp/setting/users
 */

const API_KEY = process.env.BRIGHTDATA_API_KEY || process.env.BRIGHT_DATA_API_KEY;

if (!API_KEY?.trim()) {
  console.error('Set BRIGHTDATA_API_KEY or BRIGHT_DATA_API_KEY');
  process.exit(1);
}

async function createZone() {
  const res = await fetch('https://api.brightdata.com/zone', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      zone: { name: 'serp_api1', type: 'serp' },
      plan: { type: 'static', serp: true },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('Bright Data API error:', res.status, text);
    process.exit(1);
  }

  const data = await res.json();
  console.log('Zone created:', data);
  console.log('\nAdd to Vercel: BRIGHT_DATA_SERP_ZONE=serp_api1');
}

createZone().catch((e) => {
  console.error(e);
  process.exit(1);
});
