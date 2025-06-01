"use client";
import { Row } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Ellipsis, SquarePen, Trash2 } from "lucide-react";
import type { DataTableRowAction } from "@/types/data-table";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<TData> | null>>;
}
export function DataTableRowActions<TData>({ row, setRowAction }: DataTableRowActionsProps<TData>) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Open menu"
          variant="ghost"
          className="flex size-8 p-0 data-[state=open]:bg-muted"
        >
          <Ellipsis className="size-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onSelect={() => setRowAction({ row, variant: "update" })}>
          Düzenle
          <DropdownMenuShortcut>
            <SquarePen className="size-4" aria-hidden="true" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => setRowAction({ row, variant: "delete" })}>
          Sil
          <DropdownMenuShortcut>
            <Trash2 className="size-4" aria-hidden="true" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
