"use client";

import { useState } from "react";

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
import { Textarea } from "@/components/ui/textarea";
import type { LedgerEntry } from "@/features/ledger/types";
import { useSubmitPaymentForm } from "../hooks/use-submit-payment-form";

type SubmitPaymentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry: LedgerEntry | null;
};

export function SubmitPaymentDialog({
  open,
  onOpenChange,
  entry,
}: SubmitPaymentDialogProps) {
  const [lastOpen, setLastOpen] = useState(open);

  const {
    values,
    proof,
    fieldError,
    resetTo,
    handleChange,
    handleProofChange,
    handleSubmit,
    isPending,
  } = useSubmitPaymentForm({
    entryUuid: entry?.uuid ?? "",
    onSuccess: () => onOpenChange(false),
  });

  // Reset the form when the dialog transitions to open, computed during
  // render rather than in an effect, per https://react.dev/learn/you-might-not-need-an-effect.
  if (open !== lastOpen) {
    setLastOpen(open);
    if (open) {
      resetTo(entry?.balance);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>Submit payment</DialogTitle>
            <DialogDescription>
              Let your landlord know you&apos;ve made a payment for this
              ledger entry. It will show as awaiting approval until
              confirmed.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <Field invalid={!!fieldError("amount")}>
              <FieldLabel htmlFor="submit-payment-amount">Amount</FieldLabel>
              <Input
                id="submit-payment-amount"
                type="number"
                min={0.01}
                step="0.01"
                value={values.amount}
                onChange={handleChange("amount")}
              />
              {fieldError("amount") ? (
                <FieldError>{fieldError("amount")}</FieldError>
              ) : null}
            </Field>

            <Field invalid={!!fieldError("reference_number")}>
              <FieldLabel htmlFor="submit-payment-reference">
                Reference / OR number (optional)
              </FieldLabel>
              <Input
                id="submit-payment-reference"
                value={values.reference_number}
                onChange={handleChange("reference_number")}
              />
              {fieldError("reference_number") ? (
                <FieldError>{fieldError("reference_number")}</FieldError>
              ) : null}
            </Field>

            <Field>
              <FieldLabel htmlFor="submit-payment-proof">
                Proof of payment (optional)
              </FieldLabel>
              <Input
                id="submit-payment-proof"
                type="file"
                accept="image/*"
                onChange={handleProofChange}
              />
              {proof ? (
                <p className="text-xs text-muted-foreground">
                  {proof.name}
                </p>
              ) : null}
            </Field>

            <Field invalid={!!fieldError("notes")}>
              <FieldLabel htmlFor="submit-payment-notes">
                Notes (optional)
              </FieldLabel>
              <Textarea
                id="submit-payment-notes"
                value={values.notes}
                onChange={handleChange("notes")}
              />
              {fieldError("notes") ? (
                <FieldError>{fieldError("notes")}</FieldError>
              ) : null}
            </Field>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Submitting..." : "Submit payment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
