"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useCurrentUserQuery } from "@/features/auth/queries/auth-query";
import type { UserRole } from "@/features/auth/schemas/user-schema";

const ALLOWED_ROLES: ReadonlyArray<UserRole["slug"]> = [
  "super_admin",
  "admin",
  "staff",
];

export function useDashboardGate() {
  const router = useRouter();
  const { data, isLoading, isError } = useCurrentUserQuery();

  const currentUser = data?.data;
  const isAllowedRole =
    !!currentUser && ALLOWED_ROLES.includes(currentUser.role.slug);

  useEffect(() => {
    if (isError) {
      return;
    }

    if (!isLoading && currentUser && !isAllowedRole) {
      router.replace("/login");
    }
  }, [isLoading, isError, currentUser, isAllowedRole, router]);

  return {
    isReady: !isLoading && !isError && isAllowedRole,
    currentUser,
  };
}
