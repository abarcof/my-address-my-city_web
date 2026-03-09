import { create } from 'zustand';
import type { Coordinates } from '../types/address';
import { isWithinMontgomery } from '../utils/boundary';

type Tab = 'this-address' | 'whats-closest' | 'whats-happening-nearby' | 'next-steps';

interface AddressState {
  coordinates: Coordinates | null;
  label: string;
  isWithinMontgomery: boolean;
  activeTab: Tab;
  setLocation: (coordinates: Coordinates, label: string) => void;
  setActiveTab: (tab: Tab) => void;
  clear: () => void;
}

export const useAddressStore = create<AddressState>((set) => ({
  coordinates: null,
  label: '',
  isWithinMontgomery: false,
  activeTab: 'this-address',
  setLocation: (coordinates, label) =>
    set({
      coordinates,
      label,
      isWithinMontgomery: isWithinMontgomery(coordinates),
    }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  clear: () => set({ coordinates: null, label: '', isWithinMontgomery: false }),
}));
