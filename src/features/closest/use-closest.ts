import { useQuery } from '@tanstack/react-query';
import { useAddressStore } from '../../store/address-store';
import { fetchNearestPark } from '../../services/datasets/parks';
import { fetchNearestHospital } from '../../services/datasets/hospitals';
import { fetchNearestCommunityCenter } from '../../services/datasets/community-centers';
import type { ClosestCategory, NearestCategoryResult } from '../../types/closest';

const ACTIVE_CATEGORIES: ClosestCategory[] = ['parks', 'community-centers', 'hospitals'];

const CATEGORY_TITLES: Record<ClosestCategory, string> = {
  parks: 'Nearest Park',
  'community-centers': 'Nearest Community Center',
  hospitals: 'Nearest Hospital',
};

const LOADING_MESSAGES: Record<ClosestCategory, string> = {
  parks: 'Finding nearest park...',
  'community-centers': 'Finding nearest community center...',
  hospitals: 'Finding nearest hospital...',
};

async function fetchCategory(
  category: ClosestCategory,
  lat: number,
  lng: number,
): Promise<NearestCategoryResult> {
  const title = CATEGORY_TITLES[category];
  const isAvailable = ACTIVE_CATEGORIES.includes(category);

  if (!isAvailable) {
    return { category, title, item: null, isAvailable: false };
  }

  const coords = { lat, lng };
  let item = null;

  if (category === 'parks') {
    item = await fetchNearestPark(coords);
  } else if (category === 'hospitals') {
    item = await fetchNearestHospital(coords);
  } else if (category === 'community-centers') {
    item = await fetchNearestCommunityCenter(coords);
  }

  return { category, title, item, isAvailable: true };
}

export function useClosest() {
  const coordinates = useAddressStore((s) => s.coordinates);
  const isWithinMontgomery = useAddressStore((s) => s.isWithinMontgomery);

  return useQuery({
    queryKey: ['closest', coordinates?.lat, coordinates?.lng],
    queryFn: async () => {
      if (!coordinates) return { categories: [] };
      const categories: ClosestCategory[] = ['parks', 'community-centers', 'hospitals'];
      const results = await Promise.all(
        categories.map((cat) => fetchCategory(cat, coordinates.lat, coordinates.lng)),
      );
      return { categories: results };
    },
    enabled: coordinates !== null && isWithinMontgomery,
  });
}

export { CATEGORY_TITLES, LOADING_MESSAGES, ACTIVE_CATEGORIES };
