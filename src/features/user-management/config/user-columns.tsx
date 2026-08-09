import { MoreHorizontal, Trash2, UserRoundSearch } from "lucide-react";

import type { DataTableColumn } from "@/components/shared/data-table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials } from "@/features/dashboard/lib/get-initials";
import type { SystemUser, UserColumnActions } from "../types";

function UserNameCell({ user }: { user: SystemUser }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar size="sm">
        <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
      </Avatar>
      <span className="font-medium">{user.full_name}</span>
    </div>
  );
}

type UserActionsCellProps = UserColumnActions & {
  user: SystemUser;
};

function UserActionsCell({ user, onView, onDelete }: UserActionsCellProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon-sm" />}
        onClick={(event: React.MouseEvent) => event.stopPropagation()}
      >
        <MoreHorizontal className="size-4" />
        <span className="sr-only">Open actions</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        onClick={(event: React.MouseEvent) => event.stopPropagation()}
      >
        <DropdownMenuItem onClick={() => onView(user)}>
          <UserRoundSearch className="size-4" />
          View details
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onClick={() => onDelete(user)}>
          <Trash2 className="size-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function getUserColumns({
  onView,
  onDelete,
}: UserColumnActions): DataTableColumn<SystemUser>[] {
  return [
    {
      id: "name",
      header: "Name",
      cell: (user) => <UserNameCell user={user} />,
    },
    {
      id: "username",
      header: "Username",
      cell: (user) => (
        <span className="text-muted-foreground">{user.username}</span>
      ),
    },
    {
      id: "email",
      header: "Email",
      cell: (user) => (
        <span className="text-muted-foreground">{user.email}</span>
      ),
    },
    {
      id: "role",
      header: "Role",
      cell: (user) => <Badge variant="outline">{user.role.role_name}</Badge>,
    },
    {
      id: "status",
      header: "Status",
      cell: (user) => (
        <Badge variant={user.status === "active" ? "info" : "secondary"}>
          {user.status === "active" ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: <span className="sr-only">Actions</span>,
      headerClassName: "w-10",
      cell: (user) => (
        <UserActionsCell user={user} onView={onView} onDelete={onDelete} />
      ),
    },
  ];
}
