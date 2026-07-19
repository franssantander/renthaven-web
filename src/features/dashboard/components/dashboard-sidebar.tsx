"use client";

import Link from "next/link";
import {
  Building2,
  ChevronLeft,
  House,
  LayoutDashboard,
  Settings,
  Users,
  Wrench,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/utils";
import { useSidebar } from "../hooks/use-sidebar";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/properties", label: "Properties", icon: Building2 },
  { href: "/dashboard/tenants", label: "Tenants", icon: Users },
  { href: "/dashboard/maintenance", label: "Maintenance", icon: Wrench },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardSidebar() {
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <aside
      data-collapsed={isCollapsed}
      className={cn(
        "flex h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <House className="size-4" />
        </span>
        {!isCollapsed ? (
          <span className="truncate font-semibold">RentHaven</span>
        ) : null}
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <item.icon className="size-4 shrink-0" />
            {!isCollapsed ? <span className="truncate">{item.label}</span> : null}
          </Link>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-2">
        <Button
          variant="ghost"
          size="icon"
          className="w-full"
          onClick={toggleSidebar}
        >
          <ChevronLeft
            className={cn("size-4 transition-transform", isCollapsed && "rotate-180")}
          />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>
    </aside>
  );
}
