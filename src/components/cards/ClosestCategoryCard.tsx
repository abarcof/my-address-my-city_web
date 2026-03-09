import type { NearestCategoryResult } from '../../types/closest';
import { LoadingCard } from '../feedback/LoadingCard';
import { ErrorCard } from '../feedback/ErrorCard';

const FALLBACK_NAMES: Record<string, string> = {
  parks: 'Nearest Park',
  'community-centers': 'Nearest Community Center',
  hospitals: 'Nearest Hospital',
};

function sanitizeDisplayName(name: string, category: string): string {
  const t = name.trim();
  const fallback = FALLBACK_NAMES[category] ?? 'Nearest';
  if (!t) return fallback;
  if (/https?:\/\//i.test(t) || /www\./i.test(t) || /\.(com|org|gov|net)(\/|$)/i.test(t)) {
    const match = t.match(/\/([a-z0-9-]+)(?:\?|$)/i);
    if (match) {
      const slug = match[1].replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      if (slug.length >= 3) return slug;
    }
    return fallback;
  }
  return t;
}

interface ClosestCategoryCardProps {
  result: NearestCategoryResult;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

export function ClosestCategoryCard({
  result,
  isLoading,
  isError,
  onRetry,
}: ClosestCategoryCardProps) {
  const loadingTitles: Record<string, string> = {
    parks: 'Finding nearest park...',
    'community-centers': 'Finding nearest community center...',
    hospitals: 'Finding nearest hospital...',
  };
  if (isLoading) {
    return <LoadingCard title={loadingTitles[result.category] ?? result.title} />;
  }
  if (isError) {
    return <ErrorCard title={result.title} onRetry={onRetry} />;
  }
  if (!result.isAvailable) {
    return (
      <div className="rounded-lg border border-gray-200 p-4">
        <div className="text-sm font-medium text-gray-500 mb-1">{result.title}</div>
        <p className="text-sm text-gray-400">This category is not available right now.</p>
      </div>
    );
  }
  if (!result.item) {
    return (
      <div className="rounded-lg border border-gray-200 p-4">
        <div className="text-sm font-medium text-gray-500 mb-1">{result.title}</div>
        <p className="text-sm text-gray-400">
          No nearby {result.category.replace('-', ' ')} was found from the current dataset.
        </p>
      </div>
    );
  }

  const { name, distanceLabel, address, lat, lng } = result.item;
  const displayName = sanitizeDisplayName(name, result.category);
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <div className="text-sm font-medium text-gray-900">{result.title}</div>
      <p className="text-sm text-gray-700 mt-0.5">{displayName}</p>
      <p className="text-xs text-gray-500 mt-1">
        Approximate distance: {distanceLabel}
      </p>
      {address && (
        <p className="text-xs text-gray-400 mt-0.5">{address}</p>
      )}
      <a
        href={directionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-blue-600 mt-1 inline-block hover:underline"
      >
        Get directions
      </a>
    </div>
  );
}
