import type { Metadata } from "next";

import { BackButton } from "@/features/property-units/components/back-button";
import { PropertySummaryCard } from "@/features/property-units/components/property-summary-card";
import { PropertyUnitList } from "@/features/property-units/components/property-unit-list";
import { UnitDashboardCards } from "@/features/property-units/components/unit-dashboard-cards";

export const metadata: Metadata = {
  title: "Property units",
};

export default async function PropertyUnitsPage({
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
      <PropertySummaryCard propertyUuid={uuid} />
      <UnitDashboardCards propertyUuid={uuid} />
      <PropertyUnitList propertyUuid={uuid} />
    </div>
  );
}
