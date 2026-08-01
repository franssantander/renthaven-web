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

export function usePropertiesPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, isError, error } = usePropertiesQuery({
    page,
    per_page: PER_PAGE,
  });

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
    properties: data?.data ?? [],
    meta: data?.meta,
    isLoading,
    isFetching,
    isError,
    error: error as ApiError | null,
    page,
    setPage,
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
