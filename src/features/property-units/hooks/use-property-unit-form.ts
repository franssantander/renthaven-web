"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/axios";
import {
  useCreatePropertyUnitMutation,
  useUpdatePropertyUnitMutation,
  useUploadPropertyUnitAttachmentsMutation,
} from "../queries/property-unit-query";
import {
  MAX_UNIT_GALLERY_PHOTOS,
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

function validateProfileImage(file: File): string | undefined {
  if (!file.type.startsWith("image/")) {
    return "The profile image must be a valid image file.";
  }

  if (file.size > 5 * 1024 * 1024) {
    return "The profile image must not exceed 5MB.";
  }

  return undefined;
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
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageError, setProfileImageError] = useState<
    string | undefined
  >();
  const [galleryPhotos, setGalleryPhotos] = useState<File[]>([]);
  const [galleryPhotosError, setGalleryPhotosError] = useState<
    string | undefined
  >();

  const createMutation = useCreatePropertyUnitMutation(propertyUuid);
  const updateMutation = useUpdatePropertyUnitMutation(propertyUuid);
  const uploadAttachmentsMutation =
    useUploadPropertyUnitAttachmentsMutation(propertyUuid);

  const profileImagePreview = useMemo(
    () => (profileImage ? URL.createObjectURL(profileImage) : null),
    [profileImage],
  );

  useEffect(() => {
    return () => {
      if (profileImagePreview) URL.revokeObjectURL(profileImagePreview);
    };
  }, [profileImagePreview]);

  const galleryPreviews = useMemo(
    () => galleryPhotos.map((file) => URL.createObjectURL(file)),
    [galleryPhotos],
  );

  useEffect(() => {
    return () => {
      galleryPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [galleryPreviews]);

  const handleProfileImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0] ?? null;

    setProfileImageError(file ? validateProfileImage(file) : undefined);
    setProfileImage(file);
    event.target.value = "";
  };

  const handleGalleryPhotosChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files ?? []);

    setGalleryPhotosError(
      files.length > MAX_UNIT_GALLERY_PHOTOS
        ? `You can upload up to ${MAX_UNIT_GALLERY_PHOTOS} gallery photos.`
        : undefined,
    );
    setGalleryPhotos(files.slice(0, MAX_UNIT_GALLERY_PHOTOS));
    event.target.value = "";
  };

  const handleRemoveGalleryPhoto = (index: number) => {
    setGalleryPhotos((prev) => prev.filter((_, i) => i !== index));
    setGalleryPhotosError(undefined);
  };

  const handleClear = () => {
    setValues(valuesFromUnit(undefined));
    setFieldErrors({});
    setProfileImage(null);
    setProfileImageError(undefined);
    setGalleryPhotos([]);
    setGalleryPhotosError(undefined);
  };

  const isPending = isEditing
    ? updateMutation.isPending
    : createMutation.isPending || uploadAttachmentsMutation.isPending;
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

    if (profileImage && validateProfileImage(profileImage)) {
      setProfileImageError(validateProfileImage(profileImage));
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
        const createdUnit = await createMutation.mutateAsync([result.data]);

        try {
          // Upload the profile image first (its own request) so it gets the
          // lowest sort_order and becomes attachments[0] / the cover image.
          if (profileImage) {
            await uploadAttachmentsMutation.mutateAsync({
              uuid: createdUnit.uuid,
              images: [profileImage],
            });
          }

          if (galleryPhotos.length) {
            await uploadAttachmentsMutation.mutateAsync({
              uuid: createdUnit.uuid,
              images: galleryPhotos,
            });
          }
        } catch (uploadErr) {
          toast.error(
            `Unit created, but photo upload failed: ${(uploadErr as ApiError).message}`,
          );
          handleClear();
          onSuccess();
          return;
        }

        handleClear();
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
    handleClear,
    isPending,
    isEditing,
    nameError: fieldErrors.name ?? getServerError("name"),
    capacityError: fieldErrors.capacity ?? getServerError("capacity"),
    rentPriceError: fieldErrors.rent_price ?? getServerError("rent_price"),
    profileImage,
    profileImagePreview,
    profileImageError,
    handleProfileImageChange,
    galleryPhotos,
    galleryPreviews,
    galleryPhotosError,
    handleGalleryPhotosChange,
    handleRemoveGalleryPhoto,
  };
}
