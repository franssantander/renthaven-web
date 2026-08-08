"use client";

import { MoreHorizontal, Repeat, UserPlus, UserX } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import type { Lease } from "@/features/leases/types";
import type { PropertyUnit } from "../types";

type UnitTenantsSectionProps = {
  unit: PropertyUnit;
  leases: Lease[];
  isLoading: boolean;
  editMode: boolean;
  onAssignTenant: () => void;
  onReassign: (lease: Lease) => void;
  onRemove: (lease: Lease) => void;
};

export function UnitTenantsSection({
  unit,
  leases,
  isLoading,
  editMode,
  onAssignTenant,
  onReassign,
  onRemove,
}: UnitTenantsSectionProps) {
  const canAssignMore = unit.occupied_count < unit.capacity;

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Tenants</CardTitle>
        {editMode ? (
          <Button size="sm" disabled={!canAssignMore} onClick={onAssignTenant}>
            <UserPlus className="size-4" />
            Assign tenant
          </Button>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {isLoading ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        ) : leases.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No tenants assigned to this unit yet.
          </p>
        ) : (
          leases.map((lease) => (
            <div
              key={lease.uuid}
              className="flex items-center justify-between gap-4 rounded-md border p-3"
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {lease.renter
                      ? `${lease.renter.first_name[0]}${lease.renter.last_name[0]}`
                      : "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {lease.renter
                      ? `${lease.renter.first_name} ${lease.renter.last_name}`
                      : "Unknown tenant"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {lease.renter?.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {lease.term_type === "monthly" ? "Monthly" : "Fixed term"}
                </Badge>
                {editMode ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={<Button variant="ghost" size="icon-sm" />}
                    >
                      <MoreHorizontal className="size-4" />
                      <span className="sr-only">Open actions</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onReassign(lease)}>
                        <Repeat className="size-4" />
                        Reassign
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => onRemove(lease)}
                      >
                        <UserX className="size-4" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : null}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
