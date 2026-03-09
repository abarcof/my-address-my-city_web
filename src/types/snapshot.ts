export interface ZoningResult {
  code: string;
  description: string;
}

export interface FloodZoneResult {
  zone: string;
  floodway: string;
  isSpecialHazard: boolean;
}

export interface NeighborhoodResult {
  name: string;
}

export interface CouncilDistrictResult {
  district: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
}

export interface ParcelResult {
  parcelId: string;
  owner?: string;
  propertyAddress?: string;
  propertyType?: string;
  assessedValue?: number;
  landAcres?: number;
}

export interface TrashPickupResult {
  schedule: string;
  route?: string;
}
