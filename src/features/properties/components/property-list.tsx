"use client";

import { ImageOff, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { getPropertyTypeLabel } from "../config/property-types";
import { usePropertiesPage } from "../hooks/use-properties";
import type { Property } from "../types";
import { PropertyFormDialog } from "./property-form-dialog";

export function PropertyList() {
  const {
    properties,
    meta,
    isLoading,
    isFetching,
    isError,
    error,
    page,
    setPage,
    handleSearchChange,
    refetch,
    createOpen,
    setCreateOpen,
    editingProperty,
    setEditingProperty,
    deletingProperty,
    setDeletingProperty,
    handleDeleteConfirm,
    isDeletePending,
  } = usePropertiesPage();

  const columns: DataTableColumn<Property>[] = [
    {
      id: "profile_image",
      header: <span className="sr-only">Image</span>,
      headerClassName: "w-14",
      cell: (property) => (
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
      ),
    },
    {
      id: "name",
      header: "Name",
      cell: (property) => (
        <span className="font-medium">{property.name}</span>
      ),
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
      cell: (property) =>
        property.amenities?.length ? (
          <div className="flex flex-wrap gap-1">
            {property.amenities.map((amenity) => (
              <Badge key={amenity.uuid} variant="secondary">
                {amenity.name}
              </Badge>
            ))}
          </div>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      id: "actions",
      header: <span className="sr-only">Actions</span>,
      headerClassName: "w-10",
      cell: (property) => (
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
            <MoreHorizontal className="size-4" />
            <span className="sr-only">Open actions</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setEditingProperty(property)}>
              <Pencil className="size-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setDeletingProperty(property)}
            >
              <Trash2 className="size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Properties</CardTitle>
        <CardDescription>
          Manage the properties in your portfolio.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={properties}
          getRowId={(property) => property.uuid}
          isLoading={isLoading}
          isFetching={isFetching}
          isError={isError}
          errorMessage={error?.message}
          emptyMessage="No properties yet. Add your first property to get started."
          onSearchChange={handleSearchChange}
          searchPlaceholder="Search properties..."
          onRefresh={refetch}
          page={page}
          onPageChange={setPage}
          lastPage={meta?.last_page}
          toolbarActions={
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="size-4" />
              Add property
            </Button>
          }
        />
      </CardContent>

      <PropertyFormDialog
        key="create"
        open={createOpen}
        onOpenChange={setCreateOpen}
      />

      <PropertyFormDialog
        key={editingProperty?.uuid ?? "edit"}
        open={!!editingProperty}
        onOpenChange={(open) => {
          if (!open) setEditingProperty(null);
        }}
        property={editingProperty}
      />

      <AlertDialog
        open={!!deletingProperty}
        onOpenChange={(open) => {
          if (!open) setDeletingProperty(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete property</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletingProperty?.name}
              &quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeletePending}
              onClick={handleDeleteConfirm}
            >
              {isDeletePending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
