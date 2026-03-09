import { useEffect } from 'react';
import { ABOUT_DATA_HEADLINE, ABOUT_DATA_SECTIONS } from '../../content/about-data';

interface AboutDataDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutDataDrawer({ isOpen, onClose }: AboutDataDrawerProps) {
  useEffect(() => {
    if (isOpen) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      return () => {
        window.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = '';
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 bg-black/30"
        onClick={onClose}
        aria-label="Close about this app"
      />
      <aside
        className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-white shadow-xl overflow-y-auto"
        role="dialog"
        aria-labelledby="about-data-title"
        aria-modal="true"
      >
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 id="about-data-title" className="text-lg font-semibold text-gray-900">
              About this app
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Close"
            >
              <span className="text-xl leading-none">&times;</span>
            </button>
          </div>
          <p className="text-sm text-gray-600">{ABOUT_DATA_HEADLINE}</p>
          <div className="space-y-4">
            {ABOUT_DATA_SECTIONS.map((section) => (
              <section key={section.title}>
                <h3 className="text-sm font-medium text-gray-900 mb-1">{section.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{section.content}</p>
              </section>
            ))}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 px-4 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Close
          </button>
        </div>
      </aside>
    </>
  );
}
