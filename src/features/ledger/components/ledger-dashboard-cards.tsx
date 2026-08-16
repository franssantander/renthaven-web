"use client";

import {
  AlertTriangle,
  Banknote,
  Clock,
  Inbox,
  UserMinus,
  type LucideIcon,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils/utils";
import { useLedgerDashboardQuery } from "../queries/ledger-query";

const ICON_MAP: Record<string, LucideIcon> = {
  banknotes: Banknote,
  clock: Clock,
  "exclamation-triangle": AlertTriangle,
  "user-minus": UserMinus,
  "inbox-arrow-down": Inbox,
};

export function LedgerDashboardCards() {
  const { data, isLoading } = useLedgerDashboardQuery();
  const metrics = data?.metrics;

  if (isLoading || !metrics) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {metrics.map((metric) => {
        const Icon = ICON_MAP[metric.icon] ?? Banknote;

        return (
          <Card key={metric.title}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
                {metric.title}
                <Icon className="size-4" />
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-baseline gap-2">
              <p className="text-2xl font-semibold">{metric.value}</p>
              <span
                className={cn(
                  "text-xs",
                  metric.trend.is_neutral
                    ? "text-muted-foreground"
                    : metric.trend.is_positive
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-destructive",
                )}
              >
                {metric.trend.label}
              </span>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
