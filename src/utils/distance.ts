/**
 * Haversine formula: straight-line distance between two points on Earth.
 * Returns distance in kilometers. Use for approximate/straight-line distance only.
 */
export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function kmToMiles(km: number): number {
  return km * 0.621371;
}

/**
 * Format distance for resident-facing display.
 * Primary: miles. Rounds to 1 decimal for values >= 0.1 mi, 2 decimals for smaller.
 */
export function formatDistanceLabel(km: number): string {
  const miles = kmToMiles(km);
  if (miles >= 10) {
    return `${Math.round(miles)} mi`;
  }
  if (miles >= 0.1) {
    return `${miles.toFixed(1)} mi`;
  }
  return `${miles.toFixed(2)} mi`;
}
