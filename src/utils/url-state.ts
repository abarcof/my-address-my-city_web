/**
 * URL state — deep-linkable civic snapshot
 * Persists lat, lng, tab, and optional label in the URL for shareable links.
 */

const PARAM_LAT = 'lat';
const PARAM_LNG = 'lng';
const PARAM_TAB = 'tab';
const PARAM_LABEL = 'label';

const VALID_TABS = [
  'this-address',
  'whats-closest',
  'whats-happening-nearby',
  'next-steps',
] as const;

export type UrlTab = (typeof VALID_TABS)[number];

function isValidTab(s: string): s is UrlTab {
  return VALID_TABS.includes(s as UrlTab);
}

export interface UrlState {
  lat: number;
  lng: number;
  tab: UrlTab;
  label?: string;
}

const MIN_LAT = -90;
const MAX_LAT = 90;
const MIN_LNG = -180;
const MAX_LNG = 180;

function parseNumber(s: string | null, min: number, max: number): number | null {
  if (s == null) return null;
  const n = parseFloat(s);
  if (Number.isNaN(n)) return null;
  if (n < min || n > max) return null;
  return n;
}

/**
 * Parse URL search params into app state.
 * Returns null if required params are missing or invalid.
 */
export function parseUrlState(): UrlState | null {
  const params = new URLSearchParams(window.location.search);
  const lat = parseNumber(params.get(PARAM_LAT), MIN_LAT, MAX_LAT);
  const lng = parseNumber(params.get(PARAM_LNG), MIN_LNG, MAX_LNG);

  if (lat == null || lng == null) return null;

  const tabParam = params.get(PARAM_TAB);
  const tab: UrlTab = tabParam && isValidTab(tabParam) ? tabParam : 'this-address';

  const label = params.get(PARAM_LABEL) ?? undefined;
  const labelDecoded = label ? decodeURIComponent(label) : undefined;

  return {
    lat,
    lng,
    tab,
    label: labelDecoded,
  };
}

/**
 * Build URL search string from state.
 */
export function buildUrlParams(state: UrlState): string {
  const params = new URLSearchParams();
  params.set(PARAM_LAT, state.lat.toFixed(6));
  params.set(PARAM_LNG, state.lng.toFixed(6));
  params.set(PARAM_TAB, state.tab);
  if (state.label?.trim()) {
    params.set(PARAM_LABEL, encodeURIComponent(state.label.trim()));
  }
  return params.toString();
}

/**
 * Build full shareable URL for current location.
 */
export function buildShareUrl(state: UrlState): string {
  const params = buildUrlParams(state);
  const base = window.location.origin + window.location.pathname;
  return params ? `${base}?${params}` : base;
}
