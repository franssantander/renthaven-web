"use client";

import { useState } from "react";
import { ImageOff, X } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UNIT_STATUS_OPTIONS, getUnitStatusLabel } from "../config/unit-status";
import { useUnitAmenitiesQuery } from "../queries/property-unit-query";
import { usePropertyUnitForm } from "../hooks/use-property-unit-form";
import { UnitPhotoLightbox } from "./unit-photo-lightbox";
import type { PropertyUnitStatus } from "../types";
import type { PropertyUnit } from "../types";

type UnitFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyUuid: string;
  unit?: PropertyUnit | null;
};

export function UnitFormDialog({
  open,
  onOpenChange,
  propertyUuid,
  unit,
}: UnitFormDialogProps) {
  const {
    values,
    handleChange,
    handleStatusChange,
    handleAmenitiesChange,
    handleSubmit,
    handleClear,
    isPending,
    isEditing,
    nameError,
    capacityError,
    rentPriceError,
    profileImagePreview,
    profileImageError,
    handleProfileImageChange,
    galleryPreviews,
    galleryPhotosError,
    handleGalleryPhotosChange,
    handleRemoveGalleryPhoto,
  } = usePropertyUnitForm({
    propertyUuid,
    unit,
    onSuccess: () => onOpenChange(false),
  });

  const { data: amenities, isLoading: isLoadingAmenities } =
    useUnitAmenitiesQuery();

  const [lightboxSlides, setLightboxSlides] = useState<
    { src: string; alt?: string }[]
  >([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const openLightbox = (slides: { src: string; alt?: string }[], index: number) => {
    setLightboxSlides(slides);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit unit" : "Add unit"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update the details for this unit."
                : "Enter the details for the new unit."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <Field invalid={!!nameError}>
              <FieldLabel htmlFor="unit-name">Name</FieldLabel>
              <Input
                id="unit-name"
                name="name"
                value={values.name}
                onChange={handleChange("name")}
                aria-invalid={!!nameError}
              />
              {nameError ? <FieldError>{nameError}</FieldError> : null}
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field invalid={!!capacityError}>
                <FieldLabel htmlFor="unit-capacity">Capacity</FieldLabel>
                <Input
                  id="unit-capacity"
                  name="capacity"
                  type="number"
                  min={1}
                  value={values.capacity}
                  onChange={handleChange("capacity")}
                  aria-invalid={!!capacityError}
                />
                {capacityError ? <FieldError>{capacityError}</FieldError> : null}
              </Field>

              <Field invalid={!!rentPriceError}>
                <FieldLabel htmlFor="unit-rent-price">Rent price</FieldLabel>
                <Input
                  id="unit-rent-price"
                  name="rent_price"
                  type="number"
                  min={0}
                  step="0.01"
                  value={values.rent_price}
                  onChange={handleChange("rent_price")}
                  aria-invalid={!!rentPriceError}
                />
                {rentPriceError ? <FieldError>{rentPriceError}</FieldError> : null}
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="unit-status">Status</FieldLabel>
              <Select
                value={values.status}
                onValueChange={(value: PropertyUnitStatus | null) =>
                  handleStatusChange(value)
                }
              >
                <SelectTrigger id="unit-status" className="w-full">
                  <SelectValue>
                    {(value: PropertyUnitStatus) => getUnitStatusLabel(value)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {UNIT_STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="unit-amenities">Amenities</FieldLabel>
              <Select
                value={values.amenity_uuids}
                onValueChange={handleAmenitiesChange}
                multiple
                disabled={isLoadingAmenities}
              >
                <SelectTrigger id="unit-amenities" className="w-full">
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

            {!isEditing ? (
              <>
                <Field invalid={!!profileImageError}>
                  <FieldLabel htmlFor="unit-profile-image">
                    Profile image
                  </FieldLabel>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="shrink-0 disabled:cursor-default"
                      disabled={!profileImagePreview}
                      onClick={() =>
                        profileImagePreview &&
                        openLightbox([{ src: profileImagePreview }], 0)
                      }
                    >
                      <Avatar size="lg" className="rounded-md">
                        <AvatarImage
                          src={profileImagePreview ?? undefined}
                          className="rounded-md"
                        />
                        <AvatarFallback className="rounded-md">
                          <ImageOff className="size-4" />
                        </AvatarFallback>
                      </Avatar>
                    </button>
                    <Input
                      id="unit-profile-image"
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageChange}
                      aria-invalid={!!profileImageError}
                      className="flex-1"
                    />
                  </div>
                  {profileImageError ? (
                    <FieldError>{profileImageError}</FieldError>
                  ) : null}
                </Field>

                <Field invalid={!!galleryPhotosError}>
                  <FieldLabel htmlFor="unit-gallery-photos">
                    Gallery photos (up to 3)
                  </FieldLabel>
                  <Input
                    id="unit-gallery-photos"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryPhotosChange}
                  />
                  {galleryPhotosError ? (
                    <FieldError>{galleryPhotosError}</FieldError>
                  ) : null}
                  {galleryPreviews.length ? (
                    <div className="grid grid-cols-3 gap-2">
                      {galleryPreviews.map((src, index) => (
                        <div key={src} className="group relative aspect-square">
                          <button
                            type="button"
                            className="size-full"
                            onClick={() =>
                              openLightbox(
                                galleryPreviews.map((previewSrc) => ({
                                  src: previewSrc,
                                })),
                                index,
                              )
                            }
                          >
                            <Avatar className="size-full rounded-md">
                              <AvatarImage
                                src={src}
                                alt={`Gallery photo ${index + 1}`}
                                className="rounded-md"
                              />
                              <AvatarFallback className="rounded-md">
                                <ImageOff className="size-4" />
                              </AvatarFallback>
                            </Avatar>
                          </button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon-sm"
                            className="absolute top-1 right-1"
                            onClick={() => handleRemoveGalleryPhoto(index)}
                          >
                            <X className="size-4" />
                            <span className="sr-only">Remove photo</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </Field>
              </>
            ) : null}
          </div>

          <DialogFooter>
            {!isEditing ? (
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={handleClear}
              >
                Clear
              </Button>
            ) : null}
            <Button type="submit" disabled={isPending}>
              {isPending
                ? isEditing
                  ? "Saving..."
                  : "Creating..."
                : isEditing
                  ? "Save changes"
                  : "Create unit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>

      <UnitPhotoLightbox
        slides={lightboxSlides}
        index={lightboxIndex}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        onIndexChange={setLightboxIndex}
      />
    </Dialog>
  );
}
