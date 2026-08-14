import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserRole } from '../types';

interface AuthState {
  token: string | null;
  username: string | null;
  role: UserRole | null;
  expiresIn: number | null;
  loginAt: number | null;
  isAuthenticated: boolean;
  login: (data: { token: string; username: string; role: UserRole; expiresIn: number }) => void;
  logout: () => void;
  cartOrderId: number | null;
  setCartOrderId: (id: number | null) => void;
  clearCart: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      username: null,
      role: null,
      expiresIn: null,
      loginAt: null,
      isAuthenticated: false,
      cartOrderId: null,

      login: ({ token, username, role, expiresIn }) =>
        set({
          token,
          username,
          role,
          expiresIn,
          loginAt: Date.now(),
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          token: null,
          username: null,
          role: null,
          expiresIn: null,
          loginAt: null,
          isAuthenticated: false,
          cartOrderId: null,
        }),

      setCartOrderId: (id) => set({ cartOrderId: id }),

      clearCart: () => set({ cartOrderId: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        username: state.username,
        role: state.role,
        expiresIn: state.expiresIn,
        loginAt: state.loginAt,
        isAuthenticated: state.isAuthenticated,
        cartOrderId: state.cartOrderId,
      }),
    }
  )
);
