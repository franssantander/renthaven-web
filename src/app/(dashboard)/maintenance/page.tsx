import type { Metadata } from "next";

import { MaintenanceList } from "@/features/maintenance/components/maintenance-list";

export const metadata: Metadata = {
  title: "Maintenance",
};

export default function MaintenancePage() {
  return <MaintenanceList />;
}
