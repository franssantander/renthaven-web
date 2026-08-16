"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { STAFF_ROLES } from "@/features/auth/lib/role-routes";
import { useUsersQuery } from "@/features/user-management/queries/user-management-query";
import {
  getMaintenanceStatusLabel,
  MAINTENANCE_STATUS_OPTIONS,
} from "../config/maintenance-status";
import { useUpdateMaintenanceStatusForm } from "../hooks/use-update-maintenance-status-form";
import type { MaintenanceRequest, MaintenanceRequestStatus } from "../types";

const UNASSIGNED_VALUE = "unassigned";

type UpdateMaintenanceStatusDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: MaintenanceRequest;
};

export function UpdateMaintenanceStatusDialog({
  open,
  onOpenChange,
  request,
}: UpdateMaintenanceStatusDialogProps) {
  const [lastOpen, setLastOpen] = useState(open);

  const {
    values,
    fieldError,
    resetTo,
    setStatus,
    setNotes,
    setAssignedToUuid,
    handleSubmit,
    isPending,
  } = useUpdateMaintenanceStatusForm({
    requestUuid: request.uuid,
    onSuccess: () => onOpenChange(false),
  });

  // Reset the form when the dialog transitions to open, computed during
  // render rather than in an effect, per https://react.dev/learn/you-might-not-need-an-effect.
  if (open !== lastOpen) {
    setLastOpen(open);
    if (open) {
      resetTo(request);
    }
  }

  const { data: users } = useUsersQuery({ per_page: 100 });
  const staffOptions = (users?.data ?? []).filter((user) =>
    (STAFF_ROLES as readonly string[]).includes(user.role.slug),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>Update status</DialogTitle>
            <DialogDescription>
              Change the status, assignee, or add a note for this request.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <Field invalid={!!fieldError("status")}>
              <FieldLabel htmlFor="maintenance-status">Status</FieldLabel>
              <Select
                value={values.status}
                onValueChange={(value: MaintenanceRequestStatus | null) =>
                  value && setStatus(value)
                }
              >
                <SelectTrigger id="maintenance-status" className="w-full">
                  <SelectValue>
                    {(value: MaintenanceRequestStatus) =>
                      getMaintenanceStatusLabel(value)
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {MAINTENANCE_STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldError("status") ? (
                <FieldError>{fieldError("status")}</FieldError>
              ) : null}
            </Field>

            <Field>
              <FieldLabel htmlFor="maintenance-assignee">
                Assignee
              </FieldLabel>
              <Select
                value={values.assigned_to_uuid ?? UNASSIGNED_VALUE}
                onValueChange={(value: string | null) =>
                  setAssignedToUuid(
                    !value || value === UNASSIGNED_VALUE ? undefined : value,
                  )
                }
              >
                <SelectTrigger id="maintenance-assignee" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UNASSIGNED_VALUE}>Unassigned</SelectItem>
                  {staffOptions.map((user) => (
                    <SelectItem key={user.uuid} value={user.uuid}>
                      {user.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="maintenance-notes">
                Notes (optional)
              </FieldLabel>
              <Textarea
                id="maintenance-notes"
                value={values.notes}
                onChange={setNotes}
              />
            </Field>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
