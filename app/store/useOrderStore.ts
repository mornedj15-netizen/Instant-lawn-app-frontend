import { create } from 'zustand';

interface OrderStore {
  selectedAddress: string;
  selectedLat: number | null;
  selectedLon: number | null;
  setLocation: (address: string, lat: number, lon: number) => void;
  clearLocation: () => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
  selectedAddress: '',
  selectedLat: null,
  selectedLon: null,
  setLocation: (address, lat, lon) =>
    set({ selectedAddress: address, selectedLat: lat, selectedLon: lon }),
  clearLocation: () =>
    set({ selectedAddress: '', selectedLat: null, selectedLon: null }),
}));