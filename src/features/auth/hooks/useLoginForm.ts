"use client";

import * as React from "react";
import { useForm } from "@tanstack/react-form";
import { loginSchema, useLoginMutation } from "../auth.index";

export function useLoginForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const { mutate: loginFn, isPending } = useLoginMutation();

  const form = useForm({
    defaultValues: { username: "", password: "" },
    validators: { onSubmit: loginSchema },
    onSubmit: async ({ value }) => {
      loginFn(value);
    },
  });

  return {
    form,
    isPending,
    showPassword,
    setShowPassword,
  };
}
