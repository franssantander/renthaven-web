"use client";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Field,
  FieldLabel,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  FieldError,
  FieldGroup,
} from "@/components/ui";
import Link from "next/link";
import { Icons } from "@/lib/icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useLoginForm } from "../hooks/use-login-form";

export function LoginForm() {
  const { form, isPending, showPassword, setShowPassword } = useLoginForm();

  return (
    <Card className="w-full max-w-sm shadow-md">
      <CardHeader>
        <CardTitle className="font-bold text-xl">
          Login to your account
        </CardTitle>
        <CardDescription>Enter your credentials to continue</CardDescription>
      </CardHeader>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <CardContent>
          <FieldGroup className="flex flex-col gap-5">
            {/* Username Field */}
            <form.Field name="username">
              {(field) => (
                <Field className="max-w-sm">
                  <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={isPending} // Disable while loading
                      placeholder="Enter your username"
                    />
                  </InputGroup>
                  {field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0 && (
                      <FieldError>
                        {field.state.meta.errors[0]?.message}
                      </FieldError>
                    )}
                </Field>
              )}
            </form.Field>

            {/* Password Field */}
            <form.Field name="password">
              {(field) => (
                <Field className="max-w-sm">
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id={field.name}
                      type={showPassword ? "text" : "password"}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={isPending}
                      placeholder="Enter password"
                    />
                    <InputGroupAddon
                      align="inline-end"
                      className="cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <HugeiconsIcon
                        icon={
                          showPassword ? Icons.ViewIcon : Icons.ViewOffSlashIcon
                        }
                      />
                    </InputGroupAddon>
                  </InputGroup>
                  {field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0 && (
                      <FieldError>
                        {field.state.meta.errors[0]?.message}
                      </FieldError>
                    )}
                </Field>
              )}
            </form.Field>

            <Link
              href="#"
              className="ml-auto mb-2 text-xs text-neutral-500 hover:underline"
            >
              Forgot your password?
            </Link>
          </FieldGroup>
        </CardContent>

        <CardFooter className="flex-col gap-4">
          <form.Subscribe selector={(state) => [state.canSubmit]}>
            {([canSubmit]) => (
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={!canSubmit || isPending}
              >
                {isPending ? "Login..." : "Login"}
              </Button>
            )}
          </form.Subscribe>

          <p className="text-xs text-neutral-500">
            Not registered yet?{" "}
            <Link
              href="#"
              className="text-primary underline underline-offset-2"
            >
              Create an Account
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
