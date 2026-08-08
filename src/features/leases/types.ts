import type { PropertyUnit } from "@/features/property-units/types";
import type { ApiSuccess } from "@/features/properties/types";
import type { Renter } from "@/features/renters/types";

export type LeaseTermType = "fixed_term" | "monthly";

export type DepositStatus =
  | "held"
  | "partially_refunded"
  | "refunded"
  | "forfeited";

export type Lease = {
  id: number;
  uuid: string;
  term_type: LeaseTermType;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  security_deposit: number;
  advance_rent: number;
  advance_rent_applied_at: string | null;
  deposit_status: DepositStatus;
  deposit_deductions: { description: string; amount: number }[] | null;
  deposit_refunded_amount: number | null;
  deposit_refunded_at: string | null;
  property_unit: PropertyUnit | null;
  renter: Renter | null;
};

export type PaginatedLeases = {
  data: Lease[];
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

export type ListLeasesParams = {
  property_unit_uuid: string;
  page?: number;
  per_page?: number;
};

export type LeaseTenantInput =
  | { uuid: string; security_deposit?: number; advance_rent?: number }
  | {
      first_name: string;
      last_name: string;
      email: string;
      phone?: string;
      security_deposit?: number;
      advance_rent?: number;
    };

export type CreateLeasePayload = {
  property_unit_uuid: string;
  term_type: LeaseTermType;
  start_date: string;
  end_date?: string;
  tenants: LeaseTenantInput[];
};

export type ReassignLeasePayload = {
  property_unit_uuid: string;
  move_date?: string;
};

export type TerminateLeasePayload = {
  move_out_date: string;
  notes?: string;
};

export type { ApiSuccess };
