"use client";

import type { ReactNode } from "react";
import { Mail, MapPin, Phone } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getInitials } from "@/features/dashboard/lib/get-initials";
import { useTenantDashboardQuery } from "../queries/tenant-query";

function ProfileField({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}

export function TenantProfileCard() {
  const { data: dashboard, isLoading } = useTenantDashboardQuery();

  const lease = dashboard?.lease;
  const renter = lease?.renter;
  const propertyUnit = lease?.property_unit;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>
              {renter ? getInitials(renter.full_name) : "?"}
            </AvatarFallback>
          </Avatar>
          {renter ? renter.full_name : "My profile"}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ProfileField label="First name" value={renter?.first_name ?? "—"} />
          {renter?.middle_name ? (
            <ProfileField label="Middle name" value={renter.middle_name} />
          ) : null}
          <ProfileField label="Last name" value={renter?.last_name ?? "—"} />
          <ProfileField
            label="Email"
            value={
              renter?.email ? (
                <span className="flex items-center gap-1.5">
                  <Mail className="size-3.5" />
                  {renter.email}
                </span>
              ) : (
                "—"
              )
            }
          />
          <ProfileField
            label="Phone"
            value={
              renter?.phone ? (
                <span className="flex items-center gap-1.5">
                  <Phone className="size-3.5" />
                  {renter.phone}
                </span>
              ) : (
                "—"
              )
            }
          />
        </div>

        {propertyUnit ? (
          <div>
            <p className="mb-2 text-xs text-muted-foreground">
              Current residence
            </p>
            <p className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="size-4 text-muted-foreground" />
              {propertyUnit.property?.name
                ? `${propertyUnit.property.name} – ${propertyUnit.name}`
                : propertyUnit.name}
            </p>
            {propertyUnit.property?.address ? (
              <p className="ml-6 text-sm text-muted-foreground">
                {propertyUnit.property.address}
              </p>
            ) : null}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            You don&apos;t have an active lease on file.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
