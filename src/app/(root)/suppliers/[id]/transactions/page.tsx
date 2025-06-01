"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { getSupplierAllTransactions } from "@/lib/api";
import { useParams } from "next/navigation";
import { TransactionsTable } from "./_components/transactions-table";
import { NotebookTabs } from "lucide-react";

export default function SupplierTransactionsPage() {
  const params = useParams();
  const supplierId = Number(params.id);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["supplier-transactions", supplierId],
    queryFn: () => getSupplierAllTransactions(supplierId),
  });

  if (isLoading) {
    return <DataTableSkeleton columnCount={7} />;
  }
  if (isError || !data) {
    return <div>Error loading transactions</div>;
  }

  return (
    <>
      <div className="flex items-center gap-2 px-2">
        <NotebookTabs />
        <h1 className="text-2xl font-bold">Tedarikçi Haraketleri</h1>
      </div>
      <TransactionsTable data={data} supplierId={supplierId} />
    </>
  );
}
