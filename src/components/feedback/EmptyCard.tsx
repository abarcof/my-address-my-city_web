interface EmptyCardProps {
  title: string;
  message?: string;
}

export function EmptyCard({ title, message }: EmptyCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 p-4" role="status">
      <div className="text-sm font-medium text-gray-500 mb-1">{title}</div>
      <p className="text-sm text-gray-400">
        {message ?? `No ${title.toLowerCase()} data found for this location.`}
      </p>
    </div>
  );
}
