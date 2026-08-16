"use client";

import { useState } from "react";

import type { ApiError } from "@/lib/axios";
import { useLedgerEntriesQuery } from "../queries/ledger-query";
import type { LedgerEntry, LedgerStatus } from "../types";

const DEFAULT_PER_PAGE = 15;

export function useLedgerList() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE);
  const [status, setStatus] = useState<LedgerStatus | "all">("all");

  const { data, isLoading, isFetching, isError, error, refetch } =
    useLedgerEntriesQuery({
      page,
      per_page: perPage,
      status: status === "all" ? undefined : status,
    });

  const handlePerPageChange = (value: number) => {
    setPerPage(value);
    setPage(1);
  };

  const handleStatusChange = (value: LedgerStatus | "all") => {
    setStatus(value);
    setPage(1);
  };

  const [payingEntry, setPayingEntry] = useState<LedgerEntry | null>(null);
  const [rejectingEntry, setRejectingEntry] = useState<LedgerEntry | null>(
    null,
  );
  const [sendingReminderEntry, setSendingReminderEntry] =
    useState<LedgerEntry | null>(null);

  return {
    entries: data?.data ?? [],
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
    refetch,
    payingEntry,
    setPayingEntry,
    rejectingEntry,
    setRejectingEntry,
    sendingReminderEntry,
    setSendingReminderEntry,
  };
}
