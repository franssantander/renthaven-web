import type { Metadata } from "next";

import { BackButton } from "@/features/property-units/components/back-button";
import { UnitDetailView } from "@/features/property-units/components/unit-detail-view";

export const metadata: Metadata = {
  title: "Unit details",
};

export default async function PropertyUnitDetailPage({
  params,
}: {
  params: Promise<{ uuid: string; unitUuid: string }>;
}) {
  const { uuid, unitUuid } = await params;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <BackButton />
      </div>
      <UnitDetailView propertyUuid={uuid} unitUuid={unitUuid} />
    </div>
  );
}
