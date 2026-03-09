import { useAddressStore } from '../../store/address-store';
import { useHappening } from './use-happening';
import { HappeningCategoryCard } from '../../components/cards/HappeningCategoryCard';
import { OutOfBoundsNotice } from '../../components/feedback/OutOfBoundsNotice';
import { OfficialLiveContextCard } from '../official-live-context/OfficialLiveContextCard';
import { APP_CONFIG } from '../../config/app-config';
import { BRIGHT_DATA_ENABLED } from '../../config/feature-flags';

const LOADING_MESSAGES = {
  codeViolations: 'Loading nearby code violations...',
  buildingPermits: 'Loading nearby permits...',
};

const EMPTY_MESSAGES = {
  codeViolations: 'No recent code violations found within the last 12 months.',
  buildingPermits: 'No recent permits found within the last 12 months.',
};

const ERROR_MESSAGES = {
  codeViolations: "We couldn't load nearby code violations right now.",
  buildingPermits: "We couldn't load nearby permits right now.",
};

function SummaryChip({
  icon,
  label,
  count,
  muted,
}: {
  icon: string;
  label: string;
  count: number;
  muted?: boolean;
}) {
  return (
    <span
      className={
        muted
          ? 'text-gray-400 text-xs'
          : 'text-gray-700 text-xs font-medium'
      }
    >
      <span aria-hidden>{icon}</span> {label} ({count})
    </span>
  );
}

export function WhatsHappeningNearby() {
  const coordinates = useAddressStore((s) => s.coordinates);
  const isWithinMontgomery = useAddressStore((s) => s.isWithinMontgomery);
  const {
    snapshot,
    refetchCodeViolations,
    refetchBuildingPermits,
  } = useHappening();

  if (!coordinates) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-gray-500">
          Search for an address or click the map to see code violations and
          building permits nearby.
        </p>
      </div>
    );
  }

  if (!isWithinMontgomery) {
    return (
      <div className="space-y-3">
        <OutOfBoundsNotice />
      </div>
    );
  }

  const cv = snapshot.codeViolations;
  const bp = snapshot.buildingPermits;
  const isLoading = cv.state === 'loading' || bp.state === 'loading';

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold text-gray-900">
          What&apos;s Happening Nearby
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Code violations and building permits within{' '}
          {APP_CONFIG.nearbyRadiusLabel} of this location.
        </p>
      </div>

      {!isLoading && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2 px-3 bg-gray-50 rounded-lg text-sm">
          <SummaryChip
            icon="🔴"
            label="Code Violations"
            count={cv.count}
            muted={cv.count === 0}
          />
          <span className="text-gray-300" aria-hidden>·</span>
          <SummaryChip
            icon="🔵"
            label="Building Permits"
            count={bp.count}
            muted={bp.count === 0}
          />
        </div>
      )}

      <div className="space-y-3">
        <HappeningCategoryCard
          category="code-violations"
          label="Code Violations"
          count={cv.count}
          items={cv.items}
          state={cv.state}
          loadingMessage={LOADING_MESSAGES.codeViolations}
          emptyMessage={EMPTY_MESSAGES.codeViolations}
          errorMessage={ERROR_MESSAGES.codeViolations}
          onRetry={refetchCodeViolations}
        />
        <HappeningCategoryCard
          category="building-permits"
          label="Building Permits"
          count={bp.count}
          items={bp.items}
          state={bp.state}
          loadingMessage={LOADING_MESSAGES.buildingPermits}
          emptyMessage={EMPTY_MESSAGES.buildingPermits}
          errorMessage={ERROR_MESSAGES.buildingPermits}
          onRetry={refetchBuildingPermits}
        />
      </div>

      <div className="text-xs text-gray-500 space-y-0.5 pt-1 border-t border-gray-100">
        <p>
          Records from the last 12 months within{' '}
          {APP_CONFIG.nearbyRadiusMiles} mi
        </p>
        <p>
          Source: City of Montgomery Open Data · Last updated:{' '}
          {new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </p>
      </div>

      {BRIGHT_DATA_ENABLED && (
        <div className="pt-2 border-t border-gray-100">
          <OfficialLiveContextCard />
        </div>
      )}
    </div>
  );
}
