"use client";

import { useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/axios";
import { useCreateMaintenanceRequestMutation } from "../queries/maintenance-query";
import {
  createMaintenanceRequestSchema,
  type CreateMaintenanceRequestFormValues,
} from "../schemas/maintenance-schema";

type FormState = CreateMaintenanceRequestFormValues;

const initialState: FormState = {
  lease_uuid: "",
  title: "",
  description: "",
  category: "other",
  priority: "medium",
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

export function useCreateMaintenanceRequestForm({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [values, setValues] = useState<FormState>(initialState);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const mutation = useCreateMaintenanceRequestMutation();

  const handleChange =
    (field: "title" | "description") =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const setCategory = (category: FormState["category"]) => {
    setValues((prev) => ({ ...prev, category }));
  };

  const setPriority = (priority: FormState["priority"]) => {
    setValues((prev) => ({ ...prev, priority }));
  };

  const setLeaseUuid = (lease_uuid: string) => {
    setValues((prev) => ({ ...prev, lease_uuid }));
    setFieldErrors((prev) => ({ ...prev, lease_uuid: undefined }));
  };

  const handleClear = () => {
    setValues(initialState);
    setFieldErrors({});
  };

  const apiError = mutation.error as ApiError | null;
  const serverFieldErrors = apiError?.validationErrors;

  const fieldError = (field: keyof FieldErrors) =>
    fieldErrors[field] ?? serverFieldErrors?.[field]?.[0];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = createMaintenanceRequestSchema.safeParse(values);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      setFieldErrors({
        lease_uuid: errors.lease_uuid?.[0],
        title: errors.title?.[0],
        description: errors.description?.[0],
      });
      return;
    }

    setFieldErrors({});

    try {
      await mutation.mutateAsync(result.data);
      toast.success("Maintenance request created successfully.");
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
    setCategory,
    setPriority,
    setLeaseUuid,
    handleSubmit,
    handleClear,
    isPending: mutation.isPending,
  };
}
