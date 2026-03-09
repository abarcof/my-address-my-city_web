/**
 * Phase 3: What's Happening Nearby — normalized types
 */

export type HappeningCategory = 'code-violations' | 'building-permits';

export interface HappeningItem {
  id: string;
  category: HappeningCategory;
  title: string;
  subtitle: string;
  status: string;
  dateLabel: string;
  address: string;
  rawDate: string | number | null;
  sortTimestamp: number;
  distanceMiles?: number;
}

export type HappeningCategoryState = 'loading' | 'success' | 'empty' | 'error';

export interface HappeningCategoryResult {
  label: string;
  count: number;
  items: HappeningItem[];
  state: HappeningCategoryState;
  errorMessage?: string;
}

export interface HappeningSnapshot {
  codeViolations: HappeningCategoryResult;
  buildingPermits: HappeningCategoryResult;
}
