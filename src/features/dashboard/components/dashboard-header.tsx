"use client";

import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { CurrentUser } from "@/features/auth/types";
import { useLogout } from "../hooks/use-logout";

type DashboardHeaderProps = {
  currentUser: CurrentUser | undefined;
};

export function DashboardHeader({ currentUser }: DashboardHeaderProps) {
  const { handleLogout, isPendingLogout } = useLogout();

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-6">
      <h1 className="text-sm font-semibold">Dashboard</h1>

      <div className="flex items-center gap-3">
        {currentUser ? (
          <div className="text-right leading-tight">
            <p className="text-sm font-medium">{currentUser.full_name}</p>
            <p className="text-xs text-muted-foreground">
              {currentUser.role.role_name}
            </p>
          </div>
        ) : null}

        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          disabled={isPendingLogout}
        >
          <LogOut className="size-4" />
          {isPendingLogout ? "Logging out..." : "Log out"}
        </Button>
      </div>
    </header>
  );
}
