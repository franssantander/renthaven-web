"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkCircle02Icon,
  InformationCircleIcon,
  Alert02Icon,
  MultiplicationSignCircleIcon,
  Loading03Icon,
} from "@hugeicons/core-free-icons";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      closeButton
      icons={{
        success: (
          <HugeiconsIcon
            icon={CheckmarkCircle02Icon}
            strokeWidth={2}
            className="size-4"
          />
        ),
        info: (
          <HugeiconsIcon
            icon={InformationCircleIcon}
            strokeWidth={2}
            className="size-4"
          />
        ),
        warning: (
          <HugeiconsIcon
            icon={Alert02Icon}
            strokeWidth={2}
            className="size-4"
          />
        ),
        error: (
          <HugeiconsIcon
            icon={MultiplicationSignCircleIcon}
            strokeWidth={2}
            className="size-4"
          />
        ),
        loading: (
          <HugeiconsIcon
            icon={Loading03Icon}
            strokeWidth={2}
            className="size-4 animate-spin"
          />
        ),
      }}
      toastOptions={{
        style: {
          background: "hsl(var(--popover))",
          color: "hsl(var(--popover-foreground))",
          border: "1px solid hsl(var(--border))",
        },
        classNames: {
          toast: "!shadow-sm !rounded-xl !px-4 !py-3.5 !gap-3",
          title: "!text-sm !font-medium",
          description: "!text-xs !opacity-70 !leading-relaxed",
          closeButton: "!opacity-40 hover:!opacity-100 !transition-opacity",
          icon: "!mt-0.5",
          success:
            "!border-emerald-200 dark:!border-emerald-800 [&>[data-icon]]:!text-emerald-500",
          error:
            "!border-red-200 dark:!border-red-800 [&>[data-icon]]:!text-red-500",
          warning:
            "!border-amber-200 dark:!border-amber-800 [&>[data-icon]]:!text-amber-500",
          info: "!border-blue-200 dark:!border-blue-800 [&>[data-icon]]:!text-blue-500",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
