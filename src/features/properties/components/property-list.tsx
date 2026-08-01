"use client";

import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";

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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils/utils";
import { getPropertyTypeLabel } from "../config/property-types";
import { usePropertiesPage } from "../hooks/use-properties";
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
    createOpen,
    setCreateOpen,
    editingProperty,
    setEditingProperty,
    deletingProperty,
    setDeletingProperty,
    handleDeleteConfirm,
    isDeletePending,
  } = usePropertiesPage();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Properties</CardTitle>
          <CardDescription>
            Manage the properties in your portfolio.
          </CardDescription>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="size-4" />
          Add property
        </Button>
      </CardHeader>
      <CardContent>
        {isError ? (
          <p className="py-8 text-center text-sm text-destructive">
            {error?.message ?? "Failed to load properties."}
          </p>
        ) : isLoading ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
        ) : properties.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No properties yet. Add your first property to get started.
          </p>
        ) : (
          <Table className={cn(isFetching && "opacity-60 transition-opacity")}>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Amenities</TableHead>
                <TableHead className="w-10">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((property) => (
                <TableRow key={property.uuid}>
                  <TableCell className="font-medium">
                    {property.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getPropertyTypeLabel(property.type)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {property.address || "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {property.amenities?.length ?? 0}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={<Button variant="ghost" size="icon-sm" />}
                      >
                        <MoreHorizontal className="size-4" />
                        <span className="sr-only">Open actions</span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setEditingProperty(property)}
                        >
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {meta && meta.last_page > 1 ? (
          <Pagination className="mt-4 justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    if (page > 1) setPage(page - 1);
                  }}
                  className={cn(page <= 1 && "pointer-events-none opacity-50")}
                />
              </PaginationItem>
              <PaginationItem>
                <span className="px-2 text-sm text-muted-foreground">
                  Page {meta.current_page} of {meta.last_page}
                </span>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    if (page < meta.last_page) setPage(page + 1);
                  }}
                  className={cn(
                    page >= meta.last_page && "pointer-events-none opacity-50",
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        ) : null}
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
