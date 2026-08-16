import type { DataTableColumn } from "@/components/shared/data-table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Lease } from "@/features/leases/types";

function formatDate(date: string | null): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function TenantCell({ lease }: { lease: Lease }) {
  const renter = lease.renter;

  return (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarFallback>
          {renter ? `${renter.first_name[0]}${renter.last_name[0]}` : "?"}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium">
          {renter ? `${renter.first_name} ${renter.last_name}` : "Unknown tenant"}
        </p>
        <p className="text-sm text-muted-foreground">{renter?.email}</p>
      </div>
    </div>
  );
}

export function getTenantColumns(): DataTableColumn<Lease>[] {
  return [
    {
      id: "tenant",
      header: "Tenant",
      cell: (lease) => <TenantCell lease={lease} />,
    },
    {
      id: "unit",
      header: "Unit",
      cell: (lease) => (
        <div>
          <p className="font-medium">
            {lease.property_unit?.property?.name ?? "—"}
          </p>
          <p className="text-sm text-muted-foreground">
            {lease.property_unit?.name ?? "—"}
          </p>
        </div>
      ),
    },
    {
      id: "term_type",
      header: "Term",
      cell: (lease) => (
        <Badge variant="outline">
          {lease.term_type === "monthly" ? "Monthly" : "Fixed term"}
        </Badge>
      ),
    },
    {
      id: "dates",
      header: "Lease period",
      cell: (lease) => (
        <span className="text-muted-foreground">
          {formatDate(lease.start_date)} – {formatDate(lease.end_date)}
        </span>
      ),
    },
    {
      id: "rent_price",
      header: "Rent",
      cell: (lease) =>
        lease.property_unit ? (
          <span>
            {new Intl.NumberFormat("en-US").format(
              lease.property_unit.rent_price,
            )}
            <span className="text-muted-foreground">/mo</span>
          </span>
        ) : (
          "—"
        ),
    },
  ];
}
