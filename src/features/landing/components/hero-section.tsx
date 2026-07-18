import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  { label: "Occupied", value: "24/26" },
  { label: "Rent collected", value: "$18,400" },
  { label: "Open requests", value: "2" },
];

export function HeroSection() {
  return (
    <section id="hero" className="relative overflow-hidden py-20 sm:py-28">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />

      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
        <div>
          <Badge variant="secondary">For landlords & property managers</Badge>

          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Manage every property, tenant, and payment in one place.
          </h1>

          <p className="mt-6 text-lg text-muted-foreground">
            RentHaven brings rent collection, lease tracking, maintenance
            requests, and reporting together so you can run your rental
            business without the spreadsheets.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/register" className={buttonVariants({ size: "lg" })}>
              Get started free
            </Link>
            <Link
              href="#how-it-works"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              See how it works
            </Link>
          </div>

          <p className="mt-3 text-sm text-muted-foreground">
            No credit card required.
          </p>
        </div>

        <Card>
          <CardHeader className="flex-row items-center gap-2 border-b">
            <span className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-destructive/60" />
              <span className="size-2.5 rounded-full bg-chart-4/60" />
              <span className="size-2.5 rounded-full bg-chart-2/60" />
            </span>
            <CardTitle>Portfolio overview</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-3 gap-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-border bg-muted/40 p-3"
                >
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="mt-1 text-lg font-bold">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              <div className="h-3 w-full rounded-full bg-muted" />
              <div className="h-3 w-4/5 rounded-full bg-primary/20" />
              <div className="h-3 w-2/3 rounded-full bg-muted" />
              <div className="h-3 w-3/4 rounded-full bg-primary/20" />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
