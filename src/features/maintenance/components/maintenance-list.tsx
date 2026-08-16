"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getMaintenanceColumns } from "../config/maintenance-columns";
import { MAINTENANCE_PRIORITY_OPTIONS } from "../config/maintenance-priority";
import { MAINTENANCE_STATUS_OPTIONS } from "../config/maintenance-status";
import { useMaintenanceList } from "../hooks/use-maintenance-list";
import type { MaintenancePriority, MaintenanceRequestStatus } from "../types";
import { MaintenanceDashboardCards } from "./maintenance-dashboard-cards";
import { NewMaintenanceRequestDialog } from "./new-maintenance-request-dialog";

export function MaintenanceList() {
  const router = useRouter();
  const {
    requests,
    meta,
    isLoading,
    isFetching,
    isError,
    error,
    page,
    setPage,
    perPage,
    handlePerPageChange,
    status,
    handleStatusChange,
    priority,
    handlePriorityChange,
    refetch,
    createOpen,
    setCreateOpen,
  } = useMaintenanceList();

  const columns = getMaintenanceColumns();

  return (
    <div className="flex flex-col gap-6">
      <MaintenanceDashboardCards />

      <Card>
        <CardHeader>
          <CardTitle>Maintenance requests</CardTitle>
          <CardDescription>
            Track and manage maintenance requests across your properties.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={requests}
            getRowId={(request) => request.uuid}
            isLoading={isLoading}
            isFetching={isFetching}
            isError={isError}
            errorMessage={error?.message}
            emptyMessage="No maintenance requests yet."
            onRefresh={refetch}
            onRowClick={(request) => router.push(`/maintenance/${request.uuid}`)}
            page={page}
            onPageChange={setPage}
            lastPage={meta?.last_page}
            perPage={perPage}
            onPerPageChange={handlePerPageChange}
            toolbarActions={
              <>
                <Select
                  value={status}
                  onValueChange={(
                    value: MaintenanceRequestStatus | "all" | null,
                  ) => value && handleStatusChange(value)}
                >
                  <SelectTrigger size="sm">
                    <SelectValue>
                      {(value: MaintenanceRequestStatus | "all") =>
                        value === "all"
                          ? "All statuses"
                          : MAINTENANCE_STATUS_OPTIONS.find(
                              (option) => option.value === value,
                            )?.label
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    {MAINTENANCE_STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={priority}
                  onValueChange={(
                    value: MaintenancePriority | "all" | null,
                  ) => value && handlePriorityChange(value)}
                >
                  <SelectTrigger size="sm">
                    <SelectValue>
                      {(value: MaintenancePriority | "all") =>
                        value === "all"
                          ? "All priorities"
                          : MAINTENANCE_PRIORITY_OPTIONS.find(
                              (option) => option.value === value,
                            )?.label
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All priorities</SelectItem>
                    {MAINTENANCE_PRIORITY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button onClick={() => setCreateOpen(true)}>
                  <Plus className="size-4" />
                  New request
                </Button>
              </>
            }
          />
        </CardContent>
      </Card>

      <NewMaintenanceRequestDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
