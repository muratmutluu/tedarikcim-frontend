import type { Table } from "@tanstack/react-table";
import * as XLSX from "xlsx";

export function exportTableToExcel<TData>(
  table: Table<TData>,
  opts: {
    filename?: string;
    excludeColumns?: (keyof TData | "select" | "actions")[];
    onlySelected?: boolean;
  } = {}
): void {
  const { filename = "table", excludeColumns = [], onlySelected = false } = opts;

  const headers = table
    .getAllLeafColumns()
    .map((column) => column.id)
    .filter((id) => !excludeColumns.includes(id as keyof TData | "select" | "actions"));

  const rows = (
    onlySelected ? table.getFilteredSelectedRowModel().rows : table.getRowModel().rows
  ).map((row) =>
    headers.reduce((acc, header) => {
      acc[header] = row.getValue(header);
      return acc;
    }, {} as Record<string, unknown>)
  );

  // Excel sheet oluştur
  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Workbook oluştur
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Excel dosyasını indir
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}
