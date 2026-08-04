"use client";

import { ImageOff } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPropertyTypeLabel } from "@/features/properties/config/property-types";
import { usePropertyQuery } from "@/features/properties/queries/property-query";
import { Skeleton } from "@/components/ui/skeleton";

type PropertySummaryCardProps = {
  propertyUuid: string;
};

export function PropertySummaryCard({ propertyUuid }: PropertySummaryCardProps) {
  const { data: property, isLoading } = usePropertyQuery(propertyUuid);

  if (isLoading || !property) {
    return (
      <Card>
        <CardContent className="flex items-center gap-4 py-6">
          <Skeleton className="size-16 rounded-md" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="sr-only">
        <CardTitle>Property</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-4 py-6">
        <Avatar className="size-16 rounded-md">
          <AvatarImage
            src={property.profile_image_url ?? undefined}
            alt={property.name}
            className="rounded-md"
          />
          <AvatarFallback className="rounded-md">
            <ImageOff className="size-6" />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">{property.name}</h2>
            <Badge variant="outline">{getPropertyTypeLabel(property.type)}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {property.address || "No address on file"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
