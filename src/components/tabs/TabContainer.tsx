import { useAddressStore } from '../../store/address-store';

const TABS = [
  { id: 'this-address' as const, label: 'This Address' },
  { id: 'whats-closest' as const, label: "What's Closest" },
  { id: 'whats-happening-nearby' as const, label: 'Nearby City Records' },
  { id: 'next-steps' as const, label: 'City Resources' },
];

export function TabContainer() {
  const activeTab = useAddressStore((s) => s.activeTab);
  const setActiveTab = useAddressStore((s) => s.setActiveTab);

  return (
    <div
      className="grid grid-cols-2 gap-1.5 border-b border-slate-200 bg-white px-2 py-2"
      role="tablist"
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            className={`rounded-lg px-2 py-2.5 text-center text-xs font-semibold leading-snug transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 sm:text-sm ${
              isActive
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
