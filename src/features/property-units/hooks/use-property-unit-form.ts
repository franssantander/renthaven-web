"use client";

import { useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/axios";
import {
  useCreatePropertyUnitMutation,
  useUpdatePropertyUnitMutation,
} from "../queries/property-unit-query";
import {
  propertyUnitSchema,
  type PropertyUnitFormValues,
} from "../schemas/property-unit-schema";
import type { PropertyUnit } from "../types";

type PropertyUnitFormState = {
  name: string;
  capacity: string;
  rent_price: string;
  status: PropertyUnitFormValues["status"];
  amenity_uuids: string[];
};

type FieldErrors = Partial<Record<keyof PropertyUnitFormValues, string>>;

function valuesFromUnit(unit?: PropertyUnit | null): PropertyUnitFormState {
  return unit
    ? {
        name: unit.name,
        capacity: String(unit.capacity),
        rent_price: String(unit.rent_price),
        status: unit.status,
        amenity_uuids: unit.amenities?.map((amenity) => amenity.uuid) ?? [],
      }
    : {
        name: "",
        capacity: "1",
        rent_price: "0",
        status: "available",
        amenity_uuids: [],
      };
}

export function usePropertyUnitForm({
  propertyUuid,
  unit,
  onSuccess,
}: {
  propertyUuid: string;
  unit?: PropertyUnit | null;
  onSuccess: () => void;
}) {
  const isEditing = !!unit;

  const [values, setValues] = useState<PropertyUnitFormState>(() =>
    valuesFromUnit(unit),
  );
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const createMutation = useCreatePropertyUnitMutation(propertyUuid);
  const updateMutation = useUpdatePropertyUnitMutation(propertyUuid);

  const isPending = isEditing
    ? updateMutation.isPending
    : createMutation.isPending;
  const mutationError = (isEditing
    ? updateMutation.error
    : createMutation.error) as ApiError | null;
  const serverFieldErrors = mutationError?.validationErrors;

  const getServerError = (field: keyof PropertyUnitFormValues) =>
    serverFieldErrors?.[field]?.[0] ??
    serverFieldErrors?.[`units.0.${field}`]?.[0];

  const handleChange =
    (field: "name" | "capacity" | "rent_price") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const handleStatusChange = (
    value: PropertyUnitFormValues["status"] | null,
  ) => {
    setValues((prev) => ({ ...prev, status: value ?? undefined }));
  };

  const handleAmenitiesChange = (value: string[]) => {
    setValues((prev) => ({ ...prev, amenity_uuids: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = propertyUnitSchema.safeParse(values);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      setFieldErrors({
        name: errors.name?.[0],
        capacity: errors.capacity?.[0],
        rent_price: errors.rent_price?.[0],
        status: errors.status?.[0],
      });
      return;
    }

    setFieldErrors({});

    try {
      if (isEditing && unit) {
        await updateMutation.mutateAsync({
          uuid: unit.uuid,
          data: result.data,
        });
        toast.success("Unit updated successfully.");
      } else {
        await createMutation.mutateAsync([result.data]);
        toast.success("Unit created successfully.");
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
    handleStatusChange,
    handleAmenitiesChange,
    handleSubmit,
    isPending,
    isEditing,
    nameError: fieldErrors.name ?? getServerError("name"),
    capacityError: fieldErrors.capacity ?? getServerError("capacity"),
    rentPriceError: fieldErrors.rent_price ?? getServerError("rent_price"),
  };
}
