import type { Lease } from "@/features/leases/types";
import type {
  DashboardMetric,
  PropertyUnit,
} from "@/features/property-units/types";
import type { ApiSuccess } from "@/features/properties/types";
import type { Renter } from "@/features/renters/types";

export type MaintenanceCategory =
  | "plumbing"
  | "electrical"
  | "hvac"
  | "appliance"
  | "structural"
  | "pest_control"
  | "other";

export type MaintenancePriority = "low" | "medium" | "high" | "urgent";

export type MaintenanceRequestStatus =
  | "open"
  | "in_progress"
  | "resolved"
  | "cancelled";

export type MaintenanceRequestHistoryAction =
  | "created"
  | "assigned"
  | "status_changed"
  | "resolved"
  | "cancelled";

export type MaintenanceRequestHistory = {
  id: number;
  action: MaintenanceRequestHistoryAction;
  from_status: string | null;
  to_status: string | null;
  notes: string | null;
  performed_by_name: string | null;
  created_at: string;
  time_ago: string;
};

export type MaintenanceRequest = {
  id: number;
  uuid: string;
  property_unit_id: number;
  lease_id: number;
  renter_id: number;
  tenant_business_id: number;
  title: string;
  description: string;
  category: MaintenanceCategory;
  priority: MaintenancePriority;
  status: MaintenanceRequestStatus;
  assigned_to: number | null;
  resolved_at: string | null;
  resolution_notes: string | null;
  lease: Lease | null;
  renter: Renter | null;
  property_unit: PropertyUnit | null;
  histories: MaintenanceRequestHistory[] | null;
};

export type PaginatedMaintenanceRequests = {
  data: MaintenanceRequest[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    path: string;
    per_page: number;
    to: number | null;
    total: number;
  };
};

export type ListMaintenanceRequestsParams = {
  status?: MaintenanceRequestStatus;
  priority?: MaintenancePriority;
  property_unit_uuid?: string;
  page?: number;
  per_page?: number;
};

export type CreateMaintenanceRequestPayload = {
  lease_uuid: string;
  title: string;
  description: string;
  category: MaintenanceCategory;
  priority?: MaintenancePriority;
};

export type UpdateMaintenanceRequestStatusPayload = {
  status: MaintenanceRequestStatus;
  notes?: string;
  assigned_to_uuid?: string;
};

export type MaintenanceDashboardMetrics = {
  metrics: DashboardMetric[];
};

export type { ApiSuccess };
