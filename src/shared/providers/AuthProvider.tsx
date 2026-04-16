"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";
import { useAuthStore } from "@/features/auth/auth.index";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuth, clearAuth } = useAuthStore();

  useEffect(() => {
    const token = Cookies.get("token");
    if (isAuth && !token) {
      clearAuth();
    }
  }, [isAuth, clearAuth]);

  return <>{children}</>;
};
