"use client";

import { ReactNode } from "react";

import { DataTableSearch } from "./data-table-search";
import { DataTableView } from "./data-table-view";
import { ToolbarProps } from "./types";

interface DataTableToolbarProps<TData> extends ToolbarProps<TData> {
  actions?: ReactNode;
}

export function DataTableToolbar<TData>({
  table,
  actions,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <div className="flex flex-1 items-center gap-3">
        <DataTableSearch table={table} />
      </div>

      <div className="flex items-center gap-2">
        <DataTableView table={table} />

        {actions}
      </div>
    </div>
  );
}