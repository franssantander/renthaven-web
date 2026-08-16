import type { Metadata } from "next";

import { BackButton } from "@/features/property-units/components/back-button";
import { MaintenanceDetailView } from "@/features/maintenance/components/maintenance-detail-view";

export const metadata: Metadata = {
  title: "Maintenance request",
};

export default async function MaintenanceDetailPage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <BackButton />
      </div>
      <MaintenanceDetailView requestUuid={uuid} />
    </div>
  );
}
