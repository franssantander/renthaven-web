"use client";

import { useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/axios";
import { useCurrentUserQuery } from "@/features/auth/queries/auth-query";
import {
  useCreateUserMutation,
  useUpdateUserMutation,
} from "../queries/user-management-query";
import { createUserSchema, updateUserSchema } from "../schemas/user-schema";
import type {
  CreateUserPayload,
  UpdateUserPayload,
} from "../services/user-management-service";
import type { SystemUser } from "../types";

type FormValues = {
  first_name: string;
  middle_name: string;
  last_name: string;
  username: string;
  email: string;
  role_uuid: string;
  tenant_business_uuid: string;
  password: string;
  password_confirmation: string;
};

type FieldErrors = Partial<Record<keyof FormValues, string>>;

function valuesFromUser(user?: SystemUser | null): FormValues {
  return {
    first_name: user?.first_name ?? "",
    middle_name: user?.middle_name ?? "",
    last_name: user?.last_name ?? "",
    username: user?.username ?? "",
    email: user?.email ?? "",
    role_uuid: user?.role.uuid ?? "",
    tenant_business_uuid: user?.tenant_business?.uuid ?? "",
    password: "",
    password_confirmation: "",
  };
}

export function useUserForm({
  mode,
  user,
  onSuccess,
}: {
  mode: "create" | "edit";
  user?: SystemUser | null;
  onSuccess: () => void;
}) {
  const isEditing = mode === "edit";

  const { data: currentUserData } = useCurrentUserQuery();
  const isSuperAdmin = currentUserData?.data.role.slug === "super_admin";

  const [values, setValues] = useState<FormValues>(() =>
    valuesFromUser(user),
  );
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const createMutation = useCreateUserMutation();
  const updateMutation = useUpdateUserMutation();

  const isPending = isEditing
    ? updateMutation.isPending
    : createMutation.isPending;

  const handleChange =
    (field: keyof FormValues) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const handleRoleChange = (value: string | null) => {
    if (!value) return;
    setValues((prev) => ({ ...prev, role_uuid: value }));
    setFieldErrors((prev) => ({ ...prev, role_uuid: undefined }));
  };

  const handleTenantBusinessChange = (value: string | null) => {
    if (!value) return;
    setValues((prev) => ({ ...prev, tenant_business_uuid: value }));
    setFieldErrors((prev) => ({ ...prev, tenant_business_uuid: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const schema = isEditing ? updateUserSchema : createUserSchema;
    const result = schema.safeParse(values);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      setFieldErrors({
        first_name: errors.first_name?.[0],
        middle_name: errors.middle_name?.[0],
        last_name: errors.last_name?.[0],
        username: errors.username?.[0],
        email: errors.email?.[0],
        role_uuid: errors.role_uuid?.[0],
        password: errors.password?.[0],
        password_confirmation: errors.password_confirmation?.[0],
      });
      return;
    }

    if (isSuperAdmin && !values.tenant_business_uuid) {
      setFieldErrors((prev) => ({
        ...prev,
        tenant_business_uuid: "Please select a business",
      }));
      return;
    }

    setFieldErrors({});

    try {
      if (isEditing && user) {
        const payload: UpdateUserPayload = {
          first_name: values.first_name,
          middle_name: values.middle_name || undefined,
          last_name: values.last_name,
          username: values.username,
          email: values.email,
          role_uuid: values.role_uuid,
        };

        if (values.password) {
          payload.password = values.password;
          payload.password_confirmation = values.password_confirmation;
        }

        if (isSuperAdmin) {
          payload.tenant_business_uuid = values.tenant_business_uuid;
        }

        await updateMutation.mutateAsync({ uuid: user.uuid, data: payload });
        toast.success("User updated successfully.");
      } else {
        const payload: CreateUserPayload = {
          first_name: values.first_name,
          middle_name: values.middle_name || undefined,
          last_name: values.last_name,
          username: values.username,
          email: values.email,
          password: values.password,
          password_confirmation: values.password_confirmation,
          role_uuid: values.role_uuid,
        };

        if (isSuperAdmin) {
          payload.tenant_business_uuid = values.tenant_business_uuid;
        }

        await createMutation.mutateAsync(payload);
        toast.success("User created successfully.");
      }

      onSuccess();
    } catch (err) {
      const apiError = err as ApiError;

      if (apiError.status === 422) {
        const firstFieldError = Object.values(
          apiError.validationErrors ?? {},
        )[0]?.[0];

        toast.error(firstFieldError ?? "Please check the form for errors.");
        return;
      }

      toast.error(apiError.message);
    }
  };

  return {
    values,
    handleChange,
    handleRoleChange,
    handleTenantBusinessChange,
    handleSubmit,
    isPending,
    isEditing,
    isSuperAdmin,
    firstNameError: fieldErrors.first_name,
    middleNameError: fieldErrors.middle_name,
    lastNameError: fieldErrors.last_name,
    usernameError: fieldErrors.username,
    emailError: fieldErrors.email,
    roleError: fieldErrors.role_uuid,
    tenantBusinessError: fieldErrors.tenant_business_uuid,
    passwordError: fieldErrors.password,
    passwordConfirmationError: fieldErrors.password_confirmation,
  };
}
