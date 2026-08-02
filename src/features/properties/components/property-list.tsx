"use client";

import { Plus } from "lucide-react";

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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/shared/data-table";
import { getPropertyColumns } from "../config/property-columns";
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
    perPage,
    handlePerPageChange,
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

  const columns = getPropertyColumns({
    onEdit: setEditingProperty,
    onDelete: setDeletingProperty,
  });

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
          perPage={perPage}
          onPerPageChange={handlePerPageChange}
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
