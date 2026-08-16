import type { ApiSuccess } from "@/features/properties/types";

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
  amount: number;
  amount_paid: number;
  penalty_amount: number;
  balance: number;
  period_start: string | null;
  period_end: string | null;
  due_date: string | null;
  status: LedgerStatus;
  paid_at: string | null;
  notes: string | null;
  or_number: string | null;
  submitted_at: string | null;
  submitted_amount: number | null;
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

export type { ApiSuccess };
