"use client";

import { useState } from "react";
import { Search } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useRenterSearchQuery } from "@/features/renters/queries/renter-query";
import type { Renter } from "@/features/renters/types";
import { useAssignTenantForm } from "../hooks/use-assign-tenant-form";
import type { LeaseTermType } from "../types";

function getInitials(renter: Renter) {
  return `${renter.first_name[0] ?? ""}${renter.last_name[0] ?? ""}`.toUpperCase();
}

type AssignTenantDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyUnitUuid: string;
};

export function AssignTenantDialog({
  open,
  onOpenChange,
  propertyUnitUuid,
}: AssignTenantDialogProps) {
  const {
    values,
    fieldError,
    handleChange,
    setMode,
    setTermType,
    setRenterUuid,
    handleSubmit,
    handleClear,
    isPending,
  } = useAssignTenantForm({
    propertyUnitUuid,
    onSuccess: () => onOpenChange(false),
  });

  const [renterSearch, setRenterSearch] = useState("");
  const [selectedRenter, setSelectedRenter] = useState<Renter | null>(null);
  const debouncedRenterSearch = useDebouncedValue(renterSearch, 300);
  const { data: renterResults, isFetching: isSearchingRenters } =
    useRenterSearchQuery(
      debouncedRenterSearch,
      open && values.mode === "existing" && !selectedRenter,
    );

  const handleSelectRenter = (renter: Renter) => {
    setSelectedRenter(renter);
    setRenterUuid(renter.user_uuid ?? "");
  };

  const handleChangeRenter = () => {
    setSelectedRenter(null);
    setRenterUuid("");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          handleClear();
          setRenterSearch("");
          setSelectedRenter(null);
        }
        onOpenChange(next);
      }}
    >
      <DialogContent>
        <form onSubmit={handleSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>Assign tenant</DialogTitle>
            <DialogDescription>
              Assign an existing or new tenant to this unit.
            </DialogDescription>
          </DialogHeader>

          <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto py-4">
            <div className="flex gap-2">
              <Button
                type="button"
                variant={values.mode === "new" ? "default" : "outline"}
                size="sm"
                onClick={() => setMode("new")}
              >
                New tenant
              </Button>
              <Button
                type="button"
                variant={values.mode === "existing" ? "default" : "outline"}
                size="sm"
                onClick={() => setMode("existing")}
              >
                Existing tenant
              </Button>
            </div>

            {values.mode === "existing" ? (
              <Field invalid={!!fieldError("renter_uuid")}>
                <FieldLabel htmlFor="tenant-search">Tenant</FieldLabel>
                {selectedRenter ? (
                  <div className="flex items-center justify-between gap-3 rounded-md border p-2">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {getInitials(selectedRenter)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {selectedRenter.first_name}{" "}
                          {selectedRenter.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {selectedRenter.email}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleChangeRenter}
                    >
                      Change
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="tenant-search"
                        placeholder="Search by name or email..."
                        value={renterSearch}
                        onChange={(event) =>
                          setRenterSearch(event.target.value)
                        }
                        className="pl-8"
                        autoFocus
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Only tenants without an active lease are shown.
                    </p>
                    <div className="flex max-h-48 flex-col overflow-y-auto rounded-md border">
                      {isSearchingRenters ? (
                        <p className="p-3 text-center text-sm text-muted-foreground">
                          Searching...
                        </p>
                      ) : renterResults?.data.length ? (
                        renterResults.data.map((renter) => (
                          <button
                            key={renter.uuid}
                            type="button"
                            className="flex items-center gap-3 px-2 py-2 text-left text-sm hover:bg-accent"
                            onClick={() => handleSelectRenter(renter)}
                          >
                            <Avatar className="size-8">
                              <AvatarFallback className="text-xs">
                                {getInitials(renter)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {renter.first_name} {renter.last_name}
                              </span>
                              <span className="text-muted-foreground">
                                {renter.email}
                              </span>
                            </div>
                          </button>
                        ))
                      ) : (
                        <p className="p-3 text-center text-sm text-muted-foreground">
                          {renterSearch
                            ? "No available tenants match your search."
                            : "No available tenants right now."}
                        </p>
                      )}
                    </div>
                  </>
                )}
                {fieldError("renter_uuid") ? (
                  <FieldError>{fieldError("renter_uuid")}</FieldError>
                ) : null}
              </Field>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <Field invalid={!!fieldError("first_name")}>
                    <FieldLabel htmlFor="tenant-first-name">
                      First name
                    </FieldLabel>
                    <Input
                      id="tenant-first-name"
                      value={values.first_name}
                      onChange={handleChange("first_name")}
                    />
                    {fieldError("first_name") ? (
                      <FieldError>{fieldError("first_name")}</FieldError>
                    ) : null}
                  </Field>
                  <Field invalid={!!fieldError("last_name")}>
                    <FieldLabel htmlFor="tenant-last-name">
                      Last name
                    </FieldLabel>
                    <Input
                      id="tenant-last-name"
                      value={values.last_name}
                      onChange={handleChange("last_name")}
                    />
                    {fieldError("last_name") ? (
                      <FieldError>{fieldError("last_name")}</FieldError>
                    ) : null}
                  </Field>
                </div>
                <Field invalid={!!fieldError("email")}>
                  <FieldLabel htmlFor="tenant-email">Email</FieldLabel>
                  <Input
                    id="tenant-email"
                    type="email"
                    value={values.email}
                    onChange={handleChange("email")}
                  />
                  {fieldError("email") ? (
                    <FieldError>{fieldError("email")}</FieldError>
                  ) : null}
                </Field>
                <Field>
                  <FieldLabel htmlFor="tenant-phone">
                    Phone (optional)
                  </FieldLabel>
                  <Input
                    id="tenant-phone"
                    value={values.phone}
                    onChange={handleChange("phone")}
                  />
                </Field>
              </>
            )}

            <Field>
              <FieldLabel htmlFor="lease-term-type">Term type</FieldLabel>
              <Select
                value={values.term_type}
                onValueChange={(value: LeaseTermType | null) =>
                  value && setTermType(value)
                }
              >
                <SelectTrigger id="lease-term-type" className="w-full">
                  <SelectValue>
                    {(value: LeaseTermType) =>
                      value === "monthly" ? "Monthly" : "Fixed term"
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="fixed_term">Fixed term</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field invalid={!!fieldError("start_date")}>
                <FieldLabel htmlFor="lease-start-date">Start date</FieldLabel>
                <Input
                  id="lease-start-date"
                  type="date"
                  value={values.start_date}
                  onChange={handleChange("start_date")}
                />
                {fieldError("start_date") ? (
                  <FieldError>{fieldError("start_date")}</FieldError>
                ) : null}
              </Field>
              {values.term_type === "fixed_term" ? (
                <Field invalid={!!fieldError("end_date")}>
                  <FieldLabel htmlFor="lease-end-date">End date</FieldLabel>
                  <Input
                    id="lease-end-date"
                    type="date"
                    value={values.end_date}
                    onChange={handleChange("end_date")}
                  />
                  {fieldError("end_date") ? (
                    <FieldError>{fieldError("end_date")}</FieldError>
                  ) : null}
                </Field>
              ) : null}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field invalid={!!fieldError("security_deposit")}>
                <FieldLabel htmlFor="lease-security-deposit">
                  Security deposit
                </FieldLabel>
                <Input
                  id="lease-security-deposit"
                  type="number"
                  min={0}
                  step="0.01"
                  value={values.security_deposit}
                  onChange={handleChange("security_deposit")}
                />
                {fieldError("security_deposit") ? (
                  <FieldError>{fieldError("security_deposit")}</FieldError>
                ) : null}
              </Field>
              <Field invalid={!!fieldError("advance_rent")}>
                <FieldLabel htmlFor="lease-advance-rent">
                  Advance rent
                </FieldLabel>
                <Input
                  id="lease-advance-rent"
                  type="number"
                  min={0}
                  step="0.01"
                  value={values.advance_rent}
                  onChange={handleChange("advance_rent")}
                />
                {fieldError("advance_rent") ? (
                  <FieldError>{fieldError("advance_rent")}</FieldError>
                ) : null}
              </Field>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Assigning..." : "Assign tenant"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
