import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Address {
  id: string;
  label: string;
  name: string;
  phone: string;
  houseNumber: string;
  street: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  createdAt: string;
}

interface AddressStore {
  addresses: Address[];
  addAddress: (address: Omit<Address, 'id' | 'createdAt'>) => void;
  updateAddress: (id: string, updates: Partial<Address>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  getDefaultAddress: () => Address | undefined;
}

export const useAddressStore = create<AddressStore>()(
  persist(
    (set, get) => ({
      addresses: [],

      addAddress: (addressData) => {
        const id = Date.now().toString();
        const createdAt = new Date().toISOString();

        const newAddress: Address = { ...addressData, id, createdAt };
        set(state => ({ addresses: [...state.addresses, newAddress] }));
      },

      updateAddress: (id, updates) => {
        set(state => ({
          addresses: state.addresses.map(addr =>
            addr.id === id ? { ...addr, ...updates } : addr
          ),
        }));
      },

      removeAddress: (id) => {
        set(state => ({
          addresses: state.addresses.filter(addr => addr.id !== id),
        }));
      },

      setDefaultAddress: (id) => {
        set(state => ({
          addresses: state.addresses.map(addr => ({
            ...addr,
            isDefault: addr.id === id,
          })),
        }));
      },

      getDefaultAddress: () => {
        return get().addresses.find(addr => addr.isDefault) || get().addresses[0];
      },
    }),
    { name: 'cravings-addresses' }
  )
);
