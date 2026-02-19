import * as React from "react";
import { useForm } from "@tanstack/react-form";
import { useLoginMutation } from "./use-login-mutation";
import { loginSchema } from "../schemas";

export function useLoginForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const loginMutation = useLoginMutation();

  const form = useForm({
    defaultValues: { username: "", password: "" },
    validators: { onSubmit: loginSchema },
    onSubmit: async ({ value }) => {
      loginMutation.mutate(value);
    },
  });

  return {
    form,
    isPending: loginMutation.isPending,
    showPassword,
    setShowPassword,
  };
}
