import { useMemo } from 'react';
import { useZoning, useFloodZone, useNeighborhood, useCouncilDistrict } from '../snapshot/use-snapshot';
import { APP_CONFIG } from '../../config/app-config';
import { useClosest } from '../closest/use-closest';
import { useHappening } from '../happening/use-happening';
import type { CivicSummaryParts, CivicSummaryState } from '../../types/summary';

function part(text: string | undefined | null, fallback = 'Not available'): string {
  return text?.trim() || fallback;
}

export function useCivicSummary(): CivicSummaryState {
  const zoningQuery = useZoning();
  const floodQuery = useFloodZone();
  const neighborhoodQuery = useNeighborhood();
  const councilQuery = useCouncilDistrict();
  const closestQuery = useClosest();
  const { snapshot } = useHappening();

  const isLoading =
    zoningQuery.isLoading ||
    floodQuery.isLoading ||
    neighborhoodQuery.isLoading ||
    councilQuery.isLoading ||
    closestQuery.isLoading;

  const parts: CivicSummaryParts = useMemo(() => {
    const zoningDesc = zoningQuery.data?.description ?? zoningQuery.data?.code ?? null;
    const floodZone = floodQuery.data?.zone ?? null;
    const neighborhood = neighborhoodQuery.data?.name ?? null;
    const councilDistrict = councilQuery.data?.district ?? null;

    const parkItem = closestQuery.data?.categories?.find((c) => c.category === 'parks')?.item;
    const hospitalItem = closestQuery.data?.categories?.find((c) => c.category === 'hospitals')?.item;

    const totalRecent =
      (snapshot.codeViolations.count ?? 0) +
      (snapshot.buildingPermits.count ?? 0);

    const recentActivity =
      totalRecent > 0
        ? `${totalRecent} recent record${totalRecent === 1 ? '' : 's'} nearby (code violations or permits)`
        : `No recent city activity in the last ${APP_CONFIG.happeningRecencyMonths} months within ${APP_CONFIG.nearbyRadiusLabel}`;

    return {
      zoning: part(zoningDesc),
      flood: part(floodZone),
      neighborhood: part(neighborhood),
      councilDistrict: part(councilDistrict),
      nearestPark: part(parkItem?.name),
      nearestHospital: part(hospitalItem?.name),
      recentActivity,
    };
  }, [zoningQuery.data, floodQuery.data, neighborhoodQuery.data, councilQuery.data, closestQuery.data, snapshot]);

  const hasAnyData = useMemo(() => {
    return (
      zoningQuery.data != null ||
      floodQuery.data != null ||
      neighborhoodQuery.data != null ||
      councilQuery.data != null ||
      (closestQuery.data?.categories?.some((c) => c.item != null) ?? false) ||
      snapshot.codeViolations.count > 0 ||
      snapshot.buildingPermits.count > 0
    );
  }, [
    zoningQuery.data,
    floodQuery.data,
    neighborhoodQuery.data,
    councilQuery.data,
    closestQuery.data,
    snapshot,
  ]);

  return {
    parts,
    isLoading,
    hasAnyData,
  };
}
