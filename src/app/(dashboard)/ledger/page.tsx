import type { Metadata } from "next";

import { LedgerList } from "@/features/ledger/components/ledger-list";

export const metadata: Metadata = {
  title: "Ledger",
};

export default function LedgerPage() {
  return <LedgerList />;
}
