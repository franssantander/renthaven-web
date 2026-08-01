"use client";

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
    handleSubmit,
    isPending,
    isEditing,
    nameError,
    addressError,
    typeError,
  } = usePropertyForm({
    property,
    onSuccess: () => onOpenChange(false),
  });

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
