/**
 * Civic Snapshot Summary — composed from validated data only (no generative AI)
 */

export interface CivicSummaryParts {
  zoning: string;
  flood: string;
  neighborhood: string;
  councilDistrict: string;
  nearestPark: string;
  nearestHospital: string;
  recentActivity: string;
}

export interface CivicSummaryState {
  parts: CivicSummaryParts;
  isLoading: boolean;
  hasAnyData: boolean;
}
