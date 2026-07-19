"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useLogin } from "../hooks/use-login";

export default function LoginForm() {
  const {
    values,
    handleChange,
    handleSubmit,
    isPendingLogin,
    usernameError,
    passwordError,
    formError,
  } = useLogin();

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
      <Field invalid={!!usernameError}>
        <FieldLabel htmlFor="username">Username</FieldLabel>
        <Input
          id="username"
          name="username"
          autoComplete="username"
          value={values.username}
          onChange={handleChange("username")}
          aria-invalid={!!usernameError}
        />
        {usernameError ? <FieldError>{usernameError}</FieldError> : null}
      </Field>

      <Field invalid={!!passwordError}>
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={values.password}
          onChange={handleChange("password")}
          aria-invalid={!!passwordError}
        />
        {passwordError ? <FieldError>{passwordError}</FieldError> : null}
      </Field>

      {formError ? <p className="text-sm text-destructive">{formError}</p> : null}

      <Button type="submit" disabled={isPendingLogin} className="w-full">
        {isPendingLogin ? "Logging in..." : "Log in"}
      </Button>
    </form>
  );
}
