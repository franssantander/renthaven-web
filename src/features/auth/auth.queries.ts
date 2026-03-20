"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "./auth.api";
import { toast } from "sonner";
import { useAuthStore, User } from "./auth.index";
import type { AxiosError } from "axios";
import { ROUTES } from "@/shared/constants/routes";

const ROLE_REDIRECT: Record<User["role"], string> = {
  superadmin: ROUTES.ADMIN_DASHBOARD,
  admin: ROUTES.ADMIN_DASHBOARD,
  tenant: ROUTES.TENANT_DASHBOARD,
};

export const useLoginMutation = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.login,

    onSuccess: (response) => {
      setAuth(response.data.access_token, response.data.user);
      queryClient.setQueryData(["auth", "me"], response.data.user);
      toast.success("Welcome back!");

      const role = response.data.user.role as User["role"];
      const redirection = ROLE_REDIRECT[role] ?? ROUTES.HOME;

      router.push(redirection);
    },

    onError: (
      error: AxiosError<{ message: string; errors?: Record<string, string[]> }>,
    ) => {
      if (error.response?.status !== 422) return;

      const message = error.response.data?.message;
      if (message) {
        toast.error(message, { position: "top-center" });
      }
    },
  });
};

export const useLogoutMutation = () => {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      clearAuth();
      queryClient.clear();
      router.push("/login");
    },
  });
};

export const useMe = () => {
  const token = useAuthStore((state) => state.token);
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: authApi.me,
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
  });
};
