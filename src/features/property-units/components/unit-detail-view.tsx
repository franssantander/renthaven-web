"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Skeleton } from "@/components/ui/skeleton";
import { AssignTenantDialog } from "@/features/leases/components/assign-tenant-dialog";
import { ReassignTenantDialog } from "@/features/leases/components/reassign-tenant-dialog";
import { TerminateLeaseDialog } from "@/features/leases/components/terminate-lease-dialog";
import { useUnitLeasesQuery } from "@/features/leases/queries/lease-query";
import type { Lease } from "@/features/leases/types";
import { usePropertyUnitQuery } from "../queries/property-unit-query";
import { UnitAttachmentsManager } from "./unit-attachments-manager";
import { UnitDetailHeader } from "./unit-detail-header";
import { UnitDetailOverview } from "./unit-detail-overview";
import { UnitFormDialog } from "./unit-form-dialog";
import { UnitTenantsSection } from "./unit-tenants-section";

type UnitDetailViewProps = {
  propertyUuid: string;
  unitUuid: string;
};

export function UnitDetailView({
  propertyUuid,
  unitUuid,
}: UnitDetailViewProps) {
  const queryClient = useQueryClient();
  const { data: unit, isLoading } = usePropertyUnitQuery(unitUuid);
  const leasesQuery = useUnitLeasesQuery(unitUuid);

  const [editMode, setEditMode] = useState(false);
  const [editUnitOpen, setEditUnitOpen] = useState(false);
  const [managePhotosOpen, setManagePhotosOpen] = useState(false);
  const [assignTenantOpen, setAssignTenantOpen] = useState(false);
  const [reassigningLease, setReassigningLease] = useState<Lease | null>(
    null,
  );
  const [terminatingLease, setTerminatingLease] = useState<Lease | null>(
    null,
  );

  const invalidateDetail = () =>
    queryClient.invalidateQueries({
      queryKey: ["property-units", "detail", unitUuid],
    });

  if (isLoading || !unit) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <UnitDetailHeader
        unit={unit}
        editMode={editMode}
        onToggleEditMode={() => setEditMode((value) => !value)}
      />

      <UnitDetailOverview
        unit={unit}
        editMode={editMode}
        onEditDetails={() => setEditUnitOpen(true)}
        onManagePhotos={() => setManagePhotosOpen(true)}
      />

      <UnitTenantsSection
        unit={unit}
        leases={leasesQuery.data?.data ?? []}
        isLoading={leasesQuery.isLoading}
        editMode={editMode}
        onAssignTenant={() => setAssignTenantOpen(true)}
        onReassign={setReassigningLease}
        onRemove={setTerminatingLease}
      />

      <UnitFormDialog
        key={unit.uuid}
        open={editUnitOpen}
        onOpenChange={(open) => {
          setEditUnitOpen(open);
          if (!open) invalidateDetail();
        }}
        propertyUuid={propertyUuid}
        unit={unit}
      />

      <UnitAttachmentsManager
        open={managePhotosOpen}
        onOpenChange={(open) => {
          setManagePhotosOpen(open);
          if (!open) invalidateDetail();
        }}
        propertyUuid={propertyUuid}
        unit={unit}
      />

      <AssignTenantDialog
        open={assignTenantOpen}
        onOpenChange={setAssignTenantOpen}
        propertyUnitUuid={unit.uuid}
      />

      <ReassignTenantDialog
        open={!!reassigningLease}
        onOpenChange={(open) => {
          if (!open) setReassigningLease(null);
        }}
        lease={reassigningLease}
        propertyUuid={propertyUuid}
      />

      <TerminateLeaseDialog
        open={!!terminatingLease}
        onOpenChange={(open) => {
          if (!open) setTerminatingLease(null);
        }}
        lease={terminatingLease}
      />
    </div>
  );
}
