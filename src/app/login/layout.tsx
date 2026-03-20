import { Metadata } from "next";

export const metadata: Metadata = {
  title: "RentHaven - Login",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <section>{children}</section>;
}
