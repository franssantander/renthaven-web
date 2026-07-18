import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "RentHaven - Rental Property Management Software",
    template: "%s | RentHaven",
  },
  description:
    "RentHaven helps landlords and property managers collect rent, manage tenants, track leases, and handle maintenance requests - all from one simple dashboard.",
  openGraph: {
    title: "RentHaven - Rental Property Management Software",
    description:
      "Collect rent, manage tenants, and track leases in one simple dashboard built for landlords and property managers.",
    type: "website",
    locale: "en_US",
    siteName: "RentHaven",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
