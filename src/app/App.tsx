import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppShell } from '../components/layout/AppShell';
import { SidePanel } from '../components/layout/SidePanel';
import { CityMap } from '../components/map/CityMap';
import { SearchBar } from '../components/search/SearchBar';
import { TabContainer } from '../components/tabs/TabContainer';
import { ThisAddress } from '../features/snapshot/ThisAddress';
import { WhatsClosest } from '../features/closest/WhatsClosest';
import { WhatsHappeningNearby } from '../features/happening/WhatsHappeningNearby';
import { NextSteps } from '../features/snapshot/NextSteps';
import { AboutDataButton } from '../components/help/AboutDataButton';
import { CopyLinkButton } from '../components/actions/CopyLinkButton';
import { AppFooter } from '../components/layout/AppFooter';
import { useUrlSync } from '../hooks/use-url-sync';
import { useAddressStore } from '../store/address-store';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function PanelContent() {
  const activeTab = useAddressStore((s) => s.activeTab);
  const coordinates = useAddressStore((s) => s.coordinates);
  const isWithinMontgomery = useAddressStore((s) => s.isWithinMontgomery);

  return (
    <>
      <TabContainer />
      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col">
        <SidePanel>
          <div id={`panel-${activeTab}`} role="tabpanel" aria-labelledby={`tab-${activeTab}`}>
            {activeTab === 'this-address' && <ThisAddress />}
            {activeTab === 'whats-closest' && <WhatsClosest />}
            {activeTab === 'whats-happening-nearby' && <WhatsHappeningNearby />}
            {activeTab === 'next-steps' && <NextSteps />}
          </div>
        </SidePanel>
        <AppFooter />
      </div>
    </>
  );
}

function AppContent() {
  useUrlSync();

  return (
    <AppShell
      searchBar={<SearchBar />}
      map={<CityMap />}
      sidePanel={<PanelContent />}
      headerActions={
        <div className="flex items-center gap-2 shrink-0">
          <CopyLinkButton />
          <AboutDataButton />
        </div>
      }
    />
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
