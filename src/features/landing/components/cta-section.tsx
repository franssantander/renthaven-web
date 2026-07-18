import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-primary px-6 py-12 text-center text-primary-foreground sm:px-12 sm:py-16">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Ready to simplify your rental management?
          </h2>
          <p className="mt-4 text-primary-foreground/80">
            Join landlords and property managers who manage their portfolios
            with RentHaven.
          </p>
          <Link
            href="/register"
            className={buttonVariants({ variant: "secondary", size: "lg", className: "mt-8" })}
          >
            Get started free
          </Link>
        </div>
      </div>
    </section>
  );
}
