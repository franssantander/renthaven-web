import type { ApiSuccess } from "@/features/properties/types";

export type Renter = {
  id: number;
  uuid: string;
  user_uuid: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
};

export type PaginatedRenters = {
  data: Renter[];
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

export type RenterSearchParams = {
  search?: string;
  per_page?: number;
};

export type { ApiSuccess };
