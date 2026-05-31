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
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="text-sm font-semibold text-slate-600 mb-1">{result.title}</div>
        <p className="text-sm text-slate-400">This category is not available right now.</p>
      </div>
    );
  }
  if (!result.item) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="text-sm font-semibold text-slate-600 mb-1">{result.title}</div>
        <p className="text-sm text-slate-400">
          No nearby {result.category.replace('-', ' ')} was found from the current dataset.
        </p>
      </div>
    );
  }

  const { name, distanceLabel, address, lat, lng } = result.item;
  const displayName = sanitizeDisplayName(name, result.category);
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
      <div className="text-sm font-semibold text-slate-950">{result.title}</div>
      <p className="text-sm font-medium text-slate-700 mt-1">{displayName}</p>
      <p className="text-xs text-slate-500 mt-1.5">
        Approximate distance: {distanceLabel}
      </p>
      {address && (
        <p className="text-xs text-slate-400 mt-0.5">{address}</p>
      )}
      <a
        href={directionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-100 transition hover:bg-blue-100"
      >
        Get directions
      </a>
    </div>
  );
}
