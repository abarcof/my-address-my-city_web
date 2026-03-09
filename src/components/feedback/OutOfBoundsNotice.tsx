export function OutOfBoundsNotice() {
  return (
    <div
      className="rounded-lg border border-amber-200 bg-amber-50 p-4"
      role="alert"
      aria-live="polite"
    >
      <p className="text-sm font-medium text-amber-800">
        This location appears to be outside the City of Montgomery. This app currently shows
        city-specific information only for locations within Montgomery city limits.
      </p>
      <p className="text-sm text-amber-700 mt-1">
        Try selecting a location within Montgomery to see zoning, flood risk, nearby civic places,
        and recent city activity.
      </p>
    </div>
  );
}
