"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ApiError } from "@/lib/axios";
import { useLoginMutation } from "../queries/auth-query";
import { loginSchema, type LoginFormValues } from "../schemas/login-schema";

type FieldErrors = Partial<Record<keyof LoginFormValues, string>>;

export function useLogin() {
  const router = useRouter();

  const {
    mutate: loginFn,
    isPending: isPendingLogin,
    error,
  } = useLoginMutation();

  const [values, setValues] = useState<LoginFormValues>({
    username: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const loginError = error as ApiError | null;
  const serverFieldErrors = loginError?.validationErrors;

  const handleChange =
    (field: keyof LoginFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = loginSchema.safeParse(values);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      setFieldErrors({
        username: errors.username?.[0],
        password: errors.password?.[0],
      });

      return;
    }

    setFieldErrors({});

    loginFn(result.data, {
      onSuccess: () => {
        toast.success("Logged in successfully.");
        router.push("/dashboard");
      },
      onError: (err) => {
        const apiError = err as ApiError;

        if (apiError.status === 422) {
          const firstFieldError = Object.values(
            apiError.validationErrors ?? {},
          )[0]?.[0];

          toast.error(firstFieldError ?? "Please check the form for errors.");
          return;
        }

        toast.error(apiError.message);
      },
    });
  };

  return {
    values,
    handleChange,
    handleSubmit,
    isPendingLogin,
    usernameError: fieldErrors.username ?? serverFieldErrors?.username?.[0],
    passwordError: fieldErrors.password ?? serverFieldErrors?.password?.[0],
    formError:
      loginError && !serverFieldErrors ? loginError.message : undefined,
  };
}
