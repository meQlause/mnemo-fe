import { create } from 'zustand';
import { authService, type LoginPayload, type RegisterPayload } from '@/services/authService';
import { tokenService } from '@/services/tokenService';
import type { User } from '@/utils/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  init: () => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  init: async () => {
    const refresh = tokenService.getRefresh();
    if (!refresh) return;
    try {
      await authService.refreshTokens();
      const user = await authService.getMe();
      set({ user, isAuthenticated: true });
    } catch {
      tokenService.clear();
    }
  },

  login: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      await authService.login(payload);
      const user = await authService.getMe();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Login failed',
        isLoading: false,
      });
      throw err;
    }
  },

  register: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.register(payload);
      set({ user, isLoading: false });
      // After register, the user needs to login to get tokens (standard OAuth2 flow)
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Registration failed',
        isLoading: false,
      });
      throw err;
    }
  },

  logout: () => {
    authService.logout();
    set({ user: null, isAuthenticated: false, error: null });
  },

  clearError: () => set({ error: null }),
}));
