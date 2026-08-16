"use client";

import { useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/axios";
import { useMarkPaidMutation } from "../queries/ledger-query";
import { markPaidSchema } from "../schemas/ledger-schema";

type FormState = {
  amount: string;
  notes: string;
};

const initialState: FormState = {
  amount: "",
  notes: "",
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

export function useMarkPaidForm({
  entryUuid,
  onSuccess,
}: {
  entryUuid: string;
  onSuccess: () => void;
}) {
  const [values, setValues] = useState<FormState>(initialState);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const mutation = useMarkPaidMutation();

  const resetTo = () => {
    setValues(initialState);
    setFieldErrors({});
  };

  const handleChange =
    (field: keyof FormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const apiError = mutation.error as ApiError | null;
  const serverFieldErrors = apiError?.validationErrors;

  const fieldError = (field: keyof FieldErrors) =>
    fieldErrors[field] ?? serverFieldErrors?.[field]?.[0];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = markPaidSchema.safeParse({
      amount: values.amount || undefined,
      notes: values.notes || undefined,
    });

    if (!result.success) {
      setFieldErrors({
        amount: result.error.flatten().fieldErrors.amount?.[0],
      });
      return;
    }

    setFieldErrors({});

    try {
      await mutation.mutateAsync({ uuid: entryUuid, data: result.data });
      toast.success("Ledger entry marked as paid.");
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
    fieldError,
    resetTo,
    handleChange,
    handleSubmit,
    isPending: mutation.isPending,
  };
}
