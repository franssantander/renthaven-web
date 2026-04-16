import Link from "next/link";
import { Button } from "@/shared/components/ui/button";

export const Navbar = ({
  type = "public",
}: {
  type?: "public" | "admin" | "tenant";
}) => {
  return (
    <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-2xl text-blue-600">
          RentHaven
        </Link>

        <div className="flex items-center gap-6">
          {type === "public" && (
            <>
              <Link href="/browse">Browse Houses</Link>
              <Link href="/pricing">Pricing</Link>
              <Link href="/login">
                <Button>Sign In</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
