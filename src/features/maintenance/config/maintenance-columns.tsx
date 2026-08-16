import type { DataTableColumn } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import type { MaintenanceRequest } from "../types";
import { getMaintenanceCategoryLabel } from "./maintenance-category";
import {
  getMaintenancePriorityBadgeVariant,
  getMaintenancePriorityLabel,
} from "./maintenance-priority";
import {
  getMaintenanceStatusBadgeVariant,
  getMaintenanceStatusLabel,
} from "./maintenance-status";

export function getMaintenanceColumns(): DataTableColumn<MaintenanceRequest>[] {
  return [
    {
      id: "title",
      header: "Request",
      cell: (request) => (
        <div>
          <p className="font-medium">{request.title}</p>
          <p className="text-sm text-muted-foreground">
            {request.renter
              ? `${request.renter.first_name} ${request.renter.last_name}`
              : "Unknown tenant"}
          </p>
        </div>
      ),
    },
    {
      id: "property",
      header: "Property",
      cell: (request) => request.property_unit?.property?.name ?? "—",
    },
    {
      id: "unit",
      header: "Unit",
      cell: (request) => request.property_unit?.name ?? "—",
    },
    {
      id: "category",
      header: "Category",
      cell: (request) => getMaintenanceCategoryLabel(request.category),
    },
    {
      id: "priority",
      header: "Priority",
      cell: (request) => (
        <Badge variant={getMaintenancePriorityBadgeVariant(request.priority)}>
          {getMaintenancePriorityLabel(request.priority)}
        </Badge>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (request) => (
        <Badge variant={getMaintenanceStatusBadgeVariant(request.status)}>
          {getMaintenanceStatusLabel(request.status)}
        </Badge>
      ),
    },
  ];
}
