"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useRoleGate } from "@/features/auth/hooks/use-role-gate";
import { TENANT_ROLES } from "@/features/auth/lib/role-routes";
import { TenantHeader } from "@/features/tenant/components/tenant-header";

function TenantLoadingSkeleton() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-6">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="size-8 rounded-full" />
      </div>
      <div className="flex-1 space-y-3 p-6">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
}

export default function TenantLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isReady, currentUser } = useRoleGate(TENANT_ROLES);

  if (!isReady) {
    return <TenantLoadingSkeleton />;
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <TenantHeader currentUser={currentUser} />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
