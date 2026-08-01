import {
  Building2,
  LayoutDashboard,
  Settings,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { STAFF_ROLES } from "@/features/auth/lib/role-routes";
import type { UserRole } from "@/features/auth/types";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  roles: UserRole["slug"][];
};

export const navItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: [...STAFF_ROLES],
  },
  {
    href: "/properties",
    label: "Properties",
    icon: Building2,
    roles: [...STAFF_ROLES],
  },
  {
    href: "/tenants",
    label: "Tenants",
    icon: Users,
    roles: [...STAFF_ROLES],
  },
  {
    href: "/maintenance",
    label: "Maintenance",
    icon: Wrench,
    roles: [...STAFF_ROLES],
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
    roles: [...STAFF_ROLES],
  },
];

export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") {
    return pathname === href;
  }
  return pathname.startsWith(href);
}

export function getPageTitle(pathname: string): string {
  const match = navItems.find((item) => isNavItemActive(pathname, item.href));
  return match?.label ?? "Dashboard";
}

export function getNavItemsForRole(
  role: UserRole["slug"] | undefined,
): NavItem[] {
  if (!role) return [];
  return navItems.filter((item) => item.roles.includes(role));
}
