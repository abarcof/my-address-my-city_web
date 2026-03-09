import { useState } from 'react';
import { AboutDataDrawer } from './AboutDataDrawer';

export function AboutDataButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 whitespace-nowrap px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        aria-label="About this app"
      >
        About this app
      </button>
      <AboutDataDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
