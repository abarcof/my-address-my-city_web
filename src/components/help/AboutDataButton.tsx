import { useState } from 'react';
import { AboutDataDrawer } from './AboutDataDrawer';

export function AboutDataButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 sm:text-sm"
        aria-label="About this app"
      >
        About this app
      </button>
      <AboutDataDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
