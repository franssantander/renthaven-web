export type PropertyType = "dorm" | "apartment" | "condo" | "town_house";

export type AmenityScope = "property" | "unit" | "both";

export type Amenity = {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  category: string | null;
  scope: AmenityScope;
  icon: string | null;
};

export type PropertyAttachment = {
  id: number;
  uuid: string;
  url: string;
  original_filename: string;
  caption: string | null;
  sort_order: number;
};

export type PropertyTenantBusiness = {
  uuid: string;
  name: string;
  email: string;
  tin: string | null;
  phone: string | null;
  contact_person: string | null;
  business_address: string | null;
  logo_url: string | null;
  status: string | null;
};

export type Property = {
  id: number;
  uuid: string;
  name: string;
  address: string | null;
  type: PropertyType;
  tenant_business: PropertyTenantBusiness | null;
  amenities: Amenity[] | null;
  attachments: PropertyAttachment[] | null;
  profile_image_url: string | null;
};

export type PaginatedProperties = {
  data: Property[];
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

export type ApiSuccess<T> = {
  data: T;
  status: number;
  message: string;
};

export type PropertyListParams = {
  page?: number;
  per_page?: number;
};

export type PropertyColumnActions = {
  onEdit: (property: Property) => void;
  onDelete: (property: Property) => void;
};
