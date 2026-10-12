import { create } from 'zustand';

export type UserRole = 'customer' | 'restaurant' | 'rider' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role?: UserRole;
  restaurantId?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  role: UserRole;
  token: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, phone: string, password: string, role?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  setRole: (role: UserRole) => void;
  loadFromStorage: () => void;
}

const API_URL = 'http://localhost:5000/api';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  role: 'customer',
  token: null,

  loadFromStorage: () => {
    const token = localStorage.getItem('cravings_token');
    const userStr = localStorage.getItem('cravings_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ token, user, isAuthenticated: true, role: user.role || 'customer' });
      } catch (e) {
        localStorage.removeItem('cravings_token');
        localStorage.removeItem('cravings_user');
      }
    }
  },

  login: async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.message || 'Login failed' };
      }

      localStorage.setItem('cravings_token', data.token);
      localStorage.setItem('cravings_user', JSON.stringify(data.user));

      set({
        token: data.token,
        user: data.user,
        isAuthenticated: true,
        role: data.user.role || 'customer',
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  },

  register: async (name: string, email: string, phone: string, password: string, role?: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password, role: role || 'customer' }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.message || 'Registration failed' };
      }

      localStorage.setItem('cravings_token', data.token);
      localStorage.setItem('cravings_user', JSON.stringify(data.user));

      set({
        token: data.token,
        user: data.user,
        isAuthenticated: true,
        role: data.user.role || 'customer',
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  },

  logout: () => {
    localStorage.removeItem('cravings_token');
    localStorage.removeItem('cravings_user');
    set({ user: null, isAuthenticated: false, role: 'customer', token: null });
  },

  updateProfile: (updates: Partial<User>) => {
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      set({ user: updatedUser });
      localStorage.setItem('cravings_user', JSON.stringify(updatedUser));
    }
  },

  setRole: (role: UserRole) => set({ role }),
}));
