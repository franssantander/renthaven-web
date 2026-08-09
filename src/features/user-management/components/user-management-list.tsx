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
import { getUserColumns } from "../config/user-columns";
import { useUserManagementList } from "../hooks/use-user-management-list";
import { UserCreateDialog } from "./user-create-dialog";
import { UserDetailDrawer } from "./user-detail-drawer";

export function UserManagementList() {
  const {
    users,
    lastPage,
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
    selectedUuid,
    setSelectedUuid,
    deletingUser,
    setDeletingUser,
    handleDeleteConfirm,
    isDeletePending,
  } = useUserManagementList();

  const columns = getUserColumns({
    onView: (user) => setSelectedUuid(user.uuid),
    onDelete: setDeletingUser,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>
          Manage the admin and staff accounts on your team.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={users}
          getRowId={(user) => user.uuid}
          isLoading={isLoading}
          isFetching={isFetching}
          isError={isError}
          errorMessage={error?.message}
          emptyMessage="No users yet. Add your first user to get started."
          onSearchChange={handleSearchChange}
          searchPlaceholder="Search users..."
          onRefresh={refetch}
          onRowClick={(user) => setSelectedUuid(user.uuid)}
          page={page}
          onPageChange={setPage}
          lastPage={lastPage}
          perPage={perPage}
          onPerPageChange={handlePerPageChange}
          toolbarActions={
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="size-4" />
              Add user
            </Button>
          }
        />
      </CardContent>

      <UserCreateDialog open={createOpen} onOpenChange={setCreateOpen} />

      <UserDetailDrawer
        uuid={selectedUuid}
        onOpenChange={(open) => {
          if (!open) setSelectedUuid(null);
        }}
        onDeleteRequest={setDeletingUser}
      />

      <AlertDialog
        open={!!deletingUser}
        onOpenChange={(open) => {
          if (!open) setDeletingUser(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletingUser?.full_name}
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
