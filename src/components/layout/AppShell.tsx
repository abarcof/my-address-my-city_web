import type { ReactNode } from 'react';

interface AppShellProps {
  searchBar: ReactNode;
  map: ReactNode;
  sidePanel: ReactNode;
  headerActions?: ReactNode;
  headerExtra?: ReactNode;
}

export function AppShell({ searchBar, map, sidePanel, headerActions, headerExtra }: AppShellProps) {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <a
        href="#main-content"
        className="fixed -left-[9999px] z-[100] px-4 py-2 bg-white ring-2 ring-blue-500 rounded-md focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>
      <header className="flex items-center gap-2 sm:gap-4 px-3 sm:px-4 py-2 sm:py-3 bg-white border-b border-gray-200 shrink-0">
        <h1 className="text-base sm:text-lg font-bold text-gray-900 whitespace-nowrap">
          My Address, My City
        </h1>
        <div className="flex-1 min-w-0">{searchBar}</div>
        {headerActions}
      </header>
      {headerExtra}
      <main
        id="main-content"
        className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-0"
        role="main"
      >
        <div className="w-full h-48 sm:h-64 md:w-auto md:h-auto md:flex-1 relative shrink-0 overflow-hidden z-0">
          {map}
        </div>
        <aside className="flex-1 md:flex-none md:w-96 flex flex-col min-h-0 border-t md:border-t-0 md:border-l border-gray-200 bg-white z-10 overflow-hidden">
          {sidePanel}
        </aside>
      </main>
    </div>
  );
}
