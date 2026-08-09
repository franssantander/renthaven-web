"use client";

import { useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/axios";
import { useDeleteUserMutation, useUsersQuery } from "../queries/user-management-query";
import type { SystemUser } from "../types";

const DEFAULT_PER_PAGE = 15;

function matchesSearch(user: SystemUser, search: string): boolean {
  const term = search.trim().toLowerCase();
  if (!term) return true;

  return (
    user.full_name.toLowerCase().includes(term) ||
    user.email.toLowerCase().includes(term) ||
    user.username.toLowerCase().includes(term)
  );
}

export function useUserManagementList() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE);
  const [search, setSearch] = useState("");
  const { data, isLoading, isFetching, isError, error, refetch } =
    useUsersQuery({
      page,
      per_page: perPage,
    });

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handlePerPageChange = (value: number) => {
    setPerPage(value);
    setPage(1);
  };

  const [createOpen, setCreateOpen] = useState(false);
  const [selectedUuid, setSelectedUuid] = useState<string | null>(null);
  const [deletingUser, setDeletingUser] = useState<SystemUser | null>(null);

  const deleteMutation = useDeleteUserMutation();

  const handleDeleteConfirm = () => {
    if (!deletingUser) return;

    deleteMutation.mutate(deletingUser.uuid, {
      onSuccess: () => {
        toast.success("User deleted successfully.");
        setDeletingUser(null);
        setSelectedUuid((current) =>
          current === deletingUser.uuid ? null : current,
        );
      },
      onError: (err) => {
        toast.error((err as ApiError).message);
      },
    });
  };

  return {
    users: (data?.data ?? []).filter((user) => matchesSearch(user, search)),
    lastPage: data?.last_page,
    isLoading,
    isFetching,
    isError,
    error: error as ApiError | null,
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
    isDeletePending: deleteMutation.isPending,
  };
}
