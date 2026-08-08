"use client";

import { useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/lib/axios";
import { useTerminateLeaseMutation } from "../queries/lease-query";
import { terminateLeaseSchema } from "../schemas/lease-schema";
import type { Lease } from "../types";

type TerminateLeaseDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lease: Lease | null;
};

export function TerminateLeaseDialog({
  open,
  onOpenChange,
  lease,
}: TerminateLeaseDialogProps) {
  const [lastOpen, setLastOpen] = useState(open);
  const [moveOutDate, setMoveOutDate] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | undefined>();

  // Reset the form when the dialog transitions to open, computed during
  // render rather than in an effect, per https://react.dev/learn/you-might-not-need-an-effect.
  if (open !== lastOpen) {
    setLastOpen(open);
    if (open) {
      setMoveOutDate(new Date().toISOString().slice(0, 10));
      setNotes("");
      setError(undefined);
    }
  }

  const mutation = useTerminateLeaseMutation();

  const handleConfirm = async () => {
    const result = terminateLeaseSchema.safeParse({
      move_out_date: moveOutDate,
      notes: notes || undefined,
    });

    if (!result.success) {
      setError(result.error.flatten().fieldErrors.move_out_date?.[0]);
      return;
    }

    if (!lease) return;

    setError(undefined);

    try {
      await mutation.mutateAsync({ leaseUuid: lease.uuid, data: result.data });
      toast.success("Tenant removed successfully.");
      onOpenChange(false);
    } catch (err) {
      toast.error((err as ApiError).message);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove tenant</AlertDialogTitle>
          <AlertDialogDescription>
            This ends{" "}
            {lease?.renter
              ? `${lease.renter.first_name} ${lease.renter.last_name}'s`
              : "the tenant's"}{" "}
            lease on this unit. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col gap-4">
          <Field invalid={!!error}>
            <FieldLabel htmlFor="terminate-move-out-date">
              Move-out date
            </FieldLabel>
            <Input
              id="terminate-move-out-date"
              type="date"
              value={moveOutDate}
              onChange={(event) => setMoveOutDate(event.target.value)}
            />
            {error ? <FieldError>{error}</FieldError> : null}
          </Field>

          <Field>
            <FieldLabel htmlFor="terminate-notes">Notes (optional)</FieldLabel>
            <Textarea
              id="terminate-notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </Field>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={mutation.isPending}
            onClick={handleConfirm}
          >
            {mutation.isPending ? "Removing..." : "Remove tenant"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
