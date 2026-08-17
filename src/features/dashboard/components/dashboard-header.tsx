"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/features/notifications/components/notification-bell";
import { getPageTitle } from "../config/nav-items";
import { ThemeToggle } from "./theme-toggle";
import ToggleSidebar from "./toggle-sidebar";

type DashboardHeaderProps = {
  userId: number | undefined;
  isCollapsed: boolean;
  toggleSidebar: () => void;
  onMobileMenuClick: () => void;
};

export function DashboardHeader({
  userId,
  isCollapsed,
  toggleSidebar,
  onMobileMenuClick,
}: DashboardHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-sm supports-backdrop-filter:bg-background/60 sm:px-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMobileMenuClick}
        >
          <Menu className="size-4" />
          <span className="sr-only">Open navigation</span>
        </Button>
        <ToggleSidebar
          className="hidden md:flex"
          isCollapsed={isCollapsed}
          toggleSidebar={toggleSidebar}
        />
        <h1 className="text-sm font-semibold">{getPageTitle(pathname)}</h1>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <NotificationBell userId={userId} />
      </div>
    </header>
  );
}
