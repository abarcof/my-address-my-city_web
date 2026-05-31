import type { ReactNode } from 'react';

interface InfoCardProps {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: 'blue' | 'amber' | 'green' | 'gray';
  children?: ReactNode;
}

const badgeStyles: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-700 ring-blue-100',
  amber: 'bg-amber-50 text-amber-800 ring-amber-100',
  green: 'bg-green-50 text-green-700 ring-green-100',
  gray: 'bg-slate-100 text-slate-700 ring-slate-200',
};

export function InfoCard({ title, subtitle, badge, badgeColor = 'blue', children }: InfoCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-950">{title}</h3>
          {subtitle && (
            <p className="text-sm text-slate-600 mt-0.5 leading-relaxed">{subtitle}</p>
          )}
        </div>
        {badge && (
          <span
            className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${badgeStyles[badgeColor]}`}
          >
            {badge}
          </span>
        )}
      </div>
      {children && <div className="mt-3 text-sm leading-relaxed text-slate-600">{children}</div>}
    </div>
  );
}
