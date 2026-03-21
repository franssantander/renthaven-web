"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquare01Icon,
  Building01Icon,
  UserMultiple02Icon,
  CalendarCheckIn01Icon,
  ChartLineData01Icon,
  Settings01Icon,
  Logout01Icon,
  Menu01Icon,
  Notification02Icon,
  Moon02Icon,
  Sun01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/features/auth/auth.index";
import { useLogoutMutation } from "@/features/auth/auth.queries";
import { cn } from "@/shared/lib/utils";

import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

// ─── Nav items ────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: DashboardSquare01Icon },
  { label: "Properties", href: "/admin/properties", icon: Building01Icon },
  { label: "Tenants", href: "/admin/tenants", icon: UserMultiple02Icon },
  { label: "Bookings", href: "/admin/bookings", icon: CalendarCheckIn01Icon },
  { label: "Reports", href: "/admin/reports", icon: ChartLineData01Icon },
  { label: "Settings", href: "/admin/settings", icon: Settings01Icon },
] as const;

// ─── NavLink ──────────────────────────────────────────────────────────────────

interface NavLinkProps {
  item: (typeof NAV_ITEMS)[number];
  isActive: boolean;
  collapsed: boolean;
  onClick?: () => void;
}

const NavLink = ({ item, isActive, collapsed, onClick }: NavLinkProps) => {
  const link = (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        collapsed && "justify-center px-2.5",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
      )}
    >
      <HugeiconsIcon
        icon={item.icon}
        strokeWidth={isActive ? 2 : 1.5}
        className="h-[18px] w-[18px] shrink-0"
      />
      {!collapsed && <span>{item.label}</span>}
    </Link>
  );

  if (!collapsed) return link;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">{item.label}</TooltipContent>
    </Tooltip>
  );
};

// ─── Sidebar inner content (reused in desktop + mobile Sheet) ─────────────────

interface SidebarInnerProps {
  collapsed?: boolean;
  onNavClick?: () => void;
}

const SidebarInner = ({ collapsed = false, onNavClick }: SidebarInnerProps) => {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const { mutate: logout, isPending } = useLogoutMutation();

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-border px-4",
          collapsed ? "justify-center" : "gap-3",
        )}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
          <HugeiconsIcon
            icon={Building01Icon}
            className="h-4 w-4 text-primary-foreground"
          />
        </div>
        {!collapsed && (
          <span className="text-sm font-semibold tracking-tight">
            RentHaven
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-2">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <NavLink
              key={item.href}
              item={item}
              isActive={isActive}
              collapsed={collapsed}
              onClick={onNavClick}
            />
          );
        })}
      </nav>

      <Separator />

      {/* User + logout */}
      <div className="space-y-1 p-2">
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2",
            collapsed && "justify-center px-2.5",
          )}
        >
          <Avatar className="h-7 w-7 shrink-0">
            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
              {user?.name?.charAt(0).toUpperCase() ?? "A"}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-xs font-medium text-foreground">
                {user?.name ?? "Admin"}
              </span>
              <span className="text-[10px] capitalize text-muted-foreground">
                {user?.role ?? "admin"}
              </span>
            </div>
          )}
        </div>

        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => logout()}
                disabled={isPending}
                className="w-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                <HugeiconsIcon
                  icon={Logout01Icon}
                  strokeWidth={1.5}
                  className="h-[18px] w-[18px]"
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Logout</TooltipContent>
          </Tooltip>
        ) : (
          <Button
            variant="ghost"
            onClick={() => logout()}
            disabled={isPending}
            className="w-full justify-start gap-3 px-3 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <HugeiconsIcon
              icon={Logout01Icon}
              strokeWidth={1.5}
              className="h-[18px] w-[18px] shrink-0"
            />
            <span className="text-sm font-medium">
              {isPending ? "Signing out..." : "Logout"}
            </span>
          </Button>
        )}
      </div>
    </div>
  );
};

// ─── AdminShell ───────────────────────────────────────────────────────────────

export const AdminShell = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const { mutate: logout } = useLogoutMutation();

  const currentPage =
    NAV_ITEMS.find(
      (i) => pathname === i.href || pathname.startsWith(i.href + "/"),
    )?.label ?? "Dashboard";

  return (
    <TooltipProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        {/* ── Desktop sidebar ── */}
        <aside
          className={cn(
            "relative hidden flex-col border-r border-border bg-card transition-all duration-300 ease-in-out md:flex",
            collapsed ? "w-[68px]" : "w-[240px]",
          )}
        >
          <SidebarInner collapsed={collapsed} />

          {/* Collapse toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3.5 top-[4.5rem] h-7 w-7 rounded-full shadow-sm"
          >
            <HugeiconsIcon
              icon={collapsed ? ArrowRight01Icon : ArrowLeft01Icon}
              strokeWidth={2}
              className="h-3.5 w-3.5"
            />
          </Button>
        </aside>

        {/* ── Mobile sidebar (Sheet) ── */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-[240px] p-0">
            <SidebarInner onNavClick={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* ── Main content ── */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Topbar */}
          <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-4 md:px-6">
            <div className="flex items-center gap-3">
              {/* Mobile menu trigger */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileOpen(true)}
              >
                <HugeiconsIcon
                  icon={Menu01Icon}
                  strokeWidth={1.5}
                  className="h-5 w-5"
                />
              </Button>

              <div className="flex flex-col">
                <h1 className="text-sm font-semibold text-foreground">
                  {currentPage}
                </h1>
                <p className="hidden text-xs text-muted-foreground sm:block">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Theme toggle */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                <HugeiconsIcon
                  icon={theme === "dark" ? Sun01Icon : Moon02Icon}
                  strokeWidth={1.5}
                  className="h-4 w-4"
                />
              </Button>

              {/* Notifications */}
              <Button variant="outline" size="icon" className="relative">
                <HugeiconsIcon
                  icon={Notification02Icon}
                  strokeWidth={1.5}
                  className="h-4 w-4"
                />
                <Badge className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full p-0 text-[9px]">
                  3
                </Badge>
              </Button>

              {/* User dropdown */}
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </TooltipProvider>
  );
};
