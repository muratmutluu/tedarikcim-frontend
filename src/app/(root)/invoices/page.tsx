"use client";

import * as React from "react";
import { getAllInvoices } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { InvoicesTable } from "./_components/invoices-table";
import { FileText } from "lucide-react";

export default function InvoicePage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["invoices"],
    queryFn: getAllInvoices,
  });

  if (isLoading) {
    return <DataTableSkeleton columnCount={7} />;
  }
  if (isError || !data) {
    return <div>Error loading customers</div>;
  }

  return (
    <section className="flex flex-1 flex-col gap-4 p-2">
      <div className="flex items-center gap-2 px-2">
        <FileText />
        <h1 className="text-2xl font-bold">Faturalar</h1>
      </div>
      <InvoicesTable data={data} />
    </section>
  );
}
