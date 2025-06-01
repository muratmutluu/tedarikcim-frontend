"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { Customer } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { DataTablePriceBadge } from "@/components/data-table/data-table-price-badge";
import { DataTableRowAction } from "@/types/data-table";
import { DataTableRowActions } from "@/components/data-table/data-table-row-actions";
import Link from "next/link";
import Avvvatars from "avvvatars-react";

export function getCustomersTableColumns(
  setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<Customer> | null>>
): ColumnDef<Customer>[] {
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
      id: "name",
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Firma Adı" />,
      cell: ({ row }) => {
        const customer = row.original;
        return (
          <Link href={`/customers/${customer.id}`} className="flex items-center gap-2">
            <Avvvatars value={customer.name} style="character" size={30} />
            <span className="capitalize underline">{row.getValue("name")}</span>
          </Link>
        );
      },
      meta: {
        variant: "text",
        placeholder: "Firma adına göre ara...",
      },
    },
    {
      id: "balance",
      accessorKey: "balance",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Bakiye" />,
      cell: ({ row }) => <DataTablePriceBadge value={row.getValue("balance")} className="w-full" />,
    },
    {
      id: "address",
      accessorKey: "address",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Adres" />,
      cell: ({ row }) => (
        <div className="capitalize max-w-44 truncate">{row.getValue("address")}</div>
      ),
    },
    {
      id: "phone",
      accessorKey: "phone",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Telefon" />,
      cell: ({ row }) => <div>{row.getValue("phone")}</div>,
    },
    {
      id: "email",
      accessorKey: "email",
      header: ({ column }) => <DataTableColumnHeader column={column} title="E-posta" />,
      cell: ({ row }) => <div className="max-w-44 truncate">{row.getValue("email")}</div>,
    },
    {
      id: "updatedAt",
      accessorKey: "updatedAt",
      accessorFn: (row) => format(row.updatedAt, "dd.MM.yyyy"),
      header: ({ column }) => <DataTableColumnHeader column={column} title="Güncellenme Tarihi" />,
      cell: ({ row }) => <div className="max-w-44 truncate">{row.getValue("updatedAt")}</div>,
    },
    {
      id: "actions",
      cell: ({ row }) => <DataTableRowActions row={row} setRowAction={setRowAction} />,
      size: 40,
      enableHiding: false,
    },
  ];
}
