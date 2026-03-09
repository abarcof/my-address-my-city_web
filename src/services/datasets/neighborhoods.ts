import { queryByPoint } from '../api/arcgis-client';
import type { Coordinates } from '../../types/address';
import type { NeighborhoodResult } from '../../types/snapshot';

const SERVICE_PATH = 'NSD_Neighborhoods/FeatureServer/0';

export async function fetchNeighborhood(
  coordinates: Coordinates,
): Promise<NeighborhoodResult | null> {
  const feature = await queryByPoint({
    servicePath: SERVICE_PATH,
    coordinates,
    outFields: 'NEIGHBRHD',
  });

  if (!feature) return null;

  const { NEIGHBRHD } = feature.attributes;

  if (typeof NEIGHBRHD !== 'string' || NEIGHBRHD.trim() === '') {
    return null;
  }

  return {
    name: NEIGHBRHD,
  };
}
