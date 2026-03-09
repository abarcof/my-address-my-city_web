import { useState, useEffect } from 'react';

interface LoadingCardProps {
  title: string;
}

export function LoadingCard({ title }: LoadingCardProps) {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSlow(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="rounded-lg border border-gray-200 p-4 animate-pulse"
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="text-sm font-medium text-gray-500 mb-2">{title}</div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      {slow ? (
        <p className="text-xs text-gray-400 italic">Still loading. Please wait...</p>
      ) : (
        <div className="h-3 bg-gray-100 rounded w-1/2" />
      )}
    </div>
  );
}
