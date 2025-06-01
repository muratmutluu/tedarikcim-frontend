"use client";

import * as React from "react";
import { CustomersTable } from "./_components/customers-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Users } from "lucide-react";
import { useCustomersWithBalance } from "@/hooks/customers/use-customers-with-balance";

export default function CustomersPage() {
  const { data, isLoading, isError } = useCustomersWithBalance();

  if (isLoading) {
    return <DataTableSkeleton columnCount={7} />;
  }
  if (isError || !data) {
    return <div>Error loading customers</div>;
  }

  return (
    <>
      <div className="flex items-center gap-2 px-2">
        <Users />
        <h1 className="text-2xl font-bold">Müşteriler</h1>
      </div>
      <CustomersTable data={data} />
    </>
  );
}
