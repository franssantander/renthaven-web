"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, LogOut, PanelLeft, PanelLeftClose } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { CurrentUser } from "@/features/auth/types";
import { cn } from "@/lib/utils/utils";
import {
  getNavItemsForRole,
  isNavItemActive,
  type NavItem,
} from "../config/nav-items";
import { getInitials } from "../lib/get-initials";
import { useLogout } from "../hooks/use-logout";
import { useSidebar } from "../hooks/use-sidebar";

type DashboardSidebarProps = {
  currentUser: CurrentUser | undefined;
  isMobileNavOpen: boolean;
  onMobileNavOpenChange: (open: boolean) => void;
};

function SidebarBrand({
  isCollapsed,
  toggleButton,
}: {
  isCollapsed: boolean;
  toggleButton?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex h-14 items-center border-b border-sidebar-border",
        isCollapsed ? "justify-center gap-1" : "justify-between gap-2 px-4",
      )}
    >
      {!isCollapsed && (
        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <House className="size-4" />
        </span>
      )}
      {!isCollapsed ? (
        <span className="mr-auto truncate font-semibold">RentHaven</span>
      ) : null}
      {toggleButton}
    </div>
  );
}

function SidebarNav({
  items,
  isCollapsed,
  onNavigate,
}: {
  items: NavItem[];
  isCollapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-1 p-3.5">
      {items.map((item) => {
        const isActive = isNavItemActive(pathname, item.href);

        const link = (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
              isCollapsed && "justify-center px-0",
              isActive &&
                "mx-auto bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground",
            )}
          >
            <item.icon className="size-4 shrink-0" />
            {!isCollapsed ? (
              <span className="truncate">{item.label}</span>
            ) : null}
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

function SidebarUserFooter({
  currentUser,
  isCollapsed,
}: {
  currentUser: CurrentUser | undefined;
  isCollapsed: boolean;
}) {
  const { handleLogout, isPendingLogout } = useLogout();

  if (!currentUser) {
    return null;
  }

  return (
    <div className="border-t border-sidebar-border p-2">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              className={cn(
                "h-auto w-full gap-2 py-1.5",
                isCollapsed ? "justify-center px-0" : "justify-start px-1.5",
              )}
            />
          }
        >
          <Avatar size="sm">
            <AvatarFallback>
              {getInitials(currentUser.full_name)}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed ? (
            <div className="text-left leading-tight">
              <p className="truncate text-sm font-medium">
                {currentUser.full_name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {currentUser.role.role_name}
              </p>
            </div>
          ) : null}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="top"
          align={isCollapsed ? "center" : "start"}
          className="w-56"
        >
          <DropdownMenuLabel>
            <p className="text-sm font-medium">{currentUser.full_name}</p>
            <p className="text-xs font-normal text-muted-foreground">
              {currentUser.role.role_name}
            </p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            disabled={isPendingLogout}
            onClick={handleLogout}
          >
            <LogOut className="size-4" />
            {isPendingLogout ? "Logging out..." : "Log out"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function DashboardSidebar({
  currentUser,
  isMobileNavOpen,
  onMobileNavOpenChange,
}: DashboardSidebarProps) {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const items = getNavItemsForRole(currentUser?.role.slug);

  const toggleButton = (
    <Button
      variant="ghost"
      size="icon"
      className={cn(isCollapsed && "mx-auto")}
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
        <SidebarBrand
          isCollapsed={isCollapsed}
          toggleButton={
            isCollapsed ? (
              <Tooltip>
                <TooltipTrigger render={toggleButton} />
                <TooltipContent side="right">Expand sidebar</TooltipContent>
              </Tooltip>
            ) : (
              toggleButton
            )
          }
        />
        <SidebarNav items={items} isCollapsed={isCollapsed} />
        <SidebarUserFooter
          currentUser={currentUser}
          isCollapsed={isCollapsed}
        />
      </aside>

      <Sheet open={isMobileNavOpen} onOpenChange={onMobileNavOpenChange}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
            <SidebarBrand isCollapsed={false} />
            <SidebarNav
              items={items}
              isCollapsed={false}
              onNavigate={() => onMobileNavOpenChange(false)}
            />
            <SidebarUserFooter currentUser={currentUser} isCollapsed={false} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
