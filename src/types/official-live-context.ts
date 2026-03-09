/**
 * Official Live Context — Bright Data bonus layer
 * Normalized type for official web updates from city-owned domains.
 */

export interface OfficialLiveContextItem {
  id: string;
  title: string;
  source: string;
  publishedAt?: string;
  summary: string;
  url: string;
}

export interface OfficialLiveContextResponse {
  items: OfficialLiveContextItem[];
  /** True when Bright Data is not configured (token missing) */
  unavailable?: boolean;
}
