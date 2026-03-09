import { queryWithinRadius } from '../api/arcgis-client';
import { extractLatLng } from '../../utils/geometry';
import { haversineKm, formatDistanceLabel, kmToMiles } from '../../utils/distance';
import type { Coordinates } from '../../types/address';
import type { NearestPlace } from '../../types/closest';

const SERVICE_PATH = 'Streets_and_POI/MapServer/7';
const RADIUS_MILES = 25;

const NAME_FIELDS = [
  'NAME', 'name', 'Name',
  'PARK_NAME', 'PARKNAME', 'ParkName',
  'FACILITY_NAME', 'FACILITYNAME', 'FacilityName',
  'FACILITY', 'Facility',
  'LABEL', 'Label', 'label',
  'GNIS_NAME', 'GNISNAME',
  'DESCRIPTION', 'Description',
  'SITE_NAME', 'SITENAME',
  'LOCATION', 'Location', 'PLACE_NAME', 'PLACENAME',
  'FEATURE_NAM', 'FEATURE_NAME', 'TEXT', 'TITLE',
];

const SKIP_KEYS = new Set([
  'OBJECTID', 'FID', 'Shape', 'Shape_Length', 'Shape_Area',
  'Shape__Length', 'Shape__Area', 'GlobalID',
  'last_edited_date', 'created_date', 'last_edited_user', 'created_user',
]);

function isUrlLikeKey(key: string): boolean {
  const k = key.toUpperCase();
  return k.includes('URL') || k.includes('LINK') || k.includes('HREF') || k.includes('WEB');
}

function isValidName(s: string): boolean {
  const t = s.trim();
  if (t.length < 3 || t.length > 150) return false;
  if (/^\d+$/.test(t) || /^\d{4}-\d{2}-\d{2}/.test(t)) return false;
  if (/^[A-Z]{1,2}$/i.test(t)) return false;
  if (/https?:\/\//i.test(t) || /www\./i.test(t) || /\.(com|org|gov|net)(\/|$)/i.test(t)) return false;
  return true;
}

function getName(attrs: Record<string, unknown>): string {
  let best = '';
  for (const f of NAME_FIELDS) {
    const v = attrs[f];
    if (typeof v === 'string' && isValidName(v) && v.trim().length > best.length) best = v.trim();
  }
  for (const [key, val] of Object.entries(attrs)) {
    const keyUpper = key.toUpperCase();
    if (SKIP_KEYS.has(key) || isUrlLikeKey(key) || keyUpper.includes('OBJECTID') || keyUpper.includes('SHAPE') || keyUpper.includes('DATE')) continue;
    if (typeof val === 'string' && isValidName(val)) {
      const t = val.trim();
      if (keyUpper.includes('NAME') || keyUpper.includes('LABEL') || keyUpper.includes('FACILITY') || keyUpper.includes('PARK') || keyUpper.includes('SITE') || keyUpper.includes('TITLE')) {
        if (t.length > best.length) best = t;
      }
    }
  }
  for (const [key, val] of Object.entries(attrs)) {
    const keyUpper = key.toUpperCase();
    if (SKIP_KEYS.has(key) || isUrlLikeKey(key) || keyUpper.includes('OBJECTID') || keyUpper.includes('SHAPE') || keyUpper.includes('DATE')) continue;
    if (typeof val === 'string' && isValidName(val)) {
      const t = val.trim();
      if (t.length > best.length) best = t;
    }
  }
  if (best) return best;
  for (const [, val] of Object.entries(attrs)) {
    if (typeof val !== 'string') continue;
    const url = val.trim();
    const match = url.match(/\/([a-z0-9-]+)(?:\?|$)/i);
    if (match) {
      const slug = match[1].replace(/-/g, ' ');
      const title = slug.replace(/\b\w/g, (c) => c.toUpperCase());
      if (title.length >= 3 && title.length <= 80) return title;
    }
  }
  return 'Unnamed Park';
}

export async function fetchNearestPark(
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
    const name = getName(f.attributes);
    const id = `park-${String(f.attributes.OBJECTID ?? f.attributes.FID ?? Math.random())}`;

    const place: NearestPlace = {
      id,
      category: 'parks',
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
