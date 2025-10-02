"use client";

import type { Column, Table } from "@tanstack/react-table";
import { Input } from "../ui/input";
import * as React from "react";
import { Button } from "../ui/button";
import { Sheet, X } from "lucide-react";
import { cn } from "@/lib/utils";
import debounce from "lodash.debounce";
import { exportTableToExcel } from "@/lib/export-xlsx";

interface DataTableToolbarProps<TData> extends React.ComponentProps<"div"> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
  children,
  className,
  ...props
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const columns = React.useMemo(
    () => table.getAllColumns().filter((column) => column.getCanFilter()),
    [table]
  );

  const onReset = React.useCallback(() => {
    React.startTransition(() => {
      table.resetColumnFilters();
    });
  }, [table]);
  return (
    <div
      role="toolbar"
      aria-orientation="horizontal"
      className={cn("flex w-full items-start justify-between gap-2 p-1", className)}
      {...props}
    >
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {columns.map((column) => (
          <DataTableToolbarFilter key={column.id} column={column} />
        ))}
        {isFiltered && (
          <Button
            aria-label="Reset filters"
            variant="outline"
            size="sm"
            className="border-dashed"
            onClick={onReset}
          >
            <X />
            Sıfırla
          </Button>
        )}
        <Button
          onClick={() =>
            exportTableToExcel(table, {
              filename: "my-data",
              excludeColumns: ["select", "actions"],
              onlySelected: false,
            })
          }
          className="bg-emerald-600 hover:bg-emerald-700 text-white h-8"
        >
          <Sheet /> Excel Aktar
        </Button>
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}

interface DataTableToolbarFilterProps<TData> {
  column: Column<TData>;
}

function DataTableToolbarFilter<TData>({ column }: DataTableToolbarFilterProps<TData>) {
  const columnMeta = column.columnDef.meta;

  const [inputValue, setInputValue] = React.useState((column.getFilterValue() as string) ?? "");

  const debouncedSetFilterValue = React.useMemo(
    () =>
      debounce((value: string) => {
        column.setFilterValue(value);
      }, 300),
    [column]
  );

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
      debouncedSetFilterValue(event.target.value);
    },
    [debouncedSetFilterValue]
  );

  React.useEffect(() => {
    setInputValue((column.getFilterValue() as string) ?? "");
  }, [column]);

  const onFilterRender = React.useCallback(() => {
    if (!columnMeta?.variant) return null;

    switch (columnMeta.variant) {
      case "text":
        return (
          <Input
            placeholder={columnMeta.placeholder}
            value={inputValue}
            onChange={handleChange}
            className="h-8 w-40 lg:w-96"
          />
        );

      default:
        return null;
    }
  }, [columnMeta, inputValue, handleChange]);

  return onFilterRender();
}
