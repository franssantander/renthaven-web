"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, PanelLeft, PanelLeftClose } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils/utils";
import { isNavItemActive, navItems } from "../config/nav-items";
import { useSidebar } from "../hooks/use-sidebar";

type DashboardSidebarProps = {
  isMobileNavOpen: boolean;
  onMobileNavOpenChange: (open: boolean) => void;
};

function SidebarBrand({ isCollapsed }: { isCollapsed: boolean }) {
  return (
    <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
        <House className="size-4" />
      </span>
      {!isCollapsed ? (
        <span className="truncate font-semibold">RentHaven</span>
      ) : null}
    </div>
  );
}

function SidebarNav({
  isCollapsed,
  onNavigate,
}: {
  isCollapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-1 p-2">
      {navItems.map((item) => {
        const isActive = isNavItemActive(pathname, item.href);

        const link = (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
              isActive &&
                "bg-sidebar-accent text-sidebar-accent-foreground",
            )}
          >
            <item.icon className="size-4 shrink-0" />
            {!isCollapsed ? <span className="truncate">{item.label}</span> : null}
          </Link>
        );

        if (!isCollapsed) {
          return link;
        }

        return (
          <Tooltip key={item.href}>
            <TooltipTrigger render={link} />
            <TooltipContent side="right">{item.label}</TooltipContent>
          </Tooltip>
        );
      })}
    </nav>
  );
}

export function DashboardSidebar({
  isMobileNavOpen,
  onMobileNavOpenChange,
}: DashboardSidebarProps) {
  const { isCollapsed, toggleSidebar } = useSidebar();

  const toggleButton = (
    <Button
      variant="ghost"
      size="icon"
      className="w-full"
      onClick={toggleSidebar}
    >
      {isCollapsed ? (
        <PanelLeft className="size-4" />
      ) : (
        <PanelLeftClose className="size-4" />
      )}
      <span className="sr-only">
        {isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      </span>
    </Button>
  );

  return (
    <>
      <aside
        data-collapsed={isCollapsed}
        className={cn(
          "hidden h-full shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all md:flex",
          isCollapsed ? "w-16" : "w-64",
        )}
      >
        <SidebarBrand isCollapsed={isCollapsed} />
        <SidebarNav isCollapsed={isCollapsed} />
        <div className="border-t border-sidebar-border p-2">
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger render={toggleButton} />
              <TooltipContent side="right">
                {isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              </TooltipContent>
            </Tooltip>
          ) : (
            toggleButton
          )}
        </div>
      </aside>

      <Sheet open={isMobileNavOpen} onOpenChange={onMobileNavOpenChange}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
            <SidebarBrand isCollapsed={false} />
            <SidebarNav
              isCollapsed={false}
              onNavigate={() => onMobileNavOpenChange(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
