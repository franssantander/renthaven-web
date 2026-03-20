import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState } from "../auth.index";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuth: false,
      setAuth: (user) => set({ user, isAuth: true }),
      clearAuth: () => set({ user: null, isAuth: false }),
    }),
    {
      name: "authUser",
    },
  ),
);
