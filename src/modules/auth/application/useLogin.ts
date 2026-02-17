import { useMutation } from "@tanstack/react-query";
import { authRepository } from "../infrastructure/authRepository";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useLogin() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: authRepository.login,
    onSuccess: (response) => {
      setAuth(response.user);

      toast.success(`Welcome back, ${response.user.name}!`);

      if (response.user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/tenant/dashboard");
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Invalid credentials";
      toast.error(message);
    },
  });
}
