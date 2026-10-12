import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api, IS_BACKEND_AVAILABLE } from '../services/api';

export type UserRole = 'customer' | 'restaurant' | 'rider' | 'admin';

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role?: UserRole;
  status?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  role: UserRole;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, phone: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  setRole: (role: UserRole) => void;
  fetchMe: () => Promise<void>;
  clearError: () => void;
}

// Demo users for when backend is not available
const demoUsers: Array<User & { password: string }> = [
  { id: '1', _id: '1', name: 'Demo User', email: 'demo@cravings.app', phone: '+91 98765 43210', password: 'demo123', role: 'customer', status: 'approved' },
  { id: '2', _id: '2', name: 'Admin User', email: 'admin@cravings.app', phone: '+91 99999 00000', password: 'admin123', role: 'admin', status: 'approved' },
  { id: '3', _id: '3', name: 'Restaurant Owner', email: 'restaurant@cravings.app', phone: '+91 98765 11111', password: 'rest123', role: 'restaurant', status: 'approved' },
  { id: '4', _id: '4', name: 'Demo Rider', email: 'rider@cravings.app', phone: '+91 98765 22222', password: 'rider123', role: 'rider', status: 'approved' },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      role: 'customer' as UserRole,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        if (IS_BACKEND_AVAILABLE) {
          // Real API login
          const response = await api.post<{ user: User; accessToken: string; refreshToken: string }>('/auth/login', { email, password });
          
          if (response.success && response.data) {
            const data = response.data as any;
            const user = data.user;
            const accessToken = data.accessToken;
            const refreshToken = data.refreshToken;
            api.setToken(accessToken);
            set({
              user: { ...user, id: user._id || user.id },
              isAuthenticated: true,
              role: (user.role as UserRole) || 'customer',
              accessToken,
              refreshToken,
              isLoading: false,
            });
            return { success: true };
          }
          
          set({ isLoading: false, error: response.message || 'Login failed' });
          return { success: false, error: response.message };
        }
        
        // Demo mode fallback
        await new Promise(resolve => setTimeout(resolve, 500));
        const user = demoUsers.find(u => u.email === email && u.password === password);
        
        if (!user) {
          set({ isLoading: false, error: 'Invalid email or password' });
          return { success: false, error: 'Invalid email or password' };
        }

        const { password: _, ...userData } = user;
        set({
          user: userData,
          isAuthenticated: true,
          role: (user.role as UserRole) || 'customer',
          isLoading: false,
        });
        return { success: true };
      },

      register: async (name: string, email: string, phone: string, password: string) => {
        set({ isLoading: true, error: null });
        
        if (IS_BACKEND_AVAILABLE) {
          const response = await api.post<{ user: User; accessToken: string; refreshToken: string }>('/auth/register', { name, email, phone, password });
          
          if (response.success && response.data) {
            const data = response.data as any;
            const user = data.user;
            const accessToken = data.accessToken;
            const refreshToken = data.refreshToken;
            api.setToken(accessToken);
            set({
              user: { ...user, id: user._id || user.id },
              isAuthenticated: true,
              role: 'customer',
              accessToken,
              refreshToken,
              isLoading: false,
            });
            return { success: true };
          }
          
          set({ isLoading: false, error: response.message || 'Registration failed' });
          return { success: false, error: response.message };
        }
        
        // Demo mode
        await new Promise(resolve => setTimeout(resolve, 500));
        if (demoUsers.find(u => u.email === email)) {
          set({ isLoading: false, error: 'Email already registered' });
          return { success: false, error: 'Email already registered' };
        }
        
        const newUser = { id: Date.now().toString(), name, email, phone, role: 'customer' as UserRole, status: 'approved' };
        set({ user: newUser, isAuthenticated: true, role: 'customer', isLoading: false });
        return { success: true };
      },

      logout: () => {
        if (IS_BACKEND_AVAILABLE) {
          api.post('/auth/logout');
        }
        api.setToken(null);
        set({ user: null, isAuthenticated: false, role: 'customer', accessToken: null, refreshToken: null });
      },

      updateProfile: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
          if (IS_BACKEND_AVAILABLE) {
            api.put('/auth/profile', updates);
          }
        }
      },

      setRole: (role: UserRole) => set({ role }),

      fetchMe: async () => {
        if (!IS_BACKEND_AVAILABLE || !get().accessToken) return;
        
        const response = await api.get<any>('/auth/me');
        if (response.success && response.data) {
          const user = response.data.user;
          set({ user: { ...user, id: user._id || user.id }, role: (user.role as UserRole) || 'customer' });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'cravings-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        role: state.role,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);
