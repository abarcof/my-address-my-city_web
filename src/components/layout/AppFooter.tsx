import { FORMS_CONFIG } from '../../config/forms-config';

export function AppFooter() {
  const mailto = `mailto:${FORMS_CONFIG.developerEmail}?subject=My%20Address%2C%20My%20City`;
  return (
    <footer
      className="mt-auto border-t border-slate-200/80 bg-white/70 px-4 py-3 text-center text-xs text-slate-400"
      role="contentinfo"
    >
      <p>
        <span>Aicardo Barco Fajardo</span>
        <span className="mx-1.5 text-gray-300">·</span>
        <a
          href={mailto}
          className="font-medium text-slate-500 transition-colors hover:text-blue-700"
          title="Email the developer"
        >
          ✉ Email the developer
        </a>
        <span className="mx-1.5 text-gray-300">·</span>
        <span>Montgomery, AL</span>
        <span className="mx-1.5 text-gray-300">·</span>
        <span>GenAI Works</span>
      </p>
    </footer>
  );
}
