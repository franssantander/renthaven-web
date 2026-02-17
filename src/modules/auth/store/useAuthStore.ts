import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  username: string;
  email: string;
  name: string;
  role: "admin" | "tenant" | "superadmin";
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setAuth: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: "renthaven-auth" },
  ),
);
