import type { ReactNode } from 'react';

interface AppShellProps {
  searchBar: ReactNode;
  map: ReactNode;
  sidePanel: ReactNode;
  headerActions?: ReactNode;
}

export function AppShell({ searchBar, map, sidePanel, headerActions }: AppShellProps) {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-100 text-slate-900">
      <a
        href="#main-content"
        className="fixed -left-[9999px] z-[100] px-4 py-2 bg-white ring-2 ring-blue-500 rounded-md focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>
      <header className="relative z-20 flex items-center gap-2 sm:gap-4 px-3 sm:px-5 py-2.5 sm:py-3 bg-white/95 border-b border-slate-200 shadow-sm backdrop-blur shrink-0">
        <h1 className="flex items-center gap-2 text-base sm:text-lg font-bold text-slate-950 whitespace-nowrap">
          <span
            aria-hidden
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 text-sm text-white shadow-sm ring-1 ring-blue-500/20"
          >
            🏛️
          </span>
          <span>
            My Address, <span className="text-blue-700">My City</span>
          </span>
        </h1>
        <div className="flex-1 min-w-0">{searchBar}</div>
        {headerActions}
      </header>
      <main
        id="main-content"
        className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-0"
        role="main"
      >
        <div className="w-full h-48 sm:h-64 md:w-auto md:h-auto md:flex-1 relative shrink-0 overflow-hidden z-0 bg-slate-200">
          {map}
        </div>
        <aside className="flex-1 md:flex-none md:w-[26rem] flex flex-col min-h-0 border-t md:border-t-0 md:border-l border-slate-200 bg-slate-50/95 z-10 overflow-hidden shadow-2xl shadow-slate-900/10">
          {sidePanel}
        </aside>
      </main>
    </div>
  );
}
