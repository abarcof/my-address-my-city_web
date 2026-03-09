interface ErrorCardProps {
  title: string;
  onRetry?: () => void;
}

export function ErrorCard({ title, onRetry }: ErrorCardProps) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
      <div className="text-sm font-medium text-red-800 mb-1">{title}</div>
      <p className="text-sm text-red-600">
        We couldn&apos;t load this information right now. Please try again.
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 text-sm text-red-700 underline hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 rounded px-1"
          aria-label={`Retry loading ${title}`}
        >
          Retry
        </button>
      )}
    </div>
  );
}
