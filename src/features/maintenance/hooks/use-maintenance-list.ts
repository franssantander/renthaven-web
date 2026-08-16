"use client";

import { useState } from "react";

import type { ApiError } from "@/lib/axios";
import { useMaintenanceRequestsQuery } from "../queries/maintenance-query";
import type { MaintenancePriority, MaintenanceRequestStatus } from "../types";

const DEFAULT_PER_PAGE = 15;

export function useMaintenanceList() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE);
  const [status, setStatus] = useState<MaintenanceRequestStatus | "all">(
    "all",
  );
  const [priority, setPriority] = useState<MaintenancePriority | "all">(
    "all",
  );
  const [createOpen, setCreateOpen] = useState(false);

  const { data, isLoading, isFetching, isError, error, refetch } =
    useMaintenanceRequestsQuery({
      page,
      per_page: perPage,
      status: status === "all" ? undefined : status,
      priority: priority === "all" ? undefined : priority,
    });

  const handlePerPageChange = (value: number) => {
    setPerPage(value);
    setPage(1);
  };

  const handleStatusChange = (value: MaintenanceRequestStatus | "all") => {
    setStatus(value);
    setPage(1);
  };

  const handlePriorityChange = (value: MaintenancePriority | "all") => {
    setPriority(value);
    setPage(1);
  };

  return {
    requests: data?.data ?? [],
    meta: data?.meta,
    isLoading,
    isFetching,
    isError,
    error: error as ApiError | null,
    page,
    setPage,
    perPage,
    handlePerPageChange,
    status,
    handleStatusChange,
    priority,
    handlePriorityChange,
    refetch,
    createOpen,
    setCreateOpen,
  };
}
