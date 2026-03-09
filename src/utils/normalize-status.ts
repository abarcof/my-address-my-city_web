/**
 * Normalize raw status strings to resident-friendly labels.
 * Handles OPEN/CLOSED/ISSUED/Closed etc. across categories.
 */
export function normalizeStatus(
  raw: string | null | undefined,
  _category: string,
): string {
  if (raw === null || raw === undefined || String(raw).trim() === '') {
    return 'Unknown';
  }

  const s = String(raw).trim().toUpperCase();

  if (s === 'OPEN' || s === 'ACTIVE' || s === 'PENDING') {
    return 'Open';
  }
  if (s === 'CLOSED' || s === 'COMPLETED' || s === 'RESOLVED') {
    return 'Closed';
  }
  if (s === 'ISSUED' || s === 'APPROVED') {
    return 'Issued';
  }
  if (s === 'RECEIVED' || s === 'IN PROGRESS' || s === 'IN_PROGRESS') {
    return 'Received';
  }

  return raw.trim();
}
