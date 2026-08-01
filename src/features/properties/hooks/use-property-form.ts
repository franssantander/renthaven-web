"use client";

import { useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/axios";
import {
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
} from "../queries/property-query";
import { propertySchema, type PropertyFormValues } from "../schemas/property-schema";
import type { Property } from "../types";

type FieldErrors = Partial<Record<keyof PropertyFormValues, string>>;

function valuesFromProperty(property?: Property | null): PropertyFormValues {
  return property
    ? { name: property.name, address: property.address ?? "", type: property.type }
    : { name: "", address: "", type: "apartment" };
}

export function usePropertyForm({
  property,
  onSuccess,
}: {
  property?: Property | null;
  onSuccess: () => void;
}) {
  const isEditing = !!property;

  const [values, setValues] = useState<PropertyFormValues>(() =>
    valuesFromProperty(property),
  );
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const createMutation = useCreatePropertyMutation();
  const updateMutation = useUpdatePropertyMutation();

  const isPending = isEditing
    ? updateMutation.isPending
    : createMutation.isPending;
  const mutationError = (isEditing
    ? updateMutation.error
    : createMutation.error) as ApiError | null;
  const serverFieldErrors = mutationError?.validationErrors;

  const handleChange =
    (field: keyof PropertyFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const handleTypeChange = (value: PropertyFormValues["type"] | null) => {
    if (!value) return;
    setValues((prev) => ({ ...prev, type: value }));
    setFieldErrors((prev) => ({ ...prev, type: undefined }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = propertySchema.safeParse(values);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      setFieldErrors({
        name: errors.name?.[0],
        address: errors.address?.[0],
        type: errors.type?.[0],
      });
      return;
    }

    setFieldErrors({});

    const onError = (err: unknown) => {
      const apiError = err as ApiError;

      if (apiError.status === 422) {
        const firstFieldError = Object.values(
          apiError.validationErrors ?? {},
        )[0]?.[0];

        toast.error(firstFieldError ?? "Please check the form for errors.");
        return;
      }

      toast.error(apiError.message);
    };

    if (isEditing && property) {
      updateMutation.mutate(
        { uuid: property.uuid, data: result.data },
        {
          onSuccess: () => {
            toast.success("Property updated successfully.");
            onSuccess();
          },
          onError,
        },
      );
      return;
    }

    createMutation.mutate(result.data, {
      onSuccess: () => {
        toast.success("Property created successfully.");
        onSuccess();
      },
      onError,
    });
  };

  return {
    values,
    handleChange,
    handleTypeChange,
    handleSubmit,
    isPending,
    isEditing,
    nameError: fieldErrors.name ?? serverFieldErrors?.name?.[0],
    addressError: fieldErrors.address ?? serverFieldErrors?.address?.[0],
    typeError: fieldErrors.type ?? serverFieldErrors?.type?.[0],
  };
}
