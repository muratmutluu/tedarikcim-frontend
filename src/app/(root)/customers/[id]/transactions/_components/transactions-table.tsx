"use client";

import type { CustomerTransaction } from "@/types";
import type { DataTableRowAction } from "@/types/data-table";
import * as React from "react";
import { getTransactionsTableColumns } from "./transactions-table-columns";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-table/data-table";
import { DeleteTransactionDialog } from "./delete-transaction-dialog";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { Badge } from "@/components/ui/badge";
import {
  CreatePaymentTransactionSheet,
  CreateSaleTransactionSheet,
} from "./create-transaction-sheet";
import {
  UpdatePaymentTransactionSheet,
  UpdateSaleTransactionSheet,
} from "./update-transaction-sheet";

export function TransactionsTable({
  data,
  customerId,
}: {
  data: CustomerTransaction[];
  customerId: number;
}) {
  const [rowAction, setRowAction] = React.useState<DataTableRowAction<CustomerTransaction> | null>(
    null
  );

  const columns = React.useMemo(() => getTransactionsTableColumns(setRowAction), []);

  const { table } = useDataTable({
    data,
    columns,
  });

  return (
    <>
      <DataTable table={table}>
        <DataTableToolbar table={table}>
          <Badge className="bg-emerald-600/10 dark:bg-emerald-600/20 hover:bg-emerald-600/10 text-emerald-500 border-emerald-600/60 border-dashed shadow-none rounded-md h-8">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {data.length} kayıt bulundu.
          </Badge>
          <CreateSaleTransactionSheet customerId={customerId} />
          <CreatePaymentTransactionSheet customerId={customerId} />
        </DataTableToolbar>
      </DataTable>

      {rowAction?.variant === "update" &&
        (rowAction?.row.original?.transactionType === "SALE" ? (
          <UpdateSaleTransactionSheet
            open
            transaction={rowAction.row.original}
            onOpenChange={() => setRowAction(null)}
          />
        ) : rowAction?.row.original?.transactionType === "PAYMENT" ? (
          <UpdatePaymentTransactionSheet
            open
            transaction={rowAction.row.original}
            onOpenChange={() => setRowAction(null)}
          />
        ) : null)}

      {rowAction?.variant === "delete" && (
        <DeleteTransactionDialog
          open
          onOpenChange={() => setRowAction(null)}
          transaction={rowAction?.row.original ?? null}
          showTrigger={false}
          onSuccess={() => rowAction?.row.toggleSelected(false)}
        />
      )}
    </>
  );
}
