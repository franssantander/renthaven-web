"use client";

import type { ApiError } from "@/lib/axios";
import { useMaintenanceRequestQuery } from "../queries/maintenance-query";

export function useMaintenanceDetail(requestUuid: string) {
  const { data, isLoading, isError, error, refetch } =
    useMaintenanceRequestQuery(requestUuid);

  return {
    request: data,
    isLoading,
    isError,
    error: error as ApiError | null,
    notFound: !isLoading && !data,
    refetch,
  };
}
