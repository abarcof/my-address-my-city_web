import { queryWithinRadius } from '../api/arcgis-client';
import { extractLatLng } from '../../utils/geometry';
import { haversineKm, formatDistanceLabel, kmToMiles } from '../../utils/distance';
import type { Coordinates } from '../../types/address';
import type { NearestPlace } from '../../types/closest';

const SERVICE_PATH = 'HostedDatasets/Health_Care_Facility/FeatureServer/0';
const RADIUS_MILES = 25;

const NAME_FIELDS = [
  'NAME', 'name', 'Name',
  'FACILITY_NAME', 'FACILITYNAME', 'FacilityName',
  'FACILITY', 'Facility',
  'LABEL', 'Label', 'label',
  'FACILITYTYPE', 'FacilityType',
  'STATUS', 'Status',
  'ADDRESS', 'Address', 'FULLADDRESS',
  'SITE_NAME', 'SITENAME',
  'ORGANIZATION', 'ORG_NAME', 'HOSPITAL_NAME',
  'LOCATION', 'Location', 'PLACE_NAME', 'PLACENAME',
];

const SKIP_KEYS = new Set([
  'OBJECTID', 'FID', 'Shape', 'Shape_Length', 'Shape_Area',
  'Shape__Length', 'Shape__Area', 'GlobalID',
  'last_edited_date', 'created_date', 'last_edited_user', 'created_user',
  'TYPE_FACIL',
]);

function isValidName(s: string): boolean {
  const t = s.trim();
  return (
    t.length >= 3 &&
    t.length <= 150 &&
    !/^\d+$/.test(t) &&
    !/^\d{4}-\d{2}-\d{2}/.test(t) &&
    !/^[A-Z]{1,2}$/i.test(t) &&
    !/^(AL|TX|GA|FL|MS|TN|SC|NC|VA|CA|NY)$/i.test(t)
  );
}

function toTitleCase(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((word) => (word.length > 0 ? word[0].toUpperCase() + word.slice(1) : word))
    .join(' ');
}

function getName(attrs: Record<string, unknown>): string {
  let best = '';
  for (const f of NAME_FIELDS) {
    const v = attrs[f];
    if (typeof v === 'string' && isValidName(v) && v.trim().length > best.length) best = v.trim();
  }
  for (const [key, val] of Object.entries(attrs)) {
    const keyUpper = key.toUpperCase();
    if (SKIP_KEYS.has(key) || keyUpper.includes('OBJECTID') || keyUpper.includes('SHAPE') || keyUpper.includes('DATE') || keyUpper.includes('GLOBALID')) continue;
    if (typeof val === 'string' && isValidName(val)) {
      const t = val.trim();
      if (keyUpper.includes('NAME') || keyUpper.includes('LABEL') || keyUpper.includes('FACILITY') || keyUpper.includes('SITE') || keyUpper.includes('TITLE') || keyUpper.includes('ORGANIZATION')) {
        if (t.length > best.length) best = t;
      }
    }
  }
  for (const [key, val] of Object.entries(attrs)) {
    const keyUpper = key.toUpperCase();
    if (SKIP_KEYS.has(key) || keyUpper.includes('OBJECTID') || keyUpper.includes('SHAPE') || keyUpper.includes('DATE')) continue;
    if (typeof val === 'string' && isValidName(val)) {
      const t = val.trim();
      if (t.length > best.length) best = t;
    }
  }
  return best || 'Unnamed Health Facility';
}

export async function fetchNearestHospital(
  coordinates: Coordinates,
): Promise<NearestPlace | null> {
  const features = await queryWithinRadius({
    servicePath: SERVICE_PATH,
    coordinates,
    radiusMiles: RADIUS_MILES,
    outFields: '*',
    returnGeometry: true,
    maxRecords: 100,
  });

  let nearest: { place: NearestPlace; distKm: number } | null = null;

  for (const f of features) {
    const ll = extractLatLng(f);
    if (!ll) continue;

    const distKm = haversineKm(coordinates.lat, coordinates.lng, ll.lat, ll.lng);
    const rawName = getName(f.attributes);
    const name = toTitleCase(rawName);
    const id = `hospital-${String(f.attributes.OBJECTID ?? f.attributes.FID ?? Math.random())}`;

    const place: NearestPlace = {
      id,
      category: 'hospitals',
      name,
      lat: ll.lat,
      lng: ll.lng,
      distanceKm: distKm,
      distanceMiles: kmToMiles(distKm),
      distanceLabel: formatDistanceLabel(distKm),
    };

    if (!nearest || distKm < nearest.distKm) {
      nearest = { place, distKm };
    }
  }

  return nearest?.place ?? null;
}
