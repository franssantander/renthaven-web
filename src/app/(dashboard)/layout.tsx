"use client";

import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar";
import { useDashboardGate } from "@/features/dashboard/hooks/use-dashboard-gate";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isReady, currentUser } = useDashboardGate();

  if (!isReady) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col">
        <DashboardHeader currentUser={currentUser} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
