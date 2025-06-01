"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableRowActions } from "@/components/data-table/data-table-row-actions";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency } from "@/lib/utils";
import { InvoiceListItem } from "@/types";
import { DataTableRowAction } from "@/types/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";

export function getInvoicesTableColumns(
  setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<InvoiceListItem> | null>>
): ColumnDef<InvoiceListItem>[] {
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
      id: "invoiceNumber",
      accessorKey: "invoiceNumber",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Fatura Numarası" />,
      cell: ({ row }) => {
        return (
          <Link href={`/invoices/${row.original.id}`} className="flex items-center gap-1">
            <span className="capitalize underline">{row.getValue("invoiceNumber")}</span>
            <SquareArrowOutUpRight className="w-4 h-4" />
          </Link>
        );
      },
    },
    {
      id: "invoiceDate",
      accessorKey: "invoiceDate",
      accessorFn: (row) => format(row.invoiceDate, "dd.MM.yyyy"),
      header: ({ column }) => <DataTableColumnHeader column={column} title="Fatura Tarihi" />,
      cell: ({ row }) => {
        return <span className="capitalize">{row.getValue("invoiceDate")}</span>;
      },
    },
    {
      id: "description",
      accessorKey: "description",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Açıklama" />,
      cell: ({ row }) => {
        return <span className="capitalize">{row.getValue("description")}</span>;
      },
      meta: {
        variant: "text",
        placeholder: "Açıklamaya göre ara...",
      },
    },
    {
      id: "totalAmount",
      accessorKey: "totalAmount",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Toplam Tutar" />,
      cell: ({ row }) => {
        const value = row.getValue<number>("totalAmount");

        return (
          <div className="text-right">{formatCurrency(value, { showCurrencySymbol: true })}</div>
        );
      },
    },
    {
      id: "customerName",
      accessorFn: (row) => row.customer.name,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Müşteri" />,
      cell: ({ row }) => {
        return <span className="capitalize">{row.original.customer.name}</span>;
      },
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      accessorFn: (row) => format(row.createdAt, "dd.MM.yyyy HH:mm"),
      header: ({ column }) => <DataTableColumnHeader column={column} title="Oluşturulma Tarihi" />,
      cell: ({ row }) => {
        return <span className="capitalize">{row.getValue("createdAt")}</span>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => <DataTableRowActions row={row} setRowAction={setRowAction} />,
      size: 40,
      enableHiding: false,
    },
  ];
}
