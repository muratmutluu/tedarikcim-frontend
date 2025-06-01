"use client";

import { useSuppliersWithBalance } from "@/hooks/suppliers/use-suppliers-with-balance";
import * as React from "react";
import { SuppliersTable } from "./_components/suppliers-table";
import { Factory } from "lucide-react";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";

export default function SuppliersPage() {
  const { data, isLoading, isError } = useSuppliersWithBalance();

  if (isLoading) {
    return <DataTableSkeleton columnCount={7} />;
  }
  if (isError || !data) {
    return <div>Error loading suppliers</div>;
  }

  return (
    <>
      <div className="flex items-center gap-2 px-2">
        <Factory />
        <h1 className="text-2xl font-bold">Tedarikçiler</h1>
      </div>
      <SuppliersTable data={data} />
    </>
  );
}
