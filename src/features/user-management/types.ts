export type UserStatus = "active" | "inactive";

export type UserRoleOption = {
  uuid: string;
  role_name: string;
  slug: string;
};

export type UserTenantBusiness = {
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

export type SystemUser = {
  id: number;
  uuid: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  full_name: string;
  email: string;
  username: string;
  phone: string | null;
  status: UserStatus;
  role: UserRoleOption;
  tenant_business: UserTenantBusiness | null;
};

// UserManagementController::index returns UserData::collect($users) without a
// PaginatedDataCollection cast, which serializes as Laravel's raw (flat)
// paginator JSON — unlike TenantBusinessController::index, which explicitly
// wraps in a data/links/meta envelope. Confirmed against the live API.
export type PaginatedUsers = {
  current_page: number;
  data: SystemUser[];
  from: number | null;
  last_page: number;
  per_page: number;
  to: number | null;
  total: number;
};

export type ApiSuccess<T> = {
  data: T;
  status: number;
  message: string;
};

export type UserListParams = {
  page?: number;
  per_page?: number;
};

export type UserColumnActions = {
  onView: (user: SystemUser) => void;
  onDelete: (user: SystemUser) => void;
};

export type TenantBusinessOption = {
  uuid: string;
  name: string;
};

export type PaginatedTenantBusinessOptions = {
  data: TenantBusinessOption[];
};
