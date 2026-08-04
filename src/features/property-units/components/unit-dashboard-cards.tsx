"use client";

import { DoorOpen, Key, Home, Wrench, type LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils/utils";
import { usePropertyUnitDashboardQuery } from "../queries/property-unit-query";

const ICON_MAP: Record<string, LucideIcon> = {
  "door-open": DoorOpen,
  key: Key,
  "home-modern": Home,
  wrench: Wrench,
};

type UnitDashboardCardsProps = {
  propertyUuid: string;
};

export function UnitDashboardCards({ propertyUuid }: UnitDashboardCardsProps) {
  const { data, isLoading } = usePropertyUnitDashboardQuery(propertyUuid);
  const metrics = data?.metrics;

  if (isLoading || !metrics) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = ICON_MAP[metric.icon] ?? Home;

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
