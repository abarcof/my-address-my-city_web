/**
 * Lightweight white-label configuration
 * Centralizes city-specific values for replicability to other cities.
 */

export const APP_CONFIG = {
  /** City name for display and copy */
  cityName: 'Montgomery',
  cityFullName: 'Montgomery, Alabama',

  /** Default map center (WGS84) */
  defaultCenter: {
    lat: 32.3668,
    lng: -86.3,
  },

  /** Radius for "nearby" queries in miles */
  nearbyRadiusMiles: 0.5,

  /** Label for radius in UI */
  nearbyRadiusLabel: 'approximately 0.5 miles',

  /** ArcGIS server base (for documentation; services use full URLs) */
  arcgisBaseUrl: 'https://gis.montgomeryal.gov/server/rest/services',

  /** Boundary source (path to GeoJSON; point-in-polygon check) */
  boundarySource: 'City Limits from Montgomery GIS',

  /** Official city links for Next Steps */
  nextStepsLinks: [
    {
      title: 'Report a city issue',
      description:
        'Report non-emergency city concerns such as potholes, overgrown lots, graffiti, and similar issues.',
      url: 'https://www.montgomeryal.gov/residents/report-an-issue',
    },
    {
      title: 'Apply for permits',
      description:
        'Start or manage permit and inspection processes for building, renovation, repair, or construction work.',
      url: 'https://capture.montgomeryal.gov/',
    },
    {
      title: 'Request public records',
      description:
        'Request official city records related to permits, code issues, or address-based documentation.',
      url: 'https://www.montgomeryal.gov/government/city-government/city-departments/city-clerk-s-office/request-for-public-records',
    },
    {
      title: 'Stay informed',
      description:
        'View official city news, notices, and public updates.',
      url: 'https://www.montgomeryal.gov/government/stay-informed',
    },
  ],

  /** Active What's Closest categories */
  closestCategories: ['parks', 'community-centers', 'hospitals'] as const,

  /** Recency filter: months of records to show */
  happeningRecencyMonths: 12,
} as const;

export type AppConfig = typeof APP_CONFIG;
