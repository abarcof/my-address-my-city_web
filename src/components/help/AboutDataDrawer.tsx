import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ABOUT_DATA_HEADLINE, ABOUT_DATA_SECTIONS } from '../../content/about-data';
import { FORMS_CONFIG } from '../../config/forms-config';

interface AboutDataDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutDataDrawer({ isOpen, onClose }: AboutDataDrawerProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setMounted(true);
    const frame = requestAnimationFrame(() => setVisible(true));
    document.body.style.overflow = 'hidden';

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) return;

    setVisible(false);
    const timer = window.setTimeout(() => setMounted(false), 250);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <>
      <button
        type="button"
        className={`fixed inset-0 z-[200] bg-slate-900/50 transition-opacity duration-200 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        aria-label="Close about this app"
      />
      <aside
        className={`fixed inset-y-0 right-0 z-[201] flex w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
          visible ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-labelledby="about-data-title"
        aria-modal="true"
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
          <h2 id="about-data-title" className="text-lg font-bold text-slate-950">
            About this app
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close"
          >
            <span className="text-2xl leading-none">&times;</span>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          <p className="text-[15px] leading-relaxed text-slate-700">{ABOUT_DATA_HEADLINE}</p>

          <div className="mt-6 space-y-5">
            {ABOUT_DATA_SECTIONS.map((section) => (
              <section key={section.title} className="border-l-2 border-blue-200 pl-3">
                <h3 className="text-sm font-semibold text-slate-950">{section.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{section.content}</p>
              </section>
            ))}
          </div>

          <div className="mt-6 rounded-xl bg-blue-50 px-4 py-3 ring-1 ring-blue-100">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-blue-700">Contact</h3>
            <p className="mt-1 text-sm text-slate-700">
              Aicardo Barco Fajardo
              <br />
              <a
                href={`mailto:${FORMS_CONFIG.developerEmail}`}
                className="font-medium text-blue-600 hover:text-blue-800"
              >
                {FORMS_CONFIG.developerEmail}
              </a>
              <span className="ml-1 text-slate-400">— email the developer</span>
            </p>
          </div>
        </div>

        <div className="shrink-0 border-t border-slate-200 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Close
          </button>
        </div>
      </aside>
    </>,
    document.body,
  );
}
