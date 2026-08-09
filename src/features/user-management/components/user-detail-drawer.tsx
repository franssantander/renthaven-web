"use client";

import { useState } from "react";
import { Pencil, X } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUserQuery } from "@/features/auth/queries/auth-query";
import { getInitials } from "@/features/dashboard/lib/get-initials";
import { useUserForm } from "../hooks/use-user-form";
import { useUserQuery } from "../queries/user-management-query";
import type { SystemUser } from "../types";
import { UserFormFields } from "./user-form-fields";

type UserDetailDrawerProps = {
  uuid: string | null;
  onOpenChange: (open: boolean) => void;
  onDeleteRequest: (user: SystemUser) => void;
};

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  );
}

function UserEditForm({
  user,
  onDone,
}: {
  user: SystemUser;
  onDone: () => void;
}) {
  const form = useUserForm({ mode: "edit", user, onSuccess: onDone });

  return (
    <form onSubmit={form.handleSubmit} noValidate className="flex flex-col gap-4">
      <UserFormFields idPrefix="edit-user" {...form} />
      <div className="flex items-center gap-2">
        <Button type="submit" disabled={form.isPending}>
          {form.isPending ? "Saving..." : "Save changes"}
        </Button>
        <Button type="button" variant="outline" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function UserDetailBody({
  uuid,
  onDeleteRequest,
}: {
  uuid: string;
  onDeleteRequest: (user: SystemUser) => void;
}) {
  const [editMode, setEditMode] = useState(false);
  const { data: user, isLoading } = useUserQuery(uuid);
  const { data: currentUserData } = useCurrentUserQuery();
  const isSelf = currentUserData?.data.id === user?.id;

  return (
    <>
      <SheetHeader>
        <SheetTitle className="sr-only">User details</SheetTitle>
        {isLoading || !user ? (
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-full" />
            <Skeleton className="h-5 w-40" />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Avatar size="lg">
              <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium">{user.full_name}</p>
              <Badge variant={user.status === "active" ? "info" : "secondary"}>
                {user.status === "active" ? "Active" : "Inactive"}
              </Badge>
            </div>
            {!editMode ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditMode(true)}
              >
                <Pencil className="size-4" />
                Edit
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setEditMode(false)}
              >
                <X className="size-4" />
                <span className="sr-only">Cancel edit</span>
              </Button>
            )}
          </div>
        )}
        <SheetDescription>
          {editMode
            ? "Update this user's account details."
            : "View this user's account details."}
        </SheetDescription>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto px-4">
        {isLoading || !user ? (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
        ) : editMode ? (
          <UserEditForm user={user} onDone={() => setEditMode(false)} />
        ) : (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <DetailRow label="Username" value={user.username} />
              <DetailRow label="Role" value={user.role.role_name} />
              <DetailRow label="Email" value={user.email} />
              <DetailRow label="Phone" value={user.phone ?? "—"} />
            </div>
            {user.tenant_business ? (
              <DetailRow label="Business" value={user.tenant_business.name} />
            ) : null}
          </div>
        )}
      </div>

      {!isLoading && user && !editMode ? (
        <SheetFooter className="border-t border-destructive/30 bg-destructive/5">
          <p className="text-sm font-medium text-destructive">Danger zone</p>
          <p className="text-xs text-muted-foreground">
            Deleting a user is permanent and cannot be undone.
          </p>
          <Button
            variant="destructive"
            disabled={isSelf}
            title={isSelf ? "You cannot delete your own account" : undefined}
            onClick={() => onDeleteRequest(user)}
          >
            Delete user
          </Button>
        </SheetFooter>
      ) : null}
    </>
  );
}

export function UserDetailDrawer({
  uuid,
  onOpenChange,
  onDeleteRequest,
}: UserDetailDrawerProps) {
  return (
    <Sheet open={!!uuid} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        {uuid ? (
          <UserDetailBody
            key={uuid}
            uuid={uuid}
            onDeleteRequest={onDeleteRequest}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
