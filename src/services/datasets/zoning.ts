import { queryByPoint } from '../api/arcgis-client';
import type { Coordinates } from '../../types/address';
import type { ZoningResult } from '../../types/snapshot';

const SERVICE_PATH = 'Zoning/FeatureServer/0';

export async function fetchZoning(
  coordinates: Coordinates,
): Promise<ZoningResult | null> {
  const feature = await queryByPoint({
    servicePath: SERVICE_PATH,
    coordinates,
    outFields: 'ZoningCode,ZoningDesc',
  });

  if (!feature) return null;

  const { ZoningCode, ZoningDesc } = feature.attributes;

  if (typeof ZoningCode !== 'string' || typeof ZoningDesc !== 'string') {
    return null;
  }

  return {
    code: ZoningCode,
    description: ZoningDesc,
  };
}
