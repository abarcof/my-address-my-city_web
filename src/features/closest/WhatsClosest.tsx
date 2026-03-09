import { useAddressStore } from '../../store/address-store';
import { useClosest } from './use-closest';
import { ClosestCategoryCard } from '../../components/cards/ClosestCategoryCard';
import { OutOfBoundsNotice } from '../../components/feedback/OutOfBoundsNotice';

export function WhatsClosest() {
  const coordinates = useAddressStore((s) => s.coordinates);
  const isWithinMontgomery = useAddressStore((s) => s.isWithinMontgomery);
  const { data, isPending, isLoading, isError, refetch } = useClosest();

  if (!coordinates) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-gray-500">
          Search for an address or click the map to find nearby parks, community centers, and hospitals.
        </p>
      </div>
    );
  }

  if (!isWithinMontgomery) {
    return (
      <div className="space-y-3">
        <OutOfBoundsNotice />
      </div>
    );
  }

  if ((isPending || isLoading) && !data) {
    return (
      <div className="space-y-3">
        <ClosestCategoryCard
          result={{ category: 'parks', title: 'Nearest Park', item: null, isAvailable: true }}
          isLoading
        />
        <ClosestCategoryCard
          result={{ category: 'community-centers', title: 'Nearest Community Center', item: null, isAvailable: true }}
          isLoading
        />
        <ClosestCategoryCard
          result={{ category: 'hospitals', title: 'Nearest Hospital', item: null, isAvailable: true }}
          isLoading
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-3">
        <ClosestCategoryCard
          result={{ category: 'parks', title: 'Nearest Park', item: null, isAvailable: true }}
          isError
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const categories = data?.categories ?? [];
  if (categories.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-gray-500">No nearby civic places were found for this location.</p>
      </div>
    );
  }

  const visibleCategories = categories.filter((r) => r.isAvailable);

  return (
    <div className="space-y-3">
      {visibleCategories.map((r) => (
        <ClosestCategoryCard
          key={r.category}
          result={r}
          isLoading={isLoading}
          isError={isError}
          onRetry={() => refetch()}
        />
      ))}
    </div>
  );
}
