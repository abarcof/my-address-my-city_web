import { useQuery } from '@tanstack/react-query';
import { useAddressStore } from '../../store/address-store';
import { fetchNearbyCodeViolations } from '../../services/datasets/code-violations';
import { fetchNearbyBuildingPermits } from '../../services/datasets/building-permits';
import type {
  HappeningCategoryResult,
  HappeningSnapshot,
  HappeningCategoryState,
} from '../../types/happening';

function toCategoryResult(
  items: Awaited<ReturnType<typeof fetchNearbyCodeViolations>>,
  label: string,
  state: HappeningCategoryState,
  errorMessage?: string,
): HappeningCategoryResult {
  return {
    label,
    count: items.length,
    items,
    state,
    errorMessage,
  };
}

export function useHappening() {
  const coordinates = useAddressStore((s) => s.coordinates);
  const isWithinMontgomery = useAddressStore((s) => s.isWithinMontgomery);
  const enabled = coordinates !== null && isWithinMontgomery;
  const lat = coordinates?.lat ?? 0;
  const lng = coordinates?.lng ?? 0;

  const codeViolationsQuery = useQuery({
    queryKey: ['happening', 'code-violations', lat, lng],
    queryFn: () => fetchNearbyCodeViolations({ lat, lng }),
    enabled,
  });

  const buildingPermitsQuery = useQuery({
    queryKey: ['happening', 'building-permits', lat, lng],
    queryFn: () => fetchNearbyBuildingPermits({ lat, lng }),
    enabled,
  });

  const codeViolations: HappeningCategoryResult = (() => {
    if (codeViolationsQuery.isLoading || (codeViolationsQuery.isPending && !codeViolationsQuery.data))
      return toCategoryResult([], 'Code Violations', 'loading');
    if (codeViolationsQuery.isError)
      return toCategoryResult(
        [],
        'Code Violations',
        'error',
        codeViolationsQuery.error instanceof Error
          ? codeViolationsQuery.error.message
          : 'Failed to load',
      );
    const items = codeViolationsQuery.data ?? [];
    return toCategoryResult(items, 'Code Violations', items.length ? 'success' : 'empty');
  })();

  const buildingPermits: HappeningCategoryResult = (() => {
    if (buildingPermitsQuery.isLoading || (buildingPermitsQuery.isPending && !buildingPermitsQuery.data))
      return toCategoryResult([], 'Building Permits', 'loading');
    if (buildingPermitsQuery.isError)
      return toCategoryResult(
        [],
        'Building Permits',
        'error',
        buildingPermitsQuery.error instanceof Error
          ? buildingPermitsQuery.error.message
          : 'Failed to load',
      );
    const items = buildingPermitsQuery.data ?? [];
    return toCategoryResult(items, 'Building Permits', items.length ? 'success' : 'empty');
  })();

  const snapshot: HappeningSnapshot = {
    codeViolations,
    buildingPermits,
  };

  const refetchAll = () => {
    codeViolationsQuery.refetch();
    buildingPermitsQuery.refetch();
  };

  return {
    snapshot,
    refetchAll,
    refetchCodeViolations: () => codeViolationsQuery.refetch(),
    refetchBuildingPermits: () => buildingPermitsQuery.refetch(),
  };
}
