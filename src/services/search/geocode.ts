import type { Coordinates } from '../../types/address';

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}

interface NominatimReverseResult {
  display_name: string;
  address?: {
    road?: string;
    house_number?: string;
    city?: string;
    state?: string;
  };
}

export interface GeocodeResult {
  coordinates: Coordinates;
  label: string;
}

const NOMINATIM_HEADERS = {
  'User-Agent': 'MyAddressMyCity/1.0 (hackathon project)',
};

export async function geocode(address: string): Promise<GeocodeResult | null> {
  const params = new URLSearchParams({
    q: address,
    format: 'json',
    limit: '1',
    countrycodes: 'us',
  });

  const url = `https://nominatim.openstreetmap.org/search?${params}`;

  const response = await fetch(url, { headers: NOMINATIM_HEADERS });

  if (!response.ok) {
    throw new Error(`Geocoding failed: ${response.status}`);
  }

  const results: NominatimResult[] = await response.json();

  if (results.length === 0) return null;

  const first = results[0];

  return {
    coordinates: {
      lat: parseFloat(first.lat),
      lng: parseFloat(first.lon),
    },
    label: first.display_name,
  };
}

export async function reverseGeocode(coordinates: Coordinates): Promise<string> {
  const fallback = `${coordinates.lat.toFixed(5)}, ${coordinates.lng.toFixed(5)}`;

  try {
    const params = new URLSearchParams({
      lat: String(coordinates.lat),
      lon: String(coordinates.lng),
      format: 'json',
      zoom: '18',
    });

    const url = `https://nominatim.openstreetmap.org/reverse?${params}`;
    const response = await fetch(url, { headers: NOMINATIM_HEADERS });

    if (!response.ok) return fallback;

    const result: NominatimReverseResult = await response.json();

    if (result.address) {
      const { house_number, road, city } = result.address;
      const parts = [house_number, road, city].filter(Boolean);
      if (parts.length >= 2) return parts.join(', ');
    }

    if (result.display_name) {
      const short = result.display_name.split(',').slice(0, 3).join(',').trim();
      return short || fallback;
    }

    return fallback;
  } catch {
    return fallback;
  }
}
