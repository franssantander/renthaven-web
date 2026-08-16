"use client";

import { useState } from "react";
import { Search } from "lucide-react";

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
import { useLeasesQuery } from "@/features/leases/queries/lease-query";
import type { Lease } from "@/features/leases/types";
import { MAINTENANCE_CATEGORY_OPTIONS } from "../config/maintenance-category";
import {
  getMaintenancePriorityLabel,
  MAINTENANCE_PRIORITY_OPTIONS,
} from "../config/maintenance-priority";
import { useCreateMaintenanceRequestForm } from "../hooks/use-create-maintenance-request-form";
import type { MaintenanceCategory, MaintenancePriority } from "../types";

function matchesLeaseSearch(lease: Lease, search: string): boolean {
  const term = search.trim().toLowerCase();
  if (!term) return true;
  const renterName = lease.renter
    ? `${lease.renter.first_name} ${lease.renter.last_name}`
    : "";
  const unitName = lease.property_unit?.name ?? "";
  const propertyName = lease.property_unit?.property?.name ?? "";
  return [renterName, unitName, propertyName]
    .join(" ")
    .toLowerCase()
    .includes(term);
}

type NewMaintenanceRequestDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function NewMaintenanceRequestDialog({
  open,
  onOpenChange,
}: NewMaintenanceRequestDialogProps) {
  const {
    values,
    fieldError,
    handleChange,
    setCategory,
    setPriority,
    setLeaseUuid,
    handleSubmit,
    handleClear,
    isPending,
  } = useCreateMaintenanceRequestForm({ onSuccess: () => onOpenChange(false) });

  const [leaseSearch, setLeaseSearch] = useState("");
  const [selectedLease, setSelectedLease] = useState<Lease | null>(null);
  const { data: leaseResults, isLoading: isLoadingLeases } = useLeasesQuery({
    per_page: 100,
  });

  const handleSelectLease = (lease: Lease) => {
    setSelectedLease(lease);
    setLeaseUuid(lease.uuid);
  };

  const handleChangeLease = () => {
    setSelectedLease(null);
    setLeaseUuid("");
  };

  const filteredLeases = (leaseResults?.data ?? []).filter((lease) =>
    matchesLeaseSearch(lease, leaseSearch),
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          handleClear();
          setLeaseSearch("");
          setSelectedLease(null);
        }
        onOpenChange(next);
      }}
    >
      <DialogContent>
        <form onSubmit={handleSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>New maintenance request</DialogTitle>
            <DialogDescription>
              File a maintenance request on behalf of a tenant.
            </DialogDescription>
          </DialogHeader>

          <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto py-4">
            <Field invalid={!!fieldError("lease_uuid")}>
              <FieldLabel htmlFor="maintenance-lease-search">
                Tenant / unit
              </FieldLabel>
              {selectedLease ? (
                <div className="flex items-center justify-between gap-3 rounded-md border p-2">
                  <div>
                    <p className="text-sm font-medium">
                      {selectedLease.renter
                        ? `${selectedLease.renter.first_name} ${selectedLease.renter.last_name}`
                        : "Unknown tenant"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedLease.property_unit?.property?.name} —{" "}
                      {selectedLease.property_unit?.name}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleChangeLease}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <>
                  <div className="relative">
                    <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="maintenance-lease-search"
                      placeholder="Search by tenant, unit, or property..."
                      value={leaseSearch}
                      onChange={(event) => setLeaseSearch(event.target.value)}
                      className="pl-8"
                      autoFocus
                    />
                  </div>
                  <div className="flex max-h-48 flex-col overflow-y-auto rounded-md border">
                    {isLoadingLeases ? (
                      <p className="p-3 text-center text-sm text-muted-foreground">
                        Loading tenants...
                      </p>
                    ) : filteredLeases.length ? (
                      filteredLeases.map((lease) => (
                        <button
                          key={lease.uuid}
                          type="button"
                          className="flex flex-col px-2 py-2 text-left text-sm hover:bg-accent"
                          onClick={() => handleSelectLease(lease)}
                        >
                          <span className="font-medium">
                            {lease.renter
                              ? `${lease.renter.first_name} ${lease.renter.last_name}`
                              : "Unknown tenant"}
                          </span>
                          <span className="text-muted-foreground">
                            {lease.property_unit?.property?.name} —{" "}
                            {lease.property_unit?.name}
                          </span>
                        </button>
                      ))
                    ) : (
                      <p className="p-3 text-center text-sm text-muted-foreground">
                        No matching tenants found.
                      </p>
                    )}
                  </div>
                </>
              )}
              {fieldError("lease_uuid") ? (
                <FieldError>{fieldError("lease_uuid")}</FieldError>
              ) : null}
            </Field>

            <Field invalid={!!fieldError("title")}>
              <FieldLabel htmlFor="maintenance-title">Title</FieldLabel>
              <Input
                id="maintenance-title"
                value={values.title}
                onChange={handleChange("title")}
              />
              {fieldError("title") ? (
                <FieldError>{fieldError("title")}</FieldError>
              ) : null}
            </Field>

            <Field invalid={!!fieldError("description")}>
              <FieldLabel htmlFor="maintenance-description">
                Description
              </FieldLabel>
              <Textarea
                id="maintenance-description"
                value={values.description}
                onChange={handleChange("description")}
              />
              {fieldError("description") ? (
                <FieldError>{fieldError("description")}</FieldError>
              ) : null}
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="maintenance-category">
                  Category
                </FieldLabel>
                <Select
                  value={values.category}
                  onValueChange={(value: MaintenanceCategory | null) =>
                    value && setCategory(value)
                  }
                >
                  <SelectTrigger id="maintenance-category" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MAINTENANCE_CATEGORY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="maintenance-priority">
                  Priority
                </FieldLabel>
                <Select
                  value={values.priority}
                  onValueChange={(value: MaintenancePriority | null) =>
                    value && setPriority(value)
                  }
                >
                  <SelectTrigger id="maintenance-priority" className="w-full">
                    <SelectValue>
                      {(value: MaintenancePriority) =>
                        getMaintenancePriorityLabel(value)
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {MAINTENANCE_PRIORITY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
