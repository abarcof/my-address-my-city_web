import { useOfficialLiveContext } from './use-official-live-context';
import type { OfficialLiveContextItem } from '../../types/official-live-context';

function OfficialLiveContextCardContent() {
  const { data, isLoading, isError } = useOfficialLiveContext();

  if (isLoading) {
    return (
      <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-blue-900">Bright Data — Official Live Context</h3>
          <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded">Searching…</span>
        </div>
        <p className="text-sm text-blue-700 mt-1">
          Searching official city websites for public notices, permits, and recent updates…
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4">
        <h3 className="text-sm font-medium text-amber-900">Bright Data — Official Live Context</h3>
        <p className="text-sm text-amber-800 mt-1">
          Not available right now. Try again later or check your connection.
        </p>
      </div>
    );
  }

  if (data?.unavailable) {
    return (
      <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4">
        <h3 className="text-sm font-medium text-blue-900">Bright Data — Official Live Context</h3>
        <p className="text-sm text-blue-700 mt-1">
          Live search of official city websites — public notices, permit updates, recent news. Configure <code className="text-xs bg-blue-100 px-1 rounded">BRIGHTDATA_API_KEY</code> in Vercel. For local dev, see docs/BRIGHT_DATA_LOCAL_SETUP.md.
        </p>
      </div>
    );
  }

  const items = data?.items ?? [];

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium text-gray-900">Bright Data — Official Live Context</div>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">No results</span>
        </div>
        <p className="text-sm text-gray-500">
          No matching pages found in the live search of official city websites for this location.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-gray-900">Bright Data — Official Live Context</div>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
          Live search results from official city websites
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
