"use client";

import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

type Props<TData> = {
  table: Table<TData>;
};

export function DataTablePagination<TData>({
  table,
}: Props<TData>) {
  return (
    <div className="mt-4 flex items-center justify-end gap-2">

      <Button
        variant="outline"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        Previous
      </Button>

      <Button
        variant="outline"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        Next
      </Button>

    </div>
  );
}