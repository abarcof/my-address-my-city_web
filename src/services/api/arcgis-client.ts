const BASE_URL = 'https://gis.montgomeryal.gov/server/rest/services';

export interface ArcGISQueryOptions {
  servicePath: string;
  coordinates: { lat: number; lng: number };
  outFields?: string;
}

export interface ArcGISFeature {
  attributes: Record<string, unknown>;
  geometry?: { x?: number; y?: number; rings?: number[][][] };
}

interface ArcGISQueryResponse {
  features?: ArcGISFeature[];
  error?: { message: string };
}

export interface QueryWithinRadiusOptions {
  servicePath: string;
  coordinates: { lat: number; lng: number };
  radiusMiles: number;
  outFields?: string;
  returnGeometry?: boolean;
  maxRecords?: number;
  /** Optional WHERE clause (e.g. for date filters). Combined with spatial filter. */
  where?: string;
}

export async function queryByPoint(
  options: ArcGISQueryOptions,
): Promise<ArcGISFeature | null> {
  const { servicePath, coordinates, outFields = '*' } = options;

  const params = new URLSearchParams({
    where: '1=1',
    geometry: JSON.stringify({ x: coordinates.lng, y: coordinates.lat }),
    geometryType: 'esriGeometryPoint',
    inSR: '4326',
    spatialRel: 'esriSpatialRelIntersects',
    outFields,
    returnGeometry: 'false',
    outSR: '4326',
    f: 'json',
  });

  const url = `${BASE_URL}/${servicePath}/query?${params}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`ArcGIS request failed: ${response.status}`);
  }

  const data: ArcGISQueryResponse = await response.json();

  if (data.error) {
    throw new Error(`ArcGIS error: ${data.error.message}`);
  }

  if (!data.features || data.features.length === 0) {
    return null;
  }

  return data.features[0];
}

/**
 * Query features within a radius of a point. Used for nearest-by-category lookups.
 * Returns features with geometry for distance computation (point or polygon centroid).
 */
export async function queryWithinRadius(
  options: QueryWithinRadiusOptions,
): Promise<ArcGISFeature[]> {
  const {
    servicePath,
    coordinates,
    radiusMiles,
    outFields = '*',
    returnGeometry = true,
    maxRecords = 200,
    where: whereClause,
  } = options;

  const where = whereClause ?? '1=1';
  const params = new URLSearchParams({
    where,
    geometry: JSON.stringify({ x: coordinates.lng, y: coordinates.lat }),
    geometryType: 'esriGeometryPoint',
    inSR: '4326',
    spatialRel: 'esriSpatialRelIntersects',
    distance: String(radiusMiles),
    units: 'esriSRUnit_StatuteMile',
    outFields,
    returnGeometry: String(returnGeometry),
    outSR: '4326',
    resultRecordCount: String(maxRecords),
    f: 'json',
  });

  const url = `${BASE_URL}/${servicePath}/query?${params}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`ArcGIS request failed: ${response.status}`);
  }

  const data: ArcGISQueryResponse = await response.json();

  if (data.error) {
    throw new Error(`ArcGIS error: ${data.error.message}`);
  }

  return data.features ?? [];
}
