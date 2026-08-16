"use client";

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
import { ApiError } from "@/lib/axios";
import { useSendReminderMutation } from "../queries/ledger-query";
import type { LedgerEntry } from "../types";

function formatDateTime(date: string | null): string {
  if (!date) return "";
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

type SendReminderDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry: LedgerEntry | null;
};

export function SendReminderDialog({
  open,
  onOpenChange,
  entry,
}: SendReminderDialogProps) {
  const mutation = useSendReminderMutation();

  const handleConfirm = async () => {
    if (!entry) return;

    try {
      await mutation.mutateAsync(entry.uuid);
      toast.success("Payment reminder sent.");
      onOpenChange(false);
    } catch (err) {
      toast.error((err as ApiError).message);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Send payment reminder</AlertDialogTitle>
          <AlertDialogDescription>
            This emails{" "}
            {entry?.renter
              ? `${entry.renter.first_name} ${entry.renter.last_name}`
              : "the tenant"}{" "}
            a sign-in link to view and pay their overdue rent.
            {entry?.reminder_sent_at
              ? ` A reminder was already sent on ${formatDateTime(entry.reminder_sent_at)} — this will send another.`
              : ""}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={mutation.isPending} onClick={handleConfirm}>
            {mutation.isPending ? "Sending..." : "Send reminder"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
