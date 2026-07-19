"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ApiError } from "@/lib/axios";
import { useLogoutMutation } from "@/features/auth/queries/auth-query";

export function useLogout() {
  const router = useRouter();
  const { mutate, isPending } = useLogoutMutation();

  const handleLogout = () => {
    mutate(undefined, {
      onSuccess: () => {
        toast.success("Logged out successfully.");
        router.push("/login");
      },
      onError: (err) => {
        toast.error((err as ApiError).message ?? "Failed to log out.");
      },
    });
  };

  return { handleLogout, isPendingLogout: isPending };
}
