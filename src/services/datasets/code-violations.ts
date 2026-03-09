import { queryWithinRadius } from '../api/arcgis-client';
import { extractLatLng } from '../../utils/geometry';
import { haversineKm, kmToMiles } from '../../utils/distance';
import { formatDateForDisplay, parseArcGISDateToTimestamp } from '../../utils/format-date';
import { normalizeStatus } from '../../utils/normalize-status';
import { filterToRecentOnly, RECENT_MONTHS } from '../../utils/recent-filter';
import type { Coordinates } from '../../types/address';
import type { HappeningItem } from '../../types/happening';

const SERVICE_PATH = 'HostedDatasets/Code_Violations/FeatureServer/0';
const RADIUS_MILES = 0.5;
const MAX_RECORDS = 50;
const OUT_FIELDS = 'OBJECTID,OffenceNum,CaseDate,CaseType,CaseStatus,Address1';

function getCodeViolationsWhereClause(): string {
  const d = new Date();
  d.setMonth(d.getMonth() - RECENT_MONTHS);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `CaseDate >= DATE '${y}-${m}-${day}'`;
}

function cleanAddress(raw: unknown): string {
  if (typeof raw !== 'string') return '';
  const t = raw.trim();
  return t || '';
}

export async function fetchNearbyCodeViolations(
  coordinates: Coordinates,
): Promise<HappeningItem[]> {
  let features: Awaited<ReturnType<typeof queryWithinRadius>>;
  try {
    features = await queryWithinRadius({
      servicePath: SERVICE_PATH,
      coordinates,
      radiusMiles: RADIUS_MILES,
      outFields: OUT_FIELDS,
      returnGeometry: true,
      maxRecords: MAX_RECORDS,
      where: getCodeViolationsWhereClause(),
    });
  } catch {
    // Fallback if server rejects DATE filter (older ArcGIS)
    features = await queryWithinRadius({
      servicePath: SERVICE_PATH,
      coordinates,
      radiusMiles: RADIUS_MILES,
      outFields: OUT_FIELDS,
      returnGeometry: true,
      maxRecords: MAX_RECORDS,
    });
  }

  const items: HappeningItem[] = features.map((f) => {
    const attrs = f.attributes;
    const ll = extractLatLng(f);
    const distanceMiles = ll
      ? kmToMiles(haversineKm(coordinates.lat, coordinates.lng, ll.lat, ll.lng))
      : 0;
    const raw = attrs.CaseDate;
    const rawDate: string | number | null =
      raw != null && (typeof raw === 'string' || typeof raw === 'number') ? raw : null;
    const sortTimestamp = parseArcGISDateToTimestamp(rawDate);

    return {
      id: `cv-${String(attrs.OffenceNum ?? attrs.OBJECTID ?? Math.random())}`,
      category: 'code-violations',
      title: String(attrs.CaseType ?? 'Code violation').trim() || 'Code violation',
      subtitle: cleanAddress(attrs.Address1),
      status: normalizeStatus(String(attrs.CaseStatus ?? ''), 'code-violations'),
      dateLabel: formatDateForDisplay(rawDate),
      address: cleanAddress(attrs.Address1),
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

  return filterToRecentOnly(items, RECENT_MONTHS);
}
