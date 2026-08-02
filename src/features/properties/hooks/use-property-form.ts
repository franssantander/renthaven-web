"use client";

import { useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/axios";
import {
  useCreatePropertyMutation,
  useDeletePropertyAttachmentMutation,
  useSyncPropertyAmenitiesMutation,
  useUpdatePropertyMutation,
} from "../queries/property-query";
import { propertySchema, type PropertyFormValues } from "../schemas/property-schema";
import type { Property } from "../types";

type FieldErrors = Partial<Record<keyof PropertyFormValues, string>>;

function valuesFromProperty(property?: Property | null): PropertyFormValues {
  return property
    ? {
        name: property.name,
        address: property.address ?? "",
        type: property.type,
        profile_image: null,
        amenity_uuids: property.amenities?.map((amenity) => amenity.uuid) ?? [],
      }
    : {
        name: "",
        address: "",
        type: "apartment",
        profile_image: null,
        amenity_uuids: [],
      };
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
  const syncAmenitiesMutation = useSyncPropertyAmenitiesMutation();
  const deleteAttachmentMutation = useDeletePropertyAttachmentMutation();

  const isPending = isEditing
    ? updateMutation.isPending ||
      syncAmenitiesMutation.isPending ||
      deleteAttachmentMutation.isPending
    : createMutation.isPending || syncAmenitiesMutation.isPending;
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

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setValues((prev) => ({ ...prev, profile_image: file }));
    setFieldErrors((prev) => ({ ...prev, profile_image: undefined }));
  };

  const handleAmenitiesChange = (value: string[]) => {
    setValues((prev) => ({ ...prev, amenity_uuids: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = propertySchema.safeParse(values);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      setFieldErrors({
        name: errors.name?.[0],
        address: errors.address?.[0],
        type: errors.type?.[0],
        profile_image: errors.profile_image?.[0],
      });
      return;
    }

    setFieldErrors({});

    const { amenity_uuids } = result.data;

    try {
      if (isEditing && property) {
        // The backend always shows the earliest-uploaded attachment as the
        // profile image, so a replacement upload must first clear out the
        // old attachment(s) or it would just be appended after them and
        // never actually take effect.
        if (result.data.profile_image && property.attachments?.length) {
          await Promise.all(
            property.attachments.map((attachment) =>
              deleteAttachmentMutation.mutateAsync({
                uuid: property.uuid,
                attachmentUuid: attachment.uuid,
              }),
            ),
          );
        }

        await updateMutation.mutateAsync({
          uuid: property.uuid,
          data: result.data,
        });

        if (amenity_uuids.length) {
          await syncAmenitiesMutation.mutateAsync({
            uuid: property.uuid,
            amenityUuids: amenity_uuids,
          });
        }

        toast.success("Property updated successfully.");
      } else {
        const created = await createMutation.mutateAsync(result.data);

        if (amenity_uuids.length) {
          await syncAmenitiesMutation.mutateAsync({
            uuid: created.uuid,
            amenityUuids: amenity_uuids,
          });
        }

        toast.success("Property created successfully.");
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
    handleTypeChange,
    handleImageChange,
    handleAmenitiesChange,
    handleSubmit,
    isPending,
    isEditing,
    nameError: fieldErrors.name ?? serverFieldErrors?.name?.[0],
    addressError: fieldErrors.address ?? serverFieldErrors?.address?.[0],
    typeError: fieldErrors.type ?? serverFieldErrors?.type?.[0],
    profileImageError:
      fieldErrors.profile_image ?? serverFieldErrors?.profile_image?.[0],
  };
}
