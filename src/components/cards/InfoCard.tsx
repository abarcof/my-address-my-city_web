import type { ReactNode } from 'react';

interface InfoCardProps {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: 'blue' | 'amber' | 'green' | 'gray';
  children?: ReactNode;
}

const badgeStyles: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-800',
  amber: 'bg-amber-100 text-amber-800',
  green: 'bg-green-100 text-green-800',
  gray: 'bg-gray-100 text-gray-700',
};

export function InfoCard({ title, subtitle, badge, badgeColor = 'blue', children }: InfoCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-medium text-gray-900">{title}</h3>
          {subtitle && (
            <p className="text-sm text-gray-600 mt-0.5">{subtitle}</p>
          )}
        </div>
        {badge && (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium shrink-0 ${badgeStyles[badgeColor]}`}
          >
            {badge}
          </span>
        )}
      </div>
      {children && <div className="mt-2 text-sm text-gray-500">{children}</div>}
    </div>
  );
}
