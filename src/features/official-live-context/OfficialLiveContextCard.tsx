import { useOfficialLiveContext } from './use-official-live-context';
import { LoadingCard } from '../../components/feedback/LoadingCard';
import type { OfficialLiveContextItem } from '../../types/official-live-context';

function OfficialLiveContextCardContent() {
  const { data, isLoading, isError } = useOfficialLiveContext();

  if (isLoading) {
    return <LoadingCard title="Loading official web context..." />;
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4">
        <h3 className="text-sm font-medium text-amber-900">Official Live Context</h3>
        <p className="text-sm text-amber-800 mt-1">
          Official live web context is not available right now.
        </p>
      </div>
    );
  }

  if (data?.unavailable) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 className="text-sm font-medium text-gray-900">Official Live Context</h3>
        <p className="text-sm text-gray-600 mt-1">
          Official live web context is not available right now.
        </p>
      </div>
    );
  }

  const items = data?.items ?? [];

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium text-gray-900">Official Live Context</div>
        </div>
        <p className="text-sm text-gray-500">
          No recent official web updates were found for this location.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-gray-900">Official Live Context</div>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
          Recent updates from official city websites
        </span>
      </div>
      <ul className="space-y-3">
        {items.map((item) => (
          <OfficialLiveContextItemCard key={item.id} item={item} />
        ))}
      </ul>
    </div>
  );
}

function OfficialLiveContextItemCard({ item }: { item: OfficialLiveContextItem }) {
  return (
    <li className="border-l-2 border-blue-200 pl-3 py-1">
      <div className="font-medium text-gray-800 text-sm">{item.title}</div>
      <div className="text-xs text-gray-500 mt-0.5">{item.source}</div>
      {item.summary && (
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.summary}</p>
      )}
      <a
        href={item.url}
        target="_blank"
        rel="noreferrer noopener"
        className="inline-block mt-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium"
      >
        Open official source
      </a>
    </li>
  );
}

export function OfficialLiveContextCard() {
  return (
    <div className="space-y-1">
      <OfficialLiveContextCardContent />
    </div>
  );
}
