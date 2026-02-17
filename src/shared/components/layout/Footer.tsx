import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Facebook02Icon,
  Home12Icon,
  InstagramIcon,
  NewTwitterIcon,
} from "@hugeicons/core-free-icons";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-slate-50/50">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-2xl text-blue-600"
            >
              <HugeiconsIcon
                icon={Home12Icon}
                size={24}
                color="currentColor"
                strokeWidth={1.5}
              />
              <span>RentHaven</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Simplifying the rental journey for tenants and property managers.
              Find your next home with ease and security.
            </p>
            <div className="mt-6 flex gap-4">
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary"
              >
                <HugeiconsIcon
                  icon={Facebook02Icon}
                  size={24}
                  color="currentColor"
                  strokeWidth={1.5}
                />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary"
              >
                <HugeiconsIcon
                  icon={InstagramIcon}
                  size={24}
                  color="currentColor"
                  strokeWidth={1.5}
                />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary"
              >
                <HugeiconsIcon
                  icon={NewTwitterIcon}
                  size={24}
                  color="currentColor"
                  strokeWidth={1.5}
                />
              </Link>
            </div>
          </div>

          {/* Navigation Columns */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Explore
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/browse" className="hover:text-primary">
                  All Properties
                </Link>
              </li>
              <li>
                <Link href="/apartments" className="hover:text-primary">
                  Apartments
                </Link>
              </li>
              <li>
                <Link href="/houses" className="hover:text-primary">
                  Family Houses
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Host
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/register" className="hover:text-primary">
                  List your property
                </Link>
              </li>
              <li>
                <Link href="/hosting-resources" className="hover:text-primary">
                  Resource Center
                </Link>
              </li>
              <li>
                <Link href="/insurance" className="hover:text-primary">
                  Protection Plan
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Support
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/help" className="hover:text-primary">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/safety" className="hover:text-primary">
                  Safety Info
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} RentHaven Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
