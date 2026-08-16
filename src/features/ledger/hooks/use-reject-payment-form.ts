"use client";

import { useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/axios";
import { useRejectPaymentMutation } from "../queries/ledger-query";
import { rejectPaymentSchema } from "../schemas/ledger-schema";

export function useRejectPaymentForm({
  entryUuid,
  onSuccess,
}: {
  entryUuid: string;
  onSuccess: () => void;
}) {
  const [reason, setReason] = useState("");

  const mutation = useRejectPaymentMutation();

  const resetTo = () => {
    setReason("");
  };

  const handleConfirm = async () => {
    const result = rejectPaymentSchema.safeParse({ reason: reason || undefined });

    if (!result.success) return;

    try {
      await mutation.mutateAsync({ uuid: entryUuid, data: result.data });
      toast.success("Payment claim rejected.");
      onSuccess();
    } catch (err) {
      toast.error((err as ApiError).message);
    }
  };

  return {
    reason,
    setReason,
    resetTo,
    handleConfirm,
    isPending: mutation.isPending,
  };
}
