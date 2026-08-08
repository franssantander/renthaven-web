"use client";

import { useState } from "react";
import { toast } from "sonner";

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
import { usePropertyUnitsInfiniteQuery } from "@/features/property-units/queries/property-unit-query";
import { ApiError } from "@/lib/axios";
import { useReassignLeaseMutation } from "../queries/lease-query";
import { reassignLeaseSchema } from "../schemas/lease-schema";
import type { Lease } from "../types";

type ReassignTenantDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lease: Lease | null;
  propertyUuid: string;
};

export function ReassignTenantDialog({
  open,
  onOpenChange,
  lease,
  propertyUuid,
}: ReassignTenantDialogProps) {
  const [lastOpen, setLastOpen] = useState(open);
  const [targetUuid, setTargetUuid] = useState("");
  const [moveDate, setMoveDate] = useState("");
  const [error, setError] = useState<string | undefined>();

  // Reset the form when the dialog transitions to open, computed during
  // render rather than in an effect, per https://react.dev/learn/you-might-not-need-an-effect.
  if (open !== lastOpen) {
    setLastOpen(open);
    if (open) {
      setTargetUuid("");
      setMoveDate("");
      setError(undefined);
    }
  }

  const unitsQuery = usePropertyUnitsInfiniteQuery(propertyUuid);
  const units = (unitsQuery.data?.pages ?? [])
    .flatMap((page) => page.data)
    .filter(
      (unit) =>
        unit.uuid !== lease?.property_unit?.uuid &&
        unit.status !== "maintenance" &&
        unit.occupied_count < unit.capacity,
    );

  const mutation = useReassignLeaseMutation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = reassignLeaseSchema.safeParse({
      property_unit_uuid: targetUuid,
      move_date: moveDate || undefined,
    });

    if (!result.success) {
      setError(result.error.flatten().fieldErrors.property_unit_uuid?.[0]);
      return;
    }

    if (!lease) return;

    setError(undefined);

    try {
      await mutation.mutateAsync({ leaseUuid: lease.uuid, data: result.data });
      toast.success("Tenant reassigned successfully.");
      onOpenChange(false);
    } catch (err) {
      toast.error((err as ApiError).message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>Reassign tenant</DialogTitle>
            <DialogDescription>
              Move{" "}
              {lease?.renter
                ? `${lease.renter.first_name} ${lease.renter.last_name}`
                : "this tenant"}{" "}
              to a different available unit.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <Field invalid={!!error}>
              <FieldLabel htmlFor="reassign-target-unit">
                Target unit
              </FieldLabel>
              <Select
                value={targetUuid}
                onValueChange={(value: string | null) =>
                  setTargetUuid(value ?? "")
                }
                disabled={!units.length}
              >
                <SelectTrigger id="reassign-target-unit" className="w-full">
                  <SelectValue>
                    {(value: string) =>
                      units.find((unit) => unit.uuid === value)?.name ??
                      (units.length
                        ? "Select a unit"
                        : "No other available units")
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit.uuid} value={unit.uuid}>
                      {unit.name} ({unit.occupied_count}/{unit.capacity})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {error ? <FieldError>{error}</FieldError> : null}
            </Field>

            <Field>
              <FieldLabel htmlFor="reassign-move-date">
                Move date (optional)
              </FieldLabel>
              <Input
                id="reassign-move-date"
                type="date"
                value={moveDate}
                onChange={(event) => setMoveDate(event.target.value)}
              />
            </Field>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={mutation.isPending || !units.length}
            >
              {mutation.isPending ? "Reassigning..." : "Reassign"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
