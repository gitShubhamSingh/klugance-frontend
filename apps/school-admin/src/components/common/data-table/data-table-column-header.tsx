"use client";

import { Column } from "@tanstack/react-table";
import {
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
} from "lucide-react";

type DataTableColumnHeaderProps<TData, TValue> = {
  column: Column<TData, TValue>;
  title: string;
};

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const sorted = column.getIsSorted();

  return (
    <button
      type="button"
      onClick={() =>
        column.toggleSorting(sorted === "asc")
      }
      className="
        flex
        items-center
        gap-2
        font-semibold
        text-sm
        transition-colors
        hover:text-primary
      "
    >
      <span>{title}</span>

      {sorted === "asc" && (
        <ArrowUp className="h-4 w-4" />
      )}

      {sorted === "desc" && (
        <ArrowDown className="h-4 w-4" />
      )}

      {!sorted && (
        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
      )}
    </button>
  );
}