import { Badge } from "@/components/ui/badge";

const steps = [
  {
    title: "Add your properties",
    description:
      "Create your properties and units in a few clicks - import later if you have a bigger portfolio.",
  },
  {
    title: "Invite your tenants",
    description:
      "Send tenants an invite so they can view their lease, make payments, and submit requests.",
  },
  {
    title: "Collect rent & manage leases",
    description:
      "Track payments, due dates, and renewals without chasing paperwork.",
  },
  {
    title: "Track everything in one dashboard",
    description:
      "See occupancy, income, and maintenance status across your whole portfolio at a glance.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <Badge variant="secondary">How it works</Badge>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
            Get started in minutes
          </h2>
          <p className="mt-4 text-muted-foreground">
            No complicated setup - start managing your properties the same
            day you sign up.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.title}>
              <span className="flex size-10 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground">
                {index + 1}
              </span>
              <h3 className="mt-4 font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
