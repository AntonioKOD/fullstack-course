import { create } from 'zustand';

/**
 * Example auth store. Add token, user, login/logout actions.
 * Persist token to localStorage and restore on load.
 */
interface AuthState {
  token: string | null;
  setToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  setToken: (token) => set({ token }),
}));
