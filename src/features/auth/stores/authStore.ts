import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "../auth.types";

interface AuthState {
  user: User | null;
  token?: string | undefined;
  setAuth: (userData: User, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: undefined,
      setAuth: (userData: User, token: string) =>
        set({ user: userData, token: token }),
      clearAuth: () => set({ user: null }),
    }),
    {
      name: "renthaven",
    },
  ),
);
