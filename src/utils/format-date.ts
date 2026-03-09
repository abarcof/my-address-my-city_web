/**
 * Format date for resident-facing display.
 * Handles YYYY-MM-DD strings, epoch milliseconds, and null/undefined.
 */
export function formatDateForDisplay(
  value: string | number | null | undefined,
): string {
  if (value === null || value === undefined) {
    return 'Not available';
  }

  let date: Date;
  if (typeof value === 'number') {
    date = new Date(value);
  } else if (typeof value === 'string') {
    date = new Date(value);
  } else {
    return 'Not available';
  }

  if (Number.isNaN(date.getTime())) {
    return 'Not available';
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format date as relative time (e.g. "3 months ago").
 * Returns exact formatted date if older than ~12 months.
 */
export function formatRelativeTime(
  value: string | number | null | undefined,
): string {
  if (value === null || value === undefined) return 'Not available';
  const ts =
    typeof value === 'number' ? value : parseArcGISDateToTimestamp(value);
  if (ts <= 0) return 'Not available';
  const date = new Date(ts);
  if (Number.isNaN(date.getTime())) return 'Not available';

  const now = new Date();
  const diffMs = now.getTime() - ts;
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffDays < 1) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffWeeks === 1) return '1 week ago';
  if (diffWeeks < 5) return `${diffWeeks} weeks ago`;
  if (diffMonths === 1) return '1 month ago';
  if (diffMonths < 12) return `${diffMonths} months ago`;
  return formatDateForDisplay(value);
}

/**
 * Parse raw date value to timestamp for sorting.
 * Returns 0 for invalid/missing dates (sorts last).
 */
export function parseToSortTimestamp(
  value: string | number | null | undefined,
): number {
  if (value === null || value === undefined) {
    return 0;
  }
  if (typeof value === 'number') {
    return value;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

/**
 * Parse ArcGIS REST API date to epoch milliseconds.
 * ArcGIS returns dates as: number (epoch ms), string "1611273600000",
 * string "/Date(1611273600000)/", or ISO string "2021-01-22T00:00:00.000Z".
 */
export function parseArcGISDateToTimestamp(raw: unknown): number {
  if (raw == null) return 0;
  if (typeof raw === 'number' && !Number.isNaN(raw)) return raw;
  if (typeof raw === 'string') {
    const s = raw.trim();
    if (!s) return 0;
    if (/^\d+$/.test(s)) return parseInt(s, 10);
    const m = s.match(/\/Date\((\d+)\)\//);
    if (m) return parseInt(m[1], 10);
    const d = new Date(s);
    return Number.isNaN(d.getTime()) ? 0 : d.getTime();
  }
  return 0;
}
