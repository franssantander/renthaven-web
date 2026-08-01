"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useCurrentUserQuery } from "../queries/auth-query";
import type { UserRole } from "../types";
import { getRoleHomePath } from "../lib/role-routes";

export function useRoleGate(allowedRoles: readonly UserRole["slug"][]) {
  const router = useRouter();
  const { data, isLoading, isError } = useCurrentUserQuery();
  const currentUser = data?.data;
  const isAllowedRole =
    !!currentUser && allowedRoles.includes(currentUser.role.slug);

  useEffect(() => {
    if (isError) {
      return;
    }

    if (!isLoading && currentUser && !isAllowedRole) {
      router.replace(getRoleHomePath(currentUser.role.slug));
    }
  }, [isLoading, isError, currentUser, isAllowedRole, router]);

  return {
    isReady: !isLoading && !isError && isAllowedRole,
    currentUser,
  };
}
