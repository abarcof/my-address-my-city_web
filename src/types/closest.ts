export type ClosestCategory = 'parks' | 'community-centers' | 'hospitals';

export interface NearestPlace {
  id: string;
  category: ClosestCategory;
  name: string;
  lat: number;
  lng: number;
  distanceKm: number;
  distanceMiles: number;
  distanceLabel: string;
  address?: string;
}

export interface NearestCategoryResult {
  category: ClosestCategory;
  title: string;
  item: NearestPlace | null;
  isAvailable: boolean;
}

export interface ClosestSnapshot {
  categories: NearestCategoryResult[];
}

export interface ClosestMarker {
  id: string;
  category: ClosestCategory;
  name: string;
  lat: number;
  lng: number;
}
