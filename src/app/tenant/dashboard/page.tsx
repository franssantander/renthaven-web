import { TenantLeaseCard } from "@/features/tenant/components/tenant-lease-card";
import { TenantProfileCard } from "@/features/tenant/components/tenant-profile-card";
import { TenantTransactionsList } from "@/features/tenant/components/tenant-transactions-list";

export default function TenantDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <TenantProfileCard />
      <TenantLeaseCard />
      <TenantTransactionsList />
    </div>
  );
}
