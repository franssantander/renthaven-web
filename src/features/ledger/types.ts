import type { Lease } from "@/features/leases/types";
import type {
  DashboardMetric,
  PropertyUnit,
  PropertyUnitAttachment,
} from "@/features/property-units/types";
import type { ApiSuccess } from "@/features/properties/types";
import type { Renter } from "@/features/renters/types";

export type LedgerStatus =
  | "pending"
  | "partially_paid"
  | "paid"
  | "overdue"
  | "submitted";

export type LedgerEntry = {
  id: number;
  uuid: string;
  lease_id: number;
  renter_id: number;
  property_unit_id: number;
  tenant_business_id: number;
  amount: number;
  amount_paid: number;
  penalty_amount: number;
  balance: number;
  period_start: string | null;
  period_end: string | null;
  due_date: string | null;
  status: LedgerStatus;
  paid_at: string | null;
  paid_by: number | null;
  reminder_sent_at: string | null;
  notes: string | null;
  or_number: string | null;
  submitted_at: string | null;
  submitted_amount: number | null;
  submission_reference: string | null;
  submission_notes: string | null;
  lease: Lease | null;
  renter: Renter | null;
  property_unit: PropertyUnit | null;
  attachments: PropertyUnitAttachment[] | null;
};

export type PaginatedLedgerEntries = {
  data: LedgerEntry[];
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

export type ListLedgerEntriesParams = {
  lease_uuid?: string;
  status?: LedgerStatus;
  page?: number;
  per_page?: number;
};

export type MarkPaidPayload = {
  amount?: number;
  notes?: string;
};

export type RejectPaymentPayload = {
  reason?: string;
};

export type LedgerDashboardMetrics = {
  metrics: DashboardMetric[];
};

export type { ApiSuccess };
