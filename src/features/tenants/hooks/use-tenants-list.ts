"use client";

import { useState } from "react";

import { useLeasesQuery } from "@/features/leases/queries/lease-query";
import type { ApiError } from "@/lib/axios";

const DEFAULT_PER_PAGE = 15;

export function useTenantsList() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE);

  const { data, isLoading, isFetching, isError, error, refetch } =
    useLeasesQuery({ page, per_page: perPage });

  const handlePerPageChange = (value: number) => {
    setPerPage(value);
    setPage(1);
  };

  return {
    leases: data?.data ?? [],
    meta: data?.meta,
    isLoading,
    isFetching,
    isError,
    error: error as ApiError | null,
    page,
    setPage,
    perPage,
    handlePerPageChange,
    refetch,
  };
}
