"use client";

import * as React from "react";
import * as z from "zod";
import { useForm } from "@tanstack/react-form";
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
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";

const loginSchema = z.object({
  username: z.string().min(8, "Username must be at least 8 characters"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginForm() {
  const [showPassword, setShowPassword] = React.useState(false);

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      console.log("Submit:", value);
    },
  });
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
            <form.Field name="username">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field className="max-w-sm">
                    <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Enter your username"
                      />
                    </InputGroup>
                    {field.state.meta.isTouched && (
                      <FieldError>
                        {field.state.meta.errors[0]?.message}
                      </FieldError>
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="password">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field className="max-w-sm" data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id={field.name}
                        type={showPassword ? "text" : "password"}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Enter password"
                      />
                      <InputGroupAddon
                        align="inline-end"
                        className="cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <HugeiconsIcon icon={Icons.ViewIcon} />
                        ) : (
                          <HugeiconsIcon icon={Icons.ViewOffSlashIcon} />
                        )}
                      </InputGroupAddon>
                    </InputGroup>
                    {field.state.meta.isTouched && (
                      <FieldError>
                        {field.state.meta.errors[0]?.message}
                      </FieldError>
                    )}
                  </Field>
                );
              }}
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
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button type="submit" size="lg" className="w-full">
                {isSubmitting ? "Logging in..." : "Login"}
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
