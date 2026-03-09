export interface Coordinates {
  lat: number;
  lng: number;
}

export interface AddressSelection {
  coordinates: Coordinates;
  label: string;
}
