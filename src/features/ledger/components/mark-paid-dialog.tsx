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
import { useMarkPaidForm } from "../hooks/use-mark-paid-form";
import type { LedgerEntry } from "../types";

function formatAmount(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

type MarkPaidDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry: LedgerEntry | null;
};

export function MarkPaidDialog({
  open,
  onOpenChange,
  entry,
}: MarkPaidDialogProps) {
  const [lastOpen, setLastOpen] = useState(open);

  const { values, fieldError, resetTo, handleChange, handleSubmit, isPending } =
    useMarkPaidForm({
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

  const suggestedAmount =
    entry?.status === "submitted" && entry.submitted_amount !== null
      ? entry.submitted_amount
      : entry?.balance;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>Mark as paid</DialogTitle>
            <DialogDescription>
              {entry?.renter
                ? `Settle this ledger entry for ${entry.renter.first_name} ${entry.renter.last_name}.`
                : "Settle this ledger entry."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <Field invalid={!!fieldError("amount")}>
              <FieldLabel htmlFor="mark-paid-amount">
                Amount (optional)
              </FieldLabel>
              <Input
                id="mark-paid-amount"
                type="number"
                min={0.01}
                step="0.01"
                placeholder={
                  suggestedAmount !== undefined
                    ? `Defaults to ${formatAmount(suggestedAmount)}`
                    : undefined
                }
                value={values.amount}
                onChange={handleChange("amount")}
              />
              {fieldError("amount") ? (
                <FieldError>{fieldError("amount")}</FieldError>
              ) : null}
            </Field>

            <Field>
              <FieldLabel htmlFor="mark-paid-notes">
                Notes (optional)
              </FieldLabel>
              <Textarea
                id="mark-paid-notes"
                value={values.notes}
                onChange={handleChange("notes")}
              />
            </Field>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Mark paid"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
