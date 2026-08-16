"use client";

import { useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/axios";
import { useSubmitPaymentMutation } from "../queries/tenant-query";
import { submitPaymentSchema } from "../schemas/submit-payment-schema";

type FormState = {
  amount: string;
  reference_number: string;
  notes: string;
};

const initialState: FormState = {
  amount: "",
  reference_number: "",
  notes: "",
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

export function useSubmitPaymentForm({
  entryUuid,
  onSuccess,
}: {
  entryUuid: string;
  onSuccess: () => void;
}) {
  const [values, setValues] = useState<FormState>(initialState);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [proof, setProof] = useState<File | null>(null);

  const mutation = useSubmitPaymentMutation();

  const resetTo = (defaultAmount?: number) => {
    setValues({
      ...initialState,
      amount: defaultAmount !== undefined ? String(defaultAmount) : "",
    });
    setFieldErrors({});
    setProof(null);
  };

  const handleChange =
    (field: keyof FormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const handleProofChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProof(event.target.files?.[0] ?? null);
  };

  const apiError = mutation.error as ApiError | null;
  const serverFieldErrors = apiError?.validationErrors;

  const fieldError = (field: keyof FieldErrors) =>
    fieldErrors[field] ?? serverFieldErrors?.[field]?.[0];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = submitPaymentSchema.safeParse({
      amount: values.amount,
      reference_number: values.reference_number || undefined,
      notes: values.notes || undefined,
    });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setFieldErrors({
        amount: fieldErrors.amount?.[0],
        reference_number: fieldErrors.reference_number?.[0],
        notes: fieldErrors.notes?.[0],
      });
      return;
    }

    setFieldErrors({});

    try {
      await mutation.mutateAsync({
        uuid: entryUuid,
        data: { ...result.data, proof: proof ?? undefined },
      });
      toast.success("Payment submitted for review.");
      onSuccess();
    } catch (err) {
      const error = err as ApiError;

      if (error.status === 422) {
        const firstFieldError = Object.values(
          error.validationErrors ?? {},
        )[0]?.[0];

        toast.error(firstFieldError ?? "Please check the form for errors.");
        return;
      }

      toast.error(error.message);
    }
  };

  return {
    values,
    proof,
    fieldError,
    resetTo,
    handleChange,
    handleProofChange,
    handleSubmit,
    isPending: mutation.isPending,
  };
}
