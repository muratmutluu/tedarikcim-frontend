import { Row, RowData } from "@tanstack/react-table";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    variant?: "text" | "number" | "date";
    placeholder?: string;
    icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  }
}

export interface DataTableRowAction<TData> {
  row: Row<TData>;
  variant: "update" | "delete";
}
