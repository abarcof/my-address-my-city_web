import { useAddressStore } from '../../store/address-store';
import { useCivicSummary } from './use-civic-summary';

function formatAddressLine(label: string, coordinates: { lat: number; lng: number } | null): string {
  const trimmed = label.trim();
  if (trimmed) return trimmed;
  if (coordinates) {
    return `${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)}`;
  }
  return '';
}

export function CivicSnapshotSummary() {
  const label = useAddressStore((s) => s.label);
  const coordinates = useAddressStore((s) => s.coordinates);
  const { parts, isLoading, hasAnyData } = useCivicSummary();

  const addressLine = formatAddressLine(label, coordinates);

  const neighborhood =
    parts.neighborhood !== 'Not available' ? parts.neighborhood : null;

  if (isLoading && !hasAnyData && !addressLine) {
    return (
      <div
        className="rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3"
        role="status"
        aria-live="polite"
      >
        <div className="h-2.5 w-20 rounded bg-blue-200/70 animate-pulse" />
        <div className="mt-2 h-4 w-full max-w-xs rounded bg-blue-200/50 animate-pulse" />
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-white px-4 py-3.5 shadow-sm ring-1 ring-white/70"
      role="region"
      aria-label="Selected address summary"
    >
      <div className="flex items-center gap-1.5">
        <span aria-hidden className="text-blue-600">
          📍
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-wide text-blue-700">
          This Address
        </span>
      </div>
      {addressLine ? (
        <>
          <p className="mt-1.5 text-[15px] font-semibold text-slate-950 leading-snug">{addressLine}</p>
          {neighborhood && (
            <p className="mt-1 text-xs font-medium text-slate-600">{neighborhood}</p>
          )}
        </>
      ) : (
        <p className="mt-1.5 text-sm text-slate-500">
          Select a location within Montgomery to see your address summary.
        </p>
      )}
    </div>
  );
}
