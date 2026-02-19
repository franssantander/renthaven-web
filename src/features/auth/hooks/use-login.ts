import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useAuthStore } from "../store/auth-store";
import { api } from "@/lib/axios";
import { toast } from "sonner";

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (credentials) => {
      const { data } = await api.post("/login", credentials);
      return data;
    },
    onSuccess: (response) => {
      if (response.success) {
        setAuth(response.data.access_token, response.data.user);
        queryClient.clear();

        toast.success(response.message || "Welcome back!");
        router.push("/dashboard");
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Invalid credentials");
    },
  });
};
