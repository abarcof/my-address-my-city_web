import { useQuery } from '@tanstack/react-query';
import { useAddressStore } from '../../store/address-store';
import { useNeighborhood } from '../snapshot/use-snapshot';
import { BRIGHT_DATA_ENABLED } from '../../config/feature-flags';
import type { OfficialLiveContextResponse } from '../../types/official-live-context';

const API_BASE = import.meta.env.VITE_API_BASE ?? '';

function buildApiUrl(label: string, neighborhood: string | undefined): string {
  const params = new URLSearchParams();
  if (label) params.set('label', label);
  if (neighborhood) params.set('neighborhood', neighborhood);
  const qs = params.toString();
  const base = (API_BASE ?? '').replace(/\/$/, '');
  const path = base ? `${base}/api/official-live-context` : '/api/official-live-context';
  return `${path}${qs ? `?${qs}` : ''}`;
}

const FETCH_TIMEOUT_MS = 15000;

async function fetchOfficialLiveContext(
  label: string,
  neighborhood: string | undefined
): Promise<OfficialLiveContextResponse> {
  const url = buildApiUrl(label, neighborhood);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) {
      return { items: [], unavailable: true };
    }
    const data = (await res.json()) as OfficialLiveContextResponse;
    return data ?? { items: [] };
  } catch {
    clearTimeout(timeoutId);
    return { items: [], unavailable: true };
  }
}

export function useOfficialLiveContext() {
  const coordinates = useAddressStore((s) => s.coordinates);
  const label = useAddressStore((s) => s.label);
  const isWithinMontgomery = useAddressStore((s) => s.isWithinMontgomery);
  const neighborhoodQuery = useNeighborhood();

  const neighborhood = neighborhoodQuery.data?.name;

  return useQuery({
    queryKey: [
      'official-live-context',
      coordinates?.lat,
      coordinates?.lng,
      label,
      neighborhood,
    ],
    queryFn: () => fetchOfficialLiveContext(label, neighborhood),
    enabled:
      BRIGHT_DATA_ENABLED &&
      coordinates !== null &&
      isWithinMontgomery,
    staleTime: 5 * 60 * 1000,
  });
}
