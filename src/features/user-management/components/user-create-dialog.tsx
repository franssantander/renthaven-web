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

function CreateUserForm({ onSuccess }: { onSuccess: () => void }) {
  const form = useUserForm({ mode: "create", onSuccess });

  return (
    <form
      onSubmit={form.handleSubmit}
      noValidate
      className="flex min-h-0 flex-1 flex-col"
    >
      <DialogHeader className="border-b px-6 py-4">
        <DialogTitle>Add user</DialogTitle>
        <DialogDescription>
          Create a new admin or staff account.
        </DialogDescription>
      </DialogHeader>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        <UserFormFields idPrefix="create-user" {...form} />
      </div>

      <DialogFooter className="border-t px-6 py-4">
        <Button type="submit" disabled={form.isPending}>
          {form.isPending ? "Creating..." : "Create user"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function UserCreateDialog({ open, onOpenChange }: UserCreateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] w-full flex-col gap-0 p-0 sm:max-w-md">
        {open ? (
          <CreateUserForm onSuccess={() => onOpenChange(false)} />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
