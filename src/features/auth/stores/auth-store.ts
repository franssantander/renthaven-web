import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState } from "../auth.index";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      clearAuth: () => set({ token: null, user: null }),
    }),
    {
      name: "authUser",
    },
  ),
);
