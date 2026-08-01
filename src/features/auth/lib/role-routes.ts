import type { UserRole } from "../types";

export const STAFF_ROLES: readonly UserRole["slug"][] = [
  "super_admin",
  "admin",
  "staff",
];

export const TENANT_ROLES: readonly UserRole["slug"][] = ["tenant"];

export function getRoleHomePath(slug: UserRole["slug"]): string {
  return slug === "tenant" ? "/tenant/dashboard" : "/dashboard";
}
