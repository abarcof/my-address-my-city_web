import { useEffect, useRef } from 'react';
import { useAddressStore } from '../store/address-store';
import { parseUrlState, buildUrlParams } from '../utils/url-state';

/**
 * Syncs URL with app state:
 * - On mount: parse URL and restore state if valid
 * - On state change: update URL with replaceState (no history pollution)
 */
export function useUrlSync() {
  const coordinates = useAddressStore((s) => s.coordinates);
  const label = useAddressStore((s) => s.label);
  const activeTab = useAddressStore((s) => s.activeTab);
  const setLocation = useAddressStore((s) => s.setLocation);
  const setActiveTab = useAddressStore((s) => s.setActiveTab);
  const isInitialMount = useRef(true);

  // On mount: restore from URL if valid
  useEffect(() => {
    if (!isInitialMount.current) return;
    isInitialMount.current = false;

    const state = parseUrlState();
    if (state) {
      setLocation({ lat: state.lat, lng: state.lng }, state.label ?? '');
      setActiveTab(state.tab);
    }
  }, [setLocation, setActiveTab]);

  // On state change: update URL
  useEffect(() => {
    if (!coordinates) {
      if (window.location.search) {
        window.history.replaceState(null, '', window.location.pathname);
      }
      return;
    }

    const params = buildUrlParams({
      lat: coordinates.lat,
      lng: coordinates.lng,
      tab: activeTab,
      label: label || undefined,
    });

    const newUrl = `${window.location.pathname}?${params}`;
    if (window.location.search !== `?${params}`) {
      window.history.replaceState(null, '', newUrl);
    }
  }, [coordinates, activeTab, label]);
}
