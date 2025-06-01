"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableRowActions } from "@/components/data-table/data-table-row-actions";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn, formatCurrency } from "@/lib/utils";
import type { SupplierTransaction } from "@/types";
import type { DataTableRowAction } from "@/types/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export function getTransactionsTableColumns(
  setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<SupplierTransaction> | null>>
): ColumnDef<SupplierTransaction>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-0.5"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "transactionDate",
      accessorKey: "transactionDate",
      accessorFn: (row) => format(row.transactionDate, "dd.MM.yyyy"),
      header: ({ column }) => <DataTableColumnHeader column={column} title="Tarih" />,
      cell: ({ row }) => <div className="capitalize">{row.getValue("transactionDate")}</div>,
      enableSorting: false,
      enableHiding: false,
    },

    {
      id: "transactionType",
      accessorKey: "transactionType",
      header: ({ column }) => <DataTableColumnHeader column={column} title="İşlem Türü" />,
      cell: ({ row }) => {
        const value = row.getValue<string>("transactionType");

        const isPayment = value === "PAYMENT";
        const label = isPayment ? "Ödeme" : "Satın Alım";

        return (
          <Badge
            className={cn(
              "hover:bg-opacity-10 shadow-none rounded-md border-dashed h-6 gap-2 items-center justify-start inline-flex w-22",
              isPayment
                ? "bg-emerald-600/10 dark:bg-emerald-600/20 text-emerald-500 border-emerald-600/60"
                : "bg-yellow-400/10 dark:bg-yellow-400/20 text-yellow-500 border-yellow-500/60"
            )}
          >
            <div
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                isPayment ? "bg-emerald-500" : "bg-yellow-500"
              )}
            />
            {label}
          </Badge>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "description",
      accessorKey: "description",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Açıklama" />,
      cell: ({ row }) => <div className="capitalize">{row.getValue("description")}</div>,
      enableSorting: false,
      enableHiding: false,
      meta: {
        variant: "text",
        placeholder: "Açıklamaya göre ara...",
      },
    },
    {
      id: "quantity",
      accessorKey: "quantity",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Miktar" />,
      cell: ({ row }) => {
        const value = row.getValue<number>("quantity");

        return <div className="text-right">{formatCurrency(value)}</div>;
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "quantityUnit",
      accessorKey: "quantityUnit",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Birim" />,
      cell: ({ row }) => <div className="capitalize">{row.getValue("quantityUnit")}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "unitPrice",
      accessorKey: "unitPrice",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Fiyat" />,
      cell: ({ row }) => {
        const value = row.getValue<number>("unitPrice");

        return <div className="text-right">{formatCurrency(value)}</div>;
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "totalAmount",
      accessorKey: "totalAmount",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Toplam" />,
      cell: ({ row }) => {
        const value = row.getValue<number>("totalAmount");

        return <div className="text-right">{formatCurrency(value)}</div>;
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "paidAmount",
      accessorKey: "paidAmount",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Ödendi" />,
      cell: ({ row }) => {
        const value = row.getValue<number>("paidAmount");
        return <div className="text-right">{formatCurrency(value)}</div>;
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "afterBalance",
      accessorKey: "afterBalance",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Bakiye" />,
      cell: ({ row }) => {
        const value = row.getValue<number>("afterBalance");
        return (
          <div className={cn("text-right", value < 0 ? "text-red-600" : "text-foreground")}>
            {formatCurrency(value)}
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "actions",
      cell: ({ row }) => <DataTableRowActions row={row} setRowAction={setRowAction} />,
      size: 40,
      enableHiding: false,
    },
  ];
}
