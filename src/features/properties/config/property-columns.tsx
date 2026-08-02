import { ImageOff, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import type { DataTableColumn } from "@/components/shared/data-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Property, PropertyColumnActions } from "../types";
import { getPropertyTypeLabel } from "./property-types";

function PropertyImageCell({ property }: { property: Property }) {
  return (
    <Avatar className="rounded-md">
      <AvatarImage
        src={property.profile_image_url ?? undefined}
        alt={property.name}
        className="rounded-md"
      />
      <AvatarFallback className="rounded-md">
        <ImageOff className="size-4" />
      </AvatarFallback>
    </Avatar>
  );
}

function PropertyAmenitiesCell({ property }: { property: Property }) {
  if (!property.amenities?.length) {
    return <span className="text-muted-foreground">—</span>;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {property.amenities.map((amenity) => (
        <Badge key={amenity.uuid} variant="secondary">
          {amenity.name}
        </Badge>
      ))}
    </div>
  );
}

type PropertyActionsCellProps = PropertyColumnActions & {
  property: Property;
};

function PropertyActionsCell({
  property,
  onEdit,
  onDelete,
}: PropertyActionsCellProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
        <MoreHorizontal className="size-4" />
        <span className="sr-only">Open actions</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(property)}>
          <Pencil className="size-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          onClick={() => onDelete(property)}
        >
          <Trash2 className="size-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function getPropertyColumns({
  onEdit,
  onDelete,
}: PropertyColumnActions): DataTableColumn<Property>[] {
  return [
    {
      id: "profile_image",
      header: <span className="sr-only">Image</span>,
      headerClassName: "w-14",
      cell: (property) => <PropertyImageCell property={property} />,
    },
    {
      id: "name",
      header: "Name",
      cell: (property) => <span className="font-medium">{property.name}</span>,
    },
    {
      id: "type",
      header: "Type",
      cell: (property) => (
        <Badge variant="outline">{getPropertyTypeLabel(property.type)}</Badge>
      ),
    },
    {
      id: "address",
      header: "Address",
      cell: (property) => (
        <span className="text-muted-foreground">
          {property.address || "—"}
        </span>
      ),
    },
    {
      id: "amenities",
      header: "Amenities",
      cell: (property) => <PropertyAmenitiesCell property={property} />,
    },
    {
      id: "actions",
      header: <span className="sr-only">Actions</span>,
      headerClassName: "w-10",
      cell: (property) => (
        <PropertyActionsCell
          property={property}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ),
    },
  ];
}
