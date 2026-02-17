import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  Location01Icon,
  Calendar03Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

export const Hero = () => {
  return (
    <section className="relative max-w-7xl mx-auto py-12 md:py-24 lg:py-32 bg-white">
      <div className="container px-4 md:px-4 mx-auto">
        <div className="grid gap-10 lg:grid-cols-2 items-center">
          {/* Left Side: Content */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-6xl/none text-slate-900">
                Find your <span className="text-blue-600">perfect home</span> to
                rent with ease.
              </h1>
              <p className="max-w-[600px] text-slate-500 md:text-xl">
                Discover the best rental properties in your favorite locations.
                From cozy apartments to spacious family houses.
              </p>
            </div>

            <div className="w-full max-w-2xl p-2 bg-white rounded-xl border shadow-lg flex flex-col md:flex-row gap-2">
              <div className="flex-1 flex items-center px-3 border-r border-slate-100">
                <HugeiconsIcon
                  icon={Location01Icon}
                  size={20}
                  className="text-slate-400 mr-2"
                />
                <Input
                  placeholder="Where are you going?"
                  className="border-none focus-visible:ring-0 placeholder:text-slate-400 p-0 h-auto"
                />
              </div>

              <div className="hidden md:flex flex-1 items-center px-3 border-r border-slate-100">
                <HugeiconsIcon
                  icon={Calendar03Icon}
                  size={20}
                  className="text-slate-400 mr-2"
                />
                <span className="text-sm text-slate-400">Add dates</span>
              </div>

              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 h-12">
                <HugeiconsIcon icon={Search01Icon} size={20} className="mr-2" />
                Search
              </Button>
            </div>

            <div className="flex items-center gap-4 text-sm text-slate-500">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white bg-slate-200"
                  />
                ))}
              </div>
              <p>Trusted by 10k+ happy tenants</p>
            </div>
          </div>

          <div className="relative h-[400px] lg:h-[550px] rounded-2xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
              alt="Modern Rental House"
              className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
