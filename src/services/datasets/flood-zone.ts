import { queryByPoint } from '../api/arcgis-client';
import type { Coordinates } from '../../types/address';
import type { FloodZoneResult } from '../../types/snapshot';

const SERVICE_PATH = 'Capture/GIS_Overlays/MapServer/2';

const FLOOD_ZONE_LABELS: Record<string, string> = {
  'X': 'Zone X (Minimal Risk)',
  'A': 'Zone A (High Risk -- 100-year floodplain)',
  'AE': 'Zone AE (High Risk -- 100-year floodplain)',
  'AH': 'Zone AH (High Risk -- shallow flooding)',
  'AO': 'Zone AO (High Risk -- sheet flow)',
  'VE': 'Zone VE (High Risk -- coastal flood with waves)',
  'V': 'Zone V (High Risk -- coastal flood)',
  'D': 'Zone D (Undetermined Risk)',
  '0.2 PCT ANNUAL CHANCE FLOOD HAZARD': 'Moderate Risk (500-year floodplain)',
  'AREA OF MINIMAL FLOOD HAZARD': 'Zone X (Minimal Risk)',
};

function humanizeFloodZone(rawZone: string): string {
  const trimmed = rawZone.trim().toUpperCase();
  return FLOOD_ZONE_LABELS[trimmed] ?? FLOOD_ZONE_LABELS[rawZone.trim()] ?? rawZone.trim();
}

export async function fetchFloodZone(
  coordinates: Coordinates,
): Promise<FloodZoneResult | null> {
  const feature = await queryByPoint({
    servicePath: SERVICE_PATH,
    coordinates,
    outFields: 'FLD_ZONE,FLOODWAY,SFHA_TF',
  });

  if (!feature) return null;

  const { FLD_ZONE, FLOODWAY, SFHA_TF } = feature.attributes;
  const rawZone = typeof FLD_ZONE === 'string' ? FLD_ZONE.trim() : String(FLD_ZONE ?? '');

  return {
    zone: humanizeFloodZone(rawZone),
    floodway: typeof FLOODWAY === 'string' ? FLOODWAY.trim() : '',
    isSpecialHazard: SFHA_TF === true || SFHA_TF === 'T' || SFHA_TF === 'True',
  };
}
