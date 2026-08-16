"use client";

import { useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/axios";
import { useUpdateMaintenanceStatusMutation } from "../queries/maintenance-query";
import {
  updateMaintenanceStatusSchema,
  type UpdateMaintenanceStatusFormValues,
} from "../schemas/maintenance-schema";
import type { MaintenanceRequest } from "../types";

type FormState = UpdateMaintenanceStatusFormValues;

type FieldErrors = Partial<Record<keyof FormState, string>>;

function initialStateFor(request: MaintenanceRequest | null): FormState {
  return {
    status: request?.status ?? "open",
    notes: "",
    assigned_to_uuid: undefined,
  };
}

export function useUpdateMaintenanceStatusForm({
  requestUuid,
  onSuccess,
}: {
  requestUuid: string;
  onSuccess: () => void;
}) {
  const [values, setValues] = useState<FormState>(initialStateFor(null));
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const mutation = useUpdateMaintenanceStatusMutation();

  const resetTo = (request: MaintenanceRequest | null) => {
    setValues(initialStateFor(request));
    setFieldErrors({});
  };

  const setStatus = (status: FormState["status"]) => {
    setValues((prev) => ({ ...prev, status }));
    setFieldErrors((prev) => ({ ...prev, status: undefined }));
  };

  const setNotes = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValues((prev) => ({ ...prev, notes: event.target.value }));
  };

  const setAssignedToUuid = (assigned_to_uuid: string | undefined) => {
    setValues((prev) => ({ ...prev, assigned_to_uuid }));
  };

  const apiError = mutation.error as ApiError | null;
  const serverFieldErrors = apiError?.validationErrors;

  const fieldError = (field: keyof FieldErrors) =>
    fieldErrors[field] ?? serverFieldErrors?.[field]?.[0];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = updateMaintenanceStatusSchema.safeParse(values);

    if (!result.success) {
      setFieldErrors({
        status: result.error.flatten().fieldErrors.status?.[0],
      });
      return;
    }

    setFieldErrors({});

    try {
      await mutation.mutateAsync({ uuid: requestUuid, data: result.data });
      toast.success("Maintenance request updated successfully.");
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
    resetTo,
    setStatus,
    setNotes,
    setAssignedToUuid,
    handleSubmit,
    isPending: mutation.isPending,
  };
}
