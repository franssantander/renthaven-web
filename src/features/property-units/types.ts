import type { Amenity, ApiSuccess, Property } from "@/features/properties/types";

export type PropertyUnitStatus =
  | "available"
  | "occupied"
  | "partially_occupied"
  | "full"
  | "maintenance";

export type PropertyUnitAttachment = {
  id: number;
  uuid: string;
  url: string;
  original_filename: string;
  caption: string | null;
  sort_order: number;
};

export type PropertyUnit = {
  id: number;
  uuid: string;
  property_id: number;
  name: string;
  capacity: number;
  rent_price: number;
  status: PropertyUnitStatus;
  property: Property | null;
  amenities: Amenity[] | null;
  attachments: PropertyUnitAttachment[] | null;
};

export type PaginatedPropertyUnits = {
  data: PropertyUnit[];
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

export type PropertyUnitListParams = {
  property_uuid: string;
  page?: number;
  per_page?: number;
};

export type DashboardMetricTrend = {
  percentage: number;
  is_positive: boolean;
  is_neutral: boolean;
  label: string;
};

export type DashboardMetric = {
  title: string;
  icon: string;
  value: number;
  trend: DashboardMetricTrend;
};

export type PropertyUnitDashboardMetrics = {
  metrics: DashboardMetric[];
};

export type { ApiSuccess };
