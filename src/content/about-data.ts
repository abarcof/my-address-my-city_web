/**
 * About this app — explains what the app shows and how it works.
 * Resident-friendly, confident copy. Highlights utility and positive value.
 */

import { APP_CONFIG } from '../config/app-config';

export interface AboutDataSection {
  title: string;
  content: string;
}

export const ABOUT_DATA_SECTIONS: AboutDataSection[] = [
  {
    title: 'One Address, Everything You Need',
    content: `Type an address or tap the map. Instantly see zoning, flood risk, neighborhood, council district, property record, and your trash and recycling schedule. All straight from the official City of ${APP_CONFIG.cityName} data.`,
  },
  {
    title: "What's Closest to You",
    content:
      "Find the nearest park, community center, and hospital from any address, with approximate distance. One tap opens directions — no searching, no guessing.",
  },
  {
    title: "What's Happening on Your Block",
    content:
      "See code violations and building permits within half a mile. Know what's being built, what's being inspected, and what's changing in your neighborhood.",
  },
  {
    title: 'Your Next Steps with the City',
    content: `Report a problem, apply for a permit, request public records, or stay up to date with official city news — all from one tab, with direct links to ${APP_CONFIG.cityName}'s official pages. Enter your email to follow any address and be among the first to know when new activity happens nearby.`,
  },
  {
    title: 'Share Your Snapshot',
    content:
      'One click copies the link to any address — share it with anyone, anywhere. No sign-up, no hassle.',
  },
  {
    title: 'Credits',
    content: `Designed by Aicardo Barco Fajardo · abarcof@gmail.com · City of ${APP_CONFIG.cityName}, Alabama · World Wide Vibes Hackathon 2026 · GenAI Works`,
  },
];

export const ABOUT_DATA_HEADLINE =
  `My Address, My City is your window into everything the city knows about any address in ${APP_CONFIG.cityName} — all in one place, in language anyone can understand.`;
