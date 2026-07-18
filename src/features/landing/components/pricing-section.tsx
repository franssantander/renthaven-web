import Link from "next/link";
import { Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils/utils";

const tiers = [
  {
    name: "Starter",
    price: "$19",
    description: "For landlords just getting started",
    features: ["Up to 5 units", "Tenant portal", "Rent collection", "Email support"],
    highlighted: false,
  },
  {
    name: "Growth",
    price: "$49",
    description: "For growing property managers",
    features: [
      "Up to 50 units",
      "Everything in Starter",
      "Maintenance tracking",
      "Reporting & analytics",
      "Priority support",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large portfolios and teams",
    features: [
      "Unlimited units",
      "Everything in Growth",
      "Staff roles & permissions",
      "Dedicated onboarding",
      "Custom integrations",
    ],
    highlighted: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="bg-muted/20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <Badge variant="secondary">Pricing</Badge>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
            Simple pricing that grows with your portfolio
          </h2>
          <p className="mt-4 text-muted-foreground">
            Start free, upgrade as you add more units. No hidden fees.
          </p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-3">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              className={cn(tier.highlighted && "border-primary shadow-md")}
            >
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle>{tier.name}</CardTitle>
                  {tier.highlighted && <Badge>Most popular</Badge>}
                </div>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {tier.price}
                  {tier.price !== "Custom" && (
                    <span className="text-sm font-normal text-muted-foreground">
                      /mo
                    </span>
                  )}
                </p>
                <ul className="mt-6 space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="size-4 shrink-0 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Link
                  href="/register"
                  className={buttonVariants({
                    variant: tier.highlighted ? "default" : "outline",
                    className: "w-full",
                  })}
                >
                  Get started
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
