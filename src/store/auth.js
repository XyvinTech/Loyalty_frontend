import { create } from "zustand";
import { persist } from "zustand/middleware";

// Auth store with Zustand - focused only on client-side auth state
const useAuthStore = create(
  persist(
    (set) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isFirstLogin: false,

      // Actions
      setAuth: ({ user = null, token = null, isFirstLogin = false }) =>
        set({
          user,
          token,
          isAuthenticated: true,
          isFirstLogin,
        }),

      updateUser: (userData) =>
        set((state) => ({
          user: { ...state.user, ...userData },
        })),

      setFirstLogin: (value) =>
        set({
          isFirstLogin: value,
        }),

      clearAuth: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isFirstLogin: false,
        }),
    }),
    {
      name: "auth-storage", // name for the localStorage key
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isFirstLogin: state.isFirstLogin,
        isAuthenticated: state.isAuthenticated,
      }), // only persist these fields
    }
  )
);

// Selectors
export const selectUser = (state) => state.user;
export const selectIsAuthenticated = (state) => state.isAuthenticated;
export const selectToken = (state) => state.token;
export const selectIsFirstLogin = (state) => state.isFirstLogin;

export default useAuthStore;
