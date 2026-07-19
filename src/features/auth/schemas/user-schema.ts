export type UserRole = {
  role_name: string;
  slug: "super_admin" | "admin" | "staff" | "tenant";
};

export type TenantBusiness = {
  uuid: string;
  name: string;
  email: string;
  tin: string;
  phone: string;
  contact_person: string;
  buusiness_address: string | null;
  logo_url: string | null;
  status: string;
};

export type CurrentUser = {
  id: number;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  full_name: string;
  email: string;
  username: string;
  role: UserRole;
  tenant_business: TenantBusiness;
  permissions: unknown;
};

export type CurrentUserResponse = {
  data: CurrentUser;
  status: number;
  message: string;
};
