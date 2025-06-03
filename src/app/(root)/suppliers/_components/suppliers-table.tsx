"use client";

import * as React from "react";
import type { Supplier } from "@/types";
import type { DataTableRowAction } from "@/types/data-table";
import { getSuppliersTableColumns } from "./suppliers-table-columns";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { Badge } from "@/components/ui/badge";
import { CreateSupplierSheet } from "./create-supplier-sheet";
import { UpdateSupplierSheet } from "./update-supplier-sheet";
import { DeleteSupplierDialog } from "./delete-supplier-dialog";
import { Separator } from "@/components/ui/separator";

export function SuppliersTable({ data }: { data: Supplier[] }) {
  const [rowAction, setRowAction] = React.useState<DataTableRowAction<Supplier> | null>(null);

  const columns = React.useMemo(() => getSuppliersTableColumns(setRowAction), []);

  const { table } = useDataTable({
    data,
    columns,
  });

  return (
    <>
      <DataTable table={table}>
        <DataTableToolbar table={table}>
          <Badge className="border-dashed h-8 bg-accent" variant="outline">
            <div className="h-3.5 w-3.5 rounded-sm bg-emerald-600" />
            Borçlu Tedarikçiler
            <Separator
              className="mx-2 h-4 w-px bg-gray-200 dark:bg-gray-700"
              orientation="vertical"
            />
            <div className="h-3.5 w-3.5 rounded-sm bg-red-600" />
            Alacaklı Tedarikçiler
          </Badge>
          <Badge className="bg-emerald-600/10 dark:bg-emerald-600/20 hover:bg-emerald-600/10 text-emerald-500 border-emerald-600/60 border-dashed shadow-none rounded-md h-8">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {data.length} kayıt bulundu.
          </Badge>
          <CreateSupplierSheet />
        </DataTableToolbar>
        {rowAction?.variant === "update" && (
          <UpdateSupplierSheet
            open
            supplier={rowAction?.row.original ?? null}
            onOpenChange={() => setRowAction(null)}
          />
        )}
        {rowAction?.variant === "delete" && (
          <DeleteSupplierDialog
            open
            onOpenChange={() => setRowAction(null)}
            supplier={rowAction?.row.original ?? null}
            showTrigger={false}
            onSuccess={() => rowAction?.row.toggleSelected(false)}
          />
        )}
      </DataTable>
    </>
  );
}
