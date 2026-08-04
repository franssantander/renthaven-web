"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/axios";
import { usePropertyQuery } from "@/features/properties/queries/property-query";
import {
  useDeletePropertyUnitMutation,
  usePropertyUnitDashboardQuery,
  usePropertyUnitsInfiniteQuery,
} from "../queries/property-unit-query";
import type { PropertyUnit } from "../types";

function matchesSearch(unit: PropertyUnit, search: string): boolean {
  const term = search.trim().toLowerCase();
  if (!term) return true;

  return unit.name.toLowerCase().includes(term);
}

export function usePropertyUnitPage(propertyUuid: string) {
  const [search, setSearch] = useState("");

  const propertyQuery = usePropertyQuery(propertyUuid);
  const dashboardQuery = usePropertyUnitDashboardQuery(propertyUuid);
  const unitsQuery = usePropertyUnitsInfiniteQuery(propertyUuid);

  const allUnits = useMemo(
    () => (unitsQuery.data?.pages ?? []).flatMap((page) => page.data),
    [unitsQuery.data],
  );

  const units = useMemo(
    () => allUnits.filter((unit) => matchesSearch(unit, search)),
    [allUnits, search],
  );

  const handleRefresh = () => {
    unitsQuery.refetch();
    dashboardQuery.refetch();
  };

  const [createOpen, setCreateOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<PropertyUnit | null>(null);
  const [deletingUnit, setDeletingUnit] = useState<PropertyUnit | null>(null);
  const [managingAttachmentsUuid, setManagingAttachmentsUuid] = useState<
    string | null
  >(null);
  // Look up the live unit by uuid (rather than storing the object itself) so
  // uploads/removals made while the dialog is open are reflected immediately
  // once the query invalidation refetches the list.
  const managingAttachmentsUnit =
    allUnits.find((unit) => unit.uuid === managingAttachmentsUuid) ?? null;

  const deleteMutation = useDeletePropertyUnitMutation(propertyUuid);

  const handleDeleteConfirm = () => {
    if (!deletingUnit) return;

    deleteMutation.mutate(deletingUnit.uuid, {
      onSuccess: () => {
        toast.success("Unit deleted successfully.");
        setDeletingUnit(null);
      },
      onError: (err) => {
        toast.error((err as ApiError).message);
      },
    });
  };

  return {
    property: propertyQuery.data,
    isPropertyLoading: propertyQuery.isLoading,
    metrics: dashboardQuery.data?.metrics,
    isMetricsLoading: dashboardQuery.isLoading,
    units,
    isLoading: unitsQuery.isLoading,
    isFetching: unitsQuery.isFetching,
    isError: unitsQuery.isError,
    error: unitsQuery.error as ApiError | null,
    hasNextPage: unitsQuery.hasNextPage,
    isFetchingNextPage: unitsQuery.isFetchingNextPage,
    fetchNextPage: unitsQuery.fetchNextPage,
    search,
    setSearch,
    handleRefresh,
    createOpen,
    setCreateOpen,
    editingUnit,
    setEditingUnit,
    deletingUnit,
    setDeletingUnit,
    handleDeleteConfirm,
    isDeletePending: deleteMutation.isPending,
    managingAttachmentsUnit,
    setManagingAttachmentsUuid,
  };
}
