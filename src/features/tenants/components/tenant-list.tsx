"use client";

import { useRouter } from "next/navigation";

import { DataTable } from "@/components/shared/data-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTenantColumns } from "../config/tenant-columns";
import { useTenantsList } from "../hooks/use-tenants-list";

export function TenantList() {
  const router = useRouter();
  const {
    leases,
    meta,
    isLoading,
    isFetching,
    isError,
    error,
    page,
    setPage,
    perPage,
    handlePerPageChange,
    refetch,
  } = useTenantsList();

  const columns = getTenantColumns();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tenants</CardTitle>
        <CardDescription>
          Tenants currently renting a unit across your properties.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={leases}
          getRowId={(lease) => lease.uuid}
          isLoading={isLoading}
          isFetching={isFetching}
          isError={isError}
          errorMessage={error?.message}
          emptyMessage="No tenants yet. Assign a tenant to a unit to get started."
          onRefresh={refetch}
          onRowClick={(lease) =>
            router.push(
              `/tenants/${lease.uuid}?unit=${lease.property_unit?.uuid ?? ""}`,
            )
          }
          page={page}
          onPageChange={setPage}
          lastPage={meta?.last_page}
          perPage={perPage}
          onPerPageChange={handlePerPageChange}
        />
      </CardContent>
    </Card>
  );
}
