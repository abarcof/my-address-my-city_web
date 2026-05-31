import { useState } from 'react';
import type { HappeningItem, HappeningCategoryState } from '../../types/happening';
import type { HappeningCategory } from '../../types/happening';
import { LoadingCard } from '../feedback/LoadingCard';
import { ErrorCard } from '../feedback/ErrorCard';
import { formatRelativeTime, formatDateForDisplay } from '../../utils/format-date';

const VISIBLE_COUNT = 5;

const CATEGORY_STYLES: Record<
  string,
  { borderColor: string; icon: string; emptyMonths: string }
> = {
  'code-violations': {
    borderColor: 'border-l-[#dc2626]',
    icon: '🔴',
    emptyMonths: '12',
  },
  'building-permits': {
    borderColor: 'border-l-[#2563eb]',
    icon: '🔵',
    emptyMonths: '12',
  },
};

function getStatusBadgeClass(status: string): string {
  const s = status.toLowerCase();
  if (s === 'resolved') return 'bg-green-100 text-green-800';
  if (s === 'closed' || s === 'completed') return 'bg-gray-100 text-gray-700';
  if (s === 'issued' || s === 'approved') return 'bg-blue-100 text-blue-800';
  if (s === 'open' || s === 'active' || s === 'pending' || s === 'received') {
    return 'bg-amber-100 text-amber-800';
  }
  return 'bg-gray-100 text-gray-600';
}

interface HappeningCategoryCardProps {
  category: HappeningCategory;
  label: string;
  count: number;
  items: HappeningItem[];
  state: HappeningCategoryState;
  loadingMessage: string;
  emptyMessage: string;
  errorMessage: string;
  onRetry?: () => void;
}

export function HappeningCategoryCard({
  category,
  label,
  count,
  items,
  state,
  loadingMessage,
  emptyMessage,
  errorMessage,
  onRetry,
}: HappeningCategoryCardProps) {
  const [expanded, setExpanded] = useState(false);
  const styles = CATEGORY_STYLES[category] ?? CATEGORY_STYLES['code-violations'];
  const emptyMonths = styles.emptyMonths;

  if (state === 'loading') {
    return <LoadingCard title={loadingMessage} />;
  }

  if (state === 'error') {
    return <ErrorCard title={errorMessage} onRetry={onRetry} />;
  }

  const hasRecords = items.length > 0;
  const visibleCount = expanded ? items.length : Math.min(VISIBLE_COUNT, items.length);
  const visibleItems = items.slice(0, visibleCount);
  const remainingCount = items.length - visibleCount;

  return (
    <div
      className={`overflow-hidden rounded-xl border border-slate-200 border-l-4 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${styles.borderColor}`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-sm font-semibold text-slate-950">
            {label} <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">{count}</span>
          </span>
        </div>

        {!hasRecords ? (
          <div className="py-1.5 flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-100"
              role="status"
            >
              <span aria-hidden>✓</span>
              None in the last {emptyMonths} months
            </span>
            <span className="text-xs text-slate-400">{emptyMessage}</span>
          </div>
        ) : (
          <>
            <ul className="space-y-2">
              {visibleItems.map((item) => (
                <li key={item.id} className="rounded-lg bg-slate-50/70 p-2.5 text-sm ring-1 ring-slate-100">
                  <div className="font-semibold text-slate-950">
                    {item.address || item.subtitle || 'Address not available'}
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    {item.title}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1">
                    <span
                      className={`inline-flex px-1.5 py-0.5 rounded text-xs font-medium ${getStatusBadgeClass(item.status)}`}
                    >
                      {item.status}
                    </span>
                    <span
                      className="text-xs text-slate-500"
                      title={formatDateForDisplay(item.rawDate)}
                    >
                      {formatRelativeTime(item.rawDate)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            {remainingCount > 0 && !expanded && (
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
              >
                Show {remainingCount} more
              </button>
            )}

            {count > 10 && (
              <p className="mt-2 text-xs text-slate-500">
                Showing {visibleCount} of {count}{' '}
                <a
                  href="https://opendata.montgomeryal.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-slate-600"
                >
                  view all ↗
                </a>
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
