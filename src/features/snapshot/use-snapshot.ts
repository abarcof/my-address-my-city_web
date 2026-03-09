import { useQuery } from '@tanstack/react-query';
import { useAddressStore } from '../../store/address-store';
import { fetchZoning } from '../../services/datasets/zoning';
import { fetchFloodZone } from '../../services/datasets/flood-zone';
import { fetchNeighborhood } from '../../services/datasets/neighborhoods';
import { fetchCouncilDistrict } from '../../services/datasets/council';
import { fetchParcel } from '../../services/datasets/parcels';
import { fetchTrashPickup } from '../../services/datasets/trash-schedule';

export function useZoning() {
  const coordinates = useAddressStore((s) => s.coordinates);
  const isWithinMontgomery = useAddressStore((s) => s.isWithinMontgomery);

  return useQuery({
    queryKey: ['zoning', coordinates?.lat, coordinates?.lng],
    queryFn: () => fetchZoning(coordinates!),
    enabled: coordinates !== null && isWithinMontgomery,
  });
}

export function useFloodZone() {
  const coordinates = useAddressStore((s) => s.coordinates);
  const isWithinMontgomery = useAddressStore((s) => s.isWithinMontgomery);

  return useQuery({
    queryKey: ['flood-zone', coordinates?.lat, coordinates?.lng],
    queryFn: () => fetchFloodZone(coordinates!),
    enabled: coordinates !== null && isWithinMontgomery,
  });
}

export function useNeighborhood() {
  const coordinates = useAddressStore((s) => s.coordinates);
  const isWithinMontgomery = useAddressStore((s) => s.isWithinMontgomery);

  return useQuery({
    queryKey: ['neighborhood', coordinates?.lat, coordinates?.lng],
    queryFn: () => fetchNeighborhood(coordinates!),
    enabled: coordinates !== null && isWithinMontgomery,
  });
}

export function useCouncilDistrict() {
  const coordinates = useAddressStore((s) => s.coordinates);
  const isWithinMontgomery = useAddressStore((s) => s.isWithinMontgomery);

  return useQuery({
    queryKey: ['council-district', coordinates?.lat, coordinates?.lng],
    queryFn: () => fetchCouncilDistrict(coordinates!),
    enabled: coordinates !== null && isWithinMontgomery,
  });
}

export function useParcel() {
  const coordinates = useAddressStore((s) => s.coordinates);
  const isWithinMontgomery = useAddressStore((s) => s.isWithinMontgomery);

  return useQuery({
    queryKey: ['parcel', coordinates?.lat, coordinates?.lng],
    queryFn: () => fetchParcel(coordinates!),
    enabled: coordinates !== null && isWithinMontgomery,
  });
}

export function useTrashPickup() {
  const coordinates = useAddressStore((s) => s.coordinates);
  const isWithinMontgomery = useAddressStore((s) => s.isWithinMontgomery);

  return useQuery({
    queryKey: ['trash-pickup', coordinates?.lat, coordinates?.lng],
    queryFn: () => fetchTrashPickup(coordinates!),
    enabled: coordinates !== null && isWithinMontgomery,
  });
}
