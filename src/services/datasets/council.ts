import { queryByPoint, queryWithinRadius } from '../api/arcgis-client';
import { getCouncilContact } from '../../content/council-contacts';
import type { Coordinates } from '../../types/address';
import type { CouncilDistrictResult } from '../../types/snapshot';

/** Primary: SDE City Council polygon layer */
const PRIMARY_SERVICE = 'SDE_City_Council/MapServer/0';

/** Fallback: City Council and Territories — try layers that may contain council districts (layer 5 is Code Enforcement, skip) */
const FALLBACK_SERVICES = [
  'Capture/CityCouncil_and__Territories/FeatureServer/0',
  'Capture/CityCouncil_and__Territories/FeatureServer/1',
  'Capture/CityCouncil_and__Territories/FeatureServer/2',
  'Capture/CityCouncil_and__Territories/FeatureServer/3',
  'Capture/CityCouncil_and__Territories/FeatureServer/4',
];

/** Proxy: Code Violations has CouncilDistrict per record — use nearby record as fallback */
const CODE_VIOLATIONS_SERVICE = 'HostedDatasets/Code_Violations/FeatureServer/0';

/** Known non-district attribute keys to skip when scanning */
const SKIP_KEYS = new Set([
  'OBJECTID', 'objectid', 'Id', 'Shape', 'Shape_Area', 'Shape_Length',
  'Shape__Area', 'Shape__Length', 'GlobalID', 'Shape.STArea()', 'Shape.STLength()',
]);

/** Explicit field names for council district (ArcGIS layers vary) */
const DISTRICT_FIELDS = [
  'CouncilDistrict',
  'COUNCIL_DISTRICT',
  'COUNCIL_DIST',
  'DISTRICT',
  'DIST_NUM',
  'DISTRICT_NUM',
  'DISTRICT_NUMBER',
  'NAME',
  'District',
  'DISTNAME',
  'DISTRICT_NAME',
];

function looksLikeDistrict(val: unknown): boolean {
  if (val == null) return false;
  const s = String(val).trim();
  if (!s) return false;
  // District 1–9 for Montgomery
  const num = parseInt(s, 10);
  if (num >= 1 && num <= 9) return true;
  if (/^district\s*\d+$/i.test(s)) return true;
  if (/^dist\.?\s*\d+$/i.test(s)) return true;
  if (/^\d+$/.test(s) && s.length <= 2) return true;
  return false;
}

function formatDistrict(val: unknown): string {
  const s = String(val).trim();
  const num = parseInt(s.replace(/\D/g, ''), 10);
  if (num >= 1 && num <= 9) return String(num);
  return s;
}

function extractDistrict(attrs: Record<string, unknown>): string | null {
  for (const field of DISTRICT_FIELDS) {
    const val = attrs[field];
    if (val != null && val !== '' && looksLikeDistrict(val)) {
      return formatDistrict(val);
    }
  }
  for (const [key, val] of Object.entries(attrs)) {
    if (SKIP_KEYS.has(key)) continue;
    if (looksLikeDistrict(val)) return formatDistrict(val);
  }
  return null;
}

function toResult(district: string): CouncilDistrictResult {
  const contact = getCouncilContact(district);
  return {
    district,
    ...(contact?.name && { contactName: contact.name }),
    ...(contact?.phone && { contactPhone: contact.phone }),
    ...(contact?.email && { contactEmail: contact.email }),
  };
}

async function tryService(
  servicePath: string,
  coordinates: Coordinates,
): Promise<CouncilDistrictResult | null> {
  const feature = await queryByPoint({
    servicePath,
    coordinates,
    outFields: '*',
  });
  if (!feature) return null;
  const district = extractDistrict(feature.attributes);
  if (!district) return null;
  return toResult(district);
}

async function tryProxyFromCodeViolations(
  coordinates: Coordinates,
): Promise<CouncilDistrictResult | null> {
  const features = await queryWithinRadius({
    servicePath: CODE_VIOLATIONS_SERVICE,
    coordinates,
    radiusMiles: 0.15,
    outFields: 'CouncilDistrict',
    returnGeometry: false,
    maxRecords: 5,
  });
  for (const f of features) {
    const d = extractDistrict(f.attributes);
    if (d) return toResult(d);
  }
  return null;
}

export async function fetchCouncilDistrict(
  coordinates: Coordinates,
): Promise<CouncilDistrictResult | null> {
  let result = await tryService(PRIMARY_SERVICE, coordinates);
  if (result) return result;

  for (const servicePath of FALLBACK_SERVICES) {
    result = await tryService(servicePath, coordinates);
    if (result) return result;
  }

  result = await tryProxyFromCodeViolations(coordinates);
  if (result) return result;

  return null;
}
