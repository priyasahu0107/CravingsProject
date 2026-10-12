import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'customer' | 'restaurant' | 'rider' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role?: UserRole;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  role: UserRole;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, phone: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  setRole: (role: UserRole) => void;
}

// Mock user database (in production, this would be in MongoDB)
const mockUsers: Array<User & { password: string }> = [
  {
    id: '1',
    name: 'Demo User',
    email: 'demo@cravings.app',
    phone: '+91 98765 43210',
    password: 'demo123',
    avatar: '👤',
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      role: 'customer' as UserRole,

      setRole: (role: UserRole) => set({ role }),

      login: async (email: string, password: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        const user = mockUsers.find(u => u.email === email && u.password === password);
        
        if (!user) {
          return { success: false, error: 'Invalid email or password' };
        }

        const { password: _, ...userData } = user;
        set({ user: userData, isAuthenticated: true });
        return { success: true };
      },

      register: async (name: string, email: string, phone: string, password: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        // Check if user already exists
        if (mockUsers.find(u => u.email === email)) {
          return { success: false, error: 'Email already registered' };
        }

        // Create new user
        const newUser = {
          id: Date.now().toString(),
          name,
          email,
          phone,
          password,
          avatar: '👤',
        };

        mockUsers.push(newUser);
        const { password: _, ...userData } = newUser;
        set({ user: userData, isAuthenticated: true });
        return { success: true };
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },
    }),
    {
      name: 'cravings-auth',
    }
  )
);
