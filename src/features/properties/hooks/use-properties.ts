"use client";

import { useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/axios";
import {
  useDeletePropertyMutation,
  usePropertiesQuery,
} from "../queries/property-query";
import type { Property } from "../types";

const PER_PAGE = 15;

function matchesSearch(property: Property, search: string): boolean {
  const term = search.trim().toLowerCase();
  if (!term) return true;

  return (
    property.name.toLowerCase().includes(term) ||
    (property.address ?? "").toLowerCase().includes(term)
  );
}

export function usePropertiesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data, isLoading, isFetching, isError, error, refetch } =
    usePropertiesQuery({
      page,
      per_page: PER_PAGE,
    });

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const [createOpen, setCreateOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(
    null,
  );
  const [deletingProperty, setDeletingProperty] = useState<Property | null>(
    null,
  );

  const deleteMutation = useDeletePropertyMutation();

  const handleDeleteConfirm = () => {
    if (!deletingProperty) return;

    deleteMutation.mutate(deletingProperty.uuid, {
      onSuccess: () => {
        toast.success("Property deleted successfully.");
        setDeletingProperty(null);
      },
      onError: (err) => {
        toast.error((err as ApiError).message);
      },
    });
  };

  return {
    properties: (data?.data ?? []).filter((property) =>
      matchesSearch(property, search),
    ),
    meta: data?.meta,
    isLoading,
    isFetching,
    isError,
    error: error as ApiError | null,
    page,
    setPage,
    handleSearchChange,
    refetch,
    createOpen,
    setCreateOpen,
    editingProperty,
    setEditingProperty,
    deletingProperty,
    setDeletingProperty,
    handleDeleteConfirm,
    isDeletePending: deleteMutation.isPending,
  };
}
