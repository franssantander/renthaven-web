"use client";

import { useEffect, useMemo } from "react";
import { ImageOff } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  PROPERTY_TYPE_OPTIONS,
  getPropertyTypeLabel,
} from "../config/property-types";
import type { PropertyType } from "../types";
import { usePropertyAmenitiesQuery } from "../queries/amenity-query";
import { usePropertyForm } from "../hooks/use-property-form";
import type { Property } from "../types";

type PropertyFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property?: Property | null;
};

export function PropertyFormDialog({
  open,
  onOpenChange,
  property,
}: PropertyFormDialogProps) {
  const {
    values,
    handleChange,
    handleTypeChange,
    handleImageChange,
    handleAmenitiesChange,
    handleSubmit,
    isPending,
    isEditing,
    nameError,
    addressError,
    typeError,
    profileImageError,
  } = usePropertyForm({
    property,
    onSuccess: () => onOpenChange(false),
  });

  const { data: amenities, isLoading: isLoadingAmenities } =
    usePropertyAmenitiesQuery();

  const imagePreviewUrl = useMemo(
    () =>
      values.profile_image
        ? URL.createObjectURL(values.profile_image)
        : (property?.profile_image_url ?? null),
    [values.profile_image, property?.profile_image_url],
  );

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit property" : "Add property"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update the details for this property."
                : "Enter the details for the new property."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <Field invalid={!!profileImageError}>
              <FieldLabel htmlFor="property-profile-image">
                Profile image
              </FieldLabel>
              <div className="flex items-center gap-3">
                <Avatar size="lg" className="rounded-md">
                  <AvatarImage
                    src={imagePreviewUrl ?? undefined}
                    className="rounded-md"
                  />
                  <AvatarFallback className="rounded-md">
                    <ImageOff className="size-4" />
                  </AvatarFallback>
                </Avatar>
                <Input
                  id="property-profile-image"
                  name="profile_image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  aria-invalid={!!profileImageError}
                  className="flex-1"
                />
              </div>
              {profileImageError ? (
                <FieldError>{profileImageError}</FieldError>
              ) : null}
            </Field>

            <Field invalid={!!nameError}>
              <FieldLabel htmlFor="property-name">Name</FieldLabel>
              <Input
                id="property-name"
                name="name"
                value={values.name}
                onChange={handleChange("name")}
                aria-invalid={!!nameError}
              />
              {nameError ? <FieldError>{nameError}</FieldError> : null}
            </Field>

            <Field invalid={!!typeError}>
              <FieldLabel htmlFor="property-type">Type</FieldLabel>
              <Select value={values.type} onValueChange={handleTypeChange}>
                <SelectTrigger id="property-type" className="w-full">
                  <SelectValue>
                    {(value: PropertyType) => getPropertyTypeLabel(value)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {typeError ? <FieldError>{typeError}</FieldError> : null}
            </Field>

            <Field>
              <FieldLabel htmlFor="property-amenities">Amenities</FieldLabel>
              <Select
                value={values.amenity_uuids}
                onValueChange={handleAmenitiesChange}
                multiple
                disabled={isLoadingAmenities}
              >
                <SelectTrigger id="property-amenities" className="w-full">
                  <SelectValue className="min-w-0 truncate">
                    {(value: string[]) => {
                      if (!value.length) {
                        return isLoadingAmenities
                          ? "Loading amenities..."
                          : "Select amenities";
                      }

                      if (value.length === 1) {
                        return (
                          amenities?.find((a) => a.uuid === value[0])?.name ??
                          value[0]
                        );
                      }

                      return `${value.length} amenities selected`;
                    }}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {amenities?.map((amenity) => (
                    <SelectItem key={amenity.uuid} value={amenity.uuid}>
                      {amenity.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field invalid={!!addressError}>
              <FieldLabel htmlFor="property-address">Address</FieldLabel>
              <Textarea
                id="property-address"
                name="address"
                value={values.address}
                onChange={handleChange("address")}
                aria-invalid={!!addressError}
              />
              {addressError ? <FieldError>{addressError}</FieldError> : null}
            </Field>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? isEditing
                  ? "Saving..."
                  : "Creating..."
                : isEditing
                  ? "Save changes"
                  : "Create property"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
