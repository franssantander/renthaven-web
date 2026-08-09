"use client";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRolesQuery } from "../queries/role-query";
import { useTenantBusinessOptionsQuery } from "../queries/tenant-business-query";
import type { useUserForm } from "../hooks/use-user-form";

type UserFormFieldsProps = ReturnType<typeof useUserForm> & {
  idPrefix: string;
};

export function UserFormFields({
  idPrefix,
  values,
  handleChange,
  handleRoleChange,
  handleTenantBusinessChange,
  isEditing,
  isSuperAdmin,
  firstNameError,
  middleNameError,
  lastNameError,
  usernameError,
  emailError,
  roleError,
  tenantBusinessError,
  passwordError,
  passwordConfirmationError,
}: UserFormFieldsProps) {
  const { data: roles, isLoading: isLoadingRoles } = useRolesQuery();
  const { data: tenantBusinesses, isLoading: isLoadingTenantBusinesses } =
    useTenantBusinessOptionsQuery(isSuperAdmin);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <Field invalid={!!firstNameError}>
          <FieldLabel htmlFor={`${idPrefix}-first-name`}>
            First name
          </FieldLabel>
          <Input
            id={`${idPrefix}-first-name`}
            value={values.first_name}
            onChange={handleChange("first_name")}
            aria-invalid={!!firstNameError}
          />
          {firstNameError ? <FieldError>{firstNameError}</FieldError> : null}
        </Field>

        <Field invalid={!!lastNameError}>
          <FieldLabel htmlFor={`${idPrefix}-last-name`}>Last name</FieldLabel>
          <Input
            id={`${idPrefix}-last-name`}
            value={values.last_name}
            onChange={handleChange("last_name")}
            aria-invalid={!!lastNameError}
          />
          {lastNameError ? <FieldError>{lastNameError}</FieldError> : null}
        </Field>
      </div>

      <Field invalid={!!middleNameError}>
        <FieldLabel htmlFor={`${idPrefix}-middle-name`}>
          Middle name
        </FieldLabel>
        <Input
          id={`${idPrefix}-middle-name`}
          value={values.middle_name}
          onChange={handleChange("middle_name")}
          aria-invalid={!!middleNameError}
        />
        {middleNameError ? <FieldError>{middleNameError}</FieldError> : null}
      </Field>

      <Field invalid={!!usernameError}>
        <FieldLabel htmlFor={`${idPrefix}-username`}>Username</FieldLabel>
        <Input
          id={`${idPrefix}-username`}
          value={values.username}
          onChange={handleChange("username")}
          aria-invalid={!!usernameError}
        />
        {usernameError ? <FieldError>{usernameError}</FieldError> : null}
      </Field>

      <Field invalid={!!emailError}>
        <FieldLabel htmlFor={`${idPrefix}-email`}>Email</FieldLabel>
        <Input
          id={`${idPrefix}-email`}
          type="email"
          value={values.email}
          onChange={handleChange("email")}
          aria-invalid={!!emailError}
        />
        {emailError ? <FieldError>{emailError}</FieldError> : null}
      </Field>

      <Field invalid={!!roleError}>
        <FieldLabel htmlFor={`${idPrefix}-role`}>Role</FieldLabel>
        <Select
          value={values.role_uuid || null}
          onValueChange={handleRoleChange}
          disabled={isLoadingRoles}
        >
          <SelectTrigger id={`${idPrefix}-role`} className="w-full">
            <SelectValue>
              {(value: string) =>
                roles?.find((role) => role.uuid === value)?.role_name ??
                (isLoadingRoles ? "Loading roles..." : "Select a role")
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {roles?.map((role) => (
              <SelectItem key={role.uuid} value={role.uuid}>
                {role.role_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {roleError ? <FieldError>{roleError}</FieldError> : null}
      </Field>

      {isSuperAdmin ? (
        <Field invalid={!!tenantBusinessError}>
          <FieldLabel htmlFor={`${idPrefix}-tenant-business`}>
            Business
          </FieldLabel>
          <Select
            value={values.tenant_business_uuid || null}
            onValueChange={handleTenantBusinessChange}
            disabled={isLoadingTenantBusinesses}
          >
            <SelectTrigger id={`${idPrefix}-tenant-business`} className="w-full">
              <SelectValue>
                {(value: string) =>
                  tenantBusinesses?.find((business) => business.uuid === value)
                    ?.name ??
                  (isLoadingTenantBusinesses
                    ? "Loading businesses..."
                    : "Select a business")
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {tenantBusinesses?.map((business) => (
                <SelectItem key={business.uuid} value={business.uuid}>
                  {business.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {tenantBusinessError ? (
            <FieldError>{tenantBusinessError}</FieldError>
          ) : null}
        </Field>
      ) : null}

      <Field invalid={!!passwordError}>
        <FieldLabel htmlFor={`${idPrefix}-password`}>
          {isEditing ? "New password (optional)" : "Password"}
        </FieldLabel>
        <Input
          id={`${idPrefix}-password`}
          type="password"
          value={values.password}
          onChange={handleChange("password")}
          aria-invalid={!!passwordError}
          placeholder={isEditing ? "Leave blank to keep current password" : undefined}
          autoComplete="new-password"
        />
        {passwordError ? <FieldError>{passwordError}</FieldError> : null}
      </Field>

      <Field invalid={!!passwordConfirmationError}>
        <FieldLabel htmlFor={`${idPrefix}-password-confirmation`}>
          Confirm password
        </FieldLabel>
        <Input
          id={`${idPrefix}-password-confirmation`}
          type="password"
          value={values.password_confirmation}
          onChange={handleChange("password_confirmation")}
          aria-invalid={!!passwordConfirmationError}
          autoComplete="new-password"
        />
        {passwordConfirmationError ? (
          <FieldError>{passwordConfirmationError}</FieldError>
        ) : null}
      </Field>
    </div>
  );
}
