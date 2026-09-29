"use client";

import { Input } from "@/components/ui/input";
import { ToolbarProps } from "./types";

export function DataTableSearch<TData>({
    table,
}: ToolbarProps<TData>) {
    return (
        <Input
            placeholder="Search..."
            value={
                (table
                    .getColumn("name")
                    ?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
                table
                    .getColumn("name")
                    ?.setFilterValue(event.target.value)
            }
            className="w-72"
        />
    );
}