import { queryWithinRadius } from '../api/arcgis-client';
import { extractLatLng } from '../../utils/geometry';
import { haversineKm, kmToMiles } from '../../utils/distance';
import { formatDateForDisplay, parseArcGISDateToTimestamp } from '../../utils/format-date';
import { normalizeStatus } from '../../utils/normalize-status';
import { filterToRecentOnly } from '../../utils/recent-filter';
import type { Coordinates } from '../../types/address';
import type { HappeningItem } from '../../types/happening';

const SERVICE_PATH = 'HostedDatasets/Construction_Permits/FeatureServer/0';
const RADIUS_MILES = 0.5;
const MAX_RECORDS = 50;
const TITLE_MAX_LEN = 60;
const OUT_FIELDS =
  'OBJECTID,PermitNo,IssuedDate,PermitDescription,PhysicalAddress,PermitStatus';

function cleanAddress(raw: unknown): string {
  if (typeof raw !== 'string') return '';
  return raw.trim();
}

function truncateTitle(s: string, maxLen: number): string {
  const t = s.trim();
  if (!t) return 'Building permit';
  if (t.length <= maxLen) return t;
  return t.slice(0, maxLen - 3) + '...';
}

export async function fetchNearbyBuildingPermits(
  coordinates: Coordinates,
): Promise<HappeningItem[]> {
  const features = await queryWithinRadius({
    servicePath: SERVICE_PATH,
    coordinates,
    radiusMiles: RADIUS_MILES,
    outFields: OUT_FIELDS,
    returnGeometry: true,
    maxRecords: MAX_RECORDS,
  });

  const items: HappeningItem[] = features.map((f) => {
    const attrs = f.attributes;
    const ll = extractLatLng(f);
    const distanceMiles = ll
      ? kmToMiles(haversineKm(coordinates.lat, coordinates.lng, ll.lat, ll.lng))
      : 0;
    const raw = attrs.IssuedDate;
    const rawDate: string | number | null =
      raw != null && (typeof raw === 'string' || typeof raw === 'number') ? raw : null;
    const sortTimestamp = parseArcGISDateToTimestamp(rawDate);
    const desc = String(attrs.PermitDescription ?? '').trim();
    const title = truncateTitle(desc, TITLE_MAX_LEN) || 'Building permit';
    const address = cleanAddress(attrs.PhysicalAddress);

    return {
      id: `bp-${String(attrs.PermitNo ?? attrs.OBJECTID ?? Math.random())}`,
      category: 'building-permits',
      title,
      subtitle: address,
      status: normalizeStatus(String(attrs.PermitStatus ?? ''), 'building-permits'),
      dateLabel: formatDateForDisplay(rawDate),
      address,
      rawDate,
      sortTimestamp,
      distanceMiles,
    };
  });

  items.sort(
    (a, b) =>
      b.sortTimestamp - a.sortTimestamp ||
      (a.distanceMiles ?? 0) - (b.distanceMiles ?? 0) ||
      a.id.localeCompare(b.id),
  );

  return filterToRecentOnly(items);
}
