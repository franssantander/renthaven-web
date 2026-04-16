"use client";

import { HugeiconsIcon } from "@hugeicons/react";

import { cn } from "@/shared/lib/utils";
import {
  Building01Icon,
  CalendarCheckIn01FreeIcons,
  Cancel01FreeIcons,
  CheckmarkCircle01FreeIcons,
  Clock01FreeIcons,
  Money01FreeIcons,
  TimeQuarter02FreeIcons,
  TrendingDown,
  TrendingUp,
  UserMultiple03FreeIcons,
} from "@hugeicons/core-free-icons";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatCard {
  label: string;
  value: string;
  change: string;
  up: boolean;
  icon: React.ElementType;
  color: string;
}

interface Booking {
  id: string;
  tenant: string;
  property: string;
  date: string;
  amount: string;
  status: "approved" | "pending" | "rejected";
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const STATS: StatCard[] = [
  {
    label: "Total Properties",
    value: "48",
    change: "+3 this month",
    up: true,
    icon: Building01Icon,
    color: "text-blue-500 bg-blue-500/10",
  },
  {
    label: "Active Tenants",
    value: "134",
    change: "+12 this month",
    up: true,
    icon: UserMultiple03FreeIcons,
    color: "text-emerald-500 bg-emerald-500/10",
  },
  {
    label: "Bookings",
    value: "27",
    change: "-2 this month",
    up: false,
    icon: CalendarCheckIn01FreeIcons,
    color: "text-violet-500 bg-violet-500/10",
  },
  {
    label: "Revenue",
    value: "₱284,500",
    change: "+8.2% this month",
    up: true,
    icon: Money01FreeIcons,
    color: "text-amber-500 bg-amber-500/10",
  },
];

const RECENT_BOOKINGS: Booking[] = [
  {
    id: "BK-001",
    tenant: "Maria Santos",
    property: "Unit 4B — Makati",
    date: "Jan 20, 2025",
    amount: "₱18,000",
    status: "approved",
  },
  {
    id: "BK-002",
    tenant: "Juan dela Cruz",
    property: "Studio 2A — BGC",
    date: "Jan 21, 2025",
    amount: "₱22,500",
    status: "pending",
  },
  {
    id: "BK-003",
    tenant: "Ana Reyes",
    property: "Unit 7C — Mandaluyong",
    date: "Jan 22, 2025",
    amount: "₱15,000",
    status: "approved",
  },
  {
    id: "BK-004",
    tenant: "Carlos Tan",
    property: "Loft 1D — Pasig",
    date: "Jan 23, 2025",
    amount: "₱28,000",
    status: "rejected",
  },
  {
    id: "BK-005",
    tenant: "Lisa Gomez",
    property: "Unit 3B — Quezon City",
    date: "Jan 24, 2025",
    amount: "₱12,500",
    status: "pending",
  },
];

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  approved: {
    label: "Approved",
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    icon: CheckmarkCircle01FreeIcons,
  },
  pending: {
    label: "Pending",
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    icon: TimeQuarter02FreeIcons,
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-500/10 text-red-600 dark:text-red-400",
    icon: Cancel01FreeIcons,
  },
};

// ─── Dashboard page ───────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <p className="text-xs font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <p className="text-2xl font-semibold tracking-tight text-foreground">
                  {stat.value}
                </p>
                <div className="flex items-center gap-1.5">
                  <HugeiconsIcon
                    icon={stat.up ? TrendingUp : TrendingDown}
                    strokeWidth={2}
                    className={cn(
                      "h-3.5 w-3.5",
                      stat.up ? "text-emerald-500" : "text-red-500",
                    )}
                  />
                  <span
                    className={cn(
                      "text-xs font-medium",
                      stat.up
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-600 dark:text-red-400",
                    )}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={cn("rounded-lg p-2.5", stat.color)}>
                <HugeiconsIcon
                  icon={stat.icon}
                  strokeWidth={1.5}
                  className="h-5 w-5"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
