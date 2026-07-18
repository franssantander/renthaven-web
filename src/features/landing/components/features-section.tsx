import {
  BarChart3,
  Building2,
  CircleDollarSign,
  FileText,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Users,
    title: "Tenant management",
    description:
      "Keep tenant contacts, lease terms, and communication history in one organized record.",
  },
  {
    icon: CircleDollarSign,
    title: "Rent collection",
    description:
      "Track incoming rent, see who's paid, and send reminders for upcoming or overdue payments.",
  },
  {
    icon: Wrench,
    title: "Maintenance requests",
    description:
      "Let tenants submit requests and let your team track status from open to resolved.",
  },
  {
    icon: FileText,
    title: "Lease tracking",
    description:
      "Store lease documents, renewal dates, and terms so nothing falls through the cracks.",
  },
  {
    icon: BarChart3,
    title: "Reporting & analytics",
    description:
      "See occupancy, income, and portfolio performance at a glance with simple dashboards.",
  },
  {
    icon: Building2,
    title: "Multi-property support",
    description:
      "Manage a single building or a growing portfolio of properties from the same account.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="bg-muted/20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <Badge variant="secondary">Features</Badge>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
            Everything you need to run your rentals
          </h2>
          <p className="mt-4 text-muted-foreground">
            From onboarding a new tenant to closing the books each month,
            RentHaven keeps your whole portfolio organized.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <feature.icon className="size-5" />
                </span>
                <CardTitle className="mt-3">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
