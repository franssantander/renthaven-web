"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUserForm } from "../hooks/use-user-form";
import { UserFormFields } from "./user-form-fields";

type UserCreateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function UserCreateDialog({ open, onOpenChange }: UserCreateDialogProps) {
  const form = useUserForm({
    mode: "create",
    onSuccess: () => onOpenChange(false),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={form.handleSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>Add user</DialogTitle>
            <DialogDescription>
              Create a new admin or staff account.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <UserFormFields idPrefix="create-user" {...form} />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={form.isPending}>
              {form.isPending ? "Creating..." : "Create user"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
