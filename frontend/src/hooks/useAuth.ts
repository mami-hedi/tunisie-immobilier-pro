import { create } from 'zustand';
import { api } from '@/lib/api';

interface AuthState {
  admin: any | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  admin: JSON.parse(localStorage.getItem('immo_admin') || 'null'),
  isAuthenticated: !!localStorage.getItem('immo_token'),

  login: async (email, password) => {
    const data = await api.login(email, password);
    localStorage.setItem('immo_token', data.token);
    localStorage.setItem('immo_admin', JSON.stringify(data.admin));
    set({ admin: data.admin, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('immo_token');
    localStorage.removeItem('immo_admin');
    set({ admin: null, isAuthenticated: false });
  },
}));