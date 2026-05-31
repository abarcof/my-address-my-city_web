import { useAddressStore } from '../../store/address-store';
import { OutOfBoundsNotice } from '../../components/feedback/OutOfBoundsNotice';
import { APP_CONFIG } from '../../config/app-config';

export function NextSteps() {
  const coordinates = useAddressStore((s) => s.coordinates);
  const isWithinMontgomery = useAddressStore((s) => s.isWithinMontgomery);

  if (!coordinates) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-gray-500">
          Select a location to see official city resources and next steps.
        </p>
      </div>
    );
  }

  if (!isWithinMontgomery) {
    return (
      <div className="space-y-3">
        <OutOfBoundsNotice />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm leading-relaxed text-slate-600">
        Use these official city resources to take the next step for this location.
      </p>
      {APP_CONFIG.nextStepsLinks.map((link) => (
        <a
          key={link.url}
          href={link.url}
          target="_blank"
          rel="noreferrer noopener"
          className="group block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/60 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <h3 className="text-sm font-semibold text-slate-950">{link.title}</h3>
          <p className="text-sm leading-relaxed text-slate-500 mt-1">{link.description}</p>
          <span className="mt-2 inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-100 transition group-hover:bg-blue-100">
            Open official page
          </span>
        </a>
      ))}
      <p className="px-1 pt-1 text-xs leading-relaxed text-slate-400">
        This app provides informational content only. It does not replace official city services or decisions.
      </p>
    </div>
  );
}
