import type { ArcGISFeature } from '../services/api/arcgis-client';

/**
 * Extract lat/lng from ArcGIS geometry. For points: use x,y directly.
 * For polygons: compute centroid from first ring. outSR=4326 means x=lng, y=lat.
 */
export function extractLatLng(feature: ArcGISFeature): { lat: number; lng: number } | null {
  const g = feature.geometry;
  if (!g) return null;

  if (typeof g.x === 'number' && typeof g.y === 'number') {
    return { lat: g.y, lng: g.x };
  }

  if (g.rings && Array.isArray(g.rings) && g.rings.length > 0) {
    const ring = g.rings[0];
    if (!Array.isArray(ring) || ring.length === 0) return null;
    let sumX = 0;
    let sumY = 0;
    let n = 0;
    for (const pt of ring) {
      if (Array.isArray(pt) && pt.length >= 2) {
        sumX += pt[0];
        sumY += pt[1];
        n++;
      }
    }
    if (n === 0) return null;
    return { lat: sumY / n, lng: sumX / n };
  }

  return null;
}
