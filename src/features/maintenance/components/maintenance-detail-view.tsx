"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUsersQuery } from "@/features/user-management/queries/user-management-query";
import { getMaintenanceCategoryLabel } from "../config/maintenance-category";
import {
  getMaintenancePriorityBadgeVariant,
  getMaintenancePriorityLabel,
} from "../config/maintenance-priority";
import {
  getMaintenanceStatusBadgeVariant,
  getMaintenanceStatusLabel,
  isTerminalStatus,
} from "../config/maintenance-status";
import { useMaintenanceDetail } from "../hooks/use-maintenance-detail";
import { UpdateMaintenanceStatusDialog } from "./update-maintenance-status-dialog";

type MaintenanceDetailViewProps = {
  requestUuid: string;
};

export function MaintenanceDetailView({
  requestUuid,
}: MaintenanceDetailViewProps) {
  const { request, isLoading, isError, notFound } =
    useMaintenanceDetail(requestUuid);
  const { data: staff } = useUsersQuery({ per_page: 100 });
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  if (notFound) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          Can&apos;t load this request. Go back to the Maintenance list and
          try again.
        </CardContent>
      </Card>
    );
  }

  if (isLoading || !request) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-destructive">
          Failed to load this request.
        </CardContent>
      </Card>
    );
  }

  const assignee = staff?.data.find((user) => user.id === request.assigned_to);
  const terminal = isTerminalStatus(request.status);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>{request.title}</CardTitle>
              <CardDescription>
                {request.renter
                  ? `${request.renter.first_name} ${request.renter.last_name}`
                  : "Unknown tenant"}
              </CardDescription>
            </div>
            <Button
              onClick={() => setStatusDialogOpen(true)}
              disabled={terminal}
              variant={terminal ? "outline" : "default"}
            >
              {terminal ? "Request closed" : "Update status"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge variant={getMaintenanceStatusBadgeVariant(request.status)}>
              {getMaintenanceStatusLabel(request.status)}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Priority</p>
            <Badge
              variant={getMaintenancePriorityBadgeVariant(request.priority)}
            >
              {getMaintenancePriorityLabel(request.priority)}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Category</p>
            <p className="font-medium">
              {getMaintenanceCategoryLabel(request.category)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Property / Unit</p>
            <p className="font-medium">
              {request.property_unit?.property?.name} —{" "}
              {request.property_unit?.name}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Assigned to</p>
            <p className="font-medium">
              {assignee?.full_name ?? "Unassigned"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-sm">{request.description}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
          <CardDescription>
            Timeline of status changes and updates for this request.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!request.histories || request.histories.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No history yet.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {request.histories.map((entry) => (
                <div
                  key={entry.id}
                  className="flex flex-col gap-1 border-b pb-4 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">
                      {entry.from_status && entry.to_status
                        ? `${entry.from_status} → ${entry.to_status}`
                        : (entry.to_status ?? entry.action)}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {entry.time_ago}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {entry.performed_by_name ?? "Unknown"}
                    {entry.notes ? ` — ${entry.notes}` : ""}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <UpdateMaintenanceStatusDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        request={request}
      />
    </div>
  );
}
