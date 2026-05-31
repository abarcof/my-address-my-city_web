import type { ReactNode } from 'react';

interface SidePanelProps {
  children: ReactNode;
}

export function SidePanel({ children }: SidePanelProps) {
  return <div className="p-4 sm:p-5 space-y-4">{children}</div>;
}
