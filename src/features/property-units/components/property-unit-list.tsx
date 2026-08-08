"use client";

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePropertyUnitPage } from "../hooks/use-property-unit-page";
import { UnitAttachmentsManager } from "./unit-attachments-manager";
import { UnitFormDialog } from "./unit-form-dialog";
import { UnitList } from "./unit-list";

type PropertyUnitListProps = {
  propertyUuid: string;
};

export function PropertyUnitList({ propertyUuid }: PropertyUnitListProps) {
  const {
    units,
    isLoading,
    isFetching,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    setSearch,
    handleRefresh,
    createOpen,
    setCreateOpen,
    editingUnit,
    setEditingUnit,
    deletingUnit,
    setDeletingUnit,
    handleDeleteConfirm,
    isDeletePending,
    managingAttachmentsUnit,
    setManagingAttachmentsUuid,
  } = usePropertyUnitPage(propertyUuid);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Units</CardTitle>
      </CardHeader>
      <CardContent>
        <UnitList
          units={units}
          propertyUuid={propertyUuid}
          isLoading={isLoading}
          isFetching={isFetching}
          isError={isError}
          errorMessage={error?.message}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onFetchNextPage={fetchNextPage}
          onSearchChange={setSearch}
          onRefresh={handleRefresh}
          onCreate={() => setCreateOpen(true)}
          onEdit={setEditingUnit}
          onDelete={setDeletingUnit}
          onManagePhotos={(unit) => setManagingAttachmentsUuid(unit.uuid)}
        />
      </CardContent>

      <UnitFormDialog
        key="create"
        open={createOpen}
        onOpenChange={setCreateOpen}
        propertyUuid={propertyUuid}
      />

      <UnitFormDialog
        key={editingUnit?.uuid ?? "edit"}
        open={!!editingUnit}
        onOpenChange={(open) => {
          if (!open) setEditingUnit(null);
        }}
        propertyUuid={propertyUuid}
        unit={editingUnit}
      />

      <UnitAttachmentsManager
        open={!!managingAttachmentsUnit}
        onOpenChange={(open) => {
          if (!open) setManagingAttachmentsUuid(null);
        }}
        propertyUuid={propertyUuid}
        unit={managingAttachmentsUnit}
      />

      <AlertDialog
        open={!!deletingUnit}
        onOpenChange={(open) => {
          if (!open) setDeletingUnit(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete unit</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletingUnit?.name}&quot;?
              This action cannot be undone.
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
