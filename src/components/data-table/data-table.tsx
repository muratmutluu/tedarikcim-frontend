import { cn } from "@/lib/utils";
import { type Table as TanstackTable, flexRender } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import React from "react";

interface DataTableProps<TData> extends React.ComponentProps<"div"> {
  table: TanstackTable<TData>;
}
export function DataTable<TData>({ table, children, className, ...props }: DataTableProps<TData>) {
  return (
    <div className={cn("flex flex-col gap-2 w-full mx-auto", className)} {...props}>
      {children}
      <div className="flex max-h-[calc(100vh-200px)] [&>div]:border [&>div]:rounded-md overflow-auto">
        <Table className="border-separate border-spacing-0 [&_th]:border-b [&_tr:not(:last-child)_td]:border-b [&_tr>:not(:last-child)]:border-r">
          <TableHeader className="sticky top-0 backdrop-blur-lg z-10 h-12">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className="[&:has([role=checkbox])]:max-w-12 [&:has([role=checkbox])]:min-w-12 [&:has([role=checkbox])]:w-12"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="odd:bg-muted data-[state=selected]:bg-chart-3/10 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="[&:has([data-slot=dropdown-menu-trigger])]:max-w-12 [&:has([data-slot=dropdown-menu-trigger])]:min-w-12 [&:has([data-slot=dropdown-menu-trigger])]:w-12"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={table.getAllColumns().length} className="h-10 text-center">
                  Sonuç bulunamadı. ☹️
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
