import { create } from 'zustand';

export type UserRole = 'customer' | 'restaurant' | 'rider' | 'admin';

interface AuthState {
  role: UserRole;
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  setRole: (role: UserRole) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  role: 'customer',
  user: {
    name: 'Demo User',
    email: 'demo@cravings.app',
    avatar: '👤',
  },
  setRole: (role) => set({ role }),
}));
