"use client";

import { useState } from "react";

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
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useRejectPaymentForm } from "../hooks/use-reject-payment-form";
import type { LedgerEntry } from "../types";

type RejectPaymentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry: LedgerEntry | null;
};

export function RejectPaymentDialog({
  open,
  onOpenChange,
  entry,
}: RejectPaymentDialogProps) {
  const [lastOpen, setLastOpen] = useState(open);

  const { reason, setReason, resetTo, handleConfirm, isPending } =
    useRejectPaymentForm({
      entryUuid: entry?.uuid ?? "",
      onSuccess: () => onOpenChange(false),
    });

  // Reset the form when the dialog transitions to open, computed during
  // render rather than in an effect, per https://react.dev/learn/you-might-not-need-an-effect.
  if (open !== lastOpen) {
    setLastOpen(open);
    if (open) {
      resetTo();
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reject payment claim</AlertDialogTitle>
          <AlertDialogDescription>
            This returns the ledger entry to its unpaid state
            {entry?.renter
              ? ` for ${entry.renter.first_name} ${entry.renter.last_name}`
              : ""}
            . This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col gap-4">
          <Field>
            <FieldLabel htmlFor="reject-payment-reason">
              Reason (optional)
            </FieldLabel>
            <Textarea
              id="reject-payment-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            />
          </Field>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isPending}
            onClick={handleConfirm}
          >
            {isPending ? "Rejecting..." : "Reject claim"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
