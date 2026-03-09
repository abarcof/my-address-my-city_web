import { useCivicSummary } from './use-civic-summary';

export function CivicSnapshotSummary() {
  const { parts, isLoading, hasAnyData } = useCivicSummary();

  if (isLoading && !hasAnyData) {
    return (
      <div
        className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-500"
        role="status"
        aria-live="polite"
      >
        Loading snapshot...
      </div>
    );
  }

  const highlights: string[] = [];
  if (parts.zoning !== 'Not available') highlights.push(parts.zoning);
  if (parts.flood !== 'Not available') highlights.push(parts.flood);
  if (parts.neighborhood !== 'Not available') highlights.push(parts.neighborhood);

  const summaryText =
    highlights.length > 0
      ? highlights.slice(0, 3).join(' · ')
      : 'Select a location within Montgomery to see a snapshot.';

  return (
    <div
      className="rounded-lg border border-gray-200 bg-blue-50/50 px-3 py-2.5 text-sm text-gray-800"
      role="region"
      aria-label="Civic snapshot summary"
    >
      <p className="leading-snug">{summaryText}</p>
    </div>
  );
}
