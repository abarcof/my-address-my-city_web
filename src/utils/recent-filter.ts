/**
 * Recency filter for Nearby City Records.
 *
 * Primary rule: exact N-month cutoff — records with sortTimestamp < cutoff are excluded.
 * Safeguard: year >= currentYear - 1 — reinforcement only, not the main rule.
 */
export const RECENT_MONTHS = 12;

export function getRecentCutoffMs(months: number = RECENT_MONTHS): number {
  const d = new Date();
  d.setMonth(d.getMonth() - months);
  return d.getTime();
}

/**
 * Filter items to only those from the last N months.
 *
 * Primary rule: sortTimestamp >= cutoff (exact N-month window).
 * Safeguard: recordYear >= year of cutoff (avoids very old records for extended windows).
 */
export function filterToRecentOnly<T extends { sortTimestamp: number }>(
  items: T[],
  months: number = RECENT_MONTHS,
): T[] {
  const cutoff = getRecentCutoffMs(months);
  const minYearFromCutoff = new Date(cutoff).getFullYear();
  return items.filter((i) => {
    if (i.sortTimestamp < cutoff) return false;
    const recordYear = new Date(i.sortTimestamp).getFullYear();
    return recordYear >= minYearFromCutoff;
  });
}
