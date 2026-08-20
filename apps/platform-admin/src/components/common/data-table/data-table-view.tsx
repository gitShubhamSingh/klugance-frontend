"use client";

import { Table } from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

type Props<TData> = {
  table: Table<TData>;
};

export function DataTableView<TData>({
  table,
}: Props<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="
            inline-flex
            h-9
            items-center
            justify-center
            rounded-md
            border
            border-input
            bg-background
            px-4
            text-sm
            font-medium
            shadow-sm
            transition-colors
            hover:bg-accent
            hover:text-accent-foreground
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-ring
            disabled:pointer-events-none
            disabled:opacity-50
        "
        >
        Columns
        </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              checked={column.getIsVisible()}
              onCheckedChange={(value) =>
                column.toggleVisibility(!!value)
              }
            >
              {column.columnDef.header instanceof Function
                ? column.id
                : String(column.columnDef.header ?? column.id)}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}