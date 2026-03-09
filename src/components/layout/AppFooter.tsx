export function AppFooter() {
  return (
    <footer
      className="mt-auto pt-3 pb-2 border-t border-gray-100 text-xs text-gray-400 text-center"
      role="contentinfo"
    >
      <p>
        <a
          href="mailto:abarcof@gmail.com"
          className="text-gray-500 hover:text-gray-700 transition-colors"
          title="Contact"
        >
          Aicardo Barco Fajardo
        </a>
        <span className="mx-1.5 text-gray-300">·</span>
        <a
          href="mailto:abarcof@gmail.com"
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          abarcof@gmail.com
        </a>
        <span className="mx-1.5 text-gray-300">·</span>
        <span>Montgomery, AL</span>
        <span className="mx-1.5 text-gray-300">·</span>
        <span>GenAI Works</span>
      </p>
    </footer>
  );
}
