"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { ROUTES } from "@/shared/constants/routes";
import { useAuthStore, User, authApi } from "./auth.index";
import Cookies from "js-cookie";

const ROLE_REDIRECT: Record<User["role"], string> = {
  superadmin: ROUTES.SUPERADMIN,
  admin: ROUTES.ADMIN,
  tenant: ROUTES.TENANT,
};

export const useLoginMutation = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.login,

    onSuccess: (response) => {
      const userData = response.data;
      const { access_token } = userData;

      Cookies.set("token", access_token, { expires: 7, sameSite: "strict" });

      setAuth(userData, access_token);

      queryClient.setQueryData(["auth", "me"], userData);
      toast.success("Welcome back!", { position: "top-center" });

      const role = userData.user.role as User["role"];

      const redirection =
        ROLE_REDIRECT[role] ??
        ROUTES[role.toLocaleLowerCase() as keyof typeof ROUTES] ??
        ROUTES.HOME;

      router.push(redirection);
    },
    onError: (
      error: AxiosError<{ message: string; errors?: Record<string, string[]> }>,
    ) => {
      const message = error.response?.data?.message;
      if (message) {
        toast.error(message, {
          position: "top-center",
        });
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

// export const useMe = () => {
//   const { isAuth } = useAuthStore();

//   return useQuery({
//     queryKey: ["auth", "me"],
//     queryFn: authApi.me,
//     enabled: isAuth,
//     staleTime: 1000 * 60 * 5,
//   });
// };
