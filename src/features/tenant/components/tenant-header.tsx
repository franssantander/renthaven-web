"use client";

import { LogOut } from "lucide-react";

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
import type { CurrentUser } from "@/features/auth/types";
import { useLogout } from "@/features/dashboard/hooks/use-logout";

type TenantHeaderProps = {
  currentUser: CurrentUser | undefined;
};

function getInitials(fullName: string): string {
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export function TenantHeader({ currentUser }: TenantHeaderProps) {
  const { handleLogout, isPendingLogout } = useLogout();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-sm supports-backdrop-filter:bg-background/60 sm:px-6">
      <h1 className="text-sm font-semibold">Tenant Portal</h1>

      {currentUser ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="h-auto gap-2 px-1.5 py-1" />
            }
          >
            <Avatar size="sm">
              <AvatarFallback>
                {getInitials(currentUser.full_name)}
              </AvatarFallback>
            </Avatar>
            <div className="hidden text-left leading-tight sm:block">
              <p className="text-sm font-medium">{currentUser.full_name}</p>
              <p className="text-xs text-muted-foreground">
                {currentUser.role.role_name}
              </p>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
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
      ) : null}
    </header>
  );
}
