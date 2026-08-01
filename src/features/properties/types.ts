export type PropertyType = "dorm" | "apartment" | "condo" | "town_house";

export type Amenity = {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  category: string | null;
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
