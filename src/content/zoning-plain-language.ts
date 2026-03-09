/**
 * Resident-friendly plain language for Montgomery zoning codes.
 * B-2 and T5 mean little to citizens; these one-liners explain what's allowed.
 */

export const ZONING_PLAIN_LANGUAGE: Record<string, string> = {
  // Transect / urban
  T1: 'Rural — low density, open space.',
  T2: 'Suburban — single-family homes, low density.',
  T3: 'Neighborhood — houses, small-scale mixed use.',
  T4: 'Urban — mixed residential and commercial.',
  T5: 'Urban center — retail, restaurants, offices, apartments.',
  T6: 'Urban core — denser mixed use, civic buildings.',

  // Business
  'B-1': 'Neighborhood business — small stores, offices, services.',
  'B-2': 'Commercial corridor — retail, restaurants, offices.',
  'B-3': 'General business — broader commercial uses.',
  'B-4': 'Central business — downtown commercial.',

  // Residential
  'R-1': 'Single-family residential — houses only.',
  'R-50': 'Single-family — min 50 ft lot width.',
  'R-65': 'Single-family — min 65 ft lot width.',
  'R-75': 'Single-family — min 75 ft lot width.',
  'R-85': 'Single-family — min 85 ft lot width.',
  'R-100': 'Single-family — min 100 ft lot width.',
  'R-125': 'Single-family — min 125 ft lot width.',

  // Industrial
  'I-1': 'Light industrial — warehouses, light manufacturing.',
  'I-2': 'General industrial — manufacturing, heavy use.',
};

export function getZoningPlainLanguage(code: string): string | undefined {
  const trimmed = code?.trim();
  if (!trimmed) return undefined;
  return ZONING_PLAIN_LANGUAGE[trimmed] ?? ZONING_PLAIN_LANGUAGE[trimmed.toUpperCase()];
}
