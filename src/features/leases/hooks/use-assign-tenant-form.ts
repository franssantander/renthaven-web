"use client";

import { useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/axios";
import { useAssignTenantMutation } from "../queries/lease-query";
import {
  assignTenantSchema,
  type AssignTenantFormValues,
} from "../schemas/lease-schema";

type FormState = {
  mode: AssignTenantFormValues["mode"];
  renter_uuid: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  term_type: AssignTenantFormValues["term_type"];
  start_date: string;
  end_date: string;
  security_deposit: string;
  advance_rent: string;
};

const initialState: FormState = {
  mode: "new",
  renter_uuid: "",
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  term_type: "monthly",
  start_date: "",
  end_date: "",
  security_deposit: "0",
  advance_rent: "0",
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

const EMAIL_PATTERN = /.+@.+\..+/;

export function useAssignTenantForm({
  propertyUnitUuid,
  onSuccess,
}: {
  propertyUnitUuid: string;
  onSuccess: () => void;
}) {
  const [values, setValues] = useState<FormState>(initialState);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const mutation = useAssignTenantMutation();

  const handleChange =
    (field: "first_name" | "last_name" | "email" | "phone" | "start_date" | "end_date" | "security_deposit" | "advance_rent") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const setMode = (mode: FormState["mode"]) => {
    setValues((prev) => ({ ...prev, mode }));
    setFieldErrors({});
  };

  const setTermType = (term_type: FormState["term_type"]) => {
    setValues((prev) => ({ ...prev, term_type }));
    setFieldErrors((prev) => ({ ...prev, end_date: undefined }));
  };

  const setRenterUuid = (renter_uuid: string) => {
    setValues((prev) => ({ ...prev, renter_uuid }));
    setFieldErrors((prev) => ({ ...prev, renter_uuid: undefined }));
  };

  const handleClear = () => {
    setValues(initialState);
    setFieldErrors({});
  };

  const apiError = mutation.error as ApiError | null;
  const serverFieldErrors = apiError?.validationErrors;

  const getServerError = (field: string) =>
    serverFieldErrors?.[field]?.[0] ??
    serverFieldErrors?.[`tenants.0.${field}`]?.[0];

  const fieldError = (field: keyof FieldErrors) =>
    fieldErrors[field] ?? getServerError(field);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = assignTenantSchema.safeParse(values);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      setFieldErrors({
        start_date: errors.start_date?.[0],
        security_deposit: errors.security_deposit?.[0],
        advance_rent: errors.advance_rent?.[0],
      });
      return;
    }

    const data = result.data;
    const nextErrors: FieldErrors = {};

    if (data.term_type === "fixed_term" && !data.end_date) {
      nextErrors.end_date = "End date is required for fixed-term leases.";
    }

    if (data.mode === "existing" && !data.renter_uuid) {
      nextErrors.renter_uuid = "Select a tenant.";
    }

    if (data.mode === "new") {
      if (!data.first_name) nextErrors.first_name = "First name is required.";
      if (!data.last_name) nextErrors.last_name = "Last name is required.";
      if (!data.email) {
        nextErrors.email = "Email is required.";
      } else if (!EMAIL_PATTERN.test(data.email)) {
        nextErrors.email = "Enter a valid email address.";
      }
    }

    if (Object.keys(nextErrors).length) {
      setFieldErrors(nextErrors);
      return;
    }

    setFieldErrors({});

    const tenant =
      data.mode === "existing"
        ? {
            uuid: data.renter_uuid!,
            security_deposit: data.security_deposit,
            advance_rent: data.advance_rent,
          }
        : {
            first_name: data.first_name!,
            last_name: data.last_name!,
            email: data.email!,
            phone: data.phone || undefined,
            security_deposit: data.security_deposit,
            advance_rent: data.advance_rent,
          };

    try {
      await mutation.mutateAsync({
        property_unit_uuid: propertyUnitUuid,
        term_type: data.term_type,
        start_date: data.start_date,
        end_date: data.end_date || undefined,
        tenants: [tenant],
      });

      toast.success("Tenant assigned successfully.");
      handleClear();
      onSuccess();
    } catch (err) {
      const error = err as ApiError;

      if (error.status === 422) {
        const firstFieldError = Object.values(
          error.validationErrors ?? {},
        )[0]?.[0];

        toast.error(firstFieldError ?? "Please check the form for errors.");
        return;
      }

      toast.error(error.message);
    }
  };

  return {
    values,
    fieldError,
    handleChange,
    setMode,
    setTermType,
    setRenterUuid,
    handleSubmit,
    handleClear,
    isPending: mutation.isPending,
  };
}
