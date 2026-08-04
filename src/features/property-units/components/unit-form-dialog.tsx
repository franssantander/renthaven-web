"use client";

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
    isPending,
    isEditing,
    nameError,
    capacityError,
    rentPriceError,
  } = usePropertyUnitForm({
    propertyUuid,
    unit,
    onSuccess: () => onOpenChange(false),
  });

  const { data: amenities, isLoading: isLoadingAmenities } =
    useUnitAmenitiesQuery();

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
          </div>

          <DialogFooter>
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
    </Dialog>
  );
}
