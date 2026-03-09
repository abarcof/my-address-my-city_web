/**
 * Demo presets — quick-access locations for demo flow
 * Easy to disable via env or config if needed.
 */

export interface DemoPreset {
  id: string;
  label: string;
  lat: number;
  lng: number;
  description: string;
}

export const DEMO_PRESETS: DemoPreset[] = [
  {
    id: 'downtown',
    label: 'City Hall',
    lat: 32.377,
    lng: -86.301,
    description: 'Downtown example — 103 N Perry St, Montgomery, AL',
  },
  {
    id: 'residential',
    label: 'Residential',
    lat: 32.365,
    lng: -86.299,
    description: 'Residential example — Cloverdale area, Montgomery',
  },
  {
    id: 'outside',
    label: 'Outside Montgomery',
    lat: 33.521,
    lng: -86.803,
    description: 'Birmingham, AL — outside city limits',
  },
];

/** Set to false to hide demo preset buttons (e.g. production) */
export const DEMO_PRESETS_ENABLED = true;
