import { useZoning, useFloodZone, useNeighborhood, useCouncilDistrict, useParcel, useTrashPickup } from './use-snapshot';
import { getZoningPlainLanguage } from '../../content/zoning-plain-language';
import { InfoCard } from '../../components/cards/InfoCard';
import { LoadingCard } from '../../components/feedback/LoadingCard';
import { ErrorCard } from '../../components/feedback/ErrorCard';
import { EmptyCard } from '../../components/feedback/EmptyCard';
import { OutOfBoundsNotice } from '../../components/feedback/OutOfBoundsNotice';
import { useAddressStore } from '../../store/address-store';

function ZoningCard() {
  const { data, isLoading, isError, refetch } = useZoning();

  if (isLoading) return <LoadingCard title="Zoning" />;
  if (isError) return <ErrorCard title="Zoning" onRetry={() => refetch()} />;
  if (!data) return <EmptyCard title="Zoning" />;

  const plainLanguage = getZoningPlainLanguage(data.code);

  return (
    <InfoCard title="Zoning" subtitle={data.description} badge={data.code} badgeColor="blue">
      {plainLanguage && <p className="text-gray-600 mt-1">{plainLanguage}</p>}
    </InfoCard>
  );
}

const FLOOD_MITIGATION_LINK =
  'https://www.montgomeryal.gov/government/city-government/city-departments/engineering-environmental-services/flood-mitigation-and-determination';

function FloodCard() {
  const { data, isLoading, isError, refetch } = useFloodZone();

  if (isLoading) return <LoadingCard title="Flood Risk" />;
  if (isError) return <ErrorCard title="Flood Risk" onRetry={() => refetch()} />;
  if (!data) return <EmptyCard title="Flood Risk" />;

  return (
    <InfoCard
      title="Flood Risk"
      subtitle={data.zone}
      badge={data.isSpecialHazard ? 'High risk' : 'Minimal risk'}
      badgeColor={data.isSpecialHazard ? 'amber' : 'green'}
    >
      <div className="space-y-1">
        {data.floodway && <p>Floodway: {data.floodway}</p>}
        <a
          href={FLOOD_MITIGATION_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-blue-600 hover:text-blue-800 underline text-sm"
        >
          Learn about flood mitigation and determination
        </a>
      </div>
    </InfoCard>
  );
}

function NeighborhoodCard() {
  const { data, isLoading, isError, refetch } = useNeighborhood();

  if (isLoading) return <LoadingCard title="Neighborhood" />;
  if (isError) return <ErrorCard title="Neighborhood" onRetry={() => refetch()} />;
  if (!data) return <EmptyCard title="Neighborhood" message="No registered neighborhood association was found for this location." />;

  return <InfoCard title="Neighborhood" subtitle={data.name} />;
}

const COUNCIL_EMPTY_MESSAGE = 'Council district information is not available for this location.';

function CouncilDistrictCard() {
  const { data, isLoading, isError } = useCouncilDistrict();

  if (isLoading) return <LoadingCard title="City Council District" />;
  if (isError || !data) {
    return <EmptyCard title="City Council District" message={COUNCIL_EMPTY_MESSAGE} />;
  }

  return (
    <InfoCard title="City Council District" subtitle={`District ${data.district}`}>
      <div className="space-y-1 text-sm">
        {data.contactName && <p>Council Member: {data.contactName}</p>}
        {data.contactPhone && (
          <p>
            Phone:{' '}
            <a href={`tel:${data.contactPhone}`} className="text-blue-600 hover:text-blue-800 underline">
              {data.contactPhone}
            </a>
          </p>
        )}
        {data.contactEmail && (
          <p>
            Email:{' '}
            <a href={`mailto:${data.contactEmail}`} className="text-blue-600 hover:text-blue-800 underline">
              {data.contactEmail}
            </a>
          </p>
        )}
      </div>
    </InfoCard>
  );
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function ParcelCard() {
  const { data, isLoading, isError, refetch } = useParcel();

  if (isLoading) return <LoadingCard title="Property Record" />;
  if (isError) return <ErrorCard title="Property Record" onRetry={() => refetch()} />;
  if (!data) return <EmptyCard title="Property Record" message="Property record is not available for this location." />;

  return (
    <InfoCard title="Property Record" subtitle={data.parcelId}>
      <div className="space-y-1.5">
        {data.propertyType && <p>Type: {data.propertyType}</p>}
        {data.owner && <p>Owner: {data.owner}</p>}
        {data.propertyAddress && <p>Address: {data.propertyAddress}</p>}
        {data.assessedValue !== undefined && (
          <p>Assessed value: {formatCurrency(data.assessedValue)}</p>
        )}
        {data.landAcres !== undefined && (
          <p>Land area: {data.landAcres.toFixed(1)} acres</p>
        )}
        <a
          href="https://montgomery.capturecama.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-blue-600 hover:text-blue-800 underline text-sm mt-2"
        >
          View county property records (taxes, deeds)
        </a>
      </div>
    </InfoCard>
  );
}

function TrashPickupCard() {
  const { data, isLoading, isError, refetch } = useTrashPickup();

  if (isLoading) return <LoadingCard title="Trash & Recycling Schedule" />;
  if (isError) return <ErrorCard title="Trash & Recycling Schedule" onRetry={() => refetch()} />;
  if (!data) return <EmptyCard title="Trash & Recycling Schedule" message="Trash and recycling schedule is not available for this location." />;

  return (
    <InfoCard
      title="Trash & Recycling Schedule"
      subtitle={data.schedule}
      badge={data.route}
      badgeColor="gray"
    />
  );
}

export function ThisAddress() {
  const coordinates = useAddressStore((s) => s.coordinates);
  const label = useAddressStore((s) => s.label);
  const isWithinMontgomery = useAddressStore((s) => s.isWithinMontgomery);
  if (!coordinates) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-gray-500">
          Search for an address or click the map to see key city information for a location.
        </p>
      </div>
    );
  }

  if (!isWithinMontgomery) {
    return (
      <div className="space-y-3">
        {label && (
          <p className="text-xs text-gray-500 truncate" title={label}>{label}</p>
        )}
        <OutOfBoundsNotice />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <ZoningCard />
      <FloodCard />
      <NeighborhoodCard />
      <CouncilDistrictCard />
      <ParcelCard />
      <TrashPickupCard />
    </div>
  );
}
