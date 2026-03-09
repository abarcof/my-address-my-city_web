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
    <div className="flex border-b border-gray-200" role="tablist">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`panel-${tab.id}`}
          id={`tab-${tab.id}`}
          className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset ${
            activeTab === tab.id
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
