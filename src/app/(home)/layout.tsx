import { Footer } from "@/features/home/components/Footer";
import { Navbar } from "@/features/home/components/Navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar type="public" />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
