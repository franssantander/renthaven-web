import type { Metadata } from "next";

import { BackButton } from "@/features/property-units/components/back-button";
import { TenantDetailView } from "@/features/tenants/components/tenant-detail-view";

export const metadata: Metadata = {
  title: "Tenant details",
};

export default async function TenantDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ leaseUuid: string }>;
  searchParams: Promise<{ unit?: string }>;
}) {
  const { leaseUuid } = await params;
  const { unit } = await searchParams;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <BackButton />
      </div>
      <TenantDetailView leaseUuid={leaseUuid} unitUuid={unit ?? null} />
    </div>
  );
}
