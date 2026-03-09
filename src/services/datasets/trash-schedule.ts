import { queryByPoint } from '../api/arcgis-client';
import type { Coordinates } from '../../types/address';
import type { TrashPickupResult } from '../../types/snapshot';

const SERVICE_PATH = 'QAlert/QAlert_311/MapServer/6';

export async function fetchTrashPickup(
  coordinates: Coordinates,
): Promise<TrashPickupResult | null> {
  const feature = await queryByPoint({
    servicePath: SERVICE_PATH,
    coordinates,
    outFields: 'Day_1,Day_2',
  });

  if (!feature) return null;

  const { Day_1, Day_2 } = feature.attributes;

  const d1 = typeof Day_1 === 'string' ? Day_1.trim() : '';
  const d2 = typeof Day_2 === 'string' ? Day_2.trim() : '';

  const parts = [d1, d2].filter(Boolean);
  if (parts.length === 0) return null;

  const schedule = parts.join(' & ');
  if (!schedule) return null;

  return {
    schedule,
  };
}
