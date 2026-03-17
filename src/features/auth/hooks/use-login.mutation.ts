"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api";
import { useAuthStore } from "../stores/auth-store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useLoginMutation = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      setAuth(response.data.access_token, response.data.user);
      queryClient.clear();
      toast.success("Welcome back!");
      router.push("/dashboard");
    },
    onError: (error: string) => {
      toast.error(error.response?.data?.message || "Login failed", {
        position: "top-center",
      });
    },
  });
};
