import { queryWithinRadius } from '../api/arcgis-client';
import { extractLatLng } from '../../utils/geometry';
import { haversineKm, formatDistanceLabel, kmToMiles } from '../../utils/distance';
import type { Coordinates } from '../../types/address';
import type { NearestPlace } from '../../types/closest';

const SERVICE_PATH = 'HostedDatasets/Community_Centers/FeatureServer/0';
const RADIUS_MILES = 25;

function getName(attrs: Record<string, unknown>): string {
  const v = attrs.FACILITY_N ?? attrs.NAME ?? attrs.name;
  if (typeof v === 'string' && v.trim().length >= 2 && v.trim().length <= 150) {
    return v.trim();
  }
  for (const key of ['FACILITY_N', 'FACILITYNAME', 'NAME', 'LABEL']) {
    const val = attrs[key];
    if (typeof val === 'string' && val.trim().length >= 2) return val.trim();
  }
  return 'Community Center';
}

export async function fetchNearestCommunityCenter(
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
    const id = `community-center-${String(f.attributes.OBJECTID ?? f.attributes.FID ?? Math.random())}`;

    const place: NearestPlace = {
      id,
      category: 'community-centers',
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
