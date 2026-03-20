import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Renthaven - Super Admin",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <section>{children}</section>;
}
