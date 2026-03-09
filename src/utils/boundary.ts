import type { Coordinates } from '../types/address';
import boundaryData from '../data/montgomery-city-boundary.json';

type GeoJSONFeature = {
  type: string;
  geometry?: { type: string; coordinates?: number[][][] };
};

type GeoJSON = {
  type: string;
  features?: GeoJSONFeature[];
};

const data = boundaryData as GeoJSON;

function getPolygonCoordinates(): number[][] | null {
  if (!data?.features?.[0]?.geometry?.coordinates) return null;
  const coords = data.features[0].geometry.coordinates[0];
  return Array.isArray(coords) ? coords : null;
}

const polygon = getPolygonCoordinates();

/**
 * Ray-casting point-in-polygon. Returns true if the point is inside the polygon.
 * Uses static Montgomery city boundary from official City Limits layer extent.
 */
export function isWithinMontgomery(coords: Coordinates): boolean {
  if (!polygon || polygon.length < 3) {
    return bboxFallback(coords);
  }
  const { lat, lng } = coords;
  let inside = false;
  const n = polygon.length;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    if (yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

function bboxFallback(coords: Coordinates): boolean {
  const sw: [number, number] = [-86.445884, 32.206711];
  const ne: [number, number] = [-86.069115, 32.481961];
  return coords.lng >= sw[0] && coords.lng <= ne[0] && coords.lat >= sw[1] && coords.lat <= ne[1];
}

export const MONTGOMERY_BOUNDS = {
  southWest: [32.206711, -86.445884] as [number, number],
  northEast: [32.481961, -86.069115] as [number, number],
};
