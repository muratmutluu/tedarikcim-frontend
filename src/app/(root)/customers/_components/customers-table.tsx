"use client";

import * as React from "react";
import type { Customer } from "@/types";
import type { DataTableRowAction } from "@/types/data-table";
import { getCustomersTableColumns } from "./customers-table-columns";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { CreateCustomerSheet } from "./create-customer-sheet";
import { DeleteCustomerDialog } from "./delete-customer-dialog";
import { UpdateCustomerSheet } from "./update-customer-sheet";
import { Badge } from "@/components/ui/badge";

export function CustomersTable({ data }: { data: Customer[] }) {
  const [rowAction, setRowAction] = React.useState<DataTableRowAction<Customer> | null>(null);

  const columns = React.useMemo(() => getCustomersTableColumns(setRowAction), []);

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
          <CreateCustomerSheet />
        </DataTableToolbar>
      </DataTable>
      {rowAction?.variant === "update" && (
        <UpdateCustomerSheet
          open
          customer={rowAction?.row.original ?? null}
          onOpenChange={() => setRowAction(null)}
        />
      )}
      {rowAction?.variant === "delete" && (
        <DeleteCustomerDialog
          open
          onOpenChange={() => setRowAction(null)}
          customer={rowAction?.row.original ?? null}
          showTrigger={false}
          onSuccess={() => rowAction?.row.toggleSelected(false)}
        />
      )}
    </>
  );
}
